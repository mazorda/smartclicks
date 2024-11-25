import React from 'react';
import { useLocation } from 'react-router-dom';
import { Zap, Users, Globe2, Target, ChevronRight, Lock, RefreshCw } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import CompanyProfile from './components/CompanyProfile';
import MetricCard from './components/MetricCard';
import IndustryTrendsChart from './components/IndustryTrendsChart';
import { useDomainAudit } from '../../hooks/useDomainAudit';
import LoadingAnimation from './components/LoadingAnimation';
import { logger } from '../../services/logger';

const AuditDashboard: React.FC = () => {
  useTheme();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const domain = searchParams.get('domain');

  const { 
    data: auditData, 
    isLoading,
    isProcessing,
    isError, 
    error,
    retry,
    progress
  } = useDomainAudit(domain || undefined);

  // Log any errors that occur
  React.useEffect(() => {
    if (isError && error) {
      logger.error('Error in AuditDashboard:', { error, domain });
    }
  }, [isError, error, domain]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6 flex items-center justify-center">
        <div className="text-center">
          <LoadingAnimation />
          <p className="mt-4 text-gray-400">Loading domain audit data...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 mb-4">
            <Target className="w-12 h-12 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Error Loading Data</h2>
            <p className="text-gray-400 mb-4">{error instanceof Error ? error.message : 'An unexpected error occurred'}</p>
          </div>
          <button
            onClick={retry}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold text-white transition-all duration-300"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!auditData) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6 flex items-center justify-center">
        <div className="text-center">
          <Globe2 className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h2 className="text-xl font-semibold mb-2">No Data Available</h2>
          <p className="text-gray-400">
            {domain 
              ? `No audit data found for ${domain}`
              : 'Please submit a domain to analyze'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Progress Indicator */}
      {isProcessing && (
        <div className="mb-6 bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Analyzing domain data...</span>
            <span className="text-sm text-purple-400">{progress}%</span>
          </div>
          <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-purple-500 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Company Profile */}
      <CompanyProfile 
        domain={auditData.domain}
        healthScoreAnalysis={auditData.r1_health_score_analysis}
        loading={isProcessing}
      />

      {/* KPIs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Site Engagement Score"
          value={auditData.r1_avg_time_on_site ? `${Math.round(auditData.r1_avg_time_on_site)}` : '••••'}
          icon={<Zap className="w-5 h-5 text-green-400" />}
          loading={isProcessing}
          locked={!auditData.r1_avg_time_on_site}
        />
        <MetricCard
          title="Monthly Visitors"
          value={auditData.r1_total_visits ? `${(auditData.r1_total_visits / 1000).toFixed(1)}K` : '••••'}
          icon={<Users className="w-5 h-5 text-purple-400" />}
          loading={isProcessing}
          locked={!auditData.r1_total_visits}
        />
        <MetricCard
          title="Traffic World Rank"
          value={auditData.r1_traffic_rank ? auditData.r1_traffic_rank.toLocaleString() : '••••'}
          icon={<Globe2 className="w-5 h-5 text-blue-400" />}
          loading={isProcessing}
          locked={!auditData.r1_traffic_rank}
        />
        <MetricCard
          title="Google Ads Health Score"
          value={auditData.r1_gads_health_score ? auditData.r1_gads_health_score.toString() : '••••'}
          icon={<Target className="w-5 h-5 text-orange-400" />}
          loading={isProcessing}
          locked={!auditData.r1_gads_health_score}
        />
      </div>

      {/* Landing Pages & Competitors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Top Performing Landing Pages</h2>
            {isProcessing && <RefreshCw className="w-5 h-5 text-purple-400 animate-spin" />}
          </div>
          <div className="space-y-4">
            {auditData.r1_landing_pages && typeof auditData.r1_landing_pages === 'object' ? (
              Object.entries(auditData.r1_landing_pages).slice(0, 3).map(([path, score], i) => (
                <div key={i} className={`flex items-center justify-between p-3 bg-gray-700/50 rounded-lg ${i > 0 ? 'blur-[2px]' : ''}`}>
                  {i > 0 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Lock className="w-5 h-5 text-gray-400" />
                    </div>
                  )}
                  <span className="text-gray-300">{path}</span>
                  <span className="text-green-400 font-semibold">{typeof score === 'number' ? `${score}% Score` : String(score)}</span>
                </div>
              ))
            ) : (
              <div className="p-3 bg-gray-700/50 rounded-lg text-center text-gray-400">
                {isProcessing ? 'Analyzing landing pages...' : 'No landing page data available'}
              </div>
            )}
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Traffic Sources</h2>
            {isProcessing && <RefreshCw className="w-5 h-5 text-purple-400 animate-spin" />}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <MetricCard
              title="Total Visitors"
              value={auditData.r1_total_visits ? auditData.r1_total_visits.toLocaleString() : '••••'}
              icon={<Users className="w-5 h-5 text-blue-400" />}
              loading={isProcessing}
              locked={!auditData.r1_total_visits}
            />
            <MetricCard
              title="Paid Visitors"
              value={auditData.r1_paid_visits ? auditData.r1_paid_visits.toLocaleString() : '••••'}
              icon={<Target className="w-5 h-5 text-purple-400" />}
              loading={isProcessing}
              locked={!auditData.r1_paid_visits}
            />
            <MetricCard
              title="Organic Visitors"
              value={auditData.r1_organic_visits ? auditData.r1_organic_visits.toLocaleString() : '••••'}
              icon={<Globe2 className="w-5 h-5 text-green-400" />}
              loading={isProcessing}
              locked={!auditData.r1_organic_visits}
            />
            <MetricCard
              title="Bounce Rate"
              value={auditData.r1_bounce_rate ? `${auditData.r1_bounce_rate}%` : '••••'}
              icon={<Target className="w-5 h-5 text-orange-400" />}
              loading={isProcessing}
              locked={!auditData.r1_bounce_rate}
            />
          </div>
        </div>
      </div>

      {/* Industry Trends Chart */}
      <IndustryTrendsChart loading={isProcessing} />
    </div>
  );
};

export default AuditDashboard;
