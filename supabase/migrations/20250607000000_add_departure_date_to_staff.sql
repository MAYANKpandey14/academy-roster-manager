
-- Add departure_date column to staff table
ALTER TABLE staff ADD COLUMN IF NOT EXISTS departure_date timestamp with time zone;

-- Update existing records to have null departure_date (optional)
UPDATE staff SET departure_date = NULL WHERE departure_date IS NULL;
