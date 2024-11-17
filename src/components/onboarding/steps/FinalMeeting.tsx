import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, CheckCircle2, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import type { OnboardingData } from '../OnboardingFlow';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

type Props = {
  data: OnboardingData;
  onComplete: () => void;
};

export default function FinalMeeting({ data, onComplete }: Props) {
  const { signInDemo } = useAuth();
  const navigate = useNavigate();
  const presentationDate = data.presentationDate || (data.kickoffDate ? new Date(data.kickoffDate.getTime() + 7 * 24 * 60 * 60 * 1000) : new Date());

  const handleComplete = async () => {
    try {
      await signInDemo();
      navigate('/dashboard');
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-8">
          <CheckCircle2 className="h-8 w-8 text-green-500" />
        </div>

        <h2 className="text-3xl font-bold mb-4">You're All Set!</h2>
        <p className="text-gray-600 mb-8">
          Click below to access your demo dashboard and explore all features.
        </p>

        <button
          onClick={handleComplete}
          className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition group"
        >
          <span>Go to Dashboard</span>
          <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
        </button>
      </motion.div>
    </div>
  );
}