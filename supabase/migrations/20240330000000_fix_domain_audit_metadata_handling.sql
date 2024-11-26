-- Drop existing policies
drop policy if exists "anon_update_policy" on public.domain_audits;
drop policy if exists "anon_insert_policy" on public.domain_audits;
drop policy if exists "anon_select_policy" on public.domain_audits;

-- Create new policies with more permissive metadata handling
create policy "anon_select_policy" on public.domain_audits
for select to anon using (true);

create policy "anon_insert_policy" on public.domain_audits
for insert to anon
with check (
    user_id is null
    and status = 'pending'
    and enrichment_status = 'pending'
);

create policy "anon_update_policy" on public.domain_audits
for update to anon
using (
    user_id is null
    and (
        -- Allow transitions from pending
        (enrichment_status = 'pending')
        or
        -- Allow transitions from processing
        (enrichment_status = 'processing')
    )
)
with check (
    user_id is null
    and (
        -- Allow pending to processing transition
        (enrichment_status = 'pending' and new.enrichment_status = 'processing')
        or
        -- Allow processing to completed/failed transitions
        (enrichment_status = 'processing' and new.enrichment_status in ('completed', 'failed'))
        or
        -- Allow metadata updates in any state
        (enrichment_status = new.enrichment_status and new.metadata is not null)
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
'Allows anonymous users to update domain audits through the enrichment process with metadata updates';

comment on policy "anon_insert_policy" on public.domain_audits is 
'Allows anonymous users to create pending domain audits without strict metadata requirements';

comment on policy "anon_select_policy" on public.domain_audits is 
'Allows anonymous users to view all domain audits';
