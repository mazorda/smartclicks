import { useState, useEffect, useCallback, useRef } from 'react';
import { domainAuditServices } from '../services/database';
import { logger } from '../services/logger';
import { supabase } from '../lib/supabase';
import type { DomainAudit } from '../types/database';
import { DomainAuditError, TimeoutError } from '../types/services';

export type DomainAuditStatus = 'idle' | 'loading' | 'processing' | 'success' | 'error';

interface DomainAuditState {
  data: DomainAudit | null;
  status: DomainAuditStatus;
  error: Error | null;
  isLoading: boolean;
  isProcessing: boolean;
  isError: boolean;
  isSuccess: boolean;
  progress: number;
  isStale: boolean;
}

interface DomainAuditOptions {
  forceRefresh?: boolean;
}

interface DomainAuditActions {
  refresh: () => Promise<void>;
  retry: () => Promise<void>;
}

const PROCESSING_TIMEOUT = 3 * 60 * 1000; // 3 minutes

export function useDomainAudit(domain?: string, options: DomainAuditOptions = {}): DomainAuditState & DomainAuditActions {
  const [state, setState] = useState<DomainAuditState>({
    data: null,
    status: 'idle',
    error: null,
    isLoading: false,
    isProcessing: false,
    isError: false,
    isSuccess: false,
    progress: 0,
    isStale: false
  });

  const abortControllerRef = useRef<AbortController | null>(null);
  const retryCountRef = useRef(0);
  const processingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const subscriptionRef = useRef<any>(null);
  const previousDomainRef = useRef<string | undefined>(domain);
  const MAX_RETRIES = 3;

  // Reset state when domain changes
  useEffect(() => {
    if (domain !== previousDomainRef.current) {
      logger.info('Domain changed, resetting state', { 
        previousDomain: previousDomainRef.current, 
        newDomain: domain 
      });
      previousDomainRef.current = domain;
      
      setState({
        data: null,
        status: 'loading',
        error: null,
        isLoading: true,
        isProcessing: false,
        isError: false,
        isSuccess: false,
        progress: 0,
        isStale: false
      });
    }
  }, [domain]);

  const setupRealtimeSubscription = useCallback((domainToWatch: string) => {
    // Clean up existing subscription if any
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
    }

    // Subscribe to changes on the domain_audits table for this specific domain
    subscriptionRef.current = supabase
      .channel('domain_audits_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'domain_audits',
          filter: `domain=eq.${domainToWatch.toLowerCase().trim()}`
        },
        async (payload) => {
          logger.info('Received real-time update:', { payload });
          
          if (payload.eventType === 'UPDATE') {
            const updatedAudit = payload.new as DomainAudit;
            
            setState(prev => {
              // Calculate progress based on enrichment status
              let progress = prev.progress;
              if (updatedAudit.enrichment_status === 'completed') {
                progress = 100;
              } else if (updatedAudit.enrichment_status === 'processing') {
                // More granular progress updates
                const currentProgress = prev.progress || 0;
                progress = Math.min(currentProgress + 10, 90);
              }

              // Check if data is stale
              const isStale = updatedAudit.updated_at ? 
                Date.now() - new Date(updatedAudit.updated_at).getTime() > domainAuditServices.getDataFreshnessThreshold() * 24 * 60 * 60 * 1000 
                : false;

              return {
                data: updatedAudit,
                status: updatedAudit.enrichment_status === 'completed' ? 'success' 
                      : updatedAudit.enrichment_status === 'failed' ? 'error'
                      : 'processing',
                error: updatedAudit.enrichment_status === 'failed' 
                      ? new Error(updatedAudit.metadata?.lastError || 'Enrichment failed')
                      : null,
                isLoading: false,
                isProcessing: updatedAudit.enrichment_status === 'processing',
                isError: updatedAudit.enrichment_status === 'failed',
                isSuccess: updatedAudit.enrichment_status === 'completed',
                progress,
                isStale
              };
            });

            // Clear processing timeout if enrichment is complete or failed
            if (['completed', 'failed'].includes(updatedAudit.enrichment_status)) {
              if (processingTimeoutRef.current) {
                clearTimeout(processingTimeoutRef.current);
                processingTimeoutRef.current = null;
              }
            }
          }
        }
      )
      .subscribe();

  }, []);

  const fetchData = useCallback(async (signal?: AbortSignal): Promise<void> => {
    try {
      setState(prev => ({
        ...prev,
        status: 'loading',
        isLoading: true,
        error: null,
      }));

      logger.info('Fetching domain audit data', { domain, options });

      let data: DomainAudit | null = null;
      if (domain) {
        data = await domainAuditServices.createDomainAudit(domain, {
          forceRefresh: options.forceRefresh
        });
        
        // Immediately set processing state
        setState(prev => ({
          ...prev,
          data,
          status: 'processing',
          isLoading: false,
          isProcessing: true,
          progress: 10,
          isStale: false
        }));
        
        // Set up processing timeout
        processingTimeoutRef.current = setTimeout(() => {
          setState(prev => ({
            ...prev,
            status: 'error',
            error: new Error('Processing timeout exceeded'),
            isProcessing: false,
            isError: true,
          }));
        }, PROCESSING_TIMEOUT);
      } else {
        data = await domainAuditServices.getLatestDomainAudit();
      }

      if (signal?.aborted) {
        return;
      }

      if (data) {
        const isStale = Date.now() - new Date(data.updated_at).getTime() > 
          domainAuditServices.getDataFreshnessThreshold() * 24 * 60 * 60 * 1000;

        setState({
          data,
          status: data.enrichment_status === 'completed' ? 'success' 
                : data.enrichment_status === 'failed' ? 'error'
                : 'processing',
          error: data.enrichment_status === 'failed' 
                ? new Error(data.metadata?.lastError || 'Enrichment failed')
                : null,
          isLoading: false,
          isProcessing: data.enrichment_status === 'processing',
          isError: data.enrichment_status === 'failed',
          isSuccess: data.enrichment_status === 'completed',
          progress: data.enrichment_status === 'completed' ? 100 : 30,
          isStale
        });

        logger.info('Successfully fetched domain audit data', {
          id: data.id,
          domain: data.domain,
        });

        // Set up real-time subscription for this domain
        if (domain) {
          setupRealtimeSubscription(domain);
        }
      } else {
        throw new Error('No domain audit data available');
      }
    } catch (error) {
      if (signal?.aborted) {
        return;
      }

      logger.error('Error fetching domain audit data:', { error, domain });

      let errorMessage = 'An unexpected error occurred';
      if (error instanceof TimeoutError) {
        errorMessage = 'Request timed out. Please try again.';
      } else if (error instanceof DomainAuditError) {
        errorMessage = error.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      setState({
        data: null,
        status: 'error',
        error: new Error(errorMessage),
        isLoading: false,
        isProcessing: false,
        isError: true,
        isSuccess: false,
        progress: 0,
        isStale: false
      });
    }
  }, [domain, options.forceRefresh, setupRealtimeSubscription]);

  const refresh = useCallback(async () => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();
    await fetchData(abortControllerRef.current.signal);
  }, [fetchData]);

  const retry = useCallback(async () => {
    if (retryCountRef.current >= MAX_RETRIES) {
      logger.warn('Maximum retry attempts reached', { domain });
      setState(prev => ({
        ...prev,
        error: new Error('Maximum retry attempts reached. Please try again later.'),
      }));
      return;
    }

    retryCountRef.current += 1;
    logger.info('Retrying domain audit fetch', {
      attempt: retryCountRef.current,
      domain,
    });

    await refresh();
  }, [refresh, domain]);

  useEffect(() => {
    abortControllerRef.current = new AbortController();
    fetchData(abortControllerRef.current.signal);

    return () => {
      abortControllerRef.current?.abort();
      if (processingTimeoutRef.current) {
        clearTimeout(processingTimeoutRef.current);
      }
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
    };
  }, [fetchData]);

  return {
    ...state,
    refresh,
    retry,
  };
}
