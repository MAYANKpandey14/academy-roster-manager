import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface DataQualityIssue {
  id: string;
  type: "missing_photo" | "missing_mobile" | "missing_address" | "future_dob" | "departure_before_arrival" | "duplicate_mobile";
  severity: "error" | "warning" | "info";
  personType: "trainee" | "staff";
  personId: string;
  personName: string;
  personPno: string;
  message: string;
  messageHi: string;
}

export interface DataQualityReport {
  score: number;
  totalRecords: number;
  issues: DataQualityIssue[];
  summary: {
    missingPhotos: number;
    missingMobiles: number;
    futureDobs: number;
    dateConflicts: number;
    duplicateMobiles: number;
  };
}

export function useDataQuality() {
  return useQuery<DataQualityReport>({
    queryKey: ["data-quality"],
    queryFn: async () => {
      // 1. Try to fetch from DB views first
      try {
        const { data: traineeQ, error: traineeQErr } = await supabase
          .from("trainee_data_quality" as any)
          .select("*");
        
        const { data: staffQ, error: staffQErr } = await supabase
          .from("staff_data_quality" as any)
          .select("*");

        if (!traineeQErr && !staffQErr && traineeQ && staffQ) {
          return processViewData(traineeQ, staffQ);
        }
      } catch (err) {
        console.warn("DB views not found or errored, falling back to client-side data quality check:", err);
      }

      // 2. Fallback: Fetch raw tables and compute data quality in JS
      return await computeClientSideDataQuality();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });
}

function processViewData(traineeQ: any[], staffQ: any[]): DataQualityReport {
  const issues: DataQualityIssue[] = [];
  let missingPhotos = 0;
  let missingMobiles = 0;
  let futureDobs = 0;
  let dateConflicts = 0;
  let duplicateMobiles = 0;

  const addIssues = (rows: any[], type: "trainee" | "staff") => {
    rows.forEach(r => {
      if (r.missing_photo) {
        missingPhotos++;
        issues.push({
          id: `${r.id}-photo`,
          type: "missing_photo",
          severity: "info",
          personType: type,
          personId: r.id,
          personName: r.name,
          personPno: r.pno,
          message: `${type === "trainee" ? "Trainee" : "Staff"} is missing a photo.`,
          messageHi: `${type === "trainee" ? "प्रशिक्षु" : "स्टाफ"} की फोटो गायब है।`,
        });
      }
      if (r.missing_mobile) {
        missingMobiles++;
        issues.push({
          id: `${r.id}-mobile`,
          type: "missing_mobile",
          severity: "warning",
          personType: type,
          personId: r.id,
          personName: r.name,
          personPno: r.pno,
          message: `${type === "trainee" ? "Trainee" : "Staff"} is missing a mobile number.`,
          messageHi: `${type === "trainee" ? "प्रशिक्षु" : "स्टाफ"} का मोबाइल नंबर गायब है।`,
        });
      }
      if (r.missing_address) {
        issues.push({
          id: `${r.id}-address`,
          type: "missing_address",
          severity: "info",
          personType: type,
          personId: r.id,
          personName: r.name,
          personPno: r.pno,
          message: `${type === "trainee" ? "Trainee" : "Staff"} is missing a home address.`,
          messageHi: `${type === "trainee" ? "प्रशिक्षु" : "स्टाफ"} का घर का पता गायब है।`,
        });
      }
      if (r.future_dob) {
        futureDobs++;
        issues.push({
          id: `${r.id}-future-dob`,
          type: "future_dob",
          severity: "error",
          personType: type,
          personId: r.id,
          personName: r.name,
          personPno: r.pno,
          message: `${type === "trainee" ? "Trainee" : "Staff"} has a future Date of Birth.`,
          messageHi: `${type === "trainee" ? "प्रशिक्षु" : "स्टाफ"} की जन्म तिथि भविष्य में है।`,
        });
      }
      if (r.departure_before_arrival) {
        dateConflicts++;
        issues.push({
          id: `${r.id}-date-conflict`,
          type: "departure_before_arrival",
          severity: "error",
          personType: type,
          personId: r.id,
          personName: r.name,
          personPno: r.pno,
          message: `Departure date is before arrival date.`,
          messageHi: `प्रस्थान की तारीख आगमन की तारीख से पहले है।`,
        });
      }
    });
  };

  addIssues(traineeQ, "trainee");
  addIssues(staffQ, "staff");

  const mobileMap: { [key: string]: { name: string; pno: string; type: "trainee" | "staff"; id: string }[] } = {};
  traineeQ.forEach(t => {
    if (t.mobile_number && t.mobile_number.trim() !== "") {
      if (!mobileMap[t.mobile_number]) mobileMap[t.mobile_number] = [];
      mobileMap[t.mobile_number].push({ name: t.name, pno: t.pno, type: "trainee", id: t.id });
    }
  });
  staffQ.forEach(s => {
    if (s.mobile_number && s.mobile_number.trim() !== "") {
      if (!mobileMap[s.mobile_number]) mobileMap[s.mobile_number] = [];
      mobileMap[s.mobile_number].push({ name: s.name, pno: s.pno, type: "staff", id: s.id });
    }
  });

  Object.keys(mobileMap).forEach(num => {
    const list = mobileMap[num];
    if (list.length > 1) {
      duplicateMobiles += list.length;
      list.forEach(p => {
        const dupListStr = list
          .filter(x => x.id !== p.id)
          .map(x => `${x.name} (${x.type === "trainee" ? "Trainee" : "Staff"} PNO: ${x.pno})`)
          .join(", ");
        issues.push({
          id: `${p.id}-dup-mobile`,
          type: "duplicate_mobile",
          severity: "warning",
          personType: p.type,
          personId: p.id,
          personName: p.name,
          personPno: p.pno,
          message: `Mobile number shared with: ${dupListStr}`,
          messageHi: `मोबाइल नंबर इनके साथ साझा है: ${list
            .filter(x => x.id !== p.id)
            .map(x => `${x.name} (${x.type === "trainee" ? "प्रशिक्षु" : "स्टाफ"} PNO: ${x.pno})`)
            .join(", ")}`,
        });
      });
    }
  });

  const totalRecords = traineeQ.length + staffQ.length;
  let scoreDed = 0;
  issues.forEach(i => {
    if (i.severity === "error") scoreDed += 10;
    else if (i.severity === "warning") scoreDed += 5;
    else scoreDed += 2;
  });

  const score = totalRecords === 0 ? 100 : Math.max(0, Math.min(100, Math.round(100 - (scoreDed / totalRecords) * 10)));

  return {
    score,
    totalRecords,
    issues,
    summary: {
      missingPhotos,
      missingMobiles,
      futureDobs,
      dateConflicts,
      duplicateMobiles,
    },
  };
}

async function computeClientSideDataQuality(): Promise<DataQualityReport> {
  const { data: trainees, error: tErr } = await supabase
    .from("trainees")
    .select("id, name, pno, photo_url, mobile_number, home_address, date_of_birth, arrival_date, departure_date");
    
  const { data: staff, error: sErr } = await supabase
    .from("staff")
    .select("id, name, pno, photo_url, mobile_number, home_address, date_of_birth, arrival_date, departure_date");

  if (tErr) throw tErr;
  if (sErr) throw sErr;

  const issues: DataQualityIssue[] = [];
  const today = new Date();

  let missingPhotos = 0;
  let missingMobiles = 0;
  let futureDobs = 0;
  let dateConflicts = 0;
  let duplicateMobiles = 0;

  const mobileMap: { [key: string]: { name: string; pno: string; type: "trainee" | "staff"; id: string }[] } = {};

  const processPerson = (person: any, type: "trainee" | "staff") => {
    const { id, name, pno, photo_url, mobile_number, home_address, date_of_birth, arrival_date, departure_date } = person;

    if (!photo_url || photo_url.trim() === "") {
      missingPhotos++;
      issues.push({
        id: `${id}-photo`,
        type: "missing_photo",
        severity: "info",
        personType: type,
        personId: id,
        personName: name,
        personPno: pno,
        message: `${type === "trainee" ? "Trainee" : "Staff"} is missing a photo.`,
        messageHi: `${type === "trainee" ? "प्रशिक्षु" : "स्टाफ"} की फोटो गायब है।`,
      });
    }

    if (!mobile_number || mobile_number.trim() === "") {
      missingMobiles++;
      issues.push({
        id: `${id}-mobile`,
        type: "missing_mobile",
        severity: "warning",
        personType: type,
        personId: id,
        personName: name,
        personPno: pno,
        message: `${type === "trainee" ? "Trainee" : "Staff"} is missing a mobile number.`,
        messageHi: `${type === "trainee" ? "प्रशिक्षु" : "स्टाफ"} का मोबाइल नंबर गायब है।`,
      });
    } else {
      if (!mobileMap[mobile_number]) {
        mobileMap[mobile_number] = [];
      }
      mobileMap[mobile_number].push({ name, pno, type, id });
    }

    if (!home_address || home_address.trim() === "") {
      issues.push({
        id: `${id}-address`,
        type: "missing_address",
        severity: "info",
        personType: type,
        personId: id,
        personName: name,
        personPno: pno,
        message: `${type === "trainee" ? "Trainee" : "Staff"} is missing a home address.`,
        messageHi: `${type === "trainee" ? "प्रशिक्षु" : "स्टाफ"} का घर का पता गायब है।`,
      });
    }

    if (date_of_birth) {
      const dob = new Date(date_of_birth);
      if (!isNaN(dob.getTime()) && dob > today) {
        futureDobs++;
        issues.push({
          id: `${id}-future-dob`,
          type: "future_dob",
          severity: "error",
          personType: type,
          personId: id,
          personName: name,
          personPno: pno,
          message: `${type === "trainee" ? "Trainee" : "Staff"} has a future Date of Birth.`,
          messageHi: `${type === "trainee" ? "प्रशिक्षु" : "स्टाफ"} की जन्म तिथि भविष्य में है।`,
        });
      }
    }

    if (arrival_date && departure_date) {
      const arr = new Date(arrival_date);
      const dep = new Date(departure_date);
      if (!isNaN(arr.getTime()) && !isNaN(dep.getTime()) && dep < arr) {
        dateConflicts++;
        issues.push({
          id: `${id}-date-conflict`,
          type: "departure_before_arrival",
          severity: "error",
          personType: type,
          personId: id,
          personName: name,
          personPno: pno,
          message: `Departure date is before arrival date.`,
          messageHi: `प्रस्थान की तारीख आगमन की तारीख से पहले है।`,
        });
      }
    }
  };

  trainees?.forEach(t => processPerson(t, "trainee"));
  staff?.forEach(s => processPerson(s, "staff"));

  Object.keys(mobileMap).forEach(num => {
    const list = mobileMap[num];
    if (list.length > 1) {
      duplicateMobiles += list.length;
      list.forEach(p => {
        const dupListStr = list
          .filter(x => x.id !== p.id)
          .map(x => `${x.name} (${x.type === "trainee" ? "Trainee" : "Staff"} PNO: ${x.pno})`)
          .join(", ");
        issues.push({
          id: `${p.id}-dup-mobile`,
          type: "duplicate_mobile",
          severity: "warning",
          personType: p.type,
          personId: p.id,
          personName: p.name,
          personPno: p.pno,
          message: `Mobile number shared with: ${dupListStr}`,
          messageHi: `मोबाइल नंबर इनके साथ साझा है: ${list
            .filter(x => x.id !== p.id)
            .map(x => `${x.name} (${x.type === "trainee" ? "प्रशिक्षु" : "स्टाफ"} PNO: ${x.pno})`)
            .join(", ")}`,
        });
      });
    }
  });

  const totalTrainees = trainees?.length || 0;
  const totalStaff = staff?.length || 0;
  const totalRecords = totalTrainees + totalStaff;

  let scoreDed = 0;
  issues.forEach(i => {
    if (i.severity === "error") scoreDed += 10;
    else if (i.severity === "warning") scoreDed += 5;
    else scoreDed += 2;
  });

  const score = totalRecords === 0 ? 100 : Math.max(0, Math.min(100, Math.round(100 - (scoreDed / totalRecords) * 10)));

  return {
    score,
    totalRecords,
    issues,
    summary: {
      missingPhotos,
      missingMobiles,
      futureDobs,
      dateConflicts,
      duplicateMobiles,
    },
  };
}
