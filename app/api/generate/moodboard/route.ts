import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { generateJSON } from '@/lib/ai/openai';
import { createMoodboardPrompt } from '@/lib/ai/prompts/creative-studio';
import { AI_MODELS } from '@/lib/ai/model-config';
import { checkUsageLimit, incrementUsage } from '@/lib/utils/usage-limits';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Creative Studio quota — shared across Thumbnail/Ad Creative/Visual Hook/UGC/Moodboard.
    const usageCheck = await checkUsageLimit(session.user.id, 'creative');
    if (!usageCheck.allowed) {
      return NextResponse.json(
        { error: usageCheck.message || 'Monthly limit reached. Upgrade your plan.' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { projectName, projectDescription, targetMood, industry, language = 'bangla' } = body;

    const prompt = createMoodboardPrompt({
      projectName,
      projectDescription,
      targetMood,
      industry,
      language,
    });

    const result = await generateJSON(prompt, {
      model: AI_MODELS.moodboard,
      temperature: 0.7,
    });

    await incrementUsage(session.user.id, 'creative');

    return NextResponse.json({
      success: true,
      moodboard: result,
    });
  } catch (error) {
    console.error('Moodboard generation error:', error);
    return NextResponse.json({ error: 'Failed to generate moodboard' }, { status: 500 });
  }
}
