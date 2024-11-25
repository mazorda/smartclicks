import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingAnimation: React.FC = () => {
  return (
    <div className="relative">
      <div className="flex items-center gap-1 bg-gray-700/30 rounded-full px-3 py-1 transition-all duration-300">
        <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
        <span className="text-xs text-gray-400">Processing</span>
      </div>
    </div>
  );
};

export default LoadingAnimation;
