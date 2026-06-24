import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all banner slides
export async function GET() {
  try {
    const slides = await prisma.bannerSlide.findMany({ orderBy: { sortOrder: 'asc' } });
    return NextResponse.json(slides);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch slides' }, { status: 500 });
  }
}

// PUT — replace all slides at once
export async function PUT(req: NextRequest) {
  try {
    const slides: { title: string; image: string; link?: string }[] = await req.json();
    await prisma.bannerSlide.deleteMany();
    if (slides.length > 0) {
      await prisma.bannerSlide.createMany({
        data: slides.map((slide, idx) => ({
          title: slide.title,
          image: slide.image,
          link: slide.link || null,
          sortOrder: idx,
        })),
      });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update slides' }, { status: 500 });
  }
}
