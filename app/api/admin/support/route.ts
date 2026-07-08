import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET - Fetch all tickets (admin only)
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (user?.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || 'all';
    const priority = searchParams.get('priority') || 'all';

    const tickets = await prisma.supportTicket.findMany({
      where: {
        ...(status !== 'all' && { status }),
        ...(priority !== 'all' && { priority }),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        assignedTo: {
          select: {
            name: true,
            email: true,
          },
        },
        messages: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
                role: true,
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
        _count: {
          select: {
            messages: true,
          },
        },
      },
      orderBy: [
        { status: 'asc' }, // Open tickets first
        { priority: 'desc' }, // Critical first
        { createdAt: 'desc' },
      ],
    });

    return NextResponse.json({ tickets });
  } catch (error: any) {
    console.error('Fetch admin tickets error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch tickets' },
      { status: 500 }
    );
  }
}

// PATCH - Update ticket (assign, change status, close)
export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (user?.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const body = await req.json();
    const { ticketId, action, assignedToId, status, priority } = body;

    if (!ticketId || !action) {
      return NextResponse.json(
        { error: 'Ticket ID and action are required' },
        { status: 400 }
      );
    }

    let updateData: any = {};

    switch (action) {
      case 'assign':
        if (!assignedToId) {
          return NextResponse.json({ error: 'Assignee ID required' }, { status: 400 });
        }
        updateData = {
          assignedToId,
          assignedAt: new Date(),
          status: 'in_progress',
        };
        break;

      case 'updateStatus':
        if (!status) {
          return NextResponse.json({ error: 'Status required' }, { status: 400 });
        }
        updateData = { status };
        if (status === 'resolved') {
          updateData.resolvedAt = new Date();
        } else if (status === 'closed') {
          updateData.closedAt = new Date();
        }
        break;

      case 'updatePriority':
        if (!priority) {
          return NextResponse.json({ error: 'Priority required' }, { status: 400 });
        }
        updateData = { priority };
        break;

      case 'close':
        updateData = {
          status: 'closed',
          closedAt: new Date(),
        };
        break;

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const ticket = await prisma.supportTicket.update({
      where: { id: ticketId },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      ticket,
    });
  } catch (error: any) {
    console.error('Update ticket error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update ticket' },
      { status: 500 }
    );
  }
}
