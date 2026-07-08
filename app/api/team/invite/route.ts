import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { teamId, email, role } = body;

    if (!teamId || !email || !role) {
      return NextResponse.json(
        { error: 'Team ID, email, and role are required' },
        { status: 400 }
      );
    }

    if (!['admin', 'member', 'creator'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be: admin, member, or creator' },
        { status: 400 }
      );
    }

    // Check if user has permission to invite
    const teamMember = await prisma.teamMember.findFirst({
      where: {
        teamId,
        userId: session.user.id,
        canManageTeam: true,
      },
      include: {
        team: true,
      },
    });

    if (!teamMember) {
      return NextResponse.json(
        { error: 'You do not have permission to invite members' },
        { status: 403 }
      );
    }

    // Check team member limit
    const memberCount = await prisma.teamMember.count({
      where: { teamId },
    });

    if (memberCount >= teamMember.team.maxMembers) {
      return NextResponse.json(
        { error: `Team has reached maximum member limit (${teamMember.team.maxMembers})` },
        { status: 400 }
      );
    }

    // Check if email is already a team member
    const existingMember = await prisma.teamMember.findFirst({
      where: {
        teamId,
        user: {
          email,
        },
      },
    });

    if (existingMember) {
      return NextResponse.json(
        { error: 'This email is already a team member' },
        { status: 400 }
      );
    }

    // Check if there's already a pending invitation
    const existingInvitation = await prisma.teamInvitation.findFirst({
      where: {
        teamId,
        email,
        status: 'pending',
      },
    });

    if (existingInvitation) {
      return NextResponse.json(
        { error: 'An invitation has already been sent to this email' },
        { status: 400 }
      );
    }

    // Check if receiver user exists
    const receiverUser = await prisma.user.findUnique({
      where: { email },
    });

    // Create invitation (expires in 7 days)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const invitation = await prisma.teamInvitation.create({
      data: {
        teamId,
        senderId: session.user.id,
        email,
        role,
        receiverId: receiverUser?.id,
        expiresAt,
      },
      include: {
        team: true,
        sender: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    // TODO: Send invitation email
    // await sendInvitationEmail({
    //   to: email,
    //   teamName: invitation.team.name,
    //   senderName: invitation.sender.name,
    //   invitationToken: invitation.token,
    //   role: invitation.role,
    // });

    return NextResponse.json({
      success: true,
      invitation: {
        id: invitation.id,
        email: invitation.email,
        role: invitation.role,
        token: invitation.token,
        expiresAt: invitation.expiresAt,
      },
    });
  } catch (error: any) {
    console.error('Team invitation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send invitation' },
      { status: 500 }
    );
  }
}
