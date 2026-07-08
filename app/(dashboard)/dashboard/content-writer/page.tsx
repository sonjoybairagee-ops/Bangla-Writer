'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { COPYWRITING_FRAMEWORKS, CONTENT_PLATFORMS, CONTENT_GOALS, CONTENT_TONES } from '@/lib/constants/frameworks';
import { Sparkles, Copy, Check } from 'lucide-react';

export default function ContentWriterPage() {
  const [brands, setBrands] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    framework: 'AIDA',
    product: '',
    platform: 'instagram',
    goal: 'engagement',
    tone: 'friendly',
    audience: '',
    duration: 30,
    brandId: '',
  });
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [copied, setCopied] = useState<string | null>(null);

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
      const response = await fetch('/api/generate/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        setResult(data.content);
      }
    } catch (error) {
      console.error('Failed to generate content:', error);
    } finally {
      setGenerating(false);
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
        <h1 className="text-3xl font-bold mb-2">AI Content Writer</h1>
        <p className="text-slate-600">
          Generate engaging content using proven copywriting frameworks
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle>Content Settings</CardTitle>
            <CardDescription>
              Configure your content parameters
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Framework</label>
              <select
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formData.framework}
                onChange={(e) =>
                  setFormData({ ...formData, framework: e.target.value })
                }
              >
                {Object.entries(COPYWRITING_FRAMEWORKS).map(([key, framework]) => (
                  <option key={key} value={key}>
                    {framework.name} - {framework.description}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Brand (Optional)</label>
              <select
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formData.brandId}
                onChange={(e) =>
                  setFormData({ ...formData, brandId: e.target.value })
                }
              >
                <option value="">No brand selected</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Product/Topic *</label>
              <Input
                placeholder="What are you promoting or talking about?"
                value={formData.product}
                onChange={(e) =>
                  setFormData({ ...formData, product: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium">Platform</label>
              <select
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formData.platform}
                onChange={(e) =>
                  setFormData({ ...formData, platform: e.target.value })
                }
              >
                {CONTENT_PLATFORMS.map((platform) => (
                  <option key={platform.value} value={platform.value}>
                    {platform.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Goal</label>
              <select
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formData.goal}
                onChange={(e) =>
                  setFormData({ ...formData, goal: e.target.value })
                }
              >
                {CONTENT_GOALS.map((goal) => (
                  <option key={goal.value} value={goal.value}>
                    {goal.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Tone</label>
              <select
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formData.tone}
                onChange={(e) =>
                  setFormData({ ...formData, tone: e.target.value })
                }
              >
                {CONTENT_TONES.map((tone) => (
                  <option key={tone.value} value={tone.value}>
                    {tone.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Target Audience *</label>
              <Input
                placeholder="Who is this for?"
                value={formData.audience}
                onChange={(e) =>
                  setFormData({ ...formData, audience: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium">Duration (seconds)</label>
              <Input
                type="number"
                value={formData.duration}
                onChange={(e) =>
                  setFormData({ ...formData, duration: parseInt(e.target.value) })
                }
              />
            </div>

            <Button
              onClick={handleGenerate}
              disabled={generating || !formData.product || !formData.audience}
              className="w-full"
              size="lg"
            >
              {generating ? (
                <>Generating...</>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generate Content
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="space-y-4">
          {result && (
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
                title="Call to Action"
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
              {result.hashtags && result.hashtags.length > 0 && (
                <ResultCard
                  title="Hashtags"
                  content={result.hashtags.join(' ')}
                  onCopy={() =>
                    copyToClipboard(result.hashtags.join(' '), 'hashtags')
                  }
                  copied={copied === 'hashtags'}
                />
              )}
              {result.viralScore && (
                <Card>
                  <CardContent className="p-6">
                    <div className="text-sm font-medium mb-2">Viral Score</div>
                    <div className="text-3xl font-bold text-purple-600">
                      {result.viralScore}/100
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}

          {!result && !generating && (
            <Card>
              <CardContent className="p-12 text-center text-slate-400">
                <Sparkles className="h-16 w-16 mx-auto mb-4" />
                <p>Your generated content will appear here</p>
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
          <Button
            variant="ghost"
            size="sm"
            onClick={onCopy}
            className="h-8"
          >
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
