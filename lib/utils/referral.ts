import { prisma } from '@/lib/prisma';

// Referral reward tiers (Phase 1 Launch)
export const REFERRAL_TIERS = {
  1: {
    type: 'progress',
    amount: 0,
    description: 'Progress Only (No Reward)',
  },
  3: {
    type: 'free_days',
    amount: 14,
    description: '14 Days Pro Free',
  },
  5: {
    type: 'free_month',
    amount: 1,
    description: '1 Month Pro Free',
  },
  10: {
    type: 'free_months_badge',
    amount: 2,
    description: '2 Months Pro + Referral Badge',
  },
  25: {
    type: 'lifetime_discount',
    amount: 20,
    description: 'Lifetime 20% Discount',
  },
  50: {
    type: 'agency_ambassador',
    amount: 3,
    description: '3 Months Agency Free + Ambassador Badge',
  },
};

export async function checkReferralRewards(userId: string) {
  try {
    // Count paid referrals
    const paidReferralsCount = await prisma.referral.count({
      where: {
        referrerId: userId,
        status: 'paid',
      },
    });

    // Get existing rewards
    const existingRewards = await prisma.referralReward.findMany({
      where: { userId },
    });

    const rewardedCounts = existingRewards.map((r) => r.referralCount);

    // Check each tier
    const newRewards = [];
    for (const [count, reward] of Object.entries(REFERRAL_TIERS)) {
      const requiredCount = parseInt(count);
      
      if (
        paidReferralsCount >= requiredCount &&
        !rewardedCounts.includes(requiredCount)
      ) {
        // Skip tier 1 (progress only, no reward)
        if (requiredCount === 1) continue;

        const rewardData: any = {
          userId,
          type: reward.type,
          description: reward.description,
          amount: reward.amount,
          referralCount: requiredCount,
          status: 'active',
        };

        // Set expiry for free days/months (not for lifetime discount)
        if (reward.type !== 'lifetime_discount' && reward.type !== 'progress') {
          rewardData.expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 year
        }

        newRewards.push(rewardData);
      }
    }

    // Create new rewards
    if (newRewards.length > 0) {
      await prisma.referralReward.createMany({
        data: newRewards,
      });

      // Apply lifetime discount if earned
      const lifetimeReward = newRewards.find((r) => r.type === 'lifetime_discount');
      if (lifetimeReward) {
        await prisma.user.update({
          where: { id: userId },
          data: {
            hasLifetimeDiscount: true,
            lifetimeDiscountPercent: 20,
          },
        });
      }
    }

    return newRewards;
  } catch (error) {
    console.error('Check referral rewards error:', error);
    return [];
  }
}

export async function applyReferralDiscount(userId: string, originalAmount: number): Promise<number> {
  try {
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

    if (!user) return originalAmount;

    // Check for lifetime discount
    if (user.hasLifetimeDiscount && user.lifetimeDiscountPercent > 0) {
      const discount = originalAmount * (user.lifetimeDiscountPercent / 100);
      return Math.round(originalAmount - discount);
    }

    // Check for first-time user 20% discount (referred user)
    if (user.receivedReferrals.length > 0) {
      const referral = user.receivedReferrals[0];
      
      // Check if this is their first paid subscription
      const hasExistingPaidSub = await prisma.subscription.findFirst({
        where: {
          userId,
          status: { in: ['active', 'cancelled'] },
          planId: { not: 'free' },
        },
      });

      if (!hasExistingPaidSub) {
        // Apply 20% first-time discount
        const discount = Math.round(originalAmount * 0.20);
        return originalAmount - discount;
      }
    }

    return originalAmount;
  } catch (error) {
    console.error('Apply referral discount error:', error);
    return originalAmount;
  }
}

export async function useBonusGeneration(userId: string, type: 'script' | 'hook' | 'plan' | 'ovc'): Promise<boolean> {
  try {
    // Find active bonus generation rewards
    const reward = await prisma.referralReward.findFirst({
      where: {
        userId,
        type: 'bonus_generations',
        status: 'active',
        generationsRemaining: { gt: 0 },
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } },
        ],
      },
      orderBy: {
        createdAt: 'asc', // Use oldest first
      },
    });

    if (!reward) return false;

    // Decrement bonus generation
    await prisma.referralReward.update({
      where: { id: reward.id },
      data: {
        generationsUsed: { increment: 1 },
        generationsRemaining: { decrement: 1 },
        status: reward.generationsRemaining <= 1 ? 'used' : 'active',
      },
    });

    return true;
  } catch (error) {
    console.error('Use bonus generation error:', error);
    return false;
  }
}

export async function applyFreeMonthReward(userId: string) {
  try {
    // Get active free month rewards
    const rewards = await prisma.referralReward.findMany({
      where: {
        userId,
        type: 'free_month',
        status: 'active',
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    if (rewards.length === 0) return false;

    // Get user's current subscription
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId,
        status: 'active',
      },
    });

    if (!subscription) return false;

    // Apply rewards (up to 12 months/year limit)
    let monthsToAdd = 0;
    const rewardsToUse = [];

    for (const reward of rewards) {
      if (monthsToAdd >= 12) break; // Maximum 12 months per year
      
      monthsToAdd += reward.amount;
      rewardsToUse.push(reward.id);
    }

    if (monthsToAdd === 0) return false;

    // Extend subscription
    const newEndDate = new Date(subscription.currentPeriodEnd);
    newEndDate.setMonth(newEndDate.getMonth() + monthsToAdd);

    await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        currentPeriodEnd: newEndDate,
        nextBillingDate: newEndDate,
      },
    });

    // Mark rewards as used
    await prisma.referralReward.updateMany({
      where: {
        id: { in: rewardsToUse },
      },
      data: {
        status: 'used',
        appliedAt: new Date(),
      },
    });

    return true;
  } catch (error) {
    console.error('Apply free month reward error:', error);
    return false;
  }
}
