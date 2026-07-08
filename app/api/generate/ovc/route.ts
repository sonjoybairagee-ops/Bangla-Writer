import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generateJSON } from '@/lib/ai/openai';
import { createOVCDirectorPrompt } from '@/lib/ai/prompts/ovc-director';
import { getPlanLimits } from '@/lib/constants/pricing';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
      brand,
      product,
      scriptBrief,
      offer,
      budget,
      duration,
      videoType,
      storyStyle,
      platform,
      targetAudience,
      goal,
      brandId,
      visualStyle,
      mood,
      saveToLibrary = true,
    } = body;

    // Check if user has access to OVC Director (Pro+ feature)
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: session.user.id,
        status: 'active',
      },
    });

    const planId = subscription?.planId || 'starter';
    const limits = getPlanLimits(planId);

    if (limits.ovc_scenes === 0) {
      return NextResponse.json(
        { error: 'OVC Director is a Pro feature. Upgrade your plan.' },
        { status: 403 }
      );
    }

    // Check usage limits
    const currentDate = new Date();
    const usage = await prisma.usage.findUnique({
      where: {
        userId_month_year: {
          userId: session.user.id,
          month: currentDate.getMonth() + 1,
          year: currentDate.getFullYear(),
        },
      },
    });

    if (
      usage &&
      limits.ovc_scenes !== -1 &&
      usage.ovcScenesGenerated >= limits.ovc_scenes
    ) {
      return NextResponse.json(
        { error: 'Monthly OVC scene limit reached.' },
        { status: 403 }
      );
    }

    // Generate OVC breakdown
    const prompt = createOVCDirectorPrompt({
      brand,
      product,
      scriptBrief,
      targetAudience,
      duration,
      videoType,
      storyStyle,
      budget,
      goal,
      offer,
      visualStyle,
      mood,
      platform,
    });

    const ovcBreakdown = await generateJSON(prompt, {
      model: 'gpt-4o',
      temperature: 0.7,
    });

    const sceneCount = ovcBreakdown.scenes?.length || 0;

    // Save to library if requested
    let script = null;
    if (saveToLibrary) {
      script = await prisma.script.create({
        data: {
          userId: session.user.id,
          brandId: brandId || null,
          title: ovcBreakdown.title || `${product} - ${videoType} Video`,
          type: 'ovc',
          platform: platform || videoType,
          scenes: ovcBreakdown,
          duration,
          goal,
          tone: storyStyle,
        },
      });

      // Update usage
      await prisma.usage.upsert({
        where: {
          userId_month_year: {
            userId: session.user.id,
            month: currentDate.getMonth() + 1,
            year: currentDate.getFullYear(),
          },
        },
        update: {
          ovcScenesGenerated: {
            increment: sceneCount,
          },
        },
        create: {
          userId: session.user.id,
          month: currentDate.getMonth() + 1,
          year: currentDate.getFullYear(),
          ovcScenesGenerated: sceneCount,
        },
      });
    }

    return NextResponse.json({
      success: true,
      ovc: ovcBreakdown,
      scriptId: script?.id,
      sceneCount,
    });
  } catch (error) {
    console.error('OVC generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate OVC breakdown' },
      { status: 500 }
    );
  }
}
