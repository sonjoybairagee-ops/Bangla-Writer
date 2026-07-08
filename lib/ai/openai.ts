/**
 * AI Router with Multi-Provider Support
 * Automatically routes to best available provider with fallback
 */

import { generateText, generateJSON as generateJSONRouter, generateStream } from './providers';

/**
 * Generate text completion with automatic provider fallback
 * @deprecated Use generateText from providers for better control
 */
export async function generateCompletion(
  prompt: string,
  options: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
    provider?: 'openai' | 'grok' | 'gemini' | 'claude' | 'auto';
  } = {}
): Promise<string> {
  try {
    const response = await generateText(prompt, options);
    return response.text;
  } catch (error: any) {
    console.error('AI generation error:', error);
    throw new Error(error.message || 'Failed to generate AI content');
  }
}

/**
 * Generate JSON with automatic provider fallback
 */
export async function generateJSON<T = any>(
  prompt: string,
  options: {
    model?: string;
    temperature?: number;
    provider?: 'openai' | 'grok' | 'gemini' | 'claude' | 'auto';
  } = {}
): Promise<T> {
  try {
    return await generateJSONRouter<T>(prompt, options);
  } catch (error: any) {
    console.error('AI JSON generation error:', error);
    throw new Error(error.message || 'Failed to generate AI content');
  }
}

/**
 * Generate streaming response
 */
export async function generateStreamCompletion(
  prompt: string,
  options: {
    model?: string;
    temperature?: number;
    provider?: 'openai' | 'grok' | 'gemini' | 'claude' | 'auto';
  } = {}
) {
  try {
    return await generateStream(prompt, options);
  } catch (error: any) {
    console.error('AI stream generation error:', error);
    throw new Error(error.message || 'Failed to generate AI content');
  }
}

// Re-export provider utilities
export {
  generateText,
  generateJSON as generateJSONDirect,
  generateStream,
  getAvailableProviders,
  getProviderStatus,
  getBestProvider,
} from './providers';

// For backward compatibility
export { generateText as openai };
