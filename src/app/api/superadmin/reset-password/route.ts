import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { token, newPassword } = await req.json();

    if (!token || !newPassword) {
      return NextResponse.json({ error: 'Token and new password are required' }, { status: 400 });
    }

    const savedTokenSetting = await prisma.setting.findUnique({ where: { key: 'superadmin_reset_token' } });
    const expiresSetting = await prisma.setting.findUnique({ where: { key: 'superadmin_reset_expires' } });

    if (!savedTokenSetting || savedTokenSetting.value !== token) {
      return NextResponse.json({ error: 'Invalid reset token' }, { status: 400 });
    }

    if (expiresSetting) {
      const expiryDate = new Date(expiresSetting.value);
      if (expiryDate.getTime() < Date.now()) {
        return NextResponse.json({ error: 'Reset token has expired' }, { status: 400 });
      }
    }

    // Save the new password to database setting
    await prisma.setting.upsert({
      where: { key: 'superadmin_password' },
      update: { value: newPassword },
      create: { key: 'superadmin_password', value: newPassword },
    });

    // Clear reset token settings
    await prisma.setting.upsert({
      where: { key: 'superadmin_reset_token' },
      update: { value: '' },
      create: { key: 'superadmin_reset_token', value: '' },
    });

    await prisma.setting.upsert({
      where: { key: 'superadmin_reset_expires' },
      update: { value: '' },
      create: { key: 'superadmin_reset_expires', value: '' },
    });

    return NextResponse.json({ success: true, message: 'Password has been reset successfully.' });
  } catch (error: any) {
    console.error('Super-admin reset password error:', error);
    return NextResponse.json({ error: 'Failed to reset password', details: error?.message || String(error) }, { status: 500 });
  }
}
