
-- Create trainees table
CREATE TABLE IF NOT EXISTS public.trainees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for commonly used search fields
CREATE INDEX IF NOT EXISTS idx_trainees_name ON public.trainees (name);
CREATE INDEX IF NOT EXISTS idx_trainees_district ON public.trainees (current_posting_district);
CREATE INDEX IF NOT EXISTS idx_trainees_arrival_date ON public.trainees (arrival_date);

-- Create RLS policies to secure the data
ALTER TABLE public.trainees ENABLE ROW LEVEL SECURITY;

-- Policy to allow read access to all authenticated users
CREATE POLICY trainees_select_policy 
  ON public.trainees 
  FOR SELECT 
  USING (auth.role() = 'authenticated');

-- Policy to allow insert for authenticated users
CREATE POLICY trainees_insert_policy 
  ON public.trainees 
  FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

-- Policy to allow update for authenticated users
CREATE POLICY trainees_update_policy 
  ON public.trainees 
  FOR UPDATE 
  USING (auth.role() = 'authenticated');
