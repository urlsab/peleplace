
-- 1. Add UPDATE and DELETE policies on storage.objects for id-documents bucket
CREATE POLICY "Users can update their own ID documents"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'id-documents' AND (auth.uid())::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own ID documents"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'id-documents' AND (auth.uid())::text = (storage.foldername(name))[1]);

-- 2. Add explicit INSERT/DELETE policies on user_roles (admin only)
CREATE POLICY "Only admins can insert roles"
ON public.user_roles FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can delete roles"
ON public.user_roles FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));
