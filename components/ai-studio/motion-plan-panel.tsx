'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, ArrowRight } from 'lucide-react';

interface MotionPlanPanelProps {
  directions: any[];
  onNext: () => void;
}

export function MotionPlanPanel({ directions, onNext }: MotionPlanPanelProps) {
  if (directions.length === 0) {
    return (
      <div className="text-center py-12">
        <Zap className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
        <p className="text-muted-foreground">Please complete Visual Director first</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Step 5: Motion Plan</h2>
        <p className="text-muted-foreground">
          Animation and motion graphics timeline
        </p>
      </div>

      <div className="grid gap-4">
        {directions.map((direction: any, index: number) => (
          <Card key={index} className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="font-mono">Scene {direction.scene}</Badge>
                <Badge variant="secondary">{direction.animation}</Badge>
              </div>

              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Text Animation</span>
                  <p className="font-medium mt-1">{direction.animation}</p>
                  <p className="text-xs text-muted-foreground">0.5s · ease-out</p>
                </div>

                <div>
                  <span className="text-muted-foreground">Camera Movement</span>
                  <p className="font-medium mt-1">{direction.movement}</p>
                  <p className="text-xs text-muted-foreground">2.0s · ease-in-out</p>
                </div>

                <div>
                  <span className="text-muted-foreground">Transition</span>
                  <p className="font-medium mt-1">{direction.transition}</p>
                  <p className="text-xs text-muted-foreground">0.3s</p>
                </div>
              </div>

              <div className="pt-3 border-t">
                <p className="text-sm"><span className="font-medium">Text:</span> {direction.text}</p>
                <p className="text-sm mt-1"><span className="font-medium">Effect:</span> Bounce + Glow + Highlight</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Button onClick={onNext} size="lg">
        Next: Editing Guide
        <ArrowRight className="ml-2 h-5 w-5" />
      </Button>
    </div>
  );
}
