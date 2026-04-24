-- Add always_available flag to host profile tables, indicating the host is open to hosting on any date (no specific dates required).
ALTER TABLE public.host_family_profiles ADD COLUMN IF NOT EXISTS always_available boolean NOT NULL DEFAULT false;
ALTER TABLE public.host_work_profiles ADD COLUMN IF NOT EXISTS always_available boolean NOT NULL DEFAULT false;
ALTER TABLE public.host_singles_group_profiles ADD COLUMN IF NOT EXISTS always_available boolean NOT NULL DEFAULT false;
ALTER TABLE public.host_organized_shabbat_profiles ADD COLUMN IF NOT EXISTS always_available boolean NOT NULL DEFAULT false;