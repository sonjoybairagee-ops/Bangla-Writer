'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  Sparkles,
  Search,
  BookOpen,
  Video,
  MessageCircle,
  Mail,
  ChevronDown,
  ChevronUp,
  HelpCircle
} from 'lucide-react';

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openFAQ, setOpenFAQ] = useState<number | null>(0);

  const faqs = [
    {
      question: 'How do I get started with Bangla Creator?',
      answer: 'Simply sign up for a free account, complete the onboarding process, and start creating content! You\'ll have access to all features during your 7-day free trial.',
    },
    {
      question: 'What is Brand Brain and how does it work?',
      answer: 'Brand Brain is our AI-powered feature that learns your brand\'s voice, tone, and style. Upload your existing content or fill out the brand questionnaire, and the AI will automatically adapt all generated content to match your brand identity.',
    },
    {
      question: 'Can I cancel my subscription anytime?',
      answer: 'Yes! You can cancel your subscription at any time from your dashboard. There are no long-term contracts or cancellation fees. Your access will continue until the end of your current billing period.',
    },
    {
      question: 'How many words can I generate per month?',
      answer: 'Word limits depend on your plan: Starter (10,000 words/month), Professional (50,000 words/month), and Enterprise (unlimited). Unused words don\'t roll over to the next month.',
    },
    {
      question: 'Do you offer refunds?',
      answer: 'Yes, we offer a 30-day money-back guarantee. If you\'re not satisfied with Bangla Creator, contact our support team within 30 days of your purchase for a full refund.',
    },
    {
      question: 'Can I upgrade or downgrade my plan?',
      answer: 'Absolutely! You can change your plan at any time from your dashboard. Upgrades take effect immediately, while downgrades will apply at the start of your next billing cycle.',
    },
    {
      question: 'Is my data secure?',
      answer: 'Yes, we take security very seriously. All data is encrypted in transit and at rest. We use industry-standard security protocols and never share your content with third parties.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and bank transfers for Enterprise plans.',
    },
    {
      question: 'Can I use Bangla Creator for multiple brands?',
      answer: 'Yes! The number of brands you can manage depends on your plan. Starter (1 brand), Professional (5 brands), and Enterprise (unlimited brands).',
    },
    {
      question: 'Do you provide training or onboarding?',
      answer: 'Yes! All plans include access to our comprehensive help center, video tutorials, and email support. Enterprise plans also include custom training sessions and a dedicated account manager.',
    },
  ];

  const categories = [
    {
      icon: <BookOpen className="h-8 w-8" />,
      title: 'Getting Started',
      description: 'Learn the basics and set up your account',
      articles: 12,
    },
    {
      icon: <Video className="h-8 w-8" />,
      title: 'Video Tutorials',
      description: 'Step-by-step guides and walkthroughs',
      articles: 8,
    },
    {
      icon: <MessageCircle className="h-8 w-8" />,
      title: 'AI Tools Guide',
      description: 'Master all our AI-powered features',
      articles: 15,
    },
    {
      icon: <Mail className="h-8 w-8" />,
      title: 'Account & Billing',
      description: 'Manage your subscription and payments',
      articles: 10,
    },
  ];

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
      <section className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          How can we help you?
        </h1>
        <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
          Search our knowledge base or browse categories below
        </p>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search for help articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent bg-white shadow-sm"
          />
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-12">Browse by Category</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {categories.map((category, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all cursor-pointer group"
            >
              <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                {category.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{category.title}</h3>
              <p className="text-slate-600 text-sm mb-3">{category.description}</p>
              <p className="text-purple-600 text-sm font-semibold">
                {category.articles} articles
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm overflow-hidden"
              >
                <button
                  onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <HelpCircle className="h-5 w-5 text-purple-600 flex-shrink-0" />
                    <span className="font-semibold">{faq.question}</span>
                  </div>
                  {openFAQ === index ? (
                    <ChevronUp className="h-5 w-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-slate-400" />
                  )}
                </button>
                {openFAQ === index && (
                  <div className="px-6 py-4 bg-slate-50 border-t">
                    <p className="text-slate-700">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-12 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Still need help?</h2>
          <p className="text-xl mb-8 opacity-90">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/contact">
              <Button size="lg" variant="secondary">
                <Mail className="mr-2 h-5 w-5" />
                Contact Support
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10">
                <MessageCircle className="mr-2 h-5 w-5" />
                Live Chat
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white/70 backdrop-blur-sm py-8">
        <div className="container mx-auto px-4 text-center text-slate-600">
          <p>&copy; 2026 Bangla Creator. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
