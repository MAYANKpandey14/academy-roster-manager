
import { AttendancePersonType, TableConfig } from "@/types/attendance-records";

/**
 * Get the appropriate table names and ID fields based on person type
 */
export function getTableConfig(personType: AttendancePersonType): TableConfig {
  return {
    absenceTable: personType === 'trainee' ? 'trainee_attendance' : 'staff_attendance',
    absenceIdField: personType === 'trainee' ? 'trainee_id' : 'staff_id',
    leaveTable: personType === 'trainee' ? 'trainee_leave' : 'staff_leave',
    leaveIdField: personType === 'trainee' ? 'trainee_id' : 'staff_id'
  };
}
