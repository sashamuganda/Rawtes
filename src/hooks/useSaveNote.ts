import { useCallback } from 'react';
import { useAppStore } from '@/store';
import type { Note } from '@/types/note';
import debounce from 'lodash.debounce';

export function useSaveNote() {
  const { upsertNote, triggerSync } = useAppStore();

  const debouncedSync = useCallback(
    debounce(() => triggerSync(), 1500),
    [triggerSync]
  );

  const saveNote = async (note: Note) => {
    // 1. Optimistic update in store/indexedDB
    await upsertNote(note);
    
    // 2. Trigger centralized sequential sync
    debouncedSync();
  };

  return { saveNote };
}
