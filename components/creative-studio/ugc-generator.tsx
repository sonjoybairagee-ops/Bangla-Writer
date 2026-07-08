'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Video, Zap, User, Copy } from 'lucide-react';

interface UGCScript {
  type: string;
  title: string;
  hook: string;
  script: string;
  talkingPoints: string[];
  props: string[];
  setting: string;
  duration: string;
  authenticityScore: number;
}

export function UGCGenerator() {
  const [formData, setFormData] = useState({
    product: '',
    benefit: '',
    targetAudience: '',
    ugcType: 'testimonial',
    language: 'bangla',
  });
  const [generating, setGenerating] = useState(false);
  const [results, setResults] = useState<UGCScript[]>([]);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const response = await fetch('/api/generate/ugc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        setResults(data.ugcScripts);
      }
    } catch (error) {
      console.error('Failed:', error);
    } finally {
      setGenerating(false);
    }
  };

  const copyToClipboard = (script: UGCScript) => {
    const text = `
UGC Script: ${script.title}
Type: ${script.type}
Authenticity Score: ${script.authenticityScore}/100

--- HOOK ---
${script.hook}

--- SCRIPT ---
${script.script}

--- TALKING POINTS ---
${script.talkingPoints.map(point => '• ' + point).join('\n')}

--- DETAILS ---
Props: ${script.props.join(', ')}
Setting: ${script.setting}
Duration: ${script.duration}
    `.trim();
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div>
        <Card>
          <CardHeader>
            <CardTitle>UGC Script Generator</CardTitle>
            <CardDescription>User-generated content scripts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Product *</label>
              <Input
                value={formData.product}
                onChange={(e) => setFormData({ ...formData, product: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Main Benefit *</label>
              <Input
                value={formData.benefit}
                onChange={(e) => setFormData({ ...formData, benefit: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Target Audience *</label>
              <Input
                value={formData.targetAudience}
                onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">UGC Type</label>
              <select
                className="w-full h-10 rounded-md border px-3"
                value={formData.ugcType}
                onChange={(e) => setFormData({ ...formData, ugcType: e.target.value })}
              >
                <option value="testimonial">Testimonial</option>
                <option value="unboxing">Unboxing</option>
                <option value="review">Product Review</option>
                <option value="beforeafter">Before/After</option>
                <option value="tutorial">How-To Tutorial</option>
              </select>
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
              {generating ? 'Generating...' : 'Generate UGC Scripts'}
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-2 space-y-4">
        {results.map((script, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{script.title}</CardTitle>
                  <Badge className="mt-2">{script.type}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    <User className="h-3 w-3 mr-1" />
                    {script.authenticityScore}/100 Authentic
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(script)}
                    title="Copy to clipboard"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 p-3 rounded">
                <span className="text-xs font-medium">HOOK:</span>
                <p className="text-sm mt-1">{script.hook}</p>
              </div>
              <div className="bg-green-50 p-3 rounded">
                <span className="text-xs font-medium">SCRIPT:</span>
                <p className="text-sm mt-1 whitespace-pre-line">{script.script}</p>
              </div>
              <div>
                <span className="text-sm font-medium">Talking Points:</span>
                <ul className="mt-1 space-y-1">
                  {script.talkingPoints.map((point, j) => (
                    <li key={j} className="text-sm flex gap-2">
                      <span>•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex gap-4 text-sm">
                <div><strong>Props:</strong> {script.props.join(', ')}</div>
                <div><strong>Setting:</strong> {script.setting}</div>
                <div><strong>Duration:</strong> {script.duration}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
