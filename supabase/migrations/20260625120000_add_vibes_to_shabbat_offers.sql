-- Add vibes column to shabbat_offers
ALTER TABLE public.shabbat_offers ADD COLUMN IF NOT EXISTS vibes text[] DEFAULT '{}';
