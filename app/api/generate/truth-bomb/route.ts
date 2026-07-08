import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { generateJSON } from '@/lib/ai/openai';
import { createTruthBombPrompt } from '@/lib/ai/prompts/human-writer';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { topic, audience, platform } = await req.json();

    if (!topic || !audience) {
      return NextResponse.json(
        { error: 'Topic and audience are required' },
        { status: 400 }
      );
    }

    // Generate truth bomb
    const prompt = createTruthBombPrompt({ topic, audience, platform });
    const truthBomb = await generateJSON(prompt, {
      model: 'gpt-4o',
      temperature: 0.8,
    });

    return NextResponse.json({
      success: true,
      truthBomb,
    });
  } catch (error) {
    console.error('Truth bomb error:', error);
    return NextResponse.json(
      { error: 'Failed to generate truth bomb' },
      { status: 500 }
    );
  }
}
