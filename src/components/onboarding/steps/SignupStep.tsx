import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, ArrowLeft, Bot, AlertCircle, Check } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { Link } from 'react-router-dom';

type Props = {
  onComplete: () => void;
  onBack: () => void;
};

export default function SignupStep({ onComplete, onBack }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signUp } = useAuth();

  // Password validation
  const hasMinLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  const isPasswordValid = hasMinLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
  const doPasswordsMatch = password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setError(null);

      // Validate form
      if (!email || !password || !confirmPassword) {
        setError('All fields are required');
        return;
      }

      if (!isPasswordValid) {
        setError('Password does not meet requirements');
        return;
      }

      if (!doPasswordsMatch) {
        setError('Passwords do not match');
        return;
      }

      if (!acceptTerms) {
        setError('Please accept the terms and conditions');
        return;
      }

      setLoading(true);
      await signUp(email, password);
      onComplete();
    } catch (error: any) {
      setError(error.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = () => {
    const timestamp = new Date().getTime();
    setEmail(`demo${timestamp}@example.com`);
    setPassword('Demo123!@#');
    setConfirmPassword('Demo123!@#');
    setAcceptTerms(true);
  };

  return (
    <div className="max-w-md mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Link
          to="/"
          onClick={(e) => {
            e.preventDefault();
            onBack();
          }}
          className="mb-6 flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Homepage
        </Link>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Create Your Account</h2>
          <p className="text-gray-600">
            Sign up to start your Google Ads audit journey. Your data is secure and protected.
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Create a secure password"
                required
              />
            </div>
            
            {/* Password requirements */}
            <div className="mt-2 space-y-2">
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
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`pl-10 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  confirmPassword && !doPasswordsMatch ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Confirm your password"
                required
              />
            </div>
            {confirmPassword && !doPasswordsMatch && (
              <p className="mt-1 text-sm text-red-600">Passwords do not match</p>
            )}
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="terms"
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

          <button
            type="submit"
            disabled={loading || !isPasswordValid || !doPasswordsMatch || !acceptTerms}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <button
              onClick={fillDemoAccount}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition border border-blue-200"
            >
              <Bot className="h-5 w-5" />
              <span>Try Demo Mode</span>
            </button>

            <button
              disabled
              className="w-full flex items-center justify-center gap-3 bg-gray-100 px-4 py-3 rounded-lg text-gray-500 cursor-not-allowed"
            >
              <img
                src="https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png"
                alt="Google"
                className="w-5 h-5 opacity-50"
              />
              Sign up with Google (Coming Soon)
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}