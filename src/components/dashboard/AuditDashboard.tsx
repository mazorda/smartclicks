import React from 'react';
import { Building2, Users, Globe2, Target, Zap, ArrowUpRight, Lock } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  locked?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, locked }) => (
  <div className="relative bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300">
    <div className="flex items-start justify-between">
      <div className="flex flex-col">
        <span className="text-gray-400 text-sm">{title}</span>
        <span className="text-2xl font-bold text-white mt-1">
          {locked ? '••••' : value}
        </span>
      </div>
      <div className="p-2 bg-gray-700/50 rounded-lg">
        {icon}
      </div>
    </div>
    {locked && (
      <div className="absolute inset-0 bg-gray-800/80 backdrop-blur-[2px] rounded-xl flex items-center justify-center">
        <Lock className="w-5 h-5 text-gray-400" />
      </div>
    )}
  </div>
);

// Sample data for the Google Ads Industry Trends (Software & Technology)
const industryTrendsData = [
  { date: 'Jan 1', avgCPC: 2.8, CTR: 3.2, convRate: 2.1 },
  { date: 'Jan 8', avgCPC: 2.9, CTR: 3.4, convRate: 2.3 },
  { date: 'Jan 15', avgCPC: 3.1, CTR: 3.5, convRate: 2.4 },
  { date: 'Jan 22', avgCPC: 2.7, CTR: 3.3, convRate: 2.2 },
  { date: 'Jan 29', avgCPC: 3.0, CTR: 3.6, convRate: 2.5 },
  { date: 'Feb 5', avgCPC: 3.2, CTR: 3.7, convRate: 2.6 },
  { date: 'Feb 12', avgCPC: 3.3, CTR: 3.8, convRate: 2.7 },
];

export default function AuditDashboard() {
  useTheme();

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Company Profile */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 mb-8 border border-gray-700/50">
        <div className="flex items-start gap-6">
          <img 
            src="https://logo.clearbit.com/example.com" 
            alt="Company Logo"
            className="w-16 h-16 rounded-lg bg-white p-2"
          />
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-2">TechCorp Solutions</h1>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
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
            <p className="text-gray-400">Leading provider of enterprise software solutions</p>
          </div>
        </div>
      </div>

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
          <h2 className="text-xl font-semibold mb-4">Competitor Analysis</h2>
          <div className="space-y-4">
            <div className="p-3 bg-gray-700/50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">CompetitorA</span>
                <span className="text-purple-400 font-semibold">$15,000/mo</span>
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
                  <span className="text-purple-400 font-semibold">{competitor.budget}</span>
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
              icon={<ArrowUpRight className="w-5 h-5 text-red-400" />}
            />
            <MetricCard
              title="Avg. Time on Site"
              value="4:32"
              icon={<ArrowUpRight className="w-5 h-5 text-green-400" />}
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

      {/* Google Ads Industry Trends Chart */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
        <h2 className="text-xl font-semibold mb-6">Google Ads Industry Trends - Software & Technology</h2>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={industryTrendsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="date" 
                stroke="#9CA3AF"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#9CA3AF"
                style={{ fontSize: '12px' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '0.5rem',
                }}
                labelStyle={{ color: '#9CA3AF' }}
                itemStyle={{ color: '#E5E7EB' }}
              />
              <Line
                type="monotone"
                dataKey="avgCPC"
                name="Avg. CPC ($)"
                stroke="#8B5CF6"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 8 }}
              />
              <Line
                type="monotone"
                dataKey="CTR"
                name="CTR (%)"
                stroke="#10B981"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 8 }}
              />
              <Line
                type="monotone"
                dataKey="convRate"
                name="Conv. Rate (%)"
                stroke="#F59E0B"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
            <span className="text-sm text-gray-400">Avg. CPC ($)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-sm text-gray-400">CTR (%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <span className="text-sm text-gray-400">Conv. Rate (%)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
