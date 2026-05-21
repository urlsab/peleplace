
-- Add common matchmaking fields to all profile tables
DO $$
DECLARE
  t TEXT;
  host_tables TEXT[] := ARRAY[
    'host_family_profiles',
    'host_reservist_profiles',
    'host_singles_group_profiles',
    'host_organized_shabbat_profiles',
    'host_volunteer_profiles',
    'host_work_profiles'
  ];
BEGIN
  -- single_profiles already has profile_image_url + banner_image_url; add the rest
  ALTER TABLE public.single_profiles
    ADD COLUMN IF NOT EXISTS hobbies TEXT[],
    ADD COLUMN IF NOT EXISTS personality_tags TEXT[],
    ADD COLUMN IF NOT EXISTS shabbat_vibe TEXT[],
    ADD COLUMN IF NOT EXISTS languages TEXT[],
    ADD COLUMN IF NOT EXISTS profession TEXT,
    ADD COLUMN IF NOT EXISTS education TEXT;

  FOREACH t IN ARRAY host_tables LOOP
    EXECUTE format('
      ALTER TABLE public.%I
        ADD COLUMN IF NOT EXISTS profile_image_url TEXT,
        ADD COLUMN IF NOT EXISTS banner_image_url TEXT,
        ADD COLUMN IF NOT EXISTS hobbies TEXT[],
        ADD COLUMN IF NOT EXISTS personality_tags TEXT[],
        ADD COLUMN IF NOT EXISTS shabbat_vibe TEXT[],
        ADD COLUMN IF NOT EXISTS languages TEXT[],
        ADD COLUMN IF NOT EXISTS profession TEXT,
        ADD COLUMN IF NOT EXISTS education TEXT;
    ', t);
  END LOOP;
END $$;

-- Storage policies for profile-images bucket (public read already exists; ensure user folder writes)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='storage' AND tablename='objects' AND policyname='Users can upload to their profile-images folder') THEN
    CREATE POLICY "Users can upload to their profile-images folder"
    ON storage.objects FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'profile-images' AND auth.uid()::text = (storage.foldername(name))[1]);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='storage' AND tablename='objects' AND policyname='Users can update their profile-images') THEN
    CREATE POLICY "Users can update their profile-images"
    ON storage.objects FOR UPDATE TO authenticated
    USING (bucket_id = 'profile-images' AND auth.uid()::text = (storage.foldername(name))[1]);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='storage' AND tablename='objects' AND policyname='Public can view profile-images') THEN
    CREATE POLICY "Public can view profile-images"
    ON storage.objects FOR SELECT TO public
    USING (bucket_id = 'profile-images');
  END IF;
END $$;
