import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
    }

    // Retrieve custom credentials from Setting table
    const dbUsernameSetting = await prisma.setting.findUnique({ where: { key: 'superadmin_username' } });
    const dbPasswordSetting = await prisma.setting.findUnique({ where: { key: 'superadmin_password' } });

    const correctUsername = dbUsernameSetting?.value || 'admin';
    const correctPassword = dbPasswordSetting?.value || 'admin123';

    if (username === correctUsername && password === correctPassword) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
    }
  } catch (error: any) {
    console.error('Super-admin login error:', error);
    return NextResponse.json({ error: 'Authentication failed', details: error?.message || String(error) }, { status: 500 });
  }
}
