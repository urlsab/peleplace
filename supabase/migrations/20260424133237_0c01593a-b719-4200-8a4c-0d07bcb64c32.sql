-- 1. Extend bookings table
ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS responded_at timestamptz,
  ADD COLUMN IF NOT EXISTS auto_expire_at timestamptz NOT NULL DEFAULT (now() + interval '5 days');

-- 2. Backfill auto_expire_at for existing rows
UPDATE public.bookings
SET auto_expire_at = created_at + interval '5 days'
WHERE auto_expire_at IS NULL;

-- 3. host_decline_alerts table
CREATE TABLE IF NOT EXISTS public.host_decline_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  host_user_id uuid NOT NULL,
  month_start date NOT NULL,
  decline_count int NOT NULL DEFAULT 0,
  last_alerted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (host_user_id, month_start)
);

ALTER TABLE public.host_decline_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all decline alerts"
  ON public.host_decline_alerts
  FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Service role can manage decline alerts"
  ON public.host_decline_alerts
  FOR ALL
  TO public
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE TRIGGER update_host_decline_alerts_updated_at
  BEFORE UPDATE ON public.host_decline_alerts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 4. Trigger: when a booking transitions to not_available, increment decline counter
CREATE OR REPLACE FUNCTION public.track_host_decline()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_month date := date_trunc('month', now())::date;
BEGIN
  IF (TG_OP = 'UPDATE'
      AND NEW.status = 'not_available'
      AND OLD.status IS DISTINCT FROM 'not_available') THEN

    INSERT INTO public.host_decline_alerts (host_user_id, month_start, decline_count)
    VALUES (NEW.host_user_id, current_month, 1)
    ON CONFLICT (host_user_id, month_start)
    DO UPDATE SET
      decline_count = host_decline_alerts.decline_count + 1,
      updated_at = now();
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS bookings_track_decline ON public.bookings;
CREATE TRIGGER bookings_track_decline
  AFTER UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.track_host_decline();

-- 5. Trigger: set responded_at when host responds
CREATE OR REPLACE FUNCTION public.set_booking_responded_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF (TG_OP = 'UPDATE'
      AND NEW.status IN ('approved', 'not_available')
      AND OLD.status = 'pending'
      AND NEW.responded_at IS NULL) THEN
    NEW.responded_at := now();
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS bookings_set_responded_at ON public.bookings;
CREATE TRIGGER bookings_set_responded_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.set_booking_responded_at();

-- 6. SECURITY DEFINER function to get the other party's contact info — ONLY when approved
CREATE OR REPLACE FUNCTION public.get_booking_contact(_booking_id uuid)
RETURNS TABLE (
  full_name text,
  phone text,
  email text,
  user_id uuid
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
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

REVOKE ALL ON FUNCTION public.get_booking_contact(uuid) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.get_booking_contact(uuid) TO authenticated;

-- 7. Function to expire stale pending bookings
CREATE OR REPLACE FUNCTION public.expire_stale_bookings()
RETURNS int
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count int;
BEGIN
  WITH updated AS (
    UPDATE public.bookings
    SET status = 'expired',
        updated_at = now()
    WHERE status = 'pending'
      AND auto_expire_at < now()
    RETURNING id
  )
  SELECT count(*) INTO v_count FROM updated;
  RETURN v_count;
END;
$$;