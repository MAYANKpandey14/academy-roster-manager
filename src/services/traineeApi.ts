
import { Trainee } from "@/types/trainee";
import { supabase } from "@/integrations/supabase/client";

export async function deleteTrainee(id: string): Promise<{ error: Error | null }> {
  try {
    // Get the current session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.access_token) {
      throw new Error("No active session. Please log in again.");
    }
    
    const { error } = await supabase.functions.invoke('delete-trainee', {
      body: { id },
      headers: {
        Authorization: `Bearer ${session.access_token}`
      }
    });
    
    if (error) {
      console.error("Error deleting trainee:", error);
      throw error;
    }
    
    return { error: null };
  } catch (error) {
    console.error('Error deleting trainee:', error);
    return { 
      error: error instanceof Error ? error : new Error('Unknown error') 
    };
  }
}
