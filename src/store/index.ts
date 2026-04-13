import { create } from 'zustand';
import type { StateCreator } from 'zustand';
import { createAuthSlice } from './authSlice';
import type { AuthSlice } from './authSlice';
import { createNotesSlice } from './notesSlice';
import type { NotesSlice } from './notesSlice';

/* UI Slice */
export interface UISlice {
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  viewMode: 'grid' | 'list';
  activeModal: 'note' | 'labels' | 'shortcuts' | null;
  activeNoteId: string | null;
  searchQuery: string;
  theme: 'light' | 'dark' | 'system';

  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setViewMode: (mode: 'grid' | 'list') => void;
  setActiveModal: (modal: UISlice['activeModal'], noteId?: string | null) => void;
  setSearchQuery: (query: string) => void;
  setTheme: (theme: UISlice['theme']) => void;
}

export const createUISlice: StateCreator<UISlice> = (set) => ({
  sidebarOpen: false,
  sidebarCollapsed: false,
  viewMode: 'grid',
  activeModal: null,
  activeNoteId: null,
  searchQuery: '',
  theme: 'system',

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setActiveModal: (modal, noteId = null) => set({ activeModal: modal, activeNoteId: noteId }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setTheme: (theme) => {
    set({ theme });
    document.documentElement.setAttribute('data-theme', theme);
  },
});

/* Sync Slice */
export interface SyncSlice {
  gistId: string | null;
  lastSyncedAt: string | null;
  syncStatus: 'idle' | 'syncing' | 'error' | 'offline';
  pendingCount: number;

  setGistId: (id: string | null) => void;
  setSyncStatus: (status: SyncSlice['syncStatus']) => void;
  setLastSyncedAt: (at: string | null) => void;
  setPendingCount: (count: number) => void;
  triggerSync: () => Promise<void>;
}

let isSyncing = false;
let syncAgain = false;

export const createSyncSlice: StateCreator<SyncSlice & NotesSlice> = (set, get) => ({
  gistId: localStorage.getItem('nk_gist_id'),
  lastSyncedAt: localStorage.getItem('nk_last_synced'),
  syncStatus: 'idle',
  pendingCount: 0,

  setGistId: (id) => {
    set({ gistId: id });
    if (id) localStorage.setItem('nk_gist_id', id);
    else localStorage.removeItem('nk_gist_id');
  },
  setSyncStatus: (status) => set({ syncStatus: status }),
  setLastSyncedAt: (at) => {
    set({ lastSyncedAt: at });
    if (at) localStorage.setItem('nk_last_synced', at);
    else localStorage.removeItem('nk_last_synced');
  },
  setPendingCount: (count) => set({ pendingCount: count }),

  triggerSync: async () => {
    const { gistId, notes, labels, settings, setSyncStatus, setLastSyncedAt } = get();
    if (!gistId) return;

    if (isSyncing) {
      syncAgain = true;
      return;
    }

    isSyncing = true;
    setSyncStatus('syncing');

    try {
      const { saveNotesToGist } = await import('@/lib/gist');
      
      const performSync = async () => {
        syncAgain = false;
        // Always get the LATEST state from the store before pushing
        const currentData = {
          version: 1,
          lastModified: new Date().toISOString(),
          notes: get().notes,
          labels: get().labels,
          settings: get().settings,
        };
        
        await saveNotesToGist(gistId, currentData);
        
        if (syncAgain) {
          await performSync();
        }
      };

      await performSync();
      setSyncStatus('idle');
      setLastSyncedAt(new Date().toISOString());
    } catch (e) {
      console.error('Sync failed:', e);
      setSyncStatus('error');
    } finally {
      isSyncing = false;
    }
  },
});

/* Root Store */
export interface AppStore extends AuthSlice, NotesSlice, UISlice, SyncSlice {}

export const useAppStore = create<AppStore>()((...a) => ({
  ...createAuthSlice(...a),
  ...createNotesSlice(...a),
  ...createUISlice(...a),
  ...createSyncSlice(...a),
}));
