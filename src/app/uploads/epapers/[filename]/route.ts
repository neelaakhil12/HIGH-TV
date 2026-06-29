import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    
    // Resolve path to the uploaded PDF file in public/uploads/epapers/
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'epapers');
    const filePath = path.join(uploadDir, filename);
    
    if (!fs.existsSync(filePath)) {
      const files = fs.existsSync(uploadDir) ? fs.readdirSync(uploadDir) : [];
      const debugInfo = files.map(f => {
        return {
          file: f,
          lengthMatch: f.length === filename.length,
          exactMatch: f === filename,
          fileCharCodes: Array.from(f).map(c => c.charCodeAt(0)),
          paramCharCodes: Array.from(filename).map(c => c.charCodeAt(0))
        };
      });
      
      return new NextResponse(JSON.stringify({
        error: 'File Not Found',
        filename,
        path: filePath,
        cwd: process.cwd(),
        debugInfo
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const fileBuffer = fs.readFileSync(filePath);
    
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    });
  } catch (error: any) {
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
