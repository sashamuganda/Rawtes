import Fuse from 'fuse.js';
import type { Note } from '@/types/note';

export function stripHtml(html: string): string {
  if (typeof document === 'undefined') return html;
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || '';
}

export function createSearchIndex(notes: Note[]) {
  const processedNotes = notes.map(note => ({
    ...note,
    contentText: stripHtml(note.content),
    checklistText: note.items?.map(i => i.text).join(' ') || '',
  }));

  return new Fuse(processedNotes, {
    keys: [
      { name: 'title', weight: 0.4 },
      { name: 'contentText', weight: 0.3 },
      { name: 'checklistText', weight: 0.2 },
      { name: 'labels', weight: 0.1 },
    ],
    threshold: 0.35,
    includeMatches: true,
    ignoreLocation: true,
    minMatchCharLength: 2,
  });
}

export function highlightText(text: string, indices: readonly [number, number][]): string {
  let result = '';
  let lastIndex = 0;
  
  const sortedIndices = [...indices].sort((a, b) => a[0] - b[0]);

  for (const [start, end] of sortedIndices) {
    result += text.slice(lastIndex, start);
    result += `<mark>${text.slice(start, end + 1)}</mark>`;
    lastIndex = end + 1;
  }
  
  result += text.slice(lastIndex);
  return result;
}
