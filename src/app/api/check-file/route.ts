import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'epapers');
    if (!fs.existsSync(uploadDir)) {
      return NextResponse.json({ exists: false, message: 'Upload directory does not exist' });
    }
    const files = fs.readdirSync(uploadDir);
    return NextResponse.json({ exists: true, cwd: process.cwd(), files });
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
}
