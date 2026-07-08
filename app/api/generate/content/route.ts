import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generateJSON } from '@/lib/ai/openai';
import { createContentWriterPrompt } from '@/lib/ai/prompts/content-writer';
import { createBrandVoicePrompt } from '@/lib/ai/prompts/brand-extractor';
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
      framework,
      product,
      platform,
      goal,
      tone,
      audience,
      duration,
      brandId,
      language = 'bangla',
      saveToLibrary = true,
    } = body;

    // Check usage limits
    const usageCheck = await checkUsageLimit(session.user.id, 'script');
    
    if (!usageCheck.allowed) {
      // Try to use bonus generation from referral rewards
      const usedBonus = await useBonusGeneration(session.user.id, 'script');
      
      if (!usedBonus) {
        return NextResponse.json(
          { error: usageCheck.message || 'Monthly limit reached. Upgrade your plan.' },
          { status: 403 }
        );
      }
    }

    // Get brand voice if brandId provided
    let brandVoice = '';
    let brand = null;

    if (brandId) {
      brand = await prisma.brand.findFirst({
        where: {
          id: brandId,
          userId: session.user.id,
        },
      });

      if (brand) {
        brandVoice = createBrandVoicePrompt(brand, platform);
      }
    }

    // Generate content
    const prompt = createContentWriterPrompt({
      framework,
      product,
      platform,
      goal,
      tone,
      audience,
      duration,
      brandVoice,
      language,
    });

    const generatedContent = await generateJSON(prompt, {
      model: 'gpt-4o',
      temperature: 0.8,
    });

    // Save to library if requested
    let script = null;
    if (saveToLibrary) {
      script = await prisma.script.create({
        data: {
          userId: session.user.id,
          brandId: brandId || null,
          title: `${platform} - ${goal} content`,
          type: 'post',
          platform,
          framework,
          hook: generatedContent.hook,
          body: generatedContent.body,
          cta: generatedContent.cta,
          caption: generatedContent.caption,
          hashtags: generatedContent.hashtags || [],
          voiceOver: generatedContent.voiceOver,
          screenText: generatedContent.screenText || [],
          bRoll: generatedContent.bRoll || [],
          duration,
          goal,
          tone,
          viralScore: generatedContent.viralScore || null,
        },
      });
    }

    // Increment usage (if not using bonus)
    if (usageCheck.allowed) {
      await incrementUsage(session.user.id, 'script');
    }

    return NextResponse.json({
      success: true,
      content: generatedContent,
      scriptId: script?.id,
      usedBonus: !usageCheck.allowed,
    });
  } catch (error) {
    console.error('Content generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    );
  }
}
