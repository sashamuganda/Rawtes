import React from 'react';
import { useAppStore } from '@/store';
import type { Note } from '@/types/note';
import { ulid } from 'ulid';
import { Button } from '../ui/Button';
import { CheckSquare, Image as ImageIcon } from 'lucide-react';

export const CreateNoteBar: React.FC = () => {
  const { upsertNote, setActiveModal } = useAppStore();

  const startNewNote = (type: Note['type'] = 'text') => {
    const newNote: Note = {
      id: ulid(),
      type,
      title: '',
      content: '',
      items: type === 'checklist' ? [] : null,
      imageData: null,
      color: 'default',
      labels: [],
      pinned: false,
      archived: false,
      trashed: false,
      trashedAt: null,
      reminder: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    upsertNote(newNote);
    setActiveModal('note', newNote.id);
  };

  return (
    <div className="mx-auto mb-8 w-full max-w-2xl transform transition-all duration-300">
      <div 
        onClick={() => startNewNote('text')}
        className="flex items-center justify-between rounded-lg border border-border bg-surface px-4 py-2 shadow-sm hover:shadow-md cursor-text"
      >
        <span className="text-sm font-medium text-text-placeholder">Take a note...</span>
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={(e) => { e.stopPropagation(); startNewNote('checklist'); }}
            title="New checklist"
          >
            <CheckSquare className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={(e) => { e.stopPropagation(); startNewNote('image'); }}
            title="New note with image"
          >
            <ImageIcon className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
