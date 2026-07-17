import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { resolveArticleImage } from '@/lib/saveBase64Image';

export const dynamic = 'force-dynamic';

// GET all articles (with optional category filter)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '100');
    const excludeBody = searchParams.get('excludeBody') === 'true';
    const showUnapproved = searchParams.get('showUnapproved') === 'true';

    const where: any = { isDeleted: false };
    if (!showUnapproved) {
      where.isApproved = true;
    }

    const tag = searchParams.get('tag');

    if (category === 'latest') {
      const pinsSetting = await prisma.setting.findUnique({
        where: { key: 'sidebar_category_pins' }
      });
      let pinnedBreakingIds: string[] = [];
      if (pinsSetting?.value) {
        try {
          const parsed = JSON.parse(pinsSetting.value);
          Object.values(parsed).forEach((catPins: any) => {
            if (catPins && Array.isArray(catPins.breaking)) {
              catPins.breaking.forEach((id: any) => pinnedBreakingIds.push(String(id)));
            }
          });
        } catch (e) {
          console.error(e);
        }
      }
      where.OR = [
        { isBreaking: true },
        { id: { in: pinnedBreakingIds } }
      ];
    }
    else if (category === 'trending') where.isTrending = true;
    else if (category === 'featured') where.isFeatured = true;
    else if (category && category !== 'all') {
      if (category.endsWith('*')) {
        where.categorySlug = { startsWith: category.slice(0, -1) };
      } else {
        where.categorySlug = category;
      }
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
      ];
    }

    if (tag) {
      where.tags = {
        some: { name: tag }
      };
    }

    const selectFields: any = {
      id: true,
      title: true,
      slug: true,
      categorySlug: true,
      districtSlug: true,
      category: true,
      author: true,
      publishedAt: true,
      updatedAt: true,
      description: true,
      metaDescription: true,
      image: true,
      imageCaption: true,
      tags: {
        select: {
          name: true,
          linkedArticleSlug: true
        }
      },
      views: true,
      isBreaking: true,
      isTrending: true,
      isFeatured: true,
      isApproved: true,
      createdBy: true,
      updatedBy: true,
      createdAt: true,
    };

    if (!excludeBody) {
      selectFields.body = true;
    }

    const articles = await prisma.article.findMany({
      where,
      orderBy: { publishedAt: 'desc' },
      take: limit,
      select: selectFields,
    });

    return new NextResponse(JSON.stringify(articles), {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, max-age=0, must-revalidate',
        'Content-Type': 'application/json',
      },
    });
  } catch (error: any) {
    console.error('GET /api/articles error:', error);
    return new NextResponse(JSON.stringify({ 
      error: 'Failed to fetch articles',
      details: error?.message || String(error)
    }), {
      status: 500,
      headers: {
        'Cache-Control': 'no-store, max-age=0, must-revalidate',
        'Content-Type': 'application/json',
      },
    });
  }
}

function sanitizeField(value: string | null | undefined): string | null | undefined {
  if (!value) return value;
  if (value.includes('<!-- TELUGU_SPLIT -->')) {
    return value
      .split('<!-- TELUGU_SPLIT -->')
      .map(part => part.replace(/<[^>]*>/g, '').trim())
      .join('<!-- TELUGU_SPLIT -->');
  }
  return value.replace(/<[^>]*>/g, '').trim();
}

// POST — create a new article
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    
    // Sanitize text inputs from copy-paste HTML tags
    if (data.title) data.title = sanitizeField(data.title);
    if (data.description) data.description = sanitizeField(data.description);
    if (data.metaDescription) data.metaDescription = sanitizeField(data.metaDescription);
    if (data.author) data.author = sanitizeField(data.author);

    // Convert base64 image to a real file URL so social crawlers can fetch it
    if (data.image) {
      data.image = await resolveArticleImage(data.image, data.slug) ?? data.image;
    }
    const tagsInput: (string | { name: string, linkedArticleSlug?: string | null })[] = data.tags || [];
    delete data.tags;

    const tagConnects: { id: string }[] = [];
    for (const t of tagsInput) {
      const name = typeof t === 'string' ? t : t.name;
      const linkedArticleSlug = typeof t === 'string' ? null : (t.linkedArticleSlug || null);
      
      const tag = await prisma.tag.upsert({
        where: { name },
        update: {
          ...(typeof t !== 'string' ? { linkedArticleSlug } : {})
        },
        create: {
          name,
          linkedArticleSlug
        }
      });
      tagConnects.push({ id: tag.id });
    }

    const article = await prisma.article.create({
      data: {
        ...data,
        tags: {
          connect: tagConnects
        }
      },
      include: {
        tags: {
          select: { name: true, linkedArticleSlug: true }
        }
      }
    });
    return NextResponse.json(article, { status: 201 });
  } catch (error: any) {
    console.error('POST /api/articles error:', error);
    if (error.code === 'P2002') {
      const target = error.meta?.target || 'slug';
      return NextResponse.json({ 
        error: `An article with this ${target} already exists. Please choose a unique ${target}.`,
        code: 'P2002'
      }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create article', details: error?.message || String(error) }, { status: 500 });
  }
}
