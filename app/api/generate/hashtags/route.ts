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

    // Quick Generate quota — shared with CTA/Caption.
    const usageCheck = await checkUsageLimit(session.user.id, 'quick');
    if (!usageCheck.allowed) {
      return NextResponse.json(
        { error: usageCheck.message || 'Monthly limit reached. Upgrade your plan.' },
        { status: 403 }
      );
    }

    const { topic, platform, niche, count = 30, language = 'bangla' } = await req.json();

    const languageInstruction =
      language === 'banglish'
        ? 'Conversational Banglish (Bengali words written using English alphabet)'
        : language === 'english'
        ? 'English'
        : 'Bangla (শুদ্ধ বাংলা)';

    const prompt = `
Generate ${count} relevant hashtags for social media.

Topic: ${topic}
Platform: ${platform}
Niche: ${niche || 'general'}
OUTPUT LANGUAGE FOR STRATEGY TEXT: ${languageInstruction}. The "strategy" field must be written strictly in this language.
HASHTAG LANGUAGE: If OUTPUT LANGUAGE is Bangla, prefer widely-used Bangla-script or Banglish hashtags where they genuinely exist and are searched, but always include enough high-traffic English hashtags for reach (hashtags are discovery tags, not just copy). If OUTPUT LANGUAGE is English or Banglish, use English/Banglish hashtags.

Create a strategic mix:

**High Competition (2-3M+ posts)**: Big reach, harder to rank
- Industry leaders
- Broad topics
- Generic popular tags

**Medium Competition (100K-2M posts)**: Sweet spot
- Niche-specific
- Better engagement
- Higher visibility

**Low Competition (1K-100K posts)**: Easy to rank
- Ultra-specific
- Community tags
- Emerging trends

**Branded (if applicable)**:
- Company hashtags
- Campaign tags

Return as JSON:
{
  "hashtags": {
    "high": ["#marketing", "#business"],
    "medium": ["#contentmarketing", "#digitalstrategy"],
    "low": ["#b2bcontentmarketing", "#saasmarketing"],
    "branded": ["#YourBrand"],
    "trending": ["#trending2026"]
  },
  "recommended": "#marketing #contentcreator #digitalmarketing #socialmedia",
  "strategy": "Use 2-3 high, 5-7 medium, 3-5 low competition hashtags"
}

Make them relevant, researched, and strategic.
`.trim();

    const result = await generateJSON(prompt, {
      model: 'gpt-5.4-mini',
      temperature: 0.6,
    });

    await incrementUsage(session.user.id, 'quick');

    return NextResponse.json({
      success: true,
      hashtags: result.hashtags,
      recommended: result.recommended,
      strategy: result.strategy,
    });
  } catch (error) {
    console.error('Hashtag generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate hashtags' },
      { status: 500 }
    );
  }
}
