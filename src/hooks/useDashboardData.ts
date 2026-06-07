import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface DashboardData {
  totalTrainees: number;
  totalStaff: number;
  todayAttendance: { status: string; count: number }[];
  districtDistribution: { district: string; count: number }[];
  rankDistribution: { rank: string; count: number }[];
  bloodGroupDistribution: { blood_group: string; count: number }[];
  recentArrivals: any[];
  upcomingDepartures: any[];
}

export function useDashboardData() {
  return useQuery<DashboardData>({
    queryKey: ["dashboard-data"],
    queryFn: async () => {
      try {
        // 1. Try querying views
        const [
          traineesCountRes,
          staffCountRes,
          attendanceRes,
          districtRes,
          rankRes,
          bloodGroupRes,
          arrivalsRes,
          departuresRes,
        ] = await Promise.all([
          supabase.from("trainees").select("*", { count: "exact", head: true }),
          supabase.from("staff").select("*", { count: "exact", head: true }),
          supabase.from("today_attendance_summary" as any).select("*"),
          supabase.from("trainee_district_distribution" as any).select("*"),
          supabase.from("trainee_rank_distribution" as any).select("*"),
          supabase.from("blood_group_distribution" as any).select("*"),
          supabase.from("recent_arrivals" as any).select("*"),
          supabase.from("upcoming_departures" as any).select("*"),
        ]);

        const noErrors =
          !traineesCountRes.error &&
          !staffCountRes.error &&
          !attendanceRes.error &&
          !districtRes.error &&
          !rankRes.error &&
          !bloodGroupRes.error &&
          !arrivalsRes.error &&
          !departuresRes.error;

        if (noErrors) {
          return {
            totalTrainees: traineesCountRes.count || 0,
            totalStaff: staffCountRes.count || 0,
            todayAttendance: attendanceRes.data || [],
            districtDistribution: districtRes.data || [],
            rankDistribution: rankRes.data || [],
            bloodGroupDistribution: bloodGroupRes.data || [],
            recentArrivals: arrivalsRes.data || [],
            upcomingDepartures: departuresRes.data || [],
          };
        }
      } catch (err) {
        console.warn("DB dashboard views not found or errored, falling back to client-side grouping:", err);
      }

      // 2. Client-side grouping fallback
      return await computeClientSideDashboardData();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });
}

async function computeClientSideDashboardData(): Promise<DashboardData> {
  const [traineesRes, staffRes, attendanceRes] = await Promise.all([
    supabase
      .from("trainees")
      .select("id, name, pno, rank, current_posting_district, arrival_date, departure_date, blood_group"),
    supabase
      .from("staff")
      .select("id, name, pno, rank, current_posting_district, arrival_date, departure_date, blood_group"),
    supabase
      .from("trainee_attendance")
      .select("status, date"),
  ]);

  if (traineesRes.error) throw traineesRes.error;
  if (staffRes.error) throw staffRes.error;
  if (attendanceRes.error) throw attendanceRes.error;

  const trainees = traineesRes.data || [];
  const staff = staffRes.data || [];
  const attendance = attendanceRes.data || [];

  const todayStr = new Date().toISOString().split("T")[0];

  // Total Counts
  const totalTrainees = trainees.length;
  const totalStaff = staff.length;

  // Today's Attendance Summary
  const todayAttendanceMap: { [key: string]: number } = {};
  attendance
    .filter((a) => a.date === todayStr)
    .forEach((a) => {
      todayAttendanceMap[a.status] = (todayAttendanceMap[a.status] || 0) + 1;
    });
  const todayAttendance = Object.keys(todayAttendanceMap).map((status) => ({
    status,
    count: todayAttendanceMap[status],
  }));

  // District Distribution (Trainees)
  const districtMap: { [key: string]: number } = {};
  trainees.forEach((t) => {
    const d = t.current_posting_district || "Unknown";
    districtMap[d] = (districtMap[d] || 0) + 1;
  });
  const districtDistribution = Object.keys(districtMap)
    .map((district) => ({
      district,
      count: districtMap[district],
    }))
    .sort((a, b) => b.count - a.count);

  // Rank Distribution (Trainees)
  const rankMap: { [key: string]: number } = {};
  trainees.forEach((t) => {
    const r = t.rank || "Unknown";
    rankMap[r] = (rankMap[r] || 0) + 1;
  });
  const rankDistribution = Object.keys(rankMap)
    .map((rank) => ({
      rank,
      count: rankMap[rank],
    }))
    .sort((a, b) => b.count - a.count);

  // Blood Group Distribution (Trainees)
  const bloodGroupMap: { [key: string]: number } = {};
  trainees.forEach((t) => {
    const bg = t.blood_group || "Unknown";
    bloodGroupMap[bg] = (bloodGroupMap[bg] || 0) + 1;
  });
  const bloodGroupDistribution = Object.keys(bloodGroupMap)
    .map((blood_group) => ({
      blood_group,
      count: bloodGroupMap[blood_group],
    }))
    .sort((a, b) => b.count - a.count);

  const today = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(today.getDate() - 7);
  const sevenDaysHence = new Date();
  sevenDaysHence.setDate(today.getDate() + 7);

  // Recent Arrivals (last 7 days)
  const recentArrivals = trainees
    .filter((t) => {
      if (!t.arrival_date) return false;
      const arr = new Date(t.arrival_date);
      return arr >= sevenDaysAgo && arr <= today;
    })
    .map((t) => ({
      id: t.id,
      name: t.name,
      pno: t.pno,
      rank: t.rank,
      current_posting_district: t.current_posting_district,
      arrival_date: t.arrival_date,
    }))
    .sort((a, b) => new Date(b.arrival_date).getTime() - new Date(a.arrival_date).getTime());

  // Upcoming Departures (next 7 days)
  const upcomingDepartures = trainees
    .filter((t) => {
      if (!t.departure_date) return false;
      const dep = new Date(t.departure_date);
      return dep >= today && dep <= sevenDaysHence;
    })
    .map((t) => ({
      id: t.id,
      name: t.name,
      pno: t.pno,
      rank: t.rank,
      current_posting_district: t.current_posting_district,
      departure_date: t.departure_date,
    }))
    .sort((a, b) => new Date(a.departure_date).getTime() - new Date(b.departure_date).getTime());

  return {
    totalTrainees,
    totalStaff,
    todayAttendance,
    districtDistribution,
    rankDistribution,
    bloodGroupDistribution,
    recentArrivals,
    upcomingDepartures,
  };
}
