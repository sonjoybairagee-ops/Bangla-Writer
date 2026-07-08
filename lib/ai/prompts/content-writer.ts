import { COPYWRITING_FRAMEWORKS } from '@/lib/constants/frameworks';

interface ContentWriterParams {
  framework: string;
  product: string;
  platform: string;
  goal: string;
  tone: string;
  audience: string;
  duration?: number;
  brandVoice?: string;
  additionalContext?: string;
  language?: string;
}

export function createContentWriterPrompt(params: ContentWriterParams): string {
  const framework = COPYWRITING_FRAMEWORKS[params.framework as keyof typeof COPYWRITING_FRAMEWORKS];

  return `
You are an expert copywriter creating ${params.platform} content.

FRAMEWORK: ${framework?.name || params.framework}
${framework?.description ? `Framework Description: ${framework.description}` : ''}

PRODUCT/TOPIC: ${params.product}
PLATFORM: ${params.platform}
GOAL: ${params.goal}
TONE: ${params.tone}
TARGET AUDIENCE: ${params.audience}
${params.duration ? `DURATION: ${params.duration} seconds` : ''}

${params.brandVoice ? `BRAND VOICE:\n${params.brandVoice}` : ''}

${params.additionalContext ? `ADDITIONAL CONTEXT:\n${params.additionalContext}` : ''}

OUTPUT LANGUAGE: ${params.language === 'banglish' ? 'Conversational Banglish (Bengali words written using English alphabet)' : params.language === 'english' ? 'English' : 'Bangla (শুদ্ধ বাংলা)'}. The generated content MUST be written strictly in this language.

Create compelling content following the ${framework?.name || params.framework} framework.

Return a JSON object with this structure:
{
  "hook": "Attention-grabbing opening line",
  "body": "Main content body following the framework",
  "cta": "Clear call-to-action",
  "caption": "Complete caption for the post",
  "hashtags": ["relevant", "hashtags", "for", "platform"],
  "voiceOver": "Script for voice over (if video content)",
  "screenText": ["Text", "to", "show", "on", "screen"],
  "bRoll": ["B-roll", "shot", "suggestions"],
  "viralScore": 75
}

Make it:
- Platform-optimized for ${params.platform}
- Goal-focused for ${params.goal}
- Tone-consistent with ${params.tone}
- Audience-relevant for ${params.audience}
- Framework-adherent to ${framework?.name || params.framework}

Be creative, persuasive, and authentic.
`.trim();
}

export function createHookGeneratorPrompt(params: {
  topic: string;
  platform: string;
  audience: string;
  hookType: string;
  count?: number;
  language?: string;
}): string {
  return `
You are a viral content expert specializing in scroll-stopping hooks.

TOPIC: ${params.topic}
PLATFORM: ${params.platform}
TARGET AUDIENCE: ${params.audience}
HOOK TYPE: ${params.hookType}
OUTPUT LANGUAGE: ${params.language === 'banglish' ? 'Conversational Banglish (Bengali words written using English alphabet)' : params.language === 'english' ? 'English' : 'Bangla (শুদ্ধ বাংলা)'}. The generated hooks MUST be written strictly in this language.

Generate ${params.count || 10} powerful, scroll-stopping hooks for this topic.

Each hook should:
- Be attention-grabbing in the first 3 seconds
- Match the ${params.hookType} style
- Be optimized for ${params.platform}
- Resonate with ${params.audience}
- Create curiosity or emotional impact

Return a JSON object:
{
  "hooks": [
    {
      "text": "Hook text here...",
      "type": "${params.hookType}",
      "explanation": "Why this works",
      "visualSuggestion": "Visual element suggestion",
      "viralPotential": 8
    }
  ]
}

Make them diverse, creative, and highly engaging.
`.trim();
}

export function createContentPlanPrompt(params: {
  brand: string;
  industry: string;
  goal: string;
  platform: string[];
  duration: number;
  contentStyle: string[];
  tone: string;
  audience: string;
  language?: string;
}): string {
  return `
You are a content strategist creating a ${params.duration}-day content plan.

BRAND: ${params.brand}
INDUSTRY: ${params.industry}
PLATFORMS: ${params.platform.join(', ')}
GOAL: ${params.goal}
CONTENT STYLE: ${params.contentStyle.join(', ')}
TONE: ${params.tone}
TARGET AUDIENCE: ${params.audience}
OUTPUT LANGUAGE: ${params.language === 'banglish' ? 'Conversational Banglish (Bengali words written using English alphabet)' : params.language === 'english' ? 'English' : 'Bangla (শুদ্ধ বাংলা)'}. All generated ideas, hooks, and topics MUST be written strictly in this language.

Create a strategic ${params.duration}-day content calendar that:
- Balances different content types (educational, promotional, engagement)
- Follows the 80/20 rule (80% value, 20% promotion)
- Includes variety in formats (reels, carousels, stories, posts)
- Builds towards the ${params.goal} goal
- Maintains consistent brand presence
- Identifies 3-5 core content pillars (key themes)
- Assigns viral scores based on trending potential
- Estimates reach potential for each post

VIRAL SCORE CRITERIA (0-100):
- Hook strength (0-25): How attention-grabbing
- Emotional impact (0-25): Triggers curiosity, fear, excitement
- Shareability (0-25): Will people share this?
- Timing relevance (0-25): Trend alignment

ESTIMATED REACH:
- high: Viral potential, trending topic, strong hook
- medium: Good content, standard engagement
- low: Niche, educational, slower growth

Return a JSON object:
{
  "plan": [
    {
      "day": 1,
      "date": "YYYY-MM-DD",
      "contentType": "Reel",
      "topic": "Topic title",
      "idea": "Detailed content idea",
      "hook": "Suggested hook",
      "cta": "Call to action",
      "goal": "awareness/engagement/sales",
      "platform": "instagram",
      "viralScore": 85,
      "estimatedReach": "high",
      "hashtags": ["suggested", "hashtags"],
      "pillar": "Educational"
    }
  ],
  "strategy": "Overall strategy explanation with focus on content pillars and viral potential",
  "keyThemes": ["Content Pillar 1", "Content Pillar 2", "Content Pillar 3"],
  "contentPillars": [
    {
      "name": "Educational Content",
      "description": "Teaching and value-driven posts",
      "percentage": 40,
      "examples": ["How-to guides", "Tips & tricks", "Industry insights"]
    },
    {
      "name": "Entertainment",
      "description": "Engaging and fun content",
      "percentage": 40,
      "examples": ["Behind-the-scenes", "Trends", "Challenges"]
    },
    {
      "name": "Promotional",
      "description": "Sales and conversion focused",
      "percentage": 20,
      "examples": ["Product launches", "Offers", "Testimonials"]
    }
  ],
  "metrics": {
    "expectedPosts": ${params.duration},
    "contentMix": {
      "educational": 40,
      "entertaining": 40,
      "promotional": 20
    },
    "averageViralScore": 75,
    "highReachPosts": 10,
    "mediumReachPosts": 15,
    "lowReachPosts": 5
  },
  "platformStrategy": {
    "instagram": "Focus on reels and carousel posts for maximum reach",
    "facebook": "Community building through engaging posts and stories",
    "tiktok": "Trend-focused short-form videos with viral potential",
    "linkedin": "Professional insights and thought leadership",
    "youtube": "Long-form educational content and tutorials"
  }
}

Make it actionable, strategic, results-focused, and optimized for viral growth.
`.trim();
}

export function createBrandVoicePrompt(brandName: string, existingContent?: string): string {
  return `
You are a brand voice analyzer. Analyze the following content and extract the brand voice characteristics.

BRAND: ${brandName}

${existingContent ? `EXISTING CONTENT:\n${existingContent}` : 'No existing content provided.'}

Analyze and return a JSON object with:
{
  "tone": "The overall tone (e.g., friendly, professional, playful)",
  "personality": "Brand personality traits",
  "vocabulary": ["Key", "words", "and", "phrases"],
  "writingStyle": "Description of writing style",
  "dosList": ["Things", "the", "brand", "does"],
  "dontsList": ["Things", "the", "brand", "avoids"]
}
`.trim();
}
