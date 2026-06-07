/* Enable trigram extension for fuzzy search */
CREATE EXTENSION IF NOT EXISTS pg_trgm;

/* Create GIN indexes for fast trigram similarity search on names and father names */
CREATE INDEX IF NOT EXISTS idx_trainees_name_trgm ON trainees USING GIN (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_trainees_father_name_trgm ON trainees USING GIN (father_name gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_staff_name_trgm ON staff USING GIN (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_staff_father_name_trgm ON staff USING GIN (father_name gin_trgm_ops);

/* Create RPC search function for trainees */
CREATE OR REPLACE FUNCTION search_trainees(search_term text)
RETURNS SETOF trainees AS $$
  SELECT *
  FROM trainees
  WHERE name % search_term
     OR father_name % search_term
     OR pno ILIKE '%' || search_term || '%'
     OR chest_no ILIKE '%' || search_term || '%'
     OR current_posting_district % search_term
  ORDER BY similarity(name, search_term) DESC;
$$ LANGUAGE sql;

/* Create RPC search function for staff */
CREATE OR REPLACE FUNCTION search_staff(search_term text)
RETURNS SETOF staff AS $$
  SELECT *
  FROM staff
  WHERE name % search_term
     OR father_name % search_term
     OR pno ILIKE '%' || search_term || '%'
     OR current_posting_district % search_term
  ORDER BY similarity(name, search_term) DESC;
$$ LANGUAGE sql;
