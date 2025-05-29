
import { supabase } from "@/integrations/supabase/client";
import { Staff } from "@/types/staff";
import { Trainee } from "@/types/trainee";

export async function archiveStaff(staffId: string): Promise<{ error: Error | null }> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.access_token) {
      throw new Error("No active session. Please log in again.");
    }
    
    const { error } = await supabase.functions.invoke('archive-staff', {
      body: { id: staffId },
      headers: {
        Authorization: `Bearer ${session.access_token}`
      }
    });
    
    if (error) {
      console.error("Error archiving staff:", error);
      throw error;
    }
    
    return { error: null };
  } catch (error) {
    console.error('Error archiving staff:', error);
    return { 
      error: error instanceof Error ? error : new Error('Unknown error') 
    };
  }
}

export async function archiveTrainee(traineeId: string): Promise<{ error: Error | null }> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.access_token) {
      throw new Error("No active session. Please log in again.");
    }
    
    const { error } = await supabase.functions.invoke('archive-trainee', {
      body: { id: traineeId },
      headers: {
        Authorization: `Bearer ${session.access_token}`
      }
    });
    
    if (error) {
      console.error("Error archiving trainee:", error);
      throw error;
    }
    
    return { error: null };
  } catch (error) {
    console.error('Error archiving trainee:', error);
    return { 
      error: error instanceof Error ? error : new Error('Unknown error') 
    };
  }
}

export async function archiveAllStaff(staffIds: string[]): Promise<{ error: Error | null }> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.access_token) {
      throw new Error("No active session. Please log in again.");
    }
    
    const { error } = await supabase.functions.invoke('archive-all-staff', {
      body: { ids: staffIds },
      headers: {
        Authorization: `Bearer ${session.access_token}`
      }
    });
    
    if (error) {
      console.error("Error archiving all staff:", error);
      throw error;
    }
    
    return { error: null };
  } catch (error) {
    console.error('Error archiving all staff:', error);
    return { 
      error: error instanceof Error ? error : new Error('Unknown error') 
    };
  }
}

export async function archiveAllTrainees(traineeIds: string[]): Promise<{ error: Error | null }> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.access_token) {
      throw new Error("No active session. Please log in again.");
    }
    
    const { error } = await supabase.functions.invoke('archive-all-trainees', {
      body: { ids: traineeIds },
      headers: {
        Authorization: `Bearer ${session.access_token}`
      }
    });
    
    if (error) {
      console.error("Error archiving all trainees:", error);
      throw error;
    }
    
    return { error: null };
  } catch (error) {
    console.error('Error archiving all trainees:', error);
    return { 
      error: error instanceof Error ? error : new Error('Unknown error') 
    };
  }
}

export async function getArchivedStaff() {
  try {
    const { data, error } = await supabase
      .from('archived_staff')
      .select('*')
      .order('archived_at', { ascending: false });

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error fetching archived staff:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error('Unknown error') 
    };
  }
}

export async function getArchivedTrainees() {
  try {
    const { data, error } = await supabase
      .from('archived_trainees')
      .select('*')
      .order('archived_at', { ascending: false });

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error fetching archived trainees:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error('Unknown error') 
    };
  }
}
