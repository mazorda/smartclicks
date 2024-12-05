import React from 'react';
import { Lock, TrendingUp, DollarSign } from 'lucide-react';
import type { DomainAudit } from '../../../types/database';

interface CompetitorTableProps {
  auditData: DomainAudit;
  loading: boolean;
  isAuthenticated: boolean;
  isDemoMode: boolean;
}

interface CompetitorData {
  domain: string;
  traffic: number;
  cost: number;
}

const CompetitorTable: React.FC<CompetitorTableProps> = ({
  auditData,
  loading,
  isAuthenticated,
  isDemoMode
}) => {
  // Get competitor data
  const competitors: CompetitorData[] = [];

  // Add first competitor if available
  if (auditData.competitor_1_domain) {
    competitors.push({
      domain: auditData.competitor_1_domain,
      traffic: auditData.competitor_1_monthly_gads_traffic || 0,
      cost: Number(auditData.competitor_1_monthly_adwords_cost) || 0
    });
  }

  // Add second competitor if available
  if (auditData.competitor_2_domain) {
    competitors.push({
      domain: auditData.competitor_2_domain,
      traffic: auditData.competitor_2_monthly_gads_traffic || 0,
      cost: Number(auditData.competitor_2_monthly_adwords_cost) || 0
    });
  }

  // More realistic dummy data for locked competitors
  const dummyCompetitors: CompetitorData[] = [
    { domain: 'marketingpro.io', traffic: 32750, cost: 18500 },
    { domain: 'growthmetrics.com', traffic: 28900, cost: 15750 },
    { domain: 'adstrategy.net', traffic: 21500, cost: 12800 }
  ];

  const formatCost = (cost: number): string => {
    if (cost >= 1000) {
      return `$${(cost / 1000).toFixed(1)}K`;
    }
    return `$${cost}`;
  };

  const formatTraffic = (traffic: number): string => {
    if (traffic >= 1000) {
      return `${(traffic / 1000).toFixed(1)}K`;
    }
    return traffic.toString();
  };

  // Determine if we should show real data
  const shouldShowRealData = isAuthenticated || isDemoMode;

  return (
    <div className="relative bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Top Competitors</h2>
        {loading && (
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-500" />
        )}
      </div>
      <div className="space-y-4">
        {/* Header */}
        <div className="grid grid-cols-3 gap-4 px-3 py-2 text-sm text-gray-400">
          <div>Domain</div>
          <div className="flex items-center">
            <TrendingUp className="w-4 h-4 mr-2" />
            Monthly Traffic
          </div>
          <div className="flex items-center">
            <DollarSign className="w-4 h-4 mr-2" />
            Monthly Ad Spend
          </div>
        </div>

        {/* Real competitor data */}
        {competitors.map((competitor, index) => (
          <div 
            key={index}
            className="grid grid-cols-3 gap-4 p-3 bg-gray-700/50 rounded-lg"
          >
            <div className="text-gray-300">{competitor.domain}</div>
            <div className="text-blue-400">{formatTraffic(competitor.traffic)}</div>
            <div className="text-green-400">{formatCost(competitor.cost)}</div>
          </div>
        ))}

        {/* Dummy competitors section with single lock */}
        <div className="relative">
          {!shouldShowRealData && (
            <div className="absolute inset-0 flex items-center justify-center z-10 bg-gray-900/70 rounded-lg backdrop-blur-[1px]">
              <div className="text-center">
                <Lock className="w-12 h-12 text-purple-400 mx-auto mb-3" />
                <p className="text-gray-300 font-medium">Sign up to view competitors</p>
              </div>
            </div>
          )}
          <div className={!shouldShowRealData ? 'blur-[1px]' : ''}>
            {dummyCompetitors.map((competitor, index) => (
              <div
                key={index}
                className="grid grid-cols-3 gap-4 p-3 bg-gray-700/50 rounded-lg mb-4 last:mb-0"
              >
                <div className="text-gray-300">{competitor.domain}</div>
                <div className="text-blue-400">{formatTraffic(competitor.traffic)}</div>
                <div className="text-green-400">{formatCost(competitor.cost)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompetitorTable;
