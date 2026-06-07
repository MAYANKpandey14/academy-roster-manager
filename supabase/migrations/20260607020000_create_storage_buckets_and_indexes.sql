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

-- 16. Enable Row Level Security and Create Policies for Core Tables

-- staff
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS staff_select_policy ON public.staff;
CREATE POLICY staff_select_policy ON public.staff FOR SELECT USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS staff_insert_policy ON public.staff;
CREATE POLICY staff_insert_policy ON public.staff FOR INSERT WITH CHECK (auth.role() = 'authenticated');
DROP POLICY IF EXISTS staff_update_policy ON public.staff;
CREATE POLICY staff_update_policy ON public.staff FOR UPDATE USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS staff_delete_policy ON public.staff;
CREATE POLICY staff_delete_policy ON public.staff FOR DELETE USING (auth.role() = 'authenticated');

-- archive_folders
ALTER TABLE public.archive_folders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS folders_select_policy ON public.archive_folders;
CREATE POLICY folders_select_policy ON public.archive_folders FOR SELECT USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS folders_insert_policy ON public.archive_folders;
CREATE POLICY folders_insert_policy ON public.archive_folders FOR INSERT WITH CHECK (auth.role() = 'authenticated');
DROP POLICY IF EXISTS folders_update_policy ON public.archive_folders;
CREATE POLICY folders_update_policy ON public.archive_folders FOR UPDATE USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS folders_delete_policy ON public.archive_folders;
CREATE POLICY folders_delete_policy ON public.archive_folders FOR DELETE USING (auth.role() = 'authenticated');

-- archived_trainees
ALTER TABLE public.archived_trainees ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS archived_trainees_select_policy ON public.archived_trainees;
CREATE POLICY archived_trainees_select_policy ON public.archived_trainees FOR SELECT USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS archived_trainees_insert_policy ON public.archived_trainees;
CREATE POLICY archived_trainees_insert_policy ON public.archived_trainees FOR INSERT WITH CHECK (auth.role() = 'authenticated');
DROP POLICY IF EXISTS archived_trainees_update_policy ON public.archived_trainees;
CREATE POLICY archived_trainees_update_policy ON public.archived_trainees FOR UPDATE USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS archived_trainees_delete_policy ON public.archived_trainees;
CREATE POLICY archived_trainees_delete_policy ON public.archived_trainees FOR DELETE USING (auth.role() = 'authenticated');

-- archived_staff
ALTER TABLE public.archived_staff ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS archived_staff_select_policy ON public.archived_staff;
CREATE POLICY archived_staff_select_policy ON public.archived_staff FOR SELECT USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS archived_staff_insert_policy ON public.archived_staff;
CREATE POLICY archived_staff_insert_policy ON public.archived_staff FOR INSERT WITH CHECK (auth.role() = 'authenticated');
DROP POLICY IF EXISTS archived_staff_update_policy ON public.archived_staff;
CREATE POLICY archived_staff_update_policy ON public.archived_staff FOR UPDATE USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS archived_staff_delete_policy ON public.archived_staff;
CREATE POLICY archived_staff_delete_policy ON public.archived_staff FOR DELETE USING (auth.role() = 'authenticated');

-- trainee_attendance
ALTER TABLE public.trainee_attendance ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS trainee_attendance_select_policy ON public.trainee_attendance;
CREATE POLICY trainee_attendance_select_policy ON public.trainee_attendance FOR SELECT USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS trainee_attendance_insert_policy ON public.trainee_attendance;
CREATE POLICY trainee_attendance_insert_policy ON public.trainee_attendance FOR INSERT WITH CHECK (auth.role() = 'authenticated');
DROP POLICY IF EXISTS trainee_attendance_update_policy ON public.trainee_attendance;
CREATE POLICY trainee_attendance_update_policy ON public.trainee_attendance FOR UPDATE USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS trainee_attendance_delete_policy ON public.trainee_attendance;
CREATE POLICY trainee_attendance_delete_policy ON public.trainee_attendance FOR DELETE USING (auth.role() = 'authenticated');

-- staff_attendance
ALTER TABLE public.staff_attendance ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS staff_attendance_select_policy ON public.staff_attendance;
CREATE POLICY staff_attendance_select_policy ON public.staff_attendance FOR SELECT USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS staff_attendance_insert_policy ON public.staff_attendance;
CREATE POLICY staff_attendance_insert_policy ON public.staff_attendance FOR INSERT WITH CHECK (auth.role() = 'authenticated');
DROP POLICY IF EXISTS staff_attendance_update_policy ON public.staff_attendance;
CREATE POLICY staff_attendance_update_policy ON public.staff_attendance FOR UPDATE USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS staff_attendance_delete_policy ON public.staff_attendance;
CREATE POLICY staff_attendance_delete_policy ON public.staff_attendance FOR DELETE USING (auth.role() = 'authenticated');

-- trainee_leave
ALTER TABLE public.trainee_leave ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS trainee_leave_select_policy ON public.trainee_leave;
CREATE POLICY trainee_leave_select_policy ON public.trainee_leave FOR SELECT USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS trainee_leave_insert_policy ON public.trainee_leave;
CREATE POLICY trainee_leave_insert_policy ON public.trainee_leave FOR INSERT WITH CHECK (auth.role() = 'authenticated');
DROP POLICY IF EXISTS trainee_leave_update_policy ON public.trainee_leave;
CREATE POLICY trainee_leave_update_policy ON public.trainee_leave FOR UPDATE USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS trainee_leave_delete_policy ON public.trainee_leave;
CREATE POLICY trainee_leave_delete_policy ON public.trainee_leave FOR DELETE USING (auth.role() = 'authenticated');

-- staff_leave
ALTER TABLE public.staff_leave ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS staff_leave_select_policy ON public.staff_leave;
CREATE POLICY staff_leave_select_policy ON public.staff_leave FOR SELECT USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS staff_leave_insert_policy ON public.staff_leave;
CREATE POLICY staff_leave_insert_policy ON public.staff_leave FOR INSERT WITH CHECK (auth.role() = 'authenticated');
DROP POLICY IF EXISTS staff_leave_update_policy ON public.staff_leave;
CREATE POLICY staff_leave_update_policy ON public.staff_leave FOR UPDATE USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS staff_leave_delete_policy ON public.staff_leave;
CREATE POLICY staff_leave_delete_policy ON public.staff_leave FOR DELETE USING (auth.role() = 'authenticated');

-- profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS profiles_select_policy ON public.profiles;
CREATE POLICY profiles_select_policy ON public.profiles FOR SELECT USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS profiles_insert_policy ON public.profiles;
CREATE POLICY profiles_insert_policy ON public.profiles FOR INSERT WITH CHECK (auth.role() = 'authenticated');
DROP POLICY IF EXISTS profiles_update_policy ON public.profiles;
CREATE POLICY profiles_update_policy ON public.profiles FOR UPDATE USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS profiles_delete_policy ON public.profiles;
CREATE POLICY profiles_delete_policy ON public.profiles FOR DELETE USING (auth.role() = 'authenticated');

-- user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS user_roles_select_policy ON public.user_roles;
CREATE POLICY user_roles_select_policy ON public.user_roles FOR SELECT USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS user_roles_insert_policy ON public.user_roles;
CREATE POLICY user_roles_insert_policy ON public.user_roles FOR INSERT WITH CHECK (auth.role() = 'authenticated');
DROP POLICY IF EXISTS user_roles_update_policy ON public.user_roles;
CREATE POLICY user_roles_update_policy ON public.user_roles FOR UPDATE USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS user_roles_delete_policy ON public.user_roles;
CREATE POLICY user_roles_delete_policy ON public.user_roles FOR DELETE USING (auth.role() = 'authenticated');

-- 17. Additional Trainees Table Policies (for archiving)
ALTER TABLE public.trainees ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS trainees_delete_policy ON public.trainees;
CREATE POLICY trainees_delete_policy ON public.trainees FOR DELETE USING (auth.role() = 'authenticated');

-- 18. Triggers to Automatically Update archive_folders.item_count
CREATE OR REPLACE FUNCTION public.update_archive_folder_item_count()
RETURNS TRIGGER AS $$
DECLARE
  v_folder_id UUID;
  v_count INTEGER;
BEGIN
  -- Determine which folder_id to update
  IF TG_OP = 'DELETE' THEN
    v_folder_id := OLD.folder_id;
  ELSE
    v_folder_id := NEW.folder_id;
  END IF;

  IF v_folder_id IS NOT NULL THEN
    -- Calculate total count of items in this folder (trainees + staff)
    SELECT COALESCE(
      (SELECT COUNT(*) FROM public.archived_trainees WHERE folder_id = v_folder_id), 0
    ) + COALESCE(
      (SELECT COUNT(*) FROM public.archived_staff WHERE folder_id = v_folder_id), 0
    ) INTO v_count;

    -- Update the folder's item_count and last_modified columns
    UPDATE public.archive_folders
    SET item_count = v_count, last_modified = NOW()
    WHERE id = v_folder_id;
  END IF;

  -- If folder_id changed, update the old folder's count as well
  IF TG_OP = 'UPDATE' AND OLD.folder_id IS DISTINCT FROM NEW.folder_id AND OLD.folder_id IS NOT NULL THEN
    SELECT COALESCE(
      (SELECT COUNT(*) FROM public.archived_trainees WHERE folder_id = OLD.folder_id), 0
    ) + COALESCE(
      (SELECT COUNT(*) FROM public.archived_staff WHERE folder_id = OLD.folder_id), 0
    ) INTO v_count;

    UPDATE public.archive_folders
    SET item_count = v_count, last_modified = NOW()
    WHERE id = OLD.folder_id;
  END IF;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers for archived_trainees
DROP TRIGGER IF EXISTS trigger_update_count_archived_trainees ON public.archived_trainees;
CREATE TRIGGER trigger_update_count_archived_trainees
  AFTER INSERT OR UPDATE OR DELETE ON public.archived_trainees
  FOR EACH ROW EXECUTE FUNCTION public.update_archive_folder_item_count();

-- Triggers for archived_staff
DROP TRIGGER IF EXISTS trigger_update_count_archived_staff ON public.archived_staff;
CREATE TRIGGER trigger_update_count_archived_staff
  AFTER INSERT OR UPDATE OR DELETE ON public.archived_staff
  FOR EACH ROW EXECUTE FUNCTION public.update_archive_folder_item_count();

-- 19. Run One-time Update for Existing Folders to Sync Item Counts
UPDATE public.archive_folders f
SET item_count = COALESCE((SELECT COUNT(*) FROM public.archived_trainees WHERE folder_id = f.id), 0) +
                 COALESCE((SELECT COUNT(*) FROM public.archived_staff WHERE folder_id = f.id), 0);
