export type NoteType = 'text' | 'checklist' | 'image';

export type NoteColor = 
  | 'default' 
  | 'red' 
  | 'orange' 
  | 'yellow' 
  | 'green' 
  | 'teal' 
  | 'blue' 
  | 'darkblue' 
  | 'purple' 
  | 'pink' 
  | 'brown' 
  | 'gray';

export interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
  order: number;
}

export interface Note {
  id: string;
  type: NoteType;
  title: string;
  content: string; // Tiptap HTML for rich text
  items: ChecklistItem[] | null;
  imageData: string | null; // base64 string
  color: NoteColor;
  labels: string[];
  pinned: boolean;
  archived: boolean;
  trashed: boolean;
  trashedAt: string | null; // ISO string
  reminder: string | null; // ISO string
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export interface Label {
  id: string;
  name: string;
  color: string;
}

export interface Settings {
  theme: 'light' | 'dark' | 'system';
  defaultView: 'grid' | 'list';
  sortBy: 'updatedAt' | 'createdAt' | 'title';
}

export interface RawtesDB {
  version: number;
  lastModified: string;
  notes: Note[];
  labels: Label[];
  settings: Settings;
}
