import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { generateText } from '@/lib/ai/openai';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { scene, sceneText, sceneNumber, totalScenes } = await request.json();

    if (!sceneText) {
      return NextResponse.json({ error: 'Scene text is required' }, { status: 400 });
    }

    const prompt = `You are a professional video director. Analyze this scene and provide complete creative direction.

Scene ${sceneNumber} of ${totalScenes}:
"${sceneText}"

Return a JSON object with this EXACT format:
{
  "scene": ${sceneNumber},
  "visual": "What should be shown (be specific, detailed description)",
  "emotion": "excited/calm/dramatic/professional/energetic",
  "camera": "Close Up/Medium Shot/Wide Shot/Extreme Close Up/Over Shoulder/POV",
  "lens": "24mm/35mm/50mm/85mm",
  "movement": "Static/Push In/Pull Out/Pan Left/Pan Right/Tilt Up/Tilt Down/Orbit",
  "animation": "Text Pop/Word by Word/Bounce/Glow/Highlight/Typewriter/Fade In/Slide",
  "text": "Text overlay to display (short, impactful)",
  "icon": "Single emoji that fits the scene",
  "transition": "Cut/Flash/Zoom/Whoosh/Blur/Mask/Swipe/Fade",
  "music": "Epic/Upbeat/Calm/Dramatic/Energetic/Inspiring",
  "sfx": "Boom/Whoosh/Click/Bell/Pop/Swoosh",
  "broll": ["specific action 1", "specific action 2"],
  "lighting": "Natural/Studio/Dramatic/Soft/Hard/Cinematic",
  "color": "Warm/Cool/Orange Teal/Moody/Bright/Neutral"
}

IMPORTANT:
- Be VERY specific in "visual" field (exact objects, actions, environment)
- "broll" should contain concrete, searchable actions (e.g., "typing on laptop", "clicking mouse")
- "text" should be short, punchy overlay text
- Think like a professional filmmaker planning a shoot

Return ONLY valid JSON, no markdown, no explanation.`;

    const response = await generateAIResponse(prompt, {
      temperature: 0.7,
      maxTokens: 1000,
    });

    // Parse JSON from response
    let direction;
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        direction = JSON.parse(jsonMatch[0]);
      } else {
        direction = JSON.parse(response);
      }
    } catch (e) {
      console.error('Failed to parse direction:', e);
      return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 });
    }

    return NextResponse.json({ direction });
  } catch (error: any) {
    console.error('Scene direction error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate direction' },
      { status: 500 }
    );
  }
}
