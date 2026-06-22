-- Add 'both' user_type for users who want to both host and be hosted
ALTER TYPE public.user_type ADD VALUE IF NOT EXISTS 'both';
