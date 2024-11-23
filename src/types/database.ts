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