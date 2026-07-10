import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * POST /api/admin/devices/[id]/block
 * Body: { block: boolean }
 * 
 * Admin-only endpoint to block/unblock a device
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id: deviceId } = await params;
    const body = await req.json();
    const { block } = body;

    if (typeof block !== 'boolean') {
      return NextResponse.json(
        { error: 'block must be a boolean' },
        { status: 400 }
      );
    }

    // Update device
    const device = await prisma.deviceFingerprint.update({
      where: { id: deviceId },
      data: {
        isBlocked: block,
        blockedAt: block ? new Date() : null,
        blockedReason: block
          ? 'Manually blocked by admin'
          : null,
        riskLevel: block ? 'high' : 'medium',
      },
    });

    return NextResponse.json({
      success: true,
      message: `Device ${block ? 'blocked' : 'unblocked'} successfully`,
      device,
    });
  } catch (error) {
    console.error('Device block/unblock error:', error);
    return NextResponse.json(
      { error: 'Failed to update device' },
      { status: 500 }
    );
  }
}
