import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { role: true },
    });

    if (user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get all referrals with detailed stats
    const allReferrals = await prisma.user.findMany({
      where: {
        referredBy: { not: null },
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        referredBy: true,
        referrer: {
          select: {
            id: true,
            name: true,
            email: true,
            referralCode: true,
          },
        },
        subscriptions: {
          where: {
            status: 'active',
          },
          select: {
            id: true,
            planId: true,
            status: true,
            currentPeriodStart: true,
            currentPeriodEnd: true,
          },
          take: 1,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Get referral rewards
    const allRewards = await prisma.referralReward.findMany({
      select: {
        id: true,
        userId: true,
        rewardType: true,
        createdAt: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Calculate stats
    const totalSignups = allReferrals.length;
    const paidReferrals = allReferrals.filter(r => r.subscriptions.length > 0).length;
    const pendingReferrals = totalSignups - paidReferrals;
    const totalRewards = allRewards.length;

    // Top referrers
    const referrerStats = await prisma.user.findMany({
      where: {
        referrals: {
          some: {},
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        referralCode: true,
        _count: {
          select: {
            referrals: true,
          },
        },
        referrals: {
          select: {
            subscriptions: {
              where: {
                status: 'active',
              },
              select: {
                id: true,
              },
            },
          },
        },
      },
      orderBy: {
        referrals: {
          _count: 'desc',
        },
      },
      take: 10,
    });

    const topReferrers = referrerStats.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      referralCode: user.referralCode,
      totalReferrals: user._count.referrals,
      paidReferrals: user.referrals.filter(r => r.subscriptions.length > 0).length,
    }));

    return NextResponse.json({
      stats: {
        totalSignups,
        paidReferrals,
        pendingReferrals,
        totalRewards,
        conversionRate: totalSignups > 0 ? ((paidReferrals / totalSignups) * 100).toFixed(1) : 0,
      },
      referrals: allReferrals,
      rewards: allRewards,
      topReferrers,
    });
  } catch (error: any) {
    console.error('Admin referrals error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch referral data' },
      { status: 500 }
    );
  }
}
