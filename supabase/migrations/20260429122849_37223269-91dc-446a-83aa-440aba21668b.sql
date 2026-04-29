-- Create dedicated table for per-date availability with full details
CREATE TABLE public.host_availability_slots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  host_type TEXT NOT NULL, -- 'family' | 'work' | 'volunteer' | 'singles_group' | 'organized_shabbat'
  event_date TEXT NOT NULL, -- keeping text to match existing event_date format in bookings

  -- Shared fields
  capacity INTEGER, -- number of available spots
  guest_gender TEXT, -- 'men' | 'women' | 'mixed'
  notes TEXT,

  -- Hosting (family / singles_group / organized_shabbat)
  arrangement TEXT, -- 'mixed' | 'separated'

  -- Work / Volunteer requirements
  requires_experience BOOLEAN NOT NULL DEFAULT false,
  requires_driving_license BOOLEAN NOT NULL DEFAULT false,
  requires_weapon_license BOOLEAN NOT NULL DEFAULT false,
  requires_first_aid BOOLEAN NOT NULL DEFAULT false,
  requires_physical_fitness BOOLEAN NOT NULL DEFAULT false,
  extra_requirement TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, host_type, event_date)
);

CREATE INDEX idx_host_availability_user ON public.host_availability_slots(user_id, host_type);
CREATE INDEX idx_host_availability_date ON public.host_availability_slots(event_date);

ALTER TABLE public.host_availability_slots ENABLE ROW LEVEL SECURITY;

-- Anyone (authenticated) can view slots of approved hosts
CREATE POLICY "Anyone can view slots of approved hosts"
ON public.host_availability_slots
FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.user_id = host_availability_slots.user_id
      AND profiles.registration_status = 'approved'
  )
);

CREATE POLICY "Users can view their own slots"
ON public.host_availability_slots
FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own slots"
ON public.host_availability_slots
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own slots"
ON public.host_availability_slots
FOR UPDATE TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own slots"
ON public.host_availability_slots
FOR DELETE TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all slots"
ON public.host_availability_slots
FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- updated_at trigger
CREATE TRIGGER trg_host_availability_slots_updated_at
BEFORE UPDATE ON public.host_availability_slots
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();