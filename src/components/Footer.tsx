import React from 'react';
import { Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEbookModal } from '../hooks/useEbookModal';

export default function Footer() {
  const { openModal } = useEbookModal();

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Cpu className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              <span className="text-xl font-bold dark:text-white">SmartClicks.AI</span>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              Transforming Google Ads performance through AI-powered intelligence and human expertise.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 dark:text-white">Service</h4>
            <ul className="space-y-2">
              <li><a href="#process" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">How It Works</a></li>
              <li><Link to="/dashboard" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Demo Dashboard</Link></li>
              <li><a href="#pricing" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Pricing</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 dark:text-white">Resources</h4>
            <ul className="space-y-2">
              <li><Link to="/dashboard" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Demo Dashboard</Link></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Case Studies</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">FAQs</a></li>
              <li>
                <button 
                  onClick={openModal}
                  className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 text-left"
                >
                  Free eBook: Lost Clicks
                </button>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 dark:text-white">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy-policy" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-of-service" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-800 mt-12 pt-8 text-center text-gray-600 dark:text-gray-300">
          <p>
            Made with ❤️ by <a href="https://mazorda.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">Mazorda</a>
          </p>
          <p className="mt-2">&copy; {new Date().getFullYear()} SmartClicks.AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
