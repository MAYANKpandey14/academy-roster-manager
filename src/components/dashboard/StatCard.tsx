import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  description?: string;
  gradient: string;
  iconColor: string;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  description,
}: Omit<StatCardProps, "gradient" | "iconColor">) {
  return (
    <Card className="overflow-hidden border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-xl transition-all duration-200">
      <CardContent className="p-6 relative">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 dynamic-text">
              {title}
            </p>
            <h3 className="text-3xl font-display font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
              {value}
            </h3>
            {description && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 dynamic-text">
                {description}
              </p>
            )}
          </div>
          
          <div className="h-10 w-10 rounded-lg flex items-center justify-center bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-300">
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
