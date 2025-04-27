
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
    const { data, error } = await supabase
      .from('staff')
      .insert(staffData)
      .select()
      .single();
    
    if (error) throw error;
    
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
    const { data, error } = await supabase
      .from('staff')
      .update(staffData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
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
    const { error } = await supabase
      .from('staff')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return { error: null };
  } catch (error) {
    console.error('Error deleting staff:', error);
    return { 
      error: error instanceof Error ? error : new Error('Unknown error') 
    };
  }
}
