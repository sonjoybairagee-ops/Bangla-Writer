import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET single script
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const script = await prisma.script.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      include: {
        brand: true,
      },
    });

    if (!script) {
      return NextResponse.json({ error: 'Script not found' }, { status: 404 });
    }

    return NextResponse.json({ script });
  } catch (error) {
    console.error('Get script error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch script' },
      { status: 500 }
    );
  }
}

// UPDATE script
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();

    const script = await prisma.script.updateMany({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      data: body,
    });

    if (script.count === 0) {
      return NextResponse.json({ error: 'Script not found' }, { status: 404 });
    }

    const updatedScript = await prisma.script.findUnique({
      where: { id: params.id },
    });

    return NextResponse.json({ script: updatedScript });
  } catch (error) {
    console.error('Update script error:', error);
    return NextResponse.json(
      { error: 'Failed to update script' },
      { status: 500 }
    );
  }
}

// DELETE script
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const script = await prisma.script.deleteMany({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (script.count === 0) {
      return NextResponse.json({ error: 'Script not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Script deleted successfully' });
  } catch (error) {
    console.error('Delete script error:', error);
    return NextResponse.json(
      { error: 'Failed to delete script' },
      { status: 500 }
    );
  }
}
