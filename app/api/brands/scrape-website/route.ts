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

    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Validate URL format
    let websiteUrl: URL;
    try {
      websiteUrl = new URL(url);
    } catch (error) {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
    }

    // Fetch website content
    let websiteContent = '';
    try {
      const response = await fetch(websiteUrl.toString(), {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; BrandBrainBot/1.0)',
        },
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch website: ${response.statusText}`);
      }

      const html = await response.text();
      
      // Extract text content from HTML (basic extraction)
      // Remove script and style tags
      const cleanedHtml = html
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      // Limit content length for AI processing
      websiteContent = cleanedHtml.substring(0, 8000);

    } catch (error) {
      console.error('Failed to fetch website:', error);
      return NextResponse.json(
        { error: 'Failed to fetch website content. Please check the URL and try again.' },
        { status: 400 }
      );
    }

    // Use AI to extract brand information
    const prompt = `
You are a brand analyst extracting key brand information from a website.

WEBSITE URL: ${websiteUrl.toString()}
WEBSITE CONTENT:
${websiteContent}

Extract the following brand information from the website content:

1. Brand Name - The company/brand name
2. Industry - What industry/sector (e.g., Technology, Fashion, Healthcare)
3. Tagline - Official tagline or slogan if present
4. Description - Brief 2-3 sentence brand description
5. Mission - Brand's mission statement if present
6. Vision - Brand's vision if present
7. USP (Unique Selling Proposition) - What makes them unique
8. Tone - Brand tone (select up to 3: professional, friendly, luxury, casual, innovative, trustworthy, playful, authoritative)
9. Target Audience - Who their customers are
10. Key Values - Core brand values (up to 5)

Return ONLY valid JSON in this format:
\`\`\`json
{
  "name": "Brand Name",
  "industry": "Industry",
  "tagline": "Tagline or empty string",
  "description": "Brief description",
  "mission": "Mission statement or empty string",
  "vision": "Vision statement or empty string",
  "usp": "Unique selling proposition or empty string",
  "tone": ["professional", "friendly", "innovative"],
  "targetAudience": "Target audience description",
  "values": ["Value 1", "Value 2", "Value 3"]
}
\`\`\`

If any information is not found, use empty string or empty array. Be concise and accurate.
`.trim();

    const extractedData = await generateJSON(prompt, {
      model: 'gpt-4o',
      temperature: 0.3,
    });

    // Return extracted brand data
    return NextResponse.json({
      success: true,
      data: {
        name: extractedData.name || '',
        industry: extractedData.industry || '',
        tagline: extractedData.tagline || '',
        description: extractedData.description || '',
        mission: extractedData.mission || '',
        vision: extractedData.vision || '',
        usp: extractedData.usp || '',
        tone: extractedData.tone || [],
        targetAudience: extractedData.targetAudience || '',
        values: extractedData.values || [],
        website: websiteUrl.toString(),
      },
    });
  } catch (error: any) {
    console.error('Website scraping error:', error);
    
    // More detailed error messages
    let errorMessage = 'Failed to extract brand information from website';
    
    if (error.message?.includes('API key')) {
      errorMessage = 'OpenAI API key not configured. Please check your .env file.';
    } else if (error.message?.includes('fetch')) {
      errorMessage = 'Failed to fetch website content. Please check the URL and try again.';
    } else if (error.message?.includes('timeout')) {
      errorMessage = 'Website request timed out. Please try again.';
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: error.message || 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
}
