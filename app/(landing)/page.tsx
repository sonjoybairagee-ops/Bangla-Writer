import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  Sparkles, 
  Brain, 
  Film, 
  Calendar, 
  Zap,
  Globe,
  ArrowRight,
  Star,
  Users,
  TrendingUp,
  Shield,
  Mail,
  MessageCircle
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white/70 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-purple-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Bangla Creator
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/pricing" className="text-slate-700 hover:text-purple-600 transition-colors">
              Pricing
            </Link>
            <Link href="/support" className="text-slate-700 hover:text-purple-600 transition-colors">
              Support
            </Link>
            <Link href="/contact" className="text-slate-700 hover:text-purple-600 transition-colors">
              Contact
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/register">
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 text-center relative">
        {/* Background decorations */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-40 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>

        <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
          <Star className="h-4 w-4" />
          <span>Trusted by 10,000+ Content Creators</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent leading-tight">
          Your Complete Content
          <br />
          Operating System
        </h1>
        <p className="text-xl md:text-2xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
          Create, plan, and manage all your content with AI. From strategy to execution,
          powered by advanced AI that learns your brand voice.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Link href="/register">
            <Button size="lg" className="text-lg px-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="/pricing">
            <Button size="lg" variant="outline" className="text-lg px-8 border-2">
              View Pricing
            </Button>
          </Link>
        </div>

        {/* Social Proof */}
        <div className="flex items-center justify-center gap-8 text-sm text-slate-600 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-3">
              <div className="w-10 h-10 rounded-full border-2 border-white shadow-md overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" 
                  alt="Creator" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-white shadow-md overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" 
                  alt="Creator" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-white shadow-md overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&h=100&fit=crop" 
                  alt="Creator" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-white shadow-md overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop" 
                  alt="Creator" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <span className="font-semibold text-slate-700">10,000+ users</span>
          </div>
          <div className="flex items-center gap-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            ))}
            <span className="ml-1 font-semibold text-slate-700">4.9/5 rating</span>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
          <StatCard icon={<Users />} value="10,000+" label="Active Users" />
          <StatCard icon={<TrendingUp />} value="5M+" label="Words Generated" />
          <StatCard icon={<Star />} value="4.9/5" label="User Rating" />
          <StatCard icon={<Shield />} value="99.9%" label="Uptime" />
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
      <footer className="border-t bg-white/70 backdrop-blur-sm py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-6 w-6 text-purple-600" />
                <span className="text-xl font-bold">Bangla Creator</span>
              </div>
              <p className="text-slate-600 text-sm">
                Your complete content operating system powered by AI.
              </p>
            </div>

            {/* Product */}
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>
                  <Link href="/pricing" className="hover:text-purple-600 transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/support" className="hover:text-purple-600 transition-colors">
                    Support
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-purple-600 transition-colors">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>
                  <Link href="/privacy-policy" className="hover:text-purple-600 transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-purple-600 transition-colors">
                    Terms & Conditions
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-semibold mb-4">Get in Touch</h3>
              <ul className="space-y-3">
                <li>
                  <Link 
                    href="/contact" 
                    className="flex items-center gap-2 text-sm text-slate-600 hover:text-purple-600 transition-colors"
                  >
                    <Mail className="h-4 w-4" />
                    <span>Email Support</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/support" 
                    className="flex items-center gap-2 text-sm text-slate-600 hover:text-purple-600 transition-colors"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Help Center</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t pt-8 text-center text-slate-600 text-sm">
            <p>&copy; 2026 Bangla Creator. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function StatCard({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm text-center">
      <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 text-purple-600 rounded-lg mb-3">
        {icon}
      </div>
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className="text-sm text-slate-600">{label}</div>
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
