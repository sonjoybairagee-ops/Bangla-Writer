import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { generateJSON } from '@/lib/ai/openai';
import { createVisualHookPrompt } from '@/lib/ai/prompts/creative-studio.js';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { topic, platform, emotion } = body;

    const prompt = createVisualHookPrompt({
      topic,
      platform: platform || 'instagram',
      emotion: emotion || 'curiosity',
    });

    const result = await generateJSON(prompt, {
      model: 'gpt-4o',
      temperature: 0.8,
    });

    return NextResponse.json({
      success: true,
      visualHooks: result.visualHooks || [],
    });
  } catch (error) {
    console.error('Visual hook generation error:', error);
    return NextResponse.json({ error: 'Failed to generate visual hooks' }, { status: 500 });
  }
}
