import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Retrieve super admin email configuration from settings, default to hightv353@gmail.com
    const emailSetting = await prisma.setting.findUnique({ where: { key: 'superadmin_email' } });
    const correctEmail = (emailSetting?.value || 'hightv353@gmail.com').toLowerCase().trim();

    if (email.toLowerCase().trim() !== correctEmail) {
      return NextResponse.json({ error: 'Invalid recovery email address' }, { status: 400 });
    }

    // Generate token and expiry (1 hour)
    const token = crypto.randomBytes(32).toString('hex');
    const expiry = new Date(Date.now() + 60 * 60 * 1000).toISOString();

    // Store in settings table
    await prisma.setting.upsert({
      where: { key: 'superadmin_reset_token' },
      update: { value: token },
      create: { key: 'superadmin_reset_token', value: token },
    });

    await prisma.setting.upsert({
      where: { key: 'superadmin_reset_expires' },
      update: { value: expiry },
      create: { key: 'superadmin_reset_expires', value: expiry },
    });

    // Configure Mail SMTP Transporter
    const host = process.env.SMTP_HOST;
    const port = parseInt(process.env.SMTP_PORT || '465', 10);
    const secure = process.env.SMTP_SECURE === 'true';
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const from = process.env.SMTP_FROM || 'High TV Admin <hightv353@gmail.com>';

    if (!host || !user || !pass) {
      return NextResponse.json({ error: 'SMTP Mailer settings are not configured in environment' }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
    });

    // Reset Link URL
    const origin = req.nextUrl.origin;
    const resetUrl = `${origin}/superadminlogin/reset?token=${token}`;

    const mailOptions = {
      from,
      to: correctEmail,
      subject: 'High TV CMS - Super Admin Password Reset Request',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded-2xl: 12px; background-color: #ffffff;">
          <h2 style="color: #0f172a; margin-bottom: 16px;">Super Admin Password Reset Request</h2>
          <p style="color: #475569; font-size: 14px; line-height: 1.5;">You requested a password reset for the High TV CMS Super Admin account. Click the button below to set a new password:</p>
          <div style="margin: 24px 0;">
            <a href="${resetUrl}" target="_blank" style="background-color: #02599c; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px; display: inline-block;">Reset Password</a>
          </div>
          <p style="color: #64748b; font-size: 12px; line-height: 1.5; margin-top: 24px;">This link will expire in 1 hour. If you did not request this, please ignore this email.</p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
          <p style="color: #94a3b8; font-size: 10px;">High TV CMS • Secured Administration Console</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: 'Reset link sent to your email successfully.' });
  } catch (error: any) {
    console.error('Super-admin forgot password error:', error);
    return NextResponse.json({ error: 'Failed to send recovery email', details: error?.message || String(error) }, { status: 500 });
  }
}
