import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { generateJSON } from '@/lib/ai/openai';
import { createThumbnailPrompt } from '@/lib/ai/prompts/creative-studio.js';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { videoTitle, videoTopic, targetAudience, platform, style, emotion } = body;

    if (!videoTitle || !videoTopic || !targetAudience) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate thumbnails
    const prompt = createThumbnailPrompt({
      videoTitle,
      videoTopic,
      targetAudience,
      platform: platform || 'youtube',
      style: style || 'bold',
      emotion: emotion || 'curiosity',
    });

    const result = await generateJSON(prompt, {
      model: 'gpt-4o',
      temperature: 0.8,
    });

    return NextResponse.json({
      success: true,
      thumbnails: result.thumbnails || [],
    });
  } catch (error) {
    console.error('Thumbnail generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate thumbnails' },
      { status: 500 }
    );
  }
}
