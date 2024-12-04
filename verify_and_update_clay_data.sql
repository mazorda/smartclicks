-- First verify the trigger exists
SELECT tgname, tgtype, proname 
FROM pg_trigger t 
JOIN pg_proc p ON t.tgfoid = p.oid 
WHERE tgrelid = 'public.domain_audits'::regclass;

-- Then force an update on the record to trigger the extraction
UPDATE public.domain_audits 
SET clay_data = clay_data 
WHERE domain = 'skyscanner.com'
RETURNING 
  domain,
  company_name,
  country,
  city_locality,
  founded_year,
  specialties,
  linkedin_url,
  competitor_1_domain,
  competitor_1_monthly_gads_traffic,
  competitor_1_monthly_adwords_cost;

-- Check if we need to recreate the trigger
DO $$ 
BEGIN
  -- Drop and recreate if needed
  DROP TRIGGER IF EXISTS extract_clay_data_trigger ON public.domain_audits;
  
  CREATE TRIGGER extract_clay_data_trigger
    BEFORE INSERT OR UPDATE OF clay_data
    ON public.domain_audits
    FOR EACH ROW
    EXECUTE FUNCTION public.extract_clay_data();
    
  RAISE NOTICE 'Trigger recreated successfully';
END $$;

-- Try the update again
UPDATE public.domain_audits 
SET clay_data = clay_data 
WHERE domain = 'skyscanner.com'
RETURNING 
  domain,
  company_name,
  country,
  city_locality,
  founded_year,
  specialties,
  linkedin_url,
  competitor_1_domain,
  competitor_1_monthly_gads_traffic,
  competitor_1_monthly_adwords_cost;
