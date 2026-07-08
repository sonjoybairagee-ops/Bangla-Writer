import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const brandId = params.id;

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

    // Get voice profile from brand's voiceProfile field
    const voiceProfile = (brand as any).voiceProfile || null;

    return NextResponse.json({
      success: true,
      profile: voiceProfile,
    });
  } catch (error) {
    console.error('Failed to fetch voice profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch voice profile' },
      { status: 500 }
    );
  }
}
