/* Function: Find consecutive absences (min_days consecutive days absent without approved leave) */
CREATE OR REPLACE FUNCTION find_consecutive_absences(min_days int DEFAULT 3)
RETURNS TABLE(
  trainee_id uuid, trainee_name text, trainee_pno text,
  streak_start date, streak_end date, streak_days int
) AS $$
  WITH absence_days AS (
    SELECT 
      trainee_id, 
      date::date as absence_date,
      date::date - (ROW_NUMBER() OVER (PARTITION BY trainee_id ORDER BY date::date))::int AS grp
    FROM trainee_attendance
    WHERE status = 'absent'
      AND trainee_id NOT IN (
        SELECT trainee_id FROM trainee_leave 
        WHERE status = 'approved' 
          AND trainee_attendance.date::date BETWEEN start_date::date AND end_date::date
      )
  ),
  streaks AS (
    SELECT 
      trainee_id, 
      MIN(absence_date) as streak_start, 
      MAX(absence_date) as streak_end,
      COUNT(*) as streak_days
    FROM absence_days
    GROUP BY trainee_id, grp
    HAVING COUNT(*) >= min_days
  )
  SELECT s.trainee_id, t.name as trainee_name, t.pno as trainee_pno, s.streak_start, s.streak_end, s.streak_days::int
  FROM streaks s 
  JOIN trainees t ON t.id = s.trainee_id
  ORDER BY s.streak_days DESC;
$$ LANGUAGE sql STABLE SECURITY INVOKER;

/* Function: Find weekly absence patterns (min_weeks consecutive weeks absent on the same day of the week) */
CREATE OR REPLACE FUNCTION find_weekly_absence_patterns(min_weeks int DEFAULT 3)
RETURNS TABLE(
  trainee_id uuid, trainee_name text, trainee_pno text,
  day_of_week int, day_name text, consecutive_weeks int
) AS $$
  WITH absence_weeks AS (
    SELECT 
      trainee_id,
      date::date as absence_date,
      EXTRACT(DOW FROM date::date)::int as dow,
      to_char(date::date, 'Day') as dname,
      date::date - (7 * ROW_NUMBER() OVER (PARTITION BY trainee_id, EXTRACT(DOW FROM date::date) ORDER BY date::date))::int AS grp
    FROM trainee_attendance
    WHERE status = 'absent'
      AND trainee_id NOT IN (
        SELECT trainee_id FROM trainee_leave 
        WHERE status = 'approved' 
          AND trainee_attendance.date::date BETWEEN start_date::date AND end_date::date
      )
  ),
  streaks AS (
    SELECT 
      trainee_id,
      dow,
      MIN(dname) as day_n,
      COUNT(*) as consecutive_w
    FROM absence_weeks
    GROUP BY trainee_id, dow, grp
    HAVING COUNT(*) >= min_weeks
  )
  SELECT s.trainee_id, t.name as trainee_name, t.pno as trainee_pno, s.dow as day_of_week, TRIM(s.day_n) as day_name, s.consecutive_w::int as consecutive_weeks
  FROM streaks s
  JOIN trainees t ON t.id = s.trainee_id
  ORDER BY s.consecutive_w DESC;
$$ LANGUAGE sql STABLE SECURITY INVOKER;

/* Function: Find group absences (min_group_size or more trainees from same toli absent on same day) */
CREATE OR REPLACE FUNCTION find_group_absences(min_group_size int DEFAULT 5)
RETURNS TABLE(
  absence_date date, toli_no text, absent_count int, trainee_names text[]
) AS $$
  SELECT 
    a.date::date as absence_date,
    t.toli_no,
    COUNT(*)::int as absent_count,
    array_agg(t.name ORDER BY t.name) as trainee_names
  FROM trainee_attendance a
  JOIN trainees t ON t.id = a.trainee_id
  WHERE a.status = 'absent'
    AND t.toli_no IS NOT NULL
  GROUP BY a.date, t.toli_no
  HAVING COUNT(*) >= min_group_size
  ORDER BY absence_date DESC, absent_count DESC;
$$ LANGUAGE sql STABLE SECURITY INVOKER;

/* Function: Find trainees with excessive absence rates (absent more than max_rate % of logged days) */
CREATE OR REPLACE FUNCTION find_excessive_absences(max_rate float DEFAULT 0.20)
RETURNS TABLE(
  trainee_id uuid, trainee_name text, trainee_pno text,
  total_days int, absent_days int, absence_rate float
) AS $$
  WITH counts AS (
    SELECT 
      trainee_id,
      COUNT(*)::int as total,
      SUM(CASE WHEN status = 'absent' THEN 1 ELSE 0 END)::int as absent
    FROM trainee_attendance
    GROUP BY trainee_id
  )
  SELECT 
    c.trainee_id,
    t.name as trainee_name,
    t.pno as trainee_pno,
    c.total as total_days,
    c.absent as absent_days,
    (c.absent::float / NULLIF(c.total, 0))::float as absence_rate
  FROM counts c
  JOIN trainees t ON t.id = c.trainee_id
  WHERE c.total > 0 AND (c.absent::float / c.total) > max_rate
  ORDER BY absence_rate DESC;
$$ LANGUAGE sql STABLE SECURITY INVOKER;
