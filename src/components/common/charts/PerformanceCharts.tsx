import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

type Props = {
  data: any[];
};

export default function PerformanceCharts({ data }: Props) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">Revenue vs. Spend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fill="#93c5fd" name="Revenue" />
            <Area type="monotone" dataKey="spend" stroke="#6366f1" fill="#a5b4fc" name="Spend" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">Conversions & CPA Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Line yAxisId="left" type="monotone" dataKey="conversions" stroke="#3b82f6" name="Conversions" />
            <Line yAxisId="right" type="monotone" dataKey="cpa" stroke="#6366f1" name="CPA" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}