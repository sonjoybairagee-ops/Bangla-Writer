'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FolderOpen, Search, Star, Trash, Copy, Check } from 'lucide-react';

export default function LibraryPage() {
  const [scripts, setScripts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    fetchScripts();
  }, [filterType]);

  const fetchScripts = async () => {
    try {
      const params = new URLSearchParams();
      if (filterType !== 'all') params.set('type', filterType);

      const response = await fetch(`/api/scripts?${params}`);
      const data = await response.json();
      setScripts(data.scripts);
    } catch (error) {
      console.error('Failed to fetch scripts:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteScript = async (id: string) => {
    if (!confirm('Are you sure you want to delete this script?')) return;

    try {
      await fetch(`/api/scripts/${id}`, { method: 'DELETE' });
      fetchScripts();
    } catch (error) {
      console.error('Failed to delete script:', error);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const filteredScripts = scripts.filter(
    (script) =>
      script.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      script.caption?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Script Library</h1>
        <p className="text-slate-600">
          Access and manage all your generated content
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search scripts..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <select
              className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="post">Posts</option>
              <option value="reel">Reels</option>
              <option value="hook">Hooks</option>
              <option value="ovc">OVC</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Scripts Grid */}
      {loading ? (
        <div className="text-center py-12">Loading scripts...</div>
      ) : filteredScripts.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <FolderOpen className="h-16 w-16 mx-auto mb-4 text-slate-400" />
            <h3 className="text-xl font-bold mb-2">No scripts yet</h3>
            <p className="text-slate-600 mb-6">
              Start generating content to build your library
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredScripts.map((script) => (
            <Card key={script.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-base">{script.title}</CardTitle>
                    <CardDescription className="flex gap-2 mt-2">
                      <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded">
                        {script.type}
                      </span>
                      <span className="text-xs px-2 py-1 bg-slate-100 text-slate-700 rounded">
                        {script.platform}
                      </span>
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="flex-shrink-0"
                  >
                    <Star className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {script.hook && (
                  <div className="mb-3">
                    <p className="text-sm font-medium text-slate-700 mb-1">
                      Hook:
                    </p>
                    <p className="text-sm text-slate-600 line-clamp-2">
                      {script.hook}
                    </p>
                  </div>
                )}
                {script.caption && (
                  <div className="mb-3">
                    <p className="text-sm text-slate-600 line-clamp-3">
                      {script.caption}
                    </p>
                  </div>
                )}
                {script.viralScore && (
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-600">Viral Score</span>
                      <span className="font-medium">{script.viralScore}/100</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-600 to-pink-600"
                        style={{ width: `${script.viralScore}%` }}
                      />
                    </div>
                  </div>
                )}
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() =>
                      copyToClipboard(script.caption || script.hook, script.id)
                    }
                  >
                    {copied === script.id ? (
                      <Check className="mr-2 h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="mr-2 h-4 w-4" />
                    )}
                    Copy
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteScript(script.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
