import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import HiddenCosts from './components/HiddenCosts';
import IntroSection from './components/IntroSection';
import Process from './components/Process';
import Benefits from './components/Benefits';
import Pricing from './components/Pricing';
import Footer from './components/Footer';
import OnboardingFlow from './components/onboarding/OnboardingFlow';
import Dashboard from './components/dashboard/Dashboard';
import Login from './components/auth/Login';
import SampleReport from './components/SampleReport';
import PrivacyPolicy from './components/legal/PrivacyPolicy';
import TermsOfService from './components/legal/TermsOfService';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

function HomePage() {
  const [showOnboarding, setShowOnboarding] = React.useState(false);

  if (showOnboarding) {
    return <OnboardingFlow onCancel={() => setShowOnboarding(false)} />;
  }

  return (
    <div className="min-h-screen bg-white">
      <Header onGetStarted={() => setShowOnboarding(true)} />
      <main>
        <Hero onGetStarted={() => setShowOnboarding(true)} />
        <HiddenCosts />
        <IntroSection />
        <Process />
        <Benefits />
        <Pricing onGetStarted={() => setShowOnboarding(true)} />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard/*" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/sample-report" element={<SampleReport />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/" element={<HomePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}