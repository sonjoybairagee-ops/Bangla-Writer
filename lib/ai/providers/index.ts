/**
 * AI Provider Router with Smart Fallback
 * Automatically routes requests to available providers
 */

import openaiProvider from './openai';
import grokProvider from './grok';
import geminiProvider from './gemini';
import claudeProvider from './claude';
import { AIResponse, AIOptions } from './openai';

export type ProviderName = 'openai' | 'grok' | 'gemini' | 'claude' | 'auto';

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

// All available providers in priority order
const ALL_PROVIDERS: Provider[] = [
  openaiProvider,  // Primary: Best quality, most reliable
  grokProvider,    // Fast: Good for quick responses
  geminiProvider,  // Free tier available, fast
  claudeProvider,  // Advanced: Best reasoning
];

// Cache for provider availability (reset every 5 minutes)
let availabilityCache: Record<string, { available: boolean; timestamp: number }> = {};
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Get all available providers
 */
export async function getAvailableProviders(): Promise<Provider[]> {
  const available: Provider[] = [];
  const now = Date.now();

  for (const provider of ALL_PROVIDERS) {
    const cached = availabilityCache[provider.name];
    
    // Use cache if fresh
    if (cached && (now - cached.timestamp) < CACHE_TTL) {
      if (cached.available) {
        available.push(provider);
      }
      continue;
    }

    // Check availability
    try {
      const isAvailable = await provider.isAvailable();
      availabilityCache[provider.name] = { available: isAvailable, timestamp: now };
      
      if (isAvailable) {
        available.push(provider);
      }
    } catch (error) {
      console.error(`Provider ${provider.name} check failed:`, error);
      availabilityCache[provider.name] = { available: false, timestamp: now };
    }
  }

  return available;
}

/**
 * Get a specific provider by name
 */
export function getProvider(name: ProviderName): Provider | null {
  if (name === 'auto') return null;
  return ALL_PROVIDERS.find(p => p.name === name) || null;
}

/**
 * Get the best available provider
 */
export async function getBestProvider(): Promise<Provider> {
  const available = await getAvailableProviders();
  
  if (available.length === 0) {
    throw new Error(
      'No AI providers are available. Please configure at least one API key:\n' +
      '- OPENAI_API_KEY (https://platform.openai.com/api-keys)\n' +
      '- GROK_API_KEY (https://x.ai/api)\n' +
      '- GEMINI_API_KEY (https://makersuite.google.com/app/apikey)\n' +
      '- ANTHROPIC_API_KEY (https://console.anthropic.com/)'
    );
  }

  return available[0];
}

/**
 * Generate text with smart routing and fallback
 */
export async function generateText(
  prompt: string,
  options: AIOptions & { provider?: ProviderName } = {}
): Promise<AIResponse> {
  const { provider: preferredProvider, ...aiOptions } = options;

  // If specific provider requested, try it first
  if (preferredProvider && preferredProvider !== 'auto') {
    const provider = getProvider(preferredProvider);
    if (provider) {
      try {
        const available = await provider.isAvailable();
        if (available) {
          return await provider.generateText(prompt, aiOptions);
        }
      } catch (error) {
        console.error(`${preferredProvider} failed, trying fallback:`, error);
      }
    }
  }

  // Auto mode: try providers in order until one works
  const availableProviders = await getAvailableProviders();
  const errors: string[] = [];

  for (const provider of availableProviders) {
    try {
      console.log(`Trying provider: ${provider.name}`);
      const result = await provider.generateText(prompt, aiOptions);
      console.log(`✓ Success with ${provider.name}`);
      return result;
    } catch (error: any) {
      const errorMsg = `${provider.name}: ${error.message}`;
      errors.push(errorMsg);
      console.error(`✗ ${errorMsg}`);
      continue;
    }
  }

  // All providers failed
  throw new Error(
    `All AI providers failed:\n${errors.join('\n')}\n\n` +
    'Please check your API keys and network connection.'
  );
}

/**
 * Generate JSON with smart routing and fallback
 */
export async function generateJSON<T = any>(
  prompt: string,
  options: AIOptions & { provider?: ProviderName } = {}
): Promise<T> {
  const { provider: preferredProvider, ...aiOptions } = options;

  // If specific provider requested, try it first
  if (preferredProvider && preferredProvider !== 'auto') {
    const provider = getProvider(preferredProvider);
    if (provider) {
      try {
        const available = await provider.isAvailable();
        if (available) {
          return await provider.generateJSON<T>(prompt, aiOptions);
        }
      } catch (error) {
        console.error(`${preferredProvider} failed, trying fallback:`, error);
      }
    }
  }

  // Auto mode: try providers in order until one works
  const availableProviders = await getAvailableProviders();
  const errors: string[] = [];

  for (const provider of availableProviders) {
    try {
      console.log(`Trying provider: ${provider.name}`);
      const result = await provider.generateJSON<T>(prompt, aiOptions);
      console.log(`✓ Success with ${provider.name}`);
      return result;
    } catch (error: any) {
      const errorMsg = `${provider.name}: ${error.message}`;
      errors.push(errorMsg);
      console.error(`✗ ${errorMsg}`);
      continue;
    }
  }

  // All providers failed
  throw new Error(
    `All AI providers failed:\n${errors.join('\n')}\n\n` +
    'Please check your API keys and network connection.'
  );
}

/**
 * Generate stream with smart routing (no fallback for streams)
 */
export async function generateStream(
  prompt: string,
  options: AIOptions & { provider?: ProviderName } = {}
) {
  const { provider: preferredProvider, ...aiOptions } = options;

  // For streaming, we need to pick one provider upfront
  let provider: Provider;

  if (preferredProvider && preferredProvider !== 'auto') {
    provider = getProvider(preferredProvider) || await getBestProvider();
  } else {
    provider = await getBestProvider();
  }

  return await provider.generateStream(prompt, aiOptions);
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
  const status = [];

  for (const provider of ALL_PROVIDERS) {
    let available = false;
    let configured = false;

    try {
      // Check if API key is configured
      const envKey = `${provider.name.toUpperCase()}_API_KEY`;
      configured = !!process.env[envKey];

      if (configured) {
        available = await provider.isAvailable();
      }
    } catch (error) {
      available = false;
    }

    status.push({
      name: provider.name,
      displayName: provider.displayName,
      available,
      configured,
    });
  }

  return status;
}

/**
 * Clear availability cache (useful for testing)
 */
export function clearCache(): void {
  availabilityCache = {};
}

// Export individual providers
export { openaiProvider, grokProvider, geminiProvider, claudeProvider };

// Export types
export type { AIResponse, AIOptions, Provider };
