import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, LineChart, Target, Users, ArrowRight, CheckCircle, FileText, AlertCircle, RefreshCw } from 'lucide-react';
import { useDomainAudit } from '../../../hooks/useDomainAudit';

type Props = {
  onComplete: () => void;
  domain: string;
};

type Stage = {
  icon: React.ReactNode;
  title: string;
  description: string;
  status: 'pending' | 'active' | 'completed' | 'error';
};

export default function AnalysisProgress({ onComplete, domain }: Props) {
  const { data, error, refresh, retry } = useDomainAudit();
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  // Calculate estimated time remaining
  const startTime = data?.metadata?.timestamp ? new Date(data.metadata.timestamp).getTime() : Date.now();
  const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
  const estimatedTotalTime = 30; // 30 seconds for enrichment
  const remainingSeconds = Math.max(0, estimatedTotalTime - elapsedSeconds);

  // Define stages based on enrichment_status
  const stages: Stage[] = [
    {
      icon: <Bot className="h-6 w-6" />,
      title: "AI Analysis",
      description: "Processing domain data",
      status: data?.enrichment_status === 'pending' ? 'active' : 'completed'
    },
    {
      icon: <LineChart className="h-6 w-6" />,
      title: "Data Enrichment",
      description: "Gathering insights via Clay.com",
      status: data?.enrichment_status === 'processing' ? 'active' : 
             data?.enrichment_status === 'completed' ? 'completed' : 'pending'
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Report Generation",
      description: "Preparing your dashboard",
      status: data?.enrichment_status === 'completed' ? 'completed' : 'pending'
    }
  ];

  // Calculate overall progress
  const getProgress = () => {
    switch (data?.enrichment_status) {
      case 'pending': return 33;
      case 'processing': return 66;
      case 'completed': return 100;
      default: return 0;
    }
  };

  useEffect(() => {
    const pollInterval = setInterval(() => {
      refresh();
    }, 2000);

    return () => clearInterval(pollInterval);
  }, [refresh]);

  useEffect(() => {
    if (data?.enrichment_status === 'completed') {
      setTimeout(onComplete, 1000);
    }
  }, [data?.enrichment_status, onComplete]);

  // Handle errors with retry logic
  const handleRetry = async () => {
    if (retryCount < MAX_RETRIES) {
      setRetryCount(prev => prev + 1);
      await retry();
    }
  };

  if (error && retryCount >= MAX_RETRIES) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-4">Analysis Error</h2>
        <p className="text-gray-600 mb-6">
          We encountered an issue while analyzing {domain}. Please try again later.
        </p>
        <button
          onClick={onComplete}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold mb-6 text-center">Analyzing {domain}</h2>
        <p className="text-gray-600 mb-12 text-center">
          {remainingSeconds > 0 
            ? `Estimated time remaining: ${remainingSeconds} seconds`
            : 'Finalizing analysis...'}
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
                    strokeDashoffset: 364.425 * (1 - getProgress() / 100),
                    transform: 'rotate(-90deg)',
                    transformOrigin: '50% 50%'
                  }}
                />
              </svg>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <RefreshCw className="h-12 w-12 text-blue-600" />
                </motion.div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {stages.map((stage, index) => (
              <div key={stage.title} className="flex items-center space-x-4">
                <div className={`
                  ${stage.status === 'completed' ? 'text-green-500' :
                    stage.status === 'active' ? 'text-blue-600' :
                    'text-gray-400'}
                `}>
                  {stage.status === 'completed' ? <CheckCircle className="h-6 w-6" /> : stage.icon}
                </div>
                <div>
                  <h3 className="font-semibold">{stage.title}</h3>
                  <p className="text-sm text-gray-500">{stage.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {error && retryCount < MAX_RETRIES && (
          <div className="text-center mb-8">
            <button
              onClick={handleRetry}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center space-x-2 mx-auto"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Retry Analysis</span>
            </button>
            <p className="text-sm text-gray-500 mt-2">
              Attempt {retryCount + 1} of {MAX_RETRIES}
            </p>
          </div>
        )}

        <div className="flex justify-center">
          <button
            onClick={onComplete}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center space-x-2"
          >
            <span>Skip to Dashboard</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <p className="text-sm text-gray-500 text-center mt-8">
          We'll notify you once the analysis is complete.
        </p>
      </motion.div>
    </div>
  );
}
