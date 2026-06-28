-- The previous migration revoked from anon/authenticated individually, but the default
-- PUBLIC grant was still in place (PostgreSQL grants EXECUTE to PUBLIC by default).
-- This migration revokes from PUBLIC, which covers all roles including anon and authenticated.

REVOKE ALL ON FUNCTION public.handle_auth_user_created() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.delete_unregistered_oauth_user() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.check_email_registered(TEXT) FROM PUBLIC;
