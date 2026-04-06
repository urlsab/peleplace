
-- Enum for user type
CREATE TYPE public.user_type AS ENUM ('single', 'host');

-- Enum for host type
CREATE TYPE public.host_type AS ENUM ('family', 'work', 'volunteer');

-- Enum for registration status
CREATE TYPE public.registration_status AS ENUM ('pending', 'approved', 'rejected');

-- Enum for religious level
CREATE TYPE public.religious_level AS ENUM ('secular', 'traditional', 'religious', 'ultra_orthodox', 'other');

-- Enum for gender preference
CREATE TYPE public.gender_preference AS ENUM ('men', 'women', 'mixed');

-- Enum for region
CREATE TYPE public.region AS ENUM ('north', 'haifa', 'sharon', 'center', 'tel_aviv', 'jerusalem', 'shfela', 'south', 'judea_samaria');

-- Enum for app_role (for admin)
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- User roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function for role check
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  user_type user_type NOT NULL,
  registration_status registration_status NOT NULL DEFAULT 'pending',
  recommender_name TEXT NOT NULL,
  recommender_phone TEXT NOT NULL,
  id_document_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Single profiles
CREATE TABLE public.single_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  age INTEGER,
  gender gender_preference,
  religious_level religious_level,
  region region,
  city TEXT,
  about_me TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.single_profiles ENABLE ROW LEVEL SECURITY;

-- Host family profiles
CREATE TABLE public.host_family_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  about_us TEXT,
  religious_level religious_level,
  guest_preference gender_preference,
  available_dates TEXT[],
  region region,
  city TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.host_family_profiles ENABLE ROW LEVEL SECURITY;

-- Host work profiles
CREATE TABLE public.host_work_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  place_name TEXT NOT NULL,
  region region,
  city TEXT,
  job_description TEXT,
  payment TEXT,
  available_dates TEXT[],
  is_permanent BOOLEAN DEFAULT false,
  gender_preference gender_preference,
  team_size INTEGER,
  special_requirements TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.host_work_profiles ENABLE ROW LEVEL SECURITY;

-- Host volunteer profiles
CREATE TABLE public.host_volunteer_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  place_name TEXT NOT NULL,
  volunteer_type TEXT,
  region region,
  city TEXT,
  special_requirements TEXT,
  provides_accommodation BOOLEAN DEFAULT false,
  provides_meals BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.host_volunteer_profiles ENABLE ROW LEVEL SECURITY;

-- Storage bucket for ID documents
INSERT INTO storage.buckets (id, name, public) VALUES ('id-documents', 'id-documents', false);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_single_profiles_updated_at BEFORE UPDATE ON public.single_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_host_family_profiles_updated_at BEFORE UPDATE ON public.host_family_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_host_work_profiles_updated_at BEFORE UPDATE ON public.host_work_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_host_volunteer_profiles_updated_at BEFORE UPDATE ON public.host_volunteer_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile trigger (creates profile on signup - but we'll do this from the registration form instead)

-- RLS Policies

-- user_roles: only admins can see roles
CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- profiles
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can update all profiles" ON public.profiles FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- single_profiles
CREATE POLICY "Anyone can view approved single profiles" ON public.single_profiles FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.user_id = single_profiles.user_id AND profiles.registration_status = 'approved')
);
CREATE POLICY "Users can insert their own single profile" ON public.single_profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own single profile" ON public.single_profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- host_family_profiles
CREATE POLICY "Anyone can view approved family profiles" ON public.host_family_profiles FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.user_id = host_family_profiles.user_id AND profiles.registration_status = 'approved')
);
CREATE POLICY "Users can insert their own family profile" ON public.host_family_profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own family profile" ON public.host_family_profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- host_work_profiles
CREATE POLICY "Anyone can view approved work profiles" ON public.host_work_profiles FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.user_id = host_work_profiles.user_id AND profiles.registration_status = 'approved')
);
CREATE POLICY "Users can insert their own work profile" ON public.host_work_profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own work profile" ON public.host_work_profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- host_volunteer_profiles
CREATE POLICY "Anyone can view approved volunteer profiles" ON public.host_volunteer_profiles FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.user_id = host_volunteer_profiles.user_id AND profiles.registration_status = 'approved')
);
CREATE POLICY "Users can insert their own volunteer profile" ON public.host_volunteer_profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own volunteer profile" ON public.host_volunteer_profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Storage policies for ID documents
CREATE POLICY "Users can upload their own ID documents" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'id-documents' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can view their own ID documents" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'id-documents' AND (auth.uid()::text = (storage.foldername(name))[1] OR public.has_role(auth.uid(), 'admin')));
