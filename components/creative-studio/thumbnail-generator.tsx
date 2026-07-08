'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Image as ImageIcon, Copy, Download, TrendingUp, Eye, Zap } from 'lucide-react';

interface ThumbnailIdea {
  title: string;
  description: string;
  textPlacement: string;
  colorScheme: string[];
  fontStyle: string;
  visualElements: string[];
  psychologyTrigger: string;
  ctrScore: number;
  platform: string;
  mood: string;
}

export function ThumbnailGenerator() {
  const [formData, setFormData] = useState({
    videoTitle: '',
    videoTopic: '',
    targetAudience: '',
    platform: 'youtube',
    style: 'bold',
    emotion: 'curiosity',
  });
  const [generating, setGenerating] = useState(false);
  const [results, setResults] = useState<ThumbnailIdea[]>([]);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const response = await fetch('/api/generate/thumbnail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        setResults(data.thumbnails);
      } else {
        alert(data.error || 'Failed to generate thumbnails');
      }
    } catch (error) {
      console.error('Failed to generate:', error);
      alert('Failed to generate thumbnail ideas');
    } finally {
      setGenerating(false);
    }
  };

  const copyToClipboard = (idea: ThumbnailIdea) => {
    const text = `
Thumbnail Concept: ${idea.title}
Description: ${idea.description}
Text Placement: ${idea.textPlacement}
Colors: ${idea.colorScheme.join(', ')}
Font: ${idea.fontStyle}
Visual Elements: ${idea.visualElements.join(', ')}
Psychology: ${idea.psychologyTrigger}
CTR Score: ${idea.ctrScore}/100
    `.trim();
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Left: Input Form */}
      <div>
        <Card className="sticky top-6">
          <CardHeader>
            <CardTitle>Thumbnail Generator</CardTitle>
            <CardDescription>
              Create high-CTR thumbnail concepts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Video Title *</label>
              <Input
                placeholder="How to Make $10K/Month"
                value={formData.videoTitle}
                onChange={(e) => setFormData({ ...formData, videoTitle: e.target.value })}
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Video Topic *</label>
              <Textarea
                placeholder="Main topic and key points of the video"
                value={formData.videoTopic}
                onChange={(e) => setFormData({ ...formData, videoTopic: e.target.value })}
                rows={3}
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Target Audience *</label>
              <Input
                placeholder="Who will watch this?"
                value={formData.targetAudience}
                onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Platform</label>
              <select
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
                value={formData.platform}
                onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
              >
                <option value="youtube">YouTube</option>
                <option value="facebook">Facebook</option>
                <option value="instagram">Instagram</option>
                <option value="tiktok">TikTok</option>
                <option value="linkedin">LinkedIn</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Visual Style</label>
              <select
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
                value={formData.style}
                onChange={(e) => setFormData({ ...formData, style: e.target.value })}
              >
                <option value="bold">Bold & Eye-catching</option>
                <option value="minimal">Minimal & Clean</option>
                <option value="dramatic">Dramatic & Dark</option>
                <option value="bright">Bright & Colorful</option>
                <option value="professional">Professional</option>
                <option value="playful">Playful & Fun</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Primary Emotion</label>
              <select
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
                value={formData.emotion}
                onChange={(e) => setFormData({ ...formData, emotion: e.target.value })}
              >
                <option value="curiosity">Curiosity</option>
                <option value="excitement">Excitement</option>
                <option value="shock">Shock/Surprise</option>
                <option value="fear">Fear/Urgency</option>
                <option value="aspiration">Aspiration</option>
                <option value="trust">Trust/Authority</option>
              </select>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={generating || !formData.videoTitle || !formData.videoTopic || !formData.targetAudience}
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
                  <ImageIcon className="mr-2 h-5 w-5" />
                  Generate 5 Thumbnail Ideas
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Right: Results */}
      <div className="lg:col-span-2 space-y-4">
        {results.length === 0 && !generating && (
          <Card className="h-[400px] flex items-center justify-center">
            <CardContent className="text-center">
              <ImageIcon className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-lg font-semibold mb-2">No Thumbnails Yet</h3>
              <p className="text-muted-foreground">
                Fill in the form and generate thumbnail concepts
              </p>
            </CardContent>
          </Card>
        )}

        {generating && (
          <Card className="h-[400px] flex items-center justify-center">
            <CardContent className="text-center">
              <Zap className="h-16 w-16 mx-auto mb-4 text-pink-600 animate-pulse" />
              <h3 className="text-lg font-semibold mb-2">Creating Thumbnail Concepts...</h3>
              <p className="text-muted-foreground">
                Analyzing CTR psychology and visual trends
              </p>
            </CardContent>
          </Card>
        )}

        {results.map((idea, index) => (
          <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader className="bg-gradient-to-r from-pink-50 to-purple-50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{idea.title}</CardTitle>
                  <CardDescription className="mt-1">{idea.description}</CardDescription>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Badge variant={idea.ctrScore >= 80 ? 'default' : idea.ctrScore >= 60 ? 'secondary' : 'outline'}>
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {idea.ctrScore}/100 CTR
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(idea)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-6 space-y-4">
              {/* Color Scheme */}
              <div>
                <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  Color Scheme
                </h4>
                <div className="flex gap-2">
                  {idea.colorScheme.map((color, i) => (
                    <div
                      key={i}
                      className="w-12 h-12 rounded-lg border-2 border-white shadow-sm flex items-center justify-center text-[10px] font-medium"
                      style={{ backgroundColor: color }}
                      title={color}
                    >
                      {color}
                    </div>
                  ))}
                </div>
              </div>

              {/* Text Placement */}
              <div className="bg-blue-50 rounded-lg p-3">
                <span className="text-xs font-medium text-blue-900">TEXT PLACEMENT:</span>
                <p className="text-sm mt-1">{idea.textPlacement}</p>
              </div>

              {/* Font Style */}
              <div className="bg-purple-50 rounded-lg p-3">
                <span className="text-xs font-medium text-purple-900">FONT STYLE:</span>
                <p className="text-sm mt-1">{idea.fontStyle}</p>
              </div>

              {/* Visual Elements */}
              <div>
                <h4 className="text-sm font-semibold mb-2">Visual Elements</h4>
                <div className="flex flex-wrap gap-2">
                  {idea.visualElements.map((element, i) => (
                    <Badge key={i} variant="secondary">
                      {element}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Psychology */}
              <div className="bg-green-50 rounded-lg p-3">
                <span className="text-xs font-medium text-green-900 flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  PSYCHOLOGY TRIGGER:
                </span>
                <p className="text-sm mt-1">{idea.psychologyTrigger}</p>
              </div>

              {/* Meta Info */}
              <div className="flex gap-4 pt-2 border-t text-sm text-muted-foreground">
                <div>
                  <span className="font-medium">Mood:</span> {idea.mood}
                </div>
                <div>
                  <span className="font-medium">Platform:</span> {idea.platform}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
