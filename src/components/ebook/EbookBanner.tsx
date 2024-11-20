import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Book, ArrowRight, Mail } from 'lucide-react';
import { Dialog } from '@headlessui/react';
import toast from 'react-hot-toast';
import { useEbookModal } from '../../hooks/useEbookModal';

export function useScrollTrigger(threshold = 25) {
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      if (scrollPercentage >= threshold && !triggered) {
        setTriggered(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold, triggered]);

  return triggered;
}

export default function EbookBanner() {
  const [isOpen, setIsOpen] = useState(true);
  const { isOpen: showEmailModal, closeModal: handleClose, openModal } = useEbookModal();
  const [email, setEmail] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const shouldShow = useScrollTrigger();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !acceptTerms) return;

    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
    setShowThankYou(true);
    
    console.log('Email submitted:', email);
  };

  const handleModalClose = () => {
    handleClose();
    setShowThankYou(false);
    setEmail('');
    setAcceptTerms(false);
  };

  if (!isOpen || !shouldShow) return null;

  return (
    <>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg z-50 mb-[72px] md:mb-[92px]"
      >
        <div className="container mx-auto">
          <div className="flex items-center justify-between p-3 md:p-6">
            <div className="flex items-center space-x-3 flex-1">
              <div className="hidden sm:flex h-10 w-10 bg-white/10 rounded-lg items-center justify-center shrink-0">
                <Book className="h-5 w-5 text-white" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-white text-sm md:text-base">
                  Lost Clicks: Capturing High-Intent Customers
                </h3>
                <p className="text-xs md:text-sm text-blue-100 hidden sm:block">
                  Free guide to stop losing leads
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 md:space-x-4">
              <button
                onClick={openModal}
                className="bg-white text-blue-600 px-3 md:px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition flex items-center space-x-2 shadow-sm whitespace-nowrap"
              >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Download Free eBook</span>
                <span className="sm:hidden">Download</span>
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {showEmailModal && (
          <Dialog
            as={motion.div}
            static
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            open={showEmailModal}
            onClose={handleModalClose}
            className="fixed inset-0 z-50 overflow-y-auto p-4 md:p-8"
          >
            <div className="min-h-screen flex items-center justify-center">
              <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="relative w-full max-w-md bg-white rounded-xl shadow-xl p-6 md:p-8"
              >
                {!showThankYou ? (
                  <>
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Book className="h-8 w-8 text-white" />
                      </div>
                      <Dialog.Title as="h3" className="text-xl md:text-2xl font-bold text-gray-900">
                        Get Your Free eBook
                      </Dialog.Title>
                      <p className="mt-2 text-gray-600">
                        Enter your email to receive "Lost Clicks" and discover how to capture more high-intent customers.
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="you@example.com"
                            required
                          />
                        </div>
                      </div>

                      <div className="flex items-start">
                        <input
                          type="checkbox"
                          id="terms-modal"
                          checked={acceptTerms}
                          onChange={(e) => setAcceptTerms(e.target.checked)}
                          className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="terms-modal" className="ml-2 text-sm text-gray-600">
                          I agree to the{' '}
                          <a href="/terms-of-service" className="text-blue-600 hover:underline">
                            Terms & Conditions
                          </a>
                        </label>
                      </div>

                      <button
                        type="submit"
                        disabled={!email || !acceptTerms || loading}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition flex items-center justify-center space-x-2 disabled:opacity-50"
                      >
                        {loading ? (
                          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <Download className="h-5 w-5" />
                            <span>Get Your Free eBook</span>
                          </>
                        )}
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Download className="h-8 w-8 text-green-600" />
                    </div>

                    <Dialog.Title as="h3" className="text-2xl font-bold text-gray-900 mb-2">
                      Thank You! 🎉
                    </Dialog.Title>

                    <p className="text-gray-600 mb-6">
                      Your eBook is on its way to your inbox. You can also download it directly:
                    </p>

                    <a
                      href="/ebook-lost-clicks.pdf"
                      download
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition group"
                    >
                      <span>Download eBook</span>
                      <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                    </a>

                    <button
                      onClick={() => {
                        handleModalClose();
                        toast.success('eBook downloaded successfully!');
                      }}
                      className="mt-6 text-gray-600 hover:text-gray-900 block w-full text-center"
                    >
                      Close
                    </button>
                  </div>
                )}
              </motion.div>
            </div>
          </Dialog>
        )}
      </AnimatePresence>
    </>
  );
}