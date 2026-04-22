-- Add dietary preference enum
DO $$ BEGIN
  CREATE TYPE public.dietary_preference AS ENUM ('regular', 'vegetarian', 'vegan', 'gluten_free', 'other');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Add food preference fields to single_profiles
ALTER TABLE public.single_profiles
  ADD COLUMN IF NOT EXISTS kashrut_preference public.kashrut_level,
  ADD COLUMN IF NOT EXISTS dietary_preference public.dietary_preference;