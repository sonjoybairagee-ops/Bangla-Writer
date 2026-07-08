import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { generateJSON } from '@/lib/ai/openai';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { content, platform, contentType } = await req.json();

    if (!content || content.length < 20) {
      return NextResponse.json(
        { error: 'Content must be at least 20 characters' },
        { status: 400 }
      );
    }

    // AI prediction prompt
    const prompt = `
You are a viral content expert and social media analyst. Analyze this content and predict its viral potential.

CONTENT:
${content}

PLATFORM: ${platform}
CONTENT TYPE: ${contentType}

Analyze the content based on:
1. **Hook Strength** - Does it grab attention in the first 3 seconds?
2. **Emotional Appeal** - Does it trigger emotions (curiosity, joy, surprise, fear, anger)?
3. **Shareability** - Would people share this with friends?
4. **Engagement Potential** - Will it generate comments, likes, saves?
5. **Platform Fit** - Is it optimized for ${platform}?
6. **Timing & Trends** - Is it relevant to current trends?

Provide predictions for:
- Estimated views (format: "2.5K", "45K", "120K")
- Estimated engagement rate (0-15%)
- Estimated shares (format: "500", "2.3K", "8.5K")
- Best time to post (e.g., "Tuesday-Thursday 6-8 PM when users are most active")

Return ONLY valid JSON:
\`\`\`json
{
  "viralScore": 75,
  "hookScore": 80,
  "emotionalScore": 70,
  "shareabilityScore": 75,
  "engagementScore": 72,
  "predictedViews": "15K-25K",
  "predictedEngagement": 4.5,
  "predictedShares": "1.2K-2K",
  "strengths": [
    "Strong opening hook that creates curiosity",
    "Clear value proposition",
    "Good use of emojis for visual appeal"
  ],
  "improvements": [
    "Add a clear call-to-action at the end",
    "Use more specific numbers or statistics",
    "Include a question to boost engagement"
  ],
  "bestTimeToPost": "Tuesday-Thursday 6-8 PM when ${platform} users are most active"
}
\`\`\`

Be honest and specific in your analysis. Scores should be realistic.
`.trim();

    const prediction = await generateJSON(prompt, {
      model: 'gpt-4o',
      temperature: 0.4,
    });

    return NextResponse.json({
      success: true,
      prediction,
      content,
      platform,
      contentType,
    });
  } catch (error) {
    console.error('Viral score prediction error:', error);
    return NextResponse.json(
      { error: 'Failed to predict viral score' },
      { status: 500 }
    );
  }
}
