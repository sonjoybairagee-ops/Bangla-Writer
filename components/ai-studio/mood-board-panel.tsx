'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Palette, Sparkles } from 'lucide-react';
import { generateMoodBoard } from '@/lib/ai-studio/director-engine';

interface MoodBoardPanelProps {
  directions: any[];
}

export function MoodBoardPanel({ directions }: MoodBoardPanelProps) {
  if (directions.length === 0) {
    return (
      <div className="text-center py-12">
        <Palette className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
        <p className="text-muted-foreground">No mood board data available</p>
      </div>
    );
  }

  const moodBoard = generateMoodBoard(directions);

  // Color mapping
  const colorClasses: Record<string, string> = {
    'Warm': 'bg-orange-100 text-orange-700',
    'Cool': 'bg-blue-100 text-blue-700',
    'Orange Teal': 'bg-gradient-to-r from-orange-400 to-teal-400 text-white',
    'Moody': 'bg-slate-700 text-slate-100',
    'Bright': 'bg-yellow-100 text-yellow-700',
    'Neutral': 'bg-slate-100 text-slate-700',
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold">Mood Board</h3>
        <p className="text-muted-foreground">Overall visual style and aesthetic guide</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Overall Style */}
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-purple-600" />
              <h4 className="font-semibold">Overall Style</h4>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-sm text-muted-foreground">Style Reference</span>
                <div className="mt-1">
                  <Badge variant="secondary" className="text-base px-4 py-2">
                    {moodBoard.style}
                  </Badge>
                </div>
              </div>

              <div>
                <span className="text-sm text-muted-foreground">Tone</span>
                <div className="mt-1">
                  <Badge variant="outline" className="text-base px-4 py-2">
                    {moodBoard.tone}
                  </Badge>
                </div>
              </div>

              <div>
                <span className="text-sm text-muted-foreground">Aesthetic</span>
                <div className="mt-1">
                  <Badge variant="outline" className="text-base px-4 py-2">
                    {moodBoard.aesthetic}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Visual Elements */}
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Palette className="h-5 w-5 text-purple-600" />
              <h4 className="font-semibold">Visual Elements</h4>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-sm text-muted-foreground mb-2 block">Color Palette</span>
                <div className="flex flex-wrap gap-2">
                  {moodBoard.colors.map((color, i) => (
                    <Badge 
                      key={i} 
                      className={colorClasses[color] || 'bg-slate-100 text-slate-700'}
                    >
                      {color}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-sm text-muted-foreground mb-2 block">Lighting Style</span>
                <div className="flex flex-wrap gap-2">
                  {moodBoard.lighting.map((light, i) => (
                    <Badge key={i} variant="outline">
                      {light}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-sm text-muted-foreground mb-2 block">Emotional Range</span>
                <div className="flex flex-wrap gap-2">
                  {moodBoard.emotions.map((emotion, i) => (
                    <Badge key={i} variant="secondary">
                      {emotion}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Style Guide */}
      <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <h4 className="font-semibold mb-4">Style Guidelines</h4>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h5 className="text-sm font-semibold text-purple-700">Visual Consistency</h5>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-0.5">•</span>
                <span>Maintain {moodBoard.colors.join(' and ')} color scheme throughout</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-0.5">•</span>
                <span>Use {moodBoard.lighting.join(' or ')} lighting consistently</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-0.5">•</span>
                <span>Keep {moodBoard.aesthetic.toLowerCase()} aesthetic across all scenes</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h5 className="text-sm font-semibold text-blue-700">Production Notes</h5>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Target tone: {moodBoard.tone}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Reference style: {moodBoard.style}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Emotional journey: {moodBoard.emotions.join(' → ')}</span>
              </li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Scene-by-Scene Analysis */}
      <Card className="p-6">
        <h4 className="font-semibold mb-4">Scene Color Distribution</h4>
        <div className="space-y-3">
          {directions.map((scene: any, index: number) => (
            <div key={index} className="flex items-center gap-3">
              <Badge variant="outline" className="font-mono">
                Scene {scene.scene}
              </Badge>
              <div className="flex-1 bg-slate-100 rounded-full h-6 overflow-hidden">
                <div 
                  className={`h-full flex items-center px-3 text-xs font-medium ${colorClasses[scene.color] || 'bg-slate-200'}`}
                  style={{ width: '100%' }}
                >
                  {scene.color} • {scene.lighting}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
