-- Add new host types to enum
ALTER TYPE public.host_type ADD VALUE IF NOT EXISTS 'singles_group';
ALTER TYPE public.host_type ADD VALUE IF NOT EXISTS 'organized_shabbat';

-- Singles group hosting profiles
CREATE TABLE public.host_singles_group_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  group_name TEXT NOT NULL,
  city TEXT,
  region public.region,
  religious_level public.religious_level,
  group_size INTEGER,
  guest_preference public.gender_preference,
  age_range_min INTEGER,
  age_range_max INTEGER,
  available_dates TEXT[],
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.host_singles_group_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view approved singles group profiles"
  ON public.host_singles_group_profiles FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = host_singles_group_profiles.user_id AND profiles.registration_status = 'approved'));

CREATE POLICY "Users can insert their own singles group profile"
  ON public.host_singles_group_profiles FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own singles group profile"
  ON public.host_singles_group_profiles FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE TRIGGER update_host_singles_group_profiles_updated_at
  BEFORE UPDATE ON public.host_singles_group_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Organized shabbat profiles
CREATE TABLE public.host_organized_shabbat_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  organization_name TEXT NOT NULL,
  shabbat_type TEXT,
  city TEXT,
  region public.region,
  religious_level public.religious_level,
  description TEXT,
  cost TEXT,
  registration_link TEXT,
  available_dates TEXT[],
  target_audience TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.host_organized_shabbat_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view approved organized shabbat profiles"
  ON public.host_organized_shabbat_profiles FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = host_organized_shabbat_profiles.user_id AND profiles.registration_status = 'approved'));

CREATE POLICY "Users can insert their own organized shabbat profile"
  ON public.host_organized_shabbat_profiles FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own organized shabbat profile"
  ON public.host_organized_shabbat_profiles FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE TRIGGER update_host_organized_shabbat_profiles_updated_at
  BEFORE UPDATE ON public.host_organized_shabbat_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();