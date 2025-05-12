
import { 
  AttendanceFetchParams,
  AttendanceRecord,
  DatabaseAbsence,
  DatabaseLeave
} from "./types";
import { 
  mapAbsenceToAttendanceRecord, 
  mapLeaveToAttendanceRecord, 
  sortAttendanceRecords 
} from "./mapping-utils";
import {
  fetchAbsenceRecords,
  fetchLeaveRecords,
  AttendanceFetchError
} from "./data-access";
import {
  submitAbsenceRecord,
  submitLeaveRecord,
  updateApprovalStatus
} from "./submission";

/**
 * Fetch attendance records from the database
 */
export async function fetchAttendanceRecords({
  personId,
  personType,
  startDate,
  endDate,
  limit = 50
}: AttendanceFetchParams): Promise<AttendanceRecord[]> {
  if (!personId) {
    return [];
  }
  
  try {
    // Fetch absence and leave data in parallel
    const [absences, leaves] = await Promise.all([
      fetchAbsenceRecords(personId, personType, startDate, endDate, limit),
      fetchLeaveRecords(personId, personType, startDate, endDate, limit)
    ]);
    
    // Format and combine data
    const formattedAbsences = absences.map(mapAbsenceToAttendanceRecord);
    const formattedLeaves = leaves.map(mapLeaveToAttendanceRecord);
    
    // Sort combined records
    return sortAttendanceRecords([...formattedAbsences, ...formattedLeaves]);
  } catch (error) {
    // Wrap error for consistent handling
    if (error instanceof AttendanceFetchError) {
      throw error;
    }
    console.error("Error fetching attendance records:", error);
    throw new AttendanceFetchError("Failed to fetch attendance records", error);
  }
}

// Re-export submission functions for convenience
export {
  submitAbsenceRecord,
  submitLeaveRecord,
  updateApprovalStatus,
  AttendanceFetchError
};
