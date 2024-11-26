-- Phase 1: Backup existing policies
create table if not exists policy_backup_20240329 as
select * from pg_policies where tablename = 'domain_audits';

-- Document current grants
create table if not exists grants_backup_20240329 as
select grantee, privilege_type 
from information_schema.role_table_grants 
where table_name = 'domain_audits';

-- Phase 2: Drop existing policies
drop policy if exists "anon_update_policy" on public.domain_audits;
drop policy if exists "anon_insert_policy" on public.domain_audits;
drop policy if exists "anon_select_policy" on public.domain_audits;

-- Create new policies
-- Select Policy (unchanged)
create policy "anon_select_policy" on public.domain_audits
for select to anon using (true);

-- Insert Policy (with user_id check)
create policy "anon_insert_policy" on public.domain_audits
for insert to anon
with check (user_id is null);

-- Update Policy (State-Based)
create policy "anon_update_policy" on public.domain_audits
for update to anon
using (
    user_id is null
    and (
        -- Allow status transitions
        (enrichment_status = 'pending' and new.enrichment_status = 'processing')
        or
        (enrichment_status = 'processing' and new.enrichment_status in ('completed', 'failed'))
    )
)
with check (
    user_id is null
    and (
        -- Validate field updates based on state
        case 
            when enrichment_status = 'pending' then
                -- Only allow status updates for pending->processing
                coalesce(new.clay_data = clay_data, true)
                and coalesce(new.r1_gads_health_score = r1_gads_health_score, true)
                and coalesce(new.r1_health_score_analysis = r1_health_score_analysis, true)
            when enrichment_status = 'processing' then
                -- Allow enrichment data updates for processing->completed/failed
                true
            else
                false
        end
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
    r1_analysis
) on public.domain_audits to anon;

-- Create monitoring function
create or replace function public.monitor_domain_audit_transitions()
returns trigger as $$
begin
    -- Log state transition in metadata
    new.metadata = jsonb_set(
        coalesce(new.metadata, '{}'::jsonb),
        '{stateTransitions}',
        coalesce(old.metadata->'stateTransitions', '[]'::jsonb) || 
        jsonb_build_object(
            'from', old.enrichment_status,
            'to', new.enrichment_status,
            'timestamp', extract(epoch from now())
        )::jsonb
    );
    
    -- Log errors if transition to failed state
    if new.enrichment_status = 'failed' then
        new.metadata = jsonb_set(
            new.metadata,
            '{lastError}',
            to_jsonb(coalesce(new.metadata->>'errorMessage', 'Unknown error'))
        );
        new.metadata = jsonb_set(
            new.metadata,
            '{errorTimestamp}',
            to_jsonb(extract(epoch from now()))
        );
    end if;
    
    return new;
end;
$$ language plpgsql;

-- Create trigger for monitoring
drop trigger if exists monitor_state_transitions on public.domain_audits;
create trigger monitor_state_transitions
    before update of enrichment_status on public.domain_audits
    for each row
    execute function public.monitor_domain_audit_transitions();

-- Add helpful comments
comment on policy "anon_update_policy" on public.domain_audits is 
'Allows anonymous users to update domain audits based on state transitions';

comment on policy "anon_insert_policy" on public.domain_audits is 
'Allows anonymous users to create domain audits without user_id';

comment on policy "anon_select_policy" on public.domain_audits is 
'Allows anonymous users to view all domain audits';

comment on function public.monitor_domain_audit_transitions() is 
'Monitors and logs domain audit state transitions in metadata';

-- Create verification view
create or replace view domain_audit_state_summary as
select 
    enrichment_status,
    count(*) as count,
    max(updated_at) as latest_update
from public.domain_audits
group by enrichment_status;

comment on view domain_audit_state_summary is 
'Provides summary of domain audit states for monitoring';
