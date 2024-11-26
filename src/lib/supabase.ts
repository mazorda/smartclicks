import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';
import { validateEnvVars, getEnvVar } from '../utils/envValidation';

// Validate all environment variables before initializing
validateEnvVars();

const supabaseUrl = getEnvVar('VITE_SUPABASE_URL');
const supabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY');

// Initialize Supabase client with type safety and security configurations
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true, // Enable session persistence
    autoRefreshToken: true, // Enable automatic token refresh
    detectSessionInUrl: true, // Enable session detection in URL
    flowType: 'pkce', // Use PKCE flow for enhanced security
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      // Add security headers
      'X-Client-Info': 'smartclicks-web',
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    },
  },
  // Set reasonable timeouts
  realtime: {
    timeout: 30000,
  },
});

// Error handler for auth state changes
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_OUT') {
    // Clear any sensitive data from localStorage
    localStorage.removeItem('supabase.auth.token');
    // You might want to clear other sensitive data here
  }
});

// Export typed versions of auth helpers
export const signInWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
};

// Helper to ensure authenticated requests
export const getAuthenticatedClient = async () => {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Authentication required');
  }
  return supabase;
};
