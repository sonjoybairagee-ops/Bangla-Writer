/**
 * Google Gemini Provider
 * Fast and multimodal AI from Google
 */

import { AIResponse, AIOptions } from './openai';

let geminiClient: any = null;

function getClient() {
  if (!geminiClient) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not configured');
    }
    
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    geminiClient = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return geminiClient;
}

export async function isAvailable(): Promise<boolean> {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return false;
    }
    // Test if we can get a model
    const client = getClient();
    const model = client.getGenerativeModel({ model: 'gemini-pro' });
    return true;
  } catch (error) {
    console.error('Gemini not available:', error);
    return false;
  }
}

export async function generateText(
  prompt: string,
  options: AIOptions = {}
): Promise<AIResponse> {
  const {
    model = 'gemini-pro',
    temperature = 0.7,
    maxTokens = 2000,
  } = options;

  try {
    const client = getClient();
    const geminiModel = client.getGenerativeModel({ 
      model,
      generationConfig: {
        temperature,
        maxOutputTokens: maxTokens,
      },
    });

    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return {
      text,
      model,
      provider: 'gemini',
      tokensUsed: response.usageMetadata?.totalTokenCount,
    };
  } catch (error: any) {
    throw new Error(`Gemini error: ${error?.message || 'Unknown error'}`);
  }
}

export async function generateJSON<T = any>(
  prompt: string,
  options: AIOptions = {}
): Promise<T> {
  const {
    model = 'gemini-pro',
    temperature = 0.7,
  } = options;

  try {
    const client = getClient();
    const geminiModel = client.getGenerativeModel({ 
      model,
      generationConfig: {
        temperature,
      },
    });

    const enhancedPrompt = `${prompt}\n\nIMPORTANT: Respond with valid JSON only, no markdown or code blocks.`;
    const result = await geminiModel.generateContent(enhancedPrompt);
    const response = await result.response;
    let text = response.text();

    // Clean up response - remove markdown if present
    text = text.trim();
    if (text.startsWith('```json')) {
      text = text.replace(/```json\n?/g, '').replace(/```\n?$/g, '');
    } else if (text.startsWith('```')) {
      text = text.replace(/```\n?/g, '');
    }

    return JSON.parse(text);
  } catch (error: any) {
    throw new Error(`Gemini JSON error: ${error?.message || 'Unknown error'}`);
  }
}

export async function generateStream(
  prompt: string,
  options: AIOptions = {}
) {
  const {
    model = 'gemini-pro',
    temperature = 0.7,
  } = options;

  try {
    const client = getClient();
    const geminiModel = client.getGenerativeModel({ 
      model,
      generationConfig: {
        temperature,
      },
    });

    const result = await geminiModel.generateContentStream(prompt);
    return result.stream;
  } catch (error: any) {
    throw new Error(`Gemini stream error: ${error?.message || 'Unknown error'}`);
  }
}

export const provider = {
  name: 'gemini',
  displayName: 'Google Gemini',
  models: {
    fast: 'gemini-pro',
    standard: 'gemini-pro',
    advanced: 'gemini-pro',
  },
  isAvailable,
  generateText,
  generateJSON,
  generateStream,
};

export default provider;
