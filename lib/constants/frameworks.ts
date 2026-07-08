export const COPYWRITING_FRAMEWORKS = {
  AIDA: {
    id: 'AIDA',
    name: 'AIDA',
    description: 'Attention, Interest, Desire, Action',
    structure: [
      { step: 'Attention', description: 'Grab attention with a powerful hook' },
      { step: 'Interest', description: 'Build interest with relevant information' },
      { step: 'Desire', description: 'Create desire by showing benefits' },
      { step: 'Action', description: 'Drive action with clear CTA' },
    ],
    bestFor: ['Sales posts', 'Product launches', 'Email campaigns'],
  },
  PAS: {
    id: 'PAS',
    name: 'PAS',
    description: 'Problem, Agitate, Solution',
    structure: [
      { step: 'Problem', description: 'Identify the problem' },
      { step: 'Agitate', description: 'Make the problem feel urgent' },
      { step: 'Solution', description: 'Present your solution' },
    ],
    bestFor: ['Pain point marketing', 'Problem-solving content', 'Urgency-driven ads'],
  },
  BAB: {
    id: 'BAB',
    name: 'BAB',
    description: 'Before, After, Bridge',
    structure: [
      { step: 'Before', description: 'Current painful situation' },
      { step: 'After', description: 'Desired outcome' },
      { step: 'Bridge', description: 'How to get there (your solution)' },
    ],
    bestFor: ['Transformation stories', 'Case studies', 'Before/after content'],
  },
  STORY: {
    id: 'STORY',
    name: 'Story',
    description: 'Narrative-driven content',
    structure: [
      { step: 'Hook', description: 'Start with an engaging moment' },
      { step: 'Build', description: 'Develop the narrative' },
      { step: 'Conflict', description: 'Present the challenge' },
      { step: 'Resolution', description: 'Show the outcome' },
      { step: 'Lesson', description: 'Connect to audience' },
    ],
    bestFor: ['Personal brand', 'Emotional connection', 'Viral content'],
  },
  FOUR_P: {
    id: 'FOUR_P',
    name: '4P Formula',
    description: 'Promise, Picture, Proof, Push',
    structure: [
      { step: 'Promise', description: 'Make a bold promise' },
      { step: 'Picture', description: 'Paint a vivid picture' },
      { step: 'Proof', description: 'Provide evidence' },
      { step: 'Push', description: 'Push to action' },
    ],
    bestFor: ['Sales letters', 'Landing pages', 'High-converting ads'],
  },
  PEA: {
    id: 'PEA',
    name: 'PEA',
    description: 'Problem, Effect, Action',
    structure: [
      { step: 'Problem', description: 'State the problem' },
      { step: 'Effect', description: 'Show the consequences' },
      { step: 'Action', description: 'Call to action' },
    ],
    bestFor: ['Quick posts', 'Awareness content', 'Social media'],
  },
  QUEST: {
    id: 'QUEST',
    name: 'QUEST',
    description: 'Qualify, Understand, Educate, Stimulate, Transition',
    structure: [
      { step: 'Qualify', description: 'Target the right audience' },
      { step: 'Understand', description: 'Show empathy' },
      { step: 'Educate', description: 'Teach something valuable' },
      { step: 'Stimulate', description: 'Inspire action' },
      { step: 'Transition', description: 'Move to offer' },
    ],
    bestFor: ['Educational content', 'Long-form content', 'Trust building'],
  },
} as const;

export const HOOK_TYPES = {
  FEAR: 'Fear - Warn about consequences',
  CURIOSITY: 'Curiosity - Create intrigue',
  AUTHORITY: 'Authority - Establish credibility',
  CONTRARIAN: 'Contrarian - Challenge beliefs',
  STORY: 'Story - Start with narrative',
  PAIN: 'Pain - Address problems',
  DESIRE: 'Desire - Promise outcomes',
  SHOCK: 'Shock - Surprising statement',
  QUESTION: 'Question - Engage with inquiry',
  STATS: 'Stats - Use data',
} as const;

export const CONTENT_TONES = [
  { value: 'friendly', label: 'Friendly' },
  { value: 'luxury', label: 'Luxury' },
  { value: 'premium', label: 'Premium' },
  { value: 'funny', label: 'Funny' },
  { value: 'professional', label: 'Professional' },
  { value: 'emotional', label: 'Emotional' },
  { value: 'bold', label: 'Bold' },
  { value: 'casual', label: 'Casual' },
  { value: 'authoritative', label: 'Authoritative' },
] as const;

export const CONTENT_PLATFORMS = [
  { value: 'facebook', label: 'Facebook' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'x', label: 'X (Twitter)' },
  { value: 'threads', label: 'Threads' },
] as const;

export const CONTENT_GOALS = [
  { value: 'sales', label: 'Sales' },
  { value: 'leads', label: 'Leads' },
  { value: 'awareness', label: 'Awareness' },
  { value: 'engagement', label: 'Engagement' },
  { value: 'education', label: 'Education' },
] as const;

export const CONTENT_STYLES = [
  { value: 'educational', label: 'Educational' },
  { value: 'entertaining', label: 'Entertaining' },
  { value: 'promotional', label: 'Promotional' },
  { value: 'personal_brand', label: 'Personal Brand' },
  { value: 'storytelling', label: 'Storytelling' },
] as const;
