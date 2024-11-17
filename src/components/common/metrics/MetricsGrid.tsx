import React from 'react';
import { DollarSign, TrendingUp, Target, Award } from 'lucide-react';

export type Metric = {
  name: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: any;
  color: string;
};

type Props = {
  metrics: Metric[];
};

export default function MetricsGrid({ metrics }: Props) {
  return (
    <div className="grid md:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <div key={index} className="space-y-2">
          <div className="flex items-center justify-between">
            <div className={`p-2 rounded-lg bg-${metric.color}-50`}>
              <metric.icon className={`h-5 w-5 text-${metric.color}-600`} />
            </div>
            <span className={`text-sm font-medium ${
              metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              {metric.change}
            </span>
          </div>
          <div className="text-center">
            <h3 className="text-sm text-gray-600">{metric.name}</h3>
            <p className="text-2xl font-bold mt-1">{metric.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}