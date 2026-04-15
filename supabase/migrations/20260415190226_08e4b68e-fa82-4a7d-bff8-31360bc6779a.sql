-- Create profile-images storage bucket (public)
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-images', 'profile-images', true);

-- Storage policies for profile-images
CREATE POLICY "Profile images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'profile-images');

CREATE POLICY "Users can upload their own profile images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'profile-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own profile images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'profile-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own profile images"
ON storage.objects FOR DELETE
USING (bucket_id = 'profile-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Add image columns to single_profiles
ALTER TABLE public.single_profiles
ADD COLUMN IF NOT EXISTS profile_image_url text,
ADD COLUMN IF NOT EXISTS banner_image_url text;

-- Make recommender fields nullable with defaults (so registration can skip them)
ALTER TABLE public.profiles
ALTER COLUMN recommender_name SET DEFAULT '',
ALTER COLUMN recommender_name DROP NOT NULL;

ALTER TABLE public.profiles
ALTER COLUMN recommender_phone SET DEFAULT '',
ALTER COLUMN recommender_phone DROP NOT NULL;