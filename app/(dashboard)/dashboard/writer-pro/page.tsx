'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { COPYWRITING_FRAMEWORKS, CONTENT_PLATFORMS, CONTENT_GOALS, CONTENT_TONES } from '@/lib/constants/frameworks';
import { Sparkles, Copy, Check, Zap, Hash, MessageSquare, Target } from 'lucide-react';

export default function WriterProPage() {
  const [brands, setBrands] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    framework: 'AIDA',
    product: '',
    platform: 'instagram',
    goal: 'engagement',
    tone: 'friendly',
    audience: '',
    brandId: '',
    humanMode: false,
    truthBombMode: false,
  });
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'content' | 'hooks' | 'cta' | 'hashtags' | 'caption'>('content');

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const response = await fetch('/api/brands');
      const data = await response.json();
      setBrands(data.brands);
    } catch (error) {
      console.error('Failed to fetch brands:', error);
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setResult(null);

    try {
      let endpoint = '/api/generate/content';
      let body: any = { ...formData };

      if (formData.truthBombMode) {
        endpoint = '/api/generate/truth-bomb';
        body = {
          topic: formData.product,
          audience: formData.audience,
          platform: formData.platform,
        };
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      
      if (data.success) {
        let content = formData.truthBombMode ? data.truthBomb : data.content;

        // Apply humanize if enabled
        if (formData.humanMode && content.caption) {
          const humanizeRes = await fetch('/api/generate/humanize', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: content.caption }),
          });
          const humanizeData = await humanizeRes.json();
          if (humanizeData.success) {
            content.caption = humanizeData.humanizedContent;
          }
        }

        setResult(content);
      }
    } catch (error) {
      console.error('Failed to generate content:', error);
    } finally {
      setGenerating(false);
    }
  };

  const generateHooks = async () => {
    try {
      const response = await fetch('/api/generate/hooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: formData.product,
          platform: formData.platform,
          audience: formData.audience,
          hookType: 'CURIOSITY',
          count: 5,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setResult({ ...result, hooks: data.hooks });
        setActiveTab('hooks');
      }
    } catch (error) {
      console.error('Failed to generate hooks:', error);
    }
  };

  const generateCTA = async () => {
    try {
      const response = await fetch('/api/generate/cta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goal: formData.goal,
          platform: formData.platform,
          offer: formData.product,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setResult({ ...result, ctas: data.ctas });
        setActiveTab('cta');
      }
    } catch (error) {
      console.error('Failed to generate CTAs:', error);
    }
  };

  const generateHashtags = async () => {
    try {
      const response = await fetch('/api/generate/hashtags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: formData.product,
          platform: formData.platform,
          niche: formData.audience,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setResult({ ...result, hashtags: data.hashtags, hashtagStrategy: data.strategy });
        setActiveTab('hashtags');
      }
    } catch (error) {
      console.error('Failed to generate hashtags:', error);
    }
  };

  const generateCaptions = async () => {
    try {
      const response = await fetch('/api/generate/caption', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: formData.product,
          platform: formData.platform,
          tone: formData.tone,
          length: 'medium',
        }),
      });

      const data = await response.json();
      if (data.success) {
        setResult({ ...result, captions: data.captions });
        setActiveTab('caption');
      }
    } catch (error) {
      console.error('Failed to generate captions:', error);
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">🚀 AI Content Writer Pro</h1>
        <p className="text-slate-600">
          Complete content generation with Brand Memory, Frameworks, and Human Writing
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle>Content Settings</CardTitle>
            <CardDescription>Configure your content</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Brand Selection */}
            <div>
              <label className="text-sm font-medium">🧠 Brand Memory</label>
              <select
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formData.brandId}
                onChange={(e) => setFormData({ ...formData, brandId: e.target.value })}
              >
                <option value="">No brand (generic)</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Framework */}
            <div>
              <label className="text-sm font-medium">Framework</label>
              <select
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formData.framework}
                onChange={(e) => setFormData({ ...formData, framework: e.target.value })}
              >
                {Object.entries(COPYWRITING_FRAMEWORKS).map(([key, framework]) => (
                  <option key={key} value={key}>
                    {framework.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Product/Topic */}
            <div>
              <label className="text-sm font-medium">Product/Topic *</label>
              <Input
                placeholder="What are you promoting?"
                value={formData.product}
                onChange={(e) => setFormData({ ...formData, product: e.target.value })}
              />
            </div>

            {/* Platform */}
            <div>
              <label className="text-sm font-medium">Platform</label>
              <select
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formData.platform}
                onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
              >
                {CONTENT_PLATFORMS.map((platform) => (
                  <option key={platform.value} value={platform.value}>
                    {platform.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Goal */}
            <div>
              <label className="text-sm font-medium">Goal</label>
              <select
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formData.goal}
                onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
              >
                {CONTENT_GOALS.map((goal) => (
                  <option key={goal.value} value={goal.value}>
                    {goal.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Tone */}
            <div>
              <label className="text-sm font-medium">Tone</label>
              <select
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formData.tone}
                onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
              >
                {CONTENT_TONES.map((tone) => (
                  <option key={tone.value} value={tone.value}>
                    {tone.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Audience */}
            <div>
              <label className="text-sm font-medium">Target Audience *</label>
              <Input
                placeholder="Who is this for?"
                value={formData.audience}
                onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
              />
            </div>

            {/* Advanced Options */}
            <div className="space-y-2 pt-4 border-t">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.humanMode}
                  onChange={(e) => setFormData({ ...formData, humanMode: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-sm">✨ Human Writing Mode (Bypass AI Detection)</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.truthBombMode}
                  onChange={(e) => setFormData({ ...formData, truthBombMode: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-sm">💣 Truth Bomb Mode (Brutally Honest)</span>
              </label>
            </div>

            {/* Generate Button */}
            <Button
              onClick={handleGenerate}
              disabled={generating || !formData.product || !formData.audience}
              className="w-full"
              size="lg"
            >
              {generating ? 'Generating...' : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generate Content
                </>
              )}
            </Button>

            {/* Quick Actions */}
            {result && (
              <div className="space-y-2 pt-4 border-t">
                <p className="text-sm font-medium mb-2">Quick Generate:</p>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={generateHooks}
                  >
                    <Zap className="mr-2 h-4 w-4" />
                    Hooks
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={generateCTA}
                  >
                    <Target className="mr-2 h-4 w-4" />
                    CTAs
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={generateHashtags}
                  >
                    <Hash className="mr-2 h-4 w-4" />
                    Hashtags
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={generateCaptions}
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Captions
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results */}
        <div className="lg:col-span-2 space-y-4">
          {result && (
            <>
              {/* Tabs */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex gap-2 overflow-x-auto">
                    <Button
                      variant={activeTab === 'content' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setActiveTab('content')}
                    >
                      Content
                    </Button>
                    {result.hooks && (
                      <Button
                        variant={activeTab === 'hooks' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setActiveTab('hooks')}
                      >
                        Hooks ({result.hooks.length})
                      </Button>
                    )}
                    {result.ctas && (
                      <Button
                        variant={activeTab === 'cta' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setActiveTab('cta')}
                      >
                        CTAs ({result.ctas.length})
                      </Button>
                    )}
                    {result.hashtags && (
                      <Button
                        variant={activeTab === 'hashtags' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setActiveTab('hashtags')}
                      >
                        Hashtags
                      </Button>
                    )}
                    {result.captions && (
                      <Button
                        variant={activeTab === 'caption' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setActiveTab('caption')}
                      >
                        Captions ({result.captions.length})
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Content Tab */}
              {activeTab === 'content' && (
                <>
                  <ResultCard
                    title="Hook"
                    content={result.hook}
                    onCopy={() => copyToClipboard(result.hook, 'hook')}
                    copied={copied === 'hook'}
                  />
                  <ResultCard
                    title="Body"
                    content={result.body}
                    onCopy={() => copyToClipboard(result.body, 'body')}
                    copied={copied === 'body'}
                  />
                  <ResultCard
                    title="CTA"
                    content={result.cta}
                    onCopy={() => copyToClipboard(result.cta, 'cta')}
                    copied={copied === 'cta'}
                  />
                  <ResultCard
                    title="Full Caption"
                    content={result.caption}
                    onCopy={() => copyToClipboard(result.caption, 'caption')}
                    copied={copied === 'caption'}
                  />
                  {result.impactScore && (
                    <Card>
                      <CardContent className="p-6">
                        <div className="text-sm font-medium mb-2">Impact Score</div>
                        <div className="text-3xl font-bold text-purple-600">
                          {result.impactScore}/100
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </>
              )}

              {/* Hooks Tab */}
              {activeTab === 'hooks' && result.hooks && (
                <div className="space-y-3">
                  {result.hooks.map((hook: any, index: number) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1">
                            <p className="font-medium mb-2">{hook.text}</p>
                            {hook.explanation && (
                              <p className="text-sm text-slate-600">{hook.explanation}</p>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => copyToClipboard(hook.text, `hook-${index}`)}
                          >
                            {copied === `hook-${index}` ? (
                              <Check className="h-4 w-4 text-green-600" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* CTAs Tab */}
              {activeTab === 'cta' && result.ctas && (
                <div className="space-y-3">
                  {result.ctas.map((cta: any, index: number) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1">
                            <p className="font-medium mb-1">{cta.text}</p>
                            <div className="flex gap-2 text-xs">
                              <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded">
                                {cta.type}
                              </span>
                              <span className="px-2 py-1 bg-green-100 text-green-700 rounded">
                                {cta.effectiveness}% effective
                              </span>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => copyToClipboard(cta.text, `cta-${index}`)}
                          >
                            {copied === `cta-${index}` ? (
                              <Check className="h-4 w-4 text-green-600" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Hashtags Tab */}
              {activeTab === 'hashtags' && result.hashtags && (
                <div className="space-y-4">
                  {result.hashtagStrategy && (
                    <Card>
                      <CardContent className="p-4">
                        <p className="text-sm font-medium mb-2">Strategy:</p>
                        <p className="text-sm text-slate-600">{result.hashtagStrategy}</p>
                      </CardContent>
                    </Card>
                  )}
                  {Object.entries(result.hashtags).map(([category, tags]: [string, any]) => (
                    <Card key={category}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1">
                            <p className="text-sm font-medium mb-2 capitalize">{category}:</p>
                            <p className="text-sm">{Array.isArray(tags) ? tags.join(' ') : tags}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => copyToClipboard(
                              Array.isArray(tags) ? tags.join(' ') : tags,
                              `hashtag-${category}`
                            )}
                          >
                            {copied === `hashtag-${category}` ? (
                              <Check className="h-4 w-4 text-green-600" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Captions Tab */}
              {activeTab === 'caption' && result.captions && (
                <div className="space-y-3">
                  {result.captions.map((caption: any, index: number) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1">
                            <div className="flex gap-2 mb-2">
                              <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded">
                                {caption.approach}
                              </span>
                              <span className="text-xs px-2 py-1 bg-slate-100 text-slate-700 rounded">
                                {caption.wordCount} words
                              </span>
                            </div>
                            <p className="text-sm whitespace-pre-wrap">{caption.text}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => copyToClipboard(caption.text, `caption-${index}`)}
                          >
                            {copied === `caption-${index}` ? (
                              <Check className="h-4 w-4 text-green-600" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}

          {!result && !generating && (
            <Card>
              <CardContent className="p-12 text-center text-slate-400">
                <Sparkles className="h-16 w-16 mx-auto mb-4" />
                <p>Your AI-generated content will appear here</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function ResultCard({
  title,
  content,
  onCopy,
  copied,
}: {
  title: string;
  content: string;
  onCopy: () => void;
  copied: boolean;
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onCopy} className="h-8">
            {copied ? (
              <Check className="h-4 w-4 text-green-600" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm whitespace-pre-wrap">{content}</p>
      </CardContent>
    </Card>
  );
}
