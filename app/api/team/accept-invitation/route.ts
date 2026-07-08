import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || !session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json({ error: 'Invitation token is required' }, { status: 400 });
    }

    // Find invitation
    const invitation = await prisma.teamInvitation.findUnique({
      where: { token },
      include: {
        team: true,
      },
    });

    if (!invitation) {
      return NextResponse.json({ error: 'Invalid invitation' }, { status: 404 });
    }

    // Check if invitation is for this user's email
    if (invitation.email !== session.user.email) {
      return NextResponse.json(
        { error: 'This invitation was sent to a different email address' },
        { status: 403 }
      );
    }

    // Check if already accepted
    if (invitation.status !== 'pending') {
      return NextResponse.json(
        { error: `Invitation has already been ${invitation.status}` },
        { status: 400 }
      );
    }

    // Check if expired
    if (new Date() > invitation.expiresAt) {
      await prisma.teamInvitation.update({
        where: { id: invitation.id },
        data: { status: 'expired' },
      });
      return NextResponse.json({ error: 'Invitation has expired' }, { status: 400 });
    }

    // Check if user is already a member
    const existingMember = await prisma.teamMember.findFirst({
      where: {
        teamId: invitation.teamId,
        userId: session.user.id,
      },
    });

    if (existingMember) {
      return NextResponse.json(
        { error: 'You are already a member of this team' },
        { status: 400 }
      );
    }

    // Set permissions based on role
    let permissions = {
      canManageTeam: false,
      canManageBrands: true,
      canCreateContent: true,
      canViewAnalytics: true,
    };

    if (invitation.role === 'admin') {
      permissions.canManageTeam = true;
    } else if (invitation.role === 'creator') {
      permissions.canManageBrands = false;
    }

    // Create team member
    const teamMember = await prisma.teamMember.create({
      data: {
        teamId: invitation.teamId,
        userId: session.user.id,
        role: invitation.role,
        ...permissions,
      },
    });

    // Update invitation status
    await prisma.teamInvitation.update({
      where: { id: invitation.id },
      data: {
        status: 'accepted',
        receiverId: session.user.id,
        respondedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Successfully joined the team',
      team: {
        id: invitation.team.id,
        name: invitation.team.name,
        role: teamMember.role,
      },
    });
  } catch (error: any) {
    console.error('Accept invitation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to accept invitation' },
      { status: 500 }
    );
  }
}
