-- Test Case 1: Create new audit
insert into public.domain_audits (domain, status, enrichment_status)
values ('test-domain.com', 'pending', 'pending')
returning id, domain, status, enrichment_status;

-- Test Case 2: Update to processing
update public.domain_audits
set enrichment_status = 'processing',
    metadata = jsonb_build_object('processingStarted', true)
where domain = 'test-domain.com'
returning domain, enrichment_status, metadata;

-- Test Case 3: Complete enrichment
update public.domain_audits
set enrichment_status = 'completed',
    status = 'completed',
    r1_gads_health_score = 85,
    r1_health_score_analysis = 'Good performance overall'
where domain = 'test-domain.com'
returning domain, enrichment_status, status, r1_gads_health_score;

-- Test Case 4: Verify state transitions
select domain, 
       enrichment_status, 
       status, 
       metadata->'stateTransitions' as transitions,
       updated_at
from domain_audits
where domain = 'test-domain.com'
order by updated_at desc;

-- Test Case 5: Verify policy configuration
select tablename, policyname, permissive, roles, cmd, qual, with_check 
from pg_policies 
where tablename = 'domain_audits'
order by policyname;

-- Test Case 6: Verify column permissions
select grantee, table_schema, table_name, privilege_type, column_name
from information_schema.column_privileges 
where table_name = 'domain_audits'
  and grantee = 'anon'
order by column_name, privilege_type;

-- Test Case 7: View state summary
select * from domain_audit_state_summary
order by count desc;

-- Test Case 8: Verify invalid transitions are blocked
-- Should fail:
update public.domain_audits
set enrichment_status = 'completed'
where domain = 'test-domain.com'
  and enrichment_status = 'pending';

-- Test Case 9: Verify data protection
-- Should fail:
update public.domain_audits
set clay_data = '{"test": "data"}'
where domain = 'test-domain.com'
  and enrichment_status = 'pending';

-- Test Case 10: Verify authenticated user access
-- Switch to authenticated role
set role authenticated;
insert into public.domain_audits (domain, status, enrichment_status, user_id)
values ('auth-test.com', 'pending', 'pending', auth.uid())
returning id, domain, status, user_id;

-- Reset role
reset role;
