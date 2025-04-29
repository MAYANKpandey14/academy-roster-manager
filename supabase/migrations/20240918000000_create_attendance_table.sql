
-- Create attendance table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pno TEXT NOT NULL,
  name TEXT NOT NULL,
  rank TEXT,
  phone TEXT,
  type TEXT NOT NULL CHECK (type IN ('Absent', 'On Leave')),
  leave_type TEXT CHECK (
    (type = 'On Leave' AND leave_type IN ('CL', 'EL', 'ML', 'Maternity Leave')) OR
    (type = 'Absent' AND leave_type IS NULL)
  ),
  date_from DATE NOT NULL,
  date_to DATE NOT NULL,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Add Row Level Security (RLS)
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

-- Create policy for users to read their own records and admin can read all
CREATE POLICY "Users can view all attendance records" 
  ON public.attendance 
  FOR SELECT 
  USING (true);

-- Create policy for users to add attendance records if authenticated
CREATE POLICY "Users can add attendance records if authenticated" 
  ON public.attendance 
  FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

-- Create index on pno for faster queries
CREATE INDEX IF NOT EXISTS attendance_pno_idx ON public.attendance (pno);
