-- Backfill profile fields (including phone) from auth metadata for users already created.

UPDATE public.profiles p
SET
  phone = COALESCE(NULLIF(p.phone, ''), NULLIF(u.raw_user_meta_data ->> 'phone', ''), p.phone),
  full_name = COALESCE(NULLIF(p.full_name, ''), NULLIF(u.raw_user_meta_data ->> 'full_name', ''), p.full_name),
  recommender_name = COALESCE(NULLIF(p.recommender_name, ''), NULLIF(u.raw_user_meta_data ->> 'recommender_name', ''), p.recommender_name),
  recommender_phone = COALESCE(NULLIF(p.recommender_phone, ''), NULLIF(u.raw_user_meta_data ->> 'recommender_phone', ''), p.recommender_phone),
  recommender_relationship = COALESCE(NULLIF(p.recommender_relationship, ''), NULLIF(u.raw_user_meta_data ->> 'recommender_relationship', ''), p.recommender_relationship),
  gender = COALESCE(p.gender, NULLIF(u.raw_user_meta_data ->> 'gender', '')),
  date_of_birth = COALESCE(p.date_of_birth, NULLIF(u.raw_user_meta_data ->> 'date_of_birth', '')::date),
  host_subtype = COALESCE(p.host_subtype, NULLIF(u.raw_user_meta_data ->> 'host_subtype', ''))
FROM auth.users u
WHERE p.user_id = u.id
  AND (
    p.phone = ''
    OR p.phone IS NULL
    OR p.full_name = ''
    OR p.recommender_name IS NULL
    OR p.recommender_phone IS NULL
    OR p.recommender_relationship IS NULL
    OR p.gender IS NULL
    OR p.date_of_birth IS NULL
    OR p.host_subtype IS NULL
  );