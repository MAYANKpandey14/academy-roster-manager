import { Staff, StaffFormValues } from "@/types/staff";
import { supabase } from "@/integrations/supabase/client";

export async function getStaff(): Promise<{ data: Staff[] | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('staff')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) throw error;
    
    return { 
      data: data as Staff[], 
      error: null 
    };
  } catch (error) {
    console.error('Error fetching staff:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error('Unknown error') 
    };
  }
}

export async function getStaffById(id: string): Promise<{ data: Staff | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('staff')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    return { 
      data: data as Staff, 
      error: null 
    };
  } catch (error) {
    console.error('Error fetching staff:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error('Unknown error') 
    };
  }
}

export async function addStaff(staffData: StaffFormValues): Promise<{ data: Staff | null; error: Error | null }> {
  try {
    // Get current auth session to include the auth token
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      throw new Error(`Session error: ${sessionError.message}`);
    }

    if (!sessionData.session) {
      throw new Error("No active session found");
    }

    const { data, error } = await supabase.functions.invoke('manage-staff/add', {
      body: staffData,
      headers: {
        Authorization: `Bearer ${sessionData.session.access_token}`
      }
    });
    
    if (error) {
      console.error('Supabase add error:', error);
      throw error;
    }
    
    return { 
      data: data as Staff, 
      error: null 
    };
  } catch (error) {
    console.error('Error adding staff:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error('Unknown error') 
    };
  }
}

export async function updateStaff(id: string, staffData: StaffFormValues): Promise<{ data: Staff | null; error: Error | null }> {
  try {
    // Get current auth session to include the auth token
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      throw new Error(`Session error: ${sessionError.message}`);
    }

    if (!sessionData.session) {
      throw new Error("No active session found");
    }
    
    const { data, error } = await supabase.functions.invoke('manage-staff/update', {
      body: { id, ...staffData },
      headers: {
        Authorization: `Bearer ${sessionData.session.access_token}`
      }
    });
    
    if (error) {
      console.error('Supabase update error:', error);
      throw error;
    }
    
    return { 
      data: data as Staff, 
      error: null 
    };
  } catch (error) {
    console.error('Error updating staff:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error('Unknown error') 
    };
  }
}

export async function deleteStaff(id: string): Promise<{ error: Error | null }> {
  try {
    // Get current auth session to include the auth token
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      throw new Error(`Session error: ${sessionError.message}`);
    }

    if (!sessionData.session) {
      throw new Error("No active session found");
    }
    
    // Call the manage-staff/delete edge function subpath
    const { error } = await supabase.functions.invoke('manage-staff/delete', {
      body: { id },
      headers: {
        Authorization: `Bearer ${sessionData.session.access_token}`
      }
    });
    
    if (error) {
      console.error('Error invoking delete-staff function:', error);
      throw error;
    }
    
    return { error: null };
  } catch (error) {
    console.error('Error deleting staff:', error);
    return { 
      error: error instanceof Error ? error : new Error('Unknown error') 
    };
  }
}
