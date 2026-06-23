-- Function to check if an email is registered in profiles
-- SECURITY DEFINER bypasses RLS so anon users can call it
CREATE OR REPLACE FUNCTION public.check_email_registered(p_email TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS(
    SELECT 1 FROM public.profiles WHERE lower(email) = lower(trim(p_email))
  );
$$;

GRANT EXECUTE ON FUNCTION public.check_email_registered(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION public.check_email_registered(TEXT) TO authenticated;
