import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { brandId, name, type, description, content, variables, tags } = body;

    if (!brandId || !name || !type || !content) {
      return NextResponse.json(
        { error: 'brandId, name, type, and content are required' },
        { status: 400 }
      );
    }

    // Verify brand ownership
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

    // Validate template type
    const validTypes = ['caption', 'hook', 'cta', 'content'];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: 'Invalid template type' },
        { status: 400 }
      );
    }

    // Create template object
    const newTemplate = {
      id: `template_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      name,
      type,
      description: description || '',
      content,
      variables: variables || [],
      tags: tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Update brand templates
    const currentTemplates = ((brand as any).templates as any[]) || [];
    const updatedTemplates = [...currentTemplates, newTemplate];

    await prisma.brand.update({
      where: { id: brandId },
      data: {
        templates: updatedTemplates as any,
      },
    });

    return NextResponse.json({
      success: true,
      template: newTemplate,
    });
  } catch (error) {
    console.error('Template creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create template' },
      { status: 500 }
    );
  }
}
