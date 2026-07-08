export function createBrandExtractionPrompt(documentContent: string): string {
  return `
You are a brand strategist analyzing brand documents to extract key information.

Analyze the following document and extract comprehensive brand information:

${documentContent}

Extract and return a JSON object with the following structure:

{
  "mission": "The brand's mission statement",
  "vision": "The brand's vision",
  "usp": "Unique selling proposition",
  "tagline": "Brand tagline or slogan",
  "tone": ["list", "of", "tone", "descriptors"],
  "voice": "Detailed description of brand voice",
  "writingStyle": "Description of writing style preferences",
  "targetAudience": "Description of target audience",
  "painPoints": ["pain", "point", "list"],
  "keywords": ["relevant", "keywords"],
  "competitors": ["competitor", "names"],
  "forbiddenWords": ["words", "to", "avoid"],
  "preferredWords": ["preferred", "terminology"],
  "brandColors": ["#hex", "colors", "if", "mentioned"]
}

If any field cannot be determined from the document, use null or empty array.
Be thorough and extract as much relevant information as possible.
`.trim();
}

export function createBrandVoicePrompt(
  brandInfo: any,
  contentType: string
): string {
  return `
You are writing content for a brand with the following characteristics:

Brand: ${brandInfo.name}
Industry: ${brandInfo.industry || 'Not specified'}
Mission: ${brandInfo.mission || 'Not specified'}
USP: ${brandInfo.usp || 'Not specified'}
Tone: ${brandInfo.tone?.join(', ') || 'Professional'}
Target Audience: ${brandInfo.targetAudience || 'General audience'}
Voice Description: ${brandInfo.voice || 'Standard professional voice'}

Writing Rules:
- Forbidden words: ${brandInfo.forbiddenWords?.join(', ') || 'None'}
- Preferred words: ${brandInfo.preferredWords?.join(', ') || 'None'}

Content Type: ${contentType}

Always maintain consistency with this brand voice in all generated content.
`.trim();
}
