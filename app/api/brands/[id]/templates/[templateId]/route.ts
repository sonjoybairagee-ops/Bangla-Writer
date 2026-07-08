import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string; templateId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const brandId = params.id;
    const templateId = params.templateId;

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

    // Remove template from templates array
    const currentTemplates = ((brand as any).templates as any[]) || [];
    const updatedTemplates = currentTemplates.filter((template) => template.id !== templateId);

    if (currentTemplates.length === updatedTemplates.length) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    await prisma.brand.update({
      where: { id: brandId },
      data: {
        templates: updatedTemplates as any,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Template deleted successfully',
    });
  } catch (error) {
    console.error('Failed to delete template:', error);
    return NextResponse.json(
      { error: 'Failed to delete template' },
      { status: 500 }
    );
  }
}
