import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';
import Meetings from './Meetings';
import ChatBot from './ChatBot';
import AuditDashboard from './AuditDashboard';
import { ThemeProvider } from '../../context/ThemeContext';
import ProtectedRoute from '../auth/ProtectedRoute';

export default function Dashboard() {
  // Ensure page starts at top when dashboard loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <ThemeProvider>
      <DashboardLayout>
        <Routes>
          {/* Redirect root to audit */}
          <Route path="/" element={<AuditDashboard />} />
          <Route path="/meetings" element={
            <ProtectedRoute>
              <Meetings />
            </ProtectedRoute>
          } />
          <Route path="/chat" element={
            <ProtectedRoute>
              <ChatBot />
            </ProtectedRoute>
          } />
          <Route path="/audit" element={<Navigate to="/" replace />} />
        </Routes>
      </DashboardLayout>
    </ThemeProvider>
  );
}
