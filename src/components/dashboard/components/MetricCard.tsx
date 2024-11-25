import React from 'react';
import { Lock, RefreshCw } from 'lucide-react';

export interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  locked?: boolean;
  loading?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, locked, loading }) => (
  <div className="relative bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300">
    <div className="flex items-start justify-between">
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-sm">{title}</span>
          {loading && (
            <RefreshCw className="w-3 h-3 text-purple-400 animate-spin" />
          )}
        </div>
        <span className={`text-2xl font-bold mt-1 ${loading ? 'text-gray-400' : 'text-white'} transition-colors duration-300`}>
          {locked ? '••••' : value}
        </span>
      </div>
      <div className={`p-2 rounded-lg ${loading ? 'bg-gray-700/30' : 'bg-gray-700/50'} transition-colors duration-300`}>
        {icon}
      </div>
    </div>
    {locked && !loading && (
      <div className="absolute inset-0 bg-gray-800/80 backdrop-blur-[2px] rounded-xl flex items-center justify-center">
        <Lock className="w-5 h-5 text-gray-400" />
      </div>
    )}
  </div>
);

export default MetricCard;
