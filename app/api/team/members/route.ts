import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET - Fetch team members and invitations
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const teamId = searchParams.get('teamId');

    if (!teamId) {
      return NextResponse.json({ error: 'Team ID is required' }, { status: 400 });
    }

    // Check if user is a team member
    const userMembership = await prisma.teamMember.findFirst({
      where: {
        teamId,
        userId: session.user.id,
      },
    });

    if (!userMembership) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Fetch team details
    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
          orderBy: {
            joinedAt: 'asc',
          },
        },
        invitations: {
          where: {
            status: 'pending',
          },
          include: {
            sender: {
              select: {
                name: true,
                email: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    return NextResponse.json({
      team: {
        id: team.id,
        name: team.name,
        description: team.description,
        maxMembers: team.maxMembers,
        owner: team.owner,
      },
      members: team.members.map((m) => ({
        id: m.id,
        userId: m.user.id,
        name: m.user.name,
        email: m.user.email,
        image: m.user.image,
        role: m.role,
        canManageTeam: m.canManageTeam,
        canManageBrands: m.canManageBrands,
        canCreateContent: m.canCreateContent,
        canViewAnalytics: m.canViewAnalytics,
        joinedAt: m.joinedAt,
      })),
      invitations: team.invitations.map((inv) => ({
        id: inv.id,
        email: inv.email,
        role: inv.role,
        sender: inv.sender,
        createdAt: inv.createdAt,
        expiresAt: inv.expiresAt,
      })),
      userRole: userMembership.role,
      canManage: userMembership.canManageTeam,
    });
  } catch (error: any) {
    console.error('Fetch team members error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch team members' },
      { status: 500 }
    );
  }
}

// DELETE - Remove team member
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const memberId = searchParams.get('memberId');
    const teamId = searchParams.get('teamId');

    if (!memberId || !teamId) {
      return NextResponse.json(
        { error: 'Member ID and Team ID are required' },
        { status: 400 }
      );
    }

    // Check if user has permission to remove members
    const userMembership = await prisma.teamMember.findFirst({
      where: {
        teamId,
        userId: session.user.id,
        canManageTeam: true,
      },
    });

    if (!userMembership) {
      return NextResponse.json(
        { error: 'You do not have permission to remove members' },
        { status: 403 }
      );
    }

    // Get member to remove
    const memberToRemove = await prisma.teamMember.findUnique({
      where: { id: memberId },
      include: { team: true },
    });

    if (!memberToRemove || memberToRemove.teamId !== teamId) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    // Cannot remove team owner
    if (memberToRemove.userId === memberToRemove.team.ownerId) {
      return NextResponse.json(
        { error: 'Cannot remove team owner' },
        { status: 400 }
      );
    }

    // Remove member
    await prisma.teamMember.delete({
      where: { id: memberId },
    });

    return NextResponse.json({
      success: true,
      message: 'Member removed successfully',
    });
  } catch (error: any) {
    console.error('Remove team member error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to remove member' },
      { status: 500 }
    );
  }
}
