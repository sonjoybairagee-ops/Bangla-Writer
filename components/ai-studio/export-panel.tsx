'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, FileJson, FileText, Copy, Check, Zap } from 'lucide-react';
import { exportTimeline } from '@/lib/ai-studio/director-engine';
import { 
  exportForEditor, 
  generateAssetList, 
  generateEditingChecklistPDF,
  generateSoundPack,
  EditorType 
} from '@/lib/ai-studio/export-engines';

interface ExportPanelProps {
  scenes: any[];
  directions: any[];
}

export function ExportPanel({ scenes, directions }: ExportPanelProps) {
  const [copied, setCopied] = useState(false);
  const [selectedEditor, setSelectedEditor] = useState<EditorType>('premiere-pro');

  if (directions.length === 0) {
    return (
      <div className="text-center py-12">
        <Download className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
        <p className="text-muted-foreground">Please complete Visual Director first</p>
      </div>
    );
  }

  const timeline = exportTimeline(directions);
  const timelineJSON = JSON.stringify(timeline, null, 2);
  const assetList = generateAssetList(directions);
  const checklistContent = generateEditingChecklistPDF(directions);
  const soundPack = generateSoundPack(directions);

  const handleExportEditor = () => {
    const exported = exportForEditor(directions, selectedEditor, 'AI_Studio_Project');
    const blob = new Blob([exported.content], { 
      type: exported.type === 'xml' ? 'application/xml' : 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = exported.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadAssets = () => {
    const content = `# Asset List\n\n## Main Assets Needed:\n${assetList.mainAssets.map(a => `- ${a}`).join('\n')}\n\n## B-roll:\n${assetList.broll.map(a => `- ${a}`).join('\n')}\n\n## Icons:\n${assetList.icons.map(a => `- ${a}`).join('\n')}\n\n## Music:\n${assetList.music.map(a => `- ${a}`).join('\n')}\n\n## Sound Effects:\n${assetList.sfx.map(a => `- ${a}`).join('\n')}`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Asset_List.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadChecklist = () => {
    const blob = new Blob([checklistContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Editing_Checklist.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadJSON = () => {
    const blob = new Blob([timelineJSON], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-studio-timeline-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(timelineJSON);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const editorOptions = [
    { value: 'premiere-pro', label: 'Premiere Pro', icon: 'Pr', color: 'purple' },
    { value: 'capcut', label: 'CapCut', icon: 'CC', color: 'blue' },
    { value: 'after-effects', label: 'After Effects', icon: 'Ae', color: 'pink' },
    { value: 'davinci-resolve', label: 'DaVinci Resolve', icon: 'DR', color: 'red' },
    { value: 'final-cut-pro', label: 'Final Cut Pro', icon: 'FC', color: 'slate' },
    { value: 'canva', label: 'Canva', icon: 'Cv', color: 'cyan' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <Zap className="h-6 w-6 text-purple-600" />
          Production Export Engine
        </h2>
        <p className="text-muted-foreground">
          Export production-ready files for your editing software
        </p>
      </div>

      {/* Editor Mode Selection */}
      <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Zap className="h-5 w-5 text-purple-600" />
          Select Your Editor
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {editorOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setSelectedEditor(option.value as EditorType)}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedEditor === option.value
                  ? 'border-purple-500 bg-white shadow-lg scale-105'
                  : 'border-slate-200 bg-white hover:border-purple-300'
              }`}
            >
              <div className={`w-12 h-12 mx-auto mb-2 rounded-lg flex items-center justify-center bg-${option.color}-100`}>
                <span className={`text-lg font-bold text-${option.color}-600`}>{option.icon}</span>
              </div>
              <p className="text-xs font-medium text-center">{option.label}</p>
            </button>
          ))}
        </div>
      </Card>

      {/* Primary Export */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Download className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold">Timeline Export</h3>
              <p className="text-sm text-muted-foreground">For {editorOptions.find(e => e.value === selectedEditor)?.label}</p>
            </div>
          </div>
          <Button onClick={handleExportEditor} className="w-full" size="lg">
            <Download className="mr-2 h-5 w-5" />
            Export for {editorOptions.find(e => e.value === selectedEditor)?.label}
          </Button>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold">Asset List</h3>
              <p className="text-sm text-muted-foreground">{assetList.totalAssets} items needed</p>
            </div>
          </div>
          <Button onClick={handleDownloadAssets} className="w-full" size="lg" variant="outline">
            <Download className="mr-2 h-5 w-5" />
            Download Asset List
          </Button>
        </Card>
      </div>

      {/* Additional Exports */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="p-6">
          <FileJson className="h-8 w-8 text-green-600 mb-3" />
          <h3 className="font-semibold mb-2">JSON Timeline</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Complete timeline data
          </p>
          <Button onClick={handleDownloadJSON} className="w-full" variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download JSON
          </Button>
        </Card>

        <Card className="p-6">
          <FileText className="h-8 w-8 text-orange-600 mb-3" />
          <h3 className="font-semibold mb-2">Editing Checklist</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Step-by-step tasks
          </p>
          <Button onClick={handleDownloadChecklist} className="w-full" variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download Checklist
          </Button>
        </Card>

        <Card className="p-6">
          <Copy className="h-8 w-8 text-cyan-600 mb-3" />
          <h3 className="font-semibold mb-2">Copy JSON</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Copy to clipboard
          </p>
          <Button onClick={handleCopyJSON} className="w-full" variant="outline">
            {copied ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4" />
                Copy JSON
              </>
            )}
          </Button>
        </Card>
      </div>

      {/* Asset List Preview */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Asset List Preview</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-semibold text-purple-600 mb-2">Main Assets ({assetList.mainAssets.length})</h4>
              <div className="flex flex-wrap gap-2">
                {assetList.mainAssets.slice(0, 10).map((asset, i) => (
                  <Badge key={i} variant="outline">{asset}</Badge>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-blue-600 mb-2">B-roll ({assetList.broll.length})</h4>
              <div className="flex flex-wrap gap-2">
                {assetList.broll.slice(0, 8).map((item, i) => (
                  <Badge key={i} variant="secondary">{item}</Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-semibold text-green-600 mb-2">Music ({assetList.music.length})</h4>
              <div className="flex flex-wrap gap-2">
                {assetList.music.slice(0, 5).map((track, i) => (
                  <Badge key={i} variant="outline">{track}</Badge>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-orange-600 mb-2">Sound Effects ({assetList.sfx.length})</h4>
              <div className="flex flex-wrap gap-2">
                {assetList.sfx.slice(0, 5).map((sfx, i) => (
                  <Badge key={i} variant="secondary">{sfx}</Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
          <div>
            <p className="text-3xl font-bold text-purple-600">{directions.length}</p>
            <p className="text-xs text-muted-foreground mt-1">Scenes</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-purple-600">
              {(timeline[timeline.length - 1]?.endTime || 0).toFixed(0)}s
            </p>
            <p className="text-xs text-muted-foreground mt-1">Duration</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-purple-600">{assetList.totalAssets}</p>
            <p className="text-xs text-muted-foreground mt-1">Assets</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-purple-600">
              {new Set(directions.map((d: any) => d.camera)).size}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Camera Angles</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-purple-600">
              {new Set(directions.map((d: any) => d.transition)).size}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Transitions</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
