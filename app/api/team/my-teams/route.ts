import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get teams where user is a member (including owned teams)
    const memberships = await prisma.teamMember.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        team: {
          include: {
            owner: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            _count: {
              select: {
                members: true,
              },
            },
          },
        },
      },
      orderBy: {
        joinedAt: 'asc',
      },
    });

    const teams = memberships.map((membership) => ({
      id: membership.team.id,
      name: membership.team.name,
      description: membership.team.description,
      owner: membership.team.owner,
      memberCount: membership.team._count.members,
      maxMembers: membership.team.maxMembers,
      userRole: membership.role,
      canManage: membership.canManageTeam,
      joinedAt: membership.joinedAt,
    }));

    return NextResponse.json({ teams });
  } catch (error: any) {
    console.error('Fetch my teams error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch teams' },
      { status: 500 }
    );
  }
}
