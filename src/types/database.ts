export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  company_id: string;
  created_at: string;
  last_login: string;
}

export interface Company {
  id: string;
  name: string;
  website: string;
  goals: string;
  challenges: string;
  tech_stack: string[];
  conversion_type: string;
  ad_spend: number;
  created_at: string;
}

export interface Campaign {
  id: string;
  account_id: string;
  date: string;
  impressions: number;
  clicks: number;
  cost: number;
  conversions: number;
  conversion_value: number;
  campaign_id: string;
  campaign_name: string;
  created_at: string;
}

export interface UserSettings {
  id: string;
  user_id: string;
  theme: 'light' | 'dark';
  notifications_enabled: boolean;
  created_at: string;
}

export interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  details: any;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
}

export interface Lead {
  id: string;
  email: string;
  source: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted';
  metadata: {
    acceptedTerms: boolean;
    downloadedEbook: boolean;
    [key: string]: any;
  };
  created_at: string;
}

export interface DomainAudit {
  id: string;
  domain: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  enrichment_status: 'pending' | 'processing' | 'completed' | 'failed';
  clay_data: any | null;
  metadata: {
    source?: string;
    timestamp?: string;
    lastAttempt?: string;
    retryCount?: number;
    lastError?: string | null;
    errorTimestamp?: string;
    [key: string]: any;
  };
  user_id?: string | null;
  r1_gads_health_score: number | null;
  r1_health_score_analysis: string | null;
  r1_landing_pages: any | null;
  r1_analysis: string | null;
  r1_bounce_rate: number | null;
  r1_traffic_rank: number | null;
  r1_avg_time_on_site: number | null;
  r1_total_visits: number | null;
  r1_paid_visits: number | null;
  r1_organic_visits: number | null;
  r1_company_size: string | null;
  r1_company_industry: string | null;
  r1_company_logo_url: string | null;
  r1_competitor_domain: string | null;
  r1_competitor_gads_cost: number | null;
  
  // Clay enrichment fields
  linkedin_url: string | null;
  company_name: string | null;
  country: string | null;
  city_locality: string | null;
  founded_year: number | null;
  company_description: string | null;
  specialties: string[] | null;
  linkedin_follower_count: number | null;

  // Competitor fields
  competitor_1_domain: string | null;
  competitor_1_monthly_gads_traffic: number | null;
  competitor_1_monthly_adwords_cost: number | null;
  competitor_2_domain: string | null;
  competitor_2_monthly_gads_traffic: number | null;
  competitor_2_monthly_adwords_cost: number | null;

  // SEMRush metrics
  semrush_total_visits: number | null;
  semrush_traffic_rank: number | null;
  semrush_bounce_rate: number | null;
  semrush_pages_per_visit: number | null;
  semrush_time_on_site: number | null;
  semrush_paid_visits: number | null;
  semrush_organic_visits: number | null;
  semrush_direct_visits: number | null;
  semrush_social_visits: number | null;
  semrush_mobile_traffic_share: number | null;
  semrush_mobile_bounce_rate: number | null;
  similarweb_visits: number | null;

  created_at: string;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      leads: {
        Row: Lead;
        Insert: Omit<Lead, 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Lead>;
      };
      domain_audits: {
        Row: DomainAudit;
        Insert: Omit<DomainAudit, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<DomainAudit>;
      };
    };
    Functions: {
      [key: string]: any;
    };
    Enums: {
      [key: string]: any;
    };
  };
}
