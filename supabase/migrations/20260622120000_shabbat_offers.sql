-- Shabbat hosting offers: any logged-in user can post an offer for a specific date
CREATE TABLE public.shabbat_offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  host_name TEXT NOT NULL,
  address TEXT NOT NULL,
  description TEXT,
  is_paid BOOLEAN NOT NULL DEFAULT false,
  kashrut_level TEXT NOT NULL DEFAULT 'kosher',
  date TEXT NOT NULL, -- YYYY-MM-DD
  is_full BOOLEAN NOT NULL DEFAULT false,
  contact_phone TEXT,
  contact_whatsapp TEXT,
  contact_email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.shabbat_offers ENABLE ROW LEVEL SECURITY;

-- Any authenticated user can view all offers
CREATE POLICY "Authenticated users can view all shabbat offers"
  ON public.shabbat_offers FOR SELECT TO authenticated
  USING (true);

-- Users can insert their own offers
CREATE POLICY "Users can insert their own shabbat offers"
  ON public.shabbat_offers FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own offers
CREATE POLICY "Users can update their own shabbat offers"
  ON public.shabbat_offers FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

-- Users can delete their own offers
CREATE POLICY "Users can delete their own shabbat offers"
  ON public.shabbat_offers FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- updated_at trigger
CREATE TRIGGER update_shabbat_offers_updated_at
  BEFORE UPDATE ON public.shabbat_offers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
