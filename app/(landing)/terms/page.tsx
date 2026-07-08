import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sparkles, FileText } from 'lucide-react';

export default function TermsPage() {
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
            <FileText className="h-8 w-8" />
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Terms & Conditions
          </h1>
          <p className="text-slate-600">
            Last updated: January 1, 2026
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm prose prose-slate max-w-none">
          <Section title="1. Agreement to Terms">
            <p>
              By accessing and using Bangla Creator ("Service," "Platform," "we," "us," or "our"), you 
              agree to be bound by these Terms and Conditions ("Terms"). If you disagree with any part of 
              these terms, you may not access the Service.
            </p>
            <p>
              These Terms apply to all visitors, users, and others who access or use the Service.
            </p>
          </Section>

          <Section title="2. Account Registration">
            <h3>2.1 Eligibility</h3>
            <p>
              You must be at least 18 years old to use this Service. By agreeing to these Terms, you 
              represent and warrant that you are of legal age to form a binding contract.
            </p>

            <h3>2.2 Account Security</h3>
            <p>
              You are responsible for:
            </p>
            <ul>
              <li>Maintaining the confidentiality of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized access</li>
              <li>Ensuring your account information is accurate and current</li>
            </ul>

            <h3>2.3 Account Termination</h3>
            <p>
              We reserve the right to terminate or suspend your account immediately, without prior notice, 
              for conduct that we believe violates these Terms or is harmful to other users, us, or third parties.
            </p>
          </Section>

          <Section title="3. Subscription and Payments">
            <h3>3.1 Pricing</h3>
            <p>
              Subscription fees are as described on our pricing page. We reserve the right to modify pricing 
              with 30 days' notice to existing subscribers.
            </p>

            <h3>3.2 Billing</h3>
            <ul>
              <li>Subscriptions are billed in advance on a monthly or annual basis</li>
              <li>Payment is due upon subscription activation</li>
              <li>All fees are non-refundable except as required by law or stated in our refund policy</li>
              <li>Failed payments may result in service suspension or termination</li>
            </ul>

            <h3>3.3 Free Trial</h3>
            <p>
              We offer a 7-day free trial for new users. You must provide payment information to start the 
              trial. You will be charged when the trial ends unless you cancel before the trial period expires.
            </p>

            <h3>3.4 Cancellation and Refunds</h3>
            <ul>
              <li>You may cancel your subscription at any time from your account dashboard</li>
              <li>Cancellations take effect at the end of the current billing period</li>
              <li>We offer a 30-day money-back guarantee for first-time subscribers</li>
              <li>Refund requests must be submitted to support@banglacreator.com</li>
            </ul>
          </Section>

          <Section title="4. Acceptable Use Policy">
            <h3>4.1 Permitted Use</h3>
            <p>
              You may use Bangla Creator to create, manage, and publish content for legitimate business 
              and personal purposes in compliance with all applicable laws.
            </p>

            <h3>4.2 Prohibited Activities</h3>
            <p>You agree NOT to:</p>
            <ul>
              <li>Violate any laws, regulations, or third-party rights</li>
              <li>Create content that is illegal, harmful, threatening, abusive, or defamatory</li>
              <li>Generate spam, phishing content, or malicious software</li>
              <li>Infringe on intellectual property rights of others</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Reverse engineer, decompile, or disassemble the Service</li>
              <li>Share your account credentials with others</li>
              <li>Use the Service to compete with us or build a similar product</li>
              <li>Scrape, data mine, or extract data using automated means</li>
              <li>Generate content for illegal or fraudulent purposes</li>
            </ul>
          </Section>

          <Section title="5. Intellectual Property Rights">
            <h3>5.1 Your Content</h3>
            <p>
              You retain all rights to the content you create using Bangla Creator. By using our Service, 
              you grant us a limited license to:
            </p>
            <ul>
              <li>Store, process, and display your content to provide the Service</li>
              <li>Use anonymized, aggregated data to improve our AI models and features</li>
              <li>Create backup copies for disaster recovery</li>
            </ul>
            <p>
              We do not claim ownership of your content and will not use it for purposes beyond providing 
              the Service without your explicit permission.
            </p>

            <h3>5.2 Our Intellectual Property</h3>
            <p>
              The Service, including its original content, features, functionality, and underlying technology, 
              is owned by Bangla Creator and is protected by international copyright, trademark, and other 
              intellectual property laws.
            </p>
          </Section>

          <Section title="6. AI-Generated Content">
            <h3>6.1 Content Accuracy</h3>
            <p>
              While we strive to provide accurate AI-generated content, we do not guarantee:
            </p>
            <ul>
              <li>Accuracy, completeness, or reliability of generated content</li>
              <li>That content will be free from errors or suitable for your purposes</li>
              <li>That content will not infringe third-party rights</li>
            </ul>
            <p>
              You are responsible for reviewing, editing, and verifying all AI-generated content before use.
            </p>

            <h3>6.2 Content Ownership</h3>
            <p>
              You own the content you create using our AI tools, subject to our license to your input data 
              as described in Section 5.1.
            </p>
          </Section>

          <Section title="7. Data Privacy">
            <p>
              Your use of the Service is also governed by our Privacy Policy, which is incorporated into 
              these Terms by reference. Please review our Privacy Policy to understand how we collect, 
              use, and protect your personal information.
            </p>
          </Section>

          <Section title="8. Service Availability">
            <h3>8.1 Uptime</h3>
            <p>
              We strive to maintain 99.9% uptime but do not guarantee uninterrupted access. The Service 
              may be temporarily unavailable due to:
            </p>
            <ul>
              <li>Scheduled maintenance (announced in advance)</li>
              <li>Emergency repairs or updates</li>
              <li>Third-party service disruptions</li>
              <li>Events beyond our reasonable control</li>
            </ul>

            <h3>8.2 Modifications</h3>
            <p>
              We reserve the right to modify, suspend, or discontinue any part of the Service at any time 
              with reasonable notice. We are not liable for any modification, suspension, or discontinuance.
            </p>
          </Section>

          <Section title="9. Disclaimer of Warranties">
            <p>
              THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER 
              EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
            </p>
            <ul>
              <li>Implied warranties of merchantability, fitness for a particular purpose</li>
              <li>Non-infringement or accuracy of content</li>
              <li>Uninterrupted or error-free operation</li>
              <li>Security of data transmission</li>
            </ul>
          </Section>

          <Section title="10. Limitation of Liability">
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, BANGLA CREATOR SHALL NOT BE LIABLE FOR:
            </p>
            <ul>
              <li>Indirect, incidental, special, consequential, or punitive damages</li>
              <li>Loss of profits, revenue, data, or business opportunities</li>
              <li>Service interruptions or data loss</li>
              <li>Actions of third parties or content generated by AI</li>
            </ul>
            <p>
              Our total liability shall not exceed the amount you paid us in the 12 months preceding the claim.
            </p>
          </Section>

          <Section title="11. Indemnification">
            <p>
              You agree to indemnify and hold harmless Bangla Creator, its affiliates, and their respective 
              officers, directors, employees, and agents from any claims, damages, losses, liabilities, and 
              expenses (including legal fees) arising from:
            </p>
            <ul>
              <li>Your use of the Service</li>
              <li>Your violation of these Terms</li>
              <li>Your infringement of any third-party rights</li>
              <li>Content you create or publish using the Service</li>
            </ul>
          </Section>

          <Section title="12. Dispute Resolution">
            <h3>12.1 Governing Law</h3>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of Bangladesh, 
              without regard to its conflict of law provisions.
            </p>

            <h3>12.2 Arbitration</h3>
            <p>
              Any disputes arising from these Terms or the Service shall be resolved through binding 
              arbitration in Dhaka, Bangladesh, except where prohibited by law.
            </p>
          </Section>

          <Section title="13. Changes to Terms">
            <p>
              We reserve the right to modify these Terms at any time. We will notify users of significant 
              changes via email or through a prominent notice on the Platform. Continued use after changes 
              constitutes acceptance of the modified Terms.
            </p>
          </Section>

          <Section title="14. Severability">
            <p>
              If any provision of these Terms is found to be unenforceable or invalid, that provision shall 
              be limited or eliminated to the minimum extent necessary, and the remaining provisions shall 
              remain in full force and effect.
            </p>
          </Section>

          <Section title="15. Contact Information">
            <p>
              For questions about these Terms, please contact us:
            </p>
            <div className="bg-slate-50 p-6 rounded-lg mt-4">
              <p className="mb-2"><strong>Email:</strong> legal@banglacreator.com</p>
              <p className="mb-2"><strong>Support:</strong> support@banglacreator.com</p>
              <p><strong>Address:</strong> Dhaka, Bangladesh</p>
            </div>
          </Section>

          <div className="mt-12 p-6 bg-purple-50 rounded-lg border-l-4 border-purple-600">
            <p className="text-sm text-slate-700">
              By clicking "I Accept" during registration or by continuing to use Bangla Creator, you 
              acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
            </p>
          </div>
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
