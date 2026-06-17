-- Auto-delete OAuth users that are not manually registered.
-- This keeps auth.users clean when deleted/non-registered users try Google login.

CREATE OR REPLACE FUNCTION public.delete_unregistered_oauth_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Keep only accounts created via the manual registration flow.
  -- OAuth users usually have provider data in app_metadata.providers.
  IF COALESCE(NEW.raw_user_meta_data ->> 'registration_source', '') <> 'manual'
     AND EXISTS (
       SELECT 1
       FROM jsonb_array_elements_text(COALESCE(NEW.raw_app_meta_data -> 'providers', '[]'::jsonb)) p(provider)
       WHERE provider IN ('google', 'apple', 'azure', 'github')
     ) THEN
    -- Remove any accidental profile row if one exists.
    DELETE FROM public.profiles WHERE user_id = NEW.id;

    -- Delete auth user immediately after creation.
    DELETE FROM auth.users WHERE id = NEW.id;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_cleanup_oauth ON auth.users;

CREATE TRIGGER on_auth_user_cleanup_oauth
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.delete_unregistered_oauth_user();
