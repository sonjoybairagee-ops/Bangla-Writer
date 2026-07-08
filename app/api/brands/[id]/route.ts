import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET single brand
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const brand = await prisma.brand.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!brand) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
    }

    return NextResponse.json({ brand });
  } catch (error) {
    console.error('Get brand error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch brand' },
      { status: 500 }
    );
  }
}

// UPDATE brand
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

    const brand = await prisma.brand.updateMany({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      data: body,
    });

    if (brand.count === 0) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
    }

    const updatedBrand = await prisma.brand.findUnique({
      where: { id: params.id },
    });

    return NextResponse.json({ brand: updatedBrand });
  } catch (error) {
    console.error('Update brand error:', error);
    return NextResponse.json(
      { error: 'Failed to update brand' },
      { status: 500 }
    );
  }
}

// DELETE brand
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Soft delete
    const brand = await prisma.brand.updateMany({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      data: {
        isActive: false,
      },
    });

    if (brand.count === 0) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Brand deleted successfully' });
  } catch (error) {
    console.error('Delete brand error:', error);
    return NextResponse.json(
      { error: 'Failed to delete brand' },
      { status: 500 }
    );
  }
}
