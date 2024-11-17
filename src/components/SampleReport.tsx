import React, { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDownRight, Plus, BarChart2, TrendingUp, DollarSign, Target, AlertCircle, ArrowLeft, MessageSquare, X, Zap, Award, TrendingDown, Bot, Sparkles, PieChart, Activity, Users } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ChatBot from './dashboard/ChatBot';
import { performanceData, metrics, recommendations } from '../data/sampleData/dashboardData';

export default function SampleReport() {
  const [showChat, setShowChat] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const [animatedMetrics, setAnimatedMetrics] = useState<{ [key: string]: boolean }>({});

  // Ensure page starts at top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    // Animate metrics one by one
    metrics.forEach((metric, index) => {
      setTimeout(() => {
        setAnimatedMetrics(prev => ({ ...prev, [metric.name]: true }));
      }, index * 200);
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 fixed w-full z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Homepage
            </Link>
            <div className="flex items-center space-x-2">
              <Sparkles className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold">AdAudit Pro</span>
            </div>
          </div>
          <button
            onClick={() => setShowChat(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <MessageSquare className="h-4 w-4" />
            <span>Ask AI Assistant</span>
          </button>
        </div>
      </nav>

      <div className="pt-20 pb-8 px-4">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Metrics Grid */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="grid md:grid-cols-4 gap-6">
              {metrics.map((metric, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={animatedMetrics[metric.name] ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.3 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className={`p-2 rounded-lg bg-${metric.color}-50`}>
                      <metric.icon className={`h-5 w-5 text-${metric.color}-600`} />
                    </div>
                    <span className={`text-sm font-medium ${
                      Number(metric.change) > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {metric.change}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-sm text-gray-600">{metric.name}</h3>
                    <p className="text-2xl font-bold">{metric.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Charts */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Revenue vs. Spend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={performanceData}>
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
                <LineChart data={performanceData}>
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

          {/* Recommendations */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4">Recommended Actions</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {recommendations.map((rec, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-blue-200 transition">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <rec.icon className="h-5 w-5 text-blue-600" />
                    </div>
                    <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                      rec.impact === 'High' 
                        ? 'bg-green-100 text-green-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {rec.impact} Impact
                    </span>
                  </div>
                  <h4 className="font-medium mb-2">{rec.title}</h4>
                  <p className="text-sm text-gray-600 mb-4">{rec.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-green-600 font-medium">Save {rec.saving}</span>
                    <span className={`px-2 py-1 rounded-full ${
                      rec.status === 'Ready to Deploy'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {rec.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Bot */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Bot className="h-6 w-6 text-blue-600" />
              <h3 className="text-lg font-semibold">AI Assistant</h3>
            </div>
            <ChatBot compact={true} />
          </div>
        </div>
      </div>

      {/* Chat Overlay */}
      <AnimatePresence>
        {showChat && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end"
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween' }}
              className="w-full max-w-md bg-white h-full flex flex-col"
            >
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Bot className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold">AI Assistant</h3>
                </div>
                <button onClick={() => setShowChat(false)} className="text-gray-500 hover:text-gray-700">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex-1 overflow-hidden">
                <ChatBot />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}