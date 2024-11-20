import React, { useEffect } from 'react';
import Header from '../Header';
import Footer from '../Footer';
import { Scale } from 'lucide-react';

export default function TermsOfService() {
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
              <Scale className="h-8 w-8 text-blue-600" />
              <h1 className="text-4xl font-bold">Terms of Service</h1>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-8 prose prose-blue max-w-none">
              <p className="text-gray-600 mb-8">Last Updated: March 1, 2024</p>

              <h2>1. Agreement to Terms</h2>
              <p>
                By accessing or using SmartClicks.AI's services, you agree to be bound by these Terms of Service and our Privacy Policy. If you disagree with any part of these terms, you may not access our services.
              </p>

              <h2>2. Description of Service</h2>
              <p>
                SmartClicks.AI provides AI-powered Google Ads analysis and optimization services. By using our service, you authorize us to:
              </p>
              <ul>
                <li>Access and analyze your Google Ads data</li>
                <li>Make recommendations for optimization</li>
                <li>Store and process your account information</li>
                <li>Send you notifications and communications</li>
              </ul>

              <h2>3. Account Terms</h2>
              <h3>3.1 Registration</h3>
              <p>
                You must provide accurate, complete, and current information when creating an account. You are responsible for maintaining the security of your account credentials.
              </p>

              <h3>3.2 Communications Consent</h3>
              <p>
                By creating an account, you consent to receive:
              </p>
              <ul>
                <li>Service-related communications</li>
                <li>Marketing emails (with opt-out option)</li>
                <li>Product updates and newsletters</li>
                <li>Automated notifications</li>
              </ul>

              <h2>4. Data Collection and Privacy</h2>
              <p>
                We collect and process data in accordance with our Privacy Policy and applicable laws:
              </p>
              <ul>
                <li>Website analytics through Google Analytics</li>
                <li>Marketing data through Google Tag Manager</li>
                <li>Performance tracking and optimization</li>
                <li>User behavior analysis for service improvement</li>
              </ul>

              <h2>5. Payment Terms</h2>
              <ul>
                <li>All fees are in USD unless otherwise stated</li>
                <li>Payments are processed securely through Stripe</li>
                <li>Refunds are subject to our refund policy</li>
                <li>30-day money-back guarantee terms apply</li>
              </ul>

              <h2>6. User Obligations</h2>
              <p>You agree to:</p>
              <ul>
                <li>Provide accurate information</li>
                <li>Maintain account security</li>
                <li>Comply with Google Ads policies</li>
                <li>Use services in accordance with applicable laws</li>
              </ul>

              <h2>7. Intellectual Property</h2>
              <p>
                All content, features, and functionality are owned by SmartClicks.AI and protected by international copyright, trademark, and other intellectual property laws.
              </p>

              <h2>8. Limitation of Liability</h2>
              <p>
                SmartClicks.AI shall not be liable for:
              </p>
              <ul>
                <li>Indirect or consequential damages</li>
                <li>Loss of profits or data</li>
                <li>Service interruptions</li>
                <li>Third-party actions</li>
              </ul>

              <h2>9. Service Modifications</h2>
              <p>
                We reserve the right to:
              </p>
              <ul>
                <li>Modify or discontinue services</li>
                <li>Update pricing and features</li>
                <li>Change terms with notice</li>
                <li>Terminate accounts for violations</li>
              </ul>

              <h2>10. Third-Party Services</h2>
              <p>
                Our service integrates with:
              </p>
              <ul>
                <li>Google Ads API</li>
                <li>Analytics services</li>
                <li>Payment processors</li>
                <li>Communication tools</li>
              </ul>

              <h2>11. Termination</h2>
              <p>
                We may terminate or suspend access to our service immediately, without prior notice, for:
              </p>
              <ul>
                <li>Terms violations</li>
                <li>Fraudulent activity</li>
                <li>Non-payment</li>
                <li>Abuse of service</li>
              </ul>

              <h2>12. Governing Law</h2>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction], without regard to its conflict of law provisions.
              </p>

              <h2>13. Changes to Terms</h2>
              <p>
                We reserve the right to modify these terms at any time. We will notify you of any material changes via email or through our platform.
              </p>

              <h2>14. Contact Information</h2>
              <p>
                For any questions about these Terms, please contact us at:
              </p>
              <ul>
                <li>Email: legal@smartclicks.ai</li>
                <li>Address: [Your Business Address]</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}