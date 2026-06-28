import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const epaper = await prisma.epaper.create({
      data: {
        title: 'test-direct-api',
        date: '2026-06-28',
        pdfUrl: 'data:application/pdf;base64,JVBERi0xLjQK...',
        section: 'main'
      }
    });
    
    // clean up
    await prisma.epaper.delete({ where: { id: epaper.id } });
    
    return NextResponse.json({ success: true, message: 'Database test insert worked!', epaper });
  } catch (error: any) {
    console.error("DIAGNOSTIC API ERROR:", error);
    return NextResponse.json({
      success: false,
      message: error.message,
      stack: error.stack,
      error
    }, { status: 500 });
  }
}
