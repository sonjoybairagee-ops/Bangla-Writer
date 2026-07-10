import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/admin/payments?status=pending|verified|rejected|all
 * 
 * Admin-only endpoint to fetch payments with user details and referral discount info
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

    // Get status filter from query params
    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get('status') || 'all';

    // Build where clause
    const where: any = {};
    if (statusFilter !== 'all') {
      where.status = statusFilter;
    }

    // Fetch payments with user details and referral info
    const payments = await prisma.payment.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            hasLifetimeDiscount: true,
            lifetimeDiscountPercent: true,
            receivedReferrals: {
              select: { id: true }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 100 // Limit to 100 most recent
    });

    return NextResponse.json({ payments }, { status: 200 });
  } catch (error) {
    console.error('Admin payments fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payments' },
      { status: 500 }
    );
  }
}
