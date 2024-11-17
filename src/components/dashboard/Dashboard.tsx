import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';
import Overview from './Overview';
import Meetings from './Meetings';
import ChatBot from './ChatBot';

export default function Dashboard() {
  // Ensure page starts at top when dashboard loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="/meetings" element={<Meetings />} />
        <Route path="/chat" element={<ChatBot />} />
      </Routes>
    </DashboardLayout>
  );
}