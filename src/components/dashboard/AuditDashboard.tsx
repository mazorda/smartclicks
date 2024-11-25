import React from 'react';
import { Zap, Users, Globe2, Target, ChevronRight, Lock } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import CompanyProfile from './components/CompanyProfile';
import MetricCard from './components/MetricCard';
import IndustryTrendsChart from './components/IndustryTrendsChart';

const AuditDashboard: React.FC = () => {
  useTheme();

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Company Profile */}
      <CompanyProfile />

      {/* KPIs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Site Engagement Score"
          value="85"
          icon={<Zap className="w-5 h-5 text-green-400" />}
        />
        <MetricCard
          title="Monthly Visitors"
          value="250K"
          icon={<Users className="w-5 h-5 text-purple-400" />}
        />
        <MetricCard
          title="Traffic World Rank"
          value="15,432"
          icon={<Globe2 className="w-5 h-5 text-blue-400" />}
        />
        <MetricCard
          title="Google Ads Health Score"
          value="92"
          icon={<Target className="w-5 h-5 text-orange-400" />}
        />
      </div>

      {/* Landing Pages & Competitors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
          <h2 className="text-xl font-semibold mb-4">Top Performing Landing Pages</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
              <span className="text-gray-300">/enterprise-solutions</span>
              <span className="text-green-400 font-semibold">89% Score</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
              <span className="text-gray-300">/pricing</span>
              <span className="text-green-400 font-semibold">78% Score</span>
            </div>
            <div className="relative p-3 bg-gray-700/50 rounded-lg blur-[2px]">
              <div className="absolute inset-0 flex items-center justify-center">
                <Lock className="w-5 h-5 text-gray-400" />
              </div>
              <span className="text-gray-300">/products</span>
              <span className="text-green-400 font-semibold">92% Score</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
          <h2 className="text-xl font-semibold mb-4">Competitor Analysis - Google Ads Monthly Spent</h2>
          <div className="space-y-4">
            <div className="p-3 bg-gray-700/50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Peak.capital</span>
                <div className="flex items-center gap-2">
                  <span className="text-purple-400 font-semibold">$15,000/mo</span>
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                </div>
              </div>
            </div>
            {[
              { name: 'CompetitorB', budget: '$22,000/mo' },
              { name: 'CompetitorC', budget: '$18,000/mo' },
            ].map((competitor, i) => (
              <div key={i} className="relative p-3 bg-gray-700/50 rounded-lg blur-[2px]">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">{competitor.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-purple-400 font-semibold">{competitor.budget}</span>
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Site Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
          <h2 className="text-xl font-semibold mb-4">Site Engagement</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MetricCard
              title="Bounce Rate"
              value="32%"
              icon={<Target className="w-5 h-5 text-red-400" />}
            />
            <MetricCard
              title="Avg. Time on Site"
              value="4:32"
              icon={<Target className="w-5 h-5 text-green-400" />}
            />
            <MetricCard
              title="Conversion Rate"
              value="2.8%"
              icon={<Target className="w-5 h-5 text-blue-400" />}
              locked
            />
            <MetricCard
              title="Micro Conversions"
              value="5.2%"
              icon={<Target className="w-5 h-5 text-purple-400" />}
              locked
            />
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
          <h2 className="text-xl font-semibold mb-4">Traffic Sources</h2>
          <div className="grid grid-cols-2 gap-4">
            <MetricCard
              title="Total Visitors"
              value="250,000"
              icon={<Users className="w-5 h-5 text-blue-400" />}
            />
            <MetricCard
              title="Paid Visitors"
              value="85,000"
              icon={<Target className="w-5 h-5 text-purple-400" />}
              locked
            />
            <MetricCard
              title="Organic Visitors"
              value="120,000"
              icon={<Globe2 className="w-5 h-5 text-green-400" />}
              locked
            />
            <MetricCard
              title="Social Visitors"
              value="45,000"
              icon={<Users className="w-5 h-5 text-orange-400" />}
              locked
            />
          </div>
        </div>
      </div>

      {/* Industry Trends Chart */}
      <IndustryTrendsChart />
    </div>
  );
};

export default AuditDashboard;
