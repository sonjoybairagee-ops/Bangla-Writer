'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { HOOK_TYPES, CONTENT_PLATFORMS } from '@/lib/constants/frameworks';
import { Zap, Copy, Check } from 'lucide-react';

export default function HooksPage() {
  const [formData, setFormData] = useState({
    topic: '',
    platform: 'instagram',
    audience: '',
    hookType: 'CURIOSITY',
    count: 10,
  });
  const [generating, setGenerating] = useState(false);
  const [hooks, setHooks] = useState<any[]>([]);
  const [copied, setCopied] = useState<number | null>(null);

  const handleGenerate = async () => {
    setGenerating(true);
    setHooks([]);

    try {
      const response = await fetch('/api/generate/hooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        setHooks(data.hooks);
      }
    } catch (error) {
      console.error('Failed to generate hooks:', error);
    } finally {
      setGenerating(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopied(index);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Hook Generator</h1>
        <p className="text-slate-600">
          Generate scroll-stopping hooks using psychological triggers
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle>Hook Settings</CardTitle>
            <CardDescription>
              Configure hook parameters
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Topic *</label>
              <Input
                placeholder="What's your content about?"
                value={formData.topic}
                onChange={(e) =>
                  setFormData({ ...formData, topic: e.target.value })
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
              <label className="text-sm font-medium">Hook Type</label>
              <select
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formData.hookType}
                onChange={(e) =>
                  setFormData({ ...formData, hookType: e.target.value })
                }
              >
                {Object.entries(HOOK_TYPES).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Number of Hooks</label>
              <Input
                type="number"
                min="5"
                max="20"
                value={formData.count}
                onChange={(e) =>
                  setFormData({ ...formData, count: parseInt(e.target.value) })
                }
              />
            </div>

            <Button
              onClick={handleGenerate}
              disabled={generating || !formData.topic || !formData.audience}
              className="w-full"
              size="lg"
            >
              {generating ? (
                <>Generating...</>
              ) : (
                <>
                  <Zap className="mr-2 h-5 w-5" />
                  Generate Hooks
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="lg:col-span-2 space-y-4">
          {hooks.length > 0 ? (
            hooks.map((hook, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-lg font-medium mb-2">{hook.text}</p>
                      {hook.explanation && (
                        <p className="text-sm text-slate-600 mb-2">
                          {hook.explanation}
                        </p>
                      )}
                      {hook.visualSuggestion && (
                        <p className="text-sm text-purple-600">
                          💡 Visual: {hook.visualSuggestion}
                        </p>
                      )}
                      {hook.viralPotential && (
                        <div className="mt-2">
                          <span className="text-xs font-medium text-slate-500">
                            Viral Potential: {hook.viralPotential}/10
                          </span>
                          <div className="mt-1 h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-purple-600 to-pink-600"
                              style={{ width: `${hook.viralPotential * 10}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyToClipboard(hook.text, index)}
                    >
                      {copied === index ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : !generating ? (
            <Card>
              <CardContent className="p-12 text-center text-slate-400">
                <Zap className="h-16 w-16 mx-auto mb-4" />
                <p>Your generated hooks will appear here</p>
              </CardContent>
            </Card>
          ) : null}
        </div>
      </div>
    </div>
  );
}
