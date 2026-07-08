import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
// import { 
//   sendPaymentConfirmation, 
//   sendReferralRewardNotification,
//   sendFirstPaymentDiscount 
// } from '@/lib/email/notifications';
import { PRICING_PLANS } from '@/lib/constants/pricing';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (user?.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const body = await req.json();
    const { paymentId, action } = body; // action: 'approve' | 'reject'

    if (!paymentId || !action) {
      return NextResponse.json(
        { error: 'Payment ID and action are required' },
        { status: 400 }
      );
    }

    // Get payment details
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }

    if (payment.status !== 'pending') {
      return NextResponse.json(
        { error: 'Payment has already been processed' },
        { status: 400 }
      );
    }

    if (action === 'reject') {
      // Just update payment status to rejected
      await prisma.payment.update({
        where: { id: paymentId },
        data: {
          status: 'rejected',
          verifiedBy: session.user.id,
          verifiedAt: new Date(),
        },
      });

      return NextResponse.json({
        success: true,
        message: 'Payment rejected',
      });
    }

    // Approve payment - Create/Update subscription
    const { userId, planId, billing, amount } = payment;

    if (!planId || !billing) {
      return NextResponse.json(
        { error: 'Invalid payment data' },
        { status: 400 }
      );
    }

    // Calculate subscription period
    const now = new Date();
    const periodEnd = new Date(now);
    
    if (billing === 'yearly') {
      periodEnd.setFullYear(periodEnd.getFullYear() + 1);
    } else {
      periodEnd.setMonth(periodEnd.getMonth() + 1);
    }

    // Check if user already has an active subscription
    const existingSubscription = await prisma.subscription.findFirst({
      where: {
        userId,
        status: { in: ['active', 'trialing'] },
      },
    });

    let subscription;

    if (existingSubscription) {
      // Update existing subscription
      subscription = await prisma.subscription.update({
        where: { id: existingSubscription.id },
        data: {
          planId,
          billingCycle: billing,
          amount,
          currentPeriodStart: now,
          currentPeriodEnd: periodEnd,
          nextBillingDate: periodEnd,
          status: 'active',
        },
      });
    } else {
      // Create new subscription
      subscription = await prisma.subscription.create({
        data: {
          userId,
          planId,
          status: 'active',
          paymentGateway: 'bkash',
          transactionId: payment.transactionId || undefined,
          paymentMethod: 'bkash',
          amount,
          currency: 'BDT',
          billingCycle: billing,
          currentPeriodStart: now,
          currentPeriodEnd: periodEnd,
          nextBillingDate: periodEnd,
        },
      });
    }

    // Update payment status and link to subscription
    await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: 'verified',
        subscriptionId: subscription.id,
        verifiedBy: session.user.id,
        verifiedAt: new Date(),
        paidAt: new Date(),
      },
    });

    // ========================================
    // REFERRAL SYSTEM: Handle first payment
    // ========================================
    
    // Check if this is user's first paid subscription
    const isFirstPaidSubscription = !(await prisma.subscription.findFirst({
      where: {
        userId,
        planId: { not: 'free' },
        id: { not: subscription.id },
      },
    }));

    if (isFirstPaidSubscription) {
      // Check if user was referred
      const referral = await prisma.referral.findFirst({
        where: {
          referredUserId: userId,
          status: 'pending',
        },
        include: {
          referrer: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          referredUser: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      });

      if (referral) {
        // Calculate discount (20% for referred users)
        const discount = 20;
        const savedAmount = Math.round((amount || 0) * (discount / 100));

        // Update referral status to 'paid'
        await prisma.referral.update({
          where: { id: referral.id },
          data: {
            status: 'paid',
            firstPaidAt: new Date(),
            paymentMethod: payment.method || 'unknown',
          },
        });

        // Send discount notification to referred user (non-blocking)
        // sendFirstPaymentDiscount(
        //   referral.referredUser.email,
        //   referral.referredUser.name || 'User',
        //   discount,
        //   savedAmount
        // ).catch(err => console.error('Failed to send discount email:', err));

        // Check and grant rewards to referrer
        const { checkReferralRewards } = await import('@/lib/utils/referral');
        const rewards = await checkReferralRewards(referral.referrerId);

        // Send reward notifications if any rewards were granted
        // if (rewards && rewards.length > 0) {
        //   for (const reward of rewards) {
        //     sendReferralRewardNotification(
        //       referral.referrer.email,
        //       referral.referrer.name || 'User',
        //       reward.rewardType,
        //       reward.milestone
        //     ).catch(err => console.error('Failed to send reward email:', err));
        //   }
        // }
      }
    }

    // If Pro or Agency plan, create default team for the user
    if (planId === 'pro' || planId === 'agency') {
      // Check if user already has a team
      const existingTeam = await prisma.team.findFirst({
        where: { ownerId: userId },
      });

      if (!existingTeam) {
        // Get user details
        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: { name: true, email: true },
        });

        // Set max members based on plan
        const maxMembers = planId === 'agency' ? 5 : 2;

        // Create default team
        const team = await prisma.team.create({
          data: {
            ownerId: userId,
            name: `${user?.name || 'My'} Team`,
            description: 'Your team workspace',
            maxMembers,
          },
        });

        // Add owner as admin member
        await prisma.teamMember.create({
          data: {
            teamId: team.id,
            userId,
            role: 'admin',
            canManageTeam: true,
            canManageBrands: true,
            canCreateContent: true,
            canViewAnalytics: true,
          },
        });
      }
    }

    // Send payment confirmation email
    const paidUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true },
    });

    if (paidUser) {
      const plan = PRICING_PLANS[planId as keyof typeof PRICING_PLANS];
      const planName = plan?.name || planId.charAt(0).toUpperCase() + planId.slice(1);
      const duration = billing === 'yearly' ? '1 Year' : '1 Month';

      // Send email (non-blocking)
      // sendPaymentConfirmation(
      //   paidUser.email,
      //   paidUser.name || 'User',
      //   planName,
      //   amount || 0,
      //   duration
      // ).catch(err => console.error('Failed to send payment confirmation:', err));
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified and plan activated',
      subscription: {
        id: subscription.id,
        planId: subscription.planId,
        status: subscription.status,
      },
    });
  } catch (error: any) {
    console.error('Grant plan error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to grant plan' },
      { status: 500 }
    );
  }
}
