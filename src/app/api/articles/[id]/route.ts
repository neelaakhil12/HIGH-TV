import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { resolveArticleImage } from '@/lib/saveBase64Image';

export const dynamic = 'force-dynamic';

// GET single article by ID
export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const article = await prisma.article.findUnique({ where: { id } });
    if (!article) {
      return new NextResponse(JSON.stringify({ error: 'Not found' }), {
        status: 404,
        headers: {
          'Cache-Control': 'no-store, max-age=0, must-revalidate',
          'Content-Type': 'application/json',
        },
      });
    }
    return new NextResponse(JSON.stringify(article), {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, max-age=0, must-revalidate',
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: 'Failed to fetch article' }), {
      status: 500,
      headers: {
        'Cache-Control': 'no-store, max-age=0, must-revalidate',
        'Content-Type': 'application/json',
      },
    });
  }
}

// PUT — update article fields (title, body, flags, etc.)
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await req.json();
    // Remove fields that shouldn't be directly updated
    delete data.id;
    delete data.createdAt;
    // Convert base64 image to real file URL so social crawlers can fetch it
    if (data.image) {
      data.image = await resolveArticleImage(data.image, data.slug) ?? data.image;
    }
    const article = await prisma.article.update({ where: { id }, data });
    return new NextResponse(JSON.stringify(article), {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, max-age=0, must-revalidate',
        'Content-Type': 'application/json',
      },
    });
  } catch (error: any) {
    console.error('PUT /api/articles/[id] error:', error);
    if (error.code === 'P2002') {
      const target = error.meta?.target || 'slug';
      return new NextResponse(JSON.stringify({ 
        error: `An article with this ${target} already exists. Please choose a unique ${target}.`,
        code: 'P2002'
      }), {
        status: 400,
        headers: {
          'Cache-Control': 'no-store, max-age=0, must-revalidate',
          'Content-Type': 'application/json',
        },
      });
    }
    return new NextResponse(JSON.stringify({ 
      error: 'Failed to update article',
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

// DELETE — soft delete (keeps data but hides it)
export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.article.update({ where: { id }, data: { isDeleted: true } });
    return new NextResponse(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, max-age=0, must-revalidate',
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: 'Failed to delete article' }), {
      status: 500,
      headers: {
        'Cache-Control': 'no-store, max-age=0, must-revalidate',
        'Content-Type': 'application/json',
      },
    });
  }
}
