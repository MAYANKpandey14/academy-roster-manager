import { useState, useEffect } from "react";
import { differenceInYears, isAfter, parseISO } from "date-fns";
import { supabase } from "@/integrations/supabase/client";

export interface ValidationWarning {
  field: string;
  message: string;
  messageHi: string;
  severity: "warning" | "info";
}

interface UseIntelligentValidationProps {
  formData: {
    pno?: string;
    mobile_number?: string;
    date_of_birth?: string;
    date_of_joining?: string;
    arrival_date?: string;
    departure_date?: string;
  };
  personType: "trainee" | "staff";
  isEditing?: boolean;
}

export function useIntelligentValidation({
  formData,
  personType,
  isEditing = false,
}: UseIntelligentValidationProps) {
  const [warnings, setWarnings] = useState<ValidationWarning[]>([]);
  const [isCheckingDuplicates, setIsCheckingDuplicates] = useState(false);

  const {
    pno,
    mobile_number,
    date_of_birth,
    date_of_joining,
    arrival_date,
    departure_date,
  } = formData;

  useEffect(() => {
    const activeWarnings: ValidationWarning[] = [];
    const today = new Date();

    // 1. Date rules
    // Birthdate parsing
    let dobDate: Date | null = null;
    if (date_of_birth) {
      try {
        dobDate = parseISO(date_of_birth);
        if (isNaN(dobDate.getTime())) {
          dobDate = new Date(date_of_birth);
        }
      } catch (e) {}
    }

    if (dobDate && !isNaN(dobDate.getTime())) {
      // Future DOB check
      if (isAfter(dobDate, today)) {
        activeWarnings.push({
          field: "date_of_birth",
          message: "Date of Birth cannot be in the future.",
          messageHi: "जन्म तिथि भविष्य में नहीं हो सकती।",
          severity: "warning",
        });
      } else {
        const age = differenceInYears(today, dobDate);
        if (age > 55) {
          activeWarnings.push({
            field: "date_of_birth",
            message: `Age calculates to ${age} years — unusual for a ${personType}.`,
            messageHi: `उम्र ${age} वर्ष है — एक ${personType === 'trainee' ? 'प्रशिक्षु' : 'स्टाफ'} के लिए असामान्य है।`,
            severity: "warning",
          });
        } else if (age < 18) {
          activeWarnings.push({
            field: "date_of_birth",
            message: `Age calculates to ${age} years — less than 18 years.`,
            messageHi: `उम्र ${age} वर्ष है — 18 वर्ष से कम है।`,
            severity: "warning",
          });
        }
      }
    }

    // Joining date parsing
    let joiningDate: Date | null = null;
    if (date_of_joining) {
      try {
        joiningDate = parseISO(date_of_joining);
        if (isNaN(joiningDate.getTime())) {
          joiningDate = new Date(date_of_joining);
        }
      } catch (e) {}
    }

    if (joiningDate && !isNaN(joiningDate.getTime())) {
      // Date of joining before DOB
      if (dobDate && !isNaN(dobDate.getTime()) && isAfter(dobDate, joiningDate)) {
        activeWarnings.push({
          field: "date_of_joining",
          message: "Date of joining cannot be before date of birth.",
          messageHi: "नियुक्ति की तारीख जन्म तिथि से पहले नहीं हो सकती।",
          severity: "warning",
        });
      }
    }

    // Arrival date parsing
    let arrivalDate: Date | null = null;
    if (arrival_date) {
      try {
        arrivalDate = parseISO(arrival_date);
        if (isNaN(arrivalDate.getTime())) {
          arrivalDate = new Date(arrival_date);
        }
      } catch (e) {}
    }

    if (arrivalDate && !isNaN(arrivalDate.getTime())) {
      // Arrival date before joining date
      if (joiningDate && !isNaN(joiningDate.getTime()) && isAfter(joiningDate, arrivalDate)) {
        activeWarnings.push({
          field: "arrival_date",
          message: "Arrival date cannot be before date of joining.",
          messageHi: "आगमन की तारीख नियुक्ति की तारीख से पहले नहीं हो सकती।",
          severity: "warning",
        });
      }
    }

    // Departure date parsing
    let departureDate: Date | null = null;
    if (departure_date) {
      try {
        departureDate = parseISO(departure_date);
        if (isNaN(departureDate.getTime())) {
          departureDate = new Date(departure_date);
        }
      } catch (e) {}
    }

    if (departureDate && !isNaN(departureDate.getTime()) && arrivalDate && !isNaN(arrivalDate.getTime())) {
      // Departure date before arrival date
      if (isAfter(arrivalDate, departureDate)) {
        activeWarnings.push({
          field: "departure_date",
          message: "Departure date cannot be before arrival date.",
          messageHi: "प्रस्थान की तारीख आगमन की तारीख से पहले नहीं हो सकती।",
          severity: "warning",
        });
      }
    }

    setWarnings(activeWarnings);
  }, [date_of_birth, date_of_joining, arrival_date, departure_date, personType]);

  // Debounced duplicate mobile check
  useEffect(() => {
    if (!mobile_number || mobile_number.length !== 10 || !/^\d{10}$/.test(mobile_number)) {
      setWarnings(prev => prev.filter(w => w.field !== "mobile_number"));
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setIsCheckingDuplicates(true);
      try {
        // Query trainees
        let traineeQuery = supabase
          .from("trainees")
          .select("name, pno, mobile_number")
          .eq("mobile_number", mobile_number);
        
        if (isEditing && pno) {
          traineeQuery = traineeQuery.neq("pno", pno);
        }

        const { data: traineeData } = await traineeQuery;

        // Query staff
        let staffQuery = supabase
          .from("staff")
          .select("name, pno, mobile_number")
          .eq("mobile_number", mobile_number);

        if (isEditing && pno) {
          staffQuery = staffQuery.neq("pno", pno);
        }

        const { data: staffData } = await staffQuery;

        const duplicates: { name: string; pno: string; type: string }[] = [];

        if (traineeData && traineeData.length > 0) {
          traineeData.forEach(item => {
            duplicates.push({ name: item.name, pno: item.pno, type: "Trainee" });
          });
        }
        if (staffData && staffData.length > 0) {
          staffData.forEach(item => {
            duplicates.push({ name: item.name, pno: item.pno, type: "Staff" });
          });
        }

        if (duplicates.length > 0) {
          const duplicateList = duplicates
            .map(d => `${d.name} (${d.type === "Trainee" ? "Trainee" : "Staff"} PNO: ${d.pno})`)
            .join(", ");
          const msgEn = `Mobile number is already used by: ${duplicateList}`;
          const msgHi = `यह मोबाइल नंबर पहले से ही पंजीकृत है: ${duplicates
            .map(d => `${d.name} (${d.type === "Trainee" ? "प्रशिक्षु" : "स्टाफ"} PNO: ${d.pno})`)
            .join(", ")}`;
          
          setWarnings(prev => {
            const clean = prev.filter(w => w.field !== "mobile_number");
            return [
              ...clean,
              {
                field: "mobile_number",
                message: msgEn,
                messageHi: msgHi,
                severity: "info",
              },
            ];
          });
        } else {
          setWarnings(prev => prev.filter(w => w.field !== "mobile_number"));
        }
      } catch (err) {
        console.error("Error checking duplicate mobile:", err);
      } finally {
        setIsCheckingDuplicates(false);
      }
    }, 500);

    return () => {
      clearTimeout(delayDebounce);
    };
  }, [mobile_number, pno, isEditing]);

  return { warnings, isCheckingDuplicates };
}
