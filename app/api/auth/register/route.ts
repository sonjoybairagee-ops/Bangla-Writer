import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
// import { sendWelcomeEmail, sendReferralSignupNotification } from '@/lib/email/notifications';
// OTP verification temporarily disabled
// import { generateOTP, sendVerificationEmail } from '@/lib/email';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  referralCode: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, referralCode } = registerSchema.parse(body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      /* OTP VERIFICATION DISABLED - Direct login allowed
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
      */

      return NextResponse.json(
        { error: 'এই ইমেইলে আগেই অ্যাকাউন্ট আছে। লগইন করুন।' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Check if referral code is valid
    let referrerId: string | null = null;
    if (referralCode) {
      const referrer = await prisma.user.findUnique({
        where: { referralCode },
        select: { id: true },
      });
      if (referrer) {
        referrerId = referrer.id;
      }
    }

    // Create user with email verified (OTP disabled)
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        emailVerified: new Date(), // ← Auto-verified (OTP disabled)
        referredBy: referrerId,
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

    // Create 7-day free trial subscription
    const trialEndDate = new Date();
    trialEndDate.setDate(trialEndDate.getDate() + 7); // 7 days from now

    await prisma.subscription.create({
      data: {
        userId: user.id,
        planId: 'free',
        status: 'active',
        currentPeriodStart: now,
        currentPeriodEnd: trialEndDate,
      },
    });

    // Create referral record if referred by someone
    if (referrerId) {
      await prisma.referral.create({
        data: {
          referrerId,
          referredUserId: user.id,
          status: 'pending', // Will be 'paid' when they make first payment
          ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || undefined,
          userAgent: req.headers.get('user-agent') || undefined,
        },
      });

      // Send notification to referrer
      const referrer = await prisma.user.findUnique({
        where: { id: referrerId },
        select: {
          name: true,
          email: true,
          _count: {
            select: {
              referrals: true,
            },
          },
          referrals: {
            select: {
              id: true,
              referredUser: {
                select: {
                  subscriptions: {
                    where: { status: 'active' },
                    select: { id: true },
                  },
                },
              },
            },
          },
        },
      });

      if (referrer) {
        const paidReferrals = referrer.referrals.filter(
          r => r.referredUser.subscriptions.length > 0
        ).length;

        // Send email notification to referrer (non-blocking)
        // sendReferralSignupNotification(
        //   referrer.email,
        //   referrer.name || 'User',
        //   user.name || 'Someone',
        //   referrer._count.referrals + 1,
        //   paidReferrals
        // ).catch(err => console.error('Failed to send referral notification:', err));
      }
    }

    // Send welcome email (non-blocking)
    // sendWelcomeEmail(user.email, user.name || 'User', referrerId ? 'yes' : undefined)
    //   .catch(err => console.error('Failed to send welcome email:', err));

    /* OTP VERIFICATION DISABLED
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
    */

    return NextResponse.json(
      {
        message: 'Account created successfully! You can now login.',
        requiresVerification: false, // OTP disabled
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
