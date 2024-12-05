import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, LineChart, Target, Users, CheckCircle, AlertCircle, RefreshCw, Sparkles } from 'lucide-react';
import { useDomainAudit } from '../../../hooks/useDomainAudit';
import LoadingAnimation from '../../dashboard/components/LoadingAnimation';

type Props = {
  onComplete: () => void;
  domain: string;
};

type Stage = {
  icon: React.ReactNode;
  title: string;
  description: string;
  status: 'pending' | 'active' | 'completed' | 'error';
  isPremium?: boolean;
};

const fadeInUp = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.2 }
};

const stageTransition = {
  initial: { opacity: 0, x: -10 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 10 },
  transition: { duration: 0.2 }
};

export default function AnalysisProgress({ onComplete, domain }: Props) {
  const {
    data,
    partialData,
    error,
    isLoading,
    isEnrichmentLoading,
    progress,
    isPremium,
    retry,
    isProcessing
  } = useDomainAudit(domain);

  const prefersReducedMotion = React.useMemo(() => 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  , []);

  React.useEffect(() => {
    if (data?.status === 'completed' && data?.enrichment_status === 'completed') {
      const delay = prefersReducedMotion ? 0 : 300;
      setTimeout(onComplete, delay);
    }
  }, [data?.status, data?.enrichment_status, onComplete, prefersReducedMotion]);

  const startTime = React.useMemo(() => {
    const timestamp = data?.metadata?.timestamp || partialData?.metadata?.timestamp;
    return timestamp ? new Date(timestamp).getTime() : Date.now();
  }, [data?.metadata?.timestamp, partialData?.metadata?.timestamp]);

  const { remainingSeconds, stages } = React.useMemo(() => {
    const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
    const estimatedTotalTime = isPremium ? 45 : 30;
    const remaining = Math.max(0, estimatedTotalTime - elapsedSeconds);

    const stagesList: Stage[] = [
      {
        icon: <Bot className="h-6 w-6" />,
        title: "Initial Analysis",
        description: "Processing domain data",
        status: !data ? 'pending' :
                data.status === 'processing' ? 'active' :
                data.status === 'completed' ? 'completed' : 'error'
      },
      {
        icon: <LineChart className="h-6 w-6" />,
        title: "Data Enrichment",
        description: "Gathering insights via Clay.com",
        status: !data ? 'pending' :
                data.status !== 'completed' ? 'pending' :
                data.enrichment_status === 'processing' ? 'active' :
                data.enrichment_status === 'completed' ? 'completed' : 'pending',
        isPremium: true
      },
      {
        icon: <Target className="h-6 w-6" />,
        title: "Traffic Analysis",
        description: "Analyzing website performance",
        status: !data ? 'pending' :
                data.status !== 'completed' ? 'pending' :
                data.enrichment_status === 'completed' && data.semrush_traffic_rank ? 'completed' : 'pending',
        isPremium: true
      },
      {
        icon: <Users className="h-6 w-6" />,
        title: "Report Generation",
        description: "Preparing your dashboard",
        status: !data ? 'pending' :
                data.status !== 'completed' ? 'pending' :
                data.enrichment_status === 'completed' ? 'completed' : 'pending'
      }
    ];

    return { remainingSeconds: remaining, stages: stagesList };
  }, [data, isPremium, startTime]);

  const renderEarlyInfo = React.useCallback(() => {
    if (!partialData) return null;
    return (
      <motion.div
        className="bg-gray-50 rounded-lg p-4 mb-6 text-sm"
        {...fadeInUp}
      >
        <h4 className="font-semibold mb-2">Initial Domain Information</h4>
        <p className="text-gray-600">{partialData.domain}</p>
        {partialData.metadata?.source && (
          <p className="text-gray-500 mt-1">Source: {partialData.metadata.source}</p>
        )}
      </motion.div>
    );
  }, [partialData]);

  if (isLoading && !partialData) {
    return (
      <div className="max-w-2xl mx-auto p-4 sm:p-0">
        <LoadingAnimation />
      </div>
    );
  }

  if (error) {
    return (
      <motion.div 
        className="max-w-2xl mx-auto text-center p-4 sm:p-0"
        {...fadeInUp}
      >
        <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-4">Analysis Error</h2>
        <p className="text-gray-600 mb-6">
          We encountered an issue while analyzing {domain}.
        </p>
        <div className="space-y-4">
          <motion.button
            onClick={() => retry()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2 mx-auto"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <RefreshCw className="h-4 w-4" />
            <span>Retry Analysis</span>
          </motion.button>
          <motion.button
            onClick={onComplete}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Return to Dashboard
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-0">
      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={fadeInUp}
      >
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
          Analyzing {domain}
          <AnimatePresence>
            {isPremium && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="inline-block ml-2"
              >
                <Sparkles className="h-5 w-5 text-yellow-500" />
              </motion.span>
            )}
          </AnimatePresence>
        </h2>
        
        <AnimatePresence mode="wait">
          {renderEarlyInfo()}
        </AnimatePresence>

        <p className="text-gray-600 mb-12 text-center">
          {remainingSeconds > 0 
            ? `Estimated time remaining: ${remainingSeconds} seconds`
            : 'Finalizing analysis...'}
        </p>

        <motion.div 
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-8 mb-8"
          variants={fadeInUp}
        >
          <div className="flex items-center justify-center mb-8">
            <div className="relative">
              <svg className="w-24 sm:w-32 h-24 sm:h-32">
                <circle
                  className="text-gray-200"
                  strokeWidth="8"
                  stroke="currentColor"
                  fill="transparent"
                  r="58"
                  cx="64"
                  cy="64"
                />
                <motion.circle
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
                    transformOrigin: '50% 50%',
                    transform: 'rotate(-90deg)',
                  }}
                  initial={{ strokeDashoffset: 364.425 }}
                  animate={{ 
                    strokeDashoffset: 364.425 * (1 - progress / 100),
                    transition: { duration: 0.3, ease: "easeInOut" }
                  }}
                />
              </svg>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <AnimatePresence mode="wait">
                  {isProcessing ? (
                    <motion.div
                      key="loading"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <RefreshCw className="h-8 sm:h-12 w-8 sm:w-12 text-blue-600" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="progress"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="text-xl sm:text-2xl font-bold text-blue-600"
                    >
                      {progress}%
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <AnimatePresence mode="wait">
              {stages.map((stage, index) => (
                <motion.div
                  key={stage.title}
                  className="flex items-center space-x-4"
                  variants={stageTransition}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  custom={index}
                >
                  <div className={`
                    ${stage.status === 'completed' ? 'text-green-500' :
                      stage.status === 'active' ? 'text-blue-600' :
                      stage.status === 'error' ? 'text-red-500' :
                      'text-gray-400'}
                    relative transition-colors duration-200
                  `}>
                    <AnimatePresence mode="wait">
                      {stage.status === 'completed' ? (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.2 }}
                        >
                          <CheckCircle className="h-6 w-6" />
                        </motion.div>
                      ) : (
                        stage.icon
                      )}
                    </AnimatePresence>
                    {stage.isPremium && (
                      <Sparkles className="h-3 w-3 text-yellow-500 absolute -top-1 -right-1" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold flex items-center">
                      {stage.title}
                      {stage.isPremium && (
                        <span className="ml-2 text-xs text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-full">
                          Premium
                        </span>
                      )}
                    </h3>
                    <p className="text-sm text-gray-500">{stage.description}</p>
                  </div>
                  <AnimatePresence mode="wait">
                    {stage.status === 'active' && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="w-4 h-4"
                      >
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        >
                          <RefreshCw className="h-4 w-4 text-blue-600" />
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>

        <motion.p 
          className="text-sm text-gray-500 text-center mt-8"
          variants={fadeInUp}
        >
          {isEnrichmentLoading 
            ? "Gathering additional insights..."
            : "We'll notify you once the analysis is complete."}
        </motion.p>
      </motion.div>
    </div>
  );
}
