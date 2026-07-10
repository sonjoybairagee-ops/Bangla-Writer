import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma'; // ⚠️ path check করুন

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

    const { searchParams } = new URL(req.url);
    const filter = searchParams.get('filter') || 'all'; // filters by content type
    const sort = searchParams.get('sort') || 'viralScore'; // viralScore | date

    const where: any = { userId: user.id };
    if (filter !== 'all') {
      where.type = { equals: filter, mode: 'insensitive' };
    }

    const orderBy =
      sort === 'date'
        ? { createdAt: 'desc' as const }
        : { viralScore: 'desc' as const };

    const scripts = await prisma.script.findMany({
      where,
      orderBy,
      select: {
        id: true,
        title: true,
        type: true,
        platform: true,
        viralScore: true,
        createdAt: true,
      },
      take: 50,
    });

    // NOTE: এই প্রজেক্টে এখনো real views/likes/comments/shares/reach ডেটা
    // ট্র্যাক করার কোনো টেবিল/social API integration নেই, তাই fabricate না করে
    // শুধু বাস্তবে যা আছে (title, type, platform, viralScore, date) তাই রিটার্ন করা হচ্ছে।
    const content = scripts.map((s) => ({
      id: s.id,
      title: s.title,
      type: s.type,
      platform: s.platform,
      viralScore: s.viralScore,
      date: s.createdAt,
    }));

    return NextResponse.json({
      success: true,
      content,
      total: content.length,
    });
  } catch (error) {
    console.error('Content performance error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content performance' },
      { status: 500 }
    );
  }
}
