/**
 * OpenAI Provider
 * Primary AI provider with GPT-4o and GPT-4o-mini
 */

import OpenAI from 'openai';

export interface AIResponse {
  text: string;
  model: string;
  provider: string;
  tokensUsed?: number;
}

export interface AIOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

let openaiClient: OpenAI | null = null;

function getClient(): OpenAI {
  if (!openaiClient) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not configured');
    }
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openaiClient;
}

export async function isAvailable(): Promise<boolean> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return false;
    }
    const client = getClient();
    // Quick test to verify API key works
    await client.models.list();
    return true;
  } catch (error) {
    console.error('OpenAI not available:', error);
    return false;
  }
}

export async function generateText(
  prompt: string,
  options: AIOptions = {}
): Promise<AIResponse> {
  const {
    model = 'gpt-4o-mini',
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
      provider: 'openai',
      tokensUsed: response.usage?.total_tokens,
    };
  } catch (error: any) {
    // Enhance error messages
    if (error?.error?.code === 'invalid_api_key') {
      throw new Error('Invalid OpenAI API key. Please check your configuration.');
    }
    if (error?.error?.code === 'insufficient_quota') {
      throw new Error('OpenAI API quota exceeded. Please check your billing.');
    }
    if (error?.message?.includes('timeout')) {
      throw new Error('OpenAI request timed out. Please try again.');
    }
    
    throw new Error(`OpenAI error: ${error?.message || 'Unknown error'}`);
  }
}

export async function generateJSON<T = any>(
  prompt: string,
  options: AIOptions = {}
): Promise<T> {
  const {
    model = 'gpt-4o-mini',
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
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0]?.message?.content || '{}';
    return JSON.parse(content);
  } catch (error: any) {
    if (error?.error?.code === 'invalid_api_key') {
      throw new Error('Invalid OpenAI API key. Please check your configuration.');
    }
    if (error?.error?.code === 'insufficient_quota') {
      throw new Error('OpenAI API quota exceeded. Please check your billing.');
    }
    
    throw new Error(`OpenAI JSON error: ${error?.message || 'Unknown error'}`);
  }
}

export async function generateStream(
  prompt: string,
  options: AIOptions = {}
) {
  const {
    model = 'gpt-4o-mini',
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
    throw new Error(`OpenAI stream error: ${error?.message || 'Unknown error'}`);
  }
}

export const provider = {
  name: 'openai',
  displayName: 'OpenAI',
  models: {
    fast: 'gpt-4o-mini',      // Cheap and fast
    standard: 'gpt-4o',        // Balanced
    advanced: 'gpt-4o',        // Best quality
  },
  isAvailable,
  generateText,
  generateJSON,
  generateStream,
};

export default provider;
