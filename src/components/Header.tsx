import React, { useState } from 'react';
import { Menu, X, Cpu, ArrowRight, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import ThemeToggle from './common/ThemeToggle';
import { useTheme } from '../context/ThemeContext';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isDarkMode } = useTheme();

  const handleGetStarted = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className={`fixed w-full backdrop-blur-md z-50 border-b ${
      isDarkMode 
        ? 'bg-gray-900/80 border-gray-700' 
        : 'bg-white/80 border-gray-100'
    }`}>
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition">
            <Cpu className="h-6 w-6 text-blue-600" />
            <span className={`text-xl font-bold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>SmartClicks.AI</span>
          </Link>
          
          <div className="flex items-center space-x-3">
            <ThemeToggle />
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-2 rounded-lg transition ${
                isDarkMode 
                  ? 'hover:bg-gray-800' 
                  : 'hover:bg-gray-100'
              }`}
            >
              {isMenuOpen ? (
                <X className={`h-6 w-6 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`} />
              ) : (
                <Menu className={`h-6 w-6 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`} />
              )}
            </button>
            <button 
              onClick={handleGetStarted}
              className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition flex items-center"
            >
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className={`absolute left-0 right-0 top-full border-b shadow-lg ${
            isDarkMode 
              ? 'bg-gray-900 border-gray-700' 
              : 'bg-white border-gray-100'
          }`}>
            <div className="container mx-auto py-4 px-4 space-y-2">
              <a href="#process" className={`block py-2 px-3 rounded-lg ${
                isDarkMode 
                  ? 'text-gray-300 hover:bg-gray-800' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}>How It Works</a>
              <Link to="/dashboard" className={`block py-2 px-3 rounded-lg ${
                isDarkMode 
                  ? 'text-gray-300 hover:bg-gray-800' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}>Demo Dashboard</Link>
              <a href="#benefits" className={`block py-2 px-3 rounded-lg ${
                isDarkMode 
                  ? 'text-gray-300 hover:bg-gray-800' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}>Benefits</a>
              <a href="#pricing" className={`block py-2 px-3 rounded-lg ${
                isDarkMode 
                  ? 'text-gray-300 hover:bg-gray-800' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}>Pricing</a>
              <Link 
                to="/login"
                className={`flex items-center py-2 px-3 rounded-lg ${
                  isDarkMode 
                    ? 'text-gray-300 hover:bg-gray-800' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <LogIn className="h-4 w-4 mr-2" />
                Login
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
