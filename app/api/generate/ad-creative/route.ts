import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { generateJSON } from '@/lib/ai/openai';
import { createAdCreativePrompt } from '@/lib/ai/prompts/creative-studio.js';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { product, offer, targetAudience, goal, platform, adFormat } = body;

    const prompt = createAdCreativePrompt({
      product,
      offer,
      targetAudience,
      goal: goal || 'sales',
      platform: platform || 'facebook',
      adFormat: adFormat || 'single-image',
    });

    const result = await generateJSON(prompt, {
      model: 'gpt-4o',
      temperature: 0.8,
    });

    return NextResponse.json({
      success: true,
      adCreatives: result.adCreatives || [],
    });
  } catch (error) {
    console.error('Ad creative generation error:', error);
    return NextResponse.json({ error: 'Failed to generate ad creatives' }, { status: 500 });
  }
}
