/**
 * Anthropic Claude Provider
 * Advanced reasoning and long context support
 */

import { AIResponse, AIOptions } from './openai';

let claudeClient: any = null;

function getClient() {
  if (!claudeClient) {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY is not configured');
    }
    
    const Anthropic = require('@anthropic-ai/sdk');
    claudeClient = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }
  return claudeClient;
}

export async function isAvailable(): Promise<boolean> {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return false;
    }
    // API key validation happens on first request
    return true;
  } catch (error) {
    console.error('Claude not available:', error);
    return false;
  }
}

export async function generateText(
  prompt: string,
  options: AIOptions = {}
): Promise<AIResponse> {
  const {
    model = 'claude-3-5-sonnet-20241022',
    temperature = 0.7,
    maxTokens = 2000,
  } = options;

  try {
    const client = getClient();
    const response = await client.messages.create({
      model,
      max_tokens: maxTokens,
      temperature,
      messages: [
        { role: 'user', content: prompt }
      ],
    });

    const text = response.content[0]?.text || '';

    return {
      text,
      model,
      provider: 'claude',
      tokensUsed: response.usage?.input_tokens + response.usage?.output_tokens,
    };
  } catch (error: any) {
    throw new Error(`Claude error: ${error?.message || 'Unknown error'}`);
  }
}

export async function generateJSON<T = any>(
  prompt: string,
  options: AIOptions = {}
): Promise<T> {
  const {
    model = 'claude-3-5-sonnet-20241022',
    temperature = 0.7,
    maxTokens = 2000,
  } = options;

  try {
    const client = getClient();
    const response = await client.messages.create({
      model,
      max_tokens: maxTokens,
      temperature,
      messages: [
        { 
          role: 'user', 
          content: `${prompt}\n\nIMPORTANT: Respond with valid JSON only, no markdown or explanations.`
        }
      ],
    });

    let text = response.content[0]?.text || '{}';
    
    // Clean up response - remove markdown if present
    text = text.trim();
    if (text.startsWith('```json')) {
      text = text.replace(/```json\n?/g, '').replace(/```\n?$/g, '');
    } else if (text.startsWith('```')) {
      text = text.replace(/```\n?/g, '');
    }

    return JSON.parse(text);
  } catch (error: any) {
    throw new Error(`Claude JSON error: ${error?.message || 'Unknown error'}`);
  }
}

export async function generateStream(
  prompt: string,
  options: AIOptions = {}
) {
  const {
    model = 'claude-3-5-sonnet-20241022',
    temperature = 0.7,
    maxTokens = 2000,
  } = options;

  try {
    const client = getClient();
    const stream = await client.messages.stream({
      model,
      max_tokens: maxTokens,
      temperature,
      messages: [
        { role: 'user', content: prompt }
      ],
    });

    return stream;
  } catch (error: any) {
    throw new Error(`Claude stream error: ${error?.message || 'Unknown error'}`);
  }
}

export const provider = {
  name: 'claude',
  displayName: 'Anthropic Claude',
  models: {
    fast: 'claude-3-5-haiku-20241022',
    standard: 'claude-3-5-sonnet-20241022',
    advanced: 'claude-3-5-sonnet-20241022',
  },
  isAvailable,
  generateText,
  generateJSON,
  generateStream,
};

export default provider;
