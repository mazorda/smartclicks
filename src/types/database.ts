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
