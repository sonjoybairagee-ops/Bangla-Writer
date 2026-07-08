import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generateJSON } from '@/lib/ai/openai';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const brandId = params.id;
    const { content } = await req.json();

    if (!content || content.length < 20) {
      return NextResponse.json(
        { error: 'Content must be at least 20 characters long' },
        { status: 400 }
      );
    }

    // Get brand and verify ownership
    const brand = await prisma.brand.findFirst({
      where: {
        id: brandId,
        user: {
          email: session.user.email,
        },
      },
    });

    if (!brand) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
    }

    // Check if brand has voice profile
    const voiceProfile = (brand as any).voiceProfile;
    if (!voiceProfile) {
      return NextResponse.json(
        { error: 'Brand voice profile not found. Please analyze brand voice first.' },
        { status: 400 }
      );
    }

    // Use AI to check voice consistency
    const prompt = `
You are a brand voice consistency analyzer. Compare the provided content against the brand voice profile and determine how well it matches.

BRAND NAME: ${brand.name}
BRAND TONE: ${brand.tone?.join(', ') || 'Not specified'}

BRAND VOICE PROFILE:
- Consistency Score: ${voiceProfile.consistencyScore}%
- Dominant Tone: ${voiceProfile.dominantTone?.map((t: any) => `${t.tone} (${t.percentage}%)`).join(', ') || 'Not analyzed'}
- Writing Patterns: ${voiceProfile.writingPatterns?.join(', ') || 'Not analyzed'}
- Voice Characteristics: ${voiceProfile.voiceCharacteristics?.join(', ') || 'Not analyzed'}
- Sentence Structure: ${voiceProfile.sentenceStructure || 'Not analyzed'}

CONTENT TO CHECK:
${content}

Analyze the content and return a detailed voice consistency report with:

1. **Overall Consistency Score (0-100)** - How well does this content match the brand voice?
2. **Tone Score (0-100)** - Does the tone match the brand's tone?
3. **Style Score (0-100)** - Does the writing style match the brand patterns?
4. **Vocabulary Score (0-100)** - Does the vocabulary align with the brand?
5. **Detected Tone** - What tones are present in this content? (array of 2-3 tones)
6. **Matches** - What elements match the brand voice well? (3-5 specific points)
7. **Issues** - What doesn't match the brand voice? (2-4 specific issues)
8. **Suggestions** - How to improve voice consistency? (3-5 actionable suggestions)

Be specific and actionable in your feedback. Focus on concrete examples from the content.

Return ONLY valid JSON:
\`\`\`json
{
  "consistencyScore": 85,
  "toneScore": 90,
  "styleScore": 85,
  "vocabularyScore": 80,
  "detectedTone": ["professional", "friendly"],
  "matches": [
    "Uses conversational language that matches the brand's friendly tone",
    "Sentence length aligns with brand patterns (15-20 words)",
    "Active voice dominates, consistent with brand style"
  ],
  "issues": [
    "Uses some jargon that doesn't match brand's accessible approach",
    "Lacks the emotional connection present in brand voice"
  ],
  "suggestions": [
    "Replace technical terms with simpler alternatives",
    "Add more personal pronouns (you, your) to enhance friendliness",
    "Include a question or call-to-action to engage readers"
  ]
}
\`\`\`

Be thorough and helpful in your analysis.
`.trim();

    const result = await generateJSON(prompt, {
      model: 'gpt-4o',
      temperature: 0.3,
    });

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error('Voice consistency check error:', error);
    return NextResponse.json(
      { error: 'Failed to check voice consistency' },
      { status: 500 }
    );
  }
}
