-- Add update policy for domain_audits
create policy "Allow updates"
on public.domain_audits for update
to anon, authenticated
using (true)
with check (true);
