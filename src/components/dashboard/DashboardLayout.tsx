import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  Calendar,
  MessageSquare,
  LogOut,
  Cpu,
  Menu,
  X,
  Bell,
  LineChart,
  Sun,
  Moon
} from 'lucide-react';

const navigation = [
  { name: 'Site Audit', href: '/dashboard', icon: LineChart },
  { name: 'Meetings', href: '/dashboard/meetings', icon: Calendar },
  { 
    name: 'Chat Assistant', 
    href: '/dashboard/chat', 
    icon: MessageSquare,
    disabled: true,
    badge: 'Coming Soon'
  },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { signOut, user } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <nav className="fixed top-0 z-50 w-full bg-gray-800 border-b border-gray-700">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start">
              <Link to="/" className="flex items-center space-x-2 text-white hover:opacity-80 transition">
                <Cpu className="h-8 w-8 text-purple-400" />
                <span className="text-xl font-bold">SmartClicks.AI</span>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg bg-gray-700/50 text-gray-300 hover:text-white transition-all duration-300"
              >
                {isDarkMode ? (
                  <Sun className="w-5 h-5 text-yellow-400" />
                ) : (
                  <Moon className="w-5 h-5 text-blue-400" />
                )}
              </button>
              {showNotification && (
                <div className="hidden md:block px-4 py-2 bg-purple-900/30 rounded-lg text-sm text-purple-300">
                  <span className="font-medium">Demo Mode Active</span>
                </div>
              )}
              <div className="hidden md:flex items-center space-x-4">
                <button className="relative p-2 text-gray-400 hover:text-white transition">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-purple-500 rounded-full"></span>
                </button>
                <div className="flex items-center space-x-3">
                  <img
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32"
                    alt="Demo User"
                    className="w-8 h-8 rounded-full border-2 border-purple-400/30"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-white">Demo User</span>
                    <span className="text-xs text-gray-400">{user?.email}</span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-gray-400"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex pt-16">
        <aside className="hidden md:fixed md:flex left-0 top-16 z-40 w-64 h-screen">
          <div className="h-full px-3 py-4 overflow-y-auto bg-gray-800 border-r border-gray-700 w-full">
            <ul className="space-y-2 font-medium">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={`flex items-center p-2 rounded-lg transition-all duration-200 ${
                        item.disabled 
                          ? 'cursor-not-allowed text-gray-400'
                          : isActive
                            ? 'bg-purple-900/30 text-purple-400 scale-105'
                            : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                      }`}
                      onClick={e => {
                        if (item.disabled) {
                          e.preventDefault();
                        }
                      }}
                    >
                      <div className="flex items-center flex-1">
                        <item.icon className={`w-6 h-6 ${isActive ? 'text-purple-400' : 'text-gray-400'}`} />
                        <span className="ml-3">{item.name}</span>
                      </div>
                      {item.badge && (
                        <span className="ml-2 text-xs px-2 py-1 rounded-full bg-gray-700/80 text-gray-300 whitespace-nowrap">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-40 bg-gray-900">
            <div className="pt-20 px-4">
              <ul className="space-y-2 font-medium">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        onClick={(e) => {
                          if (item.disabled) {
                            e.preventDefault();
                          } else {
                            setIsMobileMenuOpen(false);
                          }
                        }}
                        className={`flex items-center p-4 rounded-lg ${
                          item.disabled
                            ? 'cursor-not-allowed text-gray-400'
                            : isActive
                              ? 'bg-purple-900/30 text-purple-400'
                              : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center flex-1">
                          <item.icon className={`w-6 h-6 ${isActive ? 'text-purple-400' : 'text-gray-400'}`} />
                          <span className="ml-3">{item.name}</span>
                        </div>
                        {item.badge && (
                          <span className="ml-2 text-xs px-2 py-1 rounded-full bg-gray-700/80 text-gray-300 whitespace-nowrap">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
                <li className="pt-4 border-t border-gray-700">
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full p-4 text-gray-400 hover:bg-gray-700 hover:text-white rounded-lg"
                  >
                    <LogOut className="h-6 w-6" />
                    <span className="ml-3">Logout</span>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        )}

        <div className="p-4 w-full md:ml-64">
          <div className="p-4 mt-14">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
