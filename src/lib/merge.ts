import type { Note, RawtesDB } from '@/types/note';
import type { PendingOperation } from '@/db/indexedDB';

export function mergeWithPending(remoteDb: RawtesDB, pending: PendingOperation[]): RawtesDB {
  const noteMap = new Map<string, Note>();
  
  // Fill with remote notes
  remoteDb.notes.forEach(note => noteMap.set(note.id, note));

  // Sort pending by timestamp to apply in order
  const sortedPending = [...pending].sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  sortedPending.forEach(op => {
    const existing = noteMap.get(op.noteId);
    
    if (op.type === 'delete') {
      noteMap.delete(op.noteId);
      return;
    }

    if (op.type === 'upsert') {
      const payload = op.payload as Note;
      if (!existing || new Date(payload.updatedAt) > new Date(existing.updatedAt)) {
        noteMap.set(op.noteId, { ...(existing || {}), ...payload } as Note);
      }
    }
  });

  return {
    ...remoteDb,
    notes: Array.from(noteMap.values()),
    lastModified: new Date().toISOString(),
  };
}
