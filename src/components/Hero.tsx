import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, Users, Shield, Cpu, Search } from 'lucide-react';
import { toast } from 'sonner';
import { useDomainAudit } from '../hooks/useDomainAudit';

type Props = {
  onGetStarted: () => void;
};

export default function Hero({ onGetStarted }: Props) {
  const navigate = useNavigate();
  const [domain, setDomain] = useState('');
  const { submitDomain, isLoading } = useDomainAudit();

  const validateDomain = (domain: string): boolean => {
    const domainRegex = /^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
    return domainRegex.test(domain);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!domain.trim()) {
      toast.error('Please enter a domain');
      return;
    }

    // Remove any protocol and www. from the domain
    const cleanDomain = domain.trim()
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '');

    if (!validateDomain(cleanDomain)) {
      toast.error('Please enter a valid domain');
      return;
    }

    const toastId = toast.loading('Analyzing domain...');

    try {
      await submitDomain(cleanDomain);
      toast.dismiss(toastId);
      toast.success('Starting domain analysis...');
      navigate(`/dashboard?domain=${cleanDomain}`);
      setDomain('');
    } catch (err) {
      toast.dismiss(toastId);
      if (err instanceof Error) {
        if (err.message.includes('DUPLICATE_DOMAIN')) {
          toast.error('This domain has already been submitted');
        } else {
          toast.error(err.message);
        }
      } else {
        toast.error('An unexpected error occurred');
      }
    }
  };

  return (
    <div className="relative pt-24 pb-16 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white dark:from-dark-bg-primary dark:to-dark-bg-secondary" />
        <div 
          className="absolute inset-0 opacity-[0.15] dark:opacity-[0.07] animate-patternFloat" 
          style={{
            backgroundImage: `
              radial-gradient(circle at 1px 1px, #3b82f6 1px, transparent 0),
              radial-gradient(circle at 12px 12px, #6366f1 1px, transparent 0)
            `,
            backgroundSize: '24px 24px, 48px 48px'
          }}
        />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="inline-flex items-center bg-blue-50 dark:bg-dark-bg-secondary rounded-full px-4 py-2 mb-6">
            <Cpu className="h-5 w-5 text-blue-600 dark:text-dark-accent-light mr-2" />
            <span className="text-blue-800 dark:text-dark-text-primary font-medium">Google Ads Intelligence for CEOs & Marketers</span>
          </div>

          <h1 className="text-5xl font-bold mb-8 leading-tight dark:text-dark-text-primary">
            Are You Confident Your Google Ads Budget{' '}
            <span 
              className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 dark:from-dark-accent-light dark:via-dark-accent-base dark:to-dark-accent-light animate-textGradient"
              style={{
                backgroundSize: '200% auto'
              }}
            >
              Isn't Being Wasted?
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-dark-text-secondary mb-12 max-w-3xl mx-auto leading-relaxed">
            Gain the clarity you need with a comprehensive, AI-powered audit that reveals hidden inefficiencies 
            and missed opportunities—all validated by experts and delivered within just 7 days.
          </p>
          
          <div className="max-w-3xl mx-auto mt-8 mb-16">
            <form onSubmit={handleSubmit} className="relative group">
              <div 
                className="absolute -inset-3 bg-gradient-to-r from-purple-600 via-blue-500 via-purple-500 to-blue-600 dark:from-dark-accent-base dark:via-dark-accent-light dark:to-dark-accent-base rounded-2xl blur-xl opacity-30 group-hover:opacity-70 transition-opacity duration-500 animate-glow"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-500 via-purple-500 to-blue-600 dark:from-dark-accent-base dark:via-dark-accent-light dark:to-dark-accent-base animate-gradient rounded-2xl" />
              </div>
              <div className="relative flex items-center bg-white dark:bg-dark-bg-secondary rounded-xl border border-gray-200/50 dark:border-dark-bg-primary shadow-[0_0_30px_rgba(0,0,0,0.05)] group-hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center pl-4">
                  <Search className="h-5 w-5 text-gray-400 dark:text-dark-text-tertiary" />
                </div>
                <input
                  type="text"
                  placeholder="yourcompany.com"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  disabled={isLoading}
                  className="flex-1 px-3 py-4 text-lg text-gray-700 dark:text-dark-text-primary bg-transparent outline-none placeholder-gray-400 dark:placeholder-dark-text-tertiary disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`px-6 py-4 bg-[#2563EB] dark:bg-dark-accent-base text-white font-medium rounded-r-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-dark-accent-light focus:ring-offset-2 ${
                    isLoading 
                      ? 'opacity-75 cursor-not-allowed'
                      : 'hover:bg-blue-700 dark:hover:bg-dark-accent-dark'
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Processing</span>
                    </div>
                  ) : 'GO'}
                </button>
              </div>
              <p className="mt-4 text-sm text-gray-500 dark:text-dark-text-tertiary">
                Free analysis • No credit card required • Get insights within minutes
              </p>
            </form>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/80 dark:bg-dark-bg-secondary backdrop-blur-sm p-6 rounded-xl shadow-sm border border-gray-100 dark:border-dark-bg-primary hover:border-blue-200 dark:hover:border-dark-accent-light transition transform hover:-translate-y-1">
              <Bot className="h-8 w-8 text-blue-600 dark:text-dark-accent-light mx-auto mb-4" />
              <h3 className="font-semibold mb-2 dark:text-dark-text-primary">AI-Powered Analysis</h3>
              <p className="text-gray-600 dark:text-dark-text-secondary">60% faster analysis with advanced machine learning technology</p>
            </div>
            <div className="bg-white/80 dark:bg-dark-bg-secondary backdrop-blur-sm p-6 rounded-xl shadow-sm border border-gray-100 dark:border-dark-bg-primary hover:border-blue-200 dark:hover:border-dark-accent-light transition transform hover:-translate-y-1">
              <Users className="h-8 w-8 text-blue-600 dark:text-dark-accent-light mx-auto mb-4" />
              <h3 className="font-semibold mb-2 dark:text-dark-text-primary">Expert Validation</h3>
              <p className="text-gray-600 dark:text-dark-text-secondary">15+ years of expertise validating every insight</p>
            </div>
            <div className="bg-white/80 dark:bg-dark-bg-secondary backdrop-blur-sm p-6 rounded-xl shadow-sm border border-gray-100 dark:border-dark-bg-primary hover:border-blue-200 dark:hover:border-dark-accent-light transition transform hover:-translate-y-1">
              <Shield className="h-8 w-8 text-blue-600 dark:text-dark-accent-light mx-auto mb-4" />
              <h3 className="font-semibold mb-2 dark:text-dark-text-primary">Risk-Free</h3>
              <p className="text-gray-600 dark:text-dark-text-secondary">30-day money-back guarantee if you're not satisfied</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
