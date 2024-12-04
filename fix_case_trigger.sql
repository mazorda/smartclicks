-- Update trigger function to match Clay's exact field names
CREATE OR REPLACE FUNCTION public.extract_clay_data()
RETURNS TRIGGER AS $$
BEGIN
  -- Only update if we have clay_data
  IF NEW.clay_data IS NOT NULL THEN
    -- Basic company info - exact field names from Clay
    NEW.company_name = NEW.clay_data->>'Company Name';
    NEW.linkedin_url = NEW.clay_data->>'Linkedin Url';
    NEW.country = NEW.clay_data->>'Country';
    NEW.city_locality = NEW.clay_data->>'City Locality';
    NEW.founded_year = (NEW.clay_data->>'Founded')::integer;
    NEW.company_description = NEW.clay_data->>'Description';
    NEW.specialties = NEW.clay_data->'Specialties';
    
    -- SEMRush data - using exact field names
    NEW.semrush_total_visits = (NEW.clay_data->>'Total Visits SEMRush')::integer;
    NEW.semrush_bounce_rate = (NEW.clay_data->>'Bounce Rate SEMRush')::numeric;
    NEW.semrush_paid_visits = (NEW.clay_data->>'Paid Visits SEMRush')::integer;
    NEW.semrush_organic_visits = (NEW.clay_data->>'Organic Search Visits SEMRush')::integer;
    NEW.semrush_direct_visits = (NEW.clay_data->>'Direct Visits SEMRush')::integer;
    NEW.semrush_social_visits = (NEW.clay_data->>'Social Visits SEMRush')::integer;
    NEW.semrush_mobile_traffic_share = (NEW.clay_data->>'Mobile Traffic Share SEMRush')::numeric;
    NEW.semrush_pages_per_visit = (NEW.clay_data->>'Average Pages Per Visit SEMRush')::numeric;
    
    -- Competitor data
    NEW.competitor_1_domain = NEW.clay_data->>'Competitor 1 Domain';
    NEW.competitor_1_monthly_gads_traffic = (NEW.clay_data->>'Competitor 1 Monthly GAds traffic')::integer;
    NEW.competitor_1_monthly_adwords_cost = (NEW.clay_data->>'Competitor 1 Monthly Adwords Cost in USD')::numeric;
    
    NEW.competitor_2_domain = NEW.clay_data->>'Competitor 2 Domain';
    NEW.competitor_2_monthly_gads_traffic = (NEW.clay_data->>'Competitor 2 Monthly GAds traffic')::integer;
    NEW.competitor_2_monthly_adwords_cost = (NEW.clay_data->>'Competitor 2 Monthly Adwords Cost in USD')::numeric;

    RAISE NOTICE 'Data extracted for domain: %, company: %', NEW.domain, NEW.company_name;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate the trigger
DROP TRIGGER IF EXISTS extract_clay_data_trigger ON public.domain_audits;
CREATE TRIGGER extract_clay_data_trigger
  BEFORE INSERT OR UPDATE OF clay_data
  ON public.domain_audits
  FOR EACH ROW
  EXECUTE FUNCTION public.extract_clay_data();

-- Test with an update
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
  semrush_total_visits,
  semrush_bounce_rate,
  competitor_1_domain;
