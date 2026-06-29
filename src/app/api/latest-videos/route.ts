import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all latest videos
export async function GET() {
  try {
    const videos = await prisma.latestVideo.findMany({ orderBy: { sortOrder: 'asc' } });
    
    // Map database fields to the frontend expected shape
    const mappedVideos = videos.map(v => ({
      id: v.youtubeId,
      title: v.title,
      thumbnail: v.thumbnail
    }));

    return new NextResponse(JSON.stringify(mappedVideos), {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, max-age=0, must-revalidate',
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching latest videos:', error);
    return NextResponse.json({ error: 'Failed to fetch latest videos' }, { status: 500 });
  }
}

// PUT — replace all latest videos at once
export async function PUT(req: NextRequest) {
  try {
    const videos: { id: string; title: string; thumbnail: string }[] = await req.json();
    
    // Clear existing
    await prisma.latestVideo.deleteMany();
    
    // Insert new list
    if (videos.length > 0) {
      await prisma.latestVideo.createMany({
        data: videos.map((video, idx) => ({
          youtubeId: video.id,
          title: video.title,
          thumbnail: video.thumbnail || '',
          sortOrder: idx,
        })),
      });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating latest videos:', error);
    return NextResponse.json({ error: 'Failed to update latest videos' }, { status: 500 });
  }
}
