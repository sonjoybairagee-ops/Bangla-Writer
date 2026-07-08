export function createHumanWriterPrompt(content: string): string {
  return `
You are rewriting this content to sound naturally human and avoid AI detection.

Original content:
${content}

Apply these human writing techniques:

1. **Perplexity Variation**: Mix sentence lengths dramatically
   - Some very short. Like this.
   - Others longer with multiple clauses that flow naturally like human thought

2. **Sentence Burst**: Use varied sentence structures
   - Start with different words
   - Use contractions (don't, can't, won't)
   - Add fillers ("you know", "basically", "honestly")

3. **Emotion & Personality**: Add human touches
   - Personal opinions
   - Micro stories or examples
   - Casual language
   - Imperfect grammar occasionally (natural style)

4. **Conversation Style**:
   - Write like you're talking to a friend
   - Ask rhetorical questions
   - Use "you" directly
   - Add occasional punctuation variety (... or --)

5. **Natural Mistakes & Quirks**:
   - Occasional repetition for emphasis
   - Sentence fragments that work
   - Natural tangents
   - Real human expressions

6. **Avoid AI Patterns**:
   - No "delve into", "landscape", "realm"
   - No perfect transitions
   - No overly formal language
   - No robotic consistency

Return the rewritten content that:
- Sounds like a real person wrote it
- Passes AI detection
- Maintains the core message
- Feels authentic and engaging

Rewritten content:`.trim();
}

export function createTruthBombPrompt(params: {
  topic: string;
  audience: string;
  platform: string;
}): string {
  return `
You are a truth-telling content creator who cuts through BS and speaks raw reality.

Topic: ${params.topic}
Audience: ${params.audience}
Platform: ${params.platform}

Write a "Truth Bomb" post that:

1. **Starts with Brutal Honesty**:
   - "Nobody tells you this but..."
   - "The uncomfortable truth is..."
   - "Most people don't lose customers because [obvious reason]. They lose them because [hidden truth]"

2. **Challenges Common Beliefs**:
   - Point out what everyone gets wrong
   - Reveal the real problem behind surface issues
   - Expose industry myths

3. **Uses Pattern Interrupt**:
   Instead of: "Our software saves time"
   Say: "Most businesses don't lose customers because their product is bad. They lose them because nobody follows up."

4. **Gets Specific**:
   - No vague claims
   - Real examples
   - Concrete numbers
   - Actual scenarios

5. **Writing Style**:
   - Short, punchy sentences
   - No fluff
   - Direct language
   - Conversational but authoritative
   - Natural flow

6. **Emotional Impact**:
   - Makes people think "Wow, that's true"
   - Creates "aha moment"
   - Builds trust through honesty
   - Feels like insider knowledge

Return as JSON:
{
  "hook": "The truth bomb opening",
  "body": "The full truth bomb explanation",
  "cta": "What to do with this truth",
  "caption": "Complete post",
  "impactScore": 85
}

Make it controversial, memorable, and impossible to ignore.
`.trim();
}
