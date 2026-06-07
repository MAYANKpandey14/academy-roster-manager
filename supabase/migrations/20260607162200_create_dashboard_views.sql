/* View: trainee counts by district */
CREATE OR REPLACE VIEW trainee_district_distribution WITH (security_invoker = true) AS
SELECT current_posting_district as district, COUNT(*) as count
FROM trainees 
GROUP BY current_posting_district 
ORDER BY count DESC;

/* View: trainee counts by rank */
CREATE OR REPLACE VIEW trainee_rank_distribution WITH (security_invoker = true) AS
SELECT rank, COUNT(*) as count
FROM trainees 
GROUP BY rank 
ORDER BY count DESC;

/* View: blood group distribution */
CREATE OR REPLACE VIEW blood_group_distribution WITH (security_invoker = true) AS
SELECT blood_group, COUNT(*) as count
FROM trainees 
GROUP BY blood_group 
ORDER BY count DESC;

/* View: today's attendance summary */
CREATE OR REPLACE VIEW today_attendance_summary WITH (security_invoker = true) AS
SELECT status, COUNT(*) as count
FROM trainee_attendance
WHERE date = CURRENT_DATE
GROUP BY status;

/* View: recent arrivals (last 7 days) */
CREATE OR REPLACE VIEW recent_arrivals WITH (security_invoker = true) AS
SELECT id, name, pno, rank, current_posting_district, arrival_date
FROM trainees
WHERE arrival_date::date >= CURRENT_DATE - INTERVAL '7 days'
ORDER BY arrival_date DESC;

/* View: upcoming departures (next 7 days) */
CREATE OR REPLACE VIEW upcoming_departures WITH (security_invoker = true) AS
SELECT id, name, pno, rank, current_posting_district, departure_date
FROM trainees
WHERE departure_date::date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days'
ORDER BY departure_date ASC;
