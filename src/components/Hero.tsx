import React from 'react';
import { ArrowRight, Bot, Users, Shield, Cpu, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

type Props = {
  onGetStarted: () => void;
};

export default function Hero({ onGetStarted }: Props) {
  return (
    <div className="relative pt-24 pb-16 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white" />
        <div className="absolute inset-0 opacity-[0.15] bg-[radial-gradient(circle_at_1px_1px,#3b82f6_1px,transparent_0)]" style={{ backgroundSize: '24px 24px' }} />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="inline-flex items-center bg-blue-50 rounded-full px-4 py-2 mb-6">
            <Cpu className="h-5 w-5 text-blue-600 mr-2" />
            <span className="text-blue-800 font-medium">AI-Powered Google Ads Intelligence</span>
          </div>

          <h1 className="text-5xl font-bold mb-8 leading-tight">
            Are You Confident Your Google Ads Budget{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              Isn't Being Wasted?
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Gain the clarity you need with a comprehensive, AI-powered audit that reveals hidden inefficiencies 
            and missed opportunities—all validated by experts and delivered within just 7 days.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
            <button 
              onClick={onGetStarted}
              className="w-full sm:w-auto bg-blue-600 text-white px-12 py-4 rounded-lg hover:bg-blue-700 transition flex items-center justify-center group text-lg font-medium relative overflow-hidden"
            >
              <span className="relative z-10">Start Your Audit</span>
              <ArrowRight className="ml-2 h-5 w-5 relative z-10 transform group-hover:translate-x-1 transition" />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 transform group-hover:scale-110 transition-transform duration-200" />
            </button>
            <a 
              href="https://meet.mazorda.com/30-mins"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto group px-8 py-4 rounded-lg transition flex items-center justify-center border border-gray-200 hover:border-blue-200 bg-white hover:bg-blue-50 text-gray-600 hover:text-blue-600"
            >
              <Calendar className="h-5 w-5 mr-2" />
              Schedule a Free Consultation
              <ArrowRight className="ml-2 h-5 w-5 opacity-50 transform group-hover:translate-x-1 transition" />
            </a>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-gray-100 hover:border-blue-200 transition transform hover:-translate-y-1">
              <Bot className="h-8 w-8 text-blue-600 mb-4" />
              <h3 className="font-semibold mb-2">AI-Powered Analysis</h3>
              <p className="text-gray-600">60% faster analysis with advanced machine learning technology</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-gray-100 hover:border-blue-200 transition transform hover:-translate-y-1">
              <Users className="h-8 w-8 text-blue-600 mb-4" />
              <h3 className="font-semibold mb-2">Expert Validation</h3>
              <p className="text-gray-600">15+ years of expertise validating every insight</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-gray-100 hover:border-blue-200 transition transform hover:-translate-y-1">
              <Shield className="h-8 w-8 text-blue-600 mb-4" />
              <h3 className="font-semibold mb-2">Risk-Free</h3>
              <p className="text-gray-600">30-day money-back guarantee if you're not satisfied</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}