import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const result: any = {
    exists: false,
    cwd: process.cwd(),
    files: [],
    nginxConfigs: {}
  };

  try {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'epapers');
    if (fs.existsSync(uploadDir)) {
      result.exists = true;
      result.files = fs.readdirSync(uploadDir);
    }

    // Try to read Nginx configuration files
    const commonNginxPaths = [
      '/etc/nginx/sites-enabled/default',
      '/etc/nginx/sites-available/default',
      '/etc/nginx/nginx.conf',
      '/etc/nginx/sites-enabled/hightv',
      '/etc/nginx/sites-available/hightv'
    ];

    for (const confPath of commonNginxPaths) {
      if (fs.existsSync(confPath)) {
        try {
          result.nginxConfigs[confPath] = fs.readFileSync(confPath, 'utf8');
        } catch (e: any) {
          result.nginxConfigs[confPath] = `Error reading file: ${e.message}`;
        }
      }
    }

    // Also look inside /etc/nginx/sites-enabled/ directory to see if there are other files
    try {
      const sitesEnabledDir = '/etc/nginx/sites-enabled';
      if (fs.existsSync(sitesEnabledDir)) {
        result.sitesEnabledFiles = fs.readdirSync(sitesEnabledDir);
      }
    } catch {}

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
}
