
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function Navigation() {
  const location = useLocation();
  
  const routes = [
    { name: "प्रशिक्षु", path: "/trainees" },
    { name: "स्टाफ", path: "/staff" },
    { name: "उपस्थिति", path: "/attendance" },
    { name: "अवकाश", path: "/leave" },
  ];

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-center md:justify-start space-x-2 md:space-x-4 overflow-x-auto">
          {routes.map((route) => (
            <Button
              key={route.path}
              variant={location.pathname.startsWith(route.path) ? "default" : "ghost"}
              size="sm"
              asChild
              className="whitespace-nowrap krutidev-text"
            >
              <Link to={route.path}>{route.name}</Link>
            </Button>
          ))}
        </div>
      </div>
    </nav>
  );
}
