'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, FileText, Sparkles, ArrowRight, Clock } from 'lucide-react';

interface ScriptPanelProps {
  script: string;
  setScript: (script: string) => void;
  scenes: any[];
  setScenes: (scenes: any[]) => void;
  onNext: () => void;
}

export function ScriptPanel({ script, setScript, scenes, setScenes, onNext }: ScriptPanelProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSplitScenes = async () => {
    if (!script.trim()) {
      setError('Please enter a script first');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/ai-studio/split-scenes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ script }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to split scenes');
      }

      setScenes(data.scenes);
    } catch (err: any) {
      setError(err.message || 'Failed to split scenes');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateScript = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: 'Generate a 30-second video script about AI tools for content creators. Make it engaging and conversational.',
          type: 'script',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate script');
      }

      setScript(data.result);
    } catch (err: any) {
      setError(err.message || 'Failed to generate script');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-2">Step 1: Script Input</h2>
        <p className="text-muted-foreground">
          Paste your video script or generate one with AI. We'll split it into logical scenes.
        </p>
      </div>

      {/* Script Input */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Your Script</label>
          <Button
            variant="outline"
            size="sm"
            onClick={handleGenerateScript}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Sample
              </>
            )}
          </Button>
        </div>

        <Textarea
          value={script}
          onChange={(e) => setScript(e.target.value)}
          placeholder="Paste your video script here...

Example:
Hey everyone! Today I'm going to show you the most powerful AI tool for content creators. This tool can save you hours of work every single day. Let me show you how it works..."
          rows={12}
          className="font-mono text-sm"
        />

        {script && (
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              {script.split(' ').length} words
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              ~{Math.ceil(script.split(' ').length / 2)} seconds
            </span>
          </div>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Action Button */}
      <div className="flex gap-3">
        <Button
          onClick={handleSplitScenes}
          disabled={loading || !script.trim()}
          size="lg"
          className="flex-1"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Analyzing Script...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-5 w-5" />
              Split into Scenes
            </>
          )}
        </Button>

        {scenes.length > 0 && (
          <Button onClick={onNext} size="lg" variant="secondary">
            Next: Visual Director
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Scene Preview */}
      {scenes.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Scenes Detected</h3>
            <Badge variant="secondary" className="bg-purple-100 text-purple-700">
              {scenes.length} scenes
            </Badge>
          </div>

          <div className="grid gap-3">
            {scenes.map((scene, index) => (
              <Card key={index} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <Badge variant="outline" className="font-mono">
                      Scene {scene.scene}
                    </Badge>
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {scene.time}s
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {scene.duration}s duration
                      </span>
                    </div>
                    <p className="text-sm">{scene.text}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
