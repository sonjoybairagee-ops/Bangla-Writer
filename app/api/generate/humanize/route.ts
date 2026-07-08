import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { generateCompletion } from '@/lib/ai/openai';
import { createHumanWriterPrompt } from '@/lib/ai/prompts/human-writer';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { content } = await req.json();

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    // Generate humanized content
    const prompt = createHumanWriterPrompt(content);
    const humanizedContent = await generateCompletion(prompt, {
      model: 'gpt-4o',
      temperature: 0.9,
    });

    return NextResponse.json({
      success: true,
      humanizedContent,
      original: content,
    });
  } catch (error) {
    console.error('Humanize error:', error);
    return NextResponse.json(
      { error: 'Failed to humanize content' },
      { status: 500 }
    );
  }
}
