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

    // Ensure all required fields are present before insert
    const { data, error } = await supabase
      .from('staff')
      .insert({
        pno: staffData.pno,
        name: staffData.name,
        father_name: staffData.father_name,
        rank: staffData.rank,
        current_posting_district: staffData.current_posting_district,
        mobile_number: staffData.mobile_number,
        education: staffData.education,
        date_of_birth: staffData.date_of_birth,
        date_of_joining: staffData.date_of_joining,
        arrival_date: staffData.arrival_date,
        blood_group: staffData.blood_group,
        nominee: staffData.nominee,
        home_address: staffData.home_address,
        category_caste: staffData.category_caste,
        toli_no: staffData.toli_no,
        class_no: staffData.class_no,
        class_subject: staffData.class_subject,
        photo_url: staffData.photo_url || null // Ensure photo_url is null if undefined
      })
      .select()
      .single();
    
    if (error) {
      console.error('Supabase insert error:', error);
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
    
    // Prepare update data with proper handling for photo_url
    const updateData = {
      pno: staffData.pno,
      name: staffData.name,
      father_name: staffData.father_name,
      rank: staffData.rank,
      current_posting_district: staffData.current_posting_district,
      mobile_number: staffData.mobile_number,
      education: staffData.education,
      date_of_birth: staffData.date_of_birth,
      date_of_joining: staffData.date_of_joining,
      arrival_date: staffData.arrival_date,
      blood_group: staffData.blood_group,
      nominee: staffData.nominee,
      home_address: staffData.home_address,
      category_caste: staffData.category_caste,
      toli_no: staffData.toli_no,
      class_no: staffData.class_no,
      class_subject: staffData.class_subject,
      photo_url: staffData.photo_url || null // Ensure photo_url is null if undefined or empty
    };
    
    console.log('Updating staff with data:', updateData);
    
    const { data, error } = await supabase
      .from('staff')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
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
    
    // Call the delete-staff edge function
    const { error } = await supabase.functions.invoke('delete-staff', {
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
