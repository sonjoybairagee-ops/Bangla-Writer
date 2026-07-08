import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ error: 'Email and OTP are required' }, { status: 400 });
    }

    // Find the token
    const tokenRecord = await prisma.verificationToken.findFirst({
      where: {
        identifier: email,
        token: otp.trim(),
      },
    });

    if (!tokenRecord) {
      return NextResponse.json({ error: 'ভুল কোড। আবার চেষ্টা করুন।' }, { status: 400 });
    }

    // Check expiry
    if (new Date() > tokenRecord.expires) {
      await prisma.verificationToken.deleteMany({ where: { identifier: email } });
      return NextResponse.json(
        { error: 'কোডের মেয়াদ শেষ হয়ে গেছে। নতুন কোড নিন।' },
        { status: 400 }
      );
    }

    // Mark user as verified
    await prisma.user.update({
      where: { email },
      data: { emailVerified: new Date() },
    });

    // Delete used token
    await prisma.verificationToken.deleteMany({ where: { identifier: email } });

    return NextResponse.json({
      success: true,
      message: 'ইমেইল সফলভাবে ভেরিফাই হয়েছে! এখন লগইন করুন।',
    });
  } catch (error) {
    console.error('OTP verify error:', error);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}
