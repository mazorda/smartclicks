import type { DomainAudit } from '../../types/database';

export const DEMO_AUDIT_DATA: DomainAudit = {
  id: 'demo-audit',
  domain: 'example.com',
  status: 'completed',
  enrichment_status: 'completed',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  metadata: {
    company_name: 'Demo Company Inc.',
    industry: 'Technology',
    employee_count: '50-200',
    location: 'San Francisco, CA'
  },
  clay_data: {
    company_size: '50-200',
    industry: 'Technology',
    founded_year: 2018,
    funding_stage: 'Series A',
    company_description: 'Leading technology solutions provider specializing in digital transformation.',
    recommendations: [
      'Optimize mobile experience',
      'Improve page load times',
      'Enhance SEO meta descriptions'
    ],
    strengths: [
      'Strong brand presence',
      'Good content strategy',
      'Effective call-to-actions'
    ]
  },
  // SEMRush metrics
  semrush_time_on_site: 185,
  semrush_total_visits: 125000,
  semrush_paid_visits: 45000,
  semrush_organic_visits: 80000,
  semrush_bounce_rate: 32,
  semrush_traffic_rank: 15420,
  semrush_pages_per_visit: 4.2,
  semrush_direct_visits: 25000,
  semrush_social_visits: 15000,
  semrush_mobile_traffic_share: 65,
  semrush_mobile_bounce_rate: 35,
  similarweb_visits: 130000,

  // Clay enrichment fields
  linkedin_url: 'https://linkedin.com/company/demo-company',
  company_name: 'Demo Company Inc.',
  country: 'United States',
  city_locality: 'San Francisco',
  founded_year: 2018,
  company_description: 'Leading technology solutions provider',
  specialties: ['Digital Transformation', 'Cloud Solutions', 'AI/ML'],
  linkedin_follower_count: 5000,

  // Competitor fields
  competitor_1_domain: 'competitor1.com',
  competitor_1_monthly_gads_traffic: 40000,
  competitor_1_monthly_adwords_cost: 25000,
  competitor_2_domain: 'competitor2.com',
  competitor_2_monthly_gads_traffic: 35000,
  competitor_2_monthly_adwords_cost: 20000,

  user_id: null
};

export const NEW_COMPANY_DATA: Partial<DomainAudit> = {
  status: 'processing',
  enrichment_status: 'pending',
  metadata: {
    company_name: 'New Analysis',
    industry: 'Pending',
  }
};

// Helper to determine if a domain audit represents a new company
export const isNewCompany = (audit: DomainAudit | null): boolean => {
  if (!audit) return false;
  return audit.status === 'processing' && !audit.clay_data;
};

// Helper to determine if a domain audit is for an existing company
export const isExistingCompany = (audit: DomainAudit | null): boolean => {
  if (!audit) return false;
  return audit.status === 'completed' && Boolean(audit.clay_data);
};
