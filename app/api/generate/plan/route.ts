import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generateJSON } from '@/lib/ai/openai';
import { createContentPlanPrompt } from '@/lib/ai/prompts/content-writer';
import { checkUsageLimit, incrementUsage } from '@/lib/utils/usage-limits';
import { useBonusGeneration } from '@/lib/utils/referral';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
      brand,
      industry,
      goal,
      platform,
      duration = 30,
      contentStyle,
      tone,
      audience,
      brandId,
      name,
      language = 'bangla',
    } = body;

    // Check usage limits
    const usageCheck = await checkUsageLimit(session.user.id, 'plan');
    
    if (!usageCheck.allowed) {
      // Try to use bonus generation from referral rewards
      const usedBonus = await useBonusGeneration(session.user.id, 'plan');
      
      if (!usedBonus) {
        return NextResponse.json(
          { error: usageCheck.message || 'Monthly limit reached. Upgrade your plan.' },
          { status: 403 }
        );
      }
    }

    // Generate content plan
    const prompt = createContentPlanPrompt({
      brand,
      industry,
      goal,
      platform,
      duration,
      contentStyle,
      tone,
      audience,
      language,
    });

    const generatedPlan = await generateJSON(prompt, {
      model: 'gpt-4o',
      temperature: 0.7,
    });

    // Save content plan
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + duration);

    const contentPlan = await prisma.contentPlan.create({
      data: {
        userId: session.user.id,
        brandId: brandId || null,
        name: name || `${brand} - ${duration} Day Plan`,
        duration,
        platform,
        goal,
        postingFrequency: 1,
        contentStyle,
        plan: generatedPlan,
        startDate,
        endDate,
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
        contentPlansCreated: {
          increment: 1,
        },
      },
    });

    // Increment usage (if not using bonus)
    if (usageCheck.allowed) {
      await incrementUsage(session.user.id, 'plan');
    }

    return NextResponse.json({
      success: true,
      plan: generatedPlan,
      contentPlanId: contentPlan.id,
      usedBonus: !usageCheck.allowed,
    });
  } catch (error) {
    console.error('Content plan generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate content plan' },
      { status: 500 }
    );
  }
}
