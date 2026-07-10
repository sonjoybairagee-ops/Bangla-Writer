import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma'; // ⚠️ path check করুন — আপনার প্রজেক্টে Prisma client কোথায় export হয় (হতে পারে @/lib/db)

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    const userId = user.id;

    const { searchParams } = new URL(req.url);
    const range = searchParams.get('range') || '30d';
    const days = range === '7d' ? 7 : range === '90d' ? 90 : 30;

    const now = new Date();
    const rangeStart = new Date(now);
    rangeStart.setDate(rangeStart.getDate() - days);

    const prevRangeStart = new Date(rangeStart);
    prevRangeStart.setDate(prevRangeStart.getDate() - days);

    // ---- Current period counts ----
    const [totalScripts, totalContentPlans, prevScripts, prevContentPlans] = await Promise.all([
      prisma.script.count({ where: { userId, createdAt: { gte: rangeStart } } }),
      prisma.contentPlan.count({ where: { userId, createdAt: { gte: rangeStart } } }),
      prisma.script.count({ where: { userId, createdAt: { gte: prevRangeStart, lt: rangeStart } } }),
      prisma.contentPlan.count({ where: { userId, createdAt: { gte: prevRangeStart, lt: rangeStart } } }),
    ]);

    // ---- Viral score average (current vs previous period) ----
    const [viralAggCurrent, viralAggPrev] = await Promise.all([
      prisma.script.aggregate({
        where: { userId, createdAt: { gte: rangeStart }, viralScore: { not: null } },
        _avg: { viralScore: true },
      }),
      prisma.script.aggregate({
        where: { userId, createdAt: { gte: prevRangeStart, lt: rangeStart }, viralScore: { not: null } },
        _avg: { viralScore: true },
      }),
    ]);

    const avgViralScore = Math.round(viralAggCurrent._avg.viralScore || 0);
    const prevAvgViralScore = Math.round(viralAggPrev._avg.viralScore || 0);

    // ---- High-viral content count (viralScore >= 70) ----
    const [highViralCount, prevHighViralCount] = await Promise.all([
      prisma.script.count({
        where: { userId, createdAt: { gte: rangeStart }, viralScore: { gte: 70 } },
      }),
      prisma.script.count({
        where: { userId, createdAt: { gte: prevRangeStart, lt: rangeStart }, viralScore: { gte: 70 } },
      }),
    ]);

    // ---- % change helpers ----
    const pctChange = (current: number, prev: number) => {
      if (prev === 0) return current > 0 ? 100 : 0;
      return Number((((current - prev) / prev) * 100).toFixed(1));
    };

    // ---- Platform breakdown (real) ----
    const platformGroups = await prisma.script.groupBy({
      by: ['platform'],
      where: { userId, createdAt: { gte: rangeStart } },
      _count: { _all: true },
    });
    const platforms = platformGroups
      .map((p) => ({ name: p.platform, count: p._count._all }))
      .sort((a, b) => b.count - a.count);

    // ---- Content type breakdown (real) ----
    const typeGroups = await prisma.script.groupBy({
      by: ['type'],
      where: { userId, createdAt: { gte: rangeStart } },
      _count: { _all: true },
    });
    const contentTypes = typeGroups
      .map((t) => ({ type: t.type, count: t._count._all }))
      .sort((a, b) => b.count - a.count);

    // ---- Daily content-creation trend (real, replaces fake "engagement over time") ----
    const scriptsInRange = await prisma.script.findMany({
      where: { userId, createdAt: { gte: rangeStart } },
      select: { createdAt: true, viralScore: true },
    });

    const dailyMap = new Map<string, { count: number; viralSum: number; viralCount: number }>();
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      dailyMap.set(key, { count: 0, viralSum: 0, viralCount: 0 });
    }
    for (const s of scriptsInRange) {
      const key = s.createdAt.toISOString().split('T')[0];
      const entry = dailyMap.get(key);
      if (entry) {
        entry.count += 1;
        if (s.viralScore != null) {
          entry.viralSum += s.viralScore;
          entry.viralCount += 1;
        }
      }
    }
    const contentOverTime = Array.from(dailyMap.entries()).map(([date, v]) => ({
      date,
      contentCreated: v.count,
      avgViralScore: v.viralCount > 0 ? Math.round(v.viralSum / v.viralCount) : 0,
    }));

    // ---- Top performing content (real, ranked by viralScore) ----
    const topContentRaw = await prisma.script.findMany({
      where: { userId, viralScore: { not: null } },
      orderBy: { viralScore: 'desc' },
      take: 5,
      select: {
        id: true,
        title: true,
        type: true,
        platform: true,
        viralScore: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      range,
      metrics: {
        totalScripts,
        totalScriptsChange: pctChange(totalScripts, prevScripts),
        totalContentPlans,
        totalContentPlansChange: pctChange(totalContentPlans, prevContentPlans),
        avgViralScore,
        avgViralScoreChange: pctChange(avgViralScore, prevAvgViralScore),
        highViralCount,
        highViralCountChange: pctChange(highViralCount, prevHighViralCount),
        platforms,
        contentTypes,
        contentOverTime,
        topContent: topContentRaw,
      },
    });
  } catch (error) {
    console.error('Analytics overview error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
