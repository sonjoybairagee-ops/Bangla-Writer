import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { generateJSON } from '@/lib/ai/openai';
import { createUGCPrompt } from '@/lib/ai/prompts/creative-studio';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { product, benefit, targetAudience, ugcType } = body;

    const prompt = createUGCPrompt({
      product,
      benefit,
      targetAudience,
      ugcType: ugcType || 'testimonial',
    });

    const result = await generateJSON(prompt, {
      model: 'gpt-4o',
      temperature: 0.8,
    });

    return NextResponse.json({
      success: true,
      ugcScripts: result.ugcScripts || [],
    });
  } catch (error) {
    console.error('UGC generation error:', error);
    return NextResponse.json({ error: 'Failed to generate UGC scripts' }, { status: 500 });
  }
}
