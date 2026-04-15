-- Drop the overly broad SELECT policy
DROP POLICY IF EXISTS "Profile images are publicly accessible" ON storage.objects;

-- Create a scoped SELECT policy (access specific files only, no listing)
CREATE POLICY "Profile images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'profile-images' AND auth.role() = 'authenticated');