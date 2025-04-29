import React from "react";
import { Staff } from "@/types/staff";
import { StaffInfoField } from "./StaffInfoField";
import { formatDate } from "@/utils/textUtils";

export function StaffDetailsSection({ staff }: { staff: Staff }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <StaffInfoField label="पी.एन.ओ." value={staff.pno || "N/A"} />
      <StaffInfoField label="नाम" value={staff.name || "N/A"} />
      <StaffInfoField label="पिता का नाम" value={staff.father_name || "N/A"} />
      <StaffInfoField
        label="जन्म तिथि"
        value={formatDate(staff.date_of_birth)}
      />
      <StaffInfoField label="लिंग" value={staff.gender || "N/A"} />
      <StaffInfoField label="मोबाइल नंबर" value={staff.mobile_number || "N/A"} />
      <StaffInfoField label="शिक्षा" value={staff.education || "N/A"} />
      <StaffInfoField label="नियुक्ति तिथि" value={formatDate(staff.joining_date)} />
      <StaffInfoField label="वर्तमान तैनाती जिला" value={staff.posting_district || "N/A"} />
      <StaffInfoField label="घर का पता" value={staff.home_address || "N/A"} />
      <StaffInfoField label="रक्त समूह" value={staff.blood_group || "N/A"} />
      <StaffInfoField label="नामांकित व्यक्ति" value={staff.nominee || "N/A"} />
    </div>
  );
}
