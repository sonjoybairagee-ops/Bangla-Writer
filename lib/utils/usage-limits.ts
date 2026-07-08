import { prisma } from '@/lib/prisma';
import { PRICING_PLANS } from '@/lib/constants/pricing';

export async function checkUsageLimit(
  userId: string,
  type: 'script' | 'hook' | 'plan' | 'ovc'
): Promise<{ allowed: boolean; message?: string; usage?: any; limit?: number }> {
  try {
    // Get current month/year
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    // Get user's subscription
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId,
        status: { in: ['active', 'trialing'] },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!subscription) {
      return {
        allowed: false,
        message: 'No active subscription found. Please subscribe to a plan.',
      };
    }

    // Get or create usage record
    let usage = await prisma.usage.findUnique({
      where: {
        userId_month_year: {
          userId,
          month,
          year,
        },
      },
    });

    if (!usage) {
      usage = await prisma.usage.create({
        data: {
          userId,
          month,
          year,
          scriptsGenerated: 0,
          hooksGenerated: 0,
          contentPlansCreated: 0,
          ovcScenesGenerated: 0,
        },
      });
    }

    // Get plan limits
    const planId = subscription.planId as keyof typeof PRICING_PLANS;
    const plan = PRICING_PLANS[planId];

    if (!plan) {
      return {
        allowed: false,
        message: 'Invalid subscription plan.',
      };
    }

    // Check specific limit based on type
    let currentUsage = 0;
    let limit = 0;
    let limitKey = '';

    switch (type) {
      case 'script':
        currentUsage = usage.scriptsGenerated;
        limit = plan.limits.scripts_per_month;
        limitKey = 'Scripts';
        break;
      case 'hook':
        currentUsage = usage.hooksGenerated;
        limit = plan.limits.hooks_per_month;
        limitKey = 'Hooks';
        break;
      case 'plan':
        currentUsage = usage.contentPlansCreated;
        limit = plan.limits.content_plans;
        limitKey = 'Content Plans';
        break;
      case 'ovc':
        currentUsage = usage.ovcScenesGenerated;
        limit = plan.limits.ovc_scenes;
        limitKey = 'OVC Scenes';
        break;
    }

    // Check if unlimited (-1)
    if (limit === -1) {
      return { allowed: true, usage: currentUsage, limit: -1 };
    }

    // Check limit
    if (currentUsage >= limit) {
      return {
        allowed: false,
        message: `Monthly ${limitKey} limit reached (${limit}). Upgrade your plan for more.`,
        usage: currentUsage,
        limit,
      };
    }

    return {
      allowed: true,
      usage: currentUsage,
      limit,
    };
  } catch (error) {
    console.error('Check usage limit error:', error);
    return {
      allowed: false,
      message: 'Failed to check usage limits. Please try again.',
    };
  }
}

export async function incrementUsage(
  userId: string,
  type: 'script' | 'hook' | 'plan' | 'ovc'
): Promise<void> {
  try {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    // Prepare update data
    const updateData: any = {};
    switch (type) {
      case 'script':
        updateData.scriptsGenerated = { increment: 1 };
        break;
      case 'hook':
        updateData.hooksGenerated = { increment: 1 };
        break;
      case 'plan':
        updateData.contentPlansCreated = { increment: 1 };
        break;
      case 'ovc':
        updateData.ovcScenesGenerated = { increment: 1 };
        break;
    }

    // Upsert usage record
    await prisma.usage.upsert({
      where: {
        userId_month_year: {
          userId,
          month,
          year,
        },
      },
      update: updateData,
      create: {
        userId,
        month,
        year,
        scriptsGenerated: type === 'script' ? 1 : 0,
        hooksGenerated: type === 'hook' ? 1 : 0,
        contentPlansCreated: type === 'plan' ? 1 : 0,
        ovcScenesGenerated: type === 'ovc' ? 1 : 0,
      },
    });
  } catch (error) {
    console.error('Increment usage error:', error);
    throw error;
  }
}
