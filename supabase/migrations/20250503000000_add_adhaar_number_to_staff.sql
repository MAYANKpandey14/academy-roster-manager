
-- Add adhaar_number column to staff table if it doesn't exist
ALTER TABLE IF EXISTS public.staff 
ADD COLUMN IF NOT EXISTS adhaar_number TEXT;

-- Create index on adhaar_number for faster lookups
CREATE INDEX IF NOT EXISTS idx_staff_adhaar_number ON public.staff(adhaar_number);

-- Create index on chest_no for trainees for faster lookups
CREATE INDEX IF NOT EXISTS idx_trainees_chest_no ON public.trainees(chest_no);
