import { NextResponse } from 'next/server';
import { getAllSimulations } from '@/lib/supabase';

export async function GET() {
  try {
    const simulations = await getAllSimulations();
    
    const formattedSimulations = simulations.map(sim => ({
      ...sim,
      data: JSON.parse(sim.data),
      results: JSON.parse(sim.results)
    }));

    return NextResponse.json({
      success: true,
      simulations: formattedSimulations
    });
  } catch (error) {
    console.error('Error fetching simulations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch simulations' },
      { status: 500 }
    );
  }
}
