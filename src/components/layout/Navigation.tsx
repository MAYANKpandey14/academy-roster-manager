
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Navigation() {
  const location = useLocation();
  
  const routes = [
    { name: "Trainee", path: "/trainees" },
    { name: "Staff", path: "/staff" },
    { name: "Attendance", path: "/attendance" },
    { name: "Leave", path: "/leave" },
  ];

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center space-x-4">
          {routes.map((route) => (
            <Button
              key={route.path}
              variant={location.pathname.startsWith(route.path) ? "default" : "ghost"}
              asChild
            >
              <Link to={route.path}>{route.name}</Link>
            </Button>
          ))}
        </div>
      </div>
    </nav>
  );
}
