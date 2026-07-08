interface OVCDirectorParams {
  brand?: string;
  product: string;
  scriptBrief: string;
  targetAudience: string;
  duration: number;
  videoType: string;
  storyStyle: string;
  budget: string;
  goal: string;
  offer?: string;
  visualStyle?: string;
  mood?: string;
  platform?: string;
}

export function createOVCDirectorPrompt(params: OVCDirectorParams): string {
  const targetScenes = Math.ceil(params.duration / 10); // Rough estimate: 10s per scene

  return `
You are a professional video director creating a complete production breakdown for a ${params.videoType} video.

# PROJECT BRIEF
Brand: ${params.brand || 'Client Brand'}
Product/Service: ${params.product}
Video Type: ${params.videoType}
Target Length: ${params.duration} seconds
Target Audience: ${params.targetAudience}
Primary Goal: ${params.goal}
${params.offer ? `Special Offer: ${params.offer}` : ''}

# CREATIVE DIRECTION
Story Style: ${params.storyStyle}
Mood: ${params.mood || 'energetic'}
Budget Level: ${params.budget}
Platform: ${params.platform || 'multi-platform'}

# SCRIPT CONCEPT
${params.scriptBrief}

# YOUR TASK
Create a COMPLETE video production breakdown including:

1. **Concept & Logline**: Compelling one-liner that captures the video
2. **Scene Breakdown**: ${targetScenes}-${targetScenes + 2} scenes with FULL details
3. **Shot List**: Complete coverage plan with priorities
4. **Production Requirements**: Equipment, crew, locations, budget estimate
5. **Visual Direction**: Color palette, mood board references, style notes
6. **Post-Production Guide**: Editing notes, music, pacing

---

## OUTPUT FORMAT (JSON)

Return ONLY valid JSON with this exact structure:

\`\`\`json
{
  "title": "Engaging Title for the Video",
  "concept": "Brief overview of the video concept (2-3 sentences)",
  "logline": "One compelling sentence that captures the essence",
  "targetLength": ${params.duration},
  
  "scenes": [
    {
      "sceneNumber": 1,
      "duration": 8,
      "location": "Modern coffee shop interior",
      "timeOfDay": "Morning / Golden hour",
      
      "actor": "Female protagonist, 28, professional",
      "emotion": "Frustrated but hopeful",
      "dialogue": "Exact words the actor says",
      "action": "Detailed physical actions and movements",
      
      "camera": {
        "shotType": "Medium close-up / Wide shot / ECU / Two-shot",
        "angle": "Eye level / High angle / Low angle / Dutch angle",
        "movement": "Static / Pan left / Dolly in / Handheld / Gimbal follow",
        "lens": "35mm / 50mm / 85mm / 24-70mm zoom",
        "framing": "Rule of thirds / Centered / Headroom tight"
      },
      
      "lighting": {
        "setup": "3-point / Natural window / Dramatic single source",
        "mood": "Soft and warm / Harsh and clinical / Moody",
        "keyLight": "Softbox camera right, 45° angle",
        "fillLight": "Reflector bounce, camera left",
        "backLight": "Rim light to separate from background"
      },
      
      "audio": {
        "dialogue": "Clean lav mic + boom for room tone",
        "music": "Upbeat electronic / Emotional piano / Energetic drums",
        "soundEffects": ["Coffee machine", "Keyboard typing", "Phone notification"],
        "ambience": "Busy cafe chatter, low volume"
      },
      
      "visuals": {
        "screenText": ["Problem Statement", "50% OFF"],
        "bRoll": ["Product close-up", "Hands using product", "Result shots"],
        "props": ["Laptop", "Coffee cup", "Product packaging"],
        "wardrobe": "Business casual, blue tones",
        "colorGrade": "Warm and inviting / Cool and modern / Cinematic teal-orange"
      },
      
      "transition": "Quick cut / Cross dissolve / Match cut / Wipe",
      "notes": "Focus on authentic emotion. Allow natural pauses."
    }
  ],
  
  "shotList": [
    {
      "sceneNumber": 1,
      "shotNumber": "1A",
      "shotType": "Wide establishing",
      "description": "Show full environment to establish context",
      "priority": "high"
    },
    {
      "sceneNumber": 1,
      "shotNumber": "1B", 
      "shotType": "Medium close-up",
      "description": "Main action, emotional reaction",
      "priority": "high"
    },
    {
      "sceneNumber": 1,
      "shotNumber": "1C",
      "shotType": "Insert / Detail",
      "description": "Product or detail shot",
      "priority": "medium"
    },
    {
      "sceneNumber": 2,
      "shotNumber": "2A",
      "shotType": "OTS (Over-the-shoulder)",
      "description": "Interaction between subjects",
      "priority": "medium"
    }
  ],
  
  "production": {
    "equipmentNeeded": [
      "Camera body + lenses",
      "Gimbal stabilizer",
      "Lighting kit (3-point)",
      "Wireless lav mics",
      "Boom mic + recorder",
      "Reflectors"
    ],
    "crewRequired": [
      "Director",
      "DP / Camera operator", 
      "Gaffer / Lighting",
      "Sound recordist",
      "1-2 PAs"
    ],
    "locations": [
      "Coffee shop (interior)",
      "Office space",
      "Outdoor park"
    ],
    "estimatedBudget": "$2,000-$5,000 for ${params.budget} budget production",
    "shootDays": 1
  },
  
  "visualDirection": {
    "moodBoard": [
      "Apple commercial aesthetic",
      "Warm morning light references",
      "Modern lifestyle photography"
    ],
    "colorPalette": [
      "#FF6B6B",
      "#4ECDC4", 
      "#FFE66D",
      "#1A535C"
    ],
    "references": [
      "Nike lifestyle ads",
      "Airbnb brand videos",
      "Casey Neistat vlog style"
    ],
    "styleNotes": "Clean, modern, aspirational but authentic. Avoid overly polished corporate feel."
  },
  
  "postProduction": {
    "editingNotes": "Fast-paced cuts for first 10s to hook attention, then slower emotional beats. Keep total under ${params.duration}s.",
    "musicSuggestions": [
      "Upbeat indie electronic",
      "Inspiring piano progression", 
      "Energetic drums with bass"
    ],
    "transitionStyle": "Mostly cuts, occasional quick dissolves for time passage",
    "pacing": "Fast for ${params.videoType} - average shot length 2-4 seconds"
  }
}
\`\`\`

---

## CRITICAL REQUIREMENTS

### Scene Details Must Include:
- ✅ Specific actor description (age, appearance, emotion)
- ✅ Exact dialogue word-for-word
- ✅ Detailed physical actions
- ✅ Complete camera specs (type, angle, movement, lens, framing)
- ✅ Full 3-point lighting setup with positions
- ✅ Audio layers (dialogue, music, SFX, ambience)
- ✅ All visual elements (text, b-roll, props, wardrobe, grade)
- ✅ Transition type and any special notes

### Shot List Requirements:
- ✅ Cover EVERY scene with 2-4 shots minimum
- ✅ Include establishing, main action, inserts, reactions
- ✅ Mark priority: high (must-have), medium (important), low (nice-to-have)
- ✅ Brief description of what each shot captures

### Production Breakdown:
- ✅ Realistic equipment list for ${params.budget} budget
- ✅ Minimum viable crew (don't over-staff)
- ✅ All unique locations needed
- ✅ Budget range appropriate for ${params.budget}
- ✅ Realistic shoot days (1-3 days max for most projects)

### Visual Direction:
- ✅ Specific style references (brands, directors, films)
- ✅ 3-5 hex colors for palette
- ✅ Mood board keywords
- ✅ Clear style notes

### Post-Production:
- ✅ Editing approach and pacing guidance
- ✅ 3-5 music style suggestions
- ✅ Transition philosophy
- ✅ Overall pacing strategy

---

## STYLE GUIDELINES

### For "${params.storyStyle}" style:
${getStyleGuidelines(params.storyStyle)}

### For "${params.videoType}" format:
${getVideoTypeGuidelines(params.videoType)}

### For "${params.budget}" budget:
${getBudgetGuidelines(params.budget)}

---

## IMPORTANT NOTES

1. **Be Specific**: Don't say "good lighting" - say "soft key from camera right with reflector fill"
2. **Be Practical**: Equipment and crew should match the ${params.budget} budget reality
3. **Be Complete**: Every scene needs ALL fields filled with detailed information
4. **Be Professional**: This will be used by actual production teams
5. **Be Creative**: Make it engaging and appropriate for ${params.targetAudience}

Return ONLY the JSON object. No markdown, no explanations, just valid JSON.
`.trim();
}

function getStyleGuidelines(style: string): string {
  const guidelines: Record<string, string> = {
    cinematic: `
- Use film-quality camera movements (dolly, crane, slider)
- Dramatic lighting with strong shadows
- Wider lenses (24-35mm) for establishing shots
- Slower pacing with intentional pauses
- High production value elements`,
    
    documentary: `
- Handheld or shoulder-mounted camera feel
- Natural available lighting whenever possible
- Real locations, authentic settings
- Interview-style dialogue or voiceover
- Observational approach`,
    
    lifestyle: `
- Bright, airy lighting
- Aspirational but relatable settings
- Dynamic camera movements (gimbal, handheld)
- Warm, inviting color palette
- Focus on real moments and emotions`,
    
    luxury: `
- Slow, deliberate camera movements
- Perfect, controlled lighting
- Close-up detail shots of texture and quality
- Muted, sophisticated color palette
- Minimalist, elegant compositions`,
    
    ugc: `
- Phone or webcam aesthetic
- Natural indoor lighting
- Direct-to-camera address
- Authentic, unpolished feel
- Vertical format considerations`,
    
    comedy: `
- Timing is everything - mark beat pauses
- Physical comedy needs wider framing
- Reaction shots are crucial
- Lighter, brighter overall feel
- Consider comedic sound effects`,
    
    emotional: `
- Close-ups to capture subtle expressions
- Soft, warm lighting
- Slower pacing for emotional beats
- Music is critical for emotional arc
- Allow silence and pauses`,
    
    minimal: `
- Clean, simple compositions
- Minimal props and set dressing
- Soft, even lighting
- Lots of negative space
- Subtle camera movements`,
    
    trendy: `
- Fast-paced editing (2-3 second shots)
- Current TikTok/Reels trends
- Bold graphics and text overlays
- Trending music essential
- Dynamic, energetic feel`,
  };
  
  return guidelines[style] || 'Be authentic and engaging for the target audience.';
}

function getVideoTypeGuidelines(videoType: string): string {
  const guidelines: Record<string, string> = {
    ad: `
- Hook in first 3 seconds (problem or curiosity)
- Show problem → solution → transformation
- Multiple clear CTAs
- Product shots with good lighting
- End card with offer/CTA`,
    
    reel: `
- Vertical format (9:16)
- Hook within 1 second
- Fast cuts every 2-3 seconds
- Trending audio crucial
- Text overlays for accessibility`,
    
    youtube: `
- Horizontal format (16:9)
- Strong intro hook (first 15s)
- Chapter breaks for longer videos
- B-roll for visual variety
- End screen with CTA`,
    
    tiktok: `
- Vertical format (9:16)
- Native, authentic feel
- Participate in trends
- Duet/stitch potential
- Text hooks at start`,
    
    vsl: `
- Longer format (5-20 min)
- Strong story arc
- Problem agitation
- Multiple proof points
- Clear offer structure`,
    
    explainer: `
- Clear, simple language
- Visual aids and graphics
- Step-by-step structure
- Screen recordings if needed
- Recap at end`,
    
    testimonial: `
- Authentic customer story
- Before and after
- Specific results/numbers
- Emotional journey
- Product context`,
    
    product: `
- Hero product shots
- Feature demonstrations
- Use case scenarios
- Size/scale references
- Packaging and unboxing`,
  };
  
  return guidelines[videoType] || 'Follow best practices for the chosen video format.';
}

function getBudgetGuidelines(budget: string): string {
  const guidelines: Record<string, string> = {
    low: `
- Use natural light creatively
- Minimal crew (1-2 people)
- Consumer camera equipment
- Simple, available locations
- DIY approach with high creativity`,
    
    medium: `
- Small lighting kit (3-point)
- Semi-pro camera and lenses
- Small crew (3-5 people)
- Simple location rentals
- Basic grip equipment`,
    
    high: `
- Professional cinema cameras
- Full lighting package
- Experienced crew (5-10+)
- Premium locations
- Specialized equipment (crane, drone, etc)`,
  };
  
  return guidelines[budget] || 'Balance quality with budget constraints.';
}

export function createShotListPrompt(scenes: any[]): string {
  return `
Based on these scenes, create a complete shot list for production:

${scenes.map((scene, i) => `
Scene ${scene.sceneNumber}:
Location: ${scene.location}
Action: ${scene.action}
`).join('\n')}

For EACH scene, provide:
1. Establishing shot (scene context)
2. Main action shot(s) (2-3 angles)
3. Detail/insert shots (1-2)
4. Reaction shots if applicable
5. Coverage shots for editing flexibility

Mark each shot priority: high, medium, or low.

Return JSON array:
[
  {
    "sceneNumber": 1,
    "shotNumber": "1A",
    "shotType": "Wide establishing",
    "description": "Full room showing environment",
    "priority": "high"
  }
]
`.trim();
}
