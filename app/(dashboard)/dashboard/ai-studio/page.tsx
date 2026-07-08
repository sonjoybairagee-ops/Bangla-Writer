'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Film,
  Sparkles,
  Camera,
  Wand2,
  Download,
  Play,
  Scissors,
  FileText,
  Grid3x3,
  List,
  Zap,
  BookOpen,
} from 'lucide-react';
import { ScriptPanel } from '@/components/ai-studio/script-panel';
import { VisualDirector } from '@/components/ai-studio/visual-director';
import { TimelineBlueprint } from '@/components/ai-studio/timeline-blueprint';
import { StockFootagePanel } from '@/components/ai-studio/stock-footage-panel';
import { ChecklistPanel } from '@/components/ai-studio/checklist-panel';
import { MoodBoardPanel } from '@/components/ai-studio/mood-board-panel';
import { StoryboardPanel } from '@/components/ai-studio/storyboard-panel';
import { ShotListPanel } from '@/components/ai-studio/shot-list-panel';
import { MotionPlanPanel } from '@/components/ai-studio/motion-plan-panel';
import { EditingGuidePanel } from '@/components/ai-studio/editing-guide-panel';
import { ExportPanel } from '@/components/ai-studio/export-panel';

export default function AIStudioPage() {
  const [activeTab, setActiveTab] = useState('script');
  const [script, setScript] = useState('');
  const [scenes, setScenes] = useState<any[]>([]);
  const [directions, setDirections] = useState<any[]>([]);
  const [platform, setPlatform] = useState<'general' | 'facebook-ad' | 'tiktok' | 'youtube-shorts' | 'instagram-reels'>('general');

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Film className="h-8 w-8 text-purple-600" />
              AI Studio
              <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                <Sparkles className="h-3 w-3 mr-1" />
                Flagship
              </Badge>
            </h1>
            <p className="text-muted-foreground mt-1">
              Transform scripts into complete video production plans with AI-powered creative direction
            </p>
          </div>
        </div>

        {/* Main Studio Interface */}
        <Card>
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="border-b px-6 pt-6">
                <TabsList className="grid w-full grid-cols-10 gap-1 bg-slate-50 p-1 text-xs">
                  <TabsTrigger value="script" className="flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    Script
                  </TabsTrigger>
                  <TabsTrigger value="director" className="flex items-center gap-1">
                    <Camera className="h-3 w-3" />
                    Director ⭐
                  </TabsTrigger>
                  <TabsTrigger value="timeline" className="flex items-center gap-1">
                    <BookOpen className="h-3 w-3" />
                    Blueprint
                  </TabsTrigger>
                  <TabsTrigger value="moodboard" className="flex items-center gap-1">
                    <Grid3x3 className="h-3 w-3" />
                    Mood Board
                  </TabsTrigger>
                  <TabsTrigger value="stock" className="flex items-center gap-1">
                    <List className="h-3 w-3" />
                    Stock
                  </TabsTrigger>
                  <TabsTrigger value="checklist" className="flex items-center gap-1">
                    <Zap className="h-3 w-3" />
                    Checklist
                  </TabsTrigger>
                  <TabsTrigger value="storyboard" className="flex items-center gap-1">
                    <Grid3x3 className="h-3 w-3" />
                    Storyboard
                  </TabsTrigger>
                  <TabsTrigger value="shotlist" className="flex items-center gap-1">
                    <List className="h-3 w-3" />
                    Shot List
                  </TabsTrigger>
                  <TabsTrigger value="motion" className="flex items-center gap-1">
                    <Zap className="h-3 w-3" />
                    Motion
                  </TabsTrigger>
                  <TabsTrigger value="export" className="flex items-center gap-1">
                    <Download className="h-3 w-3" />
                    Export
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="p-6">
                <TabsContent value="script" className="mt-0">
                  <ScriptPanel
                    script={script}
                    setScript={setScript}
                    scenes={scenes}
                    setScenes={setScenes}
                    onNext={() => setActiveTab('director')}
                  />
                </TabsContent>

                <TabsContent value="director" className="mt-0">
                  <VisualDirector
                    scenes={scenes}
                    directions={directions}
                    setDirections={setDirections}
                    onNext={() => setActiveTab('timeline')}
                  />
                </TabsContent>

                <TabsContent value="timeline" className="mt-0">
                  <TimelineBlueprint
                    directions={directions}
                    platform={platform}
                  />
                </TabsContent>

                <TabsContent value="moodboard" className="mt-0">
                  <MoodBoardPanel directions={directions} />
                </TabsContent>

                <TabsContent value="stock" className="mt-0">
                  <StockFootagePanel directions={directions} />
                </TabsContent>

                <TabsContent value="checklist" className="mt-0">
                  <ChecklistPanel directions={directions} />
                </TabsContent>

                <TabsContent value="storyboard" className="mt-0">
                  <StoryboardPanel
                    directions={directions}
                    onNext={() => setActiveTab('shotlist')}
                  />
                </TabsContent>

                <TabsContent value="shotlist" className="mt-0">
                  <ShotListPanel
                    directions={directions}
                    onNext={() => setActiveTab('motion')}
                  />
                </TabsContent>

                <TabsContent value="motion" className="mt-0">
                  <MotionPlanPanel
                    directions={directions}
                    onNext={() => setActiveTab('export')}
                  />
                </TabsContent>

                <TabsContent value="export" className="mt-0">
                  <ExportPanel
                    scenes={scenes}
                    directions={directions}
                  />
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <Wand2 className="h-5 w-5 text-purple-600" />
                </div>
                <h3 className="font-semibold">AI-Powered Direction</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Get professional camera angles, movements, and visual suggestions for every scene
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Play className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="font-semibold">Platform Optimization</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Optimized for TikTok, YouTube Shorts, Instagram Reels, and Facebook Ads
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-green-50 rounded-lg">
                  <BookOpen className="h-5 w-5 text-green-600" />
                </div>
                <h3 className="font-semibold">Complete Timeline</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Export ready-to-use JSON timeline for video editors and animation software
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
