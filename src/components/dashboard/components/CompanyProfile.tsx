import React from 'react';
import { Building2, Users, Globe2, ArrowUpRight, Globe, RefreshCw } from 'lucide-react';
import LoadingAnimation from './LoadingAnimation';

interface CompanyProfileProps {
  domain: string;
  healthScoreAnalysis: string | null;
  loading?: boolean;
}

const CompanyProfile: React.FC<CompanyProfileProps> = ({ domain, healthScoreAnalysis, loading }) => (
  <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 mb-8 border border-gray-700/50">
    <div className="flex flex-col gap-4">
      {/* Header with Logo and Company Name */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-white p-2 flex-shrink-0 border border-gray-700/50 relative">
            <img 
              src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`}
              alt="Company Logo"
              className={`w-full h-full object-contain ${loading ? 'opacity-50' : 'opacity-100'} transition-opacity duration-300`}
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/48?text=404';
              }}
            />
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <RefreshCw className="w-6 h-6 text-gray-400 animate-spin" />
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{domain.split('.')[0].charAt(0).toUpperCase() + domain.split('.')[0].slice(1)}</h1>
              {loading && <RefreshCw className="w-4 h-4 text-purple-400 animate-spin" />}
            </div>
          </div>
        </div>
        <button 
          className={`px-6 py-3 ${loading ? 'bg-gray-700 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'} rounded-lg font-semibold text-white transition-all duration-300 flex items-center gap-2 group`}
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin" />
              Processing
            </span>
          ) : (
            <>
              Start Your Audit
              <ArrowUpRight className="w-5 h-5 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
            </>
          )}
        </button>
      </div>

      {/* Company Details */}
      <div className="border-t border-gray-700/50 pt-4">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <div className="flex items-center gap-2 text-gray-400">
            <Globe className="w-4 h-4" />
            <span className="text-sm">{domain}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <Users className="w-4 h-4" />
            <span className="text-sm flex items-center gap-1">
              {loading && <RefreshCw className="w-3 h-3 animate-spin" />}
              <span className={loading ? 'text-gray-500' : ''}>
                Employee data pending
              </span>
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <Globe2 className="w-4 h-4" />
            <span className="text-sm flex items-center gap-1">
              {loading && <RefreshCw className="w-3 h-3 animate-spin" />}
              <span className={loading ? 'text-gray-500' : ''}>
                Location pending
              </span>
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <Building2 className="w-4 h-4" />
            <span className="text-sm flex items-center gap-1">
              {loading && <RefreshCw className="w-3 h-3 animate-spin" />}
              <span className={loading ? 'text-gray-500' : ''}>
                Industry pending
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Google Ads Health Score Analysis */}
      <div className="border-t border-gray-700/50 pt-4">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-lg font-semibold text-white">Google Ads Health Score Analysis</h3>
          {loading && <RefreshCw className="w-4 h-4 text-purple-400 animate-spin" />}
        </div>
        <p className={`text-gray-300 text-base leading-relaxed ${loading ? 'text-gray-500' : ''}`}>
          {healthScoreAnalysis || 'Analysis pending...'}
        </p>
      </div>
    </div>
  </div>
);

export default CompanyProfile;
