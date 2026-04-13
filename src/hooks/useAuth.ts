import { useState, useEffect } from 'react';
import { useAppStore } from '@/store';
import { pollForToken, fetchUserProfile } from '@/lib/auth';

export function useAuth() {
  const { status, deviceData, setToken, setUser, logout } = useAppStore();

  useEffect(() => {
    let timeoutId: any;
    let currentInterval = (deviceData?.interval || 5) * 1000;

    const poll = async () => {
      if (status !== 'polling' || !deviceData) return;

      try {
        const res = await pollForToken(deviceData.device_code);
        
        if (res.access_token) {
          setToken(res.access_token);
          
          try {
            const user = await fetchUserProfile();
            setUser(user);
          } catch (err) {
            useAppStore.setState({ status: 'authenticated' });
          }
          return; // Stop polling
        } 
        
        if (res.error) {
          if (res.error === 'slow_down') {
            currentInterval = (res.interval ? res.interval : (currentInterval / 1000) + 5) * 1000;
          } else if (res.error === 'expired_token' || res.error === 'access_denied') {
            useAppStore.setState({ status: 'error', error: res.error_description || res.error });
            return; // Stop polling
          }
        }
      } catch (e) {
        // Continue
      }

      // Schedule next poll
      timeoutId = setTimeout(poll, currentInterval);
    };

    if (status === 'polling' && deviceData) {
      console.log('useAuth: Starting polling chain...');
      timeoutId = setTimeout(poll, currentInterval);
    }

    return () => {
      if (timeoutId) {
        console.log('useAuth: Cleaning up polling.');
        clearTimeout(timeoutId);
      }
    };
  }, [status, deviceData, setToken, setUser]);

  return { status, logout };
}
