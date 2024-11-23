import React from 'react';
import { Check, ArrowRight, Star, Bot, Shield } from 'lucide-react';

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
    description: "Your 24/7 Marketing Intelligence Assistant (Coming Soon)",
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
    <section id="pricing" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">SmartClicks.AI</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Get a comprehensive account audit powered by AI and validated by experts, 
            delivered in just 7 days at a fraction of traditional audit costs.
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl border border-blue-100 p-8 mb-12">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-2">Audit Pro</h3>
              <div className="flex items-baseline justify-center space-x-2 mb-2">
                <span className="text-lg text-gray-500 line-through">$1,800</span>
                <span className="text-5xl font-bold">$99</span>
                <span className="text-gray-600">one-time</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  Limited Time Offer
                </span>
                <span className="text-sm text-blue-600 font-medium">
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
                        ? 'text-gray-400'
                        : feature.highlight 
                          ? 'text-green-600' 
                          : 'text-blue-600'
                    }`} />
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className={`${
                          feature.comingSoon 
                            ? 'text-gray-400'
                            : feature.highlight 
                              ? 'text-gray-700 font-medium' 
                              : 'text-gray-700'
                        }`}>
                          {feature.text}
                        </span>
                        {feature.comingSoon && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                            COMING SOON
                          </span>
                        )}
                      </div>
                      <p className={`text-sm ${feature.comingSoon ? 'text-gray-400' : 'text-gray-500'} mt-0.5`}>
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
                className="px-12 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center space-x-2 text-lg font-medium mx-auto"
              >
                <span>Start Your Audit</span>
                <ArrowRight className="h-5 w-5" />
              </button>
              <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-gray-600">
                <Shield className="h-5 w-5 text-green-600" />
                <span>30-Day Money Back Guarantee - Not satisfied? Get a full refund</span>
              </div>
            </div>
          </div>

          {/* Meet MiaAI Section */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-12">
            <div className="flex items-center space-x-4 mb-6">
              <img
                src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=150"
                alt="MiaAI"
                className="w-12 h-12 rounded-full border-2 border-blue-200"
              />
              <div>
                <h4 className="text-lg font-semibold">Meet MiaAI - Your Marketing Intelligence Assistant</h4>
                <p className="text-blue-600">Coming in 90 days</p>
              </div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-gray-700">
                Get 90-days free access to MiaAI, your personal AI assistant who understands your Google Ads account inside out. 
                Ask questions, get insights, and implement optimizations - all through a simple chat interface.
              </p>
            </div>
            <button
              disabled
              className="mt-4 px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 rounded-lg transition flex items-center cursor-not-allowed"
            >
              <Bot className="h-4 w-4 mr-2" />
              Coming Soon
            </button>
          </div>

          {/* Testimonials */}
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-xl">
                <div className="flex items-center justify-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <img
                    src={testimonial.image}
                    alt={testimonial.author}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div>
                    <p className="font-medium">{testimonial.author}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}