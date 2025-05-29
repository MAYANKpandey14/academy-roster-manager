
import { ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types/auth';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useLanguage } from '@/contexts/LanguageContext';

interface RoleGuardProps {
  children: ReactNode;
  requiredRole: UserRole;
  fallback?: ReactNode;
}

export function RoleGuard({ children, requiredRole, fallback }: RoleGuardProps) {
  const { hasRole, loading } = useAuth();
  const { isHindi } = useLanguage();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!hasRole(requiredRole)) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <Alert className="m-4">
        <AlertDescription className={isHindi ? 'font-hindi' : ''}>
          {isHindi 
            ? 'आपके पास इस पेज को देखने की अनुमति नहीं है।' 
            : 'You do not have permission to view this page.'}
        </AlertDescription>
      </Alert>
    );
  }

  return <>{children}</>;
}
