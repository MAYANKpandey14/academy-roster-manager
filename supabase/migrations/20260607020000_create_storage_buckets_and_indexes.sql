-- 1. Ensure Trainees Table Columns are Synced
ALTER TABLE public.trainees ADD COLUMN IF NOT EXISTS category_caste TEXT;
ALTER TABLE public.trainees ADD COLUMN IF NOT EXISTS toli_no TEXT;
ALTER TABLE public.trainees ADD COLUMN IF NOT EXISTS rank TEXT;
ALTER TABLE public.trainees ADD COLUMN IF NOT EXISTS photo_url TEXT;

-- 2. Create Active Staff Table (if not exists)
CREATE TABLE IF NOT EXISTS public.staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pno TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  father_name TEXT NOT NULL,
  rank TEXT NOT NULL,
  current_posting_district TEXT NOT NULL,
  mobile_number TEXT NOT NULL,
  education TEXT NOT NULL,
  date_of_birth TIMESTAMPTZ NOT NULL,
  date_of_joining TIMESTAMPTZ NOT NULL,
  arrival_date TIMESTAMPTZ,
  departure_date TIMESTAMPTZ,
  blood_group TEXT NOT NULL,
  nominee TEXT NOT NULL,
  home_address TEXT NOT NULL,
  category_caste TEXT,
  toli_no TEXT,
  class_no TEXT,
  class_subject TEXT,
  photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Archive Folders Table (if not exists)
CREATE TABLE IF NOT EXISTS public.archive_folders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  folder_name TEXT NOT NULL,
  description TEXT,
  item_count INTEGER DEFAULT 0,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_modified TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create Archived Trainees Table (if not exists)
CREATE TABLE IF NOT EXISTS public.archived_trainees (
  id UUID PRIMARY KEY,
  pno TEXT NOT NULL,
  chest_no TEXT NOT NULL,
  name TEXT NOT NULL,
  father_name TEXT NOT NULL,
  arrival_date TIMESTAMPTZ NOT NULL,
  departure_date TIMESTAMPTZ NOT NULL,
  current_posting_district TEXT NOT NULL,
  mobile_number TEXT NOT NULL,
  education TEXT NOT NULL,
  date_of_birth TIMESTAMPTZ NOT NULL,
  date_of_joining TIMESTAMPTZ NOT NULL,
  blood_group TEXT NOT NULL,
  nominee TEXT NOT NULL,
  home_address TEXT NOT NULL,
  category_caste TEXT,
  toli_no TEXT,
  rank TEXT,
  photo_url TEXT,
  folder_id UUID REFERENCES public.archive_folders(id) ON DELETE SET NULL,
  archived_at TIMESTAMPTZ DEFAULT NOW(),
  archived_by UUID,
  status TEXT DEFAULT 'archived',
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);

-- 5. Create Archived Staff Table (if not exists)
CREATE TABLE IF NOT EXISTS public.archived_staff (
  id UUID PRIMARY KEY,
  pno TEXT NOT NULL,
  name TEXT NOT NULL,
  father_name TEXT NOT NULL,
  rank TEXT NOT NULL,
  current_posting_district TEXT NOT NULL,
  mobile_number TEXT NOT NULL,
  education TEXT NOT NULL,
  date_of_birth TIMESTAMPTZ NOT NULL,
  date_of_joining TIMESTAMPTZ NOT NULL,
  arrival_date TIMESTAMPTZ,
  departure_date TIMESTAMPTZ,
  blood_group TEXT NOT NULL,
  nominee TEXT NOT NULL,
  home_address TEXT NOT NULL,
  category_caste TEXT,
  toli_no TEXT,
  class_no TEXT,
  class_subject TEXT,
  photo_url TEXT,
  folder_id UUID REFERENCES public.archive_folders(id) ON DELETE SET NULL,
  archived_at TIMESTAMPTZ DEFAULT NOW(),
  archived_by UUID,
  status TEXT DEFAULT 'archived',
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);

-- 6. Create Trainee Attendance Table (if not exists)
CREATE TABLE IF NOT EXISTS public.trainee_attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trainee_id UUID REFERENCES public.trainees(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  status TEXT NOT NULL,
  approval_status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Create Staff Attendance Table (if not exists)
CREATE TABLE IF NOT EXISTS public.staff_attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id UUID REFERENCES public.staff(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  status TEXT NOT NULL,
  approval_status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Create Trainee Leave Table (if not exists)
CREATE TABLE IF NOT EXISTS public.trainee_leave (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trainee_id UUID REFERENCES public.trainees(id) ON DELETE CASCADE,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  leave_type TEXT,
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Create Staff Leave Table (if not exists)
CREATE TABLE IF NOT EXISTS public.staff_leave (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id UUID REFERENCES public.staff(id) ON DELETE CASCADE,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  leave_type TEXT,
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Create Profiles Table (if not exists)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  role TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Create User Roles Table (if not exists)
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  role TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Storage Buckets Creation (Private buckets for security)
INSERT INTO storage.buckets (id, name, public)
VALUES ('trainee_photos', 'trainee_photos', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('staff_photos', 'staff_photos', false)
ON CONFLICT (id) DO NOTHING;

-- Force the buckets to be private in case they were previously created as public
UPDATE storage.buckets SET public = false WHERE id IN ('trainee_photos', 'staff_photos');

-- Enable RLS on storage.objects (just in case)
-- ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY; -- Commented out to avoid superuser check

-- Drop all existing policies for these buckets to avoid any lingering public/old policies
DO $$
DECLARE
  pol record;
BEGIN
  FOR pol IN 
    SELECT policyname 
    FROM pg_policies 
    WHERE schemaname = 'storage' 
      AND tablename = 'objects' 
      AND (qual ILIKE '%trainee_photos%' OR with_check ILIKE '%trainee_photos%' 
           OR qual ILIKE '%staff_photos%' OR with_check ILIKE '%staff_photos%')
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', pol.policyname);
  END LOOP;
END $$;

-- 13. Storage Policies for trainee_photos
CREATE POLICY "Authenticated Read Access on trainee_photos" ON storage.objects
  FOR SELECT TO authenticated USING (bucket_id = 'trainee_photos');

CREATE POLICY "Manage trainee_photos objects" ON storage.objects
  FOR ALL TO authenticated
  USING (bucket_id = 'trainee_photos')
  WITH CHECK (bucket_id = 'trainee_photos');

CREATE POLICY "Public Insert Access on trainee_photos" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'trainee_photos');

-- 14. Storage Policies for staff_photos
CREATE POLICY "Authenticated Read Access on staff_photos" ON storage.objects
  FOR SELECT TO authenticated USING (bucket_id = 'staff_photos');

CREATE POLICY "Manage staff_photos objects" ON storage.objects
  FOR ALL TO authenticated
  USING (bucket_id = 'staff_photos')
  WITH CHECK (bucket_id = 'staff_photos');

CREATE POLICY "Public Insert Access on staff_photos" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'staff_photos');

-- 15. Database Indexes for Optimized Read Operations

-- Active Trainees Indexes
CREATE INDEX IF NOT EXISTS idx_trainees_toli_no ON public.trainees (toli_no);
CREATE INDEX IF NOT EXISTS idx_trainees_pno ON public.trainees (pno);

-- Active Staff Indexes
CREATE INDEX IF NOT EXISTS idx_staff_name ON public.staff (name);
CREATE INDEX IF NOT EXISTS idx_staff_district ON public.staff (current_posting_district);
CREATE INDEX IF NOT EXISTS idx_staff_toli_no ON public.staff (toli_no);
CREATE INDEX IF NOT EXISTS idx_staff_class_no ON public.staff (class_no);
CREATE INDEX IF NOT EXISTS idx_staff_pno ON public.staff (pno);

-- Attendance Indexes (Composite for Person + Date query lookup)
CREATE INDEX IF NOT EXISTS idx_trainee_attendance_id_date ON public.trainee_attendance (trainee_id, date);
CREATE INDEX IF NOT EXISTS idx_staff_attendance_id_date ON public.staff_attendance (staff_id, date);

-- Leave Indexes (Composite for Person + Date query lookup)
CREATE INDEX IF NOT EXISTS idx_trainee_leave_id_start_date ON public.trainee_leave (trainee_id, start_date);
CREATE INDEX IF NOT EXISTS idx_staff_leave_id_start_date ON public.staff_leave (staff_id, start_date);

-- Archived Records Indexes (For fast folder-based listings and searches)
CREATE INDEX IF NOT EXISTS idx_archived_trainees_folder_id ON public.archived_trainees (folder_id);
CREATE INDEX IF NOT EXISTS idx_archived_trainees_name ON public.archived_trainees (name);
CREATE INDEX IF NOT EXISTS idx_archived_trainees_pno ON public.archived_trainees (pno);
CREATE INDEX IF NOT EXISTS idx_archived_staff_folder_id ON public.archived_staff (folder_id);
CREATE INDEX IF NOT EXISTS idx_archived_staff_name ON public.archived_staff (name);
CREATE INDEX IF NOT EXISTS idx_archived_staff_pno ON public.archived_staff (pno);
