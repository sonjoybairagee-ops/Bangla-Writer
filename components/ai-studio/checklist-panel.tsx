'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckSquare, Square } from 'lucide-react';
import { generateEditingChecklist, generatePremiereProSettings, generateCapCutAnimations, generateAfterEffectsSettings } from '@/lib/ai-studio/director-engine';

interface ChecklistPanelProps {
  directions: any[];
}

export function ChecklistPanel({ directions }: ChecklistPanelProps) {
  if (directions.length === 0) {
    return (
      <div className="text-center py-12">
        <CheckSquare className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
        <p className="text-muted-foreground">No checklist data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold">Editing Checklist</h3>
        <p className="text-muted-foreground">Step-by-step editing instructions for each scene</p>
      </div>

      <div className="grid gap-6">
        {directions.map((scene: any, index: number) => {
          const checklist = generateEditingChecklist(scene);
          const premierePro = generatePremiereProSettings(scene);
          const capcut = generateCapCutAnimations(scene);
          const afterEffects = generateAfterEffectsSettings(scene);

          return (
            <Card key={index} className="p-6">
              <div className="space-y-6">
                {/* Scene Header */}
                <div className="flex items-center justify-between pb-4 border-b">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="font-mono">Scene {scene.scene}</Badge>
                    <Badge variant="secondary">{scene.styleReference || 'Corporate'} Style</Badge>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {checklist.length} tasks
                  </span>
                </div>

                {/* Main Checklist */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm mb-3">Editing Steps:</h4>
                  <div className="grid md:grid-cols-2 gap-2">
                    {checklist.map((item, i) => (
                      <div key={i} className="flex items-start gap-2 p-2 hover:bg-slate-50 rounded transition-colors">
                        <Square className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Editor-Specific Instructions */}
                <div className="grid md:grid-cols-3 gap-4 pt-4 border-t">
                  {/* Premiere Pro */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-purple-100 rounded flex items-center justify-center">
                        <span className="text-xs font-bold text-purple-600">Pr</span>
                      </div>
                      <h5 className="font-semibold text-sm">Premiere Pro</h5>
                    </div>
                    <div className="space-y-1 text-sm">
                      {premierePro.scale && (
                        <p className="text-muted-foreground">
                          <span className="font-medium">Scale:</span> {premierePro.scale}
                        </p>
                      )}
                      {premierePro.blur && (
                        <p className="text-muted-foreground">
                          <span className="font-medium">Blur:</span> {premierePro.blur}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {premierePro.effects.map((effect: string, i: number) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {effect}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* CapCut */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                        <span className="text-xs font-bold text-blue-600">CC</span>
                      </div>
                      <h5 className="font-semibold text-sm">CapCut</h5>
                    </div>
                    <div className="space-y-1 text-sm">
                      <p className="text-muted-foreground mb-2">
                        <span className="font-medium">Animations:</span>
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {capcut.map((animation: string, i: number) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {animation}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* After Effects */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-pink-100 rounded flex items-center justify-center">
                        <span className="text-xs font-bold text-pink-600">Ae</span>
                      </div>
                      <h5 className="font-semibold text-sm">After Effects</h5>
                    </div>
                    <div className="space-y-1 text-sm">
                      <p className="text-muted-foreground mb-2">
                        <span className="font-medium">Effects:</span>
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {afterEffects.map((effect: string, i: number) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {effect}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Style Reference */}
                <div className="pt-4 border-t">
                  <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-lg">
                    <span className="text-sm font-semibold">Style Reference:</span>
                    <Badge variant="secondary" className="text-xs">
                      {scene.styleReference || 'Corporate'}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {scene.styleReference === 'MrBeast' && '→ High energy, fast cuts, bold text'}
                      {scene.styleReference === 'Apple' && '→ Clean, minimalist, professional'}
                      {scene.styleReference === 'Vox' && '→ Cinematic, storytelling, smooth'}
                      {scene.styleReference === 'Gary Vee' && '→ Dynamic, authentic, motivational'}
                      {scene.styleReference === 'Corporate' && '→ Professional, clean, trustworthy'}
                      {scene.styleReference === 'Minimal' && '→ Simple, focused, elegant'}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
