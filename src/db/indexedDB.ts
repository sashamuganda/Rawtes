import { openDB } from 'idb';
import type { DBSchema, IDBPDatabase } from 'idb';
import type { Note } from '@/types/note';

export interface PendingOperation {
  id: string;
  type: 'upsert' | 'delete';
  noteId: string;
  payload: Partial<Note>;
  timestamp: string;
  retries: number;
}

interface RawtesDBSchema extends DBSchema {
  notes: {
    key: string;
    value: Note;
    indexes: { 'by-updated': string };
  };
  pendingOps: {
    key: string;
    value: PendingOperation;
    indexes: { 'by-timestamp': string };
  };
  meta: {
    key: string;
    value: any;
  };
}

const DB_NAME = 'rawtes_db';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<RawtesDBSchema>> | null = null;

export function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<RawtesDBSchema>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        const noteStore = db.createObjectStore('notes', { keyPath: 'id' });
        noteStore.createIndex('by-updated', 'updatedAt');

        const pendingStore = db.createObjectStore('pendingOps', { keyPath: 'id' });
        pendingStore.createIndex('by-timestamp', 'timestamp');

        db.createObjectStore('meta');
      },
    });
  }
  return dbPromise;
}
