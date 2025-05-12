
import { 
  AbsenceType, 
  AttendanceRecord, 
  AttendanceType, 
  DatabaseAbsence, 
  DatabaseLeave 
} from "./types";
import { ApprovalStatus } from "@/types/attendance";
import { format } from "date-fns";

/**
 * Determines if a status requires approval
 */
export function requiresApproval(status: AttendanceType): boolean {
  return ['on_leave', 'resignation'].includes(status);
}

/**
 * Normalizes approval status from database value
 */
export function normalizeApprovalStatus(status?: string): ApprovalStatus {
  if (status === 'approved') return 'approved';
  if (status === 'rejected') return 'rejected';
  return 'pending';
}

/**
 * Converts database absence record to unified AttendanceRecord format
 */
export const mapAbsenceToAttendanceRecord = (absence: DatabaseAbsence): AttendanceRecord => {
  // Determine if this is a special status like suspension/resignation
  const isSpecialStatus = ['suspension', 'resignation', 'termination', 'on_leave', 'leave'].includes(absence.status);
  const type: AttendanceType = isSpecialStatus ? absence.status as AttendanceType : 'absent';
  const absenceType: AbsenceType = isSpecialStatus ? 
    absence.status as AbsenceType : 
    'absent';

  // Normalize approval status
  const approvalStatus: ApprovalStatus = normalizeApprovalStatus(absence.approval_status);

  return {
    id: `absence-${absence.id}`,
    recordId: absence.id,
    recordType: 'absence',
    date: absence.date,
    type,
    reason: absence.reason || absence.status,
    approvalStatus,
    absenceType,
    status: absence.status,
    approval_status: approvalStatus
  };
};

/**
 * Converts database leave record to unified AttendanceRecord format
 */
export const mapLeaveToAttendanceRecord = (leave: DatabaseLeave): AttendanceRecord => {
  // Format date display (single date or range)
  let dateDisplay: string;
  let duration: string | undefined;

  try {
    const startDate = new Date(leave.start_date);
    const endDate = new Date(leave.end_date);

    // Calculate duration in days
    const durationMs = endDate.getTime() - startDate.getTime();
    const durationDays = Math.ceil(durationMs / (1000 * 60 * 60 * 24)) + 1;
    duration = `${durationDays} ${durationDays === 1 ? 'day' : 'days'}`;

    // Format dates for display
    dateDisplay = leave.start_date === leave.end_date 
      ? format(startDate, 'yyyy-MM-dd') 
      : `${format(startDate, 'yyyy-MM-dd')} - ${format(endDate, 'yyyy-MM-dd')}`;
  } catch (error) {
    console.error('Error formatting dates:', error);
    dateDisplay = `${leave.start_date} - ${leave.end_date}`;
  }

  // Normalize approval status
  const approvalStatus: ApprovalStatus = normalizeApprovalStatus(leave.status);

  return {
    id: `leave-${leave.id}`,
    recordId: leave.id,
    recordType: 'leave',
    date: dateDisplay,
    type: 'on_leave',
    reason: leave.reason || '',
    leave_type: leave.leave_type,
    approvalStatus,
    absenceType: 'on_leave',
    duration,
    status: 'on_leave',
    approval_status: approvalStatus
  };
};

/**
 * Sort attendance records by date (most recent first)
 */
export const sortAttendanceRecords = (records: AttendanceRecord[]): AttendanceRecord[] => {
  return records.sort((a, b) => {
    // Extract start date (for date ranges)
    const dateA = a.date.split(' - ')[0];
    const dateB = b.date.split(' - ')[0];
    
    // Sort by date (most recent first)
    return new Date(dateB).getTime() - new Date(dateA).getTime();
  });
};
