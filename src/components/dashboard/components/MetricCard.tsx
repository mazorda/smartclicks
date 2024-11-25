import React from 'react';
import { Lock } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  locked?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, locked }) => (
  <div className="relative bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300">
    <div className="flex items-start justify-between">
      <div className="flex flex-col">
        <span className="text-gray-400 text-sm">{title}</span>
        <span className="text-2xl font-bold text-white mt-1">
          {locked ? '••••' : value}
        </span>
      </div>
      <div className="p-2 bg-gray-700/50 rounded-lg">
        {icon}
      </div>
    </div>
    {locked && (
      <div className="absolute inset-0 bg-gray-800/80 backdrop-blur-[2px] rounded-xl flex items-center justify-center">
        <Lock className="w-5 h-5 text-gray-400" />
      </div>
    )}
  </div>
);

export default MetricCard;
