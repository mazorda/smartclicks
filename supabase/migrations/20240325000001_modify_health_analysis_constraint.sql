-- Remove the length constraint from r1_health_score_analysis
alter table public.domain_audits
drop constraint if exists domain_audits_r1_health_score_analysis_check;

-- Add a more generous length limit with correct syntax
alter table public.domain_audits
add constraint domain_audits_r1_health_score_analysis_check
check (length(r1_health_score_analysis) < 10000);

-- For UI update, use this exact syntax in the CHECK Constraint field:
-- length(r1_health_score_analysis) < 10000

-- Log the change
comment on column public.domain_audits.r1_health_score_analysis is 'Health analysis text with maximum length of 10000 characters';
