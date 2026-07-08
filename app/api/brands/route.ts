import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const brandSchema = z.object({
  name: z.string().min(2),
  industry: z.string().optional(),
  niche: z.string().optional(),
  description: z.string().optional(),
  mission: z.string().optional(),
  vision: z.string().optional(),
  usp: z.string().optional(),
  tagline: z.string().optional(),
  tone: z.array(z.string()).optional(),
  voice: z.string().optional(),
  writingStyle: z.string().optional(),
  targetAudience: z.string().optional(),
  painPoints: z.array(z.string()).optional(),
  keywords: z.array(z.string()).optional(),
  competitors: z.array(z.string()).optional(),
  forbiddenWords: z.array(z.string()).optional(),
  preferredWords: z.array(z.string()).optional(),
  brandColors: z.array(z.string()).optional(),
});

// GET all brands
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const brands = await prisma.brand.findMany({
      where: {
        userId: session.user.id,
        isActive: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ brands });
  } catch (error) {
    console.error('Get brands error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch brands' },
      { status: 500 }
    );
  }
}

// CREATE new brand
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = brandSchema.parse(body);

    // Check brand profile limit based on subscription
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: session.user.id,
        status: 'active',
      },
    });

    const planId = subscription?.planId || 'starter';
    const brandCount = await prisma.brand.count({
      where: {
        userId: session.user.id,
        isActive: true,
      },
    });

    // Simple limit check (should use getPlanLimits)
    const limits: Record<string, number> = {
      starter: 1,
      pro: 3,
      agency: 5,
    };

    if (brandCount >= (limits[planId] || 1)) {
      return NextResponse.json(
        { error: 'Brand profile limit reached. Upgrade your plan.' },
        { status: 403 }
      );
    }

    const brand = await prisma.brand.create({
      data: {
        ...validatedData,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ brand }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error('Create brand error:', error);
    return NextResponse.json(
      { error: 'Failed to create brand' },
      { status: 500 }
    );
  }
}
