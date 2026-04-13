import type { StateCreator } from 'zustand';
import type { Note, Label, Settings } from '@/types/note';
import { getDB } from '@/db/indexedDB';

export interface NotesSlice {
  notes: Note[];
  labels: Label[];
  settings: Settings;
  
  setNotes: (notes: Note[]) => void;
  setLabels: (labels: Label[]) => void;
  setSettings: (settings: Settings) => void;
  upsertNote: (note: Note) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  initializeNotes: () => Promise<void>;
}

export const createNotesSlice: StateCreator<NotesSlice> = (set, get) => ({
  notes: [],
  labels: [],
  settings: {
    theme: 'system',
    defaultView: 'grid',
    sortBy: 'updatedAt',
  },

  setNotes: (notes) => set({ notes }),
  setLabels: (labels) => set({ labels }),
  setSettings: (settings) => set({ settings }),

  upsertNote: async (note) => {
    const db = await getDB();
    await db.put('notes', note);
    
    set((state) => {
      const index = state.notes.findIndex((n) => n.id === note.id);
      if (index > -1) {
        const newNotes = [...state.notes];
        newNotes[index] = note;
        return { notes: newNotes };
      }
      return { notes: [note, ...state.notes] };
    });
  },

  deleteNote: async (id) => {
    const db = await getDB();
    await db.delete('notes', id);
    set((state) => ({
      notes: state.notes.filter((n) => n.id !== id),
    }));
  },

  initializeNotes: async () => {
    const db = await getDB();
    const notes = await db.getAll('notes');
    const settings = await db.get('meta', 'settings');
    const labels = await db.get('meta', 'labels');

    set({ 
      notes: notes.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()),
      settings: settings || get().settings,
      labels: labels || [],
    });
  },
});
