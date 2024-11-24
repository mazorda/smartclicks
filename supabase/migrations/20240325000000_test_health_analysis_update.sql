-- Test direct update of health analysis
create or replace function test_health_analysis_update()
returns void as $$
begin
    -- Update a test record
    update public.domain_audits
    set r1_health_score_analysis = 'Test analysis text'
    where domain = 'hypergrowthpartners.com'
    and r1_health_score_analysis is null;
    
    -- Log the result
    raise notice 'Updated rows: %', found;
end;
$$ language plpgsql;

-- Execute the function
select test_health_analysis_update();

-- Clean up
drop function if exists test_health_analysis_update();
