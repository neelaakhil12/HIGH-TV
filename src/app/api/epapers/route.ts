import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET — list all epapers (supports ?date=YYYY-MM-DD)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date');
    const where = date ? { date } : {};
    const epapers = await prisma.epaper.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(epapers);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch epapers' }, { status: 500 });
  }
}

// POST — publish a new epaper
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const epaper = await prisma.epaper.create({ data });
    return NextResponse.json(epaper, { status: 201 });
  } catch (error) {
    console.error('API EPAPER POST ERROR:', error);
    return NextResponse.json({ error: 'Failed to create epaper' }, { status: 500 });
  }
}

// DELETE — remove epaper by id (?id=xxx)
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id') || '';
    await prisma.epaper.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete epaper' }, { status: 500 });
  }
}
