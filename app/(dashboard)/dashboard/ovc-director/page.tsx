'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Film, 
  ChevronDown, 
  ChevronUp, 
  Camera, 
  Lightbulb,
  Music,
  Image as ImageIcon,
  Download,
  Copy,
  Eye,
  Palette,
  Zap,
  Clock,
  MapPin,
  Users,
  Settings
} from 'lucide-react';

interface Scene {
  sceneNumber: number;
  duration: number;
  location: string;
  timeOfDay: string;
  dialogue: string;
  action: string;
  emotion: string;
  actor: string;
  camera: {
    shotType: string;
    angle: string;
    movement: string;
    lens: string;
    framing: string;
  };
  lighting: {
    setup: string;
    mood: string;
    keyLight: string;
    fillLight: string;
    backLight: string;
  };
  audio: {
    dialogue: string;
    music: string;
    soundEffects: string[];
    ambience: string;
  };
  visuals: {
    screenText: string[];
    bRoll: string[];
    props: string[];
    wardrobe: string;
    colorGrade: string;
  };
  transition: string;
  notes: string;
}

interface OVCResult {
  title: string;
  concept: string;
  logline: string;
  targetLength: number;
  scenes: Scene[];
  shotList: {
    sceneNumber: number;
    shotNumber: string;
    shotType: string;
    description: string;
    priority: string;
  }[];
  production: {
    equipmentNeeded: string[];
    crewRequired: string[];
    locations: string[];
    estimatedBudget: string;
    shootDays: number;
  };
  visualDirection: {
    moodBoard: string[];
    colorPalette: string[];
    references: string[];
    styleNotes: string;
  };
  postProduction: {
    editingNotes: string;
    musicSuggestions: string[];
    transitionStyle: string;
    pacing: string;
  };
}

const STORY_STYLES = [
  { value: 'cinematic', label: '🎬 Cinematic', desc: 'Film-quality production' },
  { value: 'documentary', label: '📹 Documentary', desc: 'Real and authentic' },
  { value: 'lifestyle', label: '✨ Lifestyle', desc: 'Aspirational living' },
  { value: 'luxury', label: '💎 Luxury', desc: 'Premium and elegant' },
  { value: 'ugc', label: '👤 UGC Style', desc: 'User-generated feel' },
  { value: 'comedy', label: '😂 Comedy', desc: 'Humorous and fun' },
  { value: 'emotional', label: '❤️ Emotional', desc: 'Heart-touching' },
  { value: 'minimal', label: '⚪ Minimal', desc: 'Clean and simple' },
  { value: 'trendy', label: '🔥 Trendy', desc: 'Modern and viral' },
];

const VIDEO_TYPES = [
  { value: 'ad', label: 'Video Ad', desc: 'Sales-focused' },
  { value: 'reel', label: 'Instagram Reel', desc: '15-90s' },
  { value: 'youtube', label: 'YouTube Video', desc: '2-10 min' },
  { value: 'tiktok', label: 'TikTok', desc: '15-60s' },
  { value: 'vsl', label: 'VSL', desc: 'Long-form sales' },
  { value: 'explainer', label: 'Explainer', desc: 'Educational' },
  { value: 'testimonial', label: 'Testimonial', desc: 'Customer story' },
  { value: 'product', label: 'Product Demo', desc: 'Features showcase' },
];

export default function OVCDirectorPage() {
  const [brands, setBrands] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [formData, setFormData] = useState({
    brand: '',
    product: '',
    offer: '',
    budget: 'medium',
    duration: 60,
    storyStyle: 'cinematic',
    videoType: 'ad',
    platform: 'instagram',
    targetAudience: '',
    goal: 'sales',
    brandId: '',
    scriptBrief: '',
    visualStyle: '',
    mood: 'energetic',
  });
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<OVCResult | null>(null);
  const [expandedScene, setExpandedScene] = useState<number | null>(0);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const response = await fetch('/api/brands');
      const data = await response.json();
      setBrands(data.brands || []);
    } catch (error) {
      console.error('Failed to fetch brands:', error);
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setResult(null);

    try {
      const response = await fetch('/api/generate/ovc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        setResult(data.ovc);
        setActiveTab('scenes');
      } else {
        alert(data.error || 'Failed to generate OVC breakdown');
      }
    } catch (error) {
      console.error('Failed to generate OVC:', error);
      alert('Failed to generate OVC breakdown');
    } finally {
      setGenerating(false);
    }
  };

  const exportScript = () => {
    if (!result) return;
    
    // Create downloadable text file
    const scriptText = `
${result.title}
${result.concept}
Target Length: ${result.targetLength}s

${result.scenes.map((scene, i) => `
SCENE ${scene.sceneNumber}
Duration: ${scene.duration}s
Location: ${scene.location} - ${scene.timeOfDay}

DIALOGUE:
${scene.dialogue}

ACTION:
${scene.action}

CAMERA: ${scene.camera.shotType} | ${scene.camera.angle} | ${scene.camera.movement}
LIGHTING: ${scene.lighting.setup} | ${scene.lighting.mood}
AUDIO: ${scene.audio.music} | ${scene.audio.soundEffects.join(', ')}

---
`).join('\n')}
    `.trim();

    const blob = new Blob([scriptText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${result.title.replace(/\s+/g, '-')}-OVC-Script.txt`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Film className="h-8 w-8 text-purple-600" />
            OVC Director
          </h1>
          <p className="text-muted-foreground mt-2">
            Professional video production breakdowns with complete shot lists
          </p>
        </div>
        {result && (
          <Button onClick={exportScript} variant="outline" size="lg">
            <Download className="mr-2 h-4 w-4" />
            Export Script
          </Button>
        )}
      </div>

      {/* Pro Badge */}
      <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            <span className="font-semibold">Pro Feature</span>
            <Badge variant="secondary" className="ml-2">Phase 4</Badge>
          </div>
          <p className="text-sm text-white/90 mt-1">
            Complete video production system - from concept to shot list
          </p>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Input Form */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Video Configuration</CardTitle>
              <CardDescription>
                Set up your video production parameters
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
              {/* Brand Selection */}
              <div>
                <label className="text-sm font-medium flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Brand (Optional)
                </label>
                <select
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
                  value={formData.brandId}
                  onChange={(e) => {
                    const brandId = e.target.value;
                    const selectedBrand = brands.find((b) => b.id === brandId);
                    setFormData({
                      ...formData,
                      brandId,
                      brand: selectedBrand?.name || formData.brand,
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

              {/* Video Type */}
              <div>
                <label className="text-sm font-medium flex items-center gap-2 mb-2">
                  <Film className="h-4 w-4" />
                  Video Type *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {VIDEO_TYPES.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setFormData({ ...formData, videoType: type.value })}
                      className={`p-3 text-left rounded-lg border-2 transition-all ${
                        formData.videoType === type.value
                          ? 'border-purple-600 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-medium text-sm">{type.label}</div>
                      <div className="text-xs text-muted-foreground">{type.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Product */}
              <div>
                <label className="text-sm font-medium">Product/Service *</label>
                <Input
                  placeholder="What are you promoting?"
                  value={formData.product}
                  onChange={(e) =>
                    setFormData({ ...formData, product: e.target.value })
                  }
                  className="mt-1"
                />
              </div>

              {/* Script Brief */}
              <div>
                <label className="text-sm font-medium">Script Brief *</label>
                <Textarea
                  placeholder="Describe your video concept, story, or message..."
                  value={formData.scriptBrief}
                  onChange={(e) =>
                    setFormData({ ...formData, scriptBrief: e.target.value })
                  }
                  rows={4}
                  className="mt-1"
                />
              </div>

              {/* Target Audience */}
              <div>
                <label className="text-sm font-medium">Target Audience *</label>
                <Input
                  placeholder="Who is this for?"
                  value={formData.targetAudience}
                  onChange={(e) =>
                    setFormData({ ...formData, targetAudience: e.target.value })
                  }
                  className="mt-1"
                />
              </div>

              {/* Story Style */}
              <div>
                <label className="text-sm font-medium flex items-center gap-2 mb-2">
                  <Palette className="h-4 w-4" />
                  Story Style
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {STORY_STYLES.map((style) => (
                    <button
                      key={style.value}
                      onClick={() => setFormData({ ...formData, storyStyle: style.value })}
                      className={`p-2 text-left rounded-lg border transition-all ${
                        formData.storyStyle === style.value
                          ? 'border-purple-600 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-medium text-sm">{style.label}</span>
                          <p className="text-xs text-muted-foreground">{style.desc}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="text-sm font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Duration: {formData.duration}s
                </label>
                <input
                  type="range"
                  min="15"
                  max="300"
                  step="15"
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      duration: parseInt(e.target.value),
                    })
                  }
                  className="w-full mt-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>15s</span>
                  <span>1m</span>
                  <span>2m</span>
                  <span>5m</span>
                </div>
              </div>

              {/* Budget */}
              <div>
                <label className="text-sm font-medium">Production Budget</label>
                <select
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
                  value={formData.budget}
                  onChange={(e) =>
                    setFormData({ ...formData, budget: e.target.value })
                  }
                >
                  <option value="low">Low Budget (DIY)</option>
                  <option value="medium">Medium Budget (Semi-Pro)</option>
                  <option value="high">High Budget (Professional)</option>
                </select>
              </div>

              {/* Goal */}
              <div>
                <label className="text-sm font-medium">Primary Goal</label>
                <select
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
                  value={formData.goal}
                  onChange={(e) =>
                    setFormData({ ...formData, goal: e.target.value })
                  }
                >
                  <option value="sales">Drive Sales</option>
                  <option value="awareness">Brand Awareness</option>
                  <option value="engagement">Engagement</option>
                  <option value="education">Education</option>
                  <option value="entertainment">Entertainment</option>
                </select>
              </div>

              {/* Generate Button */}
              <Button
                onClick={handleGenerate}
                disabled={
                  generating ||
                  !formData.product ||
                  !formData.scriptBrief ||
                  !formData.targetAudience
                }
                className="w-full"
                size="lg"
              >
                {generating ? (
                  <>
                    <Zap className="mr-2 h-5 w-5 animate-spin" />
                    Generating Production Breakdown...
                  </>
                ) : (
                  <>
                    <Film className="mr-2 h-5 w-5" />
                    Generate OVC Breakdown
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right: Results with Tabs */}
        <div className="lg:col-span-2">
          {!result && !generating && (
            <Card className="h-[600px] flex items-center justify-center">
              <CardContent className="text-center">
                <Film className="h-20 w-20 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-lg font-semibold mb-2">Ready to Create</h3>
                <p className="text-muted-foreground max-w-md">
                  Fill in the video details and generate your complete production breakdown with
                  scenes, camera angles, lighting setups, and shot lists.
                </p>
              </CardContent>
            </Card>
          )}

          {generating && (
            <Card className="h-[600px] flex items-center justify-center">
              <CardContent className="text-center">
                <Zap className="h-20 w-20 mx-auto mb-4 text-purple-600 animate-pulse" />
                <h3 className="text-lg font-semibold mb-2">Generating Your Production...</h3>
                <p className="text-muted-foreground">
                  Creating professional video breakdown with scenes, shots, and directions
                </p>
              </CardContent>
            </Card>
          )}

          {result && (
            <div className="space-y-4">
              {/* Overview Card */}
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl">{result.title}</CardTitle>
                      <CardDescription className="mt-2">{result.logline}</CardDescription>
                    </div>
                    <Badge variant="secondary" className="text-lg px-3 py-1">
                      {result.targetLength}s
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{result.concept}</p>
                </CardContent>
              </Card>

              {/* Tabs for different views */}
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="overview">
                    <Eye className="h-4 w-4 mr-2" />
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="scenes">
                    <Film className="h-4 w-4 mr-2" />
                    Scenes
                  </TabsTrigger>
                  <TabsTrigger value="shotlist">
                    <Camera className="h-4 w-4 mr-2" />
                    Shot List
                  </TabsTrigger>
                  <TabsTrigger value="production">
                    <Settings className="h-4 w-4 mr-2" />
                    Production
                  </TabsTrigger>
                  <TabsTrigger value="visual">
                    <Palette className="h-4 w-4 mr-2" />
                    Visual
                  </TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-4 mt-4">
                  {result.scenes && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Scene Summary</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center p-4 bg-purple-50 rounded-lg">
                            <div className="text-3xl font-bold text-purple-600">
                              {result.scenes.length}
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">Total Scenes</div>
                          </div>
                          <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <div className="text-3xl font-bold text-blue-600">
                              {result.shotList?.length || 0}
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">Total Shots</div>
                          </div>
                          <div className="text-center p-4 bg-green-50 rounded-lg">
                            <div className="text-3xl font-bold text-green-600">
                              {result.production?.locations?.length || 0}
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">Locations</div>
                          </div>
                          <div className="text-center p-4 bg-orange-50 rounded-lg">
                            <div className="text-3xl font-bold text-orange-600">
                              {result.production?.shootDays || 1}
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">Shoot Days</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {result.production && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Quick Production Info</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <span className="text-sm font-medium">Estimated Budget:</span>
                          <p className="text-muted-foreground">{result.production.estimatedBudget}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Crew Required:</span>
                          <p className="text-muted-foreground">
                            {result.production.crewRequired?.join(', ')}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                {/* Scenes Tab */}
                <TabsContent value="scenes" className="space-y-3 mt-4">
                  {result.scenes?.map((scene, index) => (
                    <Card key={index} className="overflow-hidden">
                      <CardHeader
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() =>
                          setExpandedScene(expandedScene === index ? null : index)
                        }
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                              <span className="text-xl font-bold text-purple-600">
                                {scene.sceneNumber}
                              </span>
                            </div>
                            <div>
                              <CardTitle className="text-base">
                                Scene {scene.sceneNumber} - {scene.duration}s
                              </CardTitle>
                              <CardDescription className="flex items-center gap-2 mt-1">
                                <MapPin className="h-3 w-3" />
                                {scene.location} • {scene.timeOfDay}
                              </CardDescription>
                            </div>
                          </div>
                          {expandedScene === index ? (
                            <ChevronUp className="h-5 w-5" />
                          ) : (
                            <ChevronDown className="h-5 w-5" />
                          )}
                        </div>
                      </CardHeader>

                      {expandedScene === index && (
                        <CardContent className="space-y-4 pt-0">
                          {/* Dialogue & Action */}
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                Dialogue & Action
                              </h4>
                              <div className="space-y-2">
                                <div className="bg-blue-50 rounded-lg p-3">
                                  <span className="text-xs font-medium text-blue-900">ACTOR:</span>
                                  <p className="text-sm mt-1">{scene.actor}</p>
                                </div>
                                <div className="bg-purple-50 rounded-lg p-3">
                                  <span className="text-xs font-medium text-purple-900">DIALOGUE:</span>
                                  <p className="text-sm mt-1">{scene.dialogue}</p>
                                </div>
                                <div className="bg-green-50 rounded-lg p-3">
                                  <span className="text-xs font-medium text-green-900">ACTION:</span>
                                  <p className="text-sm mt-1">{scene.action}</p>
                                </div>
                                <div className="bg-orange-50 rounded-lg p-3">
                                  <span className="text-xs font-medium text-orange-900">EMOTION:</span>
                                  <p className="text-sm mt-1">{scene.emotion}</p>
                                </div>
                              </div>
                            </div>

                            <div>
                              <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                                <Camera className="h-4 w-4" />
                                Camera Setup
                              </h4>
                              <div className="bg-slate-50 rounded-lg p-3 space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Shot Type:</span>
                                  <span className="font-medium">{scene.camera.shotType}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Angle:</span>
                                  <span className="font-medium">{scene.camera.angle}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Movement:</span>
                                  <span className="font-medium">{scene.camera.movement}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Lens:</span>
                                  <span className="font-medium">{scene.camera.lens}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Framing:</span>
                                  <span className="font-medium">{scene.camera.framing}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Lighting */}
                          <div>
                            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                              <Lightbulb className="h-4 w-4" />
                              Lighting Setup
                            </h4>
                            <div className="bg-yellow-50 rounded-lg p-3 space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Setup:</span>
                                <span className="font-medium">{scene.lighting.setup}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Mood:</span>
                                <span className="font-medium">{scene.lighting.mood}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Key Light:</span>
                                <span className="font-medium">{scene.lighting.keyLight}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Fill Light:</span>
                                <span className="font-medium">{scene.lighting.fillLight}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Back Light:</span>
                                <span className="font-medium">{scene.lighting.backLight}</span>
                              </div>
                            </div>
                          </div>

                          {/* Audio */}
                          <div>
                            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                              <Music className="h-4 w-4" />
                              Audio Design
                            </h4>
                            <div className="bg-pink-50 rounded-lg p-3 space-y-2 text-sm">
                              <div>
                                <span className="text-muted-foreground">Music:</span>
                                <p className="font-medium">{scene.audio.music}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Sound Effects:</span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {scene.audio.soundEffects.map((sfx, i) => (
                                    <Badge key={i} variant="outline">{sfx}</Badge>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Ambience:</span>
                                <p className="font-medium">{scene.audio.ambience}</p>
                              </div>
                            </div>
                          </div>

                          {/* Visuals */}
                          <div>
                            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                              <ImageIcon className="h-4 w-4" />
                              Visual Elements
                            </h4>
                            <div className="bg-indigo-50 rounded-lg p-3 space-y-2 text-sm">
                              {scene.visuals.screenText.length > 0 && (
                                <div>
                                  <span className="text-muted-foreground">Screen Text:</span>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {scene.visuals.screenText.map((text, i) => (
                                      <Badge key={i} variant="secondary">{text}</Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {scene.visuals.bRoll.length > 0 && (
                                <div>
                                  <span className="text-muted-foreground">B-Roll:</span>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {scene.visuals.bRoll.map((broll, i) => (
                                      <Badge key={i} variant="outline">{broll}</Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {scene.visuals.props.length > 0 && (
                                <div>
                                  <span className="text-muted-foreground">Props:</span>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {scene.visuals.props.map((prop, i) => (
                                      <Badge key={i} variant="secondary">{prop}</Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                              <div>
                                <span className="text-muted-foreground">Wardrobe:</span>
                                <p className="font-medium">{scene.visuals.wardrobe}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Color Grade:</span>
                                <p className="font-medium">{scene.visuals.colorGrade}</p>
                              </div>
                            </div>
                          </div>

                          {/* Transition & Notes */}
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-slate-50 rounded-lg p-3">
                              <span className="text-xs font-medium text-slate-900">TRANSITION:</span>
                              <p className="text-sm mt-1">{scene.transition}</p>
                            </div>
                            {scene.notes && (
                              <div className="bg-slate-50 rounded-lg p-3">
                                <span className="text-xs font-medium text-slate-900">NOTES:</span>
                                <p className="text-sm mt-1">{scene.notes}</p>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  ))}
                </TabsContent>

                {/* Shot List Tab */}
                <TabsContent value="shotlist" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Master Shot List</CardTitle>
                      <CardDescription>
                        Complete coverage plan for production
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {result.shotList?.map((shot, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-20">
                                <Badge variant={
                                  shot.priority === 'high' ? 'default' :
                                  shot.priority === 'medium' ? 'secondary' : 'outline'
                                }>
                                  {shot.shotNumber}
                                </Badge>
                              </div>
                              <div className="flex-1">
                                <div className="font-medium text-sm">{shot.shotType}</div>
                                <div className="text-xs text-muted-foreground">{shot.description}</div>
                              </div>
                            </div>
                            <Badge variant="outline">Scene {shot.sceneNumber}</Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Production Tab */}
                <TabsContent value="production" className="space-y-4 mt-4">
                  {result.production && (
                    <>
                      <Card>
                        <CardHeader>
                          <CardTitle>Production Requirements</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <h4 className="font-semibold text-sm mb-2">Equipment Needed</h4>
                            <div className="flex flex-wrap gap-2">
                              {result.production.equipmentNeeded?.map((equip, i) => (
                                <Badge key={i} variant="secondary">{equip}</Badge>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-semibold text-sm mb-2">Crew Required</h4>
                            <div className="flex flex-wrap gap-2">
                              {result.production.crewRequired?.map((crew, i) => (
                                <Badge key={i} variant="outline">{crew}</Badge>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-semibold text-sm mb-2">Locations</h4>
                            <div className="flex flex-wrap gap-2">
                              {result.production.locations?.map((loc, i) => (
                                <Badge key={i} variant="secondary">{loc}</Badge>
                              ))}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                            <div>
                              <span className="text-sm text-muted-foreground">Estimated Budget</span>
                              <p className="text-lg font-semibold">{result.production.estimatedBudget}</p>
                            </div>
                            <div>
                              <span className="text-sm text-muted-foreground">Shoot Days</span>
                              <p className="text-lg font-semibold">{result.production.shootDays} days</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {result.postProduction && (
                        <Card>
                          <CardHeader>
                            <CardTitle>Post-Production Notes</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div>
                              <span className="text-sm font-medium">Editing Notes:</span>
                              <p className="text-sm text-muted-foreground mt-1">
                                {result.postProduction.editingNotes}
                              </p>
                            </div>
                            <div>
                              <span className="text-sm font-medium">Music Suggestions:</span>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {result.postProduction.musicSuggestions?.map((music, i) => (
                                  <Badge key={i} variant="outline">{music}</Badge>
                                ))}
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <span className="text-sm font-medium">Transition Style:</span>
                                <p className="text-sm text-muted-foreground">
                                  {result.postProduction.transitionStyle}
                                </p>
                              </div>
                              <div>
                                <span className="text-sm font-medium">Pacing:</span>
                                <p className="text-sm text-muted-foreground">
                                  {result.postProduction.pacing}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </>
                  )}
                </TabsContent>

                {/* Visual Direction Tab */}
                <TabsContent value="visual" className="space-y-4 mt-4">
                  {result.visualDirection && (
                    <>
                      <Card>
                        <CardHeader>
                          <CardTitle>Visual Style Guide</CardTitle>
                          <CardDescription>{result.visualDirection.styleNotes}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <h4 className="font-semibold text-sm mb-2">Color Palette</h4>
                            <div className="flex gap-2">
                              {result.visualDirection.colorPalette?.map((color, i) => (
                                <div
                                  key={i}
                                  className="w-16 h-16 rounded-lg flex items-center justify-center text-xs font-medium border"
                                  style={{ backgroundColor: color }}
                                >
                                  {color}
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-semibold text-sm mb-2">Mood Board References</h4>
                            <div className="grid grid-cols-2 gap-2">
                              {result.visualDirection.moodBoard?.map((ref, i) => (
                                <div key={i} className="p-3 bg-slate-50 rounded-lg text-sm">
                                  {ref}
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-semibold text-sm mb-2">Style References</h4>
                            <div className="flex flex-wrap gap-2">
                              {result.visualDirection.references?.map((ref, i) => (
                                <Badge key={i} variant="secondary">{ref}</Badge>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
