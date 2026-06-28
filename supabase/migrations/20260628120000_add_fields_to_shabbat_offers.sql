-- Add new fields to shabbat_offers table
ALTER TABLE public.shabbat_offers
  ADD COLUMN IF NOT EXISTS event_gender TEXT,
  ADD COLUMN IF NOT EXISTS meal_details TEXT,
  ADD COLUMN IF NOT EXISTS accommodation_options TEXT,
  ADD COLUMN IF NOT EXISTS capacity INTEGER,
  ADD COLUMN IF NOT EXISTS special_requirements TEXT;
