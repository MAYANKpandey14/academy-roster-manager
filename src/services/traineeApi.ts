
import { supabase } from "@/integrations/supabase/client";

export async function deleteTrainee(id: string): Promise<{ error: Error | null }> {
  try {
    // Get current auth session to include the auth token
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      throw new Error(`Session error: ${sessionError.message}`);
    }

    if (!sessionData.session) {
      throw new Error("No active session found");
    }
    
    const { error } = await supabase
      .from('trainees')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return { error: null };
  } catch (error) {
    console.error('Error deleting trainee:', error);
    return { 
      error: error instanceof Error ? error : new Error('Unknown error') 
    };
  }
}
