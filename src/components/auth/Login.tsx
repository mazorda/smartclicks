import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, AlertCircle, ArrowLeft, Bot, Check } from 'lucide-react';

type TabType = 'login' | 'signup';

export default function Login() {
  const [activeTab, setActiveTab] = useState<TabType>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signIn, signUp, signInDemo } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  // Password validation for signup
  const hasMinLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  const isPasswordValid = hasMinLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
  const doPasswordsMatch = password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (activeTab === 'login') {
        await signIn(email, password);
        navigate(from, { replace: true });
      } else {
        // Signup validation
        if (!email || !password || !confirmPassword) {
          throw new Error('All fields are required');
        }

        if (!isPasswordValid) {
          throw new Error('Password does not meet requirements');
        }

        if (!doPasswordsMatch) {
          throw new Error('Passwords do not match');
        }

        if (!acceptTerms) {
          throw new Error('Please accept the terms and conditions');
        }

        await signUp(email, password);
        navigate('/dashboard');
      }
    } catch (error: any) {
      setError(error.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    try {
      setError(null);
      setLoading(true);
      await signInDemo();
      navigate('/dashboard');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex items-center justify-center text-gray-600 hover:text-gray-900 mb-8">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Homepage
        </Link>

        {/* Tabs */}
        <div className="flex justify-center space-x-4 mb-8">
          <button
            onClick={() => setActiveTab('login')}
            className={`px-4 py-2 rounded-lg transition ${
              activeTab === 'login'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setActiveTab('signup')}
            className={`px-4 py-2 rounded-lg transition ${
              activeTab === 'signup'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Sign Up
          </button>
        </div>

        <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
          {activeTab === 'login' ? 'Welcome Back' : 'Create Your Account'}
        </h2>
        {activeTab === 'signup' && (
          <p className="mt-2 text-center text-gray-600">
            Sign up to start your Google Ads audit journey
          </p>
        )}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <button
            onClick={handleDemoLogin}
            disabled={loading}
            className="w-full mb-6 flex items-center justify-center gap-2 bg-blue-600 px-4 py-3 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            <Bot className="h-5 w-5" />
            <span>Try Demo Account</span>
          </button>

          <button
            disabled
            className="w-full flex items-center justify-center gap-3 bg-gray-100 px-4 py-3 rounded-lg text-gray-500 cursor-not-allowed mb-6"
          >
            <img
              src="https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png"
              alt="Google"
              className="w-5 h-5 opacity-50"
            />
            Sign in with Google (Coming Soon)
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Or continue with email
              </span>
            </div>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1 relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete={activeTab === 'login' ? 'current-password' : 'new-password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                />
              </div>
            </div>

            {activeTab === 'signup' && (
              <>
                {/* Password requirements */}
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 mb-1">Password requirements:</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className={`flex items-center ${hasMinLength ? 'text-green-600' : 'text-gray-500'}`}>
                      <Check className="h-4 w-4 mr-1" />
                      <span>8+ characters</span>
                    </div>
                    <div className={`flex items-center ${hasUpperCase ? 'text-green-600' : 'text-gray-500'}`}>
                      <Check className="h-4 w-4 mr-1" />
                      <span>Uppercase letter</span>
                    </div>
                    <div className={`flex items-center ${hasLowerCase ? 'text-green-600' : 'text-gray-500'}`}>
                      <Check className="h-4 w-4 mr-1" />
                      <span>Lowercase letter</span>
                    </div>
                    <div className={`flex items-center ${hasNumber ? 'text-green-600' : 'text-gray-500'}`}>
                      <Check className="h-4 w-4 mr-1" />
                      <span>Number</span>
                    </div>
                    <div className={`flex items-center ${hasSpecialChar ? 'text-green-600' : 'text-gray-500'}`}>
                      <Check className="h-4 w-4 mr-1" />
                      <span>Special character</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm Password
                  </label>
                  <div className="mt-1 relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`pl-10 block w-full appearance-none rounded-md border px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 ${
                        confirmPassword && !doPasswordsMatch ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {confirmPassword && !doPasswordsMatch && (
                    <p className="mt-1 text-sm text-red-600">Passwords do not match</p>
                  )}
                </div>

                <div className="flex items-center">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="terms" className="ml-2 block text-sm text-gray-600">
                    I accept the{' '}
                    <Link to="/terms-of-service" className="text-blue-600 hover:text-blue-700">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy-policy" className="text-blue-600 hover:text-blue-700">
                      Privacy Policy
                    </Link>
                  </label>
                </div>
              </>
            )}

            <div>
              <button
                type="submit"
                disabled={loading || (activeTab === 'signup' && (!isPasswordValid || !doPasswordsMatch || !acceptTerms))}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  activeTab === 'login' ? 'Sign In' : 'Create Account'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}