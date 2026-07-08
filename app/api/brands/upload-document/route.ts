import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generateJSON } from '@/lib/ai/openai';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;
    const brandId = formData.get('brandId') as string;

    if (!file || !brandId) {
      return NextResponse.json(
        { error: 'File and brandId are required' },
        { status: 400 }
      );
    }

    // Verify brand ownership
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

    // Get file content
    const fileBuffer = await file.arrayBuffer();
    const fileContent = Buffer.from(fileBuffer).toString('utf-8');

    // Extract text based on file type
    let extractedText = '';
    const fileType = file.name.split('.').pop()?.toLowerCase() || '';

    if (fileType === 'txt') {
      extractedText = fileContent;
    } else if (fileType === 'pdf' || fileType === 'docx') {
      // For PDF/DOCX, try basic text extraction
      // In production, use proper libraries like pdf-parse or mammoth
      extractedText = fileContent.substring(0, 10000);
    } else {
      return NextResponse.json(
        { error: 'Unsupported file type. Please upload PDF, DOCX, or TXT files.' },
        { status: 400 }
      );
    }

    // Limit text for AI processing
    const textForAI = extractedText.substring(0, 8000);

    // Use AI to analyze document and extract brand insights
    const prompt = `
You are a brand voice analyst. Analyze this document and extract brand voice insights.

DOCUMENT CONTENT:
${textForAI}

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

    // Create document object
    const newDocument = {
      id: `doc_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      name: file.name,
      type: fileType.toUpperCase(),
      size: `${(file.size / 1024).toFixed(1)} KB`,
      uploadedAt: new Date().toISOString(),
      status: 'processed',
      insights: {
        detectedTone: insights.detectedTone || 'Unknown',
        writingStyle: insights.writingStyle || [],
        keyPhrases: insights.keyPhrases || [],
        targetAudience: insights.targetAudience || '',
        contentType: insights.contentType || 'Unknown',
        confidence: insights.confidence || 0,
        wordCount: textForAI.split(/\s+/).length,
        summary: insights.summary || '',
      },
      content: textForAI, // Store for future re-parsing
    };

    // Update brand documents
    const currentDocuments = (brand.documents as any[]) || [];
    const updatedDocuments = [...currentDocuments, newDocument];

    await prisma.brand.update({
      where: { id: brandId },
      data: {
        documents: updatedDocuments,
      },
    });

    return NextResponse.json({
      success: true,
      document: newDocument,
    });
  } catch (error) {
    console.error('Document upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload and process document' },
      { status: 500 }
    );
  }
}
