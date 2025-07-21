import fs from 'fs';
import path from 'path';

export interface AccessLog {
  timestamp: string;
  ip: string;
  userAgent: string;
  page: string;
  country?: string;
  city?: string;
  sessionId: string;
}

const LOGS_DIR = path.join(process.cwd(), 'logs');

// Ensure logs directory exists
if (!fs.existsSync(LOGS_DIR)) {
  fs.mkdirSync(LOGS_DIR, { recursive: true });
}

export async function logAccess(logData: Omit<AccessLog, 'timestamp' | 'country' | 'city'>) {
  try {
    const timestamp = new Date().toISOString();
    
    // Get location info from IP (using a free API)
    let locationInfo = {};
    try {
      const response = await fetch(`https://ipapi.co/${logData.ip}/json/`);
      if (response.ok) {
        const data = await response.json();
        locationInfo = {
          country: data.country_name || 'Unknown',
          city: data.city || 'Unknown',
        };
      }
    } catch (error) {
      console.warn('Failed to get location info:', error);
      locationInfo = { country: 'Unknown', city: 'Unknown' };
    }

    const logEntry: AccessLog = {
      timestamp,
      ...logData,
      ...locationInfo,
    };

    // Create log file name based on date
    const dateStr = new Date().toISOString().split('T')[0];
    const logFile = path.join(LOGS_DIR, `access-${dateStr}.log`);

    // Append log entry
    const logLine = JSON.stringify(logEntry) + '\n';
    fs.appendFileSync(logFile, logLine);

    console.log('Access logged:', {
      ip: logData.ip,
      page: logData.page,
      timestamp,
    });
  } catch (error) {
    console.error('Failed to log access:', error);
  }
}

export function getAccessLogs(days: number = 30): AccessLog[] {
  try {
    const logs: AccessLog[] = [];
    const now = new Date();
    
    for (let i = 0; i < days; i++) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      const logFile = path.join(LOGS_DIR, `access-${dateStr}.log`);
      
      if (fs.existsSync(logFile)) {
        const fileContent = fs.readFileSync(logFile, 'utf-8');
        const lines = fileContent.trim().split('\n').filter(line => line);
        
        for (const line of lines) {
          try {
            const logEntry = JSON.parse(line);
            logs.push(logEntry);
          } catch (error) {
            console.warn('Failed to parse log line:', line);
          }
        }
      }
    }
    
    return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  } catch (error) {
    console.error('Failed to read logs:', error);
    return [];
  }
}

export function getAccessStats(logs: AccessLog[]) {
  const totalVisits = logs.length;
  const uniqueIPs = new Set(logs.map(log => log.ip)).size;
  
  // Count by country
  const countryStats = logs.reduce((acc, log) => {
    const country = log.country || 'Unknown';
    acc[country] = (acc[country] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Count by page
  const pageStats = logs.reduce((acc, log) => {
    acc[log.page] = (acc[log.page] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Count by hour for activity pattern
  const hourStats = logs.reduce((acc, log) => {
    const hour = new Date(log.timestamp).getHours();
    acc[hour] = (acc[hour] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);
  
  return {
    totalVisits,
    uniqueIPs,
    countryStats: Object.entries(countryStats).sort(([,a], [,b]) => b - a).slice(0, 10),
    pageStats: Object.entries(pageStats).sort(([,a], [,b]) => b - a),
    hourStats,
  };
}
