import { supabase } from '../lib/supabase';
import type { Database } from '../types/supabase';

type Lead = Database['public']['Tables']['leads']['Row'];
type NewLead = Database['public']['Tables']['leads']['Insert'];
type DomainAudit = Database['public']['Tables']['domain_audits']['Row'];
type NewDomainAudit = Database['public']['Tables']['domain_audits']['Insert'];

// Lead Services
export const leadServices = {
  async createLead(email: string, source: string = 'ebook'): Promise<Lead> {
    try {
      // First check if lead already exists
      const { data: existingLead, error: fetchError } = await supabase
        .from('leads')
        .select('id, email')
        .eq('email', email)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "not found"
        throw new Error(`Failed to check existing lead: ${fetchError.message}`);
      }

      if (existingLead) {
        // Update existing lead's metadata
        const { data, error: updateError } = await supabase
          .from('leads')
          .update({
            metadata: {
              acceptedTerms: true,
              downloadedEbook: true,
              lastInteraction: new Date().toISOString()
            }
          })
          .eq('id', existingLead.id)
          .select()
          .single();

        if (updateError) {
          throw new Error(`Failed to update existing lead: ${updateError.message}`);
        }

        return data;
      }

      // Create new lead
      const newLead: NewLead = {
        email,
        source,
        status: 'new',
        metadata: {
          acceptedTerms: true,
          downloadedEbook: true,
          timestamp: new Date().toISOString()
        }
      };

      const { data, error: insertError } = await supabase
        .from('leads')
        .insert([newLead])
        .select()
        .single();

      if (insertError) {
        if (insertError.code === '23505') { // Unique violation
          throw new Error('This email is already registered');
        }
        throw new Error(`Failed to create lead: ${insertError.message}`);
      }

      if (!data) {
        throw new Error('Failed to create lead: No data returned');
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        console.error('Database operation failed:', error.message);
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  },

  async getLeads(): Promise<Lead[]> {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to fetch leads:', error);
      throw new Error(`Failed to fetch leads: ${error.message}`);
    }

    return data;
  }
};

// Domain Audit Services
export const domainAuditServices = {
  async createDomainAudit(domain: string): Promise<DomainAudit> {
    try {
      const webhookUrl = `${process.env.VITE_API_URL}/webhooks/clay-enrichment`;
      
      const newAudit: NewDomainAudit = {
        domain,
        status: 'pending',
        enrichment_status: 'pending_enrichment',
        metadata: {
          source: 'homepage',
          timestamp: new Date().toISOString(),
          webhookUrl,
          enrichmentAttempts: 0,
          lastEnrichmentAttempt: null
        }
      };

      const { data, error } = await supabase
        .from('domain_audits')
        .insert([newAudit])
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to create domain audit: ${error.message}`);
      }

      if (!data) {
        throw new Error('Failed to create domain audit: No data returned');
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        console.error('Database operation failed:', error.message);
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  },

  async updateEnrichmentStatus(
    id: string, 
    status: 'pending_enrichment' | 'enrichment_started' | 'enrichment_complete' | 'enrichment_failed',
    clayData?: any
  ): Promise<DomainAudit> {
    try {
      const updates: Partial<DomainAudit> = {
        enrichment_status: status,
        metadata: {
          lastEnrichmentAttempt: new Date().toISOString()
        }
      };

      if (clayData) {
        updates.clay_data = clayData;
      }

      const { data, error } = await supabase
        .from('domain_audits')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to update enrichment status: ${error.message}`);
      }

      if (!data) {
        throw new Error('Failed to update enrichment status: No data returned');
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        console.error('Database operation failed:', error.message);
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }
};
