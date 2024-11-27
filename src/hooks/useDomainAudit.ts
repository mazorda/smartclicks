import { useState, useCallback } from 'react';
import { domainAuditServices } from '../services/database';
import { logger } from '../services/logger';
import type { DomainAudit } from '../types/database';

interface DomainAuditState {
  data: DomainAudit | null;
  isLoading: boolean;
  error: Error | null;
  isError: boolean;
  isSuccess: boolean;
}

export function useDomainAudit(domain?: string) {
  const [state, setState] = useState<DomainAuditState>({
    data: null,
    isLoading: false,
    error: null,
    isError: false,
    isSuccess: false
  });

  const fetchData = useCallback(async () => {
    if (!domain) return;

    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const data = await domainAuditServices.createDomainAudit(domain);
      setState({
        data,
        isLoading: false,
        error: null,
        isError: false,
        isSuccess: true
      });
    } catch (err) {
      logger.error('Error in domain audit:', { error: err });
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err : new Error('An unexpected error occurred'),
        isError: true,
        isSuccess: false
      }));
    }
  }, [domain]);

  const submitDomain = useCallback(async (domain: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      await domainAuditServices.createDomainAudit(domain);
    } catch (err) {
      logger.error('Error submitting domain:', { error: err });
      setState(prev => ({
        ...prev,
        error: err instanceof Error ? err : new Error('An unexpected error occurred'),
        isError: true
      }));
      throw err;
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  // For backward compatibility
  return {
    ...state,
    submitDomain,
    isProcessing: state.isLoading,
    progress: state.isSuccess ? 100 : 0,
    retry: fetchData,
    refresh: fetchData
  };
}
