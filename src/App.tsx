import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import ErrorBoundary from './components/common/ErrorBoundary';
import LoadingScreen from './components/common/LoadingScreen';
import { AuthProvider } from './context/AuthContext';
import SEO from './components/SEO';
import EbookBanner from './components/ebook/EbookBanner';

// Lazy load components
const Header = React.lazy(() => import('./components/Header'));
const Hero = React.lazy(() => import('./components/Hero'));
const HiddenCosts = React.lazy(() => import('./components/HiddenCosts'));
const IntroSection = React.lazy(() => import('./components/IntroSection'));
const Process = React.lazy(() => import('./components/Process'));
const Benefits = React.lazy(() => import('./components/Benefits'));
const Pricing = React.lazy(() => import('./components/Pricing'));
const Footer = React.lazy(() => import('./components/Footer'));
const OnboardingFlow = React.lazy(() => import('./components/onboarding/OnboardingFlow'));
const Dashboard = React.lazy(() => import('./components/dashboard/Dashboard'));
const Login = React.lazy(() => import('./components/auth/Login'));
const SampleReport = React.lazy(() => import('./components/SampleReport'));
const PrivacyPolicy = React.lazy(() => import('./components/legal/PrivacyPolicy'));
const TermsOfService = React.lazy(() => import('./components/legal/TermsOfService'));

function HomePage() {
  const [showOnboarding, setShowOnboarding] = React.useState(false);

  if (showOnboarding) {
    return (
      <Suspense fallback={<LoadingScreen message="Loading onboarding..." />}>
        <OnboardingFlow onCancel={() => setShowOnboarding(false)} />
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <SEO />
      <ErrorBoundary>
        <Suspense fallback={<LoadingScreen />}>
          <EbookBanner />
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
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={
              <Suspense fallback={<LoadingScreen message="Loading authentication..." />}>
                <SEO title="Login - SmartClicks.AI" />
                <Login />
              </Suspense>
            } />
            <Route path="/dashboard/*" element={
              <Suspense fallback={<LoadingScreen message="Loading dashboard..." />}>
                <ErrorBoundary>
                  <SEO title="Dashboard - SmartClicks.AI" />
                  <Dashboard />
                </ErrorBoundary>
              </Suspense>
            } />
            <Route path="/sample-report" element={
              <Suspense fallback={<LoadingScreen message="Loading report..." />}>
                <ErrorBoundary>
                  <SEO title="Sample Report - SmartClicks.AI" />
                  <SampleReport />
                </ErrorBoundary>
              </Suspense>
            } />
            <Route path="/privacy-policy" element={
              <Suspense fallback={<LoadingScreen />}>
                <SEO title="Privacy Policy - SmartClicks.AI" />
                <PrivacyPolicy />
              </Suspense>
            } />
            <Route path="/terms-of-service" element={
              <Suspense fallback={<LoadingScreen />}>
                <SEO title="Terms of Service - SmartClicks.AI" />
                <TermsOfService />
              </Suspense>
            } />
            <Route path="/" element={<HomePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toaster position="top-right" />
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}