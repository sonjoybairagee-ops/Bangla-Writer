'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, Eye } from 'lucide-react';

interface VisualHook {
  name: string;
  description: string;
  visualElements: string[];
  textOverlay: string;
  timing: string;
  psychology: string;
  stopScore: number;
}

export function VisualHookGenerator() {
  const [formData, setFormData] = useState({
    topic: '',
    platform: 'instagram',
    emotion: 'curiosity',
  });
  const [generating, setGenerating] = useState(false);
  const [results, setResults] = useState<VisualHook[]>([]);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const response = await fetch('/api/generate/visual-hook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        setResults(data.visualHooks);
      }
    } catch (error) {
      console.error('Failed:', error);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Visual Hook Generator</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Topic *</label>
              <Input
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Platform</label>
              <select
                className="w-full h-10 rounded-md border px-3"
                value={formData.platform}
                onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
              >
                <option value="instagram">Instagram</option>
                <option value="tiktok">TikTok</option>
                <option value="youtube">YouTube</option>
                <option value="facebook">Facebook</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Emotion</label>
              <select
                className="w-full h-10 rounded-md border px-3"
                value={formData.emotion}
                onChange={(e) => setFormData({ ...formData, emotion: e.target.value })}
              >
                <option value="curiosity">Curiosity</option>
                <option value="shock">Shock</option>
                <option value="excitement">Excitement</option>
                <option value="fear">Fear/Urgency</option>
              </select>
            </div>
            <Button onClick={handleGenerate} disabled={generating} className="w-full">
              Generate Visual Hooks
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-2 space-y-4">
        {results.map((hook, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="flex justify-between">
                <CardTitle className="text-lg">{hook.name}</CardTitle>
                <Badge>
                  <Eye className="h-3 w-3 mr-1" />
                  {hook.stopScore}/100 Stop Score
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm">{hook.description}</p>
              <div className="bg-purple-50 p-3 rounded">
                <span className="text-xs font-medium">TEXT OVERLAY:</span>
                <p className="text-sm mt-1 font-medium">{hook.textOverlay}</p>
              </div>
              <div>
                <span className="text-sm font-medium">Visual Elements:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {hook.visualElements.map((el, j) => (
                    <Badge key={j} variant="outline">{el}</Badge>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><strong>Timing:</strong> {hook.timing}</div>
                <div><strong>Psychology:</strong> {hook.psychology}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
