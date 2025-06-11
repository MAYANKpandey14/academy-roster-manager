
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import NotFound from "@/pages/NotFound";
import ResetPassword from "@/pages/ResetPassword";
import StaffPage from "@/pages/StaffPage";
import AddStaff from "@/pages/AddStaff";
import EditStaff from "@/pages/EditStaff";
import ViewStaff from "@/pages/ViewStaff";
import StaffAttendancePage from "@/pages/StaffAttendancePage";
import TraineesPage from "@/pages/TraineesPage";
import AddTrainee from "@/pages/AddTrainee";
import EditTrainee from "@/pages/EditTrainee";
import ViewTrainee from "@/pages/ViewTrainee";
import TraineeAttendancePage from "@/pages/TraineeAttendancePage";
import AttendancePage from "@/pages/AttendancePage";
import LeavePage from "@/pages/LeavePage";
import Welcome from "@/pages/Welcome";
import TraineeRegister from "@/pages/TraineeRegister";
import StaffRegister from "@/pages/StaffRegister";
import ArchivePage from "@/pages/ArchivePage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/trainees" replace />,
  },
  {
    path: "welcome",
    element: <Welcome />,
  },
  {
    path: "login",
    element: <Auth />,
  },
  {
    // Add a redirect from the old auth path to login
    path: "auth",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "reset-password",
    element: <ResetPassword />,
  },
  {
    path: "staff",
    element: <ProtectedRoute><StaffPage /></ProtectedRoute>,
  },
  {
    path: "staff/add",
    element: <ProtectedRoute><AddStaff /></ProtectedRoute>,
  },
  {
    path: "staff/:id/edit",
    element: <ProtectedRoute><EditStaff /></ProtectedRoute>,
  },
  {
    path: "staff/:id/attendance",
    element: <ProtectedRoute><StaffAttendancePage /></ProtectedRoute>,
  },
  {
    path: "staff/:id",
    element: <ProtectedRoute><ViewStaff /></ProtectedRoute>,
  },
  {
    path: "trainees",
    element: <ProtectedRoute><TraineesPage /></ProtectedRoute>,
  },
  {
    path: "trainees/add",
    element: <ProtectedRoute><AddTrainee /></ProtectedRoute>,
  },
  {
    path: "trainees/:id/edit",
    element: <ProtectedRoute><EditTrainee /></ProtectedRoute>,
  },
  {
    path: "trainees/:id/attendance",
    element: <ProtectedRoute><TraineeAttendancePage /></ProtectedRoute>,
  },
  {
    path: "trainees/:id",
    element: <ProtectedRoute><ViewTrainee /></ProtectedRoute>,
  },
  {
    path: "attendance",
    element: <ProtectedRoute><AttendancePage /></ProtectedRoute>,
  },
  {
    path: "leave",
    element: <ProtectedRoute><LeavePage /></ProtectedRoute>,
  },
  {
    path: "archive",
    element: <ProtectedRoute><ArchivePage /></ProtectedRoute>,
  },
  {
    path: "trainee-register",
    element: <TraineeRegister />,
  },
  {
    path: "staff-register",
    element: <StaffRegister />,
  },
  {
    // Add a redirect from the old register path to trainee-register
    path: "register",
    element: <Navigate to="/trainee-register" replace />,
  },
  {
    path: "/staff-register",
    element: <StaffRegister />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

// Create the AppRoutes component that will be the default export
const AppRoutes = () => {
  return <RouterProvider router={router} />;
};

export default AppRoutes;
