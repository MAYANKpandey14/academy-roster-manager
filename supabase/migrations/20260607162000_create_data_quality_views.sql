/* View: trainees data quality flags */
CREATE OR REPLACE VIEW trainee_data_quality WITH (security_invoker = true) AS
SELECT 
  id, 
  pno, 
  name,
  mobile_number,
  photo_url,
  home_address,
  CASE WHEN photo_url IS NULL OR photo_url = '' THEN 1 ELSE 0 END as missing_photo,
  CASE WHEN mobile_number IS NULL OR mobile_number = '' THEN 1 ELSE 0 END as missing_mobile,
  CASE WHEN home_address IS NULL OR home_address = '' THEN 1 ELSE 0 END as missing_address,
  CASE WHEN date_of_birth::date > CURRENT_DATE THEN 1 ELSE 0 END as future_dob,
  CASE WHEN departure_date::date < arrival_date::date THEN 1 ELSE 0 END as departure_before_arrival
FROM trainees;

/* View: staff data quality flags */
CREATE OR REPLACE VIEW staff_data_quality WITH (security_invoker = true) AS
SELECT 
  id, 
  pno, 
  name,
  mobile_number,
  photo_url,
  home_address,
  CASE WHEN photo_url IS NULL OR photo_url = '' THEN 1 ELSE 0 END as missing_photo,
  CASE WHEN mobile_number IS NULL OR mobile_number = '' THEN 1 ELSE 0 END as missing_mobile,
  CASE WHEN home_address IS NULL OR home_address = '' THEN 1 ELSE 0 END as missing_address,
  CASE WHEN date_of_birth::date > CURRENT_DATE THEN 1 ELSE 0 END as future_dob,
  CASE WHEN departure_date IS NOT NULL AND arrival_date IS NOT NULL AND departure_date::date < arrival_date::date THEN 1 ELSE 0 END as departure_before_arrival
FROM staff;
