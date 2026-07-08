/**
 * Director Engine - Filmmaking Rules + AI
 * Contains hardcoded filmmaking knowledge for consistent production-ready output
 */

export type Platform = 'facebook-ad' | 'tiktok' | 'youtube-shorts' | 'instagram-reels' | 'general';
export type CameraAngle = 'Close Up' | 'Medium Shot' | 'Wide Shot' | 'Extreme Close Up' | 'Over Shoulder' | 'POV';
export type CameraMovement = 'Static' | 'Push In' | 'Pull Out' | 'Pan Left' | 'Pan Right' | 'Tilt Up' | 'Tilt Down' | 'Orbit';
export type Transition = 'Cut' | 'Flash' | 'Zoom' | 'Whoosh' | 'Blur' | 'Mask' | 'Swipe' | 'Fade';
export type AnimationStyle = 'Text Pop' | 'Word by Word' | 'Bounce' | 'Glow' | 'Highlight' | 'Typewriter' | 'Fade In' | 'Slide';

export interface PlatformRules {
  maxDuration: number;
  hookDuration: number;
  productRevealStart: number;
  productRevealEnd: number;
  ctaDuration: number;
  cutSpeed: number;
  patternInterruptInterval: number;
  captionRequired: boolean;
  humanFaceRequired: boolean;
  humanFaceDeadline: number;
}

export interface SceneData {
  scene: number;
  time: string;
  text: string;
  duration: number;
}

export interface DirectorOutput {
  scene: number;
  visual: string;
  emotion: string;
  camera: CameraAngle;
  lens: string;
  movement: CameraMovement;
  animation: AnimationStyle;
  text: string;
  icon: string;
  transition: Transition;
  music: string;
  sfx: string;
  broll: string[];
  lighting: string;
  color: string;
  productReveal?: boolean;
  revealStyle?: string;
  // Enhanced features
  stockFootage?: {
    pexels: string[];
    storyblocks: string[];
    freepik: string[];
  };
  editingChecklist?: string[];
  editorAction?: string;
  styleReference?: 'MrBeast' | 'Apple' | 'Vox' | 'Gary Vee' | 'Corporate' | 'Minimal';
  premierePro?: {
    scale?: string;
    blur?: string;
    effects?: string[];
  };
  capcut?: {
    animations?: string[];
  };
  afterEffects?: {
    effects?: string[];
  };
}

/**
 * Platform-specific filmmaking rules
 */
export const PLATFORM_RULES: Record<Platform, PlatformRules> = {
  'facebook-ad': {
    maxDuration: 30,
    hookDuration: 3,
    productRevealStart: 6,
    productRevealEnd: 10,
    ctaDuration: 5,
    cutSpeed: 1.5,
    patternInterruptInterval: 5,
    captionRequired: true,
    humanFaceRequired: true,
    humanFaceDeadline: 2,
  },
  'tiktok': {
    maxDuration: 60,
    hookDuration: 2,
    productRevealStart: 8,
    productRevealEnd: 12,
    ctaDuration: 3,
    cutSpeed: 0.8,
    patternInterruptInterval: 3,
    captionRequired: true,
    humanFaceRequired: true,
    humanFaceDeadline: 2,
  },
  'youtube-shorts': {
    maxDuration: 60,
    hookDuration: 3,
    productRevealStart: 10,
    productRevealEnd: 15,
    ctaDuration: 5,
    cutSpeed: 1.2,
    patternInterruptInterval: 4,
    captionRequired: true,
    humanFaceRequired: false,
    humanFaceDeadline: 0,
  },
  'instagram-reels': {
    maxDuration: 90,
    hookDuration: 2,
    productRevealStart: 8,
    productRevealEnd: 15,
    ctaDuration: 5,
    cutSpeed: 1.0,
    patternInterruptInterval: 4,
    captionRequired: true,
    humanFaceRequired: true,
    humanFaceDeadline: 3,
  },
  'general': {
    maxDuration: 120,
    hookDuration: 5,
    productRevealStart: 15,
    productRevealEnd: 30,
    ctaDuration: 10,
    cutSpeed: 2.0,
    patternInterruptInterval: 6,
    captionRequired: false,
    humanFaceRequired: false,
    humanFaceDeadline: 0,
  },
};

/**
 * Camera rules based on emotion and content type
 */
export const CAMERA_RULES = {
  emotion: {
    excited: { angle: 'Close Up', movement: 'Push In', lens: '35mm' },
    calm: { angle: 'Medium Shot', movement: 'Static', lens: '50mm' },
    dramatic: { angle: 'Extreme Close Up', movement: 'Orbit', lens: '24mm' },
    professional: { angle: 'Medium Shot', movement: 'Pan Right', lens: '50mm' },
    energetic: { angle: 'Wide Shot', movement: 'Tilt Up', lens: '28mm' },
  },
  content: {
    product: { angle: 'Close Up', movement: 'Orbit', lens: '50mm' },
    person: { angle: 'Medium Shot', movement: 'Push In', lens: '50mm' },
    environment: { angle: 'Wide Shot', movement: 'Pan Left', lens: '24mm' },
    detail: { angle: 'Extreme Close Up', movement: 'Static', lens: '85mm' },
  },
};

/**
 * Transition rules based on context
 */
export const TRANSITION_RULES = {
  fast: ['Flash', 'Zoom', 'Whoosh'],
  smooth: ['Fade', 'Blur'],
  dramatic: ['Mask', 'Swipe'],
  default: ['Cut'],
};

/**
 * Detect if scene needs product reveal
 */
export function detectProductReveal(text: string, sceneIndex: number, totalScenes: number): boolean {
  const productKeywords = ['product', 'tool', 'app', 'software', 'solution', 'service', 'feature'];
  const revealKeywords = ['introducing', 'present', 'show', 'reveal', 'এই', 'এটি', 'product', 'app'];
  
  const hasProductKeyword = productKeywords.some(keyword => 
    text.toLowerCase().includes(keyword)
  );
  
  const hasRevealKeyword = revealKeywords.some(keyword => 
    text.toLowerCase().includes(keyword)
  );
  
  // Product reveal usually happens in the middle third
  const isMiddleThird = sceneIndex > totalScenes * 0.3 && sceneIndex < totalScenes * 0.7;
  
  return (hasProductKeyword && hasRevealKeyword) || (hasRevealKeyword && isMiddleThird);
}

/**
 * Get camera settings based on emotion and content
 */
export function getCameraSettings(emotion: string, contentType: string) {
  const emotionSettings = CAMERA_RULES.emotion[emotion as keyof typeof CAMERA_RULES.emotion] || CAMERA_RULES.emotion.professional;
  return emotionSettings;
}

/**
 * Get transition based on pace
 */
export function getTransition(pace: 'fast' | 'smooth' | 'dramatic' = 'smooth'): Transition {
  const transitions = TRANSITION_RULES[pace];
  return transitions[Math.floor(Math.random() * transitions.length)] as Transition;
}

/**
 * Apply platform optimization rules
 */
export function applyPlatformRules(
  scenes: DirectorOutput[],
  platform: Platform
): DirectorOutput[] {
  const rules = PLATFORM_RULES[platform];
  let currentTime = 0;

  return scenes.map((scene, index) => {
    const sceneStart = currentTime;
    const sceneDuration = parseFloat(scene.text.split(' ').length / 2 + ''); // rough estimate
    currentTime += sceneDuration;

    // Apply hook optimization
    if (sceneStart < rules.hookDuration) {
      scene.text = 'HOOK: ' + scene.text;
      scene.animation = 'Text Pop';
      scene.camera = 'Close Up';
    }

    // Apply product reveal timing
    if (sceneStart >= rules.productRevealStart && sceneStart <= rules.productRevealEnd) {
      if (!scene.productReveal && detectProductReveal(scene.text, index, scenes.length)) {
        scene.productReveal = true;
        scene.revealStyle = 'Hero Reveal';
        scene.movement = 'Orbit';
        scene.transition = 'Flash';
      }
    }

    // Apply CTA optimization (last scenes)
    if (index >= scenes.length - 2) {
      scene.text = 'CTA: ' + scene.text;
      scene.animation = 'Bounce';
      scene.sfx = 'Bell';
    }

    // Pattern interrupt for TikTok/Shorts
    if (platform === 'tiktok' || platform === 'youtube-shorts') {
      if (Math.floor(sceneStart) % rules.patternInterruptInterval === 0) {
        scene.transition = getTransition('dramatic');
        scene.animation = 'Bounce';
      }
    }

    // Caption requirement
    if (rules.captionRequired) {
      scene.text = scene.text.toUpperCase();
    }

    return scene;
  });
}

/**
 * Generate motion graphics suggestions
 */
export function generateMotionPlan(scene: DirectorOutput) {
  return {
    text: {
      animation: scene.animation,
      duration: 0.5,
      easing: 'ease-out',
      effects: ['Bounce', 'Glow', 'Highlight'],
    },
    camera: {
      movement: scene.movement,
      duration: 2.0,
      easing: 'ease-in-out',
    },
    transition: {
      type: scene.transition,
      duration: 0.3,
    },
  };
}

/**
 * Generate storyboard image prompt
 */
export function generateStoryboardPrompt(scene: DirectorOutput): string {
  return `${scene.visual}, ${scene.camera.toLowerCase()}, ${scene.lens} lens, ${scene.lighting} lighting, ${scene.color} color grading, cinematic, professional, high quality`;
}

/**
 * Export timeline JSON for video editors
 */
export function exportTimeline(scenes: DirectorOutput[]) {
  let currentTime = 0;
  
  return scenes.map((scene, index) => {
    const duration = 3; // default 3 seconds per scene
    const startTime = currentTime;
    currentTime += duration;

    return {
      scene: scene.scene,
      startTime,
      endTime: currentTime,
      duration,
      visual: scene.visual,
      camera: scene.camera,
      movement: scene.movement,
      text: scene.text,
      animation: scene.animation,
      transition: scene.transition,
      music: scene.music,
      sfx: scene.sfx,
      broll: scene.broll,
    };
  });
}

/**
 * Generate stock footage search keywords
 */
export function generateStockFootageKeywords(scene: DirectorOutput) {
  const visual = scene.visual.toLowerCase();
  const keywords: string[] = [];

  // Extract key nouns and actions
  const commonWords = ['a', 'an', 'the', 'with', 'in', 'on', 'at', 'to', 'for'];
  const words = visual.split(' ').filter(w => !commonWords.includes(w));

  // Pexels keywords (specific, concrete)
  const pexelsKeywords = [
    ...words.slice(0, 3),
    scene.camera.toLowerCase().replace(' ', '-'),
    scene.lighting.toLowerCase(),
  ].filter(Boolean);

  // Storyblocks keywords (broader, conceptual)
  const storyblocksKeywords = [
    scene.emotion,
    words[0],
    scene.color.toLowerCase().replace(' ', '-'),
  ].filter(Boolean);

  // Freepik keywords (illustrations and graphics)
  const freepikKeywords = [
    words[0] + ' illustration',
    scene.emotion + ' vector',
    'modern ' + words[0],
  ].filter(Boolean);

  return {
    pexels: pexelsKeywords,
    storyblocks: storyblocksKeywords,
    freepik: freepikKeywords,
  };
}

/**
 * Generate editing checklist for each scene
 */
export function generateEditingChecklist(scene: DirectorOutput): string[] {
  const checklist: string[] = [];

  // Always include basics
  checklist.push('✓ Import footage');
  checklist.push('✓ Apply color grading');

  // Text overlay
  if (scene.text) {
    checklist.push(`✓ Add text overlay: "${scene.text}"`);
    checklist.push(`✓ Apply ${scene.animation} animation`);
  }

  // Camera movement
  if (scene.movement !== 'Static') {
    checklist.push(`✓ Add ${scene.movement} camera motion`);
  }

  // B-roll
  if (scene.broll && scene.broll.length > 0) {
    checklist.push(`✓ Insert B-roll: ${scene.broll.join(', ')}`);
  }

  // Icon
  if (scene.icon) {
    checklist.push(`✓ Add icon: ${scene.icon}`);
  }

  // Audio
  checklist.push(`✓ Add music: ${scene.music}`);
  checklist.push(`✓ Add SFX: ${scene.sfx}`);

  // Transition
  if (scene.transition !== 'Cut') {
    checklist.push(`✓ Apply ${scene.transition} transition`);
  }

  // Special cases
  if (scene.productReveal) {
    checklist.push('✓ Product reveal animation');
    checklist.push('✓ Add glow effect');
  }

  checklist.push('✓ Adjust timing');
  checklist.push('✓ Export preview');

  return checklist;
}

/**
 * Determine editing style reference
 */
export function getStyleReference(scene: DirectorOutput, platform: Platform): DirectorOutput['styleReference'] {
  // High energy, fast cuts
  if (scene.emotion === 'energetic' || scene.emotion === 'excited') {
    return platform === 'tiktok' ? 'MrBeast' : 'Gary Vee';
  }

  // Calm, professional
  if (scene.emotion === 'professional' || scene.emotion === 'calm') {
    return 'Apple';
  }

  // Dramatic, cinematic
  if (scene.emotion === 'dramatic') {
    return 'Vox';
  }

  // Default
  return platform === 'facebook-ad' || platform === 'instagram-reels' ? 'Corporate' : 'Minimal';
}

/**
 * Generate Premiere Pro settings
 */
export function generatePremiereProSettings(scene: DirectorOutput) {
  const settings: any = {
    effects: [],
  };

  // Scale based on camera movement
  if (scene.movement === 'Push In') {
    settings.scale = '100% → 115%';
    settings.effects.push('Transform');
  } else if (scene.movement === 'Pull Out') {
    settings.scale = '115% → 100%';
    settings.effects.push('Transform');
  }

  // Blur for transitions
  if (scene.transition === 'Blur') {
    settings.blur = 'Gaussian Blur 0 → 20 → 0';
    settings.effects.push('Gaussian Blur');
  }

  // Common effects
  if (scene.animation === 'Glow') {
    settings.effects.push('Glow');
  }

  settings.effects.push('Lumetri Color');

  return settings;
}

/**
 * Generate CapCut animations
 */
export function generateCapCutAnimations(scene: DirectorOutput) {
  const animations: string[] = [];

  switch (scene.animation) {
    case 'Text Pop':
      animations.push('Pop', 'Scale');
      break;
    case 'Bounce':
      animations.push('Bounce', 'Elastic');
      break;
    case 'Glow':
      animations.push('Glow', 'Blur');
      break;
    case 'Slide':
      animations.push('Slide In', 'Fade');
      break;
    default:
      animations.push('Fade In');
  }

  if (scene.transition === 'Zoom') {
    animations.push('Zoom');
  }

  if (scene.transition === 'Flash') {
    animations.push('Flash');
  }

  return animations;
}

/**
 * Generate After Effects settings
 */
export function generateAfterEffectsSettings(scene: DirectorOutput) {
  const effects: string[] = [];

  effects.push('Easy Ease');

  if (scene.movement !== 'Static') {
    effects.push('Motion Blur');
  }

  if (scene.animation === 'Glow' || scene.animation === 'Highlight') {
    effects.push('Glow');
  }

  if (scene.transition === 'Blur') {
    effects.push('Fast Box Blur');
  }

  effects.push('Color Correction');

  return effects;
}

/**
 * Generate complete editor blueprint with all enhancements
 */
export function generateEditorBlueprint(scenes: DirectorOutput[], platform: Platform) {
  return scenes.map((scene, index) => {
    const enhanced = { ...scene };

    // Add stock footage keywords
    enhanced.stockFootage = generateStockFootageKeywords(scene);

    // Add editing checklist
    enhanced.editingChecklist = generateEditingChecklist(scene);

    // Add style reference
    enhanced.styleReference = getStyleReference(scene, platform);

    // Add editor-specific settings
    enhanced.premierePro = generatePremiereProSettings(scene);
    enhanced.capcut = { animations: generateCapCutAnimations(scene) };
    enhanced.afterEffects = { effects: generateAfterEffectsSettings(scene) };

    // Add editor action description
    enhanced.editorAction = generateEditorAction(scene, index, scenes.length);

    return enhanced;
  });
}

/**
 * Generate editor action description
 */
function generateEditorAction(scene: DirectorOutput, index: number, total: number): string {
  const actions: string[] = [];

  // Timing
  const startTime = index * 3;
  actions.push(`Start at ${startTime}s`);

  // Camera
  if (scene.movement !== 'Static') {
    actions.push(`${scene.movement} camera`);
  }

  // Text
  if (scene.text) {
    actions.push(`Add "${scene.text}" with ${scene.animation}`);
  }

  // Effects
  if (scene.transition !== 'Cut') {
    actions.push(`${scene.transition} transition`);
  }

  // Special
  if (scene.productReveal) {
    actions.push('Hero reveal animation');
  }

  // Audio
  actions.push(`${scene.music} music + ${scene.sfx} SFX`);

  return actions.join(' → ');
}

/**
 * Generate mood board data
 */
export function generateMoodBoard(scenes: DirectorOutput[]) {
  // Analyze all scenes to create mood board
  const colors = [...new Set(scenes.map(s => s.color))];
  const emotions = [...new Set(scenes.map(s => s.emotion))];
  const lighting = [...new Set(scenes.map(s => s.lighting))];

  // Determine overall style
  const styles = scenes.map(s => s.styleReference).filter(Boolean);
  const dominantStyle = styles.length > 0 ? styles[0] : 'Corporate';

  return {
    colors,
    emotions,
    lighting,
    style: dominantStyle,
    tone: emotions.includes('excited') || emotions.includes('energetic') ? 'High Energy' : 'Professional',
    aesthetic: lighting.includes('Cinematic') ? 'Cinematic' : 'Modern',
  };
}
