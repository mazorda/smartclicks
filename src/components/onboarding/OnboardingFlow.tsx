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
  'signup',
  'google',
  'company',
  'payment',
  'meeting',
  'analysis',
  'review',
  'final'
] as const;

type Step = typeof steps[number];

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

  const updateData = (newData: Partial<OnboardingData>) => {
    setData(prev => ({ ...prev, ...newData }));
  };

  const nextStep = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const previousStep = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
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
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {steps.map((step, index) => (
              <React.Fragment key={step}>
                {index > 0 && (
                  <div
                    className={`h-1 w-8 ${
                      index <= steps.indexOf(currentStep)
                        ? 'bg-blue-600'
                        : 'bg-gray-200'
                    }`}
                  />
                )}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    index <= steps.indexOf(currentStep)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {index + 1}
                </div>
              </React.Fragment>
            ))}
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