import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SignupStep from './steps/SignupStep';
import GoogleSignup from './steps/GoogleSignup';
import CompanyInfo from './steps/CompanyInfo';
import PaymentStep from './steps/PaymentStep';
import BookMeeting from './steps/BookMeeting';
import AnalysisProgress from './steps/AnalysisProgress';
import HumanReview from './steps/HumanReview';
import FinalMeeting from './steps/FinalMeeting';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';

export type OnboardingData = {
  email: string;
  companyName: string;
  website: string;
  contactName: string;
  jobTitle: string;
  goals: string;
  challenges: string;
  selectedPlan: string;
  techStack?: string;
  conversionType?: string;
  adSpend?: string;
  kickoffDate?: Date;
  presentationDate?: Date;
  [key: string]: any;
};

const steps = [
  { id: 'signup', label: 'Account' },
  { id: 'google', label: 'Connect' },
  { id: 'company', label: 'Details' },
  { id: 'payment', label: 'Payment' },
  { id: 'meeting', label: 'Schedule' },
  { id: 'analysis', label: 'Analysis' },
  { id: 'review', label: 'Review' },
  { id: 'final', label: 'Complete' }
] as const;

type Step = typeof steps[number]['id'];

type Props = {
  onCancel: () => void;
};

export default function OnboardingFlow({ onCancel }: Props) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>('signup');
  const [data, setData] = useState<OnboardingData>({
    email: '',
    companyName: '',
    website: '',
    contactName: '',
    jobTitle: '',
    goals: '',
    challenges: '',
    selectedPlan: 'premium'
  });

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);

  const updateData = (newData: Partial<OnboardingData>) => {
    setData(prev => ({ ...prev, ...newData }));
  };

  const nextStep = () => {
    const currentIndex = steps.findIndex(step => step.id === currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const previousStep = () => {
    const currentIndex = steps.findIndex(step => step.id === currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id);
    } else {
      onCancel();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleComplete = () => {
    navigate('/sample-report');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'signup':
        return <SignupStep onComplete={nextStep} onBack={onCancel} />;
      case 'google':
        return <GoogleSignup onComplete={nextStep} onBack={previousStep} updateData={updateData} />;
      case 'company':
        return <CompanyInfo onComplete={nextStep} onBack={previousStep} updateData={updateData} data={data} />;
      case 'payment':
        return <PaymentStep onComplete={nextStep} onBack={previousStep} selectedPlan={data.selectedPlan} />;
      case 'meeting':
        return <BookMeeting onComplete={nextStep} onBack={previousStep} updateData={updateData} />;
      case 'analysis':
        return <AnalysisProgress onComplete={nextStep} onBack={previousStep} />;
      case 'review':
        return <HumanReview onComplete={nextStep} onBack={previousStep} />;
      case 'final':
        return <FinalMeeting data={data} onComplete={handleComplete} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white pt-20">
      <div className="container mx-auto px-4 py-12">
        {/* Progress Indicator */}
        <div className="mb-12">
          {/* Mobile Progress */}
          <div className="md:hidden">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-600">
                Step {currentStepIndex + 1} of {steps.length}
              </span>
              <span className="text-sm font-medium text-blue-600">
                {steps[currentStepIndex].label}
              </span>
            </div>
            <div className="relative">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2" />
              <div
                className="absolute top-1/2 left-0 h-0.5 bg-blue-600 -translate-y-1/2 transition-all duration-500"
                style={{ width: `${(currentStepIndex + 1) * (100 / steps.length)}%` }}
              />
              <div className="relative flex justify-between">
                {steps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
                      index <= currentStepIndex
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    {index < currentStepIndex ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <span className="text-xs">{index + 1}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Desktop Progress */}
          <div className="hidden md:block">
            <div className="relative">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2" />
              <div
                className="absolute top-1/2 left-0 h-0.5 bg-blue-600 -translate-y-1/2 transition-all duration-500"
                style={{ width: `${(currentStepIndex + 1) * (100 / steps.length)}%` }}
              />
              <div className="relative flex justify-between">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex flex-col items-center">
                    <motion.div
                      initial={false}
                      animate={{
                        scale: index === currentStepIndex ? 1.2 : 1,
                        backgroundColor: index <= currentStepIndex ? '#2563eb' : '#e5e7eb',
                      }}
                      className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 transition-colors duration-300`}
                    >
                      {index < currentStepIndex ? (
                        <Check className="h-4 w-4 text-white" />
                      ) : (
                        <span className={`text-sm ${
                          index <= currentStepIndex ? 'text-white' : 'text-gray-500'
                        }`}>
                          {index + 1}
                        </span>
                      )}
                    </motion.div>
                    <motion.span
                      initial={false}
                      animate={{
                        color: index === currentStepIndex ? '#2563eb' : '#6b7280',
                        scale: index === currentStepIndex ? 1.05 : 1,
                      }}
                      className="text-sm font-medium"
                    >
                      {step.label}
                    </motion.span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}