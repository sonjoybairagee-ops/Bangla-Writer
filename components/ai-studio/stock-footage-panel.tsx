'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Image, ExternalLink, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { generateStockFootageKeywords } from '@/lib/ai-studio/director-engine';

interface StockFootagePanelProps {
  directions: any[];
}

export function StockFootagePanel({ directions }: StockFootagePanelProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (directions.length === 0) {
    return (
      <div className="text-center py-12">
        <Image className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
        <p className="text-muted-foreground">No stock footage data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold">Stock Footage Search</h3>
        <p className="text-muted-foreground">Ready-to-use search keywords for stock platforms</p>
      </div>

      <div className="grid gap-6">
        {directions.map((scene: any, index: number) => {
          const keywords = generateStockFootageKeywords(scene);
          const pexelsSearch = keywords.pexels.join(' ');
          const storyblocksSearch = keywords.storyblocks.join(' ');
          const freepikSearch = keywords.freepik.join(' ');

          return (
            <Card key={index} className="p-6">
              <div className="space-y-4">
                {/* Scene Header */}
                <div className="flex items-center justify-between pb-4 border-b">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="font-mono">Scene {scene.scene}</Badge>
                    <p className="text-sm font-medium">{scene.visual}</p>
                  </div>
                </div>

                {/* Stock Platforms */}
                <div className="grid md:grid-cols-3 gap-4">
                  {/* Pexels */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <Image className="h-4 w-4 text-green-600" />
                      </div>
                      <h4 className="font-semibold text-sm">Pexels</h4>
                    </div>
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-1">
                        {keywords.pexels.map((keyword, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={() => window.open(`https://www.pexels.com/search/videos/${encodeURIComponent(pexelsSearch)}/`, '_blank')}
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Search
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleCopy(pexelsSearch, index * 3)}
                        >
                          {copiedIndex === index * 3 ? (
                            <Check className="h-3 w-3" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Storyblocks */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Image className="h-4 w-4 text-blue-600" />
                      </div>
                      <h4 className="font-semibold text-sm">Storyblocks</h4>
                    </div>
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-1">
                        {keywords.storyblocks.map((keyword, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={() => window.open(`https://www.storyblocks.com/search?search=${encodeURIComponent(storyblocksSearch)}`, '_blank')}
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Search
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleCopy(storyblocksSearch, index * 3 + 1)}
                        >
                          {copiedIndex === index * 3 + 1 ? (
                            <Check className="h-3 w-3" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Freepik */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Image className="h-4 w-4 text-purple-600" />
                      </div>
                      <h4 className="font-semibold text-sm">Freepik</h4>
                    </div>
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-1">
                        {keywords.freepik.map((keyword, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={() => window.open(`https://www.freepik.com/search?format=search&query=${encodeURIComponent(freepikSearch)}`, '_blank')}
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Search
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleCopy(freepikSearch, index * 3 + 2)}
                        >
                          {copiedIndex === index * 3 + 2 ? (
                            <Check className="h-3 w-3" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* B-roll Suggestions */}
                {scene.broll && scene.broll.length > 0 && (
                  <div className="pt-4 border-t">
                    <h5 className="text-sm font-semibold mb-2">B-roll Suggestions:</h5>
                    <div className="flex flex-wrap gap-2">
                      {scene.broll.map((item: string, i: number) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
