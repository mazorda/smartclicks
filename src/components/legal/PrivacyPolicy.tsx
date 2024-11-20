import React, { useEffect } from 'react';
import Header from '../Header';
import Footer from '../Footer';
import { Shield } from 'lucide-react';

export default function PrivacyPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onGetStarted={() => {}} />
      
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center space-x-3 mb-6">
              <Shield className="h-8 w-8 text-blue-600" />
              <h1 className="text-4xl font-bold">Privacy Policy</h1>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-8 prose prose-blue max-w-none">
              <p className="text-gray-600 mb-8">Last Updated: March 1, 2024</p>

              <h2>1. Introduction</h2>
              <p>
                SmartClicks.AI ("we", "us", or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, share, and protect your personal information in accordance with the General Data Protection Regulation (GDPR) and other applicable data protection laws.
              </p>

              <h2>2. Information We Collect</h2>
              <h3>2.1 Information You Provide</h3>
              <ul>
                <li>Account information (name, email, password)</li>
                <li>Company information</li>
                <li>Google Ads account access and data</li>
                <li>Communication preferences</li>
              </ul>

              <h3>2.2 Automatically Collected Information</h3>
              <ul>
                <li>Usage data through Google Analytics (GA4)</li>
                <li>Device and browser information</li>
                <li>IP address and location data</li>
                <li>Cookies and similar technologies</li>
              </ul>

              <h2>3. How We Use Your Information</h2>
              <h3>3.1 Primary Purposes</h3>
              <ul>
                <li>Providing and improving our services</li>
                <li>Analyzing your Google Ads performance</li>
                <li>Generating recommendations and reports</li>
                <li>Customer support and communication</li>
              </ul>

              <h3>3.2 Marketing Communications</h3>
              <p>
                By creating an account, you consent to receive:
              </p>
              <ul>
                <li>Transactional emails about your account and services</li>
                <li>Marketing communications about our products and services</li>
                <li>Newsletter and educational content</li>
              </ul>
              <p>
                You can opt out of marketing communications at any time through your account settings or by clicking the unsubscribe link in our emails.
              </p>

              <h2>4. Analytics and Tracking</h2>
              <p>
                We use various analytics tools to improve our services:
              </p>
              <ul>
                <li>Google Analytics 4 (GA4) for website analytics</li>
                <li>Google Tag Manager for tracking implementation</li>
                <li>Google Ads conversion tracking</li>
                <li>Session recording tools for UX improvement</li>
              </ul>
              <p>
                You can opt out of analytics tracking by:
              </p>
              <ul>
                <li>Using browser's Do Not Track setting</li>
                <li>Installing the Google Analytics Opt-out Browser Add-on</li>
                <li>Adjusting cookie preferences in our cookie banner</li>
              </ul>

              <h2>5. Data Sharing and Third Parties</h2>
              <p>We share your data with:</p>
              <ul>
                <li>Service providers (hosting, analytics, email)</li>
                <li>Payment processors</li>
                <li>Legal authorities when required</li>
              </ul>

              <h2>6. Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your data, including:
              </p>
              <ul>
                <li>Encryption in transit and at rest</li>
                <li>Regular security assessments</li>
                <li>Access controls and authentication</li>
                <li>Employee training on data protection</li>
              </ul>

              <h2>7. Your GDPR Rights</h2>
              <p>Under GDPR, you have the right to:</p>
              <ul>
                <li>Access your personal data</li>
                <li>Rectify inaccurate data</li>
                <li>Request erasure of your data</li>
                <li>Restrict or object to processing</li>
                <li>Data portability</li>
                <li>Withdraw consent</li>
              </ul>

              <h2>8. Data Retention</h2>
              <p>
                We retain your data for as long as necessary to provide our services and comply with legal obligations. You can request deletion of your data at any time.
              </p>

              <h2>9. International Transfers</h2>
              <p>
                Your data may be transferred to countries outside the EEA. We ensure appropriate safeguards through:
              </p>
              <ul>
                <li>Standard Contractual Clauses</li>
                <li>Privacy Shield certification (where applicable)</li>
                <li>Adequacy decisions by the European Commission</li>
              </ul>

              <h2>10. Cookie Policy</h2>
              <p>
                We use cookies and similar technologies for:
              </p>
              <ul>
                <li>Essential website functionality</li>
                <li>Analytics and performance</li>
                <li>Personalization</li>
                <li>Marketing and advertising</li>
              </ul>

              <h2>11. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any material changes via email or through our platform.
              </p>

              <h2>12. Contact Us</h2>
              <p>
                For any privacy-related questions or to exercise your rights, contact our Data Protection Officer at:
              </p>
              <ul>
                <li>Email: privacy@smartclicks.ai</li>
                <li>Address: [Your Business Address]</li>
              </ul>
              <p>
                You have the right to lodge a complaint with your local data protection authority.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}