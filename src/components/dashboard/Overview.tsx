import React from 'react';
import { BarChart3, TrendingUp, AlertCircle, Clock, Bot, Zap, Shield, Target, DollarSign, Calendar, Video, Plus } from 'lucide-react';
import ChatBot from './ChatBot';
import { format, addDays } from 'date-fns';

export default function Overview() {
  const metrics = [
    { 
      label: 'Account Health Score', 
      value: '85/100', 
      trend: '+5',
      icon: BarChart3,
      description: 'Based on 15 key performance indicators'
    },
    { 
      label: 'Active Campaigns', 
      value: '12', 
      trend: '0',
      icon: TrendingUp,
      description: '8 search, 4 display campaigns'
    },
    { 
      label: 'Critical Issues', 
      value: '3', 
      trend: '-2',
      icon: AlertCircle,
      description: 'Down from 5 last week'
    },
    { 
      label: 'Days Until Review', 
      value: '5', 
      trend: null,
      icon: Clock,
      description: 'Next review scheduled for Friday'
    },
  ];

  const upcomingMeetings = [
    {
      type: 'Kickoff Meeting',
      date: addDays(new Date(), 2),
      duration: '60 min',
      status: 'upcoming'
    },
    {
      type: 'Results Presentation',
      date: addDays(new Date(), 9),
      duration: '90 min',
      status: 'upcoming'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Account Overview</h1>
        <span className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</span>
      </div>

      {/* Audit Progress */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-blue-600" />
            <h2 className="font-semibold">Audit Progress</h2>
          </div>
          <span className="text-sm font-medium text-blue-600">23% Complete</span>
        </div>
        <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="absolute left-0 top-0 bottom-0 bg-blue-600 rounded-full transition-all duration-1000"
            style={{ width: '23%' }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 animate-pulse"></div>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-4 gap-4">
          {['Data Collection', 'AI Analysis', 'Expert Review', 'Final Report'].map((step, index) => (
            <div key={step} className={`text-center ${index === 0 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-4 h-4 rounded-full mx-auto mb-2 ${index === 0 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
              <span className="text-xs font-medium">{step}</span>
            </div>
          ))}
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:border-blue-200 transition transform hover:-translate-y-1 duration-200">
            <div className="flex items-center justify-between mb-3">
              <div className="p-1.5 bg-blue-50 rounded-lg">
                <metric.icon className="h-5 w-5 text-blue-600" />
              </div>
              {metric.trend && (
                <span className={`text-xs font-medium ${
                  Number(metric.trend) > 0 ? 'text-green-600' : 
                  Number(metric.trend) < 0 ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {metric.trend > 0 ? '+' : ''}{metric.trend}
                </span>
              )}
            </div>
            <h3 className="text-xs text-gray-500 mb-1">{metric.label}</h3>
            <p className="text-xl font-bold mb-1">{metric.value}</p>
            <p className="text-xs text-gray-600 line-clamp-2">{metric.description}</p>
          </div>
        ))}
      </div>

      {/* Upcoming Meetings Section */}
      <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            <h2 className="font-semibold">Upcoming Meetings</h2>
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            <Plus className="h-4 w-4" />
            <span>Schedule Meeting</span>
          </button>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {upcomingMeetings.map((meeting, index) => (
            <div key={index} className="bg-white rounded-lg p-4 border border-gray-200 hover:border-blue-300 transition">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{meeting.type}</h3>
                  <p className="text-gray-600 text-sm">{format(meeting.date, 'EEEE, MMMM d')}</p>
                  <p className="text-gray-600 text-sm">{format(meeting.date, 'h:mm a')} ({meeting.duration})</p>
                </div>
                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                  <Video className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Bot Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Bot className="h-5 w-5 text-blue-600" />
            <h2 className="font-semibold">AI Assistant</h2>
          </div>
          <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">Online</span>
        </div>
        <div className="p-4 md:p-6">
          <div className="max-w-4xl mx-auto">
            <ChatBot compact={true} />
          </div>
        </div>
      </div>
    </div>
  );
}