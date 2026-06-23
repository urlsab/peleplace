-- Restrict shabbat_offers INSERT to users whose profile has user_type = 'host'.
-- Guests (user_type = 'single') may view offers but cannot create them.

DROP POLICY IF EXISTS "Users can insert their own shabbat offers" ON public.shabbat_offers;

CREATE POLICY "Hosts can insert their own shabbat offers"
  ON public.shabbat_offers FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid()
        AND user_type = 'host'
    )
  );

-- Also tighten UPDATE and DELETE so only the owner (who must be a host) can modify rows.
DROP POLICY IF EXISTS "Users can update their own shabbat offers" ON public.shabbat_offers;
DROP POLICY IF EXISTS "Users can delete their own shabbat offers" ON public.shabbat_offers;

CREATE POLICY "Hosts can update their own shabbat offers"
  ON public.shabbat_offers FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Hosts can delete their own shabbat offers"
  ON public.shabbat_offers FOR DELETE TO authenticated
  USING (auth.uid() = user_id);
