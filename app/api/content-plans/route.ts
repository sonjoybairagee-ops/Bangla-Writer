import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET all content plans
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const contentPlans = await prisma.contentPlan.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        brand: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ contentPlans });
  } catch (error) {
    console.error('Get content plans error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content plans' },
      { status: 500 }
    );
  }
}
