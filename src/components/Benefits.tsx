import React from 'react';
import { TrendingUp, Zap, Target, DollarSign, BarChart, Shield } from 'lucide-react';

export default function Benefits() {
  const benefits = [
    {
      icon: TrendingUp,
      title: "Performance Optimization",
      description: "Identify opportunities to improve ROAS and reduce wasted spend"
    },
    {
      icon: Zap,
      title: "Quick Implementation",
      description: "Get actionable insights and start improving in just 7 days"
    },
    {
      icon: Target,
      title: "Targeting Refinement",
      description: "Optimize audience targeting and keyword strategies"
    },
    {
      icon: DollarSign,
      title: "Budget Efficiency",
      description: "Maximize your ad spend and reduce cost per conversion"
    },
    {
      icon: BarChart,
      title: "Data-Driven Insights",
      description: "Combine AI analysis with expert human interpretation"
    },
    {
      icon: Shield,
      title: "Account Security",
      description: "Secure access management and data protection"
    }
  ];

  return (
    <section id="benefits" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">Why Choose Our Audit Service</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition dark:shadow-gray-800">
                <benefit.icon className="h-8 w-8 text-blue-600 dark:text-blue-400 mb-4" />
                <h3 className="font-semibold mb-2 dark:text-white">{benefit.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
