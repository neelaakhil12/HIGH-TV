import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const deleted = await prisma.article.findMany({
      where: { isDeleted: true },
      select: {
        id: true,
        slug: true,
      },
    });

    const deletedIds = deleted.map(a => a.id);
    const deletedSlugs = deleted.map(a => a.slug);

    return new NextResponse(JSON.stringify({ deletedIds, deletedSlugs }), {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, max-age=0, must-revalidate',
        'Content-Type': 'application/json',
      },
    });
  } catch (error: any) {
    console.error('GET /api/deleted-articles error:', error);
    return new NextResponse(JSON.stringify({ 
      error: 'Failed to fetch deleted articles',
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
