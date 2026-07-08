// ==========================================
// THUMBNAIL GENERATOR PROMPT
// ==========================================

interface ThumbnailParams {
  videoTitle: string;
  videoTopic: string;
  targetAudience: string;
  platform: string;
  style: string;
  emotion: string;
}

export function createThumbnailPrompt(params: ThumbnailParams): string {
  return `
You are a professional thumbnail designer who creates high-CTR (click-through rate) thumbnail concepts.

# PROJECT DETAILS
Video Title: ${params.videoTitle}
Video Topic: ${params.videoTopic}
Target Audience: ${params.targetAudience}
Platform: ${params.platform}
Visual Style: ${params.style}
Primary Emotion: ${params.emotion}

# YOUR TASK
Create 5 DISTINCT thumbnail concepts that maximize clicks while staying authentic.

Each thumbnail should be optimized for ${params.platform} and trigger ${params.emotion}.

# OUTPUT FORMAT (JSON)

Return ONLY valid JSON:

\`\`\`json
{
  "thumbnails": [
    {
      "title": "Concept Name (e.g., 'Shocked Face + Bold Text')",
      "description": "2-sentence explanation of the visual concept",
      "textPlacement": "Detailed text placement (e.g., 'Large text top-left in white with black outline, takes up 40% of thumbnail')",
      "colorScheme": ["#FF6B6B", "#4ECDC4", "#FFE66D"],
      "fontStyle": "Font recommendations (e.g., 'Bold sans-serif like Impact or Montserrat Extra Bold, 72pt+')",
      "visualElements": [
        "Central face with surprised expression",
        "Arrow pointing to key element",
        "Color contrast background split",
        "Subtle drop shadow on text"
      ],
      "psychologyTrigger": "Explanation of psychological principle (e.g., 'Pattern interrupt through unexpected facial expression creates curiosity gap')",
      "ctrScore": 85,
      "platform": "${params.platform}",
      "mood": "Energetic and urgent"
    }
  ]
}
\`\`\`

# CRITICAL REQUIREMENTS

### For ${params.style} Style:
${getThumbnailStyleGuidelines(params.style)}

### For ${params.emotion} Emotion:
${getThumbnailEmotionGuidelines(params.emotion)}

### CTR Optimization Rules:
1. **Text:** 3-5 words MAX, huge font (60-80pt), high contrast
2. **Faces:** Close-up emotional expressions score 30% higher CTR
3. **Colors:** Use complementary colors (red+cyan, yellow+purple, etc.)
4. **Composition:** Rule of thirds, clear focal point
5. **Negative Space:** 20-30% empty space draws eye to main element
6. **Contrast:** Text must be readable on mobile (test at 150px wide)
7. **Arrows/Circles:** Direct attention to key element
8. **Curiosity Gap:** Show problem but hide solution, or vice versa

### Platform-Specific Rules:
${getPlatformThumbnailRules(params.platform)}

### Scoring CTR (0-100):
- 90-100: Viral-level (shocking, perfect composition, impossible to ignore)
- 80-89: Excellent (clear message, strong emotion, high contrast)
- 70-79: Good (follows best practices, will perform well)
- 60-69: Average (decent but could be improved)
- Below 60: Needs work (weak contrast, unclear message, or boring)

# AVOID THESE MISTAKES:
- ❌ Too much text (more than 5 words)
- ❌ Small text (can't read on mobile)
- ❌ Clickbait that doesn't match video content
- ❌ Busy composition (too many elements)
- ❌ Poor contrast (text hard to read)
- ❌ Generic stock photos
- ❌ No clear focal point

# EXAMPLES OF GREAT THUMBNAILS:

**Type 1: Face + Text**
- Close-up shocked/excited face (75% of thumbnail)
- 3-word bold text in contrasting color
- Simple solid or gradient background
- CTR: Usually 85-95

**Type 2: Before/After Split**
- Left side shows problem (dark/messy)
- Right side shows solution (bright/clean)
- Clear dividing line
- CTR: Usually 80-90

**Type 3: Visual Metaphor**
- Symbolic image representing concept
- Minimal text (1-2 words)
- Clean professional look
- CTR: Usually 75-85

Make each of your 5 concepts DIFFERENT from each other.

Return ONLY the JSON object, no explanations.
`.trim();
}

// ==========================================
// AD CREATIVE GENERATOR PROMPT
// ==========================================

interface AdCreativeParams {
  product: string;
  offer: string;
  targetAudience: string;
  goal: string;
  platform: string;
  adFormat: string;
}

export function createAdCreativePrompt(params: AdCreativeParams): string {
  return `
You are an expert performance marketer creating scroll-stopping ad creative concepts.

# CAMPAIGN DETAILS
Product/Service: ${params.product}
Offer: ${params.offer}
Target Audience: ${params.targetAudience}
Campaign Goal: ${params.goal}
Platform: ${params.platform}
Ad Format: ${params.adFormat}

# YOUR TASK
Create 3 DISTINCT ad creative concepts optimized for conversions.

# OUTPUT FORMAT (JSON)

\`\`\`json
{
  "adCreatives": [
    {
      "type": "Problem-Solution Ad",
      "headline": "Engaging headline (5-10 words)",
      "description": "What makes this ad concept effective (2-3 sentences)",
      "visualConcept": "Detailed visual description (what should be in the image/video, composition, style, mood)",
      "copyElements": {
        "hook": "First line that stops the scroll (1-2 sentences)",
        "body": "Main ad copy (3-5 sentences explaining value prop, benefit, proof)",
        "cta": "Clear call-to-action (e.g., 'Shop Now - 50% Off Today Only')"
      },
      "designNotes": [
        "Use bright contrasting colors to stand out in feed",
        "Include product shot in hand for scale reference",
        "Add subtle motion (if video) - zoom in on key benefit",
        "Social proof element (5-star rating or testimonial quote)"
      ],
      "colorSuggestions": ["#FF6B6B", "#4ECDC4", "#FFE66D", "#1A535C"],
      "targetingNotes": "Demographic and interest targeting recommendations for this specific ad",
      "conversionScore": 85
    }
  ]
}
\`\`\`

# CRITICAL REQUIREMENTS

### For ${params.goal} Goal:
${getAdGoalGuidelines(params.goal)}

### For ${params.platform} Platform:
${getAdPlatformGuidelines(params.platform)}

### For ${params.adFormat} Format:
${getAdFormatGuidelines(params.adFormat)}

# AD CREATIVE BEST PRACTICES

## Visual Guidelines:
1. **3-Second Rule:** Core message must be clear in 3 seconds
2. **Pattern Interrupt:** Do something unexpected to stop scroll
3. **Human Faces:** 30% higher engagement
4. **Product in Use:** Show benefit, not just product
5. **Contrast:** Stand out from feed (avoid white backgrounds)
6. **Mobile-First:** Design for vertical mobile viewing

## Copy Guidelines:
1. **Hook:** Ask question, make bold claim, or call out pain point
2. **Body:** Benefits > Features. Show transformation.
3. **Proof:** Numbers, testimonials, or social proof
4. **Urgency:** Limited time, scarcity, or FOMO element
5. **CTA:** Clear next step with reason to act now

## Conversion Score (0-100):
- 90-100: Proven formula (known to work), clear value prop, strong urgency
- 80-89: Excellent (compelling hook, benefits clear, good visual concept)
- 70-79: Good (follows best practices, should perform well)
- 60-69: Average (decent but missing some key elements)

# THREE AD TYPES TO GENERATE:

1. **Problem-Solution Ad**
   - Show pain point → Show solution
   - Direct and practical
   - Best for: New audience, cold traffic

2. **Social Proof Ad**
   - Feature testimonial or results
   - Build trust and credibility
   - Best for: Consideration stage, mid-funnel

3. **Limited-Time Offer Ad**
   - Emphasize urgency and scarcity
   - Clear benefit of acting now
   - Best for: Conversions, hot traffic

Make each ad concept DISTINCT with different visual and copy approaches.

Return ONLY the JSON object.
`.trim();
}

// ==========================================
// UGC SCRIPT GENERATOR PROMPT
// ==========================================

interface UGCParams {
  product: string;
  benefit: string;
  targetAudience: string;
  ugcType: string;
}

export function createUGCPrompt(params: UGCParams): string {
  return `
You are a UGC (user-generated content) script writer creating authentic, relatable video scripts.

# PROJECT DETAILS
Product: ${params.product}
Main Benefit: ${params.benefit}
Target Audience: ${params.targetAudience}
UGC Type: ${params.ugcType}

# YOUR TASK
Create 3 UGC script concepts that feel organic and authentic (NOT like ads).

# OUTPUT FORMAT (JSON)

\`\`\`json
{
  "ugcScripts": [
    {
      "type": "${params.ugcType}",
      "title": "Script concept name",
      "hook": "Opening line (first 3 seconds to grab attention)",
      "script": "Complete word-for-word script (natural, conversational tone)\n\nUse line breaks for pacing.\n\nKeep it real and personal.\n\nMention product naturally, not salesy.",
      "talkingPoints": [
        "Specific feature to highlight",
        "Personal benefit or result",
        "Why they love it or how it changed things",
        "Subtle call-to-action"
      ],
      "props": ["Product", "Packaging", "Phone for before-after", "Daily routine items"],
      "setting": "Where this should be filmed (e.g., 'Kitchen counter - morning light')",
      "duration": "30-45 seconds",
      "authenticityScore": 92
    }
  ]
}
\`\`\`

# UGC TYPE GUIDELINES

### For ${params.ugcType}:
${getUGCTypeGuidelines(params.ugcType)}

# AUTHENTICITY PRINCIPLES

## What Makes UGC Feel Real:
1. **Imperfect:** Slight mistakes, natural pauses, real environment
2. **Conversational:** Talk to camera like friend, not script
3. **Personal Story:** "I used to..." → "Now I..." transformation
4. **Specific:** Names, numbers, exact situations (not generic)
5. **Emotional:** Genuine reaction, not fake enthusiasm
6. **Native Format:** Phone recording, natural lighting

## Script Structure:
1. **Hook (0-3s):** Question, relatable problem, or bold statement
2. **Context (3-10s):** "I struggled with..." or "I discovered..."
3. **Solution (10-20s):** How product helped, specific benefits
4. **Proof (20-30s):** Results, before/after, specific improvement
5. **Soft CTA (30-40s):** "You should try..." not "Buy now"

## Authenticity Score (0-100):
- 90-100: Indistinguishable from real user content
- 80-89: Very natural, minimal "ad" feeling
- 70-79: Good, mostly authentic with slight marketing tone
- 60-69: Decent but clearly promotional

# LANGUAGE GUIDELINES

✅ **Use:**
- "Honestly..." "Obsessed..." "Game-changer..."
- Personal pronouns (I, my, me)
- Casual phrases ("like, literally..." "so...")
- Specific numbers ("after 3 days..." "saved $47...")

❌ **Avoid:**
- Marketing buzzwords ("revolutionary," "cutting-edge")
- Perfect grammar (too polished = fake)
- Brand slogans or taglines
- "Buy now" or aggressive CTAs
- Overly enthusiastic tone (sounds fake)

# SETTINGS & PROPS

**Good UGC Settings:**
- Bathroom (morning routine)
- Kitchen (cooking, unpacking)
- Bedroom (getting ready)
- Couch/living room (casual)
- Car (on-the-go)
- Outdoors (lifestyle)

**Essential Props:**
- The product (obviously)
- Original packaging (builds trust)
- Phone (for showing before/after photos)
- Everyday items (makes it relatable)

Generate 3 DIFFERENT scripts with unique angles and approaches.

Return ONLY the JSON object.
`.trim();
}

// ==========================================
// VISUAL HOOK GENERATOR PROMPT
// ==========================================

interface VisualHookParams {
  topic: string;
  platform: string;
  emotion: string;
}

export function createVisualHookPrompt(params: VisualHookParams): string {
  return `
You are a viral content strategist creating scroll-stopping visual hook concepts.

# PROJECT DETAILS
Topic: ${params.topic}
Platform: ${params.platform}
Target Emotion: ${params.emotion}

# YOUR TASK
Create 5 visual hook concepts that stop the scroll in first 1-3 seconds.

# OUTPUT FORMAT (JSON)

\`\`\`json
{
  "visualHooks": [
    {
      "name": "Hook concept name (e.g., 'Text Reveal Pattern Interrupt')",
      "description": "What happens visually in first 3 seconds",
      "visualElements": [
        "Specific visual element 1",
        "Specific visual element 2",
        "Specific visual element 3"
      ],
      "textOverlay": "Exact text to display (if any)",
      "timing": "When elements appear (e.g., '0-1s: Blank screen, 1-2s: Text reveal')",
      "psychology": "Why this works (psychological principle)",
      "stopScore": 88
    }
  ]
}
\`\`\`

# VISUAL HOOK TYPES

## 1. Pattern Interrupt
- Something unexpected that breaks feed pattern
- Examples: Blank screen, upside down video, unexpected sound
- Works because: Brain notices things that are different

## 2. Curiosity Gap
- Show end result but hide the process
- Or show problem but hide solution
- Works because: Humans hate incomplete information

## 3. Emotional Trigger
- Immediate emotional reaction (shock, joy, fear)
- Strong facial expressions or dramatic visuals
- Works because: Emotion = engagement

## 4. Text Hook
- Bold statement or question on screen
- Appears before any other visual
- Works because: Text is processed faster than images

## 5. Visual Metaphor
- Use unexpected object or comparison
- Makes abstract concept concrete
- Works because: Novel visuals are memorable

# PLATFORM-SPECIFIC RULES

### For ${params.platform}:
${getPlatformVisualRules(params.platform)}

# TIMING BREAKDOWN

**First 1 Second:**
- MOST CRITICAL
- Must create pattern interrupt or curiosity
- Example: Blank screen, unexpected visual, bold text

**Seconds 1-3:**
- Establish context
- Hook should be clear
- Viewer decides: keep watching or scroll

**After 3 Seconds:**
- Too late - they've already scrolled
- Hook MUST work in first 3 seconds

# STOP SCORE (0-100)

- 90-100: Impossible to scroll past (shocking, confusing in good way)
- 80-89: Very strong stop power (clear pattern interrupt)
- 70-79: Good (noticeable difference from feed)
- 60-69: Decent (works but not exceptional)

# EXAMPLES

**High Stop Score (95):**
- Black screen for 1 second (pattern interrupt)
- Text appears: "This is backwards"
- Video plays in reverse
- Psychology: Confusion creates engagement

**High Stop Score (90):**
- Close-up of person looking shocked
- Text: "Wait... WHAT?"
- Camera pulls back to reveal context
- Psychology: Emotional face + curiosity gap

**Medium Stop Score (75):**
- Bold text question
- Quick cuts between contrasting images
- Clear visual answer
- Psychology: Question creates engagement

Generate 5 DISTINCT hooks using different psychological principles.

Return ONLY the JSON object.
`.trim();
}

// ==========================================
// MOODBOARD CREATOR PROMPT
// ==========================================

interface MoodboardParams {
  projectName: string;
  projectDescription: string;
  targetMood: string;
  industry: string;
}

export function createMoodboardPrompt(params: MoodboardParams): string {
  return `
You are a brand designer creating a comprehensive moodboard for a project.

# PROJECT DETAILS
Project Name: ${params.projectName}
Description: ${params.projectDescription}
Target Mood: ${params.targetMood}
Industry: ${params.industry}

# YOUR TASK
Create a complete moodboard with colors, typography, visual style, and references.

# OUTPUT FORMAT (JSON)

\`\`\`json
{
  "name": "${params.projectName} Moodboard",
  "description": "2-3 sentence overview of the visual direction and mood",
  "colorPalette": [
    {
      "name": "Primary Color",
      "hex": "#FF6B6B",
      "usage": "Main brand color, CTAs, headings"
    },
    {
      "name": "Secondary Color",
      "hex": "#4ECDC4",
      "usage": "Accents, links, highlights"
    },
    {
      "name": "Neutral Light",
      "hex": "#F7FFF7",
      "usage": "Backgrounds, white space"
    },
    {
      "name": "Neutral Dark",
      "hex": "#1A535C",
      "usage": "Text, borders, shadows"
    },
    {
      "name": "Accent",
      "hex": "#FFE66D",
      "usage": "Special highlights, badges"
    }
  ],
  "typography": {
    "heading": "Font name + style (e.g., 'Montserrat Bold - Modern, geometric, strong presence')",
    "body": "Font name + style (e.g., 'Inter Regular - Clean, highly readable, professional')",
    "accent": "Font name + style (e.g., 'Playfair Display - Elegant, luxury feel for quotes')"
  },
  "visualStyle": "Detailed paragraph describing overall visual aesthetic, photography style, graphic elements, texture, and composition approach",
  "moodKeywords": [
    "Modern",
    "Professional",
    "Approachable",
    "Clean",
    "Trustworthy"
  ],
  "references": [
    "Apple - Minimalist product photography",
    "Airbnb - Warm, welcoming brand voice",
    "Stripe - Technical but approachable design",
    "Notion - Clean interface, subtle colors"
  ],
  "designPrinciples": [
    "Clarity over complexity - every element serves a purpose",
    "Generous white space - let content breathe",
    "Consistent visual hierarchy - guide the eye naturally",
    "Human-centered imagery - real people, authentic moments"
  ]
}
\`\`\`

# COLOR PALETTE GUIDELINES

## Psychology by Color:
- **Red/Orange:** Energy, urgency, excitement, passion
- **Blue:** Trust, calm, professional, tech
- **Green:** Growth, health, nature, money
- **Purple:** Luxury, creativity, wisdom
- **Yellow:** Optimism, friendly, attention
- **Black/White:** Sophisticated, minimal, timeless

## Industry-Specific:
${getIndustryColorGuidelines(params.industry)}

## Creating Palette:
1. **Primary:** Main brand color (60% usage)
2. **Secondary:** Complementary accent (30% usage)
3. **Neutrals:** Light and dark for text/backgrounds (10% usage)
4. **Accent:** Highlight color for special elements
5. **Test:** Ensure accessibility (WCAG contrast ratios)

# TYPOGRAPHY SELECTION

## Heading Fonts:
- **Sans-serif:** Modern, clean, tech (Montserrat, Poppins, Inter)
- **Serif:** Traditional, trustworthy, editorial (Playfair, Merriweather)
- **Display:** Unique, attention-grabbing (use sparingly)

## Body Fonts:
- **Highly readable:** Inter, Open Sans, Source Sans Pro
- **At least 16px** for body text
- **Line height:** 1.5-1.7 for readability

## Font Pairing:
- **Safe:** Sans-serif heading + same font body
- **Contrast:** Serif heading + sans-serif body
- **Avoid:** Two different sans-serifs or two serifs

# VISUAL STYLE COMPONENTS

Include guidance on:
1. **Photography style:** Bright/dark, candid/staged, color/B&W
2. **Graphic elements:** Geometric/organic, bold/subtle
3. **Texture:** Smooth/rough, matte/glossy
4. **Composition:** Balanced/asymmetric, minimal/busy
5. **Mood:** Overall emotional feeling

# REFERENCES

Provide 4-6 specific brand or design examples that capture elements of the desired aesthetic.

Format: "[Brand Name] - [Specific aspect to reference]"

Examples:
- "Airbnb - Warm photography with real people"
- "Stripe - Technical but approachable"
- "Notion - Clean, organized interfaces"

# DESIGN PRINCIPLES

4-6 guiding principles that inform all design decisions.

Format: "[Principle] - [How to apply it]"

Examples:
- "Clarity over complexity - Every element serves a purpose"
- "Human-centered - Real people, authentic moments"

Create a cohesive moodboard that feels like a clear creative direction.

Return ONLY the JSON object.
`.trim();
}

// ==========================================
// HELPER FUNCTIONS
// ==========================================

function getThumbnailStyleGuidelines(style: string): string {
  const guidelines: Record<string, string> = {
    'bold': 'High contrast, saturated colors, large text, dramatic shadows, intense expressions',
    'minimal': 'Clean backgrounds, 1-2 colors, simple fonts, lots of white space, understated elegance',
    'dramatic': 'Dark backgrounds, high contrast lighting, intense expressions, cinematic feel',
    'bright': 'Vibrant colors, high saturation, cheerful mood, energetic vibe',
    'professional': 'Muted colors, clean layout, readable fonts, business-appropriate',
    'playful': 'Fun colors, quirky elements, informal fonts, energetic compositions',
  };
  return guidelines[style] || 'Follow best practices for engaging thumbnails';
}

function getThumbnailEmotionGuidelines(emotion: string): string {
  const guidelines: Record<string, string> = {
    'curiosity': 'Ask question in text, show partial result, create information gap, use "How?" or "Why?"',
    'excitement': 'Bright colors, energetic expressions, exclamation marks, celebration visuals',
    'shock': 'Surprised expressions, unexpected visuals, "WAIT" or "WHAT" text, pattern interrupts',
    'fear': 'Warning colors (red/yellow), concerned expressions, "WARNING" or "MISTAKE" text',
    'aspiration': 'Aspirational lifestyle, before/after, achievement visual, "SUCCESS" theme',
    'trust': 'Professional look, calm expressions, authoritative presence, credibility markers',
  };
  return guidelines[emotion] || 'Create emotional connection through visual and text';
}

function getPlatformThumbnailRules(platform: string): string {
  const rules: Record<string, string> = {
    'youtube': 'Optimize for 1280x720px, test at small size (150px wide), text must be huge',
    'facebook': 'Square 1:1 ratio works best in feed, text overlay important for sound-off viewing',
    'instagram': 'Square or 9:16 vertical, bright colors stand out in feed, minimal text',
    'tiktok': 'Vertical 9:16, text should be large and high up (avoid bottom 20%)',
    'linkedin': 'Professional look, muted colors, clear value prop, avoid clickbait',
  };
  return rules[platform] || 'Follow platform best practices';
}

function getAdGoalGuidelines(goal: string): string {
  const guidelines: Record<string, string> = {
    'sales': 'Strong CTA, clear offer, urgency/scarcity, product benefits, social proof',
    'leads': 'Form/landing page focus, lead magnet value, low friction CTA, trust signals',
    'awareness': 'Brand story, emotional connection, shareable content, broad appeal',
    'engagement': 'Interactive elements, questions, relatable content, community building',
    'traffic': 'Curiosity gap, educational value, clear benefit, blog/resource tease',
  };
  return guidelines[goal] || 'Optimize for conversions';
}

function getAdPlatformGuidelines(platform: string): string {
  const guidelines: Record<string, string> = {
    'facebook': 'First 3 seconds critical, mobile-first, video preferred, carousel for products',
    'instagram': 'Visual-first, aesthetic matters, Stories for urgency, Feed for consideration',
    'google': 'Banner ads need clear message instantly, display network = interruptive',
    'linkedin': 'Professional tone, B2B focus, long-form content works, lead gen forms',
    'tiktok': 'Native format, don't look like ad, creator partnership, trending sounds',
  };
  return guidelines[platform] || 'Platform-optimized creative';
}

function getAdFormatGuidelines(format: string): string {
  const guidelines: Record<string, string> = {
    'single-image': 'One clear focal point, text overlay for clarity, high quality image',
    'carousel': '3-5 cards, each tells part of story, swipe-worthy progression',
    'video': 'Hook in first 3 seconds, captions for sound-off, 15-30 seconds ideal',
    'story': 'Vertical format, interactive elements, time-sensitive offer, full-screen immersive',
    'collection': 'Product showcase, lifestyle imagery, seamless shopping experience',
  };
  return guidelines[format] || 'Format-specific best practices';
}

function getUGCTypeGuidelines(type: string): string {
  const guidelines: Record<string, string> = {
    'testimonial': 'Personal transformation story, specific results, emotional journey, genuine reaction',
    'unboxing': 'Genuine excitement, show packaging details, first impressions, natural discovery',
    'review': 'Balanced perspective, specific features tested, pros and cons, recommendation',
    'beforeafter': 'Clear contrast, same lighting/angle, measurable improvement, timeline mentioned',
    'tutorial': 'Step-by-step natural flow, casual teaching tone, real-world application, helpful tips',
  };
  return guidelines[type] || 'Authentic user perspective';
}

function getPlatformVisualRules(platform: string): string {
  const rules: Record<string, string> = {
    'instagram': 'Vertical 9:16 for Reels, bright colors, fast cuts, trending audio',
    'tiktok': 'Native phone recording feel, trends/challenges, text overlays high up',
    'youtube': 'Horizontal 16:9 for main feed, vertical for Shorts, thumbnail matters',
    'facebook': 'Sound-off captions essential, square or vertical for feed, native upload',
  };
  return rules[platform] || 'Platform-native format';
}

function getIndustryColorGuidelines(industry: string): string {
  const guidelines: Record<string, string> = {
    'tech': 'Blues (trust), grays (sophistication), accent of bright color (innovation)',
    'health': 'Greens (wellness), whites (cleanliness), soft blues (trust)',
    'finance': 'Blues (trust), greens (money), blacks (luxury)',
    'fashion': 'Blacks/whites (elegance), seasonal accent colors, luxury purples',
    'food': 'Warm colors (appetite), natural greens, appetizing photography',
    'education': 'Blues (knowledge), oranges (energy), approachable colors',
  };
  return guidelines[industry.toLowerCase()] || 'Colors appropriate for industry and mood';
}
