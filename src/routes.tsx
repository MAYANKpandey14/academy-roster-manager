import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AttendancePage from './pages/AttendancePage';
import TraineeList from './pages/TraineeList';
import StaffList from './pages/StaffList';
import AddTrainee from './pages/AddTrainee';
import EditTrainee from './pages/EditTrainee';
import StaffRegister from './pages/StaffRegister';
import EditStaff from './pages/EditStaff';
import Dashboard from './pages/Dashboard';
import AttendanceView from './pages/AttendanceView';
import TraineeAttendanceView from './pages/TraineeAttendanceView';
import Archive from './pages/Archive';
import ComprehensiveAttendance from "@/pages/ComprehensiveAttendance";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/trainees" element={<TraineeList />} />
      <Route path="/staff" element={<StaffList />} />
      <Route path="/add-trainee" element={<AddTrainee />} />
      <Route path="/edit-trainee/:id" element={<EditTrainee />} />
      <Route path="/staff-register" element={<StaffRegister />} />
      <Route path="/edit-staff/:id" element={<EditStaff />} />
      <Route path="/attendance" element={<AttendancePage />} />
      <Route path="/comprehensive-attendance" element={<ComprehensiveAttendance />} />
      <Route path="/attendance-view/:staffId" element={<AttendanceView />} />
      <Route path="/trainee-attendance-view/:traineeId" element={<TraineeAttendanceView />} />
      <Route path="/archive" element={<Archive />} />
    </Routes>
  );
};
