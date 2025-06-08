
import { supabase } from "@/integrations/supabase/client";

export async function archiveStaff(staffId: string, folderId?: string): Promise<{ error: Error | null }> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.access_token) {
      throw new Error("No active session. Please log in again.");
    }
    
    console.log("Archiving staff with session:", !!session);
    console.log("Staff ID:", staffId, "Folder ID:", folderId);
    
    const requestBody = { 
      id: staffId,
      folder_id: folderId || null
    };
    
    console.log("Sending request body:", JSON.stringify(requestBody));
    
    const { data, error } = await supabase.functions.invoke('archive-staff', {
      body: JSON.stringify(requestBody),
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (error) {
      console.error("Error archiving staff:", error);
      throw error;
    }
    
    console.log("Staff archived successfully:", data);
    return { error: null };
  } catch (error) {
    console.error('Error archiving staff:', error);
    return { 
      error: error instanceof Error ? error : new Error('Unknown error') 
    };
  }
}

export async function archiveTrainee(traineeId: string, folderId?: string): Promise<{ error: Error | null }> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.access_token) {
      throw new Error("No active session. Please log in again.");
    }
    
    console.log("Archiving trainee with session:", !!session);
    console.log("Trainee ID:", traineeId, "Folder ID:", folderId);
    
    const requestBody = { 
      id: traineeId,
      folder_id: folderId || null
    };
    
    console.log("Sending request body:", JSON.stringify(requestBody));
    
    const { data, error } = await supabase.functions.invoke('archive-trainee', {
      body: JSON.stringify(requestBody),
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (error) {
      console.error("Error archiving trainee:", error);
      throw error;
    }
    
    console.log("Trainee archived successfully:", data);
    return { error: null };
  } catch (error) {
    console.error('Error archiving trainee:', error);
    return { 
      error: error instanceof Error ? error : new Error('Unknown error') 
    };
  }
}

export async function archiveAllStaff(staffIds: string[], folderId?: string): Promise<{ error: Error | null }> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.access_token) {
      throw new Error("No active session. Please log in again.");
    }
    
    console.log("Archiving all staff with session:", !!session);
    
    const { data, error } = await supabase.functions.invoke('archive-all-staff', {
      body: { 
        staff_ids: staffIds,
        folder_id: folderId
      },
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (error) {
      console.error("Error archiving all staff:", error);
      throw error;
    }
    
    console.log("All staff archived successfully:", data);
    return { error: null };
  } catch (error) {
    console.error('Error archiving all staff:', error);
    return { 
      error: error instanceof Error ? error : new Error('Unknown error') 
    };
  }
}

export async function archiveAllTrainees(traineeIds: string[], folderId?: string): Promise<{ error: Error | null }> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.access_token) {
      throw new Error("No active session. Please log in again.");
    }
    
    console.log("Archiving all trainees with session:", !!session);
    
    const { data, error } = await supabase.functions.invoke('archive-all-trainees', {
      body: { 
        trainee_ids: traineeIds,
        folder_id: folderId
      },
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (error) {
      console.error("Error archiving all trainees:", error);
      throw error;
    }
    
    console.log("All trainees archived successfully:", data);
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
      .eq('status', 'archived')
      .order('archived_at', { ascending: false });

    if (error) {
      console.error('Error fetching archived staff:', error);
      throw error;
    }

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
      .eq('status', 'archived')
      .order('archived_at', { ascending: false });

    if (error) {
      console.error('Error fetching archived trainees:', error);
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error fetching archived trainees:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error('Unknown error') 
    };
  }
}
