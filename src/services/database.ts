import { supabase } from '../lib/supabase';
import { logger } from './logger';
import { 
  retryWithBackoff, 
  validateDomainAudit, 
  withTimeout, 
  sanitizeDomainAudit,
  generateTimestamp,
  normalizeTimestamp
} from '../utils/domainAuditUtils';
import type { Database } from '../types/database';
import type { DomainAuditServiceConfig } from '../types/services';
import { 
  DomainAuditError, 
  TimeoutError, 
  ValidationError,
  DEFAULT_SERVICE_CONFIG 
} from '../types/services';

type Lead = Database['public']['Tables']['leads']['Row'];
type NewLead = Database['public']['Tables']['leads']['Insert'];
type DomainAudit = Database['public']['Tables']['domain_audits']['Row'];
type NewDomainAudit = Database['public']['Tables']['domain_audits']['Insert'];

// Lead Services
export const leadServices = {
  async createLead(email: string, source: string = 'ebook'): Promise<Lead> {
    try {
      const newLead: NewLead = {
        email,
        source,
        status: 'new',
        metadata: {
          acceptedTerms: true,
          downloadedEbook: true,
          timestamp: generateTimestamp()
        }
      };

      const { data, error } = await supabase
        .from('leads')
        .insert([newLead])
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('No data returned');
      
      return data;
    } catch (error) {
      logger.error('Failed to create lead:', { error });
      throw error;
    }
  },

  async getLeads(): Promise<Lead[]> {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }
};

// Domain Audit Services
class DomainAuditService {
  private config: DomainAuditServiceConfig;
  private pollInterval: number = 2000; // 2 seconds
  private DATA_FRESHNESS_THRESHOLD = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
  private inProgressDomains: Set<string> = new Set();
  private recentAudits: Map<string, { timestamp: number, id: string }> = new Map();
  private readonly RECENT_AUDIT_WINDOW = 5000; // 5 second window

  constructor(config: Partial<DomainAuditServiceConfig> = {}) {
    this.config = { ...DEFAULT_SERVICE_CONFIG, ...config };
    // Set up periodic cleanup
    setInterval(() => this.cleanupStaleEntries(), this.RECENT_AUDIT_WINDOW);
  }

  private cleanupStaleEntries(): void {
    const now = Date.now();
    let cleanedCount = 0;
    
    // Cleanup recent audits
    for (const [domain, data] of this.recentAudits.entries()) {
      if (now - data.timestamp > this.RECENT_AUDIT_WINDOW) {
        this.recentAudits.delete(domain);
        cleanedCount++;
      }
    }

    // Cleanup in-progress domains that might have been orphaned
    for (const domain of this.inProgressDomains) {
      const recent = this.recentAudits.get(domain);
      if (!recent || now - recent.timestamp > this.RECENT_AUDIT_WINDOW) {
        this.inProgressDomains.delete(domain);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      logger.debug('Cleaned up stale entries', {
        cleanedCount,
        remainingRecent: this.recentAudits.size,
        remainingInProgress: this.inProgressDomains.size
      });
    }
  }

  private cleanupDomain(domain: string): void {
    this.recentAudits.delete(domain);
    this.inProgressDomains.delete(domain);
    logger.debug('Cleaned up domain entries', { domain });
  }

  async createDomainAudit(domain: string, options: { forceRefresh?: boolean } = {}): Promise<DomainAudit> {
    if (!domain) {
      throw new ValidationError('Domain is required');
    }

    this.cleanupStaleEntries(); // Clean up at the start of each request
    const normalizedDomain = domain.toLowerCase().trim();
    
    try {
      // Check for in-progress audits
      if (this.inProgressDomains.has(normalizedDomain)) {
        logger.info('Domain audit already in progress, skipping duplicate request', { domain: normalizedDomain });
        return this.getDomainAudit(normalizedDomain) as Promise<DomainAudit>;
      }

      // Check for recent audits within the window
      const recent = this.recentAudits.get(normalizedDomain);
      if (recent && Date.now() - recent.timestamp < this.RECENT_AUDIT_WINDOW) {
        logger.info('Recent audit found within window', { 
          domain: normalizedDomain,
          auditId: recent.id,
          age: Date.now() - recent.timestamp
        });
        
        // Verify the recent audit still exists
        const existingAudit = await this.getDomainAudit(normalizedDomain);
        if (!existingAudit) {
          logger.warn('Recent audit not found in database, cleaning up tracking', {
            domain: normalizedDomain,
            auditId: recent.id
          });
          this.cleanupDomain(normalizedDomain);
        } else {
          return existingAudit;
        }
      }

      this.inProgressDomains.add(normalizedDomain);
      logger.info('Creating domain audit', { domain: normalizedDomain, options });

      // Check for existing audit
      const existingAudit = await this.getDomainAudit(normalizedDomain);
      
      if (existingAudit) {
        const isStale = Date.now() - new Date(existingAudit.updated_at).getTime() > this.DATA_FRESHNESS_THRESHOLD;
        
        // Return existing audit if it's complete and not stale (unless force refresh requested)
        if (existingAudit.enrichment_status === 'completed' && !isStale && !options.forceRefresh) {
          logger.info('Using existing completed audit', { domain: normalizedDomain });
          return existingAudit;
        }
        
        // Update existing audit if stale or force refresh requested
        if (isStale || options.forceRefresh) {
          logger.info('Refreshing existing audit', { domain: normalizedDomain, isStale, forceRefresh: options.forceRefresh });
          return this.refreshDomainAudit(existingAudit.id);
        }
      }

      const newAudit: NewDomainAudit = {
        domain: normalizedDomain,
        status: 'pending',
        enrichment_status: 'pending',
        metadata: {
          source: 'homepage',
          timestamp: generateTimestamp(),
          retryCount: 0,
          lastError: null,
          refresh_history: []
        },
        clay_data: null,
        user_id: null,
        r1_gads_health_score: null,
        r1_health_score_analysis: null,
        r1_landing_pages: null,
        r1_analysis: null,
        r1_bounce_rate: null,
        r1_traffic_rank: null,
        r1_avg_time_on_site: null,
        r1_total_visits: null,
        r1_paid_visits: null,
        r1_organic_visits: null,
        r1_company_size: null,
        r1_company_industry: null,
        r1_company_logo_url: null,
        r1_competitor_domain: null,
        r1_competitor_gads_cost: null
      };

      const { data, error } = await supabase
        .from('domain_audits')
        .insert([newAudit])
        .select()
        .single();

      if (error) {
        logger.error('Supabase error in createDomainAudit:', { error, domain: normalizedDomain });
        if (error.code === '42501') {
          throw new DomainAuditError('Permission denied. Please try again later.', 'PERMISSION_DENIED', error);
        }
        if (error.code === '23505') {
          throw new DomainAuditError('This domain has already been submitted.', 'DUPLICATE_DOMAIN', error);
        }
        throw new DomainAuditError('Failed to create domain audit', 'CREATE_FAILED', error);
      }

      if (!data) {
        throw new ValidationError('No data returned from insert');
      }

      // Start enrichment process
      await this.updateEnrichmentStatus(data.id, 'processing');

      // Normalize timestamps before validation
      const normalizedData = {
        ...data,
        created_at: data.created_at ? normalizeTimestamp(data.created_at) : undefined,
        updated_at: data.updated_at ? normalizeTimestamp(data.updated_at) : undefined,
        metadata: {
          ...data.metadata,
          timestamp: data.metadata?.timestamp ? normalizeTimestamp(data.metadata.timestamp) : undefined
        }
      };

      const validation = validateDomainAudit(normalizedData);
      if (!validation.isValid) {
        logger.error('Validation failed for created domain audit', { 
          errors: validation.errors,
          domain: normalizedDomain
        });
        throw validation.errors[0];
      }

      // Track this audit in recentAudits
      this.recentAudits.set(normalizedDomain, {
        timestamp: Date.now(),
        id: data.id
      });

      logger.info('Successfully created domain audit', { 
        id: data.id,
        domain: normalizedDomain
      });

      return normalizedData;
    } catch (error) {
      logger.error('Error in createDomainAudit:', { error, domain: normalizedDomain });
      this.cleanupDomain(normalizedDomain);
      throw error;
    } finally {
      this.inProgressDomains.delete(normalizedDomain);
    }
  }

  async refreshDomainAudit(id: string): Promise<DomainAudit> {
    try {
      logger.info('Refreshing domain audit', { id });

      // Get current audit to access metadata
      const { data: currentAudit, error: fetchError } = await supabase
        .from('domain_audits')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;
      if (!currentAudit) throw new Error('Audit not found');

      // Prepare refresh history
      const refreshHistory = currentAudit.metadata?.refresh_history || [];
      refreshHistory.push({
        timestamp: generateTimestamp(),
        previous_status: currentAudit.enrichment_status,
        reason: 'manual_refresh'
      });

      // Update the audit
      const { data, error } = await supabase
        .from('domain_audits')
        .update({
          enrichment_status: 'pending',
          metadata: {
            ...currentAudit.metadata,
            last_refreshed: generateTimestamp(),
            refresh_history: refreshHistory,
            refresh_count: (refreshHistory.length || 0) + 1
          }
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('No data returned from refresh');

      // Start new enrichment process
      await this.updateEnrichmentStatus(id, 'processing');

      logger.info('Successfully refreshed domain audit', { id });

      return data;
    } catch (error) {
      logger.error('Error in refreshDomainAudit:', { error, id });
      throw error;
    }
  }

  private async updateEnrichmentStatus(id: string, status: string, error?: Error): Promise<void> {
    try {
      const updateData: any = {
        enrichment_status: status,
        updated_at: new Date().toISOString()
      };

      if (error) {
        updateData.metadata = {
          lastError: error.message,
          errorTimestamp: generateTimestamp()
        };
      }

      const { error: updateError } = await supabase
        .from('domain_audits')
        .update(updateData)
        .eq('id', id);

      if (updateError) {
        logger.error('Failed to update enrichment status:', { updateError, id, status });
        throw updateError;
      }
    } catch (err) {
      logger.error('Error updating enrichment status:', { err, id, status });
      throw err;
    }
  }

  async getDomainAudit(domain: string): Promise<DomainAudit | null> {
    try {
      logger.info('Fetching domain audit', { domain });

      const { data, error } = await supabase
        .from('domain_audits')
        .select('*')
        .eq('domain', domain.toLowerCase().trim())
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        logger.error('Supabase error in getDomainAudit:', { error, domain });
        throw new DomainAuditError('Failed to fetch domain audit', 'FETCH_FAILED', error);
      }

      if (!data) {
        logger.info('No domain audit found', { domain });
        return null;
      }

      // Normalize timestamps before validation
      const normalizedData = {
        ...data,
        created_at: data.created_at ? normalizeTimestamp(data.created_at) : undefined,
        updated_at: data.updated_at ? normalizeTimestamp(data.updated_at) : undefined,
        metadata: {
          ...data.metadata,
          timestamp: data.metadata?.timestamp ? normalizeTimestamp(data.metadata.timestamp) : undefined
        }
      };

      const validation = validateDomainAudit(normalizedData);
      if (!validation.isValid) {
        logger.error('Validation failed for fetched domain audit', { 
          errors: validation.errors,
          domain
        });
        throw validation.errors[0];
      }

      logger.info('Successfully fetched domain audit', { 
        id: data.id,
        domain: data.domain,
        status: data.status,
        enrichment_status: data.enrichment_status
      });

      return sanitizeDomainAudit(normalizedData) as DomainAudit;
    } catch (error) {
      logger.error('Error in getDomainAudit:', { error, domain });
      throw error;
    }
  }

  async getLatestDomainAudit(): Promise<DomainAudit | null> {
    const fetchLatest = async (): Promise<DomainAudit | null> => {
      logger.info('Fetching latest domain audit...');

      const { data, error } = await supabase
        .from('domain_audits')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        logger.error('Supabase error in getLatestDomainAudit:', { error });
        throw new DomainAuditError('Failed to fetch latest domain audit', 'FETCH_FAILED', error);
      }

      if (!data) {
        logger.info('No domain audit data found');
        return null;
      }

      // Normalize timestamps before validation
      const normalizedData = {
        ...data,
        created_at: data.created_at ? normalizeTimestamp(data.created_at) : undefined,
        updated_at: data.updated_at ? normalizeTimestamp(data.updated_at) : undefined,
        metadata: {
          ...data.metadata,
          timestamp: data.metadata?.timestamp ? normalizeTimestamp(data.metadata.timestamp) : undefined
        }
      };

      const validation = validateDomainAudit(normalizedData);
      if (!validation.isValid) {
        logger.error('Validation failed for latest domain audit', { 
          errors: validation.errors 
        });
        throw validation.errors[0];
      }

      logger.info('Successfully fetched latest domain audit', {
        id: data.id,
        domain: data.domain,
        status: data.status,
        enrichment_status: data.enrichment_status
      });

      return sanitizeDomainAudit(normalizedData) as DomainAudit;
    };

    try {
      // Wrap the fetch operation with timeout and retry logic
      return await retryWithBackoff(
        () => withTimeout(
          fetchLatest(),
          this.config.timeout,
          'getLatestDomainAudit'
        )
      );
    } catch (error) {
      if (error instanceof Error && error.name === 'TimeoutError') {
        throw new TimeoutError(`Operation timed out after ${this.config.timeout}ms`);
      }
      throw error;
    }
  }

  // Configuration methods
  updateConfig(newConfig: Partial<DomainAuditServiceConfig>) {
    this.config = { ...this.config, ...newConfig };
    logger.info('Updated DomainAuditService configuration', { newConfig });
  }

  getConfig(): DomainAuditServiceConfig {
    return { ...this.config };
  }

  setPollInterval(interval: number) {
    this.pollInterval = interval;
    logger.info('Updated poll interval', { interval });
  }

  getPollInterval(): number {
    return this.pollInterval;
  }

  setDataFreshnessThreshold(days: number) {
    this.DATA_FRESHNESS_THRESHOLD = days * 24 * 60 * 60 * 1000;
    logger.info('Updated data freshness threshold', { days });
  }

  getDataFreshnessThreshold(): number {
    return this.DATA_FRESHNESS_THRESHOLD / (24 * 60 * 60 * 1000); // Convert back to days
  }
}

export const domainAuditServices = new DomainAuditService();
