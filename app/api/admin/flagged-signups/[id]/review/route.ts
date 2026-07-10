import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { decision, notes } = await req.json();

    if (!['approve', 'reject', 'block'].includes(decision)) {
      return NextResponse.json({ error: 'Invalid decision' }, { status: 400 });
    }

    // Get flagged signup
    const flagged = await prisma.flaggedSignup.findUnique({
      where: { id: params.id },
      include: { user: true },
    });

    if (!flagged) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    // Update flagged signup
    await prisma.flaggedSignup.update({
      where: { id: params.id },
      data: {
        status: decision === 'approve' ? 'approved' : decision === 'block' ? 'blocked' : 'rejected',
        reviewedBy: session.user.id,
        reviewedAt: new Date(),
        reviewNotes: notes || null,
        adminDecision: decision === 'approve' ? 'allow' : decision === 'block' ? 'block' : 'monitor',
      },
    });

    // If blocked, deactivate user account
    if (decision === 'block') {
      await prisma.user.update({
        where: { id: flagged.userId },
        data: {
          // We don't have isActive field, so we can delete subscriptions
          subscriptions: {
            updateMany: {
              where: { userId: flagged.userId },
              data: { status: 'cancelled' },
            },
          },
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin review error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
