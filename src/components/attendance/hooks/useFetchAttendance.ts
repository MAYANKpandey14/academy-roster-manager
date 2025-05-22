
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { PersonType } from "../types/attendanceTypes";

export interface AttendanceRecord {
  date: string;
  type: string;
  reason: string;
  approvalStatus: string;
  recordType: "attendance" | "leave";
  recordId: string;
  leave_type?: string;
}

export interface LeavePeriod {
  id: string;
  start_date: string;
  end_date: string;
  reason: string;
  leave_type: string;
  status: string;
}

export function useFetchAttendance(
  personId: string | undefined,
  personType: PersonType,
  selectedMonth: Date
) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);

  useEffect(() => {
    if (!personId) {
      setAttendanceRecords([]);
      setIsLoading(false);
      return;
    }

    const fetchAttendance = async () => {
      setIsLoading(true);
      try {
        // Format date range for the selected month
        const year = selectedMonth.getFullYear();
        const month = selectedMonth.getMonth();
        const startDate = new Date(year, month, 1);
        const endDate = new Date(year, month + 1, 0);

        const formattedStartDate = format(startDate, "yyyy-MM-dd");
        const formattedEndDate = format(endDate, "yyyy-MM-dd");

        // Determine which tables to query based on personType
        const attendanceTable = personType === "trainee" ? "trainee_attendance" : "staff_attendance";
        const leaveTable = personType === "trainee" ? "trainee_leave" : "staff_leave";
        const personIdField = personType === "trainee" ? "trainee_id" : "staff_id";

        // Fetch attendance records
        const { data: attendanceData, error: attendanceError } = await supabase
          .from(attendanceTable)
          .select("*")
          .eq(personIdField, personId)
          .gte("date", formattedStartDate)
          .lte("date", formattedEndDate);

        if (attendanceError) throw new Error(`Error fetching attendance: ${attendanceError.message}`);

        // Fetch leave records
        const { data: leaveData, error: leaveError } = await supabase
          .from(leaveTable)
          .select("*")
          .eq(personIdField, personId)
          .or(`start_date.lte.${formattedEndDate},end_date.gte.${formattedStartDate}`);

        if (leaveError) throw new Error(`Error fetching leaves: ${leaveError.message}`);

        // Process attendance records
        const formattedAttendance: AttendanceRecord[] = (attendanceData || []).map((record) => {
          // Extract status and reason from the status field if it contains a colon
          const statusParts = record.status.split(":");
          const status = statusParts[0].trim();
          const reason = statusParts.length > 1 ? statusParts.slice(1).join(":").trim() : "";

          return {
            date: format(new Date(record.date), "yyyy-MM-dd"),
            type: status,
            reason: reason,
            approvalStatus: record.approval_status || "pending",
            recordType: "attendance",
            recordId: record.id,
          };
        });

        // Process leave records
        const formattedLeaves: AttendanceRecord[] = [];

        (leaveData || []).forEach((leave) => {
          const startDate = new Date(leave.start_date);
          const endDate = new Date(leave.end_date);

          // For each day in the leave period that falls within the selected month
          let currentDate = new Date(Math.max(startDate.getTime(), startDate.getTime()));
          const monthEndDate = new Date(Math.min(endDate.getTime(), endDate.getTime()));

          while (currentDate <= monthEndDate) {
            // Only include days within the selected month
            if (
              currentDate.getMonth() === selectedMonth.getMonth() &&
              currentDate.getFullYear() === selectedMonth.getFullYear()
            ) {
              formattedLeaves.push({
                date: format(currentDate, "yyyy-MM-dd"),
                type: "on_leave",
                reason: leave.reason || "",
                approvalStatus: leave.status || "pending",
                recordType: "leave",
                recordId: leave.id,
                leave_type: leave.leave_type,
              });
            }
            currentDate.setDate(currentDate.getDate() + 1);
          }
        });

        // Combine and sort all records by date
        const allRecords = [...formattedAttendance, ...formattedLeaves].sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );

        setAttendanceRecords(allRecords);
      } catch (err) {
        console.error("Error in useFetchAttendance:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoading(false);
      }
    };

    fetchAttendance();
  }, [personId, personType, selectedMonth]);

  return { attendanceRecords, isLoading, error };
}
