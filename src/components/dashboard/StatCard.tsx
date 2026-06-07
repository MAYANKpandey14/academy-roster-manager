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
  gradient,
  iconColor,
}: StatCardProps) {
  return (
    <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 bg-white/70 dark:bg-gray-900/50 backdrop-blur-md">
      <CardContent className="p-6 relative">
        {/* Glow decoration */}
        <div className={`absolute top-0 right-0 w-32 h-32 rounded-full filter blur-3xl opacity-10 bg-gradient-to-br ${gradient}`} />
        
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 dynamic-text">
              {title}
            </p>
            <h3 className="text-3xl font-extrabold tracking-tight text-gray-800 dark:text-gray-100">
              {value}
            </h3>
            {description && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 dynamic-text">
                {description}
              </p>
            )}
          </div>
          
          <div className={`h-12 w-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${gradient} ${iconColor} shadow-inner`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
