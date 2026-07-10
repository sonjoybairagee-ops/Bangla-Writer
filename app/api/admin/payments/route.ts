import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if admin
    const adminUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (adminUser?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get status filter from query params
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || 'pending';

    // Build where clause
    let where: any = {};
    
    if (status === 'pending') {
      where.status = 'pending';
    } else if (status === 'verified') {
      where.status = 'verified';
    } else if (status === 'rejected') {
      where.status = 'rejected';
    }
    // 'all' = no filter

    // Fetch payments
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
              select: { id: true },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 100, // Limit to latest 100
    });

    return NextResponse.json({ 
      payments,
      count: payments.length,
    });

  } catch (error) {
    console.error('Admin payments fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payments' },
      { status: 500 }
    );
  }
}
