
import { supabase } from "@/integrations/supabase/client";

export async function unarchiveStaff(staffId: string): Promise<{ error: Error | null }> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.access_token) {
      throw new Error("No active session. Please log in again.");
    }
    
    const { error } = await supabase.functions.invoke('unarchive-staff', {
      body: { id: staffId },
      headers: {
        Authorization: `Bearer ${session.access_token}`
      }
    });
    
    if (error) {
      console.error("Error unarchiving staff:", error);
      throw error;
    }
    
    return { error: null };
  } catch (error) {
    console.error('Error unarchiving staff:', error);
    return { 
      error: error instanceof Error ? error : new Error('Unknown error') 
    };
  }
}

export async function unarchiveTrainee(traineeId: string): Promise<{ error: Error | null }> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.access_token) {
      throw new Error("No active session. Please log in again.");
    }
    
    const { error } = await supabase.functions.invoke('unarchive-trainee', {
      body: { id: traineeId },
      headers: {
        Authorization: `Bearer ${session.access_token}`
      }
    });
    
    if (error) {
      console.error("Error unarchiving trainee:", error);
      throw error;
    }
    
    return { error: null };
  } catch (error) {
    console.error('Error unarchiving trainee:', error);
    return { 
      error: error instanceof Error ? error : new Error('Unknown error') 
    };
  }
}
