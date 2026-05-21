CREATE TABLE public.host_reservist_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  about_us text,
  region public.region,
  city text,
  religious_level public.religious_level,
  kashrut_level public.kashrut_level,
  num_children integer,
  children_ages text,
  help_types text[],
  guest_preference public.gender_preference DEFAULT 'women',
  spouse_status text,
  special_requirements text,
  available_dates text[],
  always_available boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.host_reservist_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view approved reservist profiles"
ON public.host_reservist_profiles FOR SELECT
TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.profiles
  WHERE profiles.user_id = host_reservist_profiles.user_id
    AND profiles.registration_status = 'approved'
));

CREATE POLICY "Users can insert their own reservist profile"
ON public.host_reservist_profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reservist profile"
ON public.host_reservist_profiles FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE TRIGGER update_host_reservist_profiles_updated_at
BEFORE UPDATE ON public.host_reservist_profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();