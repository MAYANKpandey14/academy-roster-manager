
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import NotFound from "@/pages/NotFound";
import ResetPassword from "@/pages/ResetPassword";
import StaffPage from "@/pages/StaffPage";
import AddStaff from "@/pages/AddStaff";
import EditStaff from "@/pages/EditStaff";
import ViewStaff from "@/pages/ViewStaff";
import TraineesPage from "@/pages/TraineesPage";
import AddTrainee from "@/pages/AddTrainee";
import EditTrainee from "@/pages/EditTrainee";
import ViewTrainee from "@/pages/ViewTrainee";
import AttendancePage from "@/pages/AttendancePage";
import LeavePage from "@/pages/LeavePage";
import Welcome from "@/pages/Welcome";
import TraineeRegister from "@/pages/TraineeRegister";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute><Index /></ProtectedRoute>,
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
    path: "register",
    element: <TraineeRegister />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

// Create a default export for the router component
const AppRoutes = () => {
  return <RouterProvider router={router} />;
};

export default AppRoutes;
