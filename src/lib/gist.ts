import { GIST_DESCRIPTION, GIST_FILENAME, githubFetch } from './github';
import type { RawtesDB } from '@/types/note';

export interface GistFile {
  content: string;
}

export interface Gist {
  id: string;
  description: string;
  files: Record<string, GistFile>;
  updated_at: string;
}

export function createEmptyDatabase(): RawtesDB {
  return {
    version: 1,
    lastModified: new Date().toISOString(),
    notes: [],
    labels: [],
    settings: {
      theme: 'system',
      defaultView: 'grid',
      sortBy: 'updatedAt',
    },
  };
}

export async function findOrCreateIndexGist(): Promise<string> {
  const gists = await githubFetch<Gist[]>('/gists?per_page=100');
  const existing = gists.find((g) => g.description === GIST_DESCRIPTION);
  
  if (existing) {
    return existing.id;
  }

  const created = await githubFetch<Gist>('/gists', {
    method: 'POST',
    body: JSON.stringify({
      description: GIST_DESCRIPTION,
      public: false,
      files: {
        [GIST_FILENAME]: {
          content: JSON.stringify(createEmptyDatabase(), null, 2),
        },
      },
    }),
  });

  return created.id;
}

export async function fetchNotesFromGist(gistId: string): Promise<RawtesDB> {
  const gist = await githubFetch<Gist>(`/gists/${gistId}`);
  const file = gist.files[GIST_FILENAME];
  
  if (!file) {
    throw new Error('Gist data file missing');
  }

  try {
    return JSON.parse(file.content);
  } catch (e) {
    throw new Error('Failed to parse gist data');
  }
}

export async function saveNotesToGist(gistId: string, db: RawtesDB): Promise<void> {
  const updatedDb = {
    ...db,
    lastModified: new Date().toISOString(),
  };

  await githubFetch(`/gists/${gistId}`, {
    method: 'PATCH',
    body: JSON.stringify({
      files: {
        [GIST_FILENAME]: {
          content: JSON.stringify(updatedDb, null, 2),
        },
      },
    }),
  });
}
