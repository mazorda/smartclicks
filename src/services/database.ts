import { supabase } from '../lib/supabase';
import type { Database } from '../types/database';

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
          timestamp: new Date().toISOString()
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
      console.error('Failed to create lead:', error);
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
  async createDomainAudit(domain: string): Promise<DomainAudit> {
    try {
      // Create initial audit record
      const newAudit = {
        domain,
        status: 'pending',
        enrichment_status: 'pending',
        metadata: {
          source: 'homepage',
          timestamp: new Date().toISOString()
        }
      };

      const { data, error } = await supabase
        .from('domain_audits')
        .insert([newAudit])
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        if (error.code === '42501') {
          throw new Error('Permission denied. Please try again later.');
        }
        throw error;
      }

      if (!data) {
        throw new Error('No data returned from insert');
      }

      return data;
    } catch (error) {
      console.error('Error in createDomainAudit:', error);
      throw error;
    }
  }

  async getDomainAudit(domain: string): Promise<DomainAudit | null> {
    try {
      const { data, error } = await supabase
        .from('domain_audits')
        .select('*')
        .eq('domain', domain)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in getDomainAudit:', error);
      throw error;
    }
  }
}

export const domainAuditServices = new DomainAuditService();
