import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * Daily cron job — flips subscriptions whose currentPeriodEnd has passed
 * from 'active' to 'expired'. This is the "source of truth" fix for trial
 * expiry: usage-limits.ts already blocks generation for expired periods
 * (defense-in-depth), but without this job the subscription row — and
 * therefore any UI that reads `status` directly (e.g. a "Plan: Active ✅"
 * badge) — would keep showing 'active' forever after the 7-day trial ends.
 *
 * Vercel Cron calls this with GET and includes an Authorization header
 * matching CRON_SECRET (set the same value in your Vercel project's
 * environment variables and in vercel.json below).
 */
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const now = new Date();

    const result = await prisma.subscription.updateMany({
      where: {
        status: 'active',
        currentPeriodEnd: { lt: now },
      },
      data: {
        status: 'expired',
      },
    });

    console.log(`[expire-trials cron] Expired ${result.count} subscription(s) at ${now.toISOString()}`);

    return NextResponse.json({
      success: true,
      expiredCount: result.count,
      ranAt: now.toISOString(),
    });
  } catch (error) {
    console.error('[expire-trials cron] Failed:', error);
    return NextResponse.json({ error: 'Failed to expire subscriptions' }, { status: 500 });
  }
}
