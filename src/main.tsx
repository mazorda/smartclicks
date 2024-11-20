import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { initializeGA, initializeGTM } from './lib/analytics';

// Initialize analytics
initializeGA();
initializeGTM();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <App />
    </Suspense>
  </StrictMode>
);