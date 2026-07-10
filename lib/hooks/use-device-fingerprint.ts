'use client';

import { useEffect, useState } from 'react';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

/**
 * Custom hook to generate device fingerprint
 * Works across browsers, incognito mode, VPN, etc.
 */
export function useDeviceFingerprint() {
  const [fingerprint, setFingerprint] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getFingerprint = async () => {
      try {
        // Initialize FingerprintJS
        const fp = await FingerprintJS.load();

        // Get the visitor identifier
        const result = await fp.get();

        // Store fingerprint
        setFingerprint(result.visitorId);
        
        // Also store in sessionStorage for quick access
        sessionStorage.setItem('device_fingerprint', result.visitorId);
      } catch (error) {
        console.error('Failed to generate fingerprint:', error);
        setFingerprint(null);
      } finally {
        setLoading(false);
      }
    };

    getFingerprint();
  }, []);

  return { fingerprint, loading };
}

/**
 * Get cached fingerprint or generate new one
 */
export async function getDeviceFingerprint(): Promise<string | null> {
  try {
    // Check if already cached
    const cached = sessionStorage.getItem('device_fingerprint');
    if (cached) return cached;

    // Generate new fingerprint
    const fp = await FingerprintJS.load();
    const result = await fp.get();
    
    // Cache it
    sessionStorage.setItem('device_fingerprint', result.visitorId);
    
    return result.visitorId;
  } catch (error) {
    console.error('Failed to generate fingerprint:', error);
    return null;
  }
}
