
import { Trainee, TraineeFormValues } from "@/types/trainee";
import { supabase } from "@/integrations/supabase/client";

// Function to fetch all trainees
export async function getTrainees(): Promise<{ data: Trainee[] | null; error: Error | null }> {
  try {
    console.log("Fetching trainees");
    
    // Get the current session to include auth token
    const { data: { session } } = await supabase.auth.getSession();
    
    const { data, error } = await supabase.functions.invoke('get-trainees', {
      headers: session ? {
        Authorization: `Bearer ${session.access_token}`
      } : {}
    });
    
    if (error) {
      console.error("Supabase function error:", error);
      throw error;
    }
    
    console.log("Trainees fetched successfully:", data?.length);
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching trainees:', error);
    return { data: null, error: error instanceof Error ? error : new Error('Unknown error') };
  }
}

// Function to filter trainees based on search criteria
export async function filterTrainees(
  pnoFilter?: string, 
  chestNoFilter?: string, 
  rollNoFilter?: string
): Promise<{ data: Trainee[] | null; error: Error | null }> {
  try {
    console.log("Searching trainees with params:", { pnoFilter, chestNoFilter, rollNoFilter });
    const params: Record<string, string> = {};
    if (pnoFilter) params.pno = pnoFilter;
    if (chestNoFilter) params.chest_no = chestNoFilter;
    if (rollNoFilter) params.roll_no = rollNoFilter;
    
    // Get the current session to include auth token
    const { data: { session } } = await supabase.auth.getSession();
    
    const { data, error } = await supabase.functions.invoke('get-trainees', {
      body: params,
      headers: session ? {
        Authorization: `Bearer ${session.access_token}`
      } : {}
    });
    
    if (error) {
      console.error("Supabase function error:", error);
      throw error;
    }
    
    console.log("Searched trainees fetched successfully:", data?.length);
    return { data, error: null };
  } catch (error) {
    console.error('Error searching trainees:', error);
    return { data: null, error: error instanceof Error ? error : new Error('Unknown error') };
  }
}

// Function to add a new trainee
export async function addTrainee(traineeData: TraineeFormValues): Promise<{ data: Trainee | null; error: Error | null }> {
  try {
    console.log("Adding trainee with data:", traineeData);
    
    // Get the current session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error("No active session. Please log in again.");
    }
    
    // Add extra validation or data processing if needed
    const { data, error } = await supabase.functions.invoke('add-trainee', {
      body: traineeData,
      headers: {
        Authorization: `Bearer ${session.access_token}`
      }
    });
    
    if (error) {
      console.error("Supabase function error:", error);
      throw error;
    }
    
    console.log("Trainee added successfully:", data);
    return { data, error: null };
  } catch (error) {
    console.error('Error adding trainee:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error('Unknown error') 
    };
  }
}

// Function to update an existing trainee
export async function updateTrainee(id: string, traineeData: TraineeFormValues): Promise<{ data: Trainee | null; error: Error | null }> {
  try {
    console.log("Updating trainee with id:", id);
    console.log("Update data:", traineeData);
    
    // Get the current session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error("No active session. Please log in again.");
    }
    
    // Ensure we have a valid access token
    if (!session.access_token) {
      throw new Error("Invalid session token. Please log in again.");
    }
    
    console.log("Auth token available:", !!session.access_token);
    
    const { data, error } = await supabase.functions.invoke('update-trainee', {
      body: { id, ...traineeData },
      headers: {
        Authorization: `Bearer ${session.access_token}`
      }
    });
    
    if (error) {
      console.error("Supabase function error:", error);
      throw error;
    }
    
    console.log("Trainee updated successfully:", data);
    return { data, error: null };
  } catch (error) {
    console.error('Error updating trainee:', error);
    return { data: null, error: error instanceof Error ? error : new Error('Unknown error') };
  }
}
