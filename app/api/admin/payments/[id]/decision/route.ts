import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * POST /api/admin/payments/[id]/decision
 * Body: { action: 'approve' | 'reject', note?: string }
 *
 * ⚠️ ADAPT THIS: this assumes your User model has a boolean `isAdmin` field.
 * If your schema uses something else (e.g. `role: 'admin'`), change the
 * isAdmin check below to match.
 */
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // --- Admin check — ADJUST to match your actual schema ---
    const adminUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { isAdmin: true } as any, // remove `as any` once the field exists in your schema
    });
    if (!(adminUser as any)?.isAdmin) {
      return NextResponse.json({ error: 'Forbidden — admin access required' }, { status: 403 });
    }
    // ----------------------------------------------------------

    const { id: paymentId } = await params;
    const { action, note } = await req.json();

    if (action !== 'approve' && action !== 'reject') {
      return NextResponse.json({ error: 'action must be "approve" or "reject"' }, { status: 400 });
    }

    const payment = await prisma.payment.findUnique({ where: { id: paymentId } });
    if (!payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }
    if (payment.status !== 'pending') {
      return NextResponse.json(
        { error: `Payment already ${payment.status}, cannot re-process` },
        { status: 400 }
      );
    }

    if (action === 'reject') {
      await prisma.payment.update({
        where: { id: paymentId },
        data: { 
          status: 'rejected',
          metadata: note ? { adminNote: note } : undefined
        },
      });
      return NextResponse.json({ success: true, status: 'rejected' });
    }

    // ── APPROVE ──────────────────────────────────────────────────────────
    const now = new Date();
    const periodEnd = new Date(now);
    if (payment.billing === 'yearly') {
      periodEnd.setFullYear(periodEnd.getFullYear() + 1);
    } else {
      periodEnd.setDate(periodEnd.getDate() + 30);
    }

    // 🎁 Check for referral discount
    const user = await prisma.user.findUnique({
      where: { id: payment.userId },
      select: {
        id: true,
        email: true,
        name: true,
        hasLifetimeDiscount: true,
        lifetimeDiscountPercent: true,
        receivedReferrals: {
          select: { 
            id: true, 
            referrerId: true,
            status: true 
          }
        },
        subscriptions: {
          where: { status: 'active' },
          select: { id: true }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Calculate discount
    let discountPercent = 0;
    let discountType = 'none';
    let discountMessage = '';

    // Check for lifetime discount (25+ paid referrals)
    if (user.hasLifetimeDiscount) {
      discountPercent = user.lifetimeDiscountPercent || 20;
      discountType = 'lifetime';
      discountMessage = `🏆 Lifetime ${discountPercent}% discount applied (25+ referrals achievement)`;
    }
    // Check for first-time referral discount
    else if (user.receivedReferrals && user.receivedReferrals.length > 0) {
      // Check if this is their first paid subscription
      const hasActiveSub = user.subscriptions && user.subscriptions.length > 0;
      
      if (!hasActiveSub) {
        discountPercent = 20;
        discountType = 'first-time';
        discountMessage = `🎁 First-time referral discount: 20% OFF`;
      }
    }

    // Calculate final amount
    const originalAmount = Number(payment.amount);
    const finalAmount = originalAmount * (1 - discountPercent / 100);
    const discountAmount = originalAmount - finalAmount;

    // Prepare transaction updates
    const transactionUpdates: any[] = [
      // Mark payment verified with discount info
      prisma.payment.update({
        where: { id: paymentId },
        data: { 
          status: 'success', 
          paidAt: now,
          // Store discount info in metadata
          metadata: {
            discountApplied: discountPercent > 0,
            discountPercent,
            discountType,
            originalAmount,
            finalAmount,
            discountAmount,
            discountMessage,
            adminNote: note || null
          }
        },
      }),
      // Expire any existing active subscription
      prisma.subscription.updateMany({
        where: { userId: payment.userId, status: 'active' },
        data: { status: 'expired' },
      }),
      // Create the new active subscription with final amount
      prisma.subscription.create({
        data: {
          userId: payment.userId,
          planId: payment.planId,
          status: 'active',
          paymentGateway: 'bkash',
          amount: finalAmount, // Store discounted amount
          currency: 'BDT',
          billingCycle: payment.billing || 'monthly',
          currentPeriodStart: now,
          currentPeriodEnd: periodEnd,
          nextBillingDate: periodEnd,
        },
      }),
    ];

    // Update referral status if first-time discount was applied
    if (discountType === 'first-time' && user.receivedReferrals && user.receivedReferrals.length > 0) {
      const referralToUpdate = user.receivedReferrals[0]; // Get the referral record
      
      transactionUpdates.push(
        // Mark referral as paid
        prisma.referral.update({
          where: { id: referralToUpdate.id },
          data: {
            status: 'paid',
            firstPaidAt: now,
          }
        })
      );

      // Check if referrer should get rewards
      const referrerId = referralToUpdate.referrerId;
      const referrer = await prisma.user.findUnique({
        where: { id: referrerId },
        select: {
          id: true,
          sentReferrals: {
            where: { status: 'paid' },
            select: { id: true }
          }
        }
      });

      if (referrer) {
        const paidReferralCount = referrer.sentReferrals.length + 1; // +1 for this new one

        // Reward tiers: 1, 3, 5, 10, 25, 50 paid referrals
        const rewardTiers = [
          { count: 1, generations: 50, description: '50 bonus generations for 1st paid referral' },
          { count: 3, generations: 200, description: '200 bonus generations for 3 paid referrals' },
          { count: 5, generations: 500, description: '500 bonus generations for 5 paid referrals' },
          { count: 10, generations: 1000, description: '1000 bonus generations for 10 paid referrals' },
          { count: 25, generations: 0, description: 'Lifetime 20% discount for 25 paid referrals', isLifetimeDiscount: true },
          { count: 50, generations: 5000, description: '5000 bonus generations for 50 paid referrals' },
        ];

        const earnedReward = rewardTiers.find(tier => tier.count === paidReferralCount);

        if (earnedReward) {
          if (earnedReward.isLifetimeDiscount) {
            // Grant lifetime discount
            transactionUpdates.push(
              prisma.user.update({
                where: { id: referrerId },
                data: {
                  hasLifetimeDiscount: true,
                  lifetimeDiscountPercent: 20
                }
              })
            );
          } else {
            // Grant bonus generations
            const expiryDate = new Date();
            expiryDate.setMonth(expiryDate.getMonth() + 6); // 6 months validity

            transactionUpdates.push(
              prisma.referralReward.create({
                data: {
                  userId: referrerId,
                  type: 'bonus_generations',
                  description: earnedReward.description,
                  amount: earnedReward.generations,
                  generationsTotal: earnedReward.generations,
                  generationsUsed: 0,
                  generationsRemaining: earnedReward.generations,
                  status: 'active',
                  expiresAt: expiryDate,
                  referralCount: paidReferralCount,
                }
              })
            );
          }
        }
      }
    }

    // Execute all updates in a transaction
    await prisma.$transaction(transactionUpdates);

    return NextResponse.json({ 
      success: true, 
      status: 'approved', 
      periodEnd,
      discount: discountPercent > 0 ? {
        applied: true,
        percent: discountPercent,
        type: discountType,
        originalAmount,
        finalAmount,
        saved: discountAmount,
        message: discountMessage
      } : null
    });
  } catch (error) {
    console.error('Payment decision error:', error);
    return NextResponse.json({ error: 'Failed to process payment decision' }, { status: 500 });
  }
}
