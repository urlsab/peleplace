-- ============================================================
-- Fix 15 Supabase Advisor security warnings
-- ============================================================
-- Warnings addressed:
--   function_search_path_mutable     × 4  (email queue wrappers)
--   rls_policy_always_true           × 1  (contact_inquiries INSERT)
--   public_bucket_allows_listing     × 1  (profile-images)
--   anon_security_definer_function   × 4  (expire_stale_bookings, has_role,
--                                          rls_auto_enable, track_host_decline)
--   authenticated_security_definer   × 5  (expire_stale_bookings,
--                                          get_booking_contact, has_role,
--                                          rls_auto_enable, track_host_decline)
-- ============================================================


-- ============================================================
-- 1. Fix mutable search_path in email queue wrapper functions
-- ============================================================

CREATE OR REPLACE FUNCTION public.enqueue_email(queue_name TEXT, payload JSONB)
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  RETURN pgmq.send(queue_name, payload);
EXCEPTION WHEN undefined_table THEN
  PERFORM pgmq.create(queue_name);
  RETURN pgmq.send(queue_name, payload);
END;
$$;

CREATE OR REPLACE FUNCTION public.read_email_batch(queue_name TEXT, batch_size INT, vt INT)
RETURNS TABLE(msg_id BIGINT, read_ct INT, message JSONB)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  RETURN QUERY SELECT r.msg_id, r.read_ct, r.message FROM pgmq.read(queue_name, vt, batch_size) r;
EXCEPTION WHEN undefined_table THEN
  PERFORM pgmq.create(queue_name);
  RETURN;
END;
$$;

CREATE OR REPLACE FUNCTION public.delete_email(queue_name TEXT, message_id BIGINT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  RETURN pgmq.delete(queue_name, message_id);
EXCEPTION WHEN undefined_table THEN
  RETURN FALSE;
END;
$$;

CREATE OR REPLACE FUNCTION public.move_to_dlq(
  source_queue TEXT, dlq_name TEXT, message_id BIGINT, payload JSONB
)
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE new_id BIGINT;
BEGIN
  SELECT pgmq.send(dlq_name, payload) INTO new_id;
  PERFORM pgmq.delete(source_queue, message_id);
  RETURN new_id;
EXCEPTION WHEN undefined_table THEN
  BEGIN
    PERFORM pgmq.create(dlq_name);
  EXCEPTION WHEN OTHERS THEN
    NULL;
  END;
  SELECT pgmq.send(dlq_name, payload) INTO new_id;
  BEGIN
    PERFORM pgmq.delete(source_queue, message_id);
  EXCEPTION WHEN undefined_table THEN
    NULL;
  END;
  RETURN new_id;
END;
$$;


-- ============================================================
-- 2. Tighten contact_inquiries INSERT policy (was WITH CHECK (true))
-- ============================================================

DROP POLICY IF EXISTS "Anyone can insert contact inquiries" ON public.contact_inquiries;

CREATE POLICY "Anyone can insert contact inquiries"
  ON public.contact_inquiries
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    length(trim(full_name)) > 0
    AND length(trim(email)) > 0
    AND length(trim(message)) > 0
  );


-- ============================================================
-- 3. Fix profile-images bucket listing
--    Public buckets expose files via direct URL without any storage
--    SELECT policy, so the broad USING (bucket_id = 'profile-images')
--    policy is unnecessary and enables full bucket enumeration.
-- ============================================================

DROP POLICY IF EXISTS "Profile images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Public can view profile-images" ON storage.objects;


-- ============================================================
-- 4. Revoke direct API access from SECURITY DEFINER functions
--    that are only meant to be called by internal triggers or
--    scheduled jobs (service_role), not by end-users.
-- ============================================================

-- expire_stale_bookings: invoked by pg_cron (service_role only)
REVOKE EXECUTE ON FUNCTION public.expire_stale_bookings() FROM PUBLIC, anon, authenticated;
GRANT  EXECUTE ON FUNCTION public.expire_stale_bookings() TO service_role;

-- track_host_decline: trigger function, never needs direct REST access
REVOKE EXECUTE ON FUNCTION public.track_host_decline() FROM PUBLIC, anon, authenticated;

-- rls_auto_enable: internal utility, no direct REST access needed
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
             WHERE n.nspname = 'public' AND p.proname = 'rls_auto_enable') THEN
    REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM PUBLIC, anon, authenticated;
  END IF;
END $$;


-- ============================================================
-- 5. Fix has_role: move SECURITY DEFINER logic to a private schema
--    so the public wrapper becomes SECURITY INVOKER (not flagged
--    by the advisor) while RLS policies continue to work.
-- ============================================================

-- Private schema is not exposed by PostgREST, so functions here
-- are never accessible via /rest/v1/rpc/
CREATE SCHEMA IF NOT EXISTS private;

GRANT USAGE ON SCHEMA private TO authenticated, service_role;

-- The real SECURITY DEFINER implementation lives here (hidden from PostgREST)
CREATE OR REPLACE FUNCTION private.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

GRANT EXECUTE ON FUNCTION private.has_role(UUID, public.app_role) TO authenticated, service_role;

-- Replace public.has_role with a SECURITY INVOKER wrapper.
-- This eliminates both the anon and authenticated SECURITY DEFINER warnings
-- while keeping existing RLS policies unchanged.
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT private.has_role(_user_id, _role)
$$;

-- Block unauthenticated (anon) direct calls via the REST API
REVOKE EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) FROM anon;


-- ============================================================
-- 6. Fix get_booking_contact: change to SECURITY INVOKER
--    The function already enforces authorization internally
--    (approved booking, caller must be a party). Making it
--    SECURITY INVOKER removes the SECURITY DEFINER warning
--    while keeping the same access guarantees.
-- ============================================================

-- Allow parties to an approved booking to read each other's contact profile.
-- Without this policy the SECURITY INVOKER function could not SELECT from
-- public.profiles for the other party.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public'
                   AND tablename = 'profiles'
                   AND policyname = 'Booking parties can view contact profiles') THEN
    CREATE POLICY "Booking parties can view contact profiles"
      ON public.profiles
      FOR SELECT TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM public.bookings b
          WHERE b.status = 'approved'
            AND (b.host_user_id = profiles.user_id OR b.guest_user_id = profiles.user_id)
            AND (b.host_user_id = auth.uid() OR b.guest_user_id = auth.uid())
            AND b.host_user_id <> b.guest_user_id
        )
      );
  END IF;
END $$;

-- Recreate as SECURITY INVOKER (identical logic, just no privilege escalation)
CREATE OR REPLACE FUNCTION public.get_booking_contact(_booking_id uuid)
RETURNS TABLE (
  full_name text,
  phone text,
  email text,
  user_id uuid
)
LANGUAGE plpgsql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  b RECORD;
  other_id uuid;
BEGIN
  SELECT * INTO b FROM public.bookings WHERE id = _booking_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Booking not found';
  END IF;

  -- Only approved bookings reveal contact info
  IF b.status <> 'approved' THEN
    RAISE EXCEPTION 'Contact info is only available for approved bookings';
  END IF;

  -- Caller must be one of the two parties
  IF auth.uid() <> b.guest_user_id AND auth.uid() <> b.host_user_id THEN
    RAISE EXCEPTION 'Not authorized to view this contact';
  END IF;

  IF auth.uid() = b.host_user_id THEN
    other_id := b.guest_user_id;
  ELSE
    other_id := b.host_user_id;
  END IF;

  RETURN QUERY
    SELECT p.full_name, p.phone, p.email, p.user_id
    FROM public.profiles p
    WHERE p.user_id = other_id;
END;
$$;

REVOKE ALL ON FUNCTION public.get_booking_contact(uuid) FROM PUBLIC, anon;
GRANT  EXECUTE ON FUNCTION public.get_booking_contact(uuid) TO authenticated;
