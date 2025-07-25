import { NextRequest, NextResponse } from 'next/server';
import { getSimulation } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    
    if (!code) {
      return NextResponse.json(
        { error: 'Simulation code is required' },
        { status: 400 }
      );
    }

    const simulation = await getSimulation(code);
    
    if (!simulation) {
      return NextResponse.json(
        { error: 'Simulation not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      simulation: {
        ...simulation,
        data: JSON.parse(simulation.data),
        results: JSON.parse(simulation.results)
      }
    });
  } catch (error) {
    console.error('Error fetching simulation:', error);
    return NextResponse.json(
      { error: 'Failed to fetch simulation' },
      { status: 500 }
    );
  }
}
