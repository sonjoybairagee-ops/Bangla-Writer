import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { generateJSON } from '@/lib/ai/openai';
import { checkUsageLimit, incrementUsage } from '@/lib/utils/usage-limits';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Quick Generate quota — shared with CTA/Hashtag.
    const usageCheck = await checkUsageLimit(session.user.id, 'quick');
    if (!usageCheck.allowed) {
      return NextResponse.json(
        { error: usageCheck.message || 'Monthly limit reached. Upgrade your plan.' },
        { status: 403 }
      );
    }

    const { topic, platform, tone, length, language = 'bangla' } = await req.json();

    const languageInstruction =
      language === 'banglish'
        ? 'Conversational Banglish (Bengali words written using English alphabet)'
        : language === 'english'
        ? 'English'
        : 'Bangla (শুদ্ধ বাংলা)';

    const prompt = `
Generate 5 caption variations for social media.

Topic: ${topic}
Platform: ${platform}
Tone: ${tone}
Length: ${length || 'medium'} (short=under 50 words, medium=50-150, long=150+)
OUTPUT LANGUAGE: ${languageInstruction}. All caption text MUST be written strictly in this language.

Create captions with different approaches:

1. **Story-Based**: Start with mini story or scenario
2. **Question Hook**: Begin with engaging question
3. **List Format**: Numbered or bullet points
4. **Personal**: First-person narrative
5. **Educational**: Teach something valuable

Each caption should include:
- Strong hook (first line)
- Value-packed body
- Clear CTA
- Relevant emojis
- Line breaks for readability

Return as JSON:
{
  "captions": [
    {
      "text": "Full caption with emojis and line breaks",
      "approach": "story|question|list|personal|educational",
      "hook": "First line hook",
      "wordCount": 95,
      "engagementScore": 88
    }
  ]
}

Make them platform-optimized and scroll-stopping.
`.trim();

    const result = await generateJSON(prompt, {
      model: 'gpt-5.4-mini',
      temperature: 0.8,
    });

    await incrementUsage(session.user.id, 'quick');

    return NextResponse.json({
      success: true,
      captions: result.captions,
    });
  } catch (error) {
    console.error('Caption generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate captions' },
      { status: 500 }
    );
  }
}
