/**
 * AI Provider Router - OpenAI Only (Primary Provider)
 * Simplified to use only OpenAI for reliability and consistency
 */

import openaiProvider from './openai';
import { AIResponse, AIOptions } from './openai';

export type ProviderName = 'openai' | 'auto';

export interface Provider {
  name: string;
  displayName: string;
  models: {
    fast: string;
    standard: string;
    advanced: string;
  };
  isAvailable: () => Promise<boolean>;
  generateText: (prompt: string, options?: AIOptions) => Promise<AIResponse>;
  generateJSON: <T = any>(prompt: string, options?: AIOptions) => Promise<T>;
  generateStream: (prompt: string, options?: AIOptions) => Promise<any>;
}

// Primary provider - OpenAI only
const PRIMARY_PROVIDER: Provider = openaiProvider;

/**
 * Get available provider (OpenAI only)
 */
export async function getAvailableProviders(): Promise<Provider[]> {
  try {
    const isAvailable = await PRIMARY_PROVIDER.isAvailable();
    if (isAvailable) {
      return [PRIMARY_PROVIDER];
    }
  } catch (error) {
    console.error('OpenAI provider check failed:', error);
  }
  
  return [];
}

/**
 * Get the primary provider
 */
export function getProvider(name: ProviderName): Provider | null {
  if (name === 'auto' || name === 'openai') {
    return PRIMARY_PROVIDER;
  }
  return null;
}

/**
 * Get the best available provider (always OpenAI)
 */
export async function getBestProvider(): Promise<Provider> {
  const isAvailable = await PRIMARY_PROVIDER.isAvailable();
  
  if (!isAvailable) {
    throw new Error(
      'OpenAI API is not available. Please configure your OPENAI_API_KEY:\n' +
      'Get your API key at: https://platform.openai.com/api-keys'
    );
  }

  return PRIMARY_PROVIDER;
}

/**
 * Generate text using OpenAI
 */
export async function generateText(
  prompt: string,
  options: AIOptions & { provider?: ProviderName } = {}
): Promise<AIResponse> {
  const { provider: _, ...aiOptions } = options;

  try {
    return await PRIMARY_PROVIDER.generateText(prompt, aiOptions);
  } catch (error: any) {
    throw new Error(
      `OpenAI generation failed: ${error.message}\n\n` +
      'Please check your API key and network connection.'
    );
  }
}

/**
 * Generate JSON using OpenAI
 */
export async function generateJSON<T = any>(
  prompt: string,
  options: AIOptions & { provider?: ProviderName } = {}
): Promise<T> {
  const { provider: _, ...aiOptions } = options;

  try {
    return await PRIMARY_PROVIDER.generateJSON<T>(prompt, aiOptions);
  } catch (error: any) {
    throw new Error(
      `OpenAI JSON generation failed: ${error.message}\n\n` +
      'Please check your API key and network connection.'
    );
  }
}

/**
 * Generate stream using OpenAI
 */
export async function generateStream(
  prompt: string,
  options: AIOptions & { provider?: ProviderName } = {}
) {
  const { provider: _, ...aiOptions } = options;
  return await PRIMARY_PROVIDER.generateStream(prompt, aiOptions);
}

/**
 * Get provider status for monitoring
 */
export async function getProviderStatus(): Promise<Array<{
  name: string;
  displayName: string;
  available: boolean;
  configured: boolean;
}>> {
  let available = false;
  let configured = false;

  try {
    configured = !!process.env.OPENAI_API_KEY;
    if (configured) {
      available = await PRIMARY_PROVIDER.isAvailable();
    }
  } catch (error) {
    available = false;
  }

  return [{
    name: PRIMARY_PROVIDER.name,
    displayName: PRIMARY_PROVIDER.displayName,
    available,
    configured,
  }];
}

/**
 * Clear availability cache (for compatibility)
 */
export function clearCache(): void {
  // No-op - keeping for backward compatibility
}

// Export primary provider
export { openaiProvider };

// Export types
export type { AIResponse, AIOptions, Provider };
