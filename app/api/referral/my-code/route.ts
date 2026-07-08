import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Generate unique referral code
function generateReferralCode(name: string, id: string): string {
  const cleanName = name?.replace(/[^a-zA-Z0-9]/g, '').toUpperCase() || 'USER';
  const shortId = id.slice(-6).toUpperCase();
  return `${cleanName.slice(0, 4)}${shortId}`;
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get or create referral code
    let user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        referralCode: true,
        referredBy: true,
        _count: {
          select: {
            referrals: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Create referral code if doesn't exist
    if (!user.referralCode) {
      const referralCode = generateReferralCode(user.name || '', user.id);
      
      user = await prisma.user.update({
        where: { id: session.user.id },
        data: { referralCode },
        select: {
          id: true,
          name: true,
          email: true,
          referralCode: true,
          referredBy: true,
          _count: {
            select: {
              referrals: true,
            },
          },
        },
      });
    }

    // Get referral stats
    const referrals = await prisma.user.findMany({
      where: {
        referredBy: session.user.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        subscriptions: {
          where: {
            status: 'active',
          },
          select: {
            planId: true,
          },
          take: 1,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Count paid referrals
    const paidReferrals = referrals.filter(r => r.subscriptions.length > 0).length;

    // Get rewards
    const rewards = await prisma.referralReward.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      referralCode: user.referralCode,
      referralUrl: `${process.env.NEXT_PUBLIC_APP_URL}/register?ref=${user.referralCode}`,
      stats: {
        totalReferrals: user._count.referrals,
        paidReferrals,
        rewardsEarned: rewards.length,
      },
      referrals,
      rewards,
      referredBy: user.referredBy,
    });
  } catch (error: any) {
    console.error('Get referral code error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get referral code' },
      { status: 500 }
    );
  }
}
