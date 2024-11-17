import React, { useState } from 'react';
import { Menu, X, Cpu, ArrowRight, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';

type Props = {
  onGetStarted: () => void;
};

export default function Header({ onGetStarted }: Props) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition">
            <Cpu className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold">SmartClicks.AI</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <button 
              onClick={onGetStarted}
              className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition flex items-center"
            >
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="absolute left-0 right-0 top-full bg-white border-b border-gray-100 shadow-lg">
            <div className="container mx-auto py-4 px-4 space-y-2">
              <a href="#process" className="block py-2 px-3 text-gray-600 hover:bg-gray-50 rounded-lg">How It Works</a>
              <Link to="/dashboard" className="block py-2 px-3 text-gray-600 hover:bg-gray-50 rounded-lg">Demo Dashboard</Link>
              <a href="#benefits" className="block py-2 px-3 text-gray-600 hover:bg-gray-50 rounded-lg">Benefits</a>
              <a href="#pricing" className="block py-2 px-3 text-gray-600 hover:bg-gray-50 rounded-lg">Pricing</a>
              <Link 
                to="/login"
                className="flex items-center py-2 px-3 text-gray-600 hover:bg-gray-50 rounded-lg"
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