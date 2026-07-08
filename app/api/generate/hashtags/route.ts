import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { generateJSON } from '@/lib/ai/openai';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { topic, platform, niche, count = 30 } = await req.json();

    const prompt = `
Generate ${count} relevant hashtags for social media.

Topic: ${topic}
Platform: ${platform}
Niche: ${niche || 'general'}

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
      model: 'gpt-4o',
      temperature: 0.6,
    });

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
