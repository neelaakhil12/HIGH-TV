import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET all articles (with optional category filter)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '100');
    const excludeBody = searchParams.get('excludeBody') === 'true';

    const where: any = { isDeleted: false };

    if (category === 'latest') where.isBreaking = true;
    else if (category === 'trending') where.isTrending = true;
    else if (category === 'featured') where.isFeatured = true;
    else if (category && category !== 'all') where.categorySlug = category;

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
      ];
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
      description: true,
      image: true,
      views: true,
      isBreaking: true,
      isTrending: true,
      isFeatured: true,
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

// POST — create a new article
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const article = await prisma.article.create({ data });
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
