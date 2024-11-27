import React from 'react';
import { Lock } from 'lucide-react';
import { motion } from 'framer-motion';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  loading?: boolean;
  locked?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon,
  loading = false,
  locked = false,
}) => {
  return (
    <div className={`
      relative rounded-xl p-6 h-full
      ${locked ? 'bg-gradient-to-br from-purple-900/50 to-blue-900/50 border border-purple-500/20' : 
                'bg-gray-800/50 border border-gray-700/50'}
      backdrop-blur-sm transition-all duration-300
    `}>
      {loading ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="h-4 w-24 bg-gray-700 rounded animate-pulse" />
            <div className="h-6 w-6 bg-gray-700 rounded animate-pulse" />
          </div>
          <div className="h-8 w-32 bg-gray-700 rounded animate-pulse" />
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-300">{title}</h3>
            <span className="text-gray-400">{icon}</span>
          </div>
          <div className="flex items-baseline">
            <p className={`text-2xl font-semibold ${locked ? 'text-gray-400' : 'text-white'}`}>
              {value}
            </p>
          </div>
          {locked && (
            <motion.div 
              className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-xl backdrop-blur-[1px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <Lock className="w-5 h-5 text-purple-400" />
            </motion.div>
          )}
        </>
      )}
    </div>
  );
};

export default MetricCard;
