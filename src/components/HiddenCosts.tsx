import React from 'react';
import { DollarSign, Target, Eye } from 'lucide-react';

export default function HiddenCosts() {
  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-6 dark:text-white">
            Stop Losing Money on Underperforming Campaigns
          </h2>
          
          <p className="text-lg text-gray-600 dark:text-gray-300 text-center mb-12">
            As a CEO or marketing leader, you're responsible for driving growth and maximizing ROI. 
            Google Ads, especially search ads, are critical for capturing ready-to-buy customers at 
            the crucial late stage of their buying cycle. But if your campaigns are managed by multiple 
            agencies, in-house juniors, or have been on autopilot for years, inefficiencies can creep 
            in unnoticed.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-blue-50 dark:bg-gray-800 rounded-xl p-8 text-center">
              <DollarSign className="h-12 w-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-4 dark:text-white">Is your budget being spent wisely?</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Identify and eliminate wasted spend to maximize your advertising ROI
              </p>
            </div>

            <div className="bg-blue-50 dark:bg-gray-800 rounded-xl p-8 text-center">
              <Target className="h-12 w-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-4 dark:text-white">Missing high-intent customers?</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Capture valuable leads that your competitors might be winning
              </p>
            </div>

            <div className="bg-blue-50 dark:bg-gray-800 rounded-xl p-8 text-center">
              <Eye className="h-12 w-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-4 dark:text-white">Full visibility into performance?</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Get complete transparency into your account's effectiveness
              </p>
            </div>
          </div>

          <div className="mt-12 p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <h4 className="text-2xl font-bold mb-2 dark:text-white">The Average Google Ads Account Wastes 76% of Its Budget</h4>
                <p className="text-gray-600 dark:text-gray-300">
                  Our analysis of over 1,000 accounts shows that most businesses are losing money 
                  on inefficient campaigns and poor optimization.
                </p>
              </div>
              <div className="shrink-0">
                <div className="w-32 h-32 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <span className="text-4xl font-bold text-blue-600 dark:text-blue-400">76%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
