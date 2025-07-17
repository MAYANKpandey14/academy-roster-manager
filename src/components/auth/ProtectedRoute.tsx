
import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null | undefined>();
  const location = useLocation();

  // Public routes that don't require authentication
  const publicRoutes = ['/trainee-register', '/staff-register'];
  
  // Check if current route is public
  const isPublicRoute = publicRoutes.some(route => location.pathname === route);
  
  // If it's a public route, render children without authentication check
  if (isPublicRoute) {
    return <>{children}</>;
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (user === undefined) {
    return null; // or a loading spinner
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
