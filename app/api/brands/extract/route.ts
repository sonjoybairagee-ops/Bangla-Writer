import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { parseDocument } from '@/lib/parsers/document-parser';
import { generateJSON } from '@/lib/ai/openai';
import { createBrandExtractionPrompt } from '@/lib/ai/prompts/brand-extractor';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;
    const documentType = formData.get('type') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Parse document
    const content = await parseDocument(file, file.type);

    if (!content || content.length < 50) {
      return NextResponse.json(
        { error: 'Document content too short or empty' },
        { status: 400 }
      );
    }

    // Extract brand information using AI
    const prompt = createBrandExtractionPrompt(content);
    const extractedData = await generateJSON(prompt);

    return NextResponse.json({
      success: true,
      data: extractedData,
      contentLength: content.length,
    });
  } catch (error) {
    console.error('Brand extraction error:', error);
    return NextResponse.json(
      { error: 'Failed to extract brand information' },
      { status: 500 }
    );
  }
}
