
import { Trainee, TraineeFormValues } from "@/types/trainee";
import { supabase } from "@/integrations/supabase/client";

// Function to fetch all trainees
export async function getTrainees(): Promise<{ data: Trainee[] | null; error: Error | null }> {
  try {
    console.log("Fetching trainees");
    const { data, error } = await supabase.functions.invoke('get-trainees');
    
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
    
    const { data, error } = await supabase.functions.invoke('get-trainees', {
      body: params
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
    
    // Add extra validation or data processing if needed
    const { data, error } = await supabase.functions.invoke('add-trainee', {
      body: traineeData
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
    console.log("Update data:", JSON.stringify(traineeData));
    
    const { data, error } = await supabase.functions.invoke('update-trainee', {
      method: 'PUT', // Explicitly set the HTTP method to PUT
      body: { id, ...traineeData }
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
