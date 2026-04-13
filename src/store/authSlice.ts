import type { StateCreator } from 'zustand';
import { startDeviceFlow, fetchUserProfile } from '@/lib/auth';
import type { GitHubUser, DeviceCodeResponse } from '@/lib/auth';
import { obfuscateToken, deobfuscateToken } from '@/lib/crypto';

export interface AuthSlice {
  token: string | null;
  user: GitHubUser | null;
  status: 'idle' | 'polling' | 'authenticated' | 'error';
  deviceData: DeviceCodeResponse | null;
  error: string | null;
  
  setToken: (token: string | null) => void;
  setUser: (user: GitHubUser | null) => void;
  login: () => Promise<void>;
  logout: () => void;
  initializeAuth: () => Promise<void>;
}

export const createAuthSlice: StateCreator<AuthSlice> = (set, get) => ({
  token: deobfuscateToken(localStorage.getItem('nk_token') || ''),
  user: null,
  status: 'idle',
  deviceData: null,
  error: null,

  setToken: (token) => {
    set({ token });
    if (token) {
      localStorage.setItem('nk_token', obfuscateToken(token));
      set({ status: 'authenticated' });
    } else {
      localStorage.removeItem('nk_token');
      set({ status: 'idle', user: null, deviceData: null });
    }
  },

  setUser: (user) => set({ user, status: user ? 'authenticated' : 'polling' }),

  login: async () => {
    try {
      set({ status: 'polling', error: null });
      const deviceData = await startDeviceFlow();
      set({ deviceData });

      // Polling logic is handled by the component or a dedicated service,
      // but we'll provide the data here.
    } catch (e: any) {
      set({ status: 'error', error: e.message });
    }
  },

  logout: () => {
    get().setToken(null);
    set({ user: null, status: 'idle', deviceData: null });
  },

  initializeAuth: async () => {
    const token = get().token;
    if (!token) return;

    try {
      const user = await fetchUserProfile();
      set({ user, status: 'authenticated' });
    } catch (e) {
      get().logout();
    }
  },
});
