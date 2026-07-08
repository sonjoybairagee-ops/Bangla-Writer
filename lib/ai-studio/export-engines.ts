/**
 * Production Export Engine V4
 * Multi-format export system for professional video editors
 */

import { DirectorOutput } from './director-engine';

export type EditorType = 'premiere-pro' | 'capcut' | 'after-effects' | 'davinci-resolve' | 'final-cut-pro' | 'canva';

/**
 * Generate Premiere Pro XML Timeline
 */
export function generatePremiereProXML(scenes: DirectorOutput[], projectName: string = 'AI Studio Project') {
  const framerate = 30;
  const duration = scenes.length * 3 * framerate; // 3 seconds per scene

  let timelineItems = '';
  let currentFrame = 0;

  scenes.forEach((scene, index) => {
    const sceneDuration = 3 * framerate; // 3 seconds = 90 frames
    const sceneEnd = currentFrame + sceneDuration;

    // Video track item
    timelineItems += `
    <clipitem id="clipitem-${index + 1}">
      <name>Scene ${scene.scene} - ${scene.visual.substring(0, 30)}</name>
      <start>${currentFrame}</start>
      <end>${sceneEnd}</end>
      <in>0</in>
      <out>${sceneDuration}</out>
      <file id="file-${index + 1}">
        <name>Scene_${scene.scene}_Placeholder.mp4</name>
        <pathurl>file://localhost/Scene_${scene.scene}_Placeholder.mp4</pathurl>
        <rate>
          <timebase>${framerate}</timebase>
        </rate>
        <duration>${sceneDuration}</duration>
        <width>1920</width>
        <height>1080</height>
      </file>
      <sourcetrack>
        <mediatype>video</mediatype>
        <trackindex>1</trackindex>
      </sourcetrack>
      <labels>
        <label2>Forest</label2>
      </labels>
    </clipitem>`;

    // Add marker for important moments
    if (scene.productReveal) {
      timelineItems += `
    <marker>
      <name>PRODUCT REVEAL</name>
      <comment>${scene.revealStyle || 'Hero Reveal'}</comment>
      <in>${currentFrame}</in>
      <out>${currentFrame + 30}</out>
    </marker>`;
    }

    currentFrame = sceneEnd;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE xmeml>
<xmeml version="4">
  <project>
    <name>${projectName}</name>
    <children>
      <sequence id="sequence-1">
        <name>AI Studio Timeline</name>
        <rate>
          <timebase>${framerate}</timebase>
        </rate>
        <duration>${duration}</duration>
        <media>
          <video>
            <format>
              <samplecharacteristics>
                <width>1920</width>
                <height>1080</height>
                <pixelaspectratio>Square</pixelaspectratio>
                <rate>
                  <timebase>${framerate}</timebase>
                </rate>
              </samplecharacteristics>
            </format>
            <track>
              ${timelineItems}
            </track>
          </video>
          <audio>
            <format>
              <samplecharacteristics>
                <depth>16</depth>
                <samplerate>48000</samplerate>
              </samplecharacteristics>
            </format>
          </audio>
        </media>
      </sequence>
    </children>
  </project>
</xmeml>`;

  return xml;
}

/**
 * Generate CapCut Timeline JSON
 */
export function generateCapCutTimeline(scenes: DirectorOutput[]) {
  const tracks = scenes.map((scene, index) => {
    const startTime = index * 3000; // milliseconds
    const duration = 3000;

    return {
      id: `clip-${index}`,
      type: 'video',
      name: `Scene ${scene.scene}`,
      start: startTime,
      duration: duration,
      effects: {
        caption: {
          text: scene.text,
          style: scene.animation,
          position: 'center',
          fontSize: 48,
          color: '#FFFFFF',
          stroke: '#000000',
          strokeWidth: 2,
        },
        transition: {
          type: scene.transition.toLowerCase().replace(' ', '_'),
          duration: 300,
        },
        animation: {
          type: scene.animation.toLowerCase().replace(' ', '_'),
          duration: 500,
        },
        audio: {
          music: scene.music,
          sfx: scene.sfx,
        },
      },
      metadata: {
        visual: scene.visual,
        camera: scene.camera,
        movement: scene.movement,
        icon: scene.icon,
      },
    };
  });

  return {
    version: '1.0',
    projectName: 'AI Studio CapCut Project',
    resolution: {
      width: 1080,
      height: 1920, // Vertical for TikTok/Reels
    },
    fps: 30,
    tracks,
    totalDuration: scenes.length * 3000,
  };
}

/**
 * Generate After Effects Composition Guide
 */
export function generateAfterEffectsGuide(scenes: DirectorOutput[]) {
  const compositions = scenes.map((scene, index) => ({
    name: `Scene_${scene.scene}_Comp`,
    duration: 3,
    layers: [
      {
        name: 'Background',
        type: 'solid',
        color: scene.color,
      },
      {
        name: 'Main_Video',
        type: 'footage',
        placeholder: `Scene_${scene.scene}_Video.mp4`,
        effects: [
          { name: 'Scale', keyframes: scene.movement === 'Push In' ? [[0, 100], [3, 115]] : null },
          { name: 'Opacity', keyframes: [[0, 0], [0.3, 100]] },
        ],
      },
      {
        name: 'Text_Overlay',
        type: 'text',
        content: scene.text,
        effects: [
          { name: 'Animator: Scale', preset: 'Bounce' },
          { name: 'Glow', amount: 20 },
        ],
      },
      {
        name: 'Icon',
        type: 'shape',
        content: scene.icon,
        effects: [
          { name: 'Animator: Position', preset: 'Fade In' },
        ],
      },
    ],
    effects: [
      { name: 'Lumetri Color', preset: scene.color },
      { name: 'Motion Blur', enabled: scene.movement !== 'Static' },
    ],
    markers: [
      { time: 0, comment: `Start: ${scene.visual}` },
      { time: 2.5, comment: `Transition: ${scene.transition}` },
    ],
  }));

  return {
    projectName: 'AI_Studio_AE_Project',
    compositions,
    globalSettings: {
      resolution: [1920, 1080],
      fps: 30,
      duration: scenes.length * 3,
    },
  };
}

/**
 * Generate Asset List
 */
export function generateAssetList(scenes: DirectorOutput[]) {
  const assets = new Set<string>();
  const brollAssets = new Set<string>();
  const iconAssets = new Set<string>();
  const musicAssets = new Set<string>();
  const sfxAssets = new Set<string>();

  scenes.forEach((scene) => {
    // Extract main visuals
    const visualWords = scene.visual.toLowerCase().split(' ');
    visualWords.forEach((word) => {
      if (word.length > 4 && !['with', 'from', 'that', 'this'].includes(word)) {
        assets.add(word);
      }
    });

    // B-roll
    scene.broll?.forEach((item) => brollAssets.add(item));

    // Icons
    if (scene.icon) iconAssets.add(`${scene.icon} icon`);

    // Music
    musicAssets.add(`${scene.music} music track`);

    // SFX
    sfxAssets.add(`${scene.sfx} sound effect`);
  });

  return {
    mainAssets: Array.from(assets).slice(0, 10),
    broll: Array.from(brollAssets),
    icons: Array.from(iconAssets),
    music: Array.from(musicAssets),
    sfx: Array.from(sfxAssets),
    totalAssets: assets.size + brollAssets.size + iconAssets.size,
  };
}

/**
 * Generate Search Keywords for Stock Footage
 */
export function generateSearchKeywords(scenes: DirectorOutput[]) {
  return scenes.map((scene) => ({
    scene: scene.scene,
    pexels: [
      scene.visual.split(' ').slice(0, 3).join(' '),
      scene.camera.toLowerCase(),
      scene.lighting.toLowerCase(),
    ].filter(Boolean),
    envato: [
      scene.emotion,
      scene.visual.split(' ')[0],
      'corporate',
    ].filter(Boolean),
    storyblocks: [
      scene.visual.split(' ').slice(0, 2).join(' '),
      scene.color.toLowerCase(),
    ].filter(Boolean),
  }));
}

/**
 * Generate Editing Checklist PDF Content
 */
export function generateEditingChecklistPDF(scenes: DirectorOutput[]) {
  let content = `# AI Studio Editing Checklist\n\n`;
  content += `Project: ${new Date().toLocaleDateString()}\n`;
  content += `Total Scenes: ${scenes.length}\n\n`;

  scenes.forEach((scene, index) => {
    content += `## Scene ${scene.scene} (${index * 3}s - ${(index + 1) * 3}s)\n\n`;
    content += `**Visual:** ${scene.visual}\n\n`;
    content += `### Tasks:\n`;
    content += `☐ Import footage\n`;
    content += `☐ Apply ${scene.camera} camera angle\n`;
    content += `☐ Add ${scene.movement} camera movement\n`;
    content += `☐ Insert text: "${scene.text}"\n`;
    content += `☐ Apply ${scene.animation} animation\n`;
    content += `☐ Add icon: ${scene.icon}\n`;
    if (scene.broll && scene.broll.length > 0) {
      content += `☐ Insert B-roll: ${scene.broll.join(', ')}\n`;
    }
    content += `☐ Add music: ${scene.music}\n`;
    content += `☐ Add SFX: ${scene.sfx}\n`;
    content += `☐ Apply ${scene.transition} transition\n`;
    content += `☐ Color grade: ${scene.color}\n`;
    content += `☐ Adjust timing\n`;
    content += `☐ Export preview\n\n`;
    content += `---\n\n`;
  });

  return content;
}

/**
 * Generate Motion Presets
 */
export function generateMotionPresets(scenes: DirectorOutput[]) {
  return scenes.map((scene) => ({
    scene: scene.scene,
    text: {
      animation: scene.animation,
      duration: 300,
      easing: 'overshoot',
      effects: ['glow', 'scale'],
    },
    camera: {
      movement: scene.movement,
      duration: 2000,
      easing: 'ease-in-out',
    },
    transition: {
      type: scene.transition,
      duration: 300,
    },
  }));
}

/**
 * Generate Sound Pack List
 */
export function generateSoundPack(scenes: DirectorOutput[]) {
  return scenes.map((scene) => ({
    scene: scene.scene,
    timestamp: `${(scene.scene - 1) * 3}s`,
    sfx: scene.sfx,
    music: scene.music,
    searchKeywords: [
      `${scene.sfx.toLowerCase()} sound effect`,
      `${scene.music.toLowerCase()} background music`,
    ],
  }));
}

/**
 * Generate AI Timeline Breakdown
 */
export function generateAITimeline(scenes: DirectorOutput[], platform: string) {
  let currentTime = 0;
  const timeline = [];

  scenes.forEach((scene, index) => {
    const duration = 3;
    const endTime = currentTime + duration;

    let purpose = 'Content';
    if (currentTime < 3) purpose = 'Hook';
    else if (scene.productReveal) purpose = 'Product Reveal';
    else if (index === scenes.length - 1) purpose = 'CTA';
    else if (index < scenes.length / 2) purpose = 'Problem';
    else purpose = 'Benefits';

    timeline.push({
      start: `${currentTime}s`,
      end: `${endTime}s`,
      purpose,
      scene: scene.scene,
      visual: scene.visual,
      text: scene.text,
    });

    currentTime = endTime;
  });

  return timeline;
}

/**
 * Export based on editor type
 */
export function exportForEditor(scenes: DirectorOutput[], editorType: EditorType, projectName: string = 'AI Studio Project') {
  switch (editorType) {
    case 'premiere-pro':
      return {
        type: 'xml',
        filename: `${projectName}_Premiere.xml`,
        content: generatePremiereProXML(scenes, projectName),
      };

    case 'capcut':
      return {
        type: 'json',
        filename: `${projectName}_CapCut.json`,
        content: JSON.stringify(generateCapCutTimeline(scenes), null, 2),
      };

    case 'after-effects':
      return {
        type: 'json',
        filename: `${projectName}_AfterEffects.json`,
        content: JSON.stringify(generateAfterEffectsGuide(scenes), null, 2),
      };

    case 'davinci-resolve':
      return {
        type: 'json',
        filename: `${projectName}_Resolve.json`,
        content: JSON.stringify({
          message: 'DaVinci Resolve export coming soon',
          timeline: generateAITimeline(scenes, 'general'),
        }, null, 2),
      };

    case 'final-cut-pro':
      return {
        type: 'xml',
        filename: `${projectName}_FinalCut.xml`,
        content: '<?xml version="1.0" encoding="UTF-8"?>\n<!-- Final Cut Pro XML coming soon -->',
      };

    case 'canva':
      return {
        type: 'json',
        filename: `${projectName}_Canva.json`,
        content: JSON.stringify({
          pages: scenes.map((scene) => ({
            title: scene.text,
            visual: scene.visual,
            icon: scene.icon,
          })),
        }, null, 2),
      };

    default:
      return {
        type: 'json',
        filename: `${projectName}_Timeline.json`,
        content: JSON.stringify(scenes, null, 2),
      };
  }
}
