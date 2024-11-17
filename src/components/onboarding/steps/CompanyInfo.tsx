import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Globe, User, Mail, ArrowLeft } from 'lucide-react';
import type { OnboardingData } from '../OnboardingFlow';

type Props = {
  onComplete: () => void;
  onBack: () => void;
  updateData: (data: Partial<OnboardingData>) => void;
  data: OnboardingData;
};

type Question = {
  id: string;
  question: string;
  options: string[];
  icon?: string;
  multiSelect?: boolean;
};

const questions: Question[] = [
  {
    id: 'techStack',
    question: 'What tools do you use? (Select all that apply)',
    options: ['Hubspot', 'Salesforce', 'GA4', 'Clay.com', 'GTM', 'Shopify', 'Segment.com', 'Zapier', 'Other'],
    icon: '🛠️',
    multiSelect: true
  },
  {
    id: 'conversionType',
    question: 'What are you tracking?',
    options: [
      'Online Sales',
      'Lead Forms',
      'Phone Calls',
      'Email Signups',
      'App Downloads',
      'Video Views',
      'Product Demo Bookings',
      'Free Trial Signups',
      'Not Set Up'
    ],
    icon: '📊',
    multiSelect: true
  }
];

export default function CompanyInfo({ onComplete, onBack, updateData, data }: Props) {
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 2;
  const [selectedTech, setSelectedTech] = useState<string[]>([]);
  const [selectedTracking, setSelectedTracking] = useState<string[]>([]);

  const handleTechSelection = useCallback((tech: string) => {
    setSelectedTech(prev => {
      const newSelection = prev.includes(tech)
        ? prev.filter(t => t !== tech)
        : [...prev, tech];
      
      updateData({ techStack: newSelection.join(', ') });
      return newSelection;
    });
  }, [updateData]);

  const handleTrackingSelection = useCallback((tracking: string) => {
    setSelectedTracking(prev => {
      const newSelection = prev.includes(tracking)
        ? prev.filter(t => t !== tracking)
        : [...prev, tracking];
      
      updateData({ conversionType: newSelection.join(', ') });
      return newSelection;
    });
  }, [updateData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      onBack();
    }
  };

  const renderBasicInfo = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
            <Mail className="h-4 w-4" />
            <span>Email Address</span>
          </label>
          <input
            type="email"
            value={data.email}
            onChange={(e) => updateData({ email: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="your@email.com"
          />
        </div>

        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
            <Building2 className="h-4 w-4" />
            <span>Company Name</span>
          </label>
          <input
            type="text"
            value={data.companyName}
            onChange={(e) => updateData({ companyName: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Your Company"
          />
        </div>

        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
            <Globe className="h-4 w-4" />
            <span>Website URL</span>
          </label>
          <input
            type="url"
            value={data.website}
            onChange={(e) => updateData({ website: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="https://your-website.com"
          />
        </div>

        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
            <User className="h-4 w-4" />
            <span>Your Name</span>
          </label>
          <input
            type="text"
            value={data.contactName}
            onChange={(e) => updateData({ contactName: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="John Doe"
          />
        </div>
      </div>

      <div>
        <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
          <span className="text-xl">🎯</span>
          <span>What are your main advertising goals?</span>
        </label>
        <textarea
          value={data.goals}
          onChange={(e) => updateData({ goals: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows={3}
          placeholder="E.g., Increase ROAS, expand to new markets, etc."
        />
      </div>
    </motion.div>
  );

  const renderQuestions = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      {questions.map((q, index) => (
        <div key={q.id} className="space-y-4">
          <h3 className="text-xl font-medium text-gray-800 flex items-center space-x-2">
            {q.icon && <span className="text-2xl">{q.icon}</span>}
            <span>{q.question}</span>
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {q.options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => q.id === 'techStack' 
                  ? handleTechSelection(option)
                  : handleTrackingSelection(option)}
                className={`p-4 rounded-lg border text-center transition ${
                  q.id === 'techStack'
                    ? selectedTech.includes(option)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-200'
                    : selectedTracking.includes(option)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-200'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
          {q.id === 'techStack' && selectedTech.length > 0 && (
            <p className="text-sm text-gray-600">
              Selected: {selectedTech.join(', ')}
            </p>
          )}
          {q.id === 'conversionType' && selectedTracking.length > 0 && (
            <p className="text-sm text-gray-600">
              Selected: {selectedTracking.join(', ')}
            </p>
          )}
        </div>
      ))}
    </motion.div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <button
          onClick={handleBack}
          className="mb-6 flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </button>

        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <div
                key={index}
                className={`h-2 w-16 rounded-full transition-colors ${
                  index <= currentStep ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          <h2 className="text-3xl font-bold mb-4">Tell Us About Your Business</h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Help us understand your business better to provide a tailored audit experience.
            All fields are optional but will help us deliver more accurate insights.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <AnimatePresence mode="wait">
            {currentStep === 0 ? renderBasicInfo() : renderQuestions()}
          </AnimatePresence>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={handleBack}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Back
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              {currentStep === totalSteps - 1 ? 'Continue to Payment' : 'Next'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}