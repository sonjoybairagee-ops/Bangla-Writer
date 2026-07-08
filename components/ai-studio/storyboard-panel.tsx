'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Grid3x3, Image as ImageIcon, ArrowRight } from 'lucide-react';

interface StoryboardPanelProps {
  directions: any[];
  onNext: () => void;
}

export function StoryboardPanel({ directions, onNext }: StoryboardPanelProps) {
  if (directions.length === 0) {
    return (
      <div className="text-center py-12">
        <Grid3x3 className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
        <p className="text-muted-foreground">Please complete Visual Director first</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Step 3: Storyboard</h2>
        <p className="text-muted-foreground">
          Visual representation of each scene (Image generation coming soon)
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {directions.map((direction: any, index: number) => (
          <Card key={index} className="overflow-hidden">
            <div className="aspect-video bg-slate-100 flex items-center justify-center">
              <ImageIcon className="h-12 w-12 text-muted-foreground" />
            </div>
            <div className="p-3 space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant="outline">Scene {direction.scene}</Badge>
                <span className="text-xs text-muted-foreground">{direction.camera}</span>
              </div>
              <p className="text-sm line-clamp-2">{direction.visual}</p>
              <p className="text-xs text-muted-foreground">
                {direction.lens} · {direction.lighting}
              </p>
            </div>
          </Card>
        ))}
      </div>

      <Button onClick={onNext} size="lg">
        Next: Shot List
        <ArrowRight className="ml-2 h-5 w-5" />
      </Button>
    </div>
  );
}
