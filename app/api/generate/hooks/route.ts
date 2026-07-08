import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generateJSON } from '@/lib/ai/openai';
import { createHookGeneratorPrompt } from '@/lib/ai/prompts/content-writer';
import { canGenerateHook } from '@/lib/constants/pricing';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { topic, platform, audience, hookType, count = 10 } = body;

    // Check usage limits
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: session.user.id,
        status: 'active',
      },
    });

    const planId = subscription?.planId || 'starter';

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

    if (usage && !canGenerateHook(usage, planId)) {
      return NextResponse.json(
        { error: 'Monthly hook limit reached. Upgrade your plan.' },
        { status: 403 }
      );
    }

    // Generate hooks
    const prompt = createHookGeneratorPrompt({
      topic,
      platform,
      audience,
      hookType,
      count,
    });

    const generatedHooks = await generateJSON(prompt, {
      model: 'gpt-4o',
      temperature: 0.9,
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
        hooksGenerated: {
          increment: count,
        },
      },
      create: {
        userId: session.user.id,
        month: currentDate.getMonth() + 1,
        year: currentDate.getFullYear(),
        hooksGenerated: count,
      },
    });

    return NextResponse.json({
      success: true,
      hooks: generatedHooks.hooks,
    });
  } catch (error) {
    console.error('Hook generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate hooks' },
      { status: 500 }
    );
  }
}
