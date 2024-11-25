import React from 'react';
import { Building2, Users, Globe2, ArrowUpRight, Globe } from 'lucide-react';
import LoadingAnimation from './LoadingAnimation';

const CompanyProfile: React.FC = () => (
  <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 mb-8 border border-gray-700/50">
    <div className="flex flex-col gap-4">
      {/* Header with Logo and Company Name */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-white p-2 flex-shrink-0 border border-gray-700/50">
            <img 
              src="https://s3.amazonaws.com/media.mixrank.com/hero-img/051dcd648d2e086ba34a8d68d3009754" 
              alt="Company Logo"
              className="w-full h-full object-contain"
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/48?text=HG';
              }}
            />
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">HyperGrowth Partners</h1>
            <LoadingAnimation />
          </div>
        </div>
        <button className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold text-white transition-all duration-300 flex items-center gap-2 group">
          Start Your Audit
          <ArrowUpRight className="w-5 h-5 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
        </button>
      </div>

      {/* Company Details */}
      <div className="border-t border-gray-700/50 pt-4">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <div className="flex items-center gap-2 text-gray-400">
            <Globe className="w-4 h-4" />
            <span className="text-sm">hypergrowthpartners.com</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <Users className="w-4 h-4" />
            <span className="text-sm">50-200 employees</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <Globe2 className="w-4 h-4" />
            <span className="text-sm">United States</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <Building2 className="w-4 h-4" />
            <span className="text-sm">Software & Technology</span>
          </div>
        </div>
      </div>

      {/* Google Ads Health Score Analysis */}
      <div className="border-t border-gray-700/50 pt-4">
        <h3 className="text-lg font-semibold mb-2 text-white">Google Ads Health Score Analysis</h3>
        <p className="text-gray-300 text-base leading-relaxed">
          The website hypergrowthpartners.com shows a strong foundation for Google Ads due to its clear service offerings and effective calls-to-action. However, a complete evaluation of its optimization for Google Ads is limited by the lack of detailed information regarding meta descriptions, header tags, and structured data. The overall user experience and navigation are positive, but the absence of specific SEO elements and mobile responsiveness impacts the score. Therefore, while the website has potential, the incomplete data prevents a higher score.
        </p>
      </div>
    </div>
  </div>
);

export default CompanyProfile;
