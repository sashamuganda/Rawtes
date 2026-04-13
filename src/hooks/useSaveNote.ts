import { useCallback } from 'react';
import { useAppStore } from '@/store';
import { saveNotesToGist } from '@/lib/gist';
import type { Note, RawtesDB } from '@/types/note';
import { addPendingOp } from '@/db/pendingQueue';
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
