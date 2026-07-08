import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET all scripts
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const platform = searchParams.get('platform');
    const brandId = searchParams.get('brandId');
    const folder = searchParams.get('folder');
    const search = searchParams.get('search');

    const where: any = {
      userId: session.user.id,
    };

    if (type) where.type = type;
    if (platform) where.platform = platform;
    if (brandId) where.brandId = brandId;
    if (folder) where.folder = folder;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { caption: { contains: search, mode: 'insensitive' } },
      ];
    }

    const scripts = await prisma.script.findMany({
      where,
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

    return NextResponse.json({ scripts });
  } catch (error) {
    console.error('Get scripts error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch scripts' },
      { status: 500 }
    );
  }
}

// CREATE script manually
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();

    const script = await prisma.script.create({
      data: {
        ...body,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ script }, { status: 201 });
  } catch (error) {
    console.error('Create script error:', error);
    return NextResponse.json(
      { error: 'Failed to create script' },
      { status: 500 }
    );
  }
}
