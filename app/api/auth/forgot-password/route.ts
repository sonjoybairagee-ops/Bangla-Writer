import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }

    // Find user — always return success to prevent email enumeration
    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });

    if (user) {
      // Generate secure token
      const token = crypto.randomBytes(32).toString('hex');
      const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

      // Store token in VerificationToken table (reusing NextAuth's table)
      await prisma.verificationToken.upsert({
        where: { identifier_token: { identifier: email, token } },
        update: { expires },
        create: { identifier: email, token, expires },
      });

      // TODO: Send email via nodemailer / Resend / SendGrid
      // const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}&email=${email}`;
      // await sendResetEmail({ to: email, resetUrl });

      console.log(`[ForgotPassword] Reset token for ${email}: ${token}`);
    }

    // Always return success (security: don't reveal if email exists)
    return NextResponse.json({
      success: true,
      message: 'If this email is registered, a reset link has been sent.',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
