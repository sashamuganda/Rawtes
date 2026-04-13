import { getDB } from './indexedDB';
import type { PendingOperation } from './indexedDB';
import type { Note } from '@/types/note';
import { nanoid } from 'nanoid';

export async function addPendingOp(type: 'upsert' | 'delete', noteId: string, payload: Partial<Note>) {
  const db = await getDB();
  const op: PendingOperation = {
    id: nanoid(),
    type,
    noteId,
    payload,
    timestamp: new Date().toISOString(),
    retries: 0,
  };
  await db.put('pendingOps', op);
}

export async function getPendingOps() {
  const db = await getDB();
  return db.getAllFromIndex('pendingOps', 'by-timestamp');
}

export async function clearPendingOps() {
  const db = await getDB();
  await db.clear('pendingOps');
}

export async function deletePendingOp(id: string) {
  const db = await getDB();
  await db.delete('pendingOps', id);
}
