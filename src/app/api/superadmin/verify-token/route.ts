import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    const savedTokenSetting = await prisma.setting.findUnique({ where: { key: 'superadmin_reset_token' } });
    const expiresSetting = await prisma.setting.findUnique({ where: { key: 'superadmin_reset_expires' } });

    if (!savedTokenSetting || savedTokenSetting.value !== token) {
      return NextResponse.json({ error: 'Invalid or expired reset token' }, { status: 400 });
    }

    if (expiresSetting) {
      const expiryDate = new Date(expiresSetting.value);
      if (expiryDate.getTime() < Date.now()) {
        return NextResponse.json({ error: 'Reset token has expired' }, { status: 400 });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Super-admin verify token error:', error);
    return NextResponse.json({ error: 'Verification failed', details: error?.message || String(error) }, { status: 500 });
  }
}
