-- Fix security warnings: revoke direct REST-API execute access from trigger functions
-- and check_email_registered which should not be publicly callable.
--
-- handle_auth_user_created and delete_unregistered_oauth_user are trigger functions
-- and must never be called directly via /rest/v1/rpc.
-- Revoking EXECUTE does NOT affect trigger invocations (triggers run as the owner).
--
-- check_email_registered exposed registered emails to unauthenticated callers
-- (email enumeration). The client-side pre-check has been removed from Auth.tsx;
-- Supabase resetPasswordForEmail handles the case where the email is unknown silently.

REVOKE EXECUTE ON FUNCTION public.handle_auth_user_created() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.delete_unregistered_oauth_user() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.check_email_registered(TEXT) FROM anon, authenticated;
