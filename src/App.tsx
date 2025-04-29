
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import NotFound from "./pages/NotFound";
import AddTrainee from "./pages/AddTrainee";
import EditTrainee from "./pages/EditTrainee";
import ViewTrainee from "./pages/ViewTrainee";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import TraineesPage from "./pages/TraineesPage";
import StaffPage from "./pages/StaffPage";
import AttendancePage from "./pages/AttendancePage";
import AddStaff from "./pages/AddStaff";
import EditStaff from "./pages/EditStaff";
import ViewStaff from "./pages/ViewStaff";
import Welcome from "./pages/Welcome";
import { LanguageProvider } from "./contexts/LanguageContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  }
});

const App = () => (
  <LanguageProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route
              path="/welcome"
              element={
                <ProtectedRoute>
                  <Welcome />
                </ProtectedRoute>} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Navigate to="/trainees" replace />
                </ProtectedRoute>
              }
            />
            <Route
              path="/trainees"
              element={
                <ProtectedRoute>
                  <TraineesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/staff"
              element={
                <ProtectedRoute>
                  <StaffPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/attendance"
              element={
                <ProtectedRoute>
                  <AttendancePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/add-trainee"
              element={
                <ProtectedRoute>
                  <AddTrainee />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit-trainee/:id"
              element={
                <ProtectedRoute>
                  <EditTrainee />
                </ProtectedRoute>
              }
            />
            <Route
              path="/view-trainee/:id"
              element={
                <ProtectedRoute>
                  <ViewTrainee />
                </ProtectedRoute>
              }
            />
            <Route
              path="/add-staff"
              element={
                <ProtectedRoute>
                  <AddStaff />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit-staff/:id"
              element={
                <ProtectedRoute>
                  <EditStaff />
                </ProtectedRoute>
              }
            />
            <Route
              path="/view-staff/:id"
              element={
                <ProtectedRoute>
                  <ViewStaff />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </LanguageProvider>
);

export default App;
