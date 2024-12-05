# SmartClicks.ai - Website Analysis & Optimization Platform

Private repository for SmartClicks platform - a comprehensive website analysis and optimization tool that helps businesses improve their online presence.

## Tech Stack

- Frontend: React + TypeScript
- Styling: Tailwind CSS
- Backend: Supabase
- Build Tool: Vite
- Database: PostgreSQL (via Supabase)
- API: Supabase Edge Functions (Deno)

## Project Structure

```
src/
├── components/          # React components
│   ├── auth/           # Authentication components
│   ├── dashboard/      # Dashboard views
│   ├── common/         # Shared components
│   └── onboarding/     # Onboarding flow
├── context/            # React context providers
├── services/           # API and database services
├── hooks/              # Custom React hooks
├── types/              # TypeScript definitions
└── lib/               # Utility functions
```

## Domain Audit Schema

The domain audit system uses the following key metrics:

### SEMRush Metrics
- semrush_total_visits: Total website visits
- semrush_traffic_rank: Global traffic ranking
- semrush_bounce_rate: Site bounce rate
- semrush_time_on_site: Average time on site
- semrush_paid_visits: Paid traffic visits
- semrush_organic_visits: Organic traffic visits
- semrush_direct_visits: Direct traffic visits
- semrush_social_visits: Social media visits
- semrush_mobile_traffic_share: Mobile traffic percentage
- semrush_mobile_bounce_rate: Mobile bounce rate

### Clay Integration Data
- linkedin_url: Company LinkedIn URL
- company_name: Company name
- country: Company location
- city_locality: City/locality
- founded_year: Year founded
- company_description: Company description
- specialties: Company specialties
- linkedin_follower_count: LinkedIn followers

### Competitor Analysis
- competitor_1_domain: Primary competitor domain
- competitor_1_monthly_gads_traffic: Competitor's monthly Google Ads traffic
- competitor_1_monthly_adwords_cost: Competitor's monthly ad spend
- competitor_2_domain: Secondary competitor domain
- competitor_2_monthly_gads_traffic: Competitor's monthly Google Ads traffic
- competitor_2_monthly_adwords_cost: Competitor's monthly ad spend

## Integration Points

### Clay Webhook
The Clay integration webhook expects the following:
1. Domain information in the request body
2. Enrichment data mapped to the schema fields above
3. Additional data stored in clay_data JSON field

### Status Flow
Domain audits follow this status progression:
1. pending -> Initial state
2. processing -> Data collection in progress
3. completed -> All data collected
4. failed -> Error in collection

Each audit has both a main status and enrichment_status to track the core audit and data enrichment separately.

---

© SmartClicks - All Rights Reserved
