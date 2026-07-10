import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/admin/devices?filter=all|low|medium|high|blocked
 * 
 * Admin-only endpoint to fetch device fingerprints
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const adminUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { isAdmin: true } as any,
    });

    if (!(adminUser as any)?.isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get filter from query params
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter') || 'all';

    // Build where clause
    const where: any = {};
    
    if (filter === 'blocked') {
      where.isBlocked = true;
    } else if (filter === 'low' || filter === 'medium' || filter === 'high') {
      where.riskLevel = filter;
      where.isBlocked = false;
    }

    // Fetch devices
    const devices = await prisma.deviceFingerprint.findMany({
      where,
      orderBy: [
        { isBlocked: 'desc' },
        { riskLevel: 'desc' },
        { signupCount: 'desc' },
        { lastSeenAt: 'desc' },
      ],
      take: 100, // Limit to 100 most relevant
    });

    return NextResponse.json({ devices }, { status: 200 });
  } catch (error) {
    console.error('Admin devices fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch devices' },
      { status: 500 }
    );
  }
}
