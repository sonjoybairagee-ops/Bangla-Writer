import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateOTP, sendPasswordResetEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });

    if (user) {
      const otp = generateOTP();
      const expires = new Date(Date.now() + 1000 * 60 * 10); // 10 minutes

      // Reuse NextAuth's VerificationToken table.
      // identifier = "reset:<email>" to keep this separate from signup-OTP tokens
      await prisma.verificationToken.upsert({
        where: { identifier_token: { identifier: `reset:${normalizedEmail}`, token: otp } },
        update: { expires },
        create: { identifier: `reset:${normalizedEmail}`, token: otp, expires },
      });

      try {
        await sendPasswordResetEmail(normalizedEmail, otp);
      } catch (emailError) {
        console.error('Failed to send reset OTP email:', emailError);
      }
    }

    // Always return success (security: don't reveal if email exists)
    return NextResponse.json({
      success: true,
      message: 'If this email is registered, a reset code has been sent.',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
