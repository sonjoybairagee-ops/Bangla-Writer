import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generateJSON } from '@/lib/ai/openai';
import { createContentWriterPrompt, createBrandVoicePrompt } from '@/lib/ai/prompts/content-writer';
import { canGenerateScript } from '@/lib/constants/pricing';

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

    if (usage && !canGenerateScript(usage, planId)) {
      return NextResponse.json(
        { error: 'Monthly script limit reached. Upgrade your plan.' },
        { status: 403 }
      );
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
          scriptsGenerated: {
            increment: 1,
          },
        },
        create: {
          userId: session.user.id,
          month: currentDate.getMonth() + 1,
          year: currentDate.getFullYear(),
          scriptsGenerated: 1,
        },
      });
    }

    return NextResponse.json({
      success: true,
      content: generatedContent,
      scriptId: script?.id,
    });
  } catch (error) {
    console.error('Content generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    );
  }
}
