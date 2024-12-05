import React from 'react';
import { Building2, Globe, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

interface CompanyProfileProps {
  domain: string;
  loading?: boolean;
}

const CompanyProfile: React.FC<CompanyProfileProps> = ({
  domain,
  loading = false
}) => {
  const getFaviconUrl = (domain: string) => {
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
  };

  if (loading) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 mb-8">
        <div className="flex items-center space-x-6">
          {/* Favicon skeleton */}
          <div className="w-16 h-16 bg-gray-700 rounded-lg animate-pulse" />
          
          <div className="flex-1 space-y-4">
            {/* Domain name skeleton */}
            <div className="h-8 w-48 bg-gray-700 rounded animate-pulse" />
            
            {/* Company info skeleton */}
            <div className="flex items-center space-x-2">
              <div className="h-4 w-24 bg-gray-700 rounded animate-pulse" />
              <div className="h-4 w-32 bg-gray-700 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 mb-8"
    >
      <div className="flex items-center space-x-6">
        <img
          src={getFaviconUrl(domain)}
          alt={`${domain} favicon`}
          className="w-16 h-16 rounded-lg bg-gray-700"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxyZWN0IHg9IjIiIHk9IjIiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgcng9IjIuMTgiIHJ5PSIyLjE4Ii8+PGxpbmUgeDE9IjciIHkxPSIyIiB4Mj0iNyIgeTI9IjIyIi8+PHBhdGggZD0iTTIwLjY2IDkuMzdhNiA2IDAgMCAxIDAgNS4yNmExLjA5IDEuMDkgMCAwIDEtLjUuNmwtMi45MiAxLjY5YTEuMDkgMS4wOSAwIDAgMS0xLjA5IDBsLTIuOTItMS42OWExLjA5IDEuMDkgMCAwIDEtLjUtLjZhNiA2IDAgMCAxIDAtNS4yNiAxLjA5IDEuMDkgMCAwIDEgLjUtLjZsMi45Mi0xLjY5YTEuMDkgMS4wOSAwIDAgMSAxLjA5IDBsMi45MiAxLjY5YTEuMDkgMS4wOSAwIDAgMSAuNS42eiIvPjwvc3ZnPg==';
          }}
        />
        
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h2 className="text-2xl font-bold text-white">{domain}</h2>
            <Globe className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="flex items-center space-x-2">
            <Building2 className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-300">Domain Analysis</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CompanyProfile;
