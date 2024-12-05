import React from 'react';
import { Building2, Globe, Briefcase, MapPin, Users, Calendar, Link2, LinkedinIcon, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { DomainAudit } from '../../../types/database';

interface CompanyProfileProps {
  domain: string;
  loading?: boolean;
  auditData?: DomainAudit;
}

const CompanyProfile: React.FC<CompanyProfileProps> = ({
  domain,
  loading = false,
  auditData
}) => {
  const getFaviconUrl = (domain: string) => {
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
  };

  if (loading) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 mb-8">
        <div className="flex items-center space-x-6">
          <div className="w-16 h-16 bg-gray-700 rounded-lg animate-pulse" />
          <div className="flex-1 space-y-4">
            <div className="h-8 w-48 bg-gray-700 rounded animate-pulse" />
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
      {/* Primary Information */}
      <div className="flex flex-col lg:flex-row lg:items-start gap-6 mb-6">
        {/* Logo and Basic Info */}
        <div className="flex items-start space-x-6">
          <img
            src={getFaviconUrl(domain)}
            alt={`${auditData?.company_name || domain} logo`}
            className="w-16 h-16 rounded-lg bg-gray-700"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxyZWN0IHg9IjIiIHk9IjIiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgcng9IjIuMTgiIHJ5PSIyLjE4Ii8+PGxpbmUgeDE9IjciIHkxPSIyIiB4Mj0iNyIgeTI9IjIyIi8+PHBhdGggZD0iTTIwLjY2IDkuMzdhNiA2IDAgMCAxIDAgNS4yNmExLjA5IDEuMDkgMCAwIDEtLjUuNmwtMi45MiAxLjY5YTEuMDkgMS4wOSAwIDAgMS0xLjA5IDBsLTIuOTItMS42OWExLjA5IDEuMDkgMCAwIDEtLjUtLjZhNiA2IDAgMCAxIDAtNS4yNiAxLjA5IDEuMDkgMCAwIDEgLjUtLjZsMi45Mi0xLjY5YTEuMDkgMS4wOSAwIDAgMSAxLjA5IDBsMi45MiAxLjY5YTEuMDkgMS4wOSAwIDAgMSAuNS42eiIvPjwvc3ZnPg==';
            }}
          />
          
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white mb-2">
              {auditData?.company_name || domain}
            </h2>
            
            <div className="flex flex-wrap gap-4">
              {/* Domain Link */}
              <a 
                href={`https://${domain}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-sm text-gray-300 hover:text-purple-400 transition-colors"
                title={domain}
              >
                <Globe className="w-5 h-5" />
              </a>

              {/* LinkedIn Link */}
              {auditData?.linkedin_url && (
                <a 
                  href={auditData.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-sm text-gray-300 hover:text-purple-400 transition-colors"
                  title="LinkedIn Profile"
                >
                  <LinkedinIcon className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Company Info and Specialties */}
        <div className="flex flex-col lg:flex-row gap-6 flex-1">
          {/* Company Info */}
          <div className="flex flex-col gap-3 lg:border-l lg:border-gray-700/50 lg:pl-6">
            {/* Industry */}
            <div className="flex items-center text-sm">
              <Briefcase className="w-4 h-4 text-gray-400 mr-2" />
              <span className="text-gray-300">Industry:</span>
              <span className="ml-2 text-white">
                {auditData?.clay_data?.industry || 'Not available'}
              </span>
            </div>

            {/* Company Size */}
            <div className="flex items-center text-sm">
              <Users className="w-4 h-4 text-gray-400 mr-2" />
              <span className="text-gray-300">Company Size:</span>
              <span className="ml-2 text-white">
                {auditData?.clay_data?.employee_count || 'Not available'}
              </span>
            </div>
          </div>

          {/* Specialties */}
          {auditData?.specialties && Array.isArray(auditData.specialties) && auditData.specialties.length > 0 && (
            <div className="lg:border-l lg:border-gray-700/50 lg:pl-6 flex-1">
              <h3 className="text-sm font-medium text-gray-300 mb-2">Specialties</h3>
              <div className="flex flex-wrap gap-2">
                {auditData.specialties.map((specialty, index) => (
                  <span 
                    key={index}
                    className="px-2 py-1 text-xs rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Secondary Information */}
      <div className="flex flex-col md:flex-row gap-4 pt-4 border-t border-gray-700/50">
        <div className="flex items-center text-sm">
          <MapPin className="w-4 h-4 text-gray-400 mr-2" />
          <span className="text-gray-300">Location:</span>
          <span className="ml-1 text-white">
            {auditData?.city_locality && auditData?.country
              ? `${auditData.city_locality}, ${auditData.country}`
              : 'Not available'}
          </span>
        </div>

        <div className="flex items-center text-sm">
          <Calendar className="w-4 h-4 text-gray-400 mr-2" />
          <span className="text-gray-300">Founded:</span>
          <span className="ml-1 text-white">
            {auditData?.founded_year || 'Not available'}
          </span>
        </div>

        <div className="flex items-center text-sm">
          <Users className="w-4 h-4 text-gray-400 mr-2" />
          <span className="text-gray-300">Social Followers:</span>
          <span className="ml-1 text-white">
            {auditData?.linkedin_follower_count 
              ? auditData.linkedin_follower_count.toLocaleString()
              : 'Not available'}
          </span>
        </div>
      </div>

      {/* Company Description */}
      {auditData?.company_description && (
        <div className="mt-4 pt-4 border-t border-gray-700/50">
          <p className="text-sm text-gray-300 leading-relaxed">
            {auditData.company_description}
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default CompanyProfile;
