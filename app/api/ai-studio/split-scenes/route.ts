import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { generateJSON } from '@/lib/ai/openai';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { script } = await request.json();

    if (!script) {
      return NextResponse.json({ error: 'Script is required' }, { status: 400 });
    }

    const prompt = `You are a professional video director. Split the following script into logical scenes.

Script:
${script}

Return a JSON array of scenes with this format:
[
  {
    "scene": 1,
    "time": "0-3",
    "text": "Scene text here",
    "duration": 3
  }
]

Rules:
- Each scene should be 2-5 seconds
- Split at logical breaks (topic changes, pauses)
- Keep related sentences together
- Number scenes starting from 1
- Calculate duration based on text length

Return ONLY valid JSON, no markdown, no explanation.`;

    let scenes;
    try {
      scenes = await generateJSON(prompt, {
        temperature: 0.3,
      });
    } catch (e) {
      console.error('Failed to parse scenes:', e);
      return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 });
    }

    return NextResponse.json({ scenes });
  } catch (error: any) {
    console.error('Scene split error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to split scenes' },
      { status: 500 }
    );
  }
}
