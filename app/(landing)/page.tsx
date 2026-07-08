import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  Sparkles, 
  Brain, 
  Film, 
  Calendar, 
  Zap,
  Globe,
  ArrowRight 
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-purple-600" />
            <span className="text-2xl font-bold">Bangla Creator</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Your Complete Content
          <br />
          Operating System
        </h1>
        <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
          Create, plan, and manage all your content with AI. From strategy to execution,
          powered by advanced AI that learns your brand.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/register">
            <Button size="lg" className="text-lg">
              Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="/pricing">
            <Button size="lg" variant="outline" className="text-lg">
              View Pricing
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-12">
          Everything You Need in One Platform
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Brain className="h-10 w-10 text-purple-600" />}
            title="Brand Brain"
            description="AI learns your brand voice, tone, and style. Never repeat yourself - teach it once, create forever."
          />
          <FeatureCard
            icon={<Sparkles className="h-10 w-10 text-pink-600" />}
            title="AI Content Writer"
            description="Generate scroll-stopping content with 7+ proven frameworks. AIDA, PAS, BAB, and more."
          />
          <FeatureCard
            icon={<Film className="h-10 w-10 text-blue-600" />}
            title="OVC Director"
            description="Complete video shoot breakdowns with camera angles, lighting, and dialogue. Professional videos made easy."
          />
          <FeatureCard
            icon={<Calendar className="h-10 w-10 text-green-600" />}
            title="Content Planner"
            description="30-day content strategies generated in minutes. Never run out of content ideas again."
          />
          <FeatureCard
            icon={<Zap className="h-10 w-10 text-yellow-600" />}
            title="Hook Generator"
            description="Scroll-stopping hooks using psychological triggers. Fear, curiosity, authority, and more."
          />
          <FeatureCard
            icon={<Globe className="h-10 w-10 text-indigo-600" />}
            title="Multi-Platform"
            description="Optimized for Facebook, Instagram, TikTok, YouTube, LinkedIn, and more."
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-12 text-white">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Transform Your Content?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of creators and businesses using Bangla Creator
          </p>
          <Link href="/register">
            <Button size="lg" variant="secondary" className="text-lg">
              Start Creating Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white/50 backdrop-blur-sm py-8">
        <div className="container mx-auto px-4 text-center text-slate-600">
          <p>&copy; 2026 Bangla Creator. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-slate-600">{description}</p>
    </div>
  );
}
