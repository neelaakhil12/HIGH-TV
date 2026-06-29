import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET settings by key(s)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const keyParam = searchParams.get('key') || searchParams.get('keys');
    
    let settings;
    if (keyParam) {
      const keys = keyParam.split(',').map(k => k.trim());
      settings = await prisma.setting.findMany({
        where: { key: { in: keys } },
      });
    } else {
      settings = await prisma.setting.findMany();
    }
    
    // Map entries to a simple { key: value } dictionary
    const dict: Record<string, string> = {};
    settings.forEach(s => {
      dict[s.key] = s.value;
    });
    
    return new NextResponse(JSON.stringify(dict), {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, max-age=0, must-revalidate',
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

// PUT settings
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json(); // Shape: { [key: string]: any }
    if (typeof body !== 'object' || body === null) {
      return NextResponse.json({ error: 'Invalid settings body' }, { status: 400 });
    }
    
    const entries = Object.entries(body);
    
    // Save settings concurrently using upsert
    await Promise.all(
      entries.map(([key, val]) => {
        const valueStr = typeof val === 'string' ? val : JSON.stringify(val);
        return prisma.setting.upsert({
          where: { key },
          update: { value: valueStr },
          create: { key, value: valueStr },
        });
      })
    );
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving settings:', error);
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}
