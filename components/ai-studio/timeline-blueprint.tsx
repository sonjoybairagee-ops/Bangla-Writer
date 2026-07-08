'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Clock, 
  Camera, 
  Type, 
  Zap, 
  Music, 
  Volume2,
  CheckSquare,
  Download,
  Play,
} from 'lucide-react';

interface TimelineBlueprintProps {
  directions: any[];
  platform: string;
}

export function TimelineBlueprint({ directions, platform }: TimelineBlueprintProps) {
  if (directions.length === 0) {
    return (
      <div className="text-center py-12">
        <Clock className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
        <p className="text-muted-foreground">No timeline data available</p>
      </div>
    );
  }

  let currentTime = 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold">Timeline Blueprint</h3>
          <p className="text-muted-foreground">Production-ready editing guide</p>
        </div>
        <Badge variant="secondary" className="text-sm">
          Platform: {platform}
        </Badge>
      </div>

      {/* Timeline */}
      <div className="space-y-4">
        {directions.map((scene: any, index: number) => {
          const duration = 3; // Default 3s per scene
          const startTime = currentTime;
          const endTime = currentTime + duration;
          currentTime = endTime;

          return (
            <Card key={index} className="overflow-hidden">
              {/* Timeline Header */}
              <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-4 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="bg-white text-purple-700 font-mono">
                      {startTime}s – {endTime}s
                    </Badge>
                    <Badge variant="secondary" className="bg-purple-700 text-white">
                      Scene {scene.scene}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span className="font-semibold">{duration}s</span>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Voiceover */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="md:col-span-1">
                    <div className="flex items-center gap-2 text-sm font-semibold text-purple-600 mb-2">
                      <Play className="h-4 w-4" />
                      Voiceover
                    </div>
                    <p className="text-sm bg-purple-50 p-3 rounded-lg">
                      "{scene.text}"
                    </p>
                  </div>

                  <div className="md:col-span-1">
                    <div className="flex items-center gap-2 text-sm font-semibold text-blue-600 mb-2">
                      <Camera className="h-4 w-4" />
                      Visual
                    </div>
                    <p className="text-sm bg-blue-50 p-3 rounded-lg">
                      {scene.visual}
                    </p>
                    {scene.broll && scene.broll.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {scene.broll.map((item: string, i: number) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="md:col-span-1">
                    <div className="flex items-center gap-2 text-sm font-semibold text-green-600 mb-2">
                      <Zap className="h-4 w-4" />
                      Editor Action
                    </div>
                    <div className="text-sm bg-green-50 p-3 rounded-lg space-y-1">
                      <p><strong>Camera:</strong> {scene.camera} • {scene.lens}</p>
                      <p><strong>Movement:</strong> {scene.movement}</p>
                      <p><strong>Animation:</strong> {scene.animation}</p>
                      <p><strong>Transition:</strong> {scene.transition}</p>
                    </div>
                  </div>
                </div>

                {/* Editing Instructions */}
                <div className="grid md:grid-cols-2 gap-4 pt-4 border-t">
                  {/* Technical Details */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm flex items-center gap-2">
                      <Camera className="h-4 w-4 text-purple-600" />
                      Camera & Lighting
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Shot Type:</span>
                        <span className="font-medium">{scene.camera}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Lens:</span>
                        <span className="font-medium">{scene.lens}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Movement:</span>
                        <span className="font-medium">{scene.movement}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Lighting:</span>
                        <span className="font-medium">{scene.lighting}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Color:</span>
                        <span className="font-medium">{scene.color}</span>
                      </div>
                    </div>
                  </div>

                  {/* Animation & Audio */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm flex items-center gap-2">
                      <Music className="h-4 w-4 text-blue-600" />
                      Animation & Audio
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Text:</span>
                        <span className="font-medium">{scene.text}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Animation:</span>
                        <span className="font-medium">{scene.animation}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Icon:</span>
                        <span className="font-medium text-xl">{scene.icon}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Music:</span>
                        <span className="font-medium">{scene.music}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">SFX:</span>
                        <span className="font-medium">{scene.sfx}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex flex-wrap gap-2 pt-4 border-t">
                  <Badge variant="outline" className="text-xs">
                    <Camera className="h-3 w-3 mr-1" />
                    {scene.camera}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    <Zap className="h-3 w-3 mr-1" />
                    {scene.animation}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    <Type className="h-3 w-3 mr-1" />
                    {scene.transition}
                  </Badge>
                  {scene.productReveal && (
                    <Badge className="text-xs bg-amber-100 text-amber-700">
                      ⭐ Product Reveal
                    </Badge>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Summary Stats */}
      <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-purple-600">{directions.length}</p>
            <p className="text-xs text-muted-foreground mt-1">Total Scenes</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-purple-600">{currentTime}s</p>
            <p className="text-xs text-muted-foreground mt-1">Duration</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-purple-600">
              {new Set(directions.map((d: any) => d.camera)).size}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Camera Angles</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-purple-600">
              {new Set(directions.map((d: any) => d.transition)).size}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Transitions</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-purple-600">
              {directions.filter((d: any) => d.productReveal).length}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Product Reveals</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
