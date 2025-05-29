
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { UserRole, AuthUser } from '@/types/auth';

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        
        if (session?.user) {
          // Fetch user role from profiles table
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();
          
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            role: profile?.role as UserRole || 'viewer'
          });
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        // Fetch user role
        supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single()
          .then(({ data: profile }) => {
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              role: profile?.role as UserRole || 'viewer'
            });
            setSession(session);
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const hasRole = (requiredRole: UserRole): boolean => {
    if (!user?.role) return false;
    
    const roleHierarchy: Record<UserRole, number> = {
      'viewer': 1,
      'staff': 2,
      'admin': 3
    };
    
    return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
  };

  const signOut = async () => {
    try {
      // Clean up auth state
      localStorage.clear();
      sessionStorage.clear();
      
      // Sign out from Supabase
      await supabase.auth.signOut({ scope: 'global' });
      
      // Force page reload for clean state
      window.location.href = '/login';
    } catch (error) {
      console.error('Error signing out:', error);
      // Force redirect even if signout fails
      window.location.href = '/login';
    }
  };

  return {
    user,
    session,
    loading,
    hasRole,
    signOut,
    isAuthenticated: !!user,
    isAdmin: hasRole('admin'),
    isStaff: hasRole('staff')
  };
}
