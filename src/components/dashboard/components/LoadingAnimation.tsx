import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

const LoadingAnimation: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <motion.div
        className="relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Outer circle */}
        <svg className="w-24 h-24">
          <circle
            className="text-gray-700"
            strokeWidth="4"
            stroke="currentColor"
            fill="transparent"
            r="45"
            cx="48"
            cy="48"
          />
          <motion.circle
            className="text-purple-500"
            strokeWidth="4"
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r="45"
            cx="48"
            cy="48"
            style={{
              strokeDasharray: '283',
              strokeDashoffset: '283',
            }}
            animate={{
              strokeDashoffset: [283, 0]
            }}
            transition={{
              duration: 1.5,
              ease: "easeInOut",
              repeat: Infinity,
            }}
          />
        </svg>

        {/* Center spinning icon */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <RefreshCw className="w-8 h-8 text-purple-400" />
          </motion.div>
        </div>

        {/* Pulsing background */}
        <motion.div
          className="absolute inset-0 rounded-full bg-purple-500/10"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>
    </div>
  );
};

export default LoadingAnimation;
