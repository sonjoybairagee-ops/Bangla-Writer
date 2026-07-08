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
    const { clientName, clientEmail, clientCompany, accessLevel } = await req.json();

    if (!clientName || !clientEmail) {
      return NextResponse.json(
        { error: 'Client name and email are required' },
        { status: 400 }
      );
    }

    // Validate access level
    const validAccessLevels = ['view', 'comment', 'edit'];
    if (accessLevel && !validAccessLevels.includes(accessLevel)) {
      return NextResponse.json(
        { error: 'Invalid access level' },
        { status: 400 }
      );
    }

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

    // Update brand with client information
    await prisma.brand.update({
      where: { id: brandId },
      data: {
        clientName,
        clientEmail,
        clientCompany: clientCompany || null,
        accessLevel: accessLevel || 'view',
      },
    });

    return NextResponse.json({
      success: true,
      clientInfo: {
        clientName,
        clientEmail,
        clientCompany,
        accessLevel,
      },
    });
  } catch (error) {
    console.error('Failed to save client info:', error);
    return NextResponse.json(
      { error: 'Failed to save client information' },
      { status: 500 }
    );
  }
}
