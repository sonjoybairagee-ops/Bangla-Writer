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

    // Check if user has Pro or Agency plan
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: session.user.id,
        status: 'active',
        planId: { in: ['pro', 'agency'] },
      },
    });

    if (!subscription) {
      return NextResponse.json(
        { error: 'Pro or Agency plan required to create a team' },
        { status: 403 }
      );
    }

    // Set max members based on plan
    let defaultMaxMembers = 2; // Pro plan default
    if (subscription.planId === 'agency') {
      defaultMaxMembers = 5; // Agency plan default
    }

    const body = await req.json();
    const { name, description, maxMembers = defaultMaxMembers } = body;

    if (!name) {
      return NextResponse.json({ error: 'Team name is required' }, { status: 400 });
    }

    // Check if user already has a team
    const existingTeam = await prisma.team.findFirst({
      where: { ownerId: session.user.id },
    });

    if (existingTeam) {
      return NextResponse.json(
        { error: 'You already have a team. Delete it first to create a new one.' },
        { status: 400 }
      );
    }

    // Create team
    const team = await prisma.team.create({
      data: {
        ownerId: session.user.id,
        name,
        description,
        maxMembers,
      },
    });

    // Add owner as admin member
    await prisma.teamMember.create({
      data: {
        teamId: team.id,
        userId: session.user.id,
        role: 'admin',
        canManageTeam: true,
        canManageBrands: true,
        canCreateContent: true,
        canViewAnalytics: true,
      },
    });

    return NextResponse.json({
      success: true,
      team: {
        id: team.id,
        name: team.name,
        description: team.description,
      },
    });
  } catch (error: any) {
    console.error('Team creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create team' },
      { status: 500 }
    );
  }
}
