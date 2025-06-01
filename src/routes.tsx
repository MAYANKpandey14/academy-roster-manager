
import { Routes, Route } from 'react-router-dom';
import AttendancePage from './pages/AttendancePage';
import AddTrainee from './pages/AddTrainee';
import StaffRegister from './pages/StaffRegister';
import ComprehensiveAttendance from "@/pages/ComprehensiveAttendance";
import Index from "./pages/Index";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/dashboard" element={<Index />} />
      <Route path="/trainees" element={<Index />} />
      <Route path="/staff" element={<Index />} />
      <Route path="/add-trainee" element={<AddTrainee />} />
      <Route path="/staff-register" element={<StaffRegister />} />
      <Route path="/attendance" element={<AttendancePage />} />
      <Route path="/comprehensive-attendance" element={<ComprehensiveAttendance />} />
    </Routes>
  );
};
