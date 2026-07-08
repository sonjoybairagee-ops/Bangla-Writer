import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getPlanLimits } from '@/lib/constants/pricing';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get current subscription
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: session.user.id,
        status: 'active',
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const planId = subscription?.planId || 'starter';
    const limits = getPlanLimits(planId);

    // Get current month usage
    const currentDate = new Date();
    const usage = await prisma.usage.findUnique({
      where: {
        userId_month_year: {
          userId: session.user.id,
          month: currentDate.getMonth() + 1,
          year: currentDate.getFullYear(),
        },
      },
    });

    const currentUsage = usage || {
      scriptsGenerated: 0,
      hooksGenerated: 0,
      contentPlansCreated: 0,
      ovcScenesGenerated: 0,
    };

    return NextResponse.json({
      usage: currentUsage,
      limits,
      planId,
      subscription: subscription
        ? {
            id: subscription.id,
            planId: subscription.planId,
            status: subscription.status,
            currentPeriodEnd: subscription.currentPeriodEnd,
          }
        : null,
    });
  } catch (error) {
    console.error('Get usage error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch usage' },
      { status: 500 }
    );
  }
}
