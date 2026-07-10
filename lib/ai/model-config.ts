/**
 * Central AI model configuration.
 * Change a model here once — every route that imports from here updates automatically.
 *
 * Usage in any route.ts:
 *   import { AI_MODELS } from '@/lib/ai/model-config';
 *   const result = await generateJSON(prompt, { model: AI_MODELS.hooks, temperature: 0.9 });
 */
export const AI_MODELS = {
  content: 'gpt-5.4',        // Content Writer / Writer Pro main generation — quality matters
  hooks: 'gpt-5.4-mini',     // Hook Generator — high volume, short output
  cta: 'gpt-5.4-mini',
  hashtags: 'gpt-5.4-mini',
  captions: 'gpt-5.4-mini',
  ovc: 'gpt-5.4',            // OVC Director — complex structured multi-scene output
  humanize: 'gpt-5.4-mini',
  truthBomb: 'gpt-5.4-mini',
  thumbnail: 'gpt-5.4-mini',
  adCreative: 'gpt-5.4-mini',
  ugc: 'gpt-5.4-mini',
  visualHook: 'gpt-5.4-mini',
  moodboard: 'gpt-5.4-mini',
  brandExtraction: 'gpt-5.4-nano', // Cheap extraction/classification task
} as const;
