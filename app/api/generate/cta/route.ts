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

    const { goal, platform, offer } = await req.json();

    const prompt = `
Generate 10 powerful Call-to-Action (CTA) options.

Goal: ${goal}
Platform: ${platform}
Offer: ${offer || 'General'}

Create CTAs for different styles:

1. **Direct Action**: Click now, Buy now, Get started
2. **Value-First**: Learn how, Discover, Get free guide
3. **FOMO**: Limited time, Join now, Don't miss out
4. **Question**: Ready to transform? Want results?
5. **Soft**: Explore, See how, Check it out
6. **Urgency**: Act now, Today only, Last chance
7. **Benefit-Driven**: Save time, Grow faster, Make money
8. **Social Proof**: Join 10,000+ users, See why...
9. **Risk Reversal**: Try free, No commitment, Money back
10. **Curiosity**: See what happens, Find out how

Return as JSON:
{
  "ctas": [
    {
      "text": "CTA text here",
      "type": "direct|value|fomo|question|soft|urgency|benefit|social|risk|curiosity",
      "effectiveness": 85,
      "bestFor": "sales|leads|engagement|awareness"
    }
  ]
}

Make them compelling, action-oriented, and platform-appropriate.
`.trim();

    const result = await generateJSON(prompt, {
      model: 'gpt-4o',
      temperature: 0.7,
    });

    return NextResponse.json({
      success: true,
      ctas: result.ctas,
    });
  } catch (error) {
    console.error('CTA generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate CTAs' },
      { status: 500 }
    );
  }
}
