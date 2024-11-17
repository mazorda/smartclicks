import { DollarSign, TrendingUp, Target, Award } from 'lucide-react';

export const performanceData = [
  { month: 'Jan', spend: 12450, conversions: 245, cpa: 50.8, revenue: 35000 },
  { month: 'Feb', spend: 13200, conversions: 278, cpa: 47.5, revenue: 42000 },
  { month: 'Mar', spend: 15800, conversions: 312, cpa: 50.6, revenue: 51000 },
  { month: 'Apr', spend: 14500, conversions: 298, cpa: 48.7, revenue: 48000 },
  { month: 'May', spend: 16200, conversions: 345, cpa: 47.0, revenue: 55000 },
  { month: 'Jun', spend: 15400, conversions: 334, cpa: 46.1, revenue: 53000 },
];

export const metrics = [
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

export const recommendations = [
  {
    title: 'Optimize Bidding Strategy',
    description: 'Switch to target ROAS bidding for high-performing campaigns',
    impact: 'High',
    status: 'Ready to Deploy',
    type: 'AI-Powered',
    saving: '$2,450/month',
    icon: TrendingUp
  },
  {
    title: 'Negative Keywords Audit',
    description: 'Add 45 new negative keywords to reduce wasted spend',
    impact: 'Medium',
    status: 'Needs Review',
    type: 'Human Review',
    saving: '$1,850/month',
    icon: Target
  },
  {
    title: 'Ad Copy Enhancement',
    description: 'Update ad copy based on performance analysis',
    impact: 'Medium',
    status: 'In Progress',
    type: 'AI-Powered',
    saving: '$1,200/month',
    icon: Award
  }
];