import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generateJSON } from '@/lib/ai/openai';
import { createHookGeneratorPrompt } from '@/lib/ai/prompts/content-writer';
import { checkUsageLimit, incrementUsage } from '@/lib/utils/usage-limits';
import { useBonusGeneration } from '@/lib/utils/referral';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { topic, platform, audience, hookType, language = 'bangla', count = 10 } = body;

    // Check usage limits
    const usageCheck = await checkUsageLimit(session.user.id, 'hook');
    
    if (!usageCheck.allowed) {
      // Try to use bonus generation from referral rewards
      const usedBonus = await useBonusGeneration(session.user.id, 'hook');
      
      if (!usedBonus) {
        return NextResponse.json(
          { error: usageCheck.message || 'Monthly limit reached' },
          { status: 403 }
        );
      }
    }

    // Generate hooks
    const prompt = createHookGeneratorPrompt({
      topic,
      platform,
      audience,
      hookType,
      count,
      language,
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
      create: {
        userId: session.user.id,
        month: currentDate.getMonth() + 1,
        year: currentDate.getFullYear(),
        hooksGenerated: 1,
      },
      update: {
        hooksGenerated: {
          increment: 1,
        },
      },
    });

    // Increment usage (if not using bonus)
    if (usageCheck.allowed) {
      await incrementUsage(session.user.id, 'hook');
    }

    return NextResponse.json({
      success: true,
      hooks: generatedHooks.hooks,
      usedBonus: !usageCheck.allowed, // Let user know if bonus was used
    });
  } catch (error) {
    console.error('Hook generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate hooks' },
      { status: 500 }
    );
  }
}
