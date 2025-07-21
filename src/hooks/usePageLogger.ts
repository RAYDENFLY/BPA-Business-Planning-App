'use client';

import { useEffect } from 'react';

export function usePageLogger() {
  useEffect(() => {
    const logPageVisit = async () => {
      try {
        // Generate a simple session ID if not exists
        let sessionId = localStorage.getItem('session-id');
        if (!sessionId) {
          sessionId = 'session-' + Math.random().toString(36).substr(2, 9) + Date.now();
          localStorage.setItem('session-id', sessionId);
        }

        const logData = {
          timestamp: new Date().toISOString(),
          path: window.location.pathname,
          userAgent: navigator.userAgent,
          sessionId: sessionId,
          referrer: document.referrer || 'direct'
        };

        console.log('Logging page visit:', logData);

        // Log to API (don't wait for response to avoid blocking)
        const response = await fetch('/api/admin/logs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(logData),
        });

        if (response.ok) {
          console.log('Page visit logged successfully');
        } else {
          console.warn('Failed to log page visit:', response.statusText);
        }
      } catch (error) {
        console.warn('Error logging page visit:', error);
      }
    };

    // Log after a short delay to ensure page is loaded
    const timer = setTimeout(logPageVisit, 2000);
    
    return () => clearTimeout(timer);
  }, []);
}
