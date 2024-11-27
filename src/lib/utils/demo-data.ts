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
  r1_health_score_analysis: JSON.stringify({
    overall_score: 85,
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
  }),
  r1_gads_health_score: 82,
  r1_avg_time_on_site: 185, // seconds
  r1_total_visits: 125000,
  r1_paid_visits: 45000,
  r1_organic_visits: 80000,
  r1_bounce_rate: 32,
  r1_traffic_rank: 15420,
  r1_landing_pages: {
    '/products': 92,
    '/solutions': 88,
    '/pricing': 85,
    '/about': 78
  },
  clay_data: {
    company_size: '50-200',
    industry: 'Technology',
    founded_year: 2018,
    funding_stage: 'Series A'
  },
  r1_company_size: '50-200',
  r1_company_industry: 'Technology',
  r1_company_logo_url: null,
  r1_competitor_domain: null,
  r1_competitor_gads_cost: null,
  r1_analysis: null,
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
  return audit.status === 'processing' && !audit.r1_health_score_analysis;
};

// Helper to determine if a domain audit is for an existing company
export const isExistingCompany = (audit: DomainAudit | null): boolean => {
  if (!audit) return false;
  return audit.status === 'completed' && Boolean(audit.r1_health_score_analysis);
};
