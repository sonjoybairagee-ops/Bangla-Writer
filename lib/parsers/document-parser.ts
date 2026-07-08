import pdf from 'pdf-parse';
import mammoth from 'mammoth';

export async function parsePDF(buffer: Buffer): Promise<string> {
  try {
    const data = await pdf(buffer);
    return data.text;
  } catch (error) {
    console.error('PDF parsing error:', error);
    throw new Error('Failed to parse PDF file');
  }
}

export async function parseDOCX(buffer: Buffer): Promise<string> {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } catch (error) {
    console.error('DOCX parsing error:', error);
    throw new Error('Failed to parse DOCX file');
  }
}

export async function parseTXT(buffer: Buffer): Promise<string> {
  try {
    return buffer.toString('utf-8');
  } catch (error) {
    console.error('TXT parsing error:', error);
    throw new Error('Failed to parse TXT file');
  }
}

export async function parseDocument(
  file: File | Buffer,
  fileType: string
): Promise<string> {
  let buffer: Buffer;

  if (file instanceof Buffer) {
    buffer = file;
  } else {
    const arrayBuffer = await file.arrayBuffer();
    buffer = Buffer.from(arrayBuffer);
  }

  switch (fileType.toLowerCase()) {
    case 'pdf':
    case 'application/pdf':
      return parsePDF(buffer);

    case 'docx':
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      return parseDOCX(buffer);

    case 'txt':
    case 'text/plain':
      return parseTXT(buffer);

    default:
      // Try to parse as text
      return parseTXT(buffer);
  }
}

export async function extractTextFromURL(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    const html = await response.text();

    // Simple HTML to text extraction
    // In production, use a proper HTML parser like cheerio
    const text = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    return text;
  } catch (error) {
    console.error('URL extraction error:', error);
    throw new Error('Failed to extract text from URL');
  }
}
