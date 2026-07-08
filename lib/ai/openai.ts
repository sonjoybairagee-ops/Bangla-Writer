import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateCompletion(
  prompt: string,
  options: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
  } = {}
): Promise<string> {
  const {
    model = 'gpt-4o-mini',
    temperature = 0.7,
    maxTokens = 2000,
  } = options;

  try {
    const response = await openai.chat.completions.create({
      model,
      messages: [{ role: 'user', content: prompt }],
      temperature,
      max_tokens: maxTokens,
    });

    return response.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('OpenAI error:', error);
    throw new Error('Failed to generate AI content');
  }
}

export async function generateJSON<T = any>(
  prompt: string,
  options: {
    model?: string;
    temperature?: number;
  } = {}
): Promise<T> {
  const {
    model = 'gpt-4o-mini',
    temperature = 0.7,
  } = options;

  try {
    const response = await openai.chat.completions.create({
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
  } catch (error) {
    console.error('OpenAI JSON error:', error);
    throw new Error('Failed to generate AI content');
  }
}

export async function generateStreamCompletion(
  prompt: string,
  options: {
    model?: string;
    temperature?: number;
  } = {}
) {
  const {
    model = 'gpt-4o-mini',
    temperature = 0.7,
  } = options;

  try {
    const stream = await openai.chat.completions.create({
      model,
      messages: [{ role: 'user', content: prompt }],
      temperature,
      stream: true,
    });

    return stream;
  } catch (error) {
    console.error('OpenAI stream error:', error);
    throw new Error('Failed to generate AI content');
  }
}

export { openai };
