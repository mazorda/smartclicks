-- Drop existing policies
drop policy if exists "anon_update_policy" on public.domain_audits;
drop policy if exists "anon_insert_policy" on public.domain_audits;
drop policy if exists "anon_select_policy" on public.domain_audits;

-- Create new policies
-- Select Policy (unchanged)
create policy "anon_select_policy" on public.domain_audits
for select to anon using (true);

-- Insert Policy with metadata validation
create policy "anon_insert_policy" on public.domain_audits
for insert to anon
with check (
    user_id is null
    and status = 'pending'
    and enrichment_status = 'pending'
    and metadata is not null
);

-- Update Policy with more permissive initial state handling
create policy "anon_update_policy" on public.domain_audits
for update to anon
using (
    user_id is null
    and (
        -- Allow initial pending to processing transition
        (enrichment_status = 'pending')
        or
        -- Allow processing to completed/failed transitions
        (enrichment_status = 'processing' and new.enrichment_status in ('completed', 'failed'))
    )
)
with check (
    user_id is null
    and (
        -- Allow status and metadata updates in pending state
        (enrichment_status = 'pending' and new.enrichment_status = 'processing')
        or
        -- Allow enrichment updates in processing state
        (enrichment_status = 'processing' and new.enrichment_status in ('completed', 'failed'))
    )
);

-- Update column permissions
revoke update on public.domain_audits from anon;
grant update (
    enrichment_status,
    status,
    metadata,
    updated_at,
    clay_data,
    r1_gads_health_score,
    r1_health_score_analysis,
    r1_landing_pages,
    r1_analysis,
    r1_bounce_rate,
    r1_traffic_rank,
    r1_avg_time_on_site,
    r1_total_visits,
    r1_paid_visits,
    r1_organic_visits,
    r1_company_size,
    r1_company_industry,
    r1_company_logo_url,
    r1_competitor_domain,
    r1_competitor_gads_cost
) on public.domain_audits to anon;

-- Add helpful comments
comment on policy "anon_update_policy" on public.domain_audits is 
'Allows anonymous users to update domain audits through the enrichment process';

comment on policy "anon_insert_policy" on public.domain_audits is 
'Allows anonymous users to create pending domain audits';

comment on policy "anon_select_policy" on public.domain_audits is 
'Allows anonymous users to view all domain audits';
