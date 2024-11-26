-- Drop existing policies
drop policy if exists "anon_update_policy" on public.domain_audits;

-- Create simple update policy for anonymous users
create policy "anon_update_policy" on public.domain_audits
for update to anon
using (true)
with check (true);

-- Add helpful comment
comment on policy "anon_update_policy" on public.domain_audits is 
'Allows anonymous users to update domain audits';

-- Grant necessary permissions
grant usage on schema public to anon;
grant all on public.domain_audits to anon;
grant usage, select on all sequences in schema public to anon;
