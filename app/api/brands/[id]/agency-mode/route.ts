import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const brandId = params.id;
    const { isClientBrand } = await req.json();

    // Get brand and verify ownership
    const brand = await prisma.brand.findFirst({
      where: {
        id: brandId,
        user: {
          email: session.user.email,
        },
      },
    });

    if (!brand) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
    }

    // Update brand agency mode
    await prisma.brand.update({
      where: { id: brandId },
      data: {
        isClientBrand: isClientBrand,
      },
    });

    return NextResponse.json({
      success: true,
      isClientBrand,
    });
  } catch (error) {
    console.error('Failed to toggle agency mode:', error);
    return NextResponse.json(
      { error: 'Failed to toggle agency mode' },
      { status: 500 }
    );
  }
}
