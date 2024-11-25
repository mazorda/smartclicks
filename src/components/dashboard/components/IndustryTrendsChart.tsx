import React, { useState } from 'react';
import { Bot, User, TrendingUp, DollarSign, Calendar, RefreshCw } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label } from 'recharts';

interface IndustryTrendsChartProps {
  loading?: boolean;
}

interface Annotation {
  date: string;
  metric: 'CTR' | 'avgCPC' | 'convRate';
  value: number;
  author: string;
  content: string;
  icon: React.ReactNode;
  tag: {
    text: string;
    color: string;
    icon: React.ReactNode;
  };
}

const industryTrendsData = [
  { date: 'Jan', avgCPC: 2.8, CTR: 3.2, convRate: 2.1 },
  { date: 'Feb', avgCPC: 2.9, CTR: 3.3, convRate: 2.2 },
  { date: 'Mar', avgCPC: 3.1, CTR: 3.4, convRate: 2.3 },
  { date: 'Apr', avgCPC: 3.2, CTR: 3.6, convRate: 2.4 },
  { date: 'May', avgCPC: 3.0, CTR: 3.5, convRate: 2.3 },
  { date: 'Jun', avgCPC: 2.9, CTR: 3.4, convRate: 2.2 },
  { date: 'Jul', avgCPC: 2.8, CTR: 3.3, convRate: 2.1 },
  { date: 'Aug', avgCPC: 2.7, CTR: 3.2, convRate: 2.0 },
  { date: 'Sep', avgCPC: 3.0, CTR: 3.5, convRate: 2.3 },
  { date: 'Oct', avgCPC: 3.5, CTR: 3.8, convRate: 2.7 },
  { date: 'Nov', avgCPC: 3.3, CTR: 3.6, convRate: 2.5 },
  { date: 'Dec', avgCPC: 2.6, CTR: 3.1, convRate: 1.9 },
];

const annotations: Annotation[] = [
  {
    date: 'Oct',
    metric: 'CTR',
    value: 3.8,
    author: 'MiaAI 🤖',
    content: 'Machine learning analysis shows 42% higher CTR than yearly average. Historical data suggests allocating 30% more budget to capitalize on this trend. Recommended bid adjustments: +25% for converting keywords, -15% for awareness campaigns.',
    icon: <Bot className="w-4 h-4" />,
    tag: {
      text: 'Data Analysis',
      color: '#3B82F6',
      icon: <TrendingUp className="w-3 h-3" />
    }
  },
  {
    date: 'Dec',
    metric: 'convRate',
    value: 1.9,
    author: 'Harris 👨‍💼',
    content: 'Strategic opportunity: While competitors reduce spend, maintain presence with brand-focused campaigns. This approach has historically led to 15% lower CPAs in Q1. Consider reallocating budget to thought leadership content.',
    icon: <User className="w-4 h-4" />,
    tag: {
      text: 'Strategy',
      color: '#8B5CF6',
      icon: <DollarSign className="w-3 h-3" />
    }
  },
  {
    date: 'Jul',
    metric: 'avgCPC',
    value: 2.8,
    author: 'MiaAI 🤖',
    content: 'Anomaly detection identified 23% CPC reduction opportunity. Analysis of 1.2M summer campaign data points suggests optimal bidding window between 2-5pm EST. Implement automated bid adjustments for 18% projected ROI improvement.',
    icon: <Bot className="w-4 h-4" />,
    tag: {
      text: 'Optimization',
      color: '#10B981',
      icon: <Calendar className="w-3 h-3" />
    }
  }
];

const renderAnnotationContent = (annotation: Annotation) => (
  <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 shadow-lg min-w-[350px]">
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-2">
        {annotation.icon}
        <span className="font-semibold text-sm text-gray-300">{annotation.author}</span>
      </div>
      <div className={`flex items-center gap-1 px-2 py-1 rounded-full bg-opacity-20`} style={{ backgroundColor: `${annotation.tag.color}33` }}>
        {annotation.tag.icon}
        <span className="text-xs text-gray-300">{annotation.tag.text}</span>
      </div>
    </div>
    <p className="text-sm text-gray-400 leading-tight">{annotation.content}</p>
  </div>
);

const IndustryTrendsChart: React.FC<IndustryTrendsChartProps> = ({ loading }) => {
  const [hoveredAnnotation, setHoveredAnnotation] = useState<string | null>(null);

  // Add CSS keyframes for pulse animation
  const pulseAnimation = `
    @keyframes pulse {
      0% {
        transform: scale(1);
        opacity: 0.8;
      }
      50% {
        transform: scale(1.2);
        opacity: 1;
      }
      100% {
        transform: scale(1);
        opacity: 0.8;
      }
    }
  `;

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
      <style>{pulseAnimation}</style>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Google Ads Industry Trends - Software & Technology</h2>
        {loading && <RefreshCw className="w-5 h-5 text-purple-400 animate-spin" />}
      </div>
      <div className={`h-[500px] w-full transition-opacity duration-300 ${loading ? 'opacity-50' : 'opacity-100'}`}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={industryTrendsData} margin={{ top: 40, right: 30, left: 20, bottom: 20 }}>
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
            {['avgCPC', 'CTR', 'convRate'].map((metric) => (
              <Line
                key={metric}
                type="monotone"
                dataKey={metric}
                name={
                  metric === 'avgCPC' ? 'Avg. CPC ($)' :
                  metric === 'CTR' ? 'CTR (%)' :
                  'Conv. Rate (%)'
                }
                stroke={
                  metric === 'avgCPC' ? '#8B5CF6' :
                  metric === 'CTR' ? '#10B981' :
                  '#F59E0B'
                }
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 8 }}
              >
                {annotations.map((annotation, index) => (
                  annotation.metric === metric && (
                    <Label
                      key={index}
                      content={() => (
                        <g
                          onMouseEnter={() => setHoveredAnnotation(annotation.date)}
                          onMouseLeave={() => setHoveredAnnotation(null)}
                          style={{ cursor: 'pointer' }}
                        >
                          {/* Outer circle with pulse animation */}
                          <circle
                            cx={0}
                            cy={0}
                            r={12}
                            fill={`${annotation.tag.color}33`}
                            style={{
                              animation: 'pulse 2s infinite',
                            }}
                          />
                          {/* Inner circle */}
                          <circle
                            cx={0}
                            cy={0}
                            r={8}
                            fill={annotation.tag.color}
                            stroke="#fff"
                            strokeWidth={2}
                          />
                          {/* Icon */}
                          <svg x="-6" y="-6" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                            <path d={annotation.author.includes('AI') ? 
                              "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" :
                              "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"
                            } />
                          </svg>
                          {hoveredAnnotation === annotation.date && (
                            <foreignObject x="-175" y="-130" width="350" height="120">
                              {renderAnnotationContent(annotation)}
                            </foreignObject>
                          )}
                        </g>
                      )}
                      position="top"
                      offset={10}
                    />
                  )
                ))}
              </Line>
            ))}
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
  );
};

export default IndustryTrendsChart;
