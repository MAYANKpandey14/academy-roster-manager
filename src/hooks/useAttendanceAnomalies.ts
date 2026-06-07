import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface AttendanceAnomaly {
  key: string; // Unique identifier for local dismissal check
  type: "consecutive_absence" | "weekly_pattern" | "group_absence" | "excessive_rate";
  severity: "critical" | "warning";
  personId?: string;
  personName?: string;
  personPno?: string;
  details: {
    streakDays?: number;
    startDate?: string;
    endDate?: string;
    dayName?: string;
    consecutiveWeeks?: number;
    toliNo?: string;
    absentCount?: number;
    traineeNames?: string[];
    totalDays?: number;
    absentDays?: number;
    absenceRate?: number;
  };
  message: string;
  messageHi: string;
}

const DISMISS_KEY = "dismissed-attendance-anomalies";

export function useAttendanceAnomalies() {
  const queryClient = useQueryClient();

  const query = useQuery<AttendanceAnomaly[]>({
    queryKey: ["attendance-anomalies"],
    queryFn: async () => {
      let anomalies: AttendanceAnomaly[] = [];

      // 1. Try querying DB RPC functions
      try {
        const [consecutiveRes, weeklyRes, groupRes, excessiveRes] = await Promise.all([
          supabase.rpc("find_consecutive_absences"),
          supabase.rpc("find_weekly_absence_patterns"),
          supabase.rpc("find_group_absences"),
          supabase.rpc("find_excessive_absences"),
        ]);

        const noErrors =
          !consecutiveRes.error &&
          !weeklyRes.error &&
          !groupRes.error &&
          !excessiveRes.error;

        if (noErrors) {
          // Process consecutive absences
          consecutiveRes.data?.forEach((r: any) => {
            anomalies.push({
              key: `consecutive-${r.trainee_id}-${r.streak_start}`,
              type: "consecutive_absence",
              severity: "critical",
              personId: r.trainee_id,
              personName: r.trainee_name,
              personPno: r.trainee_pno,
              details: {
                streakDays: r.streak_days,
                startDate: r.streak_start,
                endDate: r.streak_end,
              },
              message: `${r.trainee_name} (PNO: ${r.trainee_pno}) has been absent for ${r.streak_days} consecutive days (from ${r.streak_start} to ${r.streak_end}) without approved leave.`,
              messageHi: `${r.trainee_name} (PNO: ${r.trainee_pno}) बिना स्वीकृत अवकाश के लगातार ${r.streak_days} दिनों से अनुपस्थित हैं (${r.streak_start} से ${r.streak_end} तक)।`,
            });
          });

          // Process weekly patterns
          weeklyRes.data?.forEach((r: any) => {
            anomalies.push({
              key: `weekly-${r.trainee_id}-${r.day_of_week}`,
              type: "weekly_pattern",
              severity: "warning",
              personId: r.trainee_id,
              personName: r.trainee_name,
              personPno: r.trainee_pno,
              details: {
                dayName: r.day_name,
                consecutiveWeeks: r.consecutive_weeks,
              },
              message: `${r.trainee_name} (PNO: ${r.trainee_pno}) has been absent on ${r.day_name} for ${r.consecutive_weeks} consecutive weeks.`,
              messageHi: `${r.trainee_name} (PNO: ${r.trainee_pno}) लगातार ${r.consecutive_weeks} हफ्तों से ${translateDay(r.day_name)} को अनुपस्थित हैं।`,
            });
          });

          // Process group absences
          groupRes.data?.forEach((r: any) => {
            anomalies.push({
              key: `group-${r.toli_no}-${r.absence_date}`,
              type: "group_absence",
              severity: "warning",
              details: {
                toliNo: r.toli_no,
                absentCount: r.absent_count,
                traineeNames: r.trainee_names,
                startDate: r.absence_date,
              },
              message: `High absence rate in Toli ${r.toli_no}: ${r.absent_count} trainees absent on ${r.absence_date} (${r.trainee_names.join(", ")}).`,
              messageHi: `टोली ${r.toli_no} में उच्च अनुपस्थिति: ${r.absence_date} को ${r.absent_count} प्रशिक्षु अनुपस्थित थे (${r.trainee_names.join(", ")})।`,
            });
          });

          // Process excessive absence rate
          excessiveRes.data?.forEach((r: any) => {
            const pct = Math.round(r.absence_rate * 100);
            anomalies.push({
              key: `excessive-${r.trainee_id}-${pct}`,
              type: "excessive_rate",
              severity: "critical",
              personId: r.trainee_id,
              personName: r.trainee_name,
              personPno: r.trainee_pno,
              details: {
                totalDays: r.total_days,
                absentDays: r.absent_days,
                absenceRate: r.absence_rate,
              },
              message: `${r.trainee_name} (PNO: ${r.trainee_pno}) has an excessive absence rate of ${pct}% (${r.absent_days}/${r.total_days} days).`,
              messageHi: `${r.trainee_name} (PNO: ${r.trainee_pno}) की अनुपस्थिति दर ${pct}% (${r.absent_days}/${r.total_days} दिन) अत्यधिक है।`,
            });
          });

          return filterDismissedAnomalies(anomalies);
        }
      } catch (err) {
        console.warn("RPC anomaly functions not found or errored, falling back to JS grouping:", err);
      }

      // 2. Client-side fallback computation
      anomalies = await computeClientSideAnomalies();
      return filterDismissedAnomalies(anomalies);
    },
    staleTime: 5 * 60 * 1000,
  });

  // Mutation to dismiss/acknowledge an anomaly locally
  const dismissMutation = useMutation({
    mutationFn: async (anomalyKey: string) => {
      try {
        const dismissed = getDismissed();
        if (!dismissed.includes(anomalyKey)) {
          dismissed.push(anomalyKey);
          localStorage.setItem(DISMISS_KEY, JSON.stringify(dismissed));
        }
      } catch (e) {
        console.error("Failed to dismiss anomaly in localStorage", e);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance-anomalies"] });
    },
  });

  return {
    anomalies: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    dismissAnomaly: (key: string) => dismissMutation.mutate(key),
  };
}

function getDismissed(): string[] {
  try {
    const raw = localStorage.getItem(DISMISS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function filterDismissedAnomalies(anomalies: AttendanceAnomaly[]): AttendanceAnomaly[] {
  const dismissed = getDismissed();
  return anomalies.filter((a) => !dismissed.includes(a.key));
}

function translateDay(day: string): string {
  const map: { [key: string]: string } = {
    Sunday: "रविवार",
    Monday: "सोमवार",
    Tuesday: "मंगलवार",
    Wednesday: "बुधवार",
    Thursday: "गुरुवार",
    Friday: "शुक्रवार",
    Saturday: "शनिवार",
  };
  const trimmed = day.trim();
  return map[trimmed] || trimmed;
}

async function computeClientSideAnomalies(): Promise<AttendanceAnomaly[]> {
  const [traineesRes, attendanceRes, leaveRes] = await Promise.all([
    supabase.from("trainees").select("id, name, pno, toli_no"),
    supabase.from("trainee_attendance").select("trainee_id, status, date").order("date", { ascending: true }),
    supabase.from("trainee_leave").select("trainee_id, start_date, end_date, status"),
  ]);

  if (traineesRes.error) throw traineesRes.error;
  if (attendanceRes.error) throw attendanceRes.error;
  if (leaveRes.error) throw leaveRes.error;

  const trainees = traineesRes.data || [];
  const attendance = attendanceRes.data || [];
  const leaves = leaveRes.data || [];

  const traineeMap = new Map(trainees.map((t) => [t.id, t]));
  const anomalies: AttendanceAnomaly[] = [];

  // Helper to check if a trainee has approved leave on a given date
  const hasApprovedLeave = (traineeId: string, dateStr: string) => {
    const checkDate = new Date(dateStr);
    return leaves.some((l) => {
      if (l.trainee_id !== traineeId || l.status !== "approved") return false;
      const start = new Date(l.start_date);
      const end = new Date(l.end_date);
      return checkDate >= start && checkDate <= end;
    });
  };

  // 1. Consecutive Absences (Streak >= 3 days)
  const attendanceByTrainee: { [id: string]: { date: string; status: string }[] } = {};
  attendance.forEach((a) => {
    if (!attendanceByTrainee[a.trainee_id]) {
      attendanceByTrainee[a.trainee_id] = [];
    }
    attendanceByTrainee[a.trainee_id].push(a);
  });

  Object.keys(attendanceByTrainee).forEach((tId) => {
    const t = traineeMap.get(tId);
    if (!t) return;

    const logs = attendanceByTrainee[tId];
    let currentStreak: { date: string; status: string }[] = [];

    for (let i = 0; i < logs.length; i++) {
      const log = logs[i];
      if (log.status === "absent" && !hasApprovedLeave(tId, log.date)) {
        currentStreak.push(log);
      } else {
        if (currentStreak.length >= 3) {
          anomalies.push({
            key: `consecutive-${tId}-${currentStreak[0].date}`,
            type: "consecutive_absence",
            severity: "critical",
            personId: tId,
            personName: t.name,
            personPno: t.pno,
            details: {
              streakDays: currentStreak.length,
              startDate: currentStreak[0].date,
              endDate: currentStreak[currentStreak.length - 1].date,
            },
            message: `${t.name} (PNO: ${t.pno}) has been absent for ${currentStreak.length} consecutive days (from ${currentStreak[0].date} to ${currentStreak[currentStreak.length - 1].date}) without approved leave.`,
            messageHi: `${t.name} (PNO: ${t.pno}) बिना स्वीकृत अवकाश के लगातार ${currentStreak.length} दिनों से अनुपस्थित हैं (${currentStreak[0].date} से ${currentStreak[currentStreak.length - 1].date} तक)।`,
          });
        }
        currentStreak = [];
      }
    }
    // Check trail streak
    if (currentStreak.length >= 3) {
      anomalies.push({
        key: `consecutive-${tId}-${currentStreak[0].date}`,
        type: "consecutive_absence",
        severity: "critical",
        personId: tId,
        personName: t.name,
        personPno: t.pno,
        details: {
          streakDays: currentStreak.length,
          startDate: currentStreak[0].date,
          endDate: currentStreak[currentStreak.length - 1].date,
        },
        message: `${t.name} (PNO: ${t.pno}) has been absent for ${currentStreak.length} consecutive days (from ${currentStreak[0].date} to ${currentStreak[currentStreak.length - 1].date}) without approved leave.`,
        messageHi: `${t.name} (PNO: ${t.pno}) बिना स्वीकृत अवकाश के लगातार ${currentStreak.length} दिनों से अनुपस्थित हैं (${currentStreak[0].date} से ${currentStreak[currentStreak.length - 1].date} तक)।`,
      });
    }
  });

  // 2. Weekly Absence Patterns (Absent on same day of week for 3+ consecutive weeks)
  const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  Object.keys(attendanceByTrainee).forEach((tId) => {
    const t = traineeMap.get(tId);
    if (!t) return;

    const logs = attendanceByTrainee[tId];
    // Separate by DOW
    const dowLogs: { [dow: number]: string[] } = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };

    logs.forEach((log) => {
      const d = new Date(log.date);
      const dow = d.getDay();
      if (log.status === "absent" && !hasApprovedLeave(tId, log.date)) {
        dowLogs[dow].push(log.date);
      }
    });

    for (let dow = 0; dow < 7; dow++) {
      const dates = dowLogs[dow];
      if (dates.length < 3) continue;

      let consecutiveWeeks = 1;
      let maxConsecutive = 1;

      for (let i = 1; i < dates.length; i++) {
        const prev = new Date(dates[i - 1]);
        const curr = new Date(dates[i]);
        const diffMs = curr.getTime() - prev.getTime();
        const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 7) {
          consecutiveWeeks++;
          if (consecutiveWeeks > maxConsecutive) {
            maxConsecutive = consecutiveWeeks;
          }
        } else if (diffDays > 7) {
          consecutiveWeeks = 1;
        }
      }

      if (maxConsecutive >= 3) {
        const dayName = weekdays[dow];
        anomalies.push({
          key: `weekly-${tId}-${dow}`,
          type: "weekly_pattern",
          severity: "warning",
          personId: tId,
          personName: t.name,
          personPno: t.pno,
          details: {
            dayName,
            consecutiveWeeks: maxConsecutive,
          },
          message: `${t.name} (PNO: ${t.pno}) has been absent on ${dayName} for ${maxConsecutive} consecutive weeks.`,
          messageHi: `${t.name} (PNO: ${t.pno}) लगातार ${maxConsecutive} हफ्तों से ${translateDay(dayName)} को अनुपस्थित हैं।`,
        });
      }
    }
  });

  // 3. Group Absences (5+ absent on same day in same Toli)
  const toliAbsenceMap: { [toliAndDate: string]: string[] } = {};
  attendance.forEach((a) => {
    const t = traineeMap.get(a.trainee_id);
    if (t && t.toli_no && a.status === "absent") {
      const key = `${t.toli_no}_${a.date}`;
      if (!toliAbsenceMap[key]) {
        toliAbsenceMap[key] = [];
      }
      toliAbsenceMap[key].push(t.name);
    }
  });

  Object.keys(toliAbsenceMap).forEach((key) => {
    const list = toliAbsenceMap[key];
    if (list.length >= 5) {
      const [toliNo, dateStr] = key.split("_");
      anomalies.push({
        key: `group-${toliNo}-${dateStr}`,
        type: "group_absence",
        severity: "warning",
        details: {
          toliNo,
          absentCount: list.length,
          traineeNames: list,
          startDate: dateStr,
        },
        message: `High absence rate in Toli ${toliNo}: ${list.length} trainees absent on ${dateStr} (${list.join(", ")}).`,
        messageHi: `टोली ${toliNo} में उच्च अनुपस्थिति: ${dateStr} को ${list.length} प्रशिक्षु अनुपस्थित थे (${list.join(", ")})।`,
      });
    }
  });

  // 4. Excessive Absence Rate (> 20% absence rate)
  Object.keys(attendanceByTrainee).forEach((tId) => {
    const t = traineeMap.get(tId);
    if (!t) return;

    const logs = attendanceByTrainee[tId];
    const total = logs.length;
    const absent = logs.filter((log) => log.status === "absent").length;

    if (total > 0) {
      const rate = absent / total;
      if (rate > 0.2) {
        const pct = Math.round(rate * 100);
        anomalies.push({
          key: `excessive-${tId}-${pct}`,
          type: "excessive_rate",
          severity: "critical",
          personId: tId,
          personName: t.name,
          personPno: t.pno,
          details: {
            totalDays: total,
            absentDays: absent,
            absenceRate: rate,
          },
          message: `${t.name} (PNO: ${t.pno}) has an excessive absence rate of ${pct}% (${absent}/${total} days).`,
          messageHi: `${t.name} (PNO: ${t.pno}) की अनुपस्थिति दर ${pct}% (${absent}/${total} दिन) अत्यधिक है।`,
        });
      }
    }
  });

  return anomalies;
}
