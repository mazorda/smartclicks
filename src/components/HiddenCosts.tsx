import React from 'react';
import { DollarSign, Target, Eye } from 'lucide-react';

export default function HiddenCosts() {
  return (
    <div className="relative pt-24 pb-16 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white dark:from-dark-bg-primary dark:to-dark-bg-secondary" />
        {/* Enhanced geometric pattern with animation */}
        <div 
          className="absolute inset-0 opacity-[0.15] dark:opacity-[0.07] animate-patternFloat" 
          style={{
            backgroundImage: `
              radial-gradient(circle at 1px 1px, #3b82f6 1px, transparent 0),
              radial-gradient(circle at 12px 12px, #6366f1 1px, transparent 0)
            `,
            backgroundSize: '24px 24px, 48px 48px'
          }}
        />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold mb-6 dark:text-dark-text-primary">
            Stop Losing Money on Underperforming Campaigns
          </h2>
          
          <p className="text-xl text-gray-600 dark:text-dark-text-secondary mb-12 max-w-3xl mx-auto leading-relaxed">
            As a CEO or marketing leader, you're responsible for driving growth and maximizing ROI. 
            Google Ads, especially search ads, are critical for capturing ready-to-buy customers at 
            the crucial late stage of their buying cycle. But if your campaigns are managed by multiple 
            agencies, in-house juniors, or have been on autopilot for years, inefficiencies can creep 
            in unnoticed.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/80 dark:bg-dark-bg-secondary backdrop-blur-sm p-6 rounded-xl shadow-sm border border-gray-100 dark:border-dark-bg-primary hover:border-blue-200 dark:hover:border-dark-accent-light transition transform hover:-translate-y-1">
              <DollarSign className="h-8 w-8 text-blue-600 dark:text-dark-accent-light mx-auto mb-4" />
              <h3 className="font-semibold mb-2 dark:text-dark-text-primary">Is your budget being spent wisely?</h3>
              <p className="text-gray-600 dark:text-dark-text-secondary">
                Identify and eliminate wasted spend to maximize your advertising ROI
              </p>
            </div>

            <div className="bg-white/80 dark:bg-dark-bg-secondary backdrop-blur-sm p-6 rounded-xl shadow-sm border border-gray-100 dark:border-dark-bg-primary hover:border-blue-200 dark:hover:border-dark-accent-light transition transform hover:-translate-y-1">
              <Target className="h-8 w-8 text-blue-600 dark:text-dark-accent-light mx-auto mb-4" />
              <h3 className="font-semibold mb-2 dark:text-dark-text-primary">Missing high-intent customers?</h3>
              <p className="text-gray-600 dark:text-dark-text-secondary">
                Capture valuable leads that your competitors might be winning
              </p>
            </div>

            <div className="bg-white/80 dark:bg-dark-bg-secondary backdrop-blur-sm p-6 rounded-xl shadow-sm border border-gray-100 dark:border-dark-bg-primary hover:border-blue-200 dark:hover:border-dark-accent-light transition transform hover:-translate-y-1">
              <Eye className="h-8 w-8 text-blue-600 dark:text-dark-accent-light mx-auto mb-4" />
              <h3 className="font-semibold mb-2 dark:text-dark-text-primary">Full visibility into performance?</h3>
              <p className="text-gray-600 dark:text-dark-text-secondary">
                Get complete transparency into your account's effectiveness
              </p>
            </div>
          </div>

          <div className="mt-12">
            <div className="relative bg-white/80 dark:bg-dark-bg-secondary backdrop-blur-sm p-8 rounded-xl border-2 border-purple-500/30 dark:border-dark-accent-light/30 hover:border-purple-500/50 dark:hover:border-dark-accent-light/50 transition-colors duration-300">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-center md:text-left">
                  <h4 className="text-2xl font-bold mb-2 dark:text-dark-text-primary">The Average Google Ads Account Wastes 76% of Its Budget</h4>
                  <p className="text-gray-600 dark:text-dark-text-secondary">
                    Our analysis of over 1,000 accounts shows that most businesses are losing money 
                    on inefficient campaigns and poor optimization.
                  </p>
                </div>
                <div className="shrink-0">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 dark:from-dark-accent-base dark:to-dark-accent-dark flex items-center justify-center">
                    <span className="text-4xl font-bold text-blue-600 dark:text-dark-text-primary">76%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
