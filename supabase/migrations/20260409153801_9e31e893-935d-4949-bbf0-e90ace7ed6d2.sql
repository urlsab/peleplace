
-- Create kashrut level enum
CREATE TYPE public.kashrut_level AS ENUM ('not_kosher', 'kosher', 'mehadrin', 'chalak_beit_yosef');

-- Add kashrut column to host_family_profiles
ALTER TABLE public.host_family_profiles
ADD COLUMN kashrut_level public.kashrut_level DEFAULT NULL;
