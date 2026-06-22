-- Explicitly grant privileges on shabbat_offers to authenticated and anon roles.
-- This is needed because the default privileges migration (2000900000.sql) is
-- skipped by the Supabase CLI (invalid filename format), so new tables don't
-- automatically inherit those grants.

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.shabbat_offers TO authenticated;
GRANT SELECT ON TABLE public.shabbat_offers TO anon;
