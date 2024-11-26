import React from 'react';
import { Key, Calendar, Clock, Presentation, CheckCircle, ArrowRight } from 'lucide-react';

export default function Process() {
  const steps = [
    {
      icon: Key,
      title: "1. Grant Access",
      description: "Securely provide access to your Google Ads account"
    },
    {
      icon: Calendar,
      title: "2. Kickoff Meeting",
      description: "Schedule a 60-minute strategy session with our experts"
    },
    {
      icon: Clock,
      title: "3. Analysis Period",
      description: "We analyze your account using AI and human expertise"
    },
    {
      icon: Presentation,
      title: "4. Results Meeting",
      description: "Receive your comprehensive audit and action plan"
    },
    {
      icon: CheckCircle,
      title: "5. Implementation",
      description: "Get support implementing the recommended changes"
    }
  ];

  return (
    <section id="process" className="py-8 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 inline-block">
              The Journey to Better Performance
            </h2>
            <div className="mt-2 w-20 h-1 bg-blue-600 mx-auto rounded-full"></div>
          </div>
          
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-blue-100 dark:bg-blue-900 transform -translate-x-1/2" />
            
            <div className="space-y-12">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={`flex items-center ${
                    index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                  } relative`}
                >
                  {/* Content */}
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-12 text-right' : 'pl-12'}`}>
                    <div className={`bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-700 transition transform hover:-translate-y-1 ${
                      index % 2 === 0 ? 'ml-auto' : 'mr-auto'
                    }`}>
                      <h3 className="font-semibold mb-2 dark:text-white">{step.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300">{step.description}</p>
                    </div>
                  </div>

                  {/* Icon */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 z-10">
                    <div className="bg-white dark:bg-gray-800 w-12 h-12 rounded-full border-4 border-blue-100 dark:border-blue-900 flex items-center justify-center">
                      <step.icon className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>

                  {/* Empty space for the other side */}
                  <div className="w-1/2" />
                </div>
              ))}
            </div>
          </div>

          {/* Final CTA */}
          <div className="mt-12 text-center">
            <a 
              href="https://meet.mazorda.com/30-mins" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition group"
            >
              <span>Book a 30-min call to discuss your needs</span>
              <ArrowRight className="h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
