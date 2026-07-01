import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET — list all E-Paper sections (auto-populates defaults if table is empty)
export async function GET() {
  try {
    // Self-healing database migration: update existing sections with old names to English-only
    await prisma.epaperSection.updateMany({
      where: { name: 'Main Editions (ప్రధాన సంచికలు)' },
      data: { name: 'Main Editions' }
    });
    await prisma.epaperSection.updateMany({
      where: { name: 'Telangana Districts (తెలంగాణ జిల్లాలు)' },
      data: { name: 'Telangana Districts' }
    });
    await prisma.epaperSection.updateMany({
      where: { name: 'Andhra Pradesh Districts (ఆంధ్రప్రదేశ్ జిల్లాలు)' },
      data: { name: 'Andhra Pradesh Districts' }
    });

    let sections = await prisma.epaperSection.findMany({
      orderBy: { createdAt: 'asc' }
    });

    if (sections.length === 0) {
      // Auto-populate starting default categories/sections
      const defaults = [
        { name: 'Main Editions', key: 'main' },
        { name: 'Telangana Districts', key: 'telangana' },
        { name: 'Andhra Pradesh Districts', key: 'ap' }
      ];

      for (const item of defaults) {
        await prisma.epaperSection.create({
          data: { name: item.name, key: item.key }
        });
      }

      sections = await prisma.epaperSection.findMany({
        orderBy: { createdAt: 'asc' }
      });
    }

    return NextResponse.json(sections);
  } catch (error) {
    console.error('Failed to fetch E-Paper sections:', error);
    return NextResponse.json({ error: 'Failed to fetch E-Paper sections' }, { status: 500 });
  }
}

// POST — add a new E-Paper section
export async function POST(req: NextRequest) {
  try {
    const { name, key } = await req.json();
    if (!name || !key) {
      return NextResponse.json({ error: 'Name and Key are required fields!' }, { status: 400 });
    }

    const normalizedKey = key.trim().toLowerCase().replace(/\s+/g, '-');
    const section = await prisma.epaperSection.create({
      data: {
        name: name.trim(),
        key: normalizedKey
      }
    });

    return NextResponse.json(section, { status: 201 });
  } catch (error) {
    console.error('Failed to create E-Paper section:', error);
    return NextResponse.json({ error: 'Failed to create E-Paper section' }, { status: 500 });
  }
}

// DELETE — delete E-Paper section by id
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id') || '';
    if (!id) {
      return NextResponse.json({ error: 'Section ID is required for deletion!' }, { status: 400 });
    }

    await prisma.epaperSection.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete E-Paper section:', error);
    return NextResponse.json({ error: 'Failed to delete E-Paper section' }, { status: 500 });
  }
}
