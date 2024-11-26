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
