import { NextRequest, NextResponse } from 'next/server';
import { logAccess } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    const { ip, userAgent, page, sessionId } = await request.json();
    
    // Log the access
    await logAccess({
      ip,
      userAgent,
      page,
      sessionId,
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to log access:', error);
    return NextResponse.json(
      { error: 'Failed to log access' },
      { status: 500 }
    );
  }
}
