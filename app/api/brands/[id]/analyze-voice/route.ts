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

    // Get all documents
    const documents = (brand.documents as any[]) || [];

    if (documents.length === 0) {
      return NextResponse.json(
        { error: 'No documents available for analysis. Please upload documents first.' },
        { status: 400 }
      );
    }

    // Aggregate all document content and insights
    let totalWords = 0;
    const allContent: string[] = [];
    const allInsights: any[] = [];

    documents.forEach((doc) => {
      if (doc.content) {
        allContent.push(doc.content);
      }
      if (doc.insights) {
        allInsights.push(doc.insights);
        totalWords += doc.insights.wordCount || 0;
      }
    });

    // Combine content for analysis (limit to 15000 chars to avoid token limits)
    const combinedContent = allContent.join('\n\n').substring(0, 15000);

    // Prepare insights summary for AI
    const insightsSummary = allInsights.map((insight, i) => ({
      doc: i + 1,
      tone: insight.detectedTone,
      style: insight.writingStyle,
      phrases: insight.keyPhrases,
      audience: insight.targetAudience,
    }));

    // Use AI to analyze brand voice comprehensively
    const prompt = `
You are an expert brand voice analyst. Analyze the following brand documents and insights to create a comprehensive brand voice profile.

BRAND NAME: ${brand.name}
INDUSTRY: ${brand.industry || 'Unknown'}
TOTAL DOCUMENTS: ${documents.length}
TOTAL WORDS: ${totalWords}

DOCUMENT INSIGHTS:
${JSON.stringify(insightsSummary, null, 2)}

SAMPLE CONTENT FROM DOCUMENTS:
${combinedContent}

Perform a comprehensive brand voice analysis and return the following:

1. **Consistency Score (0-100)** - How consistent is the brand voice across all documents?
2. **Confidence Score (0-100)** - How confident are you in this analysis?
3. **Dominant Tone** - Top 3 tones with percentages (e.g., "professional": 60%, "friendly": 30%, "innovative": 10%)
4. **Writing Patterns** - 5-8 key writing patterns observed (e.g., "Uses short, punchy sentences", "Employs storytelling techniques")
5. **Common Phrases** - 15-20 most frequently used phrases or vocabulary
6. **Sentence Structure** - Description of typical sentence patterns
7. **Voice Characteristics** - 5-7 defining characteristics
8. **Target Audience Insights** - Refined understanding of who this content speaks to
9. **Recommendations** - 3-5 actionable recommendations to improve voice consistency

Return ONLY valid JSON:
\`\`\`json
{
  "consistencyScore": 85,
  "confidenceScore": 90,
  "documentsAnalyzed": 5,
  "totalWords": 15000,
  "dominantTone": [
    { "tone": "professional", "percentage": 60 },
    { "tone": "friendly", "percentage": 30 },
    { "tone": "innovative", "percentage": 10 }
  ],
  "writingPatterns": [
    "Uses short, punchy sentences for impact",
    "Employs metaphors and analogies frequently",
    "Active voice dominates over passive",
    "Direct address to reader (you, your)",
    "Data-driven claims with statistics"
  ],
  "commonPhrases": [
    "cutting-edge technology",
    "transform your business",
    "proven results",
    "industry-leading"
  ],
  "sentenceStructure": "Mix of short (5-10 words) and medium (15-20 words) sentences. Occasional long sentences for detailed explanations.",
  "voiceCharacteristics": [
    "Authoritative yet approachable",
    "Confident without being arrogant",
    "Solution-focused",
    "Empathetic to customer pain points"
  ],
  "targetAudienceInsights": "Business professionals aged 30-50, seeking efficiency and innovation",
  "recommendations": [
    "Maintain consistency in tone across all content types",
    "Use more concrete examples and case studies",
    "Balance technical jargon with accessible language"
  ],
  "analyzedAt": "${new Date().toISOString()}"
}
\`\`\`

Be thorough and specific in your analysis.
`.trim();

    const voiceProfile = await generateJSON(prompt, {
      model: 'gpt-4o',
      temperature: 0.3,
    });

    // Add metadata
    const profileWithMetadata = {
      ...voiceProfile,
      documentsAnalyzed: documents.length,
      totalWords,
      analyzedAt: new Date().toISOString(),
    };

    // Update brand with voice profile
    await prisma.brand.update({
      where: { id: brandId },
      data: {
        voiceProfile: profileWithMetadata as any,
      },
    });

    return NextResponse.json({
      success: true,
      profile: profileWithMetadata,
    });
  } catch (error) {
    console.error('Voice analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze brand voice' },
      { status: 500 }
    );
  }
}
