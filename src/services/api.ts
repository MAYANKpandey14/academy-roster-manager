
import { Trainee, TraineeFormValues } from "@/types/trainee";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Function to fetch all trainees
export async function getTrainees(): Promise<{ data: Trainee[] | null; error: Error | null }> {
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/get-trainees`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch trainees');
    }

    const data = await response.json();
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
    const queryParams = new URLSearchParams();
    if (nameFilter) queryParams.append('name', nameFilter);
    if (districtFilter) queryParams.append('district', districtFilter);
    if (dateFilter) queryParams.append('date', dateFilter);

    const response = await fetch(
      `${SUPABASE_URL}/functions/v1/get-trainees?${queryParams.toString()}`, 
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch filtered trainees');
    }

    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching filtered trainees:', error);
    return { data: null, error: error instanceof Error ? error : new Error('Unknown error') };
  }
}

// Function to add a new trainee
export async function addTrainee(traineeData: TraineeFormValues): Promise<{ data: Trainee | null; error: Error | null }> {
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/add-trainee`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(traineeData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to add trainee');
    }

    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    console.error('Error adding trainee:', error);
    return { data: null, error: error instanceof Error ? error : new Error('Unknown error') };
  }
}

// Function to update an existing trainee
export async function updateTrainee(id: string, traineeData: TraineeFormValues): Promise<{ data: Trainee | null; error: Error | null }> {
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/update-trainee`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, ...traineeData }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update trainee');
    }

    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    console.error('Error updating trainee:', error);
    return { data: null, error: error instanceof Error ? error : new Error('Unknown error') };
  }
}
