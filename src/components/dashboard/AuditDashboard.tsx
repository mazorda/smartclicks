import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { BarChart3, Users, Globe2, Target, Lock, RefreshCw, ArrowRight, AlertTriangle, Clock, MousePointer, Smartphone, Search, Activity, Gauge } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../hooks/useSupabase';
import CompanyProfile from './components/CompanyProfile';
import MetricCard from './components/MetricCard';
import IndustryTrendsChart from './components/IndustryTrendsChart';
import CompetitorTable from './components/CompetitorTable';
import { useDomainAudit } from '../../hooks/useDomainAudit';
import LoadingAnimation from './components/LoadingAnimation';
import AnalysisProgress from '../onboarding/steps/AnalysisProgress';
import { logger } from '../../services/logger';

const AuditDashboard: React.FC = () => {
  useTheme();
  const location = useLocation();
  const { user } = useAuth();
  const searchParams = new URLSearchParams(location.search);
  const domainParam = searchParams.get('domain');

  const { 
    data: auditData, 
    isLoading,
    isProcessing,
    isError, 
    error,
    retry,
    progress,
    isDemoMode,
    isNewCompany,
    isExistingCompany,
    refresh
  } = useDomainAudit(domainParam || undefined);

  // Log any errors that occur
  React.useEffect(() => {
    if (isError && error) {
      logger.error('Error in AuditDashboard:', { error, domain: domainParam });
    }
  }, [isError, error, domainParam]);

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
            <AlertTriangle className="w-12 h-12 mx-auto mb-4" />
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
            {domainParam 
              ? `No audit data found for ${domainParam}`
              : 'Please submit a domain to analyze'}
          </p>
        </div>
      </div>
    );
  }

  // Show analysis progress for new companies
  if (isNewCompany && domainParam) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <AnalysisProgress 
          domain={domainParam}
          onComplete={refresh}
        />
      </div>
    );
  }

  // Show upgrade prompt for anonymous users
  const UpgradePrompt = () => !user && !isDemoMode && !auditData.semrush_total_visits && (
    <div className="mb-8 bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-xl p-6 border border-purple-500/20">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-white mb-2">
            Unlock Full Analysis
          </h3>
          <p className="text-gray-300">
            Sign up to access detailed metrics, competitor analysis, and actionable recommendations.
          </p>
        </div>
        <Link
          to="/login"
          className="flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium transition-all duration-300"
        >
          <span>Upgrade Now</span>
          <ArrowRight className="ml-2 w-5 h-5" />
        </Link>
      </div>
    </div>
  );

  // Show demo mode banner
  const DemoBanner = () => isDemoMode && (
    <div className="mb-8 bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-xl p-6 border border-blue-500/20">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-white mb-2">
            Demo Dashboard
          </h3>
          <p className="text-gray-300">
            This is a demo view showing sample data. Submit your domain for a real analysis.
          </p>
        </div>
      </div>
    </div>
  );

  // Determine if metrics should be locked
  const shouldLockMetrics = !user && !isDemoMode && !auditData.semrush_total_visits;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Progress Indicator */}
      {isProcessing && !isDemoMode && (
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

      {/* Demo Banner */}
      <DemoBanner />

      {/* Company Profile */}
      <CompanyProfile 
        domain={auditData.domain}
        loading={isProcessing}
        auditData={auditData}
      />

      {/* Upgrade Prompt */}
      <UpgradePrompt />

      {/* Key Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Site Engagement Score"
          value={auditData.semrush_time_on_site ? `${Math.round(auditData.semrush_time_on_site)}s` : '••••'}
          icon={<Activity className="w-5 h-5 text-blue-400" />}
          loading={isProcessing}
          locked={shouldLockMetrics}
        />
        <MetricCard
          title="Monthly Visitors"
          value={auditData.semrush_total_visits ? Math.round(auditData.semrush_total_visits).toLocaleString() : '••••'}
          icon={<Users className="w-5 h-5 text-purple-400" />}
          loading={isProcessing}
          locked={shouldLockMetrics}
        />
        <MetricCard
          title="Traffic World Rank"
          value={auditData.semrush_traffic_rank ? auditData.semrush_traffic_rank.toLocaleString() : '••••'}
          icon={<BarChart3 className="w-5 h-5 text-blue-400" />}
          loading={isProcessing}
          locked={shouldLockMetrics}
        />
        <MetricCard
          title="Pages per Visit"
          value={auditData.semrush_pages_per_visit ? auditData.semrush_pages_per_visit.toFixed(1) : '••••'}
          icon={<MousePointer className="w-5 h-5 text-green-400" />}
          loading={isProcessing}
          locked={shouldLockMetrics}
        />
      </div>

      {/* Traffic Sources & Mobile Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Traffic Sources */}
        <div className="relative bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Traffic Channels - Monthly Average</h2>
            {isProcessing && <RefreshCw className="w-5 h-5 text-purple-400 animate-spin" />}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <MetricCard
              title="Organic Traffic"
              value={auditData.semrush_organic_visits ? auditData.semrush_organic_visits.toLocaleString() : '••••'}
              icon={<Search className="w-5 h-5 text-green-400" />}
              loading={isProcessing}
              locked={shouldLockMetrics}
            />
            <MetricCard
              title="Paid Traffic"
              value={auditData.semrush_paid_visits ? auditData.semrush_paid_visits.toLocaleString() : '••••'}
              icon={<Target className="w-5 h-5 text-blue-400" />}
              loading={isProcessing}
              locked={shouldLockMetrics}
            />
            <MetricCard
              title="Direct Traffic"
              value={auditData.semrush_direct_visits ? auditData.semrush_direct_visits.toLocaleString() : '••••'}
              icon={<Globe2 className="w-5 h-5 text-green-400" />}
              loading={isProcessing}
              locked={shouldLockMetrics}
            />
            <MetricCard
              title="Social Traffic"
              value={auditData.semrush_social_visits ? auditData.semrush_social_visits.toLocaleString() : '••••'}
              icon={<Users className="w-5 h-5 text-purple-400" />}
              loading={isProcessing}
              locked={shouldLockMetrics}
            />
          </div>
        </div>

        {/* Mobile Performance */}
        <div className="relative bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Mobile Performance</h2>
            {isProcessing && <RefreshCw className="w-5 h-5 text-purple-400 animate-spin" />}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <MetricCard
              title="Mobile Traffic Share"
              value={auditData.semrush_mobile_traffic_share ? `${Math.round(auditData.semrush_mobile_traffic_share * 100)}%` : '••••'}
              icon={<Smartphone className="w-5 h-5 text-blue-400" />}
              loading={isProcessing}
              locked={shouldLockMetrics}
            />
            <MetricCard
              title="Overall Bounce Rate"
              value={auditData.semrush_bounce_rate ? `${Math.ceil(auditData.semrush_bounce_rate * 100)}%` : '••••'}
              icon={<Gauge className="w-5 h-5 text-green-400" />}
              loading={isProcessing}
              locked={shouldLockMetrics}
            />
          </div>
        </div>
      </div>

      {/* Competitors Table */}
      <div className="mb-8">
        <CompetitorTable
          auditData={auditData}
          loading={isProcessing}
          isAuthenticated={!!user}
          isDemoMode={isDemoMode}
        />
      </div>

      {/* Industry Trends Chart */}
      <div className="relative bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
        {shouldLockMetrics && (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-gray-900/70 rounded-lg backdrop-blur-[1px]">
            <div className="text-center">
              <Lock className="w-12 h-12 text-purple-400 mx-auto mb-3" />
              <p className="text-gray-300 font-medium">Sign up to view industry trends</p>
            </div>
          </div>
        )}
        <div className={!shouldLockMetrics ? '' : 'blur-[1px]'}>
          <IndustryTrendsChart loading={isProcessing} />
        </div>
      </div>
    </div>
  );
};

export default AuditDashboard;
