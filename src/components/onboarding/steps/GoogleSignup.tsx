import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LogIn, ArrowLeft, AlertCircle } from 'lucide-react';

type Props = {
  onComplete: () => void;
  onBack: () => void;
  updateData: (data: { email: string }) => void;
};

export default function GoogleSignup({ onComplete, onBack, updateData }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleAdsConnect = async () => {
    setLoading(true);
    // In production, this would be your actual Google Ads OAuth URL
    const GOOGLE_ADS_OAUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
    const params = new URLSearchParams({
      client_id: "YOUR_CLIENT_ID",
      redirect_uri: `${window.location.origin}/oauth/callback`,
      scope: [
        "https://www.googleapis.com/auth/adwords",
        "https://www.googleapis.com/auth/analytics.readonly"
      ].join(" "),
      response_type: "code",
      access_type: "offline",
      prompt: "consent"
    });

    // For demo purposes, we'll just simulate the OAuth flow
    await new Promise(resolve => setTimeout(resolve, 1500));
    updateData({ email: 'demo@example.com' });
    setLoading(false);
    onComplete();
  };

  return (
    <div className="max-w-md mx-auto text-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <button
          onClick={onBack}
          className="mb-6 flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </button>

        <h2 className="text-3xl font-bold mb-6">Connect Your Google Ads Account</h2>
        <p className="text-gray-600 mb-8">
          We need access to your Google Ads data to provide a comprehensive audit. 
          Your data is secure and we only request read-only access.
        </p>

        <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 mb-8 text-left">
          <h3 className="font-semibold mb-3">We'll only request permission to:</h3>
          <ul className="space-y-2">
            <li className="flex items-center text-gray-700">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              View your Google Ads campaigns and performance data
            </li>
            <li className="flex items-center text-gray-700">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              Access analytics data for comprehensive insights
            </li>
            <li className="flex items-center text-gray-700">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              Generate reports and recommendations
            </li>
          </ul>
        </div>
        
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <button
          onClick={handleGoogleAdsConnect}
          disabled={loading}
          className="w-full bg-white border border-gray-300 rounded-lg px-6 py-3 flex items-center justify-center space-x-3 hover:bg-gray-50 transition disabled:opacity-50"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
          ) : (
            <>
              <img 
                src="https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png" 
                alt="Google" 
                className="w-5 h-5" 
              />
              <span>Connect Google Ads Account</span>
            </>
          )}
        </button>

        <div className="mt-6 bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-600">
            This is a demo flow. In production, you'll be redirected to Google's OAuth consent screen.
          </p>
        </div>
      </motion.div>
    </div>
  );
}