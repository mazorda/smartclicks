import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';
import Meetings from './Meetings';
import ChatBot from './ChatBot';
import AuditDashboard from './AuditDashboard';
import { ThemeProvider } from '../../context/ThemeContext';

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
          <Route path="/meetings" element={<Meetings />} />
          <Route path="/chat" element={<ChatBot />} />
          <Route path="/audit" element={<Navigate to="/" replace />} />
        </Routes>
      </DashboardLayout>
    </ThemeProvider>
  );
}
