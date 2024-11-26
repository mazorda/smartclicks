import React from 'react';
import { Zap, Clock, CheckCircle } from 'lucide-react';

export default function IntroSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950 dark:to-gray-900">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-6 dark:text-white">
            Unlock Your Advertising Potential
          </h2>
          
          <p className="text-lg text-gray-600 dark:text-gray-300 text-center mb-12">
            At <span className="font-semibold">SmartClicks.AI</span>, we combine cutting-edge AI 
            technology with over 15 years of human expertise to deliver comprehensive Google Ads 
            audits. Our unique approach is 60% faster and 60% more cost-effective than traditional 
            methods, providing you with actionable insights in just 7 days.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-700 transition">
              <Zap className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-4 dark:text-white">AI-Powered Analysis</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Swiftly identify inefficiencies and opportunities using advanced machine learning
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-700 transition">
              <CheckCircle className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-4 dark:text-white">Expert Validation</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Seasoned professionals enhance and verify AI findings for maximum impact
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-700 transition">
              <Clock className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-4 dark:text-white">Rapid Delivery</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Make informed decisions sooner with our expedited 7-day process
              </p>
            </div>
          </div>

          <div className="mt-12 bg-blue-600 dark:bg-blue-900 text-white rounded-xl p-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">Traditional Audit vs SmartClicks.AI</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold mb-2">Traditional Audit</h4>
                  <ul className="space-y-2 text-blue-100 dark:text-blue-200">
                    <li>• 2-3 weeks delivery time</li>
                    <li>• Manual analysis prone to errors</li>
                    <li>• Limited data processing</li>
                    <li>• High cost ($2,000+)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">SmartClicks.AI</h4>
                  <ul className="space-y-2">
                    <li>• 7-day delivery</li>
                    <li>• AI-powered precision</li>
                    <li>• Comprehensive data analysis</li>
                    <li>• Affordable ($900)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
