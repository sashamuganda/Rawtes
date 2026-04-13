import { useState, useEffect } from 'react';
import { useAppStore } from '@/store';
import { pollForToken, fetchUserProfile } from '@/lib/auth';

export function useAuth() {
  const { status, deviceData, setToken, setUser, logout } = useAppStore();
  const [polling, setPolling] = useState(false);

  useEffect(() => {
    let intervalId: any;

    if (status === 'polling' && deviceData && !polling) {
      setPolling(true);
      
      intervalId = setInterval(async () => {
        try {
          const res = await pollForToken(deviceData.device_code);
          
          if (res.access_token) {
            clearInterval(intervalId);
            setToken(res.access_token);
            const user = await fetchUserProfile();
            setUser(user);
            setPolling(false);
          } else if (res.error && res.error !== 'authorization_pending') {
            clearInterval(intervalId);
            setPolling(false);
            // Handle other errors (slow_down, expired_token, etc)
          }
        } catch (e) {
          clearInterval(intervalId);
          setPolling(false);
        }
      }, (deviceData.interval || 5) * 1000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [status, deviceData, polling, setToken, setUser]);

  return { status, logout };
}
