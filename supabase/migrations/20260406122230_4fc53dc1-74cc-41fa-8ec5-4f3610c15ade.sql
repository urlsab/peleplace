
-- Bookings table: connects guests to hosts for specific dates
CREATE TABLE public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_user_id uuid NOT NULL,
  host_user_id uuid NOT NULL,
  host_type text NOT NULL CHECK (host_type IN ('family', 'work', 'volunteer')),
  event_date text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed', 'cancelled')),
  message text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Guests can see their own bookings
CREATE POLICY "Guests can view own bookings" ON public.bookings
  FOR SELECT TO authenticated USING (auth.uid() = guest_user_id);

-- Hosts can see bookings for them
CREATE POLICY "Hosts can view their bookings" ON public.bookings
  FOR SELECT TO authenticated USING (auth.uid() = host_user_id);

-- Authenticated users can create bookings as guest
CREATE POLICY "Users can create bookings" ON public.bookings
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = guest_user_id);

-- Hosts can update booking status
CREATE POLICY "Hosts can update bookings" ON public.bookings
  FOR UPDATE TO authenticated USING (auth.uid() = host_user_id);

-- Admins can do everything
CREATE POLICY "Admins can manage all bookings" ON public.bookings
  FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'));

-- Ratings table: category-based ratings after completed Shabbat
CREATE TABLE public.ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  reviewer_user_id uuid NOT NULL,
  reviewed_user_id uuid NOT NULL,
  hospitality_rating smallint NOT NULL CHECK (hospitality_rating BETWEEN 1 AND 5),
  food_rating smallint NOT NULL CHECK (food_rating BETWEEN 1 AND 5),
  atmosphere_rating smallint NOT NULL CHECK (atmosphere_rating BETWEEN 1 AND 5),
  comment text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (booking_id, reviewer_user_id)
);

ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can view ratings for approved profiles
CREATE POLICY "Authenticated users can view ratings" ON public.ratings
  FOR SELECT TO authenticated USING (true);

-- Users can create rating only for their own completed bookings
CREATE POLICY "Users can create ratings" ON public.ratings
  FOR INSERT TO authenticated WITH CHECK (
    auth.uid() = reviewer_user_id
    AND EXISTS (
      SELECT 1 FROM public.bookings
      WHERE bookings.id = booking_id
        AND bookings.status = 'completed'
        AND (bookings.guest_user_id = auth.uid() OR bookings.host_user_id = auth.uid())
    )
  );

-- Trigger for updated_at on bookings
CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
