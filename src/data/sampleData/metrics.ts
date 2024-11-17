import { DollarSign, TrendingUp, Target, Award } from 'lucide-react';
import type { Metric } from '../../components/common/metrics/MetricsGrid';

export const dashboardMetrics: Metric[] = [
  { 
    name: 'Total Spend', 
    value: '$15,400', 
    change: '+12.3%',
    trend: 'up',
    icon: DollarSign,
    color: 'blue'
  },
  { 
    name: 'ROAS', 
    value: '3.4x', 
    change: '+0.5x',
    trend: 'up',
    icon: TrendingUp,
    color: 'green'
  },
  { 
    name: 'CPA', 
    value: '$46.10', 
    change: '-8.5%',
    trend: 'down',
    icon: Target,
    color: 'purple'
  },
  { 
    name: 'Conversion Rate', 
    value: '4.8%', 
    change: '+1.2%',
    trend: 'up',
    icon: Award,
    color: 'orange'
  },
];