'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Palette, 
  Image as ImageIcon, 
  Megaphone, 
  Video,
  Zap,
  Sparkles
} from 'lucide-react';
import { ThumbnailGenerator } from '@/components/creative-studio/thumbnail-generator';
import { AdCreativeGenerator } from '@/components/creative-studio/ad-creative-generator';
import { UGCGenerator } from '@/components/creative-studio/ugc-generator';
import { VisualHookGenerator } from '@/components/creative-studio/visual-hook-generator';
import { MoodboardCreator } from '@/components/creative-studio/moodboard-creator';

export default function CreativeStudioPage() {
  const [activeTab, setActiveTab] = useState('thumbnails');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Palette className="h-8 w-8 text-pink-600" />
          Creative Studio
        </h1>
        <p className="text-muted-foreground mt-2">
          Generate stunning visual concepts and creative ideas for your content
        </p>
      </div>

      {/* Phase Badge */}
      <Card className="bg-gradient-to-r from-pink-600 to-purple-600 text-white border-0">
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            <span className="font-semibold">Creative Studio</span>
            <Badge variant="secondary" className="ml-2">Phase 5</Badge>
          </div>
          <p className="text-sm text-white/90 mt-1">
            AI-powered visual concepts, thumbnails, ad creatives, and moodboards
          </p>
        </CardContent>
      </Card>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="thumbnails" className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Thumbnails</span>
          </TabsTrigger>
          <TabsTrigger value="ads" className="flex items-center gap-2">
            <Megaphone className="h-4 w-4" />
            <span className="hidden sm:inline">Ad Creatives</span>
          </TabsTrigger>
          <TabsTrigger value="ugc" className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            <span className="hidden sm:inline">UGC Scripts</span>
          </TabsTrigger>
          <TabsTrigger value="hooks" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            <span className="hidden sm:inline">Visual Hooks</span>
          </TabsTrigger>
          <TabsTrigger value="moodboards" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">Moodboards</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="thumbnails" className="space-y-4">
          <ThumbnailGenerator />
        </TabsContent>

        <TabsContent value="ads" className="space-y-4">
          <AdCreativeGenerator />
        </TabsContent>

        <TabsContent value="ugc" className="space-y-4">
          <UGCGenerator />
        </TabsContent>

        <TabsContent value="hooks" className="space-y-4">
          <VisualHookGenerator />
        </TabsContent>

        <TabsContent value="moodboards" className="space-y-4">
          <MoodboardCreator />
        </TabsContent>
      </Tabs>
    </div>
  );
}
