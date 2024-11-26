-- Reset existing policies
DROP POLICY IF EXISTS "dev_anon_insert_policy" ON public.domain_audits;
DROP POLICY IF EXISTS "dev_anon_select_policy" ON public.domain_audits;
DROP POLICY IF EXISTS "dev_auth_all_policy" ON public.domain_audits;
DROP POLICY IF EXISTS "anon_insert_policy" ON public.domain_audits;
DROP POLICY IF EXISTS "anon_select_policy" ON public.domain_audits;
DROP POLICY IF EXISTS "anon_update_policy" ON public.domain_audits;
DROP POLICY IF EXISTS "auth_all_policy" ON public.domain_audits;

-- Ensure RLS is enabled
ALTER TABLE public.domain_audits ENABLE ROW LEVEL SECURITY;

-- Create simplified policies that allow:
-- 1. Anonymous users to submit new domains (no restrictions)
-- 2. Anonymous users to view audit results (no time restrictions)
-- 3. Anonymous users to update their records
-- 4. Authenticated users to have full access to their records

-- Allow anonymous users to submit new domains
CREATE POLICY "anon_submit_policy"
ON public.domain_audits
FOR INSERT
TO anon
WITH CHECK (true);

-- Allow anonymous users to view all audit results
CREATE POLICY "anon_view_policy"
ON public.domain_audits
FOR SELECT
TO anon
USING (true);

-- Allow anonymous users to update their records
CREATE POLICY "anon_update_policy"
ON public.domain_audits
FOR UPDATE
TO anon
USING (user_id IS NULL)
WITH CHECK (user_id IS NULL);

-- Allow authenticated users full access to their records
CREATE POLICY "auth_all_policy"
ON public.domain_audits
FOR ALL
TO authenticated
USING (user_id = auth.uid() OR user_id IS NULL)
WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.domain_audits TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.domain_audits TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
