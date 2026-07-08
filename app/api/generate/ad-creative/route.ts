import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generateJSON } from '@/lib/ai/openai';
import { createAdCreativePrompt } from '@/lib/ai/prompts/creative-studio';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { product, offer, targetAudience, goal, platform, adFormat, language = 'bangla' } = body;

    if (!product || !goal || !platform || !adFormat) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check active subscription
    const subscription = await prisma.subscription.findFirst({
      where: { userId: session.user.id, status: 'active' },
    });

    const planId = subscription?.planId || 'starter';

    // Check usage
    const now = new Date();
    const usage = await prisma.usage.findUnique({
      where: {
        userId_month_year: {
          userId: session.user.id,
          month: now.getMonth() + 1,
          year: now.getFullYear(),
        },
      },
    });

    const limits: Record<string, number> = { starter: 90, pro: 200, agency: 1000 };
    const monthlyLimit = limits[planId] ?? 90;
    const totalUsed = (usage?.scriptsGenerated ?? 0) + (usage?.hooksGenerated ?? 0);

    if (totalUsed >= monthlyLimit) {
      return Response.json(
        { error: 'Monthly generation limit reached. Please upgrade your plan.' },
        { status: 403 }
      );
    }

    const prompt = createAdCreativePrompt({ product, offer, targetAudience, goal, platform, adFormat, language });
    const result = await generateJSON(prompt, { model: 'gpt-4o', temperature: 0.8 });

    // Increment usage
    await prisma.usage.upsert({
      where: {
        userId_month_year: {
          userId: session.user.id,
          month: now.getMonth() + 1,
          year: now.getFullYear(),
        },
      },
      update: { scriptsGenerated: { increment: 1 } },
      create: {
        userId: session.user.id,
        month: now.getMonth() + 1,
        year: now.getFullYear(),
        scriptsGenerated: 1,
      },
    });

    return Response.json({ success: true, adCreatives: result.adCreatives ?? result });
  } catch (error) {
    console.error('Ad Creative generation error:', error);
    return Response.json({ error: 'Failed to generate ad creative' }, { status: 500 });
  }
}
