import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

export interface SimulationData {
  id?: number;
  code: string;
  name: string;
  data: string; // JSON stringified ROIData
  results: string; // JSON stringified ROIResults
  created_at?: string;
  updated_at?: string;
}

export function generateSimulationCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function saveSimulation(simulation: Omit<SimulationData, 'id' | 'created_at' | 'updated_at'>): Promise<string> {
  try {
    const { error } = await supabase
      .from('simulations')
      .insert([
        {
          code: simulation.code,
          name: simulation.name,
          data: simulation.data,
          results: simulation.results
        }
      ])
      .select()

    if (error) {
      // If code already exists, generate a new one
      if (error.code === '23505') { // Unique constraint violation
        const newCode = generateSimulationCode();
        const { error: retryError } = await supabase
          .from('simulations')
          .insert([
            {
              code: newCode,
              name: simulation.name,
              data: simulation.data,
              results: simulation.results
            }
          ])
          .select()

        if (retryError) throw retryError;
        return newCode;
      }
      throw error;
    }

    return simulation.code;
  } catch (error) {
    console.error('Error saving simulation:', error);
    throw error;
  }
}

export async function getSimulation(code: string): Promise<SimulationData | null> {
  try {
    const { data, error } = await supabase
      .from('simulations')
      .select('*')
      .eq('code', code)
      .single()

    if (error) {
      if (error.code === 'PGRST116') { // No rows found
        return null;
      }
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error getting simulation:', error);
    return null;
  }
}

export async function getAllSimulations(): Promise<SimulationData[]> {
  try {
    const { data, error } = await supabase
      .from('simulations')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error getting all simulations:', error);
    return [];
  }
}

export async function updateSimulation(code: string, simulation: Partial<Omit<SimulationData, 'id' | 'code' | 'created_at'>>): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('simulations')
      .update({
        ...simulation,
        updated_at: new Date().toISOString()
      })
      .eq('code', code)

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating simulation:', error);
    return false;
  }
}

export async function deleteSimulation(code: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('simulations')
      .delete()
      .eq('code', code)

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting simulation:', error);
    return false;
  }
}
