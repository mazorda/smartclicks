import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import DashboardLayout from './DashboardLayout';
import Meetings from './Meetings';
import ChatBot from './ChatBot';
import AuditDashboard from './AuditDashboard';
import { ThemeProvider } from '../../context/ThemeContext';
import ProtectedRoute from '../auth/ProtectedRoute';

const pageTransition = {
  initial: { opacity: 0, x: -10 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 10 }
};

const MotionRoute = ({ children }: { children: React.ReactNode }) => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
      transition={{ 
        duration: prefersReducedMotion ? 0 : 0.2,
        ease: "easeInOut"
      }}
    >
      {children}
    </motion.div>
  );
};

export default function Dashboard() {
  const location = useLocation();

  // Ensure page starts at top when dashboard loads or route changes
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReducedMotion) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.pathname]);

  return (
    <ThemeProvider>
      <DashboardLayout>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* Redirect root to audit */}
            <Route path="/" element={
              <MotionRoute>
                <AuditDashboard />
              </MotionRoute>
            } />
            <Route path="/meetings" element={
              <MotionRoute>
                <ProtectedRoute>
                  <Meetings />
                </ProtectedRoute>
              </MotionRoute>
            } />
            <Route path="/chat" element={
              <MotionRoute>
                <ProtectedRoute>
                  <ChatBot />
                </ProtectedRoute>
              </MotionRoute>
            } />
            <Route path="/audit" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </DashboardLayout>
    </ThemeProvider>
  );
}
