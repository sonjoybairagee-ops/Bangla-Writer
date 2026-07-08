import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { generateOTP, sendVerificationEmail } from '@/lib/email';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password } = registerSchema.parse(body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      // If already registered but not verified, resend OTP
      if (!existingUser.emailVerified) {
        const otp = generateOTP();
        const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        await prisma.verificationToken.upsert({
          where: { identifier_token: { identifier: email, token: 'otp' } },
          update: { token: otp, expires },
          create: { identifier: email, token: otp, expires },
        });

        await sendVerificationEmail(email, otp, existingUser.name || name);

        return NextResponse.json({
          message: 'OTP resent. Please check your email.',
          requiresVerification: true,
          email,
        });
      }

      return NextResponse.json(
        { error: 'এই ইমেইলে আগেই অ্যাকাউন্ট আছে। লগইন করুন।' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user (emailVerified = null means unverified)
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        emailVerified: null, // ← not verified yet
      },
      select: { id: true, name: true, email: true },
    });

    // Create initial usage record
    const now = new Date();
    await prisma.usage.create({
      data: {
        userId: user.id,
        month: now.getMonth() + 1,
        year: now.getFullYear(),
      },
    });

    // Generate OTP
    const otp = generateOTP();
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store OTP in VerificationToken table
    // Using 'otp' as token key per email (identifier = email, token = otp value)
    await prisma.verificationToken.create({
      data: { identifier: email, token: otp, expires },
    });

    // Send verification email
    await sendVerificationEmail(email, otp, name);

    return NextResponse.json(
      {
        message: 'Account created! OTP sent to your email.',
        requiresVerification: true,
        email,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Failed to create account' }, { status: 500 });
  }
}
