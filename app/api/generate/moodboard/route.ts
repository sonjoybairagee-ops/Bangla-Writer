import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { generateJSON } from '@/lib/ai/openai';
import { createMoodboardPrompt } from '@/lib/ai/prompts/creative-studio';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { projectName, projectDescription, targetMood, industry } = body;

    const prompt = createMoodboardPrompt({
      projectName,
      projectDescription,
      targetMood,
      industry,
    });

    const result = await generateJSON(prompt, {
      model: 'gpt-4o',
      temperature: 0.7,
    });

    return NextResponse.json({
      success: true,
      moodboard: result,
    });
  } catch (error) {
    console.error('Moodboard generation error:', error);
    return NextResponse.json({ error: 'Failed to generate moodboard' }, { status: 500 });
  }
}
