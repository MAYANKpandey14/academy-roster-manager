
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

export function Navigation() {
  const location = useLocation();
  const { t } = useTranslation();
  
  const routes = [
    { name: t("trainees"), path: "/trainees" },
    { name: t("staff"), path: "/staff" },
    { name: t("attendance"), path: "/attendance" },
    { name: t("leave"), path: "/leave" },
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
