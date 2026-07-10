import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Adjust these if your actual status strings differ
const PAID_PAYMENT_STATUSES = ['completed', 'verified', 'success', 'paid'];
const ACTIVE_SUBSCRIPTION_STATUSES = ['active', 'trialing'];

export async function GET() {
  try {
    const now = new Date();
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // ── Top-line metrics ─────────────────────────────────────────────
    const [totalUsers, activeSubscriptions, totalRevenueAgg, monthlyRevenueAgg] =
      await Promise.all([
        prisma.user.count(),
        prisma.subscription.count({
          where: { status: { in: ACTIVE_SUBSCRIPTION_STATUSES } },
        }),
        prisma.payment.aggregate({
          _sum: { amount: true },
          where: { status: { in: PAID_PAYMENT_STATUSES } },
        }),
        prisma.payment.aggregate({
          _sum: { amount: true },
          where: {
            status: { in: PAID_PAYMENT_STATUSES },
            paidAt: { gte: startOfThisMonth },
          },
        }),
      ]);

    const totalRevenue = Number(totalRevenueAgg._sum.amount || 0);
    const monthlyRevenue = Number(monthlyRevenueAgg._sum.amount || 0);

    // ── Last 12 months: new users + new subscriptions per month ─────
    const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);

    const [usersLast12mo, subsLast12mo, paymentsLast12mo] = await Promise.all([
      prisma.user.findMany({
        where: { createdAt: { gte: twelveMonthsAgo } },
        select: { createdAt: true },
      }),
      prisma.subscription.findMany({
        where: { createdAt: { gte: twelveMonthsAgo } },
        select: { createdAt: true },
      }),
      prisma.payment.findMany({
        where: {
          status: { in: PAID_PAYMENT_STATUSES },
          paidAt: { gte: twelveMonthsAgo },
        },
        select: { paidAt: true, amount: true },
      }),
    ]);

    // Build the last 12 month buckets (oldest -> newest)
    const monthBuckets: { key: string; label: string }[] = Array.from(
      { length: 12 },
      (_, i) => {
        const d = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1);
        return {
          key: `${d.getFullYear()}-${d.getMonth()}`,
          label: d.toLocaleDateString('en-US', { month: 'short' }),
        };
      }
    );

    const userGrowthData = monthBuckets.map(({ key, label }) => {
      const [y, m] = key.split('-').map(Number);
      const usersInMonth = usersLast12mo.filter((u) => {
        const d = new Date(u.createdAt);
        return d.getFullYear() === y && d.getMonth() === m;
      }).length;
      const subsInMonth = subsLast12mo.filter((s) => {
        const d = new Date(s.createdAt);
        return d.getFullYear() === y && d.getMonth() === m;
      }).length;
      return { month: label, users: usersInMonth, subscriptions: subsInMonth };
    });

    const revenueTrendData = monthBuckets.map(({ key, label }) => {
      const [y, m] = key.split('-').map(Number);
      const revenueInMonth = paymentsLast12mo
        .filter((p) => {
          if (!p.paidAt) return false;
          const d = new Date(p.paidAt);
          return d.getFullYear() === y && d.getMonth() === m;
        })
        .reduce((sum, p) => sum + Number(p.amount), 0);
      return { month: label, revenue: revenueInMonth };
    });

    // ── Plan distribution: active users + revenue per plan ──────────
    const plans = await prisma.pricingPlan.findMany({
      select: { id: true, name: true },
    });

    const planDistributionData = await Promise.all(
      plans.map(async (plan) => {
        const [userCount, revenueAgg] = await Promise.all([
          prisma.subscription.count({
            where: {
              planId: plan.id,
              status: { in: ACTIVE_SUBSCRIPTION_STATUSES },
            },
          }),
          prisma.payment.aggregate({
            _sum: { amount: true },
            where: {
              planId: plan.id,
              status: { in: PAID_PAYMENT_STATUSES },
            },
          }),
        ]);
        return {
          plan: plan.name,
          users: userCount,
          revenue: Number(revenueAgg._sum.amount || 0),
        };
      })
    );

    return NextResponse.json({
      totalUsers,
      activeSubscriptions,
      totalRevenue,
      monthlyRevenue,
      userGrowthData,
      revenueTrendData,
      planDistributionData,
    });
  } catch (error) {
    console.error('Analytics overview error:', error);
    return NextResponse.json(
      { error: 'Failed to load analytics' },
      { status: 500 }
    );
  }
}
