import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Lock, Shield, ArrowLeft, Star, Quote } from 'lucide-react';

type Props = {
  onComplete: () => void;
  onBack: () => void;
  selectedPlan: string;
};

export default function PaymentStep({ onComplete, onBack, selectedPlan }: Props) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
    onComplete();
  };

  return (
    <div className="max-w-3xl mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <button
          onClick={onBack}
          className="mb-6 flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </button>

        <div className="grid md:grid-cols-5 gap-8">
          {/* Left Column - Payment Form */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold">Complete Purchase</h2>
                <div className="flex items-center text-sm text-gray-600">
                  <Lock className="h-4 w-4 mr-1" />
                  Secure Checkout
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Card Information
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value="4242 4242 4242 4242"
                      readOnly
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                      placeholder="Card number"
                    />
                    <CreditCard className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <input
                      type="text"
                      value="12/25"
                      readOnly
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                      placeholder="MM/YY"
                    />
                    <input
                      type="text"
                      value="123"
                      readOnly
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                      placeholder="CVC"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name on Card
                  </label>
                  <input
                    type="text"
                    value="Demo User"
                    readOnly
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                  />
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-blue-700">
                  This is a demo checkout. In production, you'll enter your actual card details.
                </div>

                <button
                  onClick={handlePayment}
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 transition flex items-center justify-center space-x-2 disabled:opacity-50 text-lg font-medium"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Pay $900</span>
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center text-sm text-gray-500 space-x-2">
                  <Lock className="h-4 w-4" />
                  <span>256-bit SSL encrypted</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="md:col-span-2">
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h3 className="font-semibold text-lg mb-4">Order Summary</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Essential Audit</span>
                  <span className="font-medium">$1,800</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Limited Time Discount</span>
                  <span>-$900</span>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>$900</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-6">
                <div className="flex items-start space-x-3">
                  <Shield className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-medium">30-Day Money Back Guarantee</span>
                    <p className="text-sm text-gray-600">Not satisfied? Get a full refund</p>
                  </div>
                </div>

                {/* Testimonial */}
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center space-x-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <div className="relative">
                    <Quote className="h-6 w-6 text-blue-100 absolute -left-1 -top-1" />
                    <p className="text-sm text-gray-600 italic pl-4">
                      SmartClicks.AI uncovered inefficiencies we didn't know existed. After implementing their recommendations, our ROAS improved by 150% within two months.
                    </p>
                  </div>
                  <div className="mt-3 flex items-center">
                    <img
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32"
                      alt="Mark Thompson"
                      className="w-8 h-8 rounded-full mr-2"
                    />
                    <div>
                      <p className="text-sm font-medium">Mark Thompson</p>
                      <p className="text-xs text-gray-500">CMO at TechStart</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}