-- Prevent auto-profile creation for pure OAuth sign-ins.
-- Only users that completed manual registration flow should get a profile row automatically.

CREATE OR REPLACE FUNCTION public.handle_auth_user_created()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_type public.user_type;
BEGIN
  IF COALESCE(NEW.raw_user_meta_data ->> 'registration_source', '') <> 'manual' THEN
    RETURN NEW;
  END IF;

  v_user_type := CASE
    WHEN (NEW.raw_user_meta_data ->> 'user_type') = 'host' THEN 'host'::public.user_type
    ELSE 'single'::public.user_type
  END;

  INSERT INTO public.profiles (
    user_id,
    full_name,
    email,
    phone,
    user_type,
    host_subtype,
    date_of_birth,
    gender,
    recommender_name,
    recommender_phone,
    recommender_relationship,
    terms_accepted_at,
    registration_status
  )
  VALUES (
    NEW.id,
    COALESCE(NULLIF(NEW.raw_user_meta_data ->> 'full_name', ''), 'משתמש חדש'),
    COALESCE(NEW.email, NEW.raw_user_meta_data ->> 'email', ''),
    COALESCE(NULLIF(NEW.raw_user_meta_data ->> 'phone', ''), ''),
    v_user_type,
    NULLIF(NEW.raw_user_meta_data ->> 'host_subtype', ''),
    NULLIF(NEW.raw_user_meta_data ->> 'date_of_birth', '')::date,
    NULLIF(NEW.raw_user_meta_data ->> 'gender', ''),
    NULLIF(NEW.raw_user_meta_data ->> 'recommender_name', ''),
    NULLIF(NEW.raw_user_meta_data ->> 'recommender_phone', ''),
    NULLIF(NEW.raw_user_meta_data ->> 'recommender_relationship', ''),
    now(),
    'pending'::public.registration_status
  )
  ON CONFLICT (user_id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    email = EXCLUDED.email,
    phone = EXCLUDED.phone,
    user_type = EXCLUDED.user_type,
    host_subtype = EXCLUDED.host_subtype,
    date_of_birth = EXCLUDED.date_of_birth,
    gender = EXCLUDED.gender,
    recommender_name = EXCLUDED.recommender_name,
    recommender_phone = EXCLUDED.recommender_phone,
    recommender_relationship = EXCLUDED.recommender_relationship,
    terms_accepted_at = COALESCE(public.profiles.terms_accepted_at, EXCLUDED.terms_accepted_at);

  RETURN NEW;
END;
$$;
