import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sparkles, Shield } from 'lucide-react';

export default function PrivacyPolicyPage() {
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

      {/* Content */}
      <article className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 text-purple-600 rounded-full mb-4">
            <Shield className="h-8 w-8" />
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Privacy Policy
          </h1>
          <p className="text-slate-600">
            Last updated: January 1, 2026
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm prose prose-slate max-w-none">
          <Section title="1. Introduction">
            <p>
              Welcome to Bangla Creator ("we," "our," or "us"). We are committed to protecting your personal 
              information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, 
              and safeguard your information when you use our website and services.
            </p>
            <p>
              By using Bangla Creator, you agree to the collection and use of information in accordance with 
              this policy. If you do not agree with our policies and practices, please do not use our services.
            </p>
          </Section>

          <Section title="2. Information We Collect">
            <h3>2.1 Personal Information</h3>
            <p>We collect the following personal information when you register and use our services:</p>
            <ul>
              <li>Name and email address</li>
              <li>Account credentials (encrypted passwords)</li>
              <li>Payment information (processed securely through third-party payment processors)</li>
              <li>Profile information and preferences</li>
            </ul>

            <h3>2.2 Content and Usage Data</h3>
            <ul>
              <li>Content you create, upload, or share through our platform</li>
              <li>Brand information and assets you provide</li>
              <li>Usage patterns and feature interactions</li>
              <li>Device information, IP address, and browser type</li>
            </ul>

            <h3>2.3 Automatically Collected Information</h3>
            <ul>
              <li>Log data (access times, pages viewed, IP address)</li>
              <li>Cookies and similar tracking technologies</li>
              <li>Analytics data about how you use our services</li>
            </ul>
          </Section>

          <Section title="3. How We Use Your Information">
            <p>We use the collected information for the following purposes:</p>
            <ul>
              <li><strong>Provide Services:</strong> To deliver our AI-powered content creation tools and features</li>
              <li><strong>Improve Platform:</strong> To analyze usage patterns and enhance user experience</li>
              <li><strong>Account Management:</strong> To maintain your account and provide customer support</li>
              <li><strong>Billing:</strong> To process payments and manage subscriptions</li>
              <li><strong>Communications:</strong> To send service updates, newsletters, and promotional materials</li>
              <li><strong>Security:</strong> To detect and prevent fraud, abuse, and security issues</li>
              <li><strong>Legal Compliance:</strong> To comply with legal obligations and enforce our terms</li>
            </ul>
          </Section>

          <Section title="4. Data Sharing and Disclosure">
            <p>We do not sell your personal information. We may share your information in the following circumstances:</p>
            
            <h3>4.1 Service Providers</h3>
            <p>
              We share data with third-party service providers who help us operate our platform, including:
            </p>
            <ul>
              <li>Cloud hosting providers (data storage and processing)</li>
              <li>Payment processors (Stripe, PayPal)</li>
              <li>Email service providers</li>
              <li>Analytics platforms</li>
            </ul>

            <h3>4.2 Business Transfers</h3>
            <p>
              If we undergo a merger, acquisition, or sale of assets, your information may be transferred 
              to the acquiring entity.
            </p>

            <h3>4.3 Legal Requirements</h3>
            <p>
              We may disclose your information if required by law, court order, or to protect our rights 
              and the safety of our users.
            </p>
          </Section>

          <Section title="5. Data Security">
            <p>
              We implement industry-standard security measures to protect your personal information:
            </p>
            <ul>
              <li>Encryption of data in transit (SSL/TLS) and at rest</li>
              <li>Secure authentication and access controls</li>
              <li>Regular security audits and monitoring</li>
              <li>Employee training on data protection</li>
            </ul>
            <p>
              However, no method of transmission over the internet is 100% secure. While we strive to 
              protect your data, we cannot guarantee absolute security.
            </p>
          </Section>

          <Section title="6. Your Rights and Choices">
            <p>You have the following rights regarding your personal information:</p>
            <ul>
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Correction:</strong> Update or correct inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your account and data</li>
              <li><strong>Export:</strong> Download your content and data</li>
              <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
              <li><strong>Cookie Control:</strong> Manage cookie preferences in your browser</li>
            </ul>
            <p>
              To exercise these rights, please contact us at privacy@banglacreator.com
            </p>
          </Section>

          <Section title="7. Data Retention">
            <p>
              We retain your personal information for as long as your account is active or as needed to 
              provide services. After account deletion, we may retain certain data for:
            </p>
            <ul>
              <li>Legal and regulatory compliance (up to 7 years)</li>
              <li>Dispute resolution and fraud prevention</li>
              <li>Backup systems (deleted within 90 days)</li>
            </ul>
          </Section>

          <Section title="8. Children's Privacy">
            <p>
              Bangla Creator is not intended for users under 18 years of age. We do not knowingly collect 
              personal information from children. If you believe we have collected data from a child, 
              please contact us immediately.
            </p>
          </Section>

          <Section title="9. International Data Transfers">
            <p>
              Your information may be transferred to and processed in countries other than your country of 
              residence. We ensure appropriate safeguards are in place to protect your data in accordance 
              with this Privacy Policy.
            </p>
          </Section>

          <Section title="10. Cookies and Tracking">
            <p>
              We use cookies and similar technologies to:
            </p>
            <ul>
              <li>Maintain your session and preferences</li>
              <li>Analyze usage patterns and improve our services</li>
              <li>Personalize content and recommendations</li>
              <li>Measure advertising effectiveness</li>
            </ul>
            <p>
              You can control cookies through your browser settings. However, disabling cookies may 
              limit your ability to use certain features.
            </p>
          </Section>

          <Section title="11. Third-Party Links">
            <p>
              Our platform may contain links to third-party websites. We are not responsible for the 
              privacy practices of these external sites. We encourage you to review their privacy policies.
            </p>
          </Section>

          <Section title="12. Changes to This Policy">
            <p>
              We may update this Privacy Policy from time to time. We will notify you of significant 
              changes via email or through a prominent notice on our platform. Continued use of our 
              services after changes constitutes acceptance of the updated policy.
            </p>
          </Section>

          <Section title="13. Contact Us">
            <p>
              If you have questions or concerns about this Privacy Policy, please contact us:
            </p>
            <div className="bg-slate-50 p-6 rounded-lg mt-4">
              <p className="mb-2"><strong>Email:</strong> privacy@banglacreator.com</p>
              <p className="mb-2"><strong>Support:</strong> support@banglacreator.com</p>
              <p><strong>Address:</strong> Dhaka, Bangladesh</p>
            </div>
          </Section>
        </div>
      </article>

      {/* Footer */}
      <footer className="border-t bg-white/70 backdrop-blur-sm py-8">
        <div className="container mx-auto px-4 text-center text-slate-600">
          <p>&copy; 2026 Bangla Creator. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold text-slate-900 mb-4">{title}</h2>
      <div className="text-slate-700 space-y-4">
        {children}
      </div>
    </section>
  );
}
