/**
 * Grok Provider (xAI)
 * Fast and efficient model from X.AI
 */

import { AIResponse, AIOptions } from './openai';

let grokClient: any = null;

function getClient() {
  if (!grokClient) {
    if (!process.env.GROK_API_KEY) {
      throw new Error('GROK_API_KEY is not configured');
    }
    
    // Grok uses OpenAI-compatible API
    const OpenAI = require('openai');
    grokClient = new OpenAI({
      apiKey: process.env.GROK_API_KEY,
      baseURL: 'https://api.x.ai/v1',
    });
  }
  return grokClient;
}

export async function isAvailable(): Promise<boolean> {
  try {
    if (!process.env.GROK_API_KEY) {
      return false;
    }
    // Test connection
    const client = getClient();
    await client.models.list();
    return true;
  } catch (error) {
    console.error('Grok not available:', error);
    return false;
  }
}

export async function generateText(
  prompt: string,
  options: AIOptions = {}
): Promise<AIResponse> {
  const {
    model = 'grok-beta',
    temperature = 0.7,
    maxTokens = 2000,
  } = options;

  try {
    const client = getClient();
    const response = await client.chat.completions.create({
      model,
      messages: [{ role: 'user', content: prompt }],
      temperature,
      max_tokens: maxTokens,
    });

    return {
      text: response.choices[0]?.message?.content || '',
      model,
      provider: 'grok',
      tokensUsed: response.usage?.total_tokens,
    };
  } catch (error: any) {
    throw new Error(`Grok error: ${error?.message || 'Unknown error'}`);
  }
}

export async function generateJSON<T = any>(
  prompt: string,
  options: AIOptions = {}
): Promise<T> {
  const {
    model = 'grok-beta',
    temperature = 0.7,
  } = options;

  try {
    const client = getClient();
    const response = await client.chat.completions.create({
      model,
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that always responds with valid JSON.',
        },
        { role: 'user', content: prompt },
      ],
      temperature,
    });

    const content = response.choices[0]?.message?.content || '{}';
    // Extract JSON from markdown code blocks if present
    const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) || content.match(/```\n?([\s\S]*?)\n?```/);
    const jsonStr = jsonMatch ? jsonMatch[1] : content;
    return JSON.parse(jsonStr);
  } catch (error: any) {
    throw new Error(`Grok JSON error: ${error?.message || 'Unknown error'}`);
  }
}

export async function generateStream(
  prompt: string,
  options: AIOptions = {}
) {
  const {
    model = 'grok-beta',
    temperature = 0.7,
  } = options;

  try {
    const client = getClient();
    const stream = await client.chat.completions.create({
      model,
      messages: [{ role: 'user', content: prompt }],
      temperature,
      stream: true,
    });

    return stream;
  } catch (error: any) {
    throw new Error(`Grok stream error: ${error?.message || 'Unknown error'}`);
  }
}

export const provider = {
  name: 'grok',
  displayName: 'Grok (xAI)',
  models: {
    fast: 'grok-beta',
    standard: 'grok-beta',
    advanced: 'grok-beta',
  },
  isAvailable,
  generateText,
  generateJSON,
  generateStream,
};

export default provider;
