import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateOTP, sendVerificationEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.emailVerified) {
      return NextResponse.json({ error: 'Email is already verified' }, { status: 400 });
    }

    // Delete old tokens
    await prisma.verificationToken.deleteMany({ where: { identifier: email } });

    // New OTP
    const otp = generateOTP();
    const expires = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.verificationToken.create({
      data: { identifier: email, token: otp, expires },
    });

    await sendVerificationEmail(email, otp, user.name || '');

    return NextResponse.json({ success: true, message: 'নতুন OTP পাঠানো হয়েছে।' });
  } catch (error) {
    console.error('Resend OTP error:', error);
    return NextResponse.json({ error: 'Failed to resend OTP' }, { status: 500 });
  }
}
