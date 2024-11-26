import React from 'react';

interface LoadingExperienceProps {
  status: 'loading' | 'processing' | 'enriching' | 'analyzing';
  showSparkle?: boolean;
}

const LoadingExperience: React.FC<LoadingExperienceProps> = ({ status, showSparkle = false }) => {
  const getStatusMessage = () => {
    switch (status) {
      case 'loading':
        return 'Loading...';
      case 'processing':
        return 'Processing your request...';
      case 'enriching':
        return 'Enriching data...';
      case 'analyzing':
        return 'Analyzing results...';
      default:
        return 'Loading...';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] p-8">
      <div className="relative">
        {/* Animated loading circle */}
        <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600" />
        
        {/* Sparkle effect */}
        {showSparkle && (
          <div className="absolute inset-0 animate-pulse">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <svg
                className="w-6 h-6 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 2a1 1 0 011 1v1.323l3.954 1.582a1 1 0 01.646.942v4.308a1 1 0 01-.646.942L11 13.677V15a1 1 0 11-2 0v-1.323l-3.954-1.582a1 1 0 01-.646-.942V6.846a1 1 0 01.646-.942L9 4.323V3a1 1 0 011-1zm0 4.618L7.5 7.5 10 8.382l2.5-.882L10 6.618z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        )}
      </div>
      
      {/* Status message */}
      <p className="mt-4 text-lg text-gray-600 animate-pulse">
        {getStatusMessage()}
      </p>
    </div>
  );
};

export default LoadingExperience;
