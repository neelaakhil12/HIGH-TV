import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  try {
    const { image } = await req.json();
    if (!image || !image.startsWith('data:image/')) {
      return NextResponse.json({ error: 'Invalid image data' }, { status: 400 });
    }

    // Extract base64 data
    const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return NextResponse.json({ error: 'Invalid base64 image format' }, { status: 400 });
    }

    const buffer = Buffer.from(matches[2], 'base64');
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'clips');

    // Ensure upload directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Generate unique filename
    const id = `clip-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
    const fileName = `${id}.jpg`;
    const filePath = path.join(uploadDir, fileName);

    // Save image to files system
    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/clip/${id}`;
    return NextResponse.json({ id, url: publicUrl });
  } catch (err: any) {
    console.error('Error uploading clip:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
