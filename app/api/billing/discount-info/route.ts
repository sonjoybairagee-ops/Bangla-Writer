import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // Check for lifetime discount
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        hasLifetimeDiscount: true,
        lifetimeDiscountPercent: true,
        receivedReferrals: {
          where: {
            status: { in: ['pending', 'paid'] },
          },
          take: 1,
        },
      },
    });

    if (!user) {
      return NextResponse.json({
        hasDiscount: false,
        discountPercent: 0,
        discountType: 'none',
      });
    }

    // Check for lifetime discount (from referral rewards)
    if (user.hasLifetimeDiscount && user.lifetimeDiscountPercent > 0) {
      return NextResponse.json({
        hasDiscount: true,
        discountPercent: user.lifetimeDiscountPercent,
        discountType: 'lifetime',
        message: `🎉 You have a lifetime ${user.lifetimeDiscountPercent}% discount!`,
      });
    }

    // Check for first-time user 20% discount (referred user)
    if (user.receivedReferrals.length > 0) {
      // Check if this is their first paid subscription
      const hasExistingPaidSub = await prisma.subscription.findFirst({
        where: {
          userId,
          status: { in: ['active', 'cancelled'] },
          planId: { not: 'free' },
        },
      });

      if (!hasExistingPaidSub) {
        return NextResponse.json({
          hasDiscount: true,
          discountPercent: 20,
          discountType: 'first-time',
          message: '🎁 20% OFF your first subscription (Referral Bonus)',
        });
      }
    }

    return NextResponse.json({
      hasDiscount: false,
      discountPercent: 0,
      discountType: 'none',
    });
  } catch (error: any) {
    console.error('Discount info error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch discount info' },
      { status: 500 }
    );
  }
}
