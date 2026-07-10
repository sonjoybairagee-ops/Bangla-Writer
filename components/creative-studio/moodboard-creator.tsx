'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Palette, Zap } from 'lucide-react';

interface Moodboard {
  name: string;
  description: string;
  colorPalette: { name: string; hex: string; usage: string }[];
  typography: {
    heading: string;
    body: string;
    accent: string;
  };
  visualStyle: string;
  moodKeywords: string[];
  references: string[];
  designPrinciples: string[];
}

export function MoodboardCreator() {
  const [formData, setFormData] = useState({
    projectName: '',
    projectDescription: '',
    targetMood: '',
    industry: '',
    language: 'bangla',
  });
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<Moodboard | null>(null);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const response = await fetch('/api/generate/moodboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        setResult(data.moodboard);
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
            <CardTitle>Moodboard Creator</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Project Name *</label>
              <Input
                value={formData.projectName}
                onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Description *</label>
              <Textarea
                rows={3}
                value={formData.projectDescription}
                onChange={(e) => setFormData({ ...formData, projectDescription: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Target Mood *</label>
              <Input
                placeholder="e.g., Modern & Professional"
                value={formData.targetMood}
                onChange={(e) => setFormData({ ...formData, targetMood: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Industry *</label>
              <Input
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
              />
            </div>

            {/* Language */}
            <div>
              <label className="text-sm font-medium">Language Output</label>
              <div className="grid grid-cols-3 gap-2 mt-1">
                <Button
                  type="button"
                  variant={formData.language === 'bangla' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFormData({ ...formData, language: 'bangla' })}
                  className={formData.language === 'bangla' ? 'bg-pink-600 hover:bg-pink-700' : ''}
                >
                  বাংলা
                </Button>
                <Button
                  type="button"
                  variant={formData.language === 'english' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFormData({ ...formData, language: 'english' })}
                  className={formData.language === 'english' ? 'bg-pink-600 hover:bg-pink-700' : ''}
                >
                  English
                </Button>
                <Button
                  type="button"
                  variant={formData.language === 'banglish' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFormData({ ...formData, language: 'banglish' })}
                  className={formData.language === 'banglish' ? 'bg-pink-600 hover:bg-pink-700' : ''}
                >
                  বাংলিশ
                </Button>
              </div>
            </div>

            <Button onClick={handleGenerate} disabled={generating} className="w-full">
              {generating ? 'Creating...' : 'Create Moodboard'}
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-2">
        {result && (
          <Card>
            <CardHeader>
              <CardTitle>{result.name}</CardTitle>
              <p className="text-sm text-muted-foreground mt-2">{result.description}</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Color Palette */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Color Palette
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {result.colorPalette.map((color, i) => (
                    <div key={i} className="border rounded-lg p-3">
                      <div
                        className="w-full h-20 rounded-lg mb-2"
                        style={{ backgroundColor: color.hex }}
                      />
                      <div className="text-sm">
                        <div className="font-medium">{color.name}</div>
                        <div className="text-xs text-muted-foreground">{color.hex}</div>
                        <div className="text-xs mt-1">{color.usage}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Typography */}
              <div>
                <h3 className="font-semibold mb-3">Typography</h3>
                <div className="space-y-2 bg-slate-50 rounded-lg p-4">
                  <div><strong>Heading:</strong> {result.typography.heading}</div>
                  <div><strong>Body:</strong> {result.typography.body}</div>
                  <div><strong>Accent:</strong> {result.typography.accent}</div>
                </div>
              </div>

              {/* Visual Style */}
              <div>
                <h3 className="font-semibold mb-2">Visual Style</h3>
                <p className="text-sm bg-purple-50 p-3 rounded">{result.visualStyle}</p>
              </div>

              {/* Mood Keywords */}
              <div>
                <h3 className="font-semibold mb-2">Mood Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {result.moodKeywords.map((keyword, i) => (
                    <Badge key={i}>{keyword}</Badge>
                  ))}
                </div>
              </div>

              {/* References */}
              <div>
                <h3 className="font-semibold mb-2">Style References</h3>
                <ul className="space-y-1">
                  {result.references.map((ref, i) => (
                    <li key={i} className="text-sm flex gap-2">
                      <span>•</span>
                      <span>{ref}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Design Principles */}
              <div>
                <h3 className="font-semibold mb-2">Design Principles</h3>
                <div className="space-y-2">
                  {result.designPrinciples.map((principle, i) => (
                    <div key={i} className="bg-blue-50 p-3 rounded text-sm">
                      {principle}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
