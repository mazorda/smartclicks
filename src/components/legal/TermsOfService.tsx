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
              <p className="text-gray-600 mb-8">Last Updated: 17 Nov 2024</p>

              <h2>Acceptance of Terms</h2>
              <p>
                By using SmartClicks.AI's services, you agree to these Terms of Service ("Terms"). 
                If you do not agree to these Terms, please do not use our services.
              </p>

              <h2>Description of Service</h2>
              <p>
                Our platform connects to your Google Ads account to provide insights, audits, 
                and recommendations to improve your advertising performance.
              </p>

              <h2>User Responsibilities</h2>
              <p>
                By connecting your Google Ads account, you authorize us to access your account data. 
                You are responsible for ensuring the accuracy of the data you provide.
              </p>

              <h2>Limited License</h2>
              <p>
                We grant you a limited, non-exclusive, non-transferable license to use our services. 
                You agree not to copy, modify, or distribute any part of our platform without our permission.
              </p>

              <h2>Data Access and Use</h2>
              <p>
                We will access your Google Ads account data solely for the purpose of providing our services. 
                You can revoke access at any time by disconnecting your Google Ads account from our platform.
              </p>

              <h2>Limitation of Liability</h2>
              <p>
                To the fullest extent permitted by law, SmartClicks.AI is not liable for any damages 
                resulting from your use of our services.
              </p>

              <h2>Termination</h2>
              <p>
                We reserve the right to terminate or suspend your access to our services at any time 
                if you violate these Terms.
              </p>

              <h2>Changes to These Terms</h2>
              <p>
                We may update these Terms from time to time. If we make significant changes, we will 
                notify you by posting the new Terms on our website.
              </p>

              <h2>Governing Law</h2>
              <p>
                These Terms are governed by the laws of UK. Any disputes will be resolved in the 
                courts of England.
              </p>

              <h2>Contact Us</h2>
              <p>
                If you have any questions about these Terms, please contact us at hello@smartclicks.ai.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}