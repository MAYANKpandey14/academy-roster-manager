
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
  nameFilter?: string, 
  districtFilter?: string, 
  dateFilter?: string
): Promise<{ data: Trainee[] | null; error: Error | null }> {
  try {
    console.log("Filtering trainees with params:", { nameFilter, districtFilter, dateFilter });
    const params: Record<string, string> = {};
    if (nameFilter) params.name = nameFilter;
    if (districtFilter) params.district = districtFilter;
    if (dateFilter) params.date = dateFilter;
    
    const { data, error } = await supabase.functions.invoke('get-trainees', {
      body: params
    });
    
    if (error) {
      console.error("Supabase function error:", error);
      throw error;
    }
    
    console.log("Filtered trainees fetched successfully:", data?.length);
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching filtered trainees:', error);
    return { data: null, error: error instanceof Error ? error : new Error('Unknown error') };
  }
}

// Function to add a new trainee
export async function addTrainee(traineeData: TraineeFormValues): Promise<{ data: Trainee | null; error: Error | null }> {
  try {
    console.log("Adding trainee with data:", traineeData);
    
    // Add extra validation or data processing if needed
    const { data, error, status } = await supabase.functions.invoke('add-trainee', {
      body: traineeData
    });
    
    if (error) {
      console.error("Supabase function error:", error);
      throw error;
    }
    
    if (status !== 200) {
      console.error("Unexpected status code:", status);
      throw new Error(`Server returned status ${status}`);
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
    const { data, error } = await supabase.functions.invoke('update-trainee', {
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
