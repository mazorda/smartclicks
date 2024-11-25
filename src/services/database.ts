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

  constructor(config: Partial<DomainAuditServiceConfig> = {}) {
    this.config = { ...DEFAULT_SERVICE_CONFIG, ...config };
  }

  async createDomainAudit(domain: string): Promise<DomainAudit> {
    try {
      logger.info('Creating domain audit', { domain });

      // Check for existing audit
      const existingAudit = await this.getDomainAudit(domain);
      if (existingAudit && existingAudit.enrichment_status === 'completed') {
        logger.info('Using existing completed audit', { domain });
        return existingAudit;
      }

      const newAudit: NewDomainAudit = {
        domain: domain.toLowerCase().trim(),
        status: 'pending',
        enrichment_status: 'pending',
        metadata: {
          source: 'homepage',
          timestamp: generateTimestamp(),
          retryCount: 0,
          lastError: null
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
        logger.error('Supabase error in createDomainAudit:', { error });
        if (error.code === '42501') {
          throw new DomainAuditError('Permission denied. Please try again later.', 'PERMISSION_DENIED', error);
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
          errors: validation.errors 
        });
        throw validation.errors[0];
      }

      logger.info('Successfully created domain audit', { 
        id: data.id,
        domain: data.domain 
      });

      return normalizedData;
    } catch (error) {
      logger.error('Error in createDomainAudit:', { error });
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
        logger.error('Failed to update enrichment status:', { updateError });
        throw updateError;
      }
    } catch (err) {
      logger.error('Error updating enrichment status:', { err });
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
        logger.error('Supabase error in getDomainAudit:', { error });
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
          errors: validation.errors 
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
      logger.error('Error in getDomainAudit:', { error });
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
}

export const domainAuditServices = new DomainAuditService();
