'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Scissors, ArrowRight } from 'lucide-react';

interface EditingGuidePanelProps {
  directions: any[];
  onNext: () => void;
}

export function EditingGuidePanel({ directions, onNext }: EditingGuidePanelProps) {
  if (directions.length === 0) {
    return (
      <div className="text-center py-12">
        <Scissors className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
        <p className="text-muted-foreground">Please complete Visual Director first</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Step 6: Editing Guide</h2>
        <p className="text-muted-foreground">
          Complete editing instructions for post-production
        </p>
      </div>

      <div className="grid gap-4">
        {directions.map((direction: any, index: number) => (
          <Card key={index} className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="font-mono">Scene {direction.scene}</Badge>
                  <Badge variant="secondary">{direction.transition}</Badge>
                </div>
                <span className="text-sm text-muted-foreground">~3s</span>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium">Transition In</span>
                    <p className="text-sm text-muted-foreground mt-1">{direction.transition} · 0.3s</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Effects</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">Zoom</Badge>
                      <Badge variant="outline" className="text-xs">Speed Ramp</Badge>
                      <Badge variant="outline" className="text-xs">Color Grade</Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium">Audio</span>
                    <p className="text-sm text-muted-foreground mt-1">
                      Music: {direction.music} · SFX: {direction.sfx}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Color Grading</span>
                    <p className="text-sm text-muted-foreground mt-1">{direction.color}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Button onClick={onNext} size="lg">
        Next: Export
        <ArrowRight className="ml-2 h-5 w-5" />
      </Button>
    </div>
  );
}
