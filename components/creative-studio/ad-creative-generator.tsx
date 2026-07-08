'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Megaphone, Copy, Zap, Target, Image as ImageIcon } from 'lucide-react';

interface AdCreative {
  type: string;
  headline: string;
  description: string;
  visualConcept: string;
  copyElements: {
    hook: string;
    body: string;
    cta: string;
  };
  designNotes: string[];
  colorSuggestions: string[];
  targetingNotes: string;
  conversionScore: number;
}

export function AdCreativeGenerator() {
  const [formData, setFormData] = useState({
    product: '',
    offer: '',
    targetAudience: '',
    goal: 'sales',
    platform: 'facebook',
    adFormat: 'single-image',
  });
  const [generating, setGenerating] = useState(false);
  const [results, setResults] = useState<AdCreative[]>([]);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const response = await fetch('/api/generate/ad-creative', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        setResults(data.adCreatives);
      } else {
        alert(data.error || 'Failed to generate ad creatives');
      }
    } catch (error) {
      console.error('Failed to generate:', error);
      alert('Failed to generate ad creative concepts');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div>
        <Card className="sticky top-6">
          <CardHeader>
            <CardTitle>Ad Creative Generator</CardTitle>
            <CardDescription>
              Generate scroll-stopping ad concepts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Product/Service *</label>
              <Input
                placeholder="What are you selling?"
                value={formData.product}
                onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Offer *</label>
              <Textarea
                placeholder="What's the offer? (discount, benefit, unique feature)"
                value={formData.offer}
                onChange={(e) => setFormData({ ...formData, offer: e.target.value })}
                rows={3}
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Target Audience *</label>
              <Input
                placeholder="Who is this ad for?"
                value={formData.targetAudience}
                onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Campaign Goal</label>
              <select
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
                value={formData.goal}
                onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
              >
                <option value="sales">Drive Sales</option>
                <option value="leads">Generate Leads</option>
                <option value="awareness">Brand Awareness</option>
                <option value="engagement">Engagement</option>
                <option value="traffic">Website Traffic</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Platform</label>
              <select
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
                value={formData.platform}
                onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
              >
                <option value="facebook">Facebook</option>
                <option value="instagram">Instagram</option>
                <option value="google">Google Display</option>
                <option value="linkedin">LinkedIn</option>
                <option value="tiktok">TikTok</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Ad Format</label>
              <select
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
                value={formData.adFormat}
                onChange={(e) => setFormData({ ...formData, adFormat: e.target.value })}
              >
                <option value="single-image">Single Image</option>
                <option value="carousel">Carousel</option>
                <option value="video">Video Ad</option>
                <option value="story">Story Ad</option>
                <option value="collection">Collection Ad</option>
              </select>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={generating || !formData.product || !formData.offer || !formData.targetAudience}
              className="w-full"
              size="lg"
            >
              {generating ? (
                <>
                  <Zap className="mr-2 h-5 w-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Megaphone className="mr-2 h-5 w-5" />
                  Generate 3 Ad Concepts
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-2 space-y-4">
        {results.length === 0 && !generating && (
          <Card className="h-[400px] flex items-center justify-center">
            <CardContent className="text-center">
              <Megaphone className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-lg font-semibold mb-2">No Ad Creatives Yet</h3>
              <p className="text-muted-foreground">
                Configure your ad parameters and generate concepts
              </p>
            </CardContent>
          </Card>
        )}

        {generating && (
          <Card className="h-[400px] flex items-center justify-center">
            <CardContent className="text-center">
              <Zap className="h-16 w-16 mx-auto mb-4 text-pink-600 animate-pulse" />
              <h3 className="text-lg font-semibold mb-2">Creating Ad Concepts...</h3>
            </CardContent>
          </Card>
        )}

        {results.map((ad, index) => (
          <Card key={index} className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-pink-50">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge>{ad.type}</Badge>
                    <Badge variant={ad.conversionScore >= 80 ? 'default' : 'secondary'}>
                      <Target className="h-3 w-3 mr-1" />
                      {ad.conversionScore}/100
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{ad.headline}</CardTitle>
                  <CardDescription className="mt-1">{ad.description}</CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-6 space-y-4">
              {/* Visual Concept */}
              <div className="bg-purple-50 rounded-lg p-4">
                <span className="text-xs font-medium text-purple-900 flex items-center gap-1 mb-2">
                  <ImageIcon className="h-3 w-3" />
                  VISUAL CONCEPT:
                </span>
                <p className="text-sm">{ad.visualConcept}</p>
              </div>

              {/* Ad Copy */}
              <div className="space-y-3">
                <div className="bg-blue-50 rounded-lg p-3">
                  <span className="text-xs font-medium text-blue-900">HOOK:</span>
                  <p className="text-sm mt-1">{ad.copyElements.hook}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3">
                  <span className="text-xs font-medium text-green-900">BODY:</span>
                  <p className="text-sm mt-1">{ad.copyElements.body}</p>
                </div>
                <div className="bg-orange-50 rounded-lg p-3">
                  <span className="text-xs font-medium text-orange-900">CTA:</span>
                  <p className="text-sm mt-1 font-medium">{ad.copyElements.cta}</p>
                </div>
              </div>

              {/* Design Notes */}
              <div>
                <h4 className="text-sm font-semibold mb-2">Design Notes</h4>
                <div className="space-y-1">
                  {ad.designNotes.map((note, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-pink-600">•</span>
                      <span>{note}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div>
                <h4 className="text-sm font-semibold mb-2">Suggested Colors</h4>
                <div className="flex gap-2">
                  {ad.colorSuggestions.map((color, i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-lg border shadow-sm"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>

              {/* Targeting */}
              <div className="bg-slate-50 rounded-lg p-3">
                <span className="text-xs font-medium text-slate-900">TARGETING NOTES:</span>
                <p className="text-sm mt-1">{ad.targetingNotes}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
