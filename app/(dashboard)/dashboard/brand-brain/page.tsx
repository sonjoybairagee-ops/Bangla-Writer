'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Upload, 
  Brain, 
  Edit, 
  Trash, 
  Globe,
  FileText,
  Image as ImageIcon,
  Copy,
  Star,
  BarChart,
  Check,
  ChevronDown,
  Settings,
  Target,
  Hash,
  Lightbulb,
  TrendingUp,
  Building2,
  Download,
} from 'lucide-react';

export default function BrandBrainPage() {
  const [brands, setBrands] = useState<any[]>([]);
  const [activeBrandId, setActiveBrandId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showBrandSelector, setShowBrandSelector] = useState(false);
  const [view, setView] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const response = await fetch('/api/brands');
      const data = await response.json();
      setBrands(data.brands || []);
      
      // Set first brand as active if none selected
      if (data.brands && data.brands.length > 0 && !activeBrandId) {
        setActiveBrandId(data.brands[0].id);
      }
    } catch (error) {
      console.error('Failed to fetch brands:', error);
    } finally {
      setLoading(false);
    }
  };

  const activeBrand = brands.find(b => b.id === activeBrandId);
  const totalBrands = brands.length;

  return (
    <div className="space-y-6">
      {/* Header with Brand Switcher */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Brain className="h-8 w-8 text-purple-600" />
            Brand Brain
          </h1>
          <p className="text-muted-foreground">
            Manage multiple brands with AI-powered voice & identity learning
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Brand Switcher Dropdown */}
          {brands.length > 0 && (
            <div className="relative">
              <Button
                variant="outline"
                className="min-w-[200px] justify-between"
                onClick={() => setShowBrandSelector(!showBrandSelector)}
              >
                {activeBrand ? (
                  <div className="flex items-center gap-2">
                    <Brain className="h-4 w-4 text-purple-600" />
                    <span className="font-medium">{activeBrand.name}</span>
                  </div>
                ) : (
                  'Select Brand'
                )}
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
              
              {showBrandSelector && (
                <div className="absolute top-full mt-2 w-[300px] bg-white border rounded-lg shadow-lg z-50 max-h-[400px] overflow-y-auto">
                  <div className="p-2">
                    <div className="text-xs font-medium text-muted-foreground px-2 py-1">
                      YOUR BRANDS ({totalBrands})
                    </div>
                    {brands.map((brand) => (
                      <button
                        key={brand.id}
                        onClick={() => {
                          setActiveBrandId(brand.id);
                          setShowBrandSelector(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-md hover:bg-slate-50 flex items-center gap-2 ${
                          activeBrandId === brand.id ? 'bg-purple-50' : ''
                        }`}
                      >
                        <Brain className="h-4 w-4 text-purple-600" />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">{brand.name}</div>
                          {brand.industry && (
                            <div className="text-xs text-muted-foreground truncate">
                              {brand.industry}
                            </div>
                          )}
                        </div>
                        {activeBrandId === brand.id && (
                          <Check className="h-4 w-4 text-purple-600" />
                        )}
                      </button>
                    ))}
                  </div>
                  <div className="border-t p-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => {
                        setShowBrandSelector(false);
                        setShowCreateForm(true);
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Brand
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          <Button onClick={() => setShowCreateForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Brand
          </Button>
        </div>
      </div>

      {/* Phase 3 Badge */}
      <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0">
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            <span className="font-semibold">Brand Brain - Enhanced</span>
            <Badge variant="secondary" className="ml-2">Phase 3</Badge>
          </div>
          <p className="text-sm text-white/90 mt-1">
            Multi-brand management • Website scraping • Voice learning • Asset library
          </p>
        </CardContent>
      </Card>

      {showCreateForm && (
        <CreateBrandForm
          onClose={() => setShowCreateForm(false)}
          onSuccess={() => {
            setShowCreateForm(false);
            fetchBrands();
          }}
        />
      )}

      {loading ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="animate-pulse">
              <Brain className="h-16 w-16 mx-auto mb-4 text-slate-400" />
              <p>Loading brands...</p>
            </div>
          </CardContent>
        </Card>
      ) : brands.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Brain className="h-16 w-16 mx-auto mb-4 text-slate-400" />
            <h3 className="text-xl font-bold mb-2">No brands yet</h3>
            <p className="text-slate-600 mb-6">
              Create your first brand profile to unlock AI-powered content generation
            </p>
            <Button onClick={() => setShowCreateForm(true)} size="lg">
              <Plus className="mr-2 h-5 w-5" />
              Add Your First Brand
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="all-brands">All Brands ({totalBrands})</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="assets">Assets</TabsTrigger>
            <TabsTrigger value="compare">Compare Brands</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab - Active Brand Details */}
          <TabsContent value="overview" className="space-y-4">
            {activeBrand && (
              <BrandOverview brand={activeBrand} onUpdate={fetchBrands} />
            )}
          </TabsContent>

          {/* All Brands Tab */}
          <TabsContent value="all-brands" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">All Your Brands</h3>
                <p className="text-sm text-muted-foreground">
                  Manage {totalBrands} brand profile{totalBrands !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={view === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setView('grid')}
                >
                  Grid
                </Button>
                <Button
                  variant={view === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setView('list')}
                >
                  List
                </Button>
              </div>
            </div>

            {view === 'grid' ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {brands.map((brand) => (
                  <BrandCard 
                    key={brand.id} 
                    brand={brand} 
                    isActive={activeBrandId === brand.id}
                    onSelect={() => setActiveBrandId(brand.id)}
                    onUpdate={fetchBrands} 
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {brands.map((brand) => (
                  <BrandListItem
                    key={brand.id}
                    brand={brand}
                    isActive={activeBrandId === brand.id}
                    onSelect={() => setActiveBrandId(brand.id)}
                    onUpdate={fetchBrands}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents">
            {activeBrand && (
              <BrandDocuments brand={activeBrand} onUpdate={fetchBrands} />
            )}
          </TabsContent>

          {/* Assets Tab */}
          <TabsContent value="assets">
            {activeBrand && (
              <BrandAssets brand={activeBrand} onUpdate={fetchBrands} />
            )}
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            {activeBrand && (
              <BrandSettings brand={activeBrand} onUpdate={fetchBrands} />
            )}
          </TabsContent>

          {/* Brand Comparison Tab */}
          <TabsContent value="compare">
            <BrandComparison brands={brands} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

// Brand Overview Component
function BrandOverview({ brand, onUpdate }: { brand: any; onUpdate: () => void }) {
  return (
    <div className="space-y-6">
      {/* Brand Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-3">
                <Brain className="h-6 w-6 text-purple-600" />
                {brand.name}
              </CardTitle>
              {brand.tagline && (
                <CardDescription className="text-base mt-2">
                  "{brand.tagline}"
                </CardDescription>
              )}
            </div>
            <div className="flex gap-2">
              <GeneratePDFButton brand={brand} />
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {brand.documents?.length || 0}
              </div>
              <div className="text-sm text-muted-foreground mt-1">Documents</div>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {brand.tone?.length || 0}
              </div>
              <div className="text-sm text-muted-foreground mt-1">Tone Tags</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {brand.keywords?.length || 0}
              </div>
              <div className="text-sm text-muted-foreground mt-1">Keywords</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Brand Details Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {brand.industry && (
              <div>
                <span className="font-medium">Industry:</span> {brand.industry}
              </div>
            )}
            {brand.niche && (
              <div>
                <span className="font-medium">Niche:</span> {brand.niche}
              </div>
            )}
            {brand.description && (
              <div>
                <span className="font-medium">Description:</span>
                <p className="mt-1 text-muted-foreground">{brand.description}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Voice & Personality */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Voice & Personality</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {brand.tone && brand.tone.length > 0 && (
              <div>
                <span className="text-sm font-medium block mb-2">Tone:</span>
                <div className="flex flex-wrap gap-2">
                  {brand.tone.map((t: string, i: number) => (
                    <Badge key={i} variant="secondary">{t}</Badge>
                  ))}
                </div>
              </div>
            )}
            {brand.voice && (
              <div>
                <span className="text-sm font-medium block mb-1">Voice:</span>
                <p className="text-sm text-muted-foreground">{brand.voice}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Target Audience */}
        {brand.targetAudience && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Target Audience</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{brand.targetAudience}</p>
            </CardContent>
          </Card>
        )}

        {/* Keywords */}
        {brand.keywords && brand.keywords.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Keywords</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {brand.keywords.map((keyword: string, i: number) => (
                  <Badge key={i} variant="outline">{keyword}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Brand Voice Learning */}
      <BrandVoiceLearning brand={brand} onUpdate={onUpdate} />

      {/* Agency Mode */}
      <AgencyModeCard brand={brand} onUpdate={onUpdate} />

      {/* Voice Consistency Checker */}
      <VoiceConsistencyChecker brand={brand} />
    </div>
  );
}

// Brand Voice Learning Component
function BrandVoiceLearning({ brand, onUpdate }: { brand: any; onUpdate: () => void }) {
  const [analyzing, setAnalyzing] = useState(false);
  const [voiceProfile, setVoiceProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVoiceProfile();
  }, [brand.id]);

  const fetchVoiceProfile = async () => {
    try {
      const response = await fetch(`/api/brands/${brand.id}/voice-profile`);
      const data = await response.json();
      if (data.success) {
        setVoiceProfile(data.profile);
      }
    } catch (error) {
      console.error('Failed to fetch voice profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    setAnalyzing(true);
    try {
      const response = await fetch(`/api/brands/${brand.id}/analyze-voice`, {
        method: 'POST',
      });

      const data = await response.json();
      if (data.success) {
        setVoiceProfile(data.profile);
        onUpdate();
        alert('Brand voice analyzed successfully!');
      } else {
        alert(data.error || 'Failed to analyze brand voice');
      }
    } catch (error) {
      console.error('Failed to analyze voice:', error);
      alert('Failed to analyze brand voice');
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Brain className="h-12 w-12 mx-auto mb-4 text-muted-foreground animate-pulse" />
          <p className="text-sm text-muted-foreground">Loading voice profile...</p>
        </CardContent>
      </Card>
    );
  }

  const documentCount = brand.documents?.length || 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
              AI Brand Voice Learning
            </CardTitle>
            <CardDescription>
              Automatically learn and understand your brand voice from documents
            </CardDescription>
          </div>
          <Button
            onClick={handleAnalyze}
            disabled={analyzing || documentCount === 0}
          >
            {analyzing ? (
              <>
                <Brain className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Brain className="mr-2 h-4 w-4" />
                {voiceProfile ? 'Re-analyze Voice' : 'Analyze Voice'}
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {documentCount === 0 ? (
          <div className="text-center p-8 bg-slate-50 rounded-lg">
            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-semibold mb-2">No Documents Yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Upload brand documents to start learning your brand voice
            </p>
            <Button variant="outline" size="sm">
              <Upload className="mr-2 h-4 w-4" />
              Upload Documents
            </Button>
          </div>
        ) : !voiceProfile ? (
          <div className="text-center p-8 bg-purple-50 rounded-lg">
            <Brain className="h-12 w-12 mx-auto mb-4 text-purple-600" />
            <h3 className="font-semibold mb-2">Ready to Learn Your Voice</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Click "Analyze Voice" to let AI learn from your {documentCount} document{documentCount !== 1 ? 's' : ''}
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Check className="h-4 w-4 text-green-600" />
                <span>Writing patterns</span>
              </div>
              <div className="flex items-center gap-1">
                <Check className="h-4 w-4 text-green-600" />
                <span>Tone consistency</span>
              </div>
              <div className="flex items-center gap-1">
                <Check className="h-4 w-4 text-green-600" />
                <span>Key phrases</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Voice Profile Results */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                <div className="text-3xl font-bold text-purple-600">
                  {voiceProfile.consistencyScore}%
                </div>
                <div className="text-sm text-muted-foreground mt-1">Voice Consistency</div>
              </div>
              <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                <div className="text-3xl font-bold text-blue-600">
                  {voiceProfile.documentsAnalyzed}
                </div>
                <div className="text-sm text-muted-foreground mt-1">Docs Analyzed</div>
              </div>
              <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                <div className="text-3xl font-bold text-green-600">
                  {voiceProfile.totalWords}
                </div>
                <div className="text-sm text-muted-foreground mt-1">Words Analyzed</div>
              </div>
              <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
                <div className="text-3xl font-bold text-orange-600">
                  {voiceProfile.confidenceScore}%
                </div>
                <div className="text-sm text-muted-foreground mt-1">AI Confidence</div>
              </div>
            </div>

            {/* Dominant Tone */}
            {voiceProfile.dominantTone && (
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Target className="h-4 w-4 text-purple-600" />
                  Dominant Tone
                </h4>
                <div className="flex flex-wrap gap-2">
                  {voiceProfile.dominantTone.map((tone: any, i: number) => (
                    <Badge key={i} className="bg-purple-100 text-purple-700">
                      {tone.tone} ({tone.percentage}%)
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Writing Patterns */}
            {voiceProfile.writingPatterns && (
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-600" />
                  Writing Patterns
                </h4>
                <div className="grid md:grid-cols-2 gap-3">
                  {voiceProfile.writingPatterns.map((pattern: string, i: number) => (
                    <div key={i} className="flex items-start gap-2 p-3 bg-slate-50 rounded-lg">
                      <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{pattern}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Common Phrases */}
            {voiceProfile.commonPhrases && (
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Hash className="h-4 w-4 text-green-600" />
                  Common Phrases & Vocabulary
                </h4>
                <div className="flex flex-wrap gap-2">
                  {voiceProfile.commonPhrases.slice(0, 20).map((phrase: string, i: number) => (
                    <Badge key={i} variant="outline">
                      {phrase}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {voiceProfile.recommendations && (
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-yellow-600" />
                  AI Recommendations
                </h4>
                <div className="space-y-2">
                  {voiceProfile.recommendations.map((rec: string, i: number) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                      <Lightbulb className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Last Analyzed */}
            {voiceProfile.analyzedAt && (
              <p className="text-xs text-muted-foreground text-center">
                Last analyzed: {new Date(voiceProfile.analyzedAt).toLocaleString()}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function CreateBrandForm({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    tagline: '',
    description: '',
    website: '',
  });
  const [uploading, setUploading] = useState(false);
  const [scrapingWebsite, setScrapingWebsite] = useState(false);
  const [saving, setSaving] = useState(false);
  const [creationMethod, setCreationMethod] = useState<'manual' | 'document' | 'website'>('manual');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formDataObj = new FormData();
    formDataObj.append('file', file);

    try {
      const response = await fetch('/api/brands/extract', {
        method: 'POST',
        body: formDataObj,
      });

      const data = await response.json();
      if (data.success) {
        setFormData((prev) => ({
          ...prev,
          name: data.data.name || prev.name,
          industry: data.data.industry || prev.industry,
          tagline: data.data.tagline || prev.tagline,
          description: data.data.description || prev.description,
        }));
      }
    } catch (error) {
      console.error('Failed to extract brand data:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleWebsiteScrape = async () => {
    if (!formData.website) return;

    setScrapingWebsite(true);
    try {
      const response = await fetch('/api/brands/scrape-website', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: formData.website }),
      });

      const data = await response.json();
      if (data.success) {
        setFormData((prev) => ({
          ...prev,
          name: data.data.name || prev.name,
          industry: data.data.industry || prev.industry,
          tagline: data.data.tagline || prev.tagline,
          description: data.data.description || prev.description,
        }));
        alert('Brand information extracted successfully!');
      } else {
        // More detailed error message
        const errorMsg = data.error || 'Failed to scrape website';
        const details = data.details ? `\n\nDetails: ${data.details}` : '';
        
        if (errorMsg.includes('API key')) {
          alert(`⚠️ OpenAI API Key Missing!\n\nPlease add OPENAI_API_KEY to your .env file to use AI features.\n\nGet your API key from: https://platform.openai.com/api-keys${details}`);
        } else {
          alert(`❌ ${errorMsg}${details}`);
        }
      }
    } catch (error) {
      console.error('Failed to scrape website:', error);
      alert('❌ Network error: Failed to connect to the scraping service. Please check your internet connection and try again.');
    } finally {
      setScrapingWebsite(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch('/api/brands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        onSuccess();
      }
    } catch (error) {
      console.error('Failed to create brand:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Brand</CardTitle>
        <CardDescription>
          Create a brand profile manually, from documents, or by scraping a website
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Creation Method Tabs */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          <Button
            type="button"
            variant={creationMethod === 'manual' ? 'default' : 'outline'}
            onClick={() => setCreationMethod('manual')}
            className="flex flex-col h-auto py-4"
          >
            <Edit className="h-5 w-5 mb-2" />
            <span className="text-sm">Manual Entry</span>
          </Button>
          <Button
            type="button"
            variant={creationMethod === 'document' ? 'default' : 'outline'}
            onClick={() => setCreationMethod('document')}
            className="flex flex-col h-auto py-4"
          >
            <Upload className="h-5 w-5 mb-2" />
            <span className="text-sm">Upload Document</span>
          </Button>
          <Button
            type="button"
            variant={creationMethod === 'website' ? 'default' : 'outline'}
            onClick={() => setCreationMethod('website')}
            className="flex flex-col h-auto py-4"
          >
            <Globe className="h-5 w-5 mb-2" />
            <span className="text-sm">Scrape Website</span>
          </Button>
        </div>

        {/* Document Upload Method */}
        {creationMethod === 'document' && (
          <div className="border-2 border-dashed rounded-lg p-6 text-center mb-6">
            <Upload className="h-8 w-8 mx-auto mb-2 text-slate-400" />
            <p className="text-sm text-slate-600 mb-2">
              Upload brand documents (PDF, DOCX, TXT)
            </p>
            <Input
              type="file"
              accept=".pdf,.docx,.txt"
              onChange={handleFileUpload}
              disabled={uploading}
            />
            {uploading && <p className="text-sm text-purple-600 mt-2">Extracting brand information...</p>}
          </div>
        )}

        {/* Website Scraping Method */}
        {creationMethod === 'website' && (
          <div className="border-2 border-purple-200 rounded-lg p-6 mb-6 bg-purple-50">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="h-5 w-5 text-purple-600" />
              <h3 className="font-semibold">Scrape Brand from Website</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Enter your brand's website URL and we'll automatically extract mission, vision, tone, and voice
            </p>
            <div className="flex gap-2">
              <Input
                type="url"
                placeholder="https://yourwebsite.com"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                disabled={scrapingWebsite}
              />
              <Button
                type="button"
                onClick={handleWebsiteScrape}
                disabled={!formData.website || scrapingWebsite}
              >
                {scrapingWebsite ? (
                  <>
                    <Brain className="mr-2 h-4 w-4 animate-pulse" />
                    Scraping...
                  </>
                ) : (
                  <>
                    <Globe className="mr-2 h-4 w-4" />
                    Extract
                  </>
                )}
              </Button>
            </div>
            {scrapingWebsite && (
              <div className="mt-4 p-3 bg-white rounded-lg">
                <div className="flex items-center gap-2 text-sm text-purple-600">
                  <Brain className="h-4 w-4 animate-spin" />
                  <span>Analyzing website content...</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Brand Name *</label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">Industry</label>
              <Input
                value={formData.industry}
                onChange={(e) =>
                  setFormData({ ...formData, industry: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium">Tagline</label>
              <Input
                value={formData.tagline}
                onChange={(e) =>
                  setFormData({ ...formData, tagline: e.target.value })
                }
                placeholder="Your brand's memorable tagline"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Description</label>
              <textarea
                className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Brief description of your brand"
              />
            </div>

            {formData.website && (
              <div>
                <label className="text-sm font-medium">Website</label>
                <Input
                  type="url"
                  value={formData.website}
                  onChange={(e) =>
                    setFormData({ ...formData, website: e.target.value })
                  }
                  placeholder="https://yourwebsite.com"
                />
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-4 border-t">
            <Button type="submit" disabled={saving || !formData.name}>
              {saving ? 'Creating...' : 'Create Brand'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

// Brand Card Component (Grid View)
function BrandCard({ 
  brand, 
  isActive,
  onSelect,
  onUpdate 
}: { 
  brand: any; 
  isActive: boolean;
  onSelect: () => void;
  onUpdate: () => void;
}) {
  return (
    <Card 
      className={`hover:shadow-lg transition-all cursor-pointer ${
        isActive ? 'ring-2 ring-purple-600' : ''
      }`}
      onClick={onSelect}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            {brand.name}
            {isActive && (
              <Badge variant="secondary" className="ml-2">Active</Badge>
            )}
            {brand.isClientBrand && (
              <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700 border-blue-300">
                <Building2 className="h-3 w-3 mr-1" />
                Client
              </Badge>
            )}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              // Handle delete
            }}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
        {brand.industry && (
          <CardDescription>{brand.industry}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-3 text-sm">
          {brand.tagline && (
            <div className="text-muted-foreground italic">
              "{brand.tagline}"
            </div>
          )}
          
          {brand.tone && brand.tone.length > 0 && (
            <div>
              <span className="font-medium">Tone:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {brand.tone.slice(0, 3).map((t: string, i: number) => (
                  <Badge key={i} variant="outline" className="text-xs">{t}</Badge>
                ))}
                {brand.tone.length > 3 && (
                  <Badge variant="outline" className="text-xs">+{brand.tone.length - 3}</Badge>
                )}
              </div>
            </div>
          )}

          <div className="grid grid-cols-3 gap-2 pt-3 border-t text-center">
            <div>
              <div className="text-lg font-bold text-purple-600">
                {brand.documents?.length || 0}
              </div>
              <div className="text-xs text-muted-foreground">Docs</div>
            </div>
            <div>
              <div className="text-lg font-bold text-blue-600">
                {brand.keywords?.length || 0}
              </div>
              <div className="text-xs text-muted-foreground">Keywords</div>
            </div>
            <div>
              <div className="text-lg font-bold text-green-600">
                {brand.tone?.length || 0}
              </div>
              <div className="text-xs text-muted-foreground">Tones</div>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              // Copy brand
            }}
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Brand List Item Component (List View)
function BrandListItem({
  brand,
  isActive,
  onSelect,
  onUpdate
}: {
  brand: any;
  isActive: boolean;
  onSelect: () => void;
  onUpdate: () => void;
}) {
  return (
    <Card 
      className={`cursor-pointer hover:shadow-md transition-all ${
        isActive ? 'ring-2 ring-purple-600' : ''
      }`}
      onClick={onSelect}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <Brain className="h-10 w-10 text-purple-600 flex-shrink-0" />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold truncate">{brand.name}</h3>
              {isActive && <Badge variant="secondary">Active</Badge>}
              {brand.isClientBrand && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
                  <Building2 className="h-3 w-3 mr-1" />
                  Client
                </Badge>
              )}
            </div>
            {brand.industry && (
              <p className="text-sm text-muted-foreground">{brand.industry}</p>
            )}
          </div>

          <div className="flex items-center gap-8">
            <div className="text-center">
              <div className="text-lg font-bold">{brand.documents?.length || 0}</div>
              <div className="text-xs text-muted-foreground">Documents</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold">{brand.tone?.length || 0}</div>
              <div className="text-xs text-muted-foreground">Tones</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold">{brand.keywords?.length || 0}</div>
              <div className="text-xs text-muted-foreground">Keywords</div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Copy className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Brand Documents Component
function BrandDocuments({ brand, onUpdate }: { brand: any; onUpdate: () => void }) {
  const [uploading, setUploading] = useState(false);
  const [documents, setDocuments] = useState<any[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(true);

  useEffect(() => {
    fetchDocuments();
  }, [brand.id]);

  const fetchDocuments = async () => {
    try {
      const response = await fetch(`/api/brands/${brand.id}/documents`);
      const data = await response.json();
      setDocuments(data.documents || []);
    } catch (error) {
      console.error('Failed to fetch documents:', error);
    } finally {
      setLoadingDocs(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    
    // Upload files one by one
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('brandId', brand.id);

      try {
        const response = await fetch('/api/brands/upload-document', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          console.log(`Uploaded ${file.name}`);
        }
      } catch (error) {
        console.error(`Failed to upload ${file.name}:`, error);
      }
    }

    setUploading(false);
    fetchDocuments();
    onUpdate();
    
    // Reset file input
    e.target.value = '';
  };

  const handleDeleteDocument = async (docId: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return;

    try {
      const response = await fetch(`/api/brands/${brand.id}/documents/${docId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchDocuments();
        onUpdate();
      }
    } catch (error) {
      console.error('Failed to delete document:', error);
    }
  };

  const handleReparse = async (docId: string) => {
    try {
      const response = await fetch(`/api/brands/${brand.id}/documents/${docId}/reparse`, {
        method: 'POST',
      });

      if (response.ok) {
        alert('Document re-parsed successfully!');
        fetchDocuments();
        onUpdate();
      }
    } catch (error) {
      console.error('Failed to re-parse document:', error);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Documents</CardTitle>
          <CardDescription>
            Upload and manage brand documents for {brand.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed rounded-lg p-8 text-center">
            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-medium mb-2">Upload Documents</h3>
            <p className="text-sm text-muted-foreground mb-4">
              PDF, DOCX, TXT - Upload multiple files at once (up to 10 files)
            </p>
            <div className="flex items-center justify-center gap-2">
              <Input
                type="file"
                accept=".pdf,.docx,.txt"
                multiple
                onChange={handleFileUpload}
                disabled={uploading}
                className="max-w-md"
              />
              {uploading && (
                <div className="flex items-center gap-2 text-sm text-purple-600">
                  <Brain className="h-4 w-4 animate-spin" />
                  <span>Uploading...</span>
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              AI will automatically extract brand voice, tone, and patterns from your documents
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Documents List */}
      {loadingDocs ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="animate-pulse">
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p>Loading documents...</p>
            </div>
          </CardContent>
        </Card>
      ) : documents.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-semibold mb-2">No documents yet</h3>
            <p className="text-sm text-muted-foreground">
              Upload brand documents to help AI understand your brand voice
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">
              Uploaded Documents ({documents.length})
            </h3>
            <Badge variant="secondary">
              {documents.length} / 10 files
            </Badge>
          </div>

          {documents.map((doc) => (
            <Card key={doc.id}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                    <FileText className="h-6 w-6 text-purple-600" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{doc.name}</h4>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      <span>{doc.type}</span>
                      <span>•</span>
                      <span>{doc.size}</span>
                      <span>•</span>
                      <span>Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {doc.status === 'processed' && (
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        Processed
                      </Badge>
                    )}
                    {doc.status === 'processing' && (
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                        Processing...
                      </Badge>
                    )}
                    {doc.status === 'failed' && (
                      <Badge variant="secondary" className="bg-red-100 text-red-700">
                        Failed
                      </Badge>
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleReparse(doc.id)}
                      disabled={doc.status === 'processing'}
                    >
                      <Brain className="h-4 w-4 mr-1" />
                      Re-parse
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteDocument(doc.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Document Insights */}
                {doc.insights && (
                  <div className="mt-3 pt-3 border-t">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Words:</span>
                        <span className="font-medium ml-2">{doc.insights.wordCount || 0}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Tone:</span>
                        <span className="font-medium ml-2">{doc.insights.detectedTone || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Confidence:</span>
                        <span className="font-medium ml-2">{doc.insights.confidence || 0}%</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// Brand Assets Component
function BrandAssets({ brand, onUpdate }: { brand: any; onUpdate: () => void }) {
  const [uploading, setUploading] = useState(false);
  const [assets, setAssets] = useState<any[]>([]);
  const [loadingAssets, setLoadingAssets] = useState(true);
  const [assetType, setAssetType] = useState<'all' | 'logo' | 'image' | 'video'>('all');
  const [view, setView] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    fetchAssets();
  }, [brand.id]);

  const fetchAssets = async () => {
    try {
      const response = await fetch(`/api/brands/${brand.id}/assets`);
      const data = await response.json();
      setAssets(data.assets || []);
    } catch (error) {
      console.error('Failed to fetch assets:', error);
    } finally {
      setLoadingAssets(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('brandId', brand.id);
      formData.append('type', type);

      try {
        const response = await fetch('/api/brands/upload-asset', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          console.log(`Uploaded ${file.name}`);
        }
      } catch (error) {
        console.error(`Failed to upload ${file.name}:`, error);
      }
    }

    setUploading(false);
    fetchAssets();
    onUpdate();
    e.target.value = '';
  };

  const handleDeleteAsset = async (assetId: string) => {
    if (!confirm('Are you sure you want to delete this asset?')) return;

    try {
      const response = await fetch(`/api/brands/${brand.id}/assets/${assetId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchAssets();
        onUpdate();
      }
    } catch (error) {
      console.error('Failed to delete asset:', error);
    }
  };

  const filteredAssets = assetType === 'all' 
    ? assets 
    : assets.filter(a => a.type === assetType);

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle>Asset Library</CardTitle>
          <CardDescription>
            Manage logos, images, and videos for {brand.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {/* Logo Upload */}
            <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-purple-300 transition-colors">
              <ImageIcon className="h-10 w-10 mx-auto mb-3 text-purple-600" />
              <h3 className="font-medium mb-2">Upload Logo</h3>
              <p className="text-xs text-muted-foreground mb-3">
                PNG, SVG (transparent background)
              </p>
              <Input
                type="file"
                accept=".png,.svg,.jpg,.jpeg"
                multiple
                onChange={(e) => handleFileUpload(e, 'logo')}
                disabled={uploading}
                className="text-xs"
              />
            </div>

            {/* Image Upload */}
            <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-blue-300 transition-colors">
              <ImageIcon className="h-10 w-10 mx-auto mb-3 text-blue-600" />
              <h3 className="font-medium mb-2">Upload Images</h3>
              <p className="text-xs text-muted-foreground mb-3">
                Brand photos, graphics
              </p>
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleFileUpload(e, 'image')}
                disabled={uploading}
                className="text-xs"
              />
            </div>

            {/* Video Upload */}
            <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-green-300 transition-colors">
              <FileText className="h-10 w-10 mx-auto mb-3 text-green-600" />
              <h3 className="font-medium mb-2">Upload Videos</h3>
              <p className="text-xs text-muted-foreground mb-3">
                Brand videos, B-roll
              </p>
              <Input
                type="file"
                accept="video/*"
                multiple
                onChange={(e) => handleFileUpload(e, 'video')}
                disabled={uploading}
                className="text-xs"
              />
            </div>
          </div>

          {uploading && (
            <div className="mt-4 p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-purple-600">
                <Brain className="h-4 w-4 animate-spin" />
                <span>Uploading assets...</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Asset Filters */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button
            variant={assetType === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setAssetType('all')}
          >
            All ({assets.length})
          </Button>
          <Button
            variant={assetType === 'logo' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setAssetType('logo')}
          >
            Logos ({assets.filter(a => a.type === 'logo').length})
          </Button>
          <Button
            variant={assetType === 'image' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setAssetType('image')}
          >
            Images ({assets.filter(a => a.type === 'image').length})
          </Button>
          <Button
            variant={assetType === 'video' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setAssetType('video')}
          >
            Videos ({assets.filter(a => a.type === 'video').length})
          </Button>
        </div>

        <div className="flex gap-2">
          <Button
            variant={view === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setView('grid')}
          >
            Grid
          </Button>
          <Button
            variant={view === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setView('list')}
          >
            List
          </Button>
        </div>
      </div>

      {/* Assets List */}
      {loadingAssets ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="animate-pulse">
              <ImageIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p>Loading assets...</p>
            </div>
          </CardContent>
        </Card>
      ) : filteredAssets.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <ImageIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-semibold mb-2">No assets yet</h3>
            <p className="text-sm text-muted-foreground">
              Upload logos, images, and videos to build your brand asset library
            </p>
          </CardContent>
        </Card>
      ) : view === 'grid' ? (
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredAssets.map((asset) => (
            <Card key={asset.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-square bg-slate-100 flex items-center justify-center relative group">
                {asset.type === 'video' ? (
                  <FileText className="h-16 w-16 text-slate-400" />
                ) : asset.thumbnail ? (
                  <img
                    src={asset.thumbnail}
                    alt={asset.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon className="h-16 w-16 text-slate-400" />
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleDeleteAsset(asset.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-3">
                <h4 className="font-medium text-sm truncate">{asset.name}</h4>
                <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                  <span>{asset.size}</span>
                  <Badge variant="secondary" className="text-xs">
                    {asset.type}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredAssets.map((asset) => (
            <Card key={asset.id}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-16 h-16 rounded-lg bg-slate-100 flex items-center justify-center">
                    {asset.type === 'video' ? (
                      <FileText className="h-8 w-8 text-slate-400" />
                    ) : asset.thumbnail ? (
                      <img
                        src={asset.thumbnail}
                        alt={asset.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <ImageIcon className="h-8 w-8 text-slate-400" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{asset.name}</h4>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      <span>{asset.size}</span>
                      <span>•</span>
                      <span>Uploaded {new Date(asset.uploadedAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{asset.type}</Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteAsset(asset.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Brand Colors */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Brand Colors</CardTitle>
          <CardDescription>Define your brand color palette</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {brand.brandColors && brand.brandColors.length > 0 ? (
              brand.brandColors.map((color: string, i: number) => (
                <div key={i} className="text-center">
                  <div
                    className="w-20 h-20 rounded-lg border-2 border-slate-200 shadow-sm"
                    style={{ backgroundColor: color }}
                  />
                  <p className="text-xs font-medium mt-2">{color}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                No brand colors defined. Edit brand to add colors.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Brand Settings Component
function BrandSettings({ brand, onUpdate }: { brand: any; onUpdate: () => void }) {
  const [activeSection, setActiveSection] = useState<'settings' | 'templates'>('settings');

  return (
    <div className="space-y-6">
      {/* Section Tabs */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setActiveSection('settings')}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeSection === 'settings'
              ? 'border-purple-600 text-purple-600'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Brand Settings
        </button>
        <button
          onClick={() => setActiveSection('templates')}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeSection === 'templates'
              ? 'border-purple-600 text-purple-600'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Brand Templates
        </button>
      </div>

      {/* Settings Section */}
      {activeSection === 'settings' && (
        <Card>
          <CardHeader>
            <CardTitle>Brand Settings</CardTitle>
            <CardDescription>
              Configure settings for {brand.name}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Set as Default Brand</h4>
                <p className="text-sm text-muted-foreground">
                  Use this brand by default in all generators
                </p>
              </div>
              <Button variant="outline">Set Default</Button>
            </div>

            <div className="flex items-center justify-between border-t pt-4">
              <div>
                <h4 className="font-medium">Duplicate Brand</h4>
                <p className="text-sm text-muted-foreground">
                  Create a copy of this brand profile
                </p>
              </div>
              <Button variant="outline">
                <Copy className="mr-2 h-4 w-4" />
                Duplicate
              </Button>
            </div>

            <div className="flex items-center justify-between border-t pt-4">
              <div>
                <h4 className="font-medium text-red-600">Delete Brand</h4>
                <p className="text-sm text-muted-foreground">
                  Permanently delete this brand and all its data
                </p>
              </div>
              <Button variant="destructive">
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Templates Section */}
      {activeSection === 'templates' && (
        <BrandTemplates brand={brand} onUpdate={onUpdate} />
      )}
    </div>
  );
}


// Brand Comparison Component
function BrandComparison({ brands }: { brands: any[] }) {
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [comparing, setComparing] = useState(false);

  const toggleBrand = (brandId: string) => {
    if (selectedBrands.includes(brandId)) {
      setSelectedBrands(selectedBrands.filter(id => id !== brandId));
    } else if (selectedBrands.length < 3) {
      setSelectedBrands([...selectedBrands, brandId]);
    }
  };

  const selectedBrandData = brands.filter(b => selectedBrands.includes(b.id));

  return (
    <div className="space-y-6">
      {/* Brand Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Compare Brands</CardTitle>
          <CardDescription>
            Select up to 3 brands to compare side-by-side (Selected: {selectedBrands.length}/3)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-3">
            {brands.map((brand) => {
              const isSelected = selectedBrands.includes(brand.id);
              return (
                <button
                  key={brand.id}
                  onClick={() => toggleBrand(brand.id)}
                  disabled={!isSelected && selectedBrands.length >= 3}
                  className={`
                    p-4 rounded-lg border-2 text-left transition-all
                    ${isSelected 
                      ? 'border-purple-500 bg-purple-50' 
                      : 'border-slate-200 hover:border-purple-300'
                    }
                    ${!isSelected && selectedBrands.length >= 3 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'cursor-pointer'
                    }
                  `}
                >
                  <div className="flex items-start justify-between mb-2">
                    <Brain className={`h-5 w-5 ${isSelected ? 'text-purple-600' : 'text-slate-400'}`} />
                    {isSelected && (
                      <Check className="h-5 w-5 text-purple-600" />
                    )}
                  </div>
                  <h4 className="font-semibold text-sm mb-1">{brand.name}</h4>
                  <p className="text-xs text-muted-foreground">{brand.industry || 'No industry'}</p>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Comparison Results */}
      {selectedBrandData.length > 0 && (
        <div className="space-y-4">
          {/* Stats Comparison */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Key Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-medium text-muted-foreground">Metric</th>
                      {selectedBrandData.map((brand) => (
                        <th key={brand.id} className="text-left p-3 font-medium">
                          {brand.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-3 font-medium">Industry</td>
                      {selectedBrandData.map((brand) => (
                        <td key={brand.id} className="p-3">
                          {brand.industry || '-'}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="p-3 font-medium">Documents</td>
                      {selectedBrandData.map((brand) => (
                        <td key={brand.id} className="p-3">
                          <Badge variant="secondary">
                            {brand.documents?.length || 0}
                          </Badge>
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="p-3 font-medium">Assets</td>
                      {selectedBrandData.map((brand) => (
                        <td key={brand.id} className="p-3">
                          <Badge variant="secondary">
                            {brand.assets?.length || 0}
                          </Badge>
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="p-3 font-medium">Keywords</td>
                      {selectedBrandData.map((brand) => (
                        <td key={brand.id} className="p-3">
                          <Badge variant="secondary">
                            {brand.keywords?.length || 0}
                          </Badge>
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="p-3 font-medium">Voice Analyzed</td>
                      {selectedBrandData.map((brand) => (
                        <td key={brand.id} className="p-3">
                          {brand.voiceProfile ? (
                            <Check className="h-5 w-5 text-green-600" />
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Tone Comparison */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Brand Tone</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {selectedBrandData.map((brand) => (
                  <div key={brand.id} className="space-y-2">
                    <h4 className="font-semibold">{brand.name}</h4>
                    <div className="flex flex-wrap gap-2">
                      {brand.tone && brand.tone.length > 0 ? (
                        brand.tone.map((t: string, i: number) => (
                          <Badge key={i} variant="secondary">{t}</Badge>
                        ))
                      ) : (
                        <span className="text-sm text-muted-foreground">No tone defined</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Voice Profile Comparison */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Voice Profile Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {selectedBrandData.map((brand) => (
                  <div key={brand.id} className="space-y-3 p-4 border rounded-lg">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Brain className="h-4 w-4 text-purple-600" />
                      {brand.name}
                    </h4>
                    {brand.voiceProfile ? (
                      <div className="space-y-3">
                        <div>
                          <span className="text-xs text-muted-foreground">Consistency Score</span>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-purple-600 rounded-full"
                                style={{ width: `${brand.voiceProfile.consistencyScore}%` }}
                              />
                            </div>
                            <span className="text-sm font-semibold">
                              {brand.voiceProfile.consistencyScore}%
                            </span>
                          </div>
                        </div>
                        <div>
                          <span className="text-xs text-muted-foreground">Dominant Tone</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {brand.voiceProfile.dominantTone?.slice(0, 2).map((tone: any, i: number) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {tone.tone}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <span className="text-xs text-muted-foreground">Writing Patterns</span>
                          <ul className="mt-1 space-y-1">
                            {brand.voiceProfile.writingPatterns?.slice(0, 3).map((pattern: string, i: number) => (
                              <li key={i} className="text-xs flex items-start gap-1">
                                <Check className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                                <span>{pattern}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <Brain className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">
                          Voice not analyzed yet
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Target Audience Comparison */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Target Audience</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {selectedBrandData.map((brand) => (
                  <div key={brand.id} className="space-y-2">
                    <h4 className="font-semibold">{brand.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {brand.targetAudience || 'No target audience defined'}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Keywords Comparison */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Brand Keywords</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {selectedBrandData.map((brand) => (
                  <div key={brand.id} className="space-y-2">
                    <h4 className="font-semibold">{brand.name}</h4>
                    <div className="flex flex-wrap gap-1">
                      {brand.keywords && brand.keywords.length > 0 ? (
                        brand.keywords.slice(0, 10).map((keyword: string, i: number) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {keyword}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-sm text-muted-foreground">No keywords</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Brand Colors Comparison */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Brand Colors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {selectedBrandData.map((brand) => (
                  <div key={brand.id} className="space-y-2">
                    <h4 className="font-semibold">{brand.name}</h4>
                    <div className="flex flex-wrap gap-2">
                      {brand.brandColors && brand.brandColors.length > 0 ? (
                        brand.brandColors.map((color: string, i: number) => (
                          <div key={i} className="text-center">
                            <div
                              className="w-12 h-12 rounded border-2 border-slate-200"
                              style={{ backgroundColor: color }}
                            />
                            <p className="text-xs mt-1">{color}</p>
                          </div>
                        ))
                      ) : (
                        <span className="text-sm text-muted-foreground">No colors defined</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {selectedBrandData.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <BarChart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-semibold mb-2">No Brands Selected</h3>
            <p className="text-sm text-muted-foreground">
              Select brands above to see side-by-side comparison
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}


// Brand Templates Component
function BrandTemplates({ brand, onUpdate }: { brand: any; onUpdate: () => void }) {
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [templateType, setTemplateType] = useState<'all' | 'caption' | 'hook' | 'cta' | 'content'>('all');

  useEffect(() => {
    fetchTemplates();
  }, [brand.id]);

  const fetchTemplates = async () => {
    try {
      const response = await fetch(`/api/brands/${brand.id}/templates`);
      const data = await response.json();
      setTemplates(data.templates || []);
    } catch (error) {
      console.error('Failed to fetch templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return;

    try {
      const response = await fetch(`/api/brands/${brand.id}/templates/${templateId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchTemplates();
        onUpdate();
      }
    } catch (error) {
      console.error('Failed to delete template:', error);
    }
  };

  const filteredTemplates = templateType === 'all'
    ? templates
    : templates.filter(t => t.type === templateType);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Brand Templates</CardTitle>
              <CardDescription>
                Create reusable templates for {brand.name}
              </CardDescription>
            </div>
            <Button onClick={() => setShowCreateForm(!showCreateForm)}>
              <Plus className="mr-2 h-4 w-4" />
              {showCreateForm ? 'Cancel' : 'Create Template'}
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Create Template Form */}
      {showCreateForm && (
        <CreateTemplateForm
          brandId={brand.id}
          onSuccess={() => {
            setShowCreateForm(false);
            fetchTemplates();
            onUpdate();
          }}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      {/* Template Filters */}
      <div className="flex gap-2">
        <Button
          variant={templateType === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setTemplateType('all')}
        >
          All ({templates.length})
        </Button>
        <Button
          variant={templateType === 'caption' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setTemplateType('caption')}
        >
          Captions ({templates.filter(t => t.type === 'caption').length})
        </Button>
        <Button
          variant={templateType === 'hook' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setTemplateType('hook')}
        >
          Hooks ({templates.filter(t => t.type === 'hook').length})
        </Button>
        <Button
          variant={templateType === 'cta' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setTemplateType('cta')}
        >
          CTAs ({templates.filter(t => t.type === 'cta').length})
        </Button>
        <Button
          variant={templateType === 'content' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setTemplateType('content')}
        >
          Content ({templates.filter(t => t.type === 'content').length})
        </Button>
      </div>

      {/* Templates List */}
      {loading ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="animate-pulse">
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p>Loading templates...</p>
            </div>
          </CardContent>
        </Card>
      ) : filteredTemplates.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-semibold mb-2">No templates yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Create reusable templates for your brand content
            </p>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create First Template
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <Badge variant="secondary">{template.type}</Badge>
                    </div>
                    {template.description && (
                      <CardDescription>{template.description}</CardDescription>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteTemplate(template.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-sm whitespace-pre-wrap">{template.content}</p>
                  </div>

                  {template.variables && template.variables.length > 0 && (
                    <div>
                      <h4 className="text-xs font-medium text-muted-foreground mb-2">
                        Variables:
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {template.variables.map((variable: string, i: number) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {`{${variable}}`}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {template.tags && template.tags.length > 0 && (
                    <div>
                      <h4 className="text-xs font-medium text-muted-foreground mb-2">
                        Tags:
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {template.tags.map((tag: string, i: number) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-3">
                    <span>Created {new Date(template.createdAt).toLocaleDateString()}</span>
                    <Button variant="outline" size="sm">
                      <Copy className="h-3 w-3 mr-1" />
                      Use Template
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// Create Template Form Component
function CreateTemplateForm({
  brandId,
  onSuccess,
  onCancel,
}: {
  brandId: string;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'caption',
    description: '',
    content: '',
    variables: '',
    tags: '',
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch('/api/brands/create-template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brandId,
          name: formData.name,
          type: formData.type,
          description: formData.description,
          content: formData.content,
          variables: formData.variables.split(',').map(v => v.trim()).filter(v => v),
          tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
        }),
      });

      if (response.ok) {
        onSuccess();
      } else {
        alert('Failed to create template');
      }
    } catch (error) {
      console.error('Failed to create template:', error);
      alert('Failed to create template');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Template</CardTitle>
        <CardDescription>
          Create a reusable template for your brand content
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Template Name *</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="E.g., Product Launch Caption"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">Type *</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                required
              >
                <option value="caption">Caption</option>
                <option value="hook">Hook</option>
                <option value="cta">CTA</option>
                <option value="content">Content</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Description</label>
            <Input
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of when to use this template"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Template Content *</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="Write your template here... Use {variable} for dynamic content"
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              Use curly braces for variables: {`{product_name}, {benefit}, {cta}`}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Variables</label>
              <Input
                value={formData.variables}
                onChange={(e) => setFormData({ ...formData, variables: e.target.value })}
                placeholder="product_name, benefit, cta"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Comma-separated variable names
              </p>
            </div>

            <div>
              <label className="text-sm font-medium">Tags</label>
              <Input
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="product, launch, sales"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Comma-separated tags for organization
              </p>
            </div>
          </div>

          <div className="flex gap-2 pt-4 border-t">
            <Button type="submit" disabled={saving}>
              {saving ? 'Creating...' : 'Create Template'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}


// Agency Mode Card Component
function AgencyModeCard({ brand, onUpdate }: { brand: any; onUpdate: () => void }) {
  const [isAgencyMode, setIsAgencyMode] = useState(brand.isClientBrand || false);
  const [showClientForm, setShowClientForm] = useState(false);
  const [clientInfo, setClientInfo] = useState({
    clientName: brand.clientName || '',
    clientEmail: brand.clientEmail || '',
    clientCompany: brand.clientCompany || '',
    accessLevel: brand.accessLevel || 'view',
  });
  const [saving, setSaving] = useState(false);

  const handleToggleAgencyMode = async () => {
    setSaving(true);
    try {
      const response = await fetch(`/api/brands/${brand.id}/agency-mode`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isClientBrand: !isAgencyMode,
        }),
      });

      if (response.ok) {
        setIsAgencyMode(!isAgencyMode);
        onUpdate();
      }
    } catch (error) {
      console.error('Failed to toggle agency mode:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveClientInfo = async () => {
    setSaving(true);
    try {
      const response = await fetch(`/api/brands/${brand.id}/client-info`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clientInfo),
      });

      if (response.ok) {
        setShowClientForm(false);
        onUpdate();
        alert('Client information saved successfully!');
      }
    } catch (error) {
      console.error('Failed to save client info:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-blue-600" />
              Agency Mode
            </CardTitle>
            <CardDescription>
              Manage this brand on behalf of a client
            </CardDescription>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">
              {isAgencyMode ? 'Client Brand' : 'Your Brand'}
            </span>
            <button
              onClick={handleToggleAgencyMode}
              disabled={saving}
              className={`
                relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                ${isAgencyMode ? 'bg-blue-600' : 'bg-slate-200'}
                ${saving ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <span
                className={`
                  inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                  ${isAgencyMode ? 'translate-x-6' : 'translate-x-1'}
                `}
              />
            </button>
          </div>
        </div>
      </CardHeader>

      {isAgencyMode && (
        <CardContent>
          {!showClientForm ? (
            <div className="space-y-4">
              {/* Client Info Display */}
              {clientInfo.clientName || clientInfo.clientEmail ? (
                <div className="p-4 bg-blue-50 rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-blue-900">Client Information</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowClientForm(true)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-3 text-sm">
                    {clientInfo.clientName && (
                      <div>
                        <span className="text-muted-foreground">Name:</span>
                        <span className="font-medium ml-2">{clientInfo.clientName}</span>
                      </div>
                    )}
                    {clientInfo.clientEmail && (
                      <div>
                        <span className="text-muted-foreground">Email:</span>
                        <span className="font-medium ml-2">{clientInfo.clientEmail}</span>
                      </div>
                    )}
                    {clientInfo.clientCompany && (
                      <div>
                        <span className="text-muted-foreground">Company:</span>
                        <span className="font-medium ml-2">{clientInfo.clientCompany}</span>
                      </div>
                    )}
                    <div>
                      <span className="text-muted-foreground">Access Level:</span>
                      <Badge variant="secondary" className="ml-2">
                        {clientInfo.accessLevel}
                      </Badge>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center p-6 bg-slate-50 rounded-lg">
                  <Building2 className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
                  <h4 className="font-semibold mb-2">Add Client Information</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Add details about the client who owns this brand
                  </p>
                  <Button onClick={() => setShowClientForm(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Client Info
                  </Button>
                </div>
              )}

              {/* Agency Features */}
              <div className="grid md:grid-cols-3 gap-3 pt-4 border-t">
                <div className="text-center p-4 bg-white border rounded-lg">
                  <Check className="h-6 w-6 mx-auto mb-2 text-green-600" />
                  <h5 className="font-medium text-sm">Client Portal Access</h5>
                  <p className="text-xs text-muted-foreground mt-1">
                    Client can view their brand
                  </p>
                </div>
                <div className="text-center p-4 bg-white border rounded-lg">
                  <Check className="h-6 w-6 mx-auto mb-2 text-green-600" />
                  <h5 className="font-medium text-sm">Approval Workflow</h5>
                  <p className="text-xs text-muted-foreground mt-1">
                    Get client approval on content
                  </p>
                </div>
                <div className="text-center p-4 bg-white border rounded-lg">
                  <Check className="h-6 w-6 mx-auto mb-2 text-green-600" />
                  <h5 className="font-medium text-sm">Branded Reports</h5>
                  <p className="text-xs text-muted-foreground mt-1">
                    Generate client reports
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <h4 className="font-semibold">Client Information</h4>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Client Name *</label>
                  <Input
                    value={clientInfo.clientName}
                    onChange={(e) =>
                      setClientInfo({ ...clientInfo, clientName: e.target.value })
                    }
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Client Email *</label>
                  <Input
                    type="email"
                    value={clientInfo.clientEmail}
                    onChange={(e) =>
                      setClientInfo({ ...clientInfo, clientEmail: e.target.value })
                    }
                    placeholder="client@company.com"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Company Name</label>
                <Input
                  value={clientInfo.clientCompany}
                  onChange={(e) =>
                    setClientInfo({ ...clientInfo, clientCompany: e.target.value })
                  }
                  placeholder="Client Company Inc."
                />
              </div>

              <div>
                <label className="text-sm font-medium">Access Level *</label>
                <select
                  value={clientInfo.accessLevel}
                  onChange={(e) =>
                    setClientInfo({ ...clientInfo, accessLevel: e.target.value })
                  }
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="view">View Only - Client can only view brand</option>
                  <option value="comment">Comment - Client can view and comment</option>
                  <option value="edit">Edit - Client can view and edit</option>
                </select>
                <p className="text-xs text-muted-foreground mt-1">
                  Control what the client can do with this brand
                </p>
              </div>

              <div className="flex gap-2 pt-4 border-t">
                <Button onClick={handleSaveClientInfo} disabled={saving}>
                  {saving ? 'Saving...' : 'Save Client Info'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowClientForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}


// Generate PDF Button Component
function GeneratePDFButton({ brand }: { brand: any }) {
  const [generating, setGenerating] = useState(false);

  const handleGeneratePDF = async () => {
    setGenerating(true);
    try {
      const response = await fetch(`/api/brands/${brand.id}/generate-pdf`, {
        method: 'POST',
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${brand.name.replace(/\s+/g, '-')}-Brand-Guidelines.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert('Failed to generate PDF');
      }
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      alert('Failed to generate PDF');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Button
      variant="default"
      size="sm"
      onClick={handleGeneratePDF}
      disabled={generating}
      className="bg-gradient-to-r from-purple-600 to-blue-600 text-white"
    >
      {generating ? (
        <>
          <Brain className="h-4 w-4 mr-2 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </>
      )}
    </Button>
  );
}


// Voice Consistency Checker Component
function VoiceConsistencyChecker({ brand }: { brand: any }) {
  const [content, setContent] = useState('');
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleCheck = async () => {
    if (!content.trim()) {
      alert('Please enter some content to check');
      return;
    }

    if (!brand.voiceProfile) {
      alert('Please analyze brand voice first (in Overview tab)');
      return;
    }

    setChecking(true);
    try {
      const response = await fetch(`/api/brands/${brand.id}/check-consistency`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });

      const data = await response.json();
      if (data.success) {
        setResult(data.result);
      } else {
        alert(data.error || 'Failed to check consistency');
      }
    } catch (error) {
      console.error('Failed to check consistency:', error);
      alert('Failed to check voice consistency');
    } finally {
      setChecking(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent Match';
    if (score >= 60) return 'Good Match';
    return 'Needs Improvement';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-green-600" />
          Voice Consistency Checker
        </CardTitle>
        <CardDescription>
          Check if your content matches {brand.name}'s brand voice
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!brand.voiceProfile ? (
          <div className="text-center p-8 bg-yellow-50 rounded-lg border border-yellow-200">
            <Brain className="h-12 w-12 mx-auto mb-4 text-yellow-600" />
            <h3 className="font-semibold mb-2 text-yellow-900">Voice Profile Required</h3>
            <p className="text-sm text-yellow-700 mb-4">
              Analyze your brand voice first to use the consistency checker
            </p>
            <Button variant="outline" className="border-yellow-600 text-yellow-700">
              Go to Voice Analysis
            </Button>
          </div>
        ) : (
          <>
            <div>
              <label className="text-sm font-medium mb-2 block">
                Enter Content to Check
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Paste your content here... (caption, post, article, etc.)"
                className="w-full min-h-[150px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                disabled={checking}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Minimum 50 characters recommended for accurate analysis
              </p>
            </div>

            <Button
              onClick={handleCheck}
              disabled={checking || content.length < 20}
              className="w-full"
            >
              {checking ? (
                <>
                  <Brain className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing Voice Consistency...
                </>
              ) : (
                <>
                  <Target className="mr-2 h-4 w-4" />
                  Check Voice Consistency
                </>
              )}
            </Button>

            {result && (
              <div className="space-y-4 p-4 border rounded-lg bg-slate-50">
                {/* Overall Score */}
                <div className="text-center">
                  <div
                    className={`inline-flex items-center justify-center w-24 h-24 rounded-full border-4 ${getScoreColor(
                      result.consistencyScore
                    )}`}
                  >
                    <div>
                      <div className="text-3xl font-bold">
                        {result.consistencyScore}
                      </div>
                      <div className="text-xs">Score</div>
                    </div>
                  </div>
                  <h3 className="font-semibold text-lg mt-3">
                    {getScoreLabel(result.consistencyScore)}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Voice consistency with {brand.name}
                  </p>
                </div>

                {/* Detailed Breakdown */}
                <div className="grid md:grid-cols-3 gap-3">
                  <div className="p-3 bg-white rounded-lg border">
                    <div className="text-xs text-muted-foreground mb-1">Tone Match</div>
                    <div className="text-2xl font-bold text-purple-600">
                      {result.toneScore}%
                    </div>
                  </div>
                  <div className="p-3 bg-white rounded-lg border">
                    <div className="text-xs text-muted-foreground mb-1">Style Match</div>
                    <div className="text-2xl font-bold text-blue-600">
                      {result.styleScore}%
                    </div>
                  </div>
                  <div className="p-3 bg-white rounded-lg border">
                    <div className="text-xs text-muted-foreground mb-1">Vocabulary Match</div>
                    <div className="text-2xl font-bold text-green-600">
                      {result.vocabularyScore}%
                    </div>
                  </div>
                </div>

                {/* Detected Tone */}
                {result.detectedTone && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Detected Tone</h4>
                    <div className="flex flex-wrap gap-2">
                      {result.detectedTone.map((tone: string, i: number) => (
                        <Badge key={i} variant="secondary">
                          {tone}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Matches */}
                {result.matches && result.matches.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2 flex items-center gap-1 text-green-700">
                      <Check className="h-4 w-4" />
                      What's Working Well
                    </h4>
                    <ul className="space-y-1">
                      {result.matches.map((match: string, i: number) => (
                        <li key={i} className="text-sm flex items-start gap-2">
                          <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>{match}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Issues */}
                {result.issues && result.issues.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2 flex items-center gap-1 text-red-700">
                      <Target className="h-4 w-4" />
                      Areas to Improve
                    </h4>
                    <ul className="space-y-1">
                      {result.issues.map((issue: string, i: number) => (
                        <li key={i} className="text-sm flex items-start gap-2">
                          <span className="text-red-500 mt-0.5 flex-shrink-0">•</span>
                          <span>{issue}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Suggestions */}
                {result.suggestions && result.suggestions.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2 flex items-center gap-1 text-blue-700">
                      <Lightbulb className="h-4 w-4" />
                      Suggestions
                    </h4>
                    <ul className="space-y-1">
                      {result.suggestions.map((suggestion: string, i: number) => (
                        <li key={i} className="text-sm flex items-start gap-2">
                          <Lightbulb className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <span>{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
