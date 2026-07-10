import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { generateJSON } from '@/lib/ai/openai';
import { createUGCPrompt } from '@/lib/ai/prompts/creative-studio';
import { checkUsageLimit, incrementUsage } from '@/lib/utils/usage-limits';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { product, benefit, targetAudience, ugcType, language = 'bangla' } = body;

    if (!product || !benefit || !ugcType) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Creative Studio quota — shared across Thumbnail/Ad Creative/Visual Hook/UGC/Moodboard.
    const usageCheck = await checkUsageLimit(session.user.id, 'creative');
    if (!usageCheck.allowed) {
      return Response.json(
        { error: usageCheck.message || 'Monthly generation limit reached. Please upgrade your plan.' },
        { status: 403 }
      );
    }

    const prompt = createUGCPrompt({ product, benefit, targetAudience, ugcType, language });
    const result = await generateJSON(prompt, { model: 'gpt-5.4-mini', temperature: 0.85 });

    await incrementUsage(session.user.id, 'creative');

    return Response.json({ success: true, ugcScripts: result.ugcScripts ?? result });
  } catch (error) {
    console.error('UGC generation error:', error);
    return Response.json({ error: 'Failed to generate UGC scripts' }, { status: 500 });
  }
}
