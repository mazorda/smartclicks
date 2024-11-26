import React from 'react';
import { Check, ArrowRight, Star, Shield } from 'lucide-react';

type Props = {
  onGetStarted: () => void;
};

const features = [
  {
    text: "AI-Powered Account Analysis",
    description: "Deep analysis of your account data and performance metrics"
  },
  {
    text: "Expert Review by Senior PPC Specialists",
    description: "Validation and enhancement by Google Ads veterans with 10+ years experience",
    highlight: true
  },
  {
    text: "Strategy Session & Results Presentation",
    description: "Kickoff meeting and detailed walkthrough of findings",
    highlight: true
  },
  {
    text: "7-Day Delivery",
    description: "Comprehensive audit delivered within one week"
  },
  {
    text: "Performance Optimization Report",
    description: "Detailed analysis with actionable recommendations"
  },
  {
    text: "90-Days Free Access to MiaAI",
    description: "Your 24/7 Google Ads Intelligence Assistant",
    comingSoon: true
  }
];

const testimonials = [
  {
    quote: "The AI-powered audit revealed opportunities we never knew existed. Our ROAS improved by 150% within 2 months.",
    author: "Mark Thompson",
    role: "CMO at TechStart",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
    rating: 5
  },
  {
    quote: "Best investment in our marketing strategy. The combination of AI analysis and expert insights was game-changing.",
    author: "Sarah Williams",
    role: "Director of Growth at EcoStore",
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150",
    rating: 5
  },
  {
    quote: "Finally, a Google Ads audit that's both comprehensive and actionable. Saved us $5000 in monthly ad spend.",
    author: "David Chen",
    role: "CEO at CloudTech",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150",
    rating: 5
  }
];

export default function Pricing({ onGetStarted }: Props) {
  return (
    <section id="pricing" className="py-20 bg-white dark:bg-dark-bg-primary">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 dark:text-dark-text-primary">SmartClicks.AI</h2>
          <p className="text-gray-600 dark:text-dark-text-secondary max-w-2xl mx-auto">
            Get a comprehensive account audit powered by AI and validated by experts, 
            delivered in just 7 days at a fraction of traditional audit costs.
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <div className="bg-gradient-to-br from-blue-50 to-white dark:from-dark-bg-secondary dark:to-dark-bg-secondary rounded-2xl border border-blue-100 dark:border-dark-accent-dark/20 p-8 mb-12">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-2 dark:text-dark-text-primary">Audit Pro</h3>
              <div className="flex items-baseline justify-center space-x-2 mb-2">
                <span className="text-lg text-gray-500 dark:text-dark-text-tertiary line-through">$1,800</span>
                <span className="text-5xl font-bold dark:text-dark-text-primary">$99</span>
                <span className="text-gray-600 dark:text-dark-text-secondary">one-time</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
                  Limited Time Offer
                </span>
                <span className="text-sm text-blue-600 dark:text-dark-accent-light font-medium">
                  Only for the first 100 signups
                </span>
              </div>
            </div>

            <div className="max-w-xl mx-auto mb-8">
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <Check className={`h-5 w-5 mt-0.5 ${
                      feature.comingSoon 
                        ? 'text-gray-400 dark:text-dark-text-tertiary'
                        : feature.highlight 
                          ? 'text-green-600 dark:text-green-400' 
                          : 'text-blue-600 dark:text-dark-accent-light'
                    }`} />
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className={`${
                          feature.comingSoon 
                            ? 'text-gray-400 dark:text-dark-text-tertiary'
                            : feature.highlight 
                              ? 'text-gray-700 dark:text-dark-text-primary font-medium' 
                              : 'text-gray-700 dark:text-dark-text-primary'
                        }`}>
                          {feature.text}
                        </span>
                        {feature.comingSoon && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-dark-bg-primary text-gray-600 dark:text-dark-text-tertiary">
                            COMING SOON
                          </span>
                        )}
                      </div>
                      <p className={`text-sm ${feature.comingSoon ? 'text-gray-400 dark:text-dark-text-tertiary' : 'text-gray-500 dark:text-dark-text-secondary'} mt-0.5`}>
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center">
              <button 
                onClick={onGetStarted}
                className="px-12 py-4 bg-blue-600 dark:bg-dark-accent-base text-white rounded-lg hover:bg-blue-700 dark:hover:bg-dark-accent-dark transition flex items-center justify-center space-x-2 text-lg font-medium mx-auto"
              >
                <span>Start Your Audit</span>
                <ArrowRight className="h-5 w-5" />
              </button>
              <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-gray-600 dark:text-dark-text-secondary">
                <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
                <span>30-Day Money Back Guarantee - Not satisfied? Get a full refund</span>
              </div>
            </div>
          </div>

          {/* Testimonials */}
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 dark:bg-dark-bg-secondary p-6 rounded-xl border border-transparent dark:border-dark-bg-primary hover:border-blue-100 dark:hover:border-dark-accent-dark/20 transition-colors">
                <div className="flex items-center justify-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-dark-text-secondary mb-4 italic">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <img
                    src={testimonial.image}
                    alt={testimonial.author}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div>
                    <p className="font-medium dark:text-dark-text-primary">{testimonial.author}</p>
                    <p className="text-sm text-gray-500 dark:text-dark-text-tertiary">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Comparison Table */}
          <div className="mt-16 bg-blue-600 dark:bg-dark-accent-base rounded-xl p-8 text-white">
            <h3 className="text-2xl font-bold text-center mb-8">Traditional Audit vs SmartClicks.AI</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="text-xl font-semibold mb-4">Traditional Audit</h4>
                <ul className="space-y-2 opacity-90">
                  <li>• 2-3 weeks delivery time</li>
                  <li>• Manual analysis prone to errors</li>
                  <li>• Limited data processing</li>
                  <li>• High cost ($2,000+)</li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="text-xl font-semibold mb-4">SmartClicks.AI</h4>
                <ul className="space-y-2 opacity-90">
                  <li>• 7-day delivery</li>
                  <li>• AI-powered precision</li>
                  <li>• Comprehensive data analysis</li>
                  <li>• Affordable ($900)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Journey Section */}
          <div className="mt-16">
            <h3 className="text-3xl font-bold text-center mb-12 dark:text-dark-text-primary">
              The Journey to Better Performance
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 dark:bg-dark-bg-secondary rounded-full flex items-center justify-center">
                  <span className="text-blue-600 dark:text-dark-accent-light font-bold">1</span>
                </div>
                <h4 className="text-lg font-semibold mb-2 dark:text-dark-text-primary">Grant Access</h4>
                <p className="text-gray-600 dark:text-dark-text-secondary">
                  Securely provide access to your Google Ads account
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 dark:bg-dark-bg-secondary rounded-full flex items-center justify-center">
                  <span className="text-blue-600 dark:text-dark-accent-light font-bold">2</span>
                </div>
                <h4 className="text-lg font-semibold mb-2 dark:text-dark-text-primary">AI Analysis</h4>
                <p className="text-gray-600 dark:text-dark-text-secondary">
                  Our AI analyzes your account data and identifies opportunities
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 dark:bg-dark-bg-secondary rounded-full flex items-center justify-center">
                  <span className="text-blue-600 dark:text-dark-accent-light font-bold">3</span>
                </div>
                <h4 className="text-lg font-semibold mb-2 dark:text-dark-text-primary">Expert Review</h4>
                <p className="text-gray-600 dark:text-dark-text-secondary">
                  Senior PPC specialists validate and enhance the findings
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
