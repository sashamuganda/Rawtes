import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAppStore } from '@/store';
import { fetchNotesFromGist, findOrCreateIndexGist } from '@/lib/gist';
import { getDB } from '@/db/indexedDB';

export function useNotes() {
  const { gistId, setGistId, setNotes, setLabels, setSettings, setLastSyncedAt, setSyncStatus } = useAppStore();
  const queryClient = useQueryClient();

  // Load all notes
  const notesQuery = useQuery({
    queryKey: ['notes'],
    queryFn: async () => {
      let currentGistId = gistId;
      if (!currentGistId) {
        currentGistId = await findOrCreateIndexGist();
        setGistId(currentGistId);
      }
      
      setSyncStatus('syncing');
      try {
        const db = await fetchNotesFromGist(currentGistId);
        
        // Sync to store and local DB
        setNotes(db.notes);
        setLabels(db.labels);
        setSettings(db.settings);
        setLastSyncedAt(db.lastModified);
        
        const indexedDb = await getDB();
        const tx = indexedDb.transaction(['notes', 'meta'], 'readwrite');
        await tx.objectStore('notes').clear();
        for (const note of db.notes) {
          await tx.objectStore('notes').put(note);
        }
        await tx.objectStore('meta').put(db.settings, 'settings');
        await tx.objectStore('meta').put(db.labels, 'labels');
        await tx.done;

        setSyncStatus('idle');
        return db;
      } catch (e) {
        setSyncStatus('offline');
        throw e;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!useAppStore.getState().token,
  });

  return { ...notesQuery, queryClient };
}

export function useNote(id: string | null) {
  const notes = useAppStore((state) => state.notes);
  if (!id) return null;
  return notes.find((n) => n.id === id) || null;
}
