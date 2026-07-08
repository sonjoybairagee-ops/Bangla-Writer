import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string; assetId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const brandId = params.id;
    const assetId = params.assetId;

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

    // Remove asset from assets array
    const currentAssets = ((brand as any).assets as any[]) || [];
    const updatedAssets = currentAssets.filter((asset) => asset.id !== assetId);

    if (currentAssets.length === updatedAssets.length) {
      return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
    }

    await prisma.brand.update({
      where: { id: brandId },
      data: {
        assets: updatedAssets as any,
      },
    });

    // In production, also delete the file from cloud storage here

    return NextResponse.json({
      success: true,
      message: 'Asset deleted successfully',
    });
  } catch (error) {
    console.error('Failed to delete asset:', error);
    return NextResponse.json(
      { error: 'Failed to delete asset' },
      { status: 500 }
    );
  }
}
