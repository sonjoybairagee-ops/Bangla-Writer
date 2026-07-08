'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Calendar, Download, Copy, Check } from 'lucide-react';

export default function ContentPlannerPage() {
  const [brands, setBrands] = useState<any[]>([]);
  const [contentPlans, setContentPlans] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    industry: '',
    goal: 'engagement',
    platform: ['instagram'],
    duration: 30,
    contentStyle: ['educational'],
    tone: 'friendly',
    audience: '',
    brandId: '',
    language: 'bangla',
  });
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [copiedDay, setCopiedDay] = useState<number | null>(null);

  useEffect(() => {
    fetchBrands();
    fetchContentPlans();
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

  const fetchContentPlans = async () => {
    try {
      const response = await fetch('/api/content-plans');
      const data = await response.json();
      setContentPlans(data.contentPlans);
    } catch (error) {
      console.error('Failed to fetch content plans:', error);
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setResult(null);

    try {
      const response = await fetch('/api/generate/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        setResult(data.plan);
        fetchContentPlans();
      } else {
        alert(data.error || 'Failed to generate content plan');
      }
    } catch (error) {
      console.error('Failed to generate plan:', error);
    } finally {
      setGenerating(false);
    }
  };

  const copyDayContent = (day: any, index: number) => {
    const text = `
Day ${day.day} - ${day.platform} (${day.contentType})
Topic: ${day.topic}

Idea: ${day.idea}
${day.hook ? `Hook: ${day.hook}\n` : ''}${day.cta ? `CTA: ${day.cta}\n` : ''}
    `.trim();
    navigator.clipboard.writeText(text);
    setCopiedDay(index);
    setTimeout(() => setCopiedDay(null), 2000);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Content Planner</h1>
        <p className="text-slate-600">
          Generate 30-day content strategies with AI
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle>Plan Settings</CardTitle>
            <CardDescription>
              Configure your content strategy
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Plan Name *</label>
              <Input
                placeholder="e.g., Q1 2026 Strategy"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium">Brand (Optional)</label>
              <select
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formData.brandId}
                onChange={(e) => {
                  const brandId = e.target.value;
                  const selectedBrand = brands.find((b) => b.id === brandId);
                  setFormData({
                    ...formData,
                    brandId,
                    brand: selectedBrand?.name || formData.brand,
                    industry: selectedBrand?.industry || formData.industry,
                  });
                }}
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
              <label className="text-sm font-medium">Brand Name *</label>
              <Input
                placeholder="Your brand name"
                value={formData.brand}
                onChange={(e) =>
                  setFormData({ ...formData, brand: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium">Industry *</label>
              <Input
                placeholder="e.g., Fashion, Tech, Fitness"
                value={formData.industry}
                onChange={(e) =>
                  setFormData({ ...formData, industry: e.target.value })
                }
              />
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
                <option value="sales">Sales</option>
                <option value="leads">Leads</option>
                <option value="awareness">Awareness</option>
                <option value="engagement">Engagement</option>
                <option value="education">Education</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Duration (days)</label>
              <Input
                type="number"
                min="7"
                max="90"
                value={formData.duration}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    duration: parseInt(e.target.value),
                  })
                }
              />
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

            {/* Language */}
            <div>
              <label className="text-sm font-medium">Language Output</label>
              <div className="grid grid-cols-3 gap-2 mt-1">
                <Button
                  type="button"
                  variant={formData.language === 'bangla' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFormData({ ...formData, language: 'bangla' })}
                  className={formData.language === 'bangla' ? 'bg-purple-600 hover:bg-purple-700' : ''}
                >
                  বাংলা
                </Button>
                <Button
                  type="button"
                  variant={formData.language === 'english' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFormData({ ...formData, language: 'english' })}
                  className={formData.language === 'english' ? 'bg-purple-600 hover:bg-purple-700' : ''}
                >
                  English
                </Button>
                <Button
                  type="button"
                  variant={formData.language === 'banglish' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFormData({ ...formData, language: 'banglish' })}
                  className={formData.language === 'banglish' ? 'bg-purple-600 hover:bg-purple-700' : ''}
                >
                  বাংলিশ
                </Button>
              </div>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={
                generating ||
                !formData.name ||
                !formData.brand ||
                !formData.industry ||
                !formData.audience
              }
              className="w-full"
              size="lg"
            >
              {generating ? (
                <>Generating...</>
              ) : (
                <>
                  <Calendar className="mr-2 h-5 w-5" />
                  Generate Plan
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="lg:col-span-2 space-y-4">
          {result && result.plan && (
            <>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Content Calendar</CardTitle>
                      <CardDescription>
                        {result.plan.length} posts planned
                      </CardDescription>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Export
                    </Button>
                  </div>
                </CardHeader>
              </Card>

              {result.strategy && (
                <Card>
                  <CardHeader>
                    <CardTitle>Strategy Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{result.strategy}</p>
                  </CardContent>
                </Card>
              )}

              {result.keyThemes && result.keyThemes.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Content Pillars</CardTitle>
                    <CardDescription>
                      Core themes for your content strategy
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {result.keyThemes.map((theme: string, index: number) => (
                        <div
                          key={index}
                          className="p-4 border-2 border-purple-200 bg-purple-50 rounded-lg text-center"
                        >
                          <div className="text-2xl mb-2">
                            {['🎯', '💡', '🚀', '✨', '🔥'][index % 5]}
                          </div>
                          <p className="font-medium text-purple-900">{theme}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {result.metrics && (
                <Card>
                  <CardHeader>
                    <CardTitle>Content Mix Strategy</CardTitle>
                    <CardDescription>
                      Balanced content distribution
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {result.metrics.contentMix && (
                        <div className="space-y-2">
                          {Object.entries(result.metrics.contentMix).map(([type, percentage]) => (
                            <div key={type}>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="capitalize">{type}</span>
                                <span className="font-medium">{percentage}%</span>
                              </div>
                              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                  className={`h-full ${
                                    type === 'educational'
                                      ? 'bg-blue-500'
                                      : type === 'entertaining'
                                      ? 'bg-purple-500'
                                      : 'bg-green-500'
                                  }`}
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="pt-4 border-t space-y-2">
                        <p className="text-sm text-slate-600">
                          📊 Expected Posts: <span className="font-medium">{result.metrics.expectedPosts || result.plan.length}</span>
                        </p>
                        {result.metrics.averageViralScore && (
                          <p className="text-sm text-slate-600">
                            🔥 Avg Viral Score: <span className="font-medium">{result.metrics.averageViralScore}/100</span>
                          </p>
                        )}
                        {result.metrics.highReachPosts && (
                          <div className="text-xs text-slate-500">
                            High Reach: {result.metrics.highReachPosts} • Medium: {result.metrics.mediumReachPosts} • Low: {result.metrics.lowReachPosts}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {result.platformStrategy && (
                <Card>
                  <CardHeader>
                    <CardTitle>Platform Strategy</CardTitle>
                    <CardDescription>
                      Optimized approach for each platform
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(result.platformStrategy).map(([platform, strategy]) => (
                        <div key={platform} className="p-3 bg-slate-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-semibold capitalize">{platform}</span>
                            <span className="text-xs px-2 py-0.5 bg-white rounded">
                              {result.plan.filter((p: any) => p.platform.toLowerCase() === platform.toLowerCase()).length} posts
                            </span>
                          </div>
                          <p className="text-sm text-slate-600">{strategy}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {result.contentPillars && result.contentPillars.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Detailed Content Pillars</CardTitle>
                    <CardDescription>
                      Strategic framework for consistent content
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {result.contentPillars.map((pillar: any, index: number) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold">{pillar.name}</h4>
                            <span className="text-sm font-medium text-purple-600">{pillar.percentage}%</span>
                          </div>
                          <p className="text-sm text-slate-600 mb-3">{pillar.description}</p>
                          <div className="flex flex-wrap gap-2">
                            {pillar.examples && pillar.examples.map((example: string, i: number) => (
                              <span key={i} className="text-xs px-2 py-1 bg-purple-50 text-purple-700 rounded">
                                {example}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="space-y-3">
                {result.plan.map((day: any, index: number) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-16 text-center">
                          <div className="text-2xl font-bold text-purple-600">
                            {day.day}
                          </div>
                          <div className="text-xs text-slate-500">
                            Day
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium px-2 py-1 bg-purple-100 text-purple-700 rounded">
                              {day.contentType}
                            </span>
                            <span className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-700 rounded">
                              {day.platform}
                            </span>
                            {day.viralScore && (
                              <span className={`text-xs font-medium px-2 py-1 rounded flex items-center gap-1 ${
                                day.viralScore >= 80
                                  ? 'bg-green-100 text-green-700'
                                  : day.viralScore >= 60
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-orange-100 text-orange-700'
                              }`}>
                                🔥 {day.viralScore}/100
                              </span>
                            )}
                            {day.estimatedReach && (
                              <span className={`text-xs font-medium px-2 py-1 rounded ${
                                day.estimatedReach === 'high'
                                  ? 'bg-green-100 text-green-700'
                                  : day.estimatedReach === 'medium'
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-slate-100 text-slate-700'
                              }`}>
                                📊 {day.estimatedReach} reach
                              </span>
                            )}
                          </div>
                          <h4 className="font-medium mb-1">{day.topic}</h4>
                          <p className="text-sm text-slate-600 mb-2">
                            {day.idea}
                          </p>
                          {day.hook && (
                            <p className="text-sm text-purple-600 mb-1">
                              💡 Hook: {day.hook}
                            </p>
                          )}
                          {day.cta && (
                            <p className="text-sm text-green-600">
                              ✨ CTA: {day.cta}
                            </p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="flex-shrink-0"
                          onClick={() => copyDayContent(day, index)}
                        >
                          {copiedDay === index ? (
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
            </>
          )}

          {!result && !generating && contentPlans.length > 0 && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Your Content Plans</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {contentPlans.map((plan) => (
                    <div
                      key={plan.id}
                      className="p-4 border rounded-lg hover:bg-slate-50 cursor-pointer"
                    >
                      <h4 className="font-medium">{plan.name}</h4>
                      <p className="text-sm text-slate-600">
                        {plan.duration} days • {plan.goal}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </>
          )}

          {!result && !generating && contentPlans.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center text-slate-400">
                <Calendar className="h-16 w-16 mx-auto mb-4" />
                <p>Your content plan will appear here</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
