import { useState, useCallback, useEffect } from 'react';
import { domainAuditServices } from '../services/database';
import { logger } from '../services/logger';
import type { DomainAudit } from '../types/database';
import { retryWithBackoff, validateDomainAudit, sanitizeDomainAudit } from '../utils/domainAuditUtils';
import { DEMO_AUDIT_DATA, NEW_COMPANY_DATA, isNewCompany, isExistingCompany } from '../lib/utils/demo-data';

interface DomainAuditState {
  data: DomainAudit | null;
  partialData: Partial<DomainAudit> | null;
  isLoading: boolean;
  isEnrichmentLoading: boolean;
  error: Error | null;
  isError: boolean;
  isSuccess: boolean;
  progress: number;
  isPremium: boolean;
  isDemoMode: boolean;
}

const calculateProgress = (audit: DomainAudit | null): number => {
  if (!audit) return 0;
  
  const statusWeight = {
    pending: 0,
    processing: 0.4,
    completed: 1,
    failed: 0
  };

  const auditProgress = statusWeight[audit.status] * 60; // Base audit is 60% of total
  const enrichmentProgress = statusWeight[audit.enrichment_status] * 40; // Enrichment is 40%
  
  return Math.round(auditProgress + enrichmentProgress);
};

const isPremiumAudit = (audit: DomainAudit | null): boolean => {
  if (!audit) return false;
  return Boolean(audit.clay_data);
};

export function useDomainAudit(domain?: string) {
  const [state, setState] = useState<DomainAuditState>({
    data: null,
    partialData: null,
    isLoading: false,
    isEnrichmentLoading: false,
    error: null,
    isError: false,
    isSuccess: false,
    progress: 0,
    isPremium: false,
    isDemoMode: false
  });

  const updateProgress = useCallback((audit: DomainAudit | null) => {
    setState(prev => ({
      ...prev,
      progress: calculateProgress(audit),
      isPremium: isPremiumAudit(audit)
    }));
  }, []);

  const handleError = useCallback((error: unknown, context: string) => {
    logger.error(`Error in ${context}:`, { error });
    const formattedError = error instanceof Error ? error : new Error('An unexpected error occurred');
    setState(prev => ({
      ...prev,
      error: formattedError,
      isError: true,
      isLoading: false,
      isEnrichmentLoading: false
    }));
    return formattedError;
  }, []);

  const fetchData = useCallback(async () => {
    if (!domain) {
      // If no domain is provided, show demo data
      setState(prev => ({
        ...prev,
        data: DEMO_AUDIT_DATA,
        isLoading: false,
        error: null,
        isError: false,
        isSuccess: true,
        isDemoMode: true,
        progress: 100
      }));
      return;
    }

    setState(prev => ({ 
      ...prev, 
      isLoading: true, 
      error: null,
      isError: false,
      isDemoMode: false
    }));

    try {
      const operation = async () => {
        const data = await domainAuditServices.createDomainAudit(domain);
        const validationResult = validateDomainAudit(data);
        
        if (!validationResult.isValid) {
          throw new Error(`Invalid domain audit data: ${validationResult.errors.map(e => e.message).join(', ')}`);
        }

        return sanitizeDomainAudit(data) as DomainAudit;
      };

      const data = await retryWithBackoff(operation);

      // Handle new company flow
      if (isNewCompany(data)) {
        setState(prev => ({
          ...prev,
          data: { ...data, ...NEW_COMPANY_DATA },
          isLoading: false,
          isSuccess: false,
          progress: 20 // Start with initial progress for new companies
        }));
        return;
      }

      // Early partial data display
      if (data.status === 'processing') {
        setState(prev => ({
          ...prev,
          partialData: {
            domain: data.domain,
            status: data.status,
            metadata: data.metadata
          }
        }));
      }

      // Handle enrichment loading state
      if (data.status === 'completed' && data.enrichment_status === 'processing') {
        setState(prev => ({ ...prev, isEnrichmentLoading: true }));
      }

      setState(prev => ({
        ...prev,
        data,
        isLoading: false,
        isEnrichmentLoading: data.enrichment_status === 'processing',
        error: null,
        isError: false,
        isSuccess: data.status === 'completed',
        isDemoMode: false
      }));

      updateProgress(data);

    } catch (err) {
      handleError(err, 'domain audit fetch');
    }
  }, [domain, handleError, updateProgress]);

  const submitDomain = useCallback(async (domainToSubmit: string) => {
    setState(prev => ({ 
      ...prev, 
      isLoading: true, 
      error: null,
      isError: false,
      isDemoMode: false
    }));

    try {
      const operation = async () => {
        const data = await domainAuditServices.createDomainAudit(domainToSubmit);
        return sanitizeDomainAudit(data) as DomainAudit;
      };

      const data = await retryWithBackoff(operation);
      
      setState(prev => ({
        ...prev,
        data,
        isLoading: false,
        error: null,
        isError: false
      }));

      updateProgress(data);
      return data;

    } catch (err) {
      const error = handleError(err, 'domain submission');
      throw error;
    }
  }, [handleError, updateProgress]);

  // Poll for updates when processing
  useEffect(() => {
    if (!state.data || state.isDemoMode) return;

    const shouldPoll = 
      (state.data.status === 'processing') || 
      (state.data.status === 'completed' && state.data.enrichment_status === 'processing');

    if (shouldPoll) {
      const pollInterval = setInterval(fetchData, 5000);
      return () => clearInterval(pollInterval);
    }
  }, [state.data, state.isDemoMode, fetchData]);

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    ...state,
    submitDomain,
    isProcessing: state.isLoading || state.isEnrichmentLoading,
    isNewCompany: state.data ? isNewCompany(state.data) : false,
    isExistingCompany: state.data ? isExistingCompany(state.data) : false,
    retry: fetchData,
    refresh: fetchData
  };
}
