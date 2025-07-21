import { NextRequest, NextResponse } from 'next/server';
import { getAccessLogs, getAccessStats, logAccess } from '@/lib/logger';

function verifyAdminToken(request: NextRequest): boolean {
  const token = request.cookies.get('admin-token')?.value;
  
  if (!token) {
    return false;
  }
  
  try {
    const decoded = Buffer.from(token, 'base64').toString();
    const [username, timestamp] = decoded.split(':');
    
    // Check if token is valid and not expired (8 hours)
    const tokenTime = parseInt(timestamp);
    const now = Date.now();
    const eightHours = 8 * 60 * 60 * 1000;
    const isValidUser = username === process.env.ADMIN_USERNAME;
    const isNotExpired = (now - tokenTime) < eightHours;
    
    return isValidUser && isNotExpired;
  } catch (error) {
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { timestamp, path, userAgent, sessionId, referrer } = body;
    
    // Basic validation
    if (!timestamp || !path || !userAgent || !sessionId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get IP from headers
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
               request.headers.get('x-real-ip') || 
               'localhost';

    // Log the page visit
    await logAccess({
      ip,
      userAgent,
      page: path,
      sessionId
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to log page visit:', error);
    return NextResponse.json(
      { error: 'Failed to log page visit' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // Verify admin authentication
  if (!verifyAdminToken(request)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    
    const allLogs = getAccessLogs(days);
    const stats = getAccessStats(allLogs);
    
    // Paginate logs
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedLogs = allLogs.slice(startIndex, endIndex);
    
    return NextResponse.json({
      logs: paginatedLogs,
      pagination: {
        page,
        limit,
        total: allLogs.length,
        pages: Math.ceil(allLogs.length / limit),
      },
      stats,
    });
  } catch (error) {
    console.error('Failed to get logs:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve logs' },
      { status: 500 }
    );
  }
}
