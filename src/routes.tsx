
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Header } from "@/components/layout/Header";

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
import DashboardPage from "@/pages/DashboardPage";

const AppLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-8 font-sans">
      <Header />
      <Outlet />
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/dashboard" replace />,
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
    element: <ProtectedRoute><AppLayout /></ProtectedRoute>,
    children: [
      {
        path: "dashboard",
        element: <DashboardPage />,
      },
      {
        path: "staff",
        element: <StaffPage />,
      },
      {
        path: "staff/add",
        element: <AddStaff />,
      },
      {
        path: "staff/:id/edit",
        element: <EditStaff />,
      },
      {
        path: "staff/:id/attendance",
        element: <StaffAttendancePage />,
      },
      {
        path: "staff/:id",
        element: <ViewStaff />,
      },
      {
        path: "trainees",
        element: <TraineesPage />,
      },
      {
        path: "trainees/add",
        element: <AddTrainee />,
      },
      {
        path: "trainees/:id/edit",
        element: <EditTrainee />,
      },
      {
        path: "trainees/:id/attendance",
        element: <TraineeAttendancePage />,
      },
      {
        path: "trainees/:id",
        element: <ViewTrainee />,
      },
      {
        path: "attendance",
        element: <AttendancePage />,
      },
      {
        path: "leave",
        element: <LeavePage />,
      },
      {
        path: "archive",
        element: <ArchivePage />,
      },
    ],
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
