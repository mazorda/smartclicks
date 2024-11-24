import React, { useState } from 'react';
import { Bot, Users, Shield, Cpu, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { domainAuditServices } from '../services/database';

type Props = {
  onGetStarted: () => void;
};

export default function Hero({ onGetStarted }: Props) {
  const [domain, setDomain] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const validateDomain = (domain: string): boolean => {
    const domainRegex = /^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
    return domainRegex.test(domain);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    console.log('Starting domain submission...');

    // Basic validation
    if (!domain.trim()) {
      setError('Please enter a domain');
      return;
    }

    // Remove any protocol and www. from the domain
    const cleanDomain = domain.trim()
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '');

    if (!validateDomain(cleanDomain)) {
      setError('Please enter a valid domain');
      return;
    }

    setIsLoading(true);
    try {
      console.log('Submitting domain:', cleanDomain);
      const result = await domainAuditServices.createDomainAudit(cleanDomain);
      console.log('Submission successful:', result);
      setShowSuccess(true);
      setDomain('');
    } catch (err) {
      console.error('Submission error:', err);
      
      // Handle specific error types
      if (err instanceof Error) {
        const errorMessage = err.message;
        console.error('Error details:', {
          message: errorMessage,
          stack: err.stack
        });

        if (errorMessage.includes('permission')) {
          setError('Database permission error. Please contact support.');
        } else if (errorMessage.includes('network')) {
          setError('Network error. Please check your connection.');
        } else if (errorMessage.includes('duplicate')) {
          setError('This domain has already been submitted.');
        } else {
          setError(`Error: ${errorMessage}`);
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-xl max-w-md w-full mx-4">
          <h2 className="text-2xl font-bold text-center mb-4">Starting domain analysis...</h2>
          <p className="text-gray-600 text-center mb-6">
            We're preparing your PPC audit report. This may take a few moments.
          </p>
          <button
            onClick={() => setShowSuccess(false)}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

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
            <span className="text-blue-800 font-medium">Google Ads Intelligence for CEOs & Marketers</span>
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
          
          <div className="max-w-3xl mx-auto mt-8 mb-16">
            <form onSubmit={handleSubmit} className="relative group">
              <div 
                className="absolute -inset-5 bg-gradient-to-r from-purple-600 via-blue-500 via-purple-500 to-blue-600 rounded-2xl blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500 animate-glow"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-500 via-purple-500 to-blue-600 animate-gradient rounded-2xl" />
              </div>
              <div className="relative flex items-center bg-white rounded-xl border border-gray-200/50 shadow-[0_0_30px_rgba(0,0,0,0.05)]">
                <div className="flex items-center pl-6">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="example.com"
                  value={domain}
                  onChange={(e) => {
                    setDomain(e.target.value);
                    setError('');
                  }}
                  disabled={isLoading}
                  className={`flex-1 px-4 py-5 text-lg text-gray-700 bg-transparent outline-none placeholder-gray-400 disabled:opacity-50 ${
                    error ? 'border-red-300' : ''
                  }`}
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`h-full px-10 py-5 bg-[#2563EB] text-white font-medium rounded-r-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    isLoading 
                      ? 'opacity-75 cursor-not-allowed'
                      : 'hover:bg-blue-700'
                  }`}
                >
                  {isLoading ? 'Processing...' : 'GO'}
                </button>
              </div>
              {error && (
                <div className="absolute -bottom-6 left-0 text-red-500 text-sm">
                  {error}
                </div>
              )}
            </form>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-gray-100 hover:border-blue-200 transition transform hover:-translate-y-1">
              <Bot className="h-8 w-8 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">AI-Powered Analysis</h3>
              <p className="text-gray-600">60% faster analysis with advanced machine learning technology</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-gray-100 hover:border-blue-200 transition transform hover:-translate-y-1">
              <Users className="h-8 w-8 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Expert Validation</h3>
              <p className="text-gray-600">15+ years of expertise validating every insight</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-gray-100 hover:border-blue-200 transition transform hover:-translate-y-1">
              <Shield className="h-8 w-8 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Risk-Free</h3>
              <p className="text-gray-600">30-day money-back guarantee if you're not satisfied</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
