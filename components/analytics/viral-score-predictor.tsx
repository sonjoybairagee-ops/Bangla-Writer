'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Zap,
  TrendingUp,
  Eye,
  Heart,
  Share2,
  Target,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  Clock,
} from 'lucide-react';

export function ViralScorePredictor() {
  const [content, setContent] = useState('');
  const [platform, setPlatform] = useState<'instagram' | 'tiktok' | 'facebook' | 'linkedin'>('instagram');
  const [contentType, setContentType] = useState<'reel' | 'post' | 'story' | 'carousel'>('reel');
  const [predicting, setPredicting] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handlePredict = async () => {
    if (!content.trim()) {
      alert('Please enter content to analyze');
      return;
    }

    setPredicting(true);
    try {
      const response = await fetch('/api/analytics/predict-viral-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          platform,
          contentType,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setResult(data.prediction);
      } else {
        alert(data.error || 'Failed to predict viral score');
      }
    } catch (error) {
      console.error('Failed to predict:', error);
      alert('Failed to predict viral score');
    } finally {
      setPredicting(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'from-green-500 to-emerald-600';
    if (score >= 60) return 'from-yellow-500 to-orange-600';
    if (score >= 40) return 'from-orange-500 to-red-600';
    return 'from-red-500 to-red-700';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return { label: 'High Viral Potential', icon: CheckCircle, color: 'text-green-600' };
    if (score >= 60) return { label: 'Good Potential', icon: TrendingUp, color: 'text-yellow-600' };
    if (score >= 40) return { label: 'Moderate Potential', icon: Target, color: 'text-orange-600' };
    return { label: 'Low Potential', icon: AlertTriangle, color: 'text-red-600' };
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-orange-600" />
          Viral Score Predictor
        </CardTitle>
        <CardDescription>
          AI predicts your content's viral potential before you post (0-100 score)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!result ? (
          <>
            {/* Content Input */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Content to Analyze
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Paste your caption, hook, or content here..."
                className="w-full min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                disabled={predicting}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Minimum 20 characters for accurate prediction
              </p>
            </div>

            {/* Platform & Type Selection */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Platform</label>
                <div className="grid grid-cols-2 gap-2">
                  {['instagram', 'tiktok', 'facebook', 'linkedin'].map((p) => (
                    <Button
                      key={p}
                      variant={platform === p ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setPlatform(p as any)}
                      disabled={predicting}
                      className="capitalize"
                    >
                      {p}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Content Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {['reel', 'post', 'story', 'carousel'].map((t) => (
                    <Button
                      key={t}
                      variant={contentType === t ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setContentType(t as any)}
                      disabled={predicting}
                      className="capitalize"
                    >
                      {t}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Predict Button */}
            <Button
              onClick={handlePredict}
              disabled={predicting || content.length < 20}
              className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white"
            >
              {predicting ? (
                <>
                  <Clock className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing with AI...
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  Predict Viral Score
                </>
              )}
            </Button>
          </>
        ) : (
          <>
            {/* Results */}
            <div className="space-y-6">
              {/* Score Display */}
              <div className="text-center">
                <div
                  className={`inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br ${getScoreColor(
                    result.viralScore
                  )} text-white shadow-lg mb-4`}
                >
                  <div>
                    <div className="text-4xl font-bold">{result.viralScore}</div>
                    <div className="text-xs opacity-90">out of 100</div>
                  </div>
                </div>
                
                {(() => {
                  const scoreInfo = getScoreLabel(result.viralScore);
                  const Icon = scoreInfo.icon;
                  return (
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Icon className={`h-5 w-5 ${scoreInfo.color}`} />
                      <h3 className={`text-xl font-bold ${scoreInfo.color}`}>
                        {scoreInfo.label}
                      </h3>
                    </div>
                  );
                })()}
                
                <p className="text-sm text-muted-foreground">
                  Based on {platform} {contentType} analysis
                </p>
              </div>

              {/* Breakdown */}
              <div className="space-y-3">
                <h4 className="font-semibold text-sm flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Score Breakdown
                </h4>
                <div className="space-y-2">
                  {[
                    { label: 'Hook Strength', score: result.hookScore, icon: Zap },
                    { label: 'Emotional Appeal', score: result.emotionalScore, icon: Heart },
                    { label: 'Shareability', score: result.shareabilityScore, icon: Share2 },
                    { label: 'Engagement Potential', score: result.engagementScore, icon: Eye },
                  ].map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <div key={i} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-2">
                            <Icon className="h-3 w-3 text-muted-foreground" />
                            {item.label}
                          </span>
                          <span className="font-semibold">{item.score}%</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-purple-600 to-blue-600"
                            style={{ width: `${item.score}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Predicted Performance */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-blue-50 rounded-lg text-center">
                  <Eye className="h-5 w-5 mx-auto mb-1 text-blue-600" />
                  <div className="text-lg font-bold">{result.predictedViews}</div>
                  <div className="text-xs text-muted-foreground">Est. Views</div>
                </div>
                <div className="p-3 bg-red-50 rounded-lg text-center">
                  <Heart className="h-5 w-5 mx-auto mb-1 text-red-600" />
                  <div className="text-lg font-bold">{result.predictedEngagement}%</div>
                  <div className="text-xs text-muted-foreground">Est. Engagement</div>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg text-center">
                  <Share2 className="h-5 w-5 mx-auto mb-1 text-purple-600" />
                  <div className="text-lg font-bold">{result.predictedShares}</div>
                  <div className="text-xs text-muted-foreground">Est. Shares</div>
                </div>
              </div>

              {/* Strengths */}
              {result.strengths && result.strengths.length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm flex items-center gap-2 mb-2 text-green-700">
                    <CheckCircle className="h-4 w-4" />
                    What's Working
                  </h4>
                  <ul className="space-y-1">
                    {result.strengths.map((strength: string, i: number) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Improvements */}
              {result.improvements && result.improvements.length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm flex items-center gap-2 mb-2 text-orange-700">
                    <Lightbulb className="h-4 w-4" />
                    How to Improve
                  </h4>
                  <ul className="space-y-1">
                    {result.improvements.map((improvement: string, i: number) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <Lightbulb className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                        <span>{improvement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Best Time to Post */}
              {result.bestTimeToPost && (
                <div className="p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-semibold">Best Time to Post</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{result.bestTimeToPost}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setResult(null)}
                  className="flex-1"
                >
                  Analyze Another
                </Button>
                <Button className="flex-1">
                  Use This Content
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
