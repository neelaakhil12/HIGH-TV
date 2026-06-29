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
    let filePath = path.join(uploadDir, filename);
    
    if (!fs.existsSync(filePath)) {
      // Fuzzy matching fallback for legacy files with timestamp mismatches
      const match = filename.match(/^epaper-(\d+)-(.+)\.pdf$/);
      if (match) {
        const timestamp = parseInt(match[1]);
        const slug = match[2];
        const files = fs.existsSync(uploadDir) ? fs.readdirSync(uploadDir) : [];
        
        let foundFile = '';
        for (const file of files) {
          const fMatch = file.match(/^epaper-(\d+)-(.+)\.pdf$/);
          if (fMatch) {
            const fTimestamp = parseInt(fMatch[1]);
            const fSlug = fMatch[2];
            if (fSlug === slug && Math.abs(fTimestamp - timestamp) < 5000) {
              foundFile = file;
              break;
            }
          }
        }
        
        if (foundFile) {
          filePath = path.join(uploadDir, foundFile);
        }
      }
    }
    
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
