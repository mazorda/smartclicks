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
              <p className="text-gray-600 mb-8">Last Updated: 17 Nov 2024</p>

              <h2>Introduction</h2>
              <p>
                SmartClicks.AI ("we", "us", or "our") is committed to protecting your privacy. 
                This Privacy Policy explains how we collect, use, and share your personal information 
                when you use our services.
              </p>

              <h2>Information We Collect</h2>
              <p>When you connect your Google Ads account to our platform, we collect:</p>
              <ul>
                <li>Google Ads Account Data: Campaign performance, keywords, ad groups, and other related metrics</li>
                <li>Authentication Data: OAuth tokens for accessing your Google Ads account</li>
              </ul>

              <h2>How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul>
                <li>Analyze your Google Ads account for optimization and reporting</li>
                <li>Provide recommendations and insights to improve your ad performance</li>
              </ul>

              <h2>How We Share Your Information</h2>
              <p>
                We do not sell, rent, or share your personal information with third parties, except as required to:
              </p>
              <ul>
                <li>Comply with legal obligations</li>
                <li>Protect our rights and the safety of our users</li>
              </ul>

              <h2>Data Security</h2>
              <p>
                We use industry-standard security measures, including encryption, to protect your data. 
                Access to your data is limited to authorized personnel only.
              </p>

              <h2>Data Retention</h2>
              <p>
                We will retain your Google Ads data for as long as necessary to provide our services. 
                You can request deletion of your data at any time by contacting us.
              </p>

              <h2>Your Rights</h2>
              <p>
                You have the right to access, correct, or delete your data. To exercise these rights, 
                please contact us at hello@smartclicks.ai.
              </p>

              <h2>Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any changes 
                by posting the new policy on our website.
              </p>

              <h2>Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at 
                hello@smartclicks.ai.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}