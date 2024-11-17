import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, CheckCircle, FileText, ArrowRight } from 'lucide-react';

type Props = {
  onComplete: () => void;
};

export default function HumanReview({ onComplete }: Props) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 1000);
          return 100;
        }
        return prev + 1;
      });
    }, 50);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold mb-6 text-center">Expert Review in Progress</h2>
        <p className="text-gray-600 mb-12 text-center">
          Our PPC specialists are reviewing the AI analysis and preparing your personalized recommendations.
        </p>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex items-center justify-center mb-8">
            <div className="relative">
              <svg className="w-32 h-32">
                <circle
                  className="text-gray-200"
                  strokeWidth="8"
                  stroke="currentColor"
                  fill="transparent"
                  r="58"
                  cx="64"
                  cy="64"
                />
                <circle
                  className="text-blue-600"
                  strokeWidth="8"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="58"
                  cx="64"
                  cy="64"
                  style={{
                    strokeDasharray: '364.425',
                    strokeDashoffset: 364.425 * (1 - progress / 100),
                    transform: 'rotate(-90deg)',
                    transformOrigin: '50% 50%'
                  }}
                />
              </svg>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <Users className="h-12 w-12 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <CheckCircle className="h-6 w-6 text-green-500" />
              <div>
                <h3 className="font-semibold">AI Analysis Complete</h3>
                <p className="text-sm text-gray-500">Machine learning insights generated</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Users className="h-6 w-6 text-blue-600" />
              <div>
                <h3 className="font-semibold">Expert Review</h3>
                <p className="text-sm text-gray-500">PPC specialists analyzing results</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <FileText className="h-6 w-6 text-gray-400" />
              <div>
                <h3 className="font-semibold">Report Generation</h3>
                <p className="text-sm text-gray-500">Preparing your custom action plan</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={onComplete}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center space-x-2"
          >
            <span>Skip Animation</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <p className="text-sm text-gray-500 text-center mt-8">
          This process typically takes 24-48 hours. We'll notify you once the review is complete.
        </p>
      </motion.div>
    </div>
  );
}