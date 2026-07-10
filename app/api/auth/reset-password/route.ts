import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    const { email, otp, password } = await req.json();

    if (!email || !otp || !password) {
      return NextResponse.json({ error: 'সব তথ্য প্রয়োজন' }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: 'পাসওয়ার্ড অন্তত ৮ অক্ষরের হতে হবে' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const identifier = `reset:${normalizedEmail}`;

    const record = await prisma.verificationToken.findUnique({
      where: { identifier_token: { identifier, token: otp } },
    });

    if (!record || record.expires < new Date()) {
      return NextResponse.json({ error: 'কোডটি ভুল অথবা মেয়াদোত্তীর্ণ' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.user.update({
      where: { email: normalizedEmail },
      data: { password: hashedPassword },
    });

    // OTP used up — delete it so it can't be reused
    await prisma.verificationToken.delete({
      where: { identifier_token: { identifier, token: otp } },
    });

    return NextResponse.json({ success: true, message: 'পাসওয়ার্ড সফলভাবে পরিবর্তিত হয়েছে' });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json({ error: 'কিছু একটা সমস্যা হয়েছে' }, { status: 500 });
  }
}
