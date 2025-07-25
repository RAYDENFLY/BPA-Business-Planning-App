import { NextRequest, NextResponse } from 'next/server';
import { saveSimulation, generateSimulationCode } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, data, results } = body;

    if (!name || !data || !results) {
      return NextResponse.json(
        { error: 'Missing required fields: name, data, results' },
        { status: 400 }
      );
    }

    const code = generateSimulationCode();
    
    const savedCode = await saveSimulation({
      code,
      name,
      data: JSON.stringify(data),
      results: JSON.stringify(results)
    });

    return NextResponse.json({
      success: true,
      code: savedCode,
      message: 'Simulasi berhasil disimpan'
    });
  } catch (error) {
    console.error('Error saving simulation:', error);
    return NextResponse.json(
      { error: 'Failed to save simulation' },
      { status: 500 }
    );
  }
}
