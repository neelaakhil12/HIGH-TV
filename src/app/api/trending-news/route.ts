import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all trending news ticker items
export async function GET() {
  try {
    const items = await prisma.trendingNews.findMany({ orderBy: { sortOrder: 'asc' } });
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch trending news' }, { status: 500 });
  }
}

// POST — add a single trending news item
export async function POST(req: NextRequest) {
  try {
    const { text, link } = await req.json();
    const count = await prisma.trendingNews.count();
    const item = await prisma.trendingNews.create({ data: { text, link, sortOrder: count } });
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add trending item' }, { status: 500 });
  }
}

// PUT — replace all items at once
export async function PUT(req: NextRequest) {
  try {
    const items: { text: string; link: string }[] = await req.json();
    await prisma.trendingNews.deleteMany();
    if (items.length > 0) {
      await prisma.trendingNews.createMany({
        data: items.map((item, idx) => ({ text: item.text, link: item.link, sortOrder: idx })),
      });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update trending news' }, { status: 500 });
  }
}

// DELETE a single item by id (query param ?id=123)
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = parseInt(searchParams.get('id') || '0');
    await prisma.trendingNews.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 });
  }
}
