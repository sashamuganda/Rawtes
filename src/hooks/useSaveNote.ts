import { useCallback } from 'react';
import { useAppStore } from '@/store';
import { saveNotesToGist } from '@/lib/gist';
import type { Note, RawtesDB } from '@/types/note';
import { addPendingOp } from '@/db/pendingQueue';
import debounce from 'lodash.debounce';

export function useSaveNote() {
  const { notes, gistId, labels, settings, upsertNote, setSyncStatus } = useAppStore();

  const performSave = async (updatedNote: Note) => {
    if (!gistId) return;
    
    setSyncStatus('syncing');
    try {
      const currentDb: RawtesDB = {
        version: 1,
        lastModified: new Date().toISOString(),
        notes: notes.map((n) => (n.id === updatedNote.id ? updatedNote : n)),
        labels,
        settings,
      };

      await saveNotesToGist(gistId, currentDb);
      setSyncStatus('idle');
    } catch (e) {
      setSyncStatus('error');
      // Save to pending if offline/error
      await addPendingOp('upsert', updatedNote.id, updatedNote);
    }
  };

  const debouncedSave = useCallback(
    debounce((note: Note) => performSave(note), 1500),
    [notes, gistId, labels, settings]
  );

  const saveNote = async (note: Note) => {
    // 1. Optimistic update in store/indexedDB
    await upsertNote(note);
    
    // 2. Debounced save to Gist
    debouncedSave(note);
  };

  return { saveNote };
}
