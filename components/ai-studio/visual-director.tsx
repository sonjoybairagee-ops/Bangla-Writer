'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Loader2, 
  Camera, 
  Sparkles, 
  ArrowRight, 
  Zap,
  Film,
  Music,
  Volume2,
  Type,
  Palette,
  Sun,
  PlayCircle,
} from 'lucide-react';
import { Platform, PLATFORM_RULES } from '@/lib/ai-studio/director-engine';

interface VisualDirectorProps {
  scenes: any[];
  directions: any[];
  setDirections: (directions: any[]) => void;
  onNext: () => void;
}

export function VisualDirector({ scenes, directions, setDirections, onNext }: VisualDirectorProps) {
  const [loading, setLoading] = useState(false);
  const [currentScene, setCurrentScene] = useState(0);
  const [platform, setPlatform] = useState<Platform>('general');
  const [error, setError] = useState('');

  const handleDirectScene = async (sceneIndex: number) => {
    setLoading(true);
    setError('');

    try {
      const scene = scenes[sceneIndex];
      const response = await fetch('/api/ai-studio/direct-scene', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scene,
          sceneText: scene.text,
          sceneNumber: scene.scene,
          totalScenes: scenes.length,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to direct scene');
      }

      const newDirections = [...directions];
      newDirections[sceneIndex] = data.direction;
      setDirections(newDirections);

      // Auto-advance to next scene
      if (sceneIndex < scenes.length - 1) {
        setCurrentScene(sceneIndex + 1);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to direct scene');
    } finally {
      setLoading(false);
    }
  };

  const handleDirectAll = async () => {
    setLoading(true);
    setError('');

    try {
      const allDirections = [];

      for (let i = 0; i < scenes.length; i++) {
        const scene = scenes[i];
        const response = await fetch('/api/ai-studio/direct-scene', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            scene,
            sceneText: scene.text,
            sceneNumber: scene.scene,
            totalScenes: scenes.length,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to direct scene');
        }

        allDirections.push(data.direction);
        setDirections(allDirections);
        setCurrentScene(i + 1);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to direct all scenes');
    } finally {
      setLoading(false);
    }
  };

  if (scenes.length === 0) {
    return (
      <div className="text-center py-12">
        <Camera className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
        <p className="text-muted-foreground">Please split your script into scenes first</p>
      </div>
    );
  }

  const currentDirection = directions[currentScene];
  const platformRules = PLATFORM_RULES[platform];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">Step 2: Visual Director ⭐</h2>
          <p className="text-muted-foreground">
            AI-powered creative direction for each scene
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Select value={platform} onValueChange={(v) => setPlatform(v as Platform)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general">General Video</SelectItem>
              <SelectItem value="facebook-ad">Facebook Ads</SelectItem>
              <SelectItem value="tiktok">TikTok</SelectItem>
              <SelectItem value="youtube-shorts">YouTube Shorts</SelectItem>
              <SelectItem value="instagram-reels">Instagram Reels</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Platform Info */}
      <Card className="p-4 bg-purple-50 border-purple-200">
        <div className="flex items-start gap-3">
          <Zap className="h-5 w-5 text-purple-600 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-semibold text-purple-900 mb-1">Platform Optimization: {platform}</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-purple-600">Max Duration:</span>
                <p className="font-semibold text-purple-900">{platformRules.maxDuration}s</p>
              </div>
              <div>
                <span className="text-purple-600">Hook:</span>
                <p className="font-semibold text-purple-900">≤{platformRules.hookDuration}s</p>
              </div>
              <div>
                <span className="text-purple-600">Product Reveal:</span>
                <p className="font-semibold text-purple-900">{platformRules.productRevealStart}-{platformRules.productRevealEnd}s</p>
              </div>
              <div>
                <span className="text-purple-600">CTA:</span>
                <p className="font-semibold text-purple-900">Last {platformRules.ctaDuration}s</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={handleDirectAll}
          disabled={loading}
          size="lg"
          className="flex-1"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Directing {currentScene + 1}/{scenes.length}...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-5 w-5" />
              Direct All Scenes
            </>
          )}
        </Button>

        {directions.length === scenes.length && (
          <Button onClick={onNext} size="lg" variant="secondary">
            Next: Storyboard
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Scene Cards */}
      <div className="grid gap-4">
        {scenes.map((scene, index) => {
          const direction = directions[index];
          const isActive = index === currentScene;

          return (
            <Card 
              key={index} 
              className={`p-6 transition-all ${
                isActive ? 'ring-2 ring-purple-500 shadow-lg' : 'opacity-75'
              }`}
            >
              <div className="space-y-4">
                {/* Scene Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="font-mono text-base px-3 py-1">
                      Scene {scene.scene}
                    </Badge>
                    <Badge variant="secondary">{scene.time}s</Badge>
                    {direction && (
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        ✓ Directed
                      </Badge>
                    )}
                  </div>

                  {!direction && (
                    <Button
                      onClick={() => handleDirectScene(index)}
                      disabled={loading}
                      size="sm"
                    >
                      <Camera className="mr-2 h-4 w-4" />
                      Direct This Scene
                    </Button>
                  )}
                </div>

                {/* Script Text */}
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-sm">{scene.text}</p>
                </div>

                {/* Direction Details */}
                {direction && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t">
                    {/* Visual */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <Film className="h-4 w-4" />
                        Visual
                      </div>
                      <p className="text-sm font-medium">{direction.visual}</p>
                    </div>

                    {/* Camera */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <Camera className="h-4 w-4" />
                        Camera
                      </div>
                      <p className="text-sm font-medium">{direction.camera}</p>
                      <p className="text-xs text-muted-foreground">{direction.lens} · {direction.movement}</p>
                    </div>

                    {/* Animation */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <Zap className="h-4 w-4" />
                        Animation
                      </div>
                      <p className="text-sm font-medium">{direction.animation}</p>
                      <p className="text-xs text-muted-foreground">{direction.transition}</p>
                    </div>

                    {/* Text Overlay */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <Type className="h-4 w-4" />
                        Text Overlay
                      </div>
                      <p className="text-sm font-medium">{direction.text}</p>
                      <p className="text-xs">{direction.icon}</p>
                    </div>

                    {/* Audio */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <Music className="h-4 w-4" />
                        Audio
                      </div>
                      <p className="text-sm font-medium">{direction.music}</p>
                      <p className="text-xs text-muted-foreground">SFX: {direction.sfx}</p>
                    </div>

                    {/* Lighting */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <Sun className="h-4 w-4" />
                        Style
                      </div>
                      <p className="text-sm font-medium">{direction.lighting}</p>
                      <p className="text-xs text-muted-foreground">{direction.color}</p>
                    </div>

                    {/* B-roll */}
                    {direction.broll && direction.broll.length > 0 && (
                      <div className="space-y-1 col-span-2">
                        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                          <PlayCircle className="h-4 w-4" />
                          B-roll
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {direction.broll.map((item: string, i: number) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {item}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Progress */}
      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <span>{directions.length} of {scenes.length} scenes directed</span>
        {directions.length === scenes.length && (
          <Badge variant="secondary" className="bg-green-100 text-green-700">
            <Sparkles className="h-3 w-3 mr-1" />
            Complete
          </Badge>
        )}
      </div>
    </div>
  );
}
