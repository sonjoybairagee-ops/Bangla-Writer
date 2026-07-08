import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generateJSON } from '@/lib/ai/openai';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string; docId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const brandId = params.id;
    const docId = params.docId;

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

    // Find document
    const currentDocuments = (brand.documents as any[]) || [];
    const documentIndex = currentDocuments.findIndex((doc) => doc.id === docId);

    if (documentIndex === -1) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    const document = currentDocuments[documentIndex];

    if (!document.content) {
      return NextResponse.json(
        { error: 'Document content not available for re-parsing' },
        { status: 400 }
      );
    }

    // Re-analyze with AI
    const prompt = `
You are a brand voice analyst. Analyze this document and extract brand voice insights.

DOCUMENT NAME: ${document.name}
DOCUMENT CONTENT:
${document.content}

Extract the following information:
1. Detected Tone - The overall tone (professional, friendly, casual, luxury, innovative, etc.)
2. Writing Style - Key characteristics of the writing style
3. Key Phrases - Important recurring phrases or vocabulary (up to 10)
4. Target Audience - Who this content is written for
5. Content Type - What type of content is this (blog, marketing copy, technical docs, social media, etc.)
6. Confidence Score - How confident are you in this analysis (0-100)

Return ONLY valid JSON:
\`\`\`json
{
  "detectedTone": "professional",
  "writingStyle": ["concise", "data-driven", "authoritative"],
  "keyPhrases": ["phrase 1", "phrase 2"],
  "targetAudience": "audience description",
  "contentType": "content type",
  "confidence": 85,
  "wordCount": 0,
  "summary": "Brief 1-2 sentence summary of the content"
}
\`\`\`
`.trim();

    const insights = await generateJSON(prompt, {
      model: 'gpt-4o',
      temperature: 0.3,
    });

    // Update document with new insights
    const updatedDocument = {
      ...document,
      status: 'processed',
      insights: {
        detectedTone: insights.detectedTone || 'Unknown',
        writingStyle: insights.writingStyle || [],
        keyPhrases: insights.keyPhrases || [],
        targetAudience: insights.targetAudience || '',
        contentType: insights.contentType || 'Unknown',
        confidence: insights.confidence || 0,
        wordCount: document.content.split(/\s+/).length,
        summary: insights.summary || '',
      },
      reparsedAt: new Date().toISOString(),
    };

    currentDocuments[documentIndex] = updatedDocument;

    await prisma.brand.update({
      where: { id: brandId },
      data: {
        documents: currentDocuments,
      },
    });

    return NextResponse.json({
      success: true,
      document: updatedDocument,
    });
  } catch (error) {
    console.error('Failed to re-parse document:', error);
    return NextResponse.json(
      { error: 'Failed to re-parse document' },
      { status: 500 }
    );
  }
}
