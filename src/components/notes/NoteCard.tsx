import React from 'react';
import type { Note } from '@/types/note';
import { useAppStore } from '@/store';
import { cn } from '../ui/Button';
import { Pin, Archive, Trash2, MoreVertical, Lightbulb } from 'lucide-react';
import { Dropdown, DropdownTrigger, DropdownContent, DropdownItem } from '../ui/Dropdown';

/* --- NoteCard --- */
interface NoteCardProps {
  note: Note;
  onClick: () => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({ note, onClick }) => {
  const { upsertNote } = useAppStore();

  const togglePin = (e: React.MouseEvent) => {
    e.stopPropagation();
    upsertNote({ ...note, pinned: !note.pinned, updatedAt: new Date().toISOString() });
  };

  const toggleArchive = (e: React.MouseEvent) => {
    e.stopPropagation();
    upsertNote({ ...note, archived: !note.archived, updatedAt: new Date().toISOString() });
  };

  const moveToTrash = (e: React.MouseEvent) => {
    e.stopPropagation();
    upsertNote({ ...note, trashed: true, trashedAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
  };

  const noteColors: Record<string, string> = {
    default: 'bg-surface',
    red: 'bg-note-red',
    orange: 'bg-note-orange',
    yellow: 'bg-note-yellow',
    green: 'bg-note-green',
    teal: 'bg-note-teal',
    blue: 'bg-note-blue',
    darkblue: 'bg-note-darkblue',
    purple: 'bg-note-purple',
    pink: 'bg-note-pink',
    brown: 'bg-note-brown',
    gray: 'bg-note-gray',
  };

  return (
    <div 
      onClick={onClick}
      className={cn(
        "group relative flex flex-col gap-3 rounded-lg border border-border p-4 shadow-note transition-all hover:shadow-note-hover cursor-pointer break-inside-avoid mb-4",
        noteColors[note.color] || 'bg-surface'
      )}
    >
      <div className="flex items-start justify-between">
        <h3 className="font-body font-semibold text-text-primary line-clamp-2">
          {note.title || (note.type === 'checklist' ? 'Checklist' : 'Note')}
        </h3>
        <button 
          onClick={togglePin}
          className={cn(
            "rounded-full p-1 transition-colors hover:bg-black/5",
            note.pinned ? "text-accent" : "text-text-placeholder opacity-0 group-hover:opacity-100"
          )}
        >
          <Pin className={cn("h-4 w-4", note.pinned && "fill-current")} />
        </button>
      </div>

      <div className="text-sm text-text-secondary line-clamp-6">
        {note.type === 'checklist' ? (
          <ul className="space-y-1">
            {note.items?.slice(0, 5).map(item => (
              <li key={item.id} className="flex items-center gap-2">
                <div className={cn("h-3 w-3 rounded-sm border border-text-placeholder", item.checked && "bg-accent border-accent")} />
                <span className={cn(item.checked && "line-through opacity-50")}>{item.text}</span>
              </li>
            ))}
            {(note.items?.length || 0) > 5 && (
              <li className="text-xs text-text-placeholder">...and {note.items!.length - 5} more</li>
            )}
          </ul>
        ) : (
          <div dangerouslySetInnerHTML={{ __html: note.content }} />
        )}
      </div>

      <div className="mt-auto flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={toggleArchive} className="p-1 text-text-secondary hover:text-text-primary" title="Archive">
          <Archive className="h-4 w-4" />
        </button>
        <button onClick={moveToTrash} className="p-1 text-text-secondary hover:text-text-primary" title="Delete">
          <Trash2 className="h-4 w-4" />
        </button>
        <Dropdown>
          <DropdownTrigger asChild>
            <button className="p-1 text-text-secondary hover:text-text-primary" onClick={e => e.stopPropagation()}>
              <MoreVertical className="h-4 w-4" />
            </button>
          </DropdownTrigger>
          <DropdownContent side="top">
            <DropdownItem>Add Label</DropdownItem>
            <DropdownItem>Change Color</DropdownItem>
            <DropdownItem>Make a copy</DropdownItem>
          </DropdownContent>
        </Dropdown>
      </div>
    </div>
  );
};

/* --- NoteGrid --- */
export const NoteGrid: React.FC<{ notes: Note[] }> = ({ notes }) => {
  const { setActiveModal } = useAppStore();
  
  const pinned = notes.filter(n => n.pinned);
  const others = notes.filter(n => !n.pinned);

  const renderSection = (title: string, items: Note[]) => {
    if (items.length === 0) return null;
    return (
      <div className="mb-8">
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-text-placeholder px-1">
          {title}
        </h2>
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
          {items.map(note => (
            <NoteCard 
              key={note.id} 
              note={note} 
              onClick={() => setActiveModal('note', note.id)} 
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full">
      {renderSection('Pinned', pinned)}
      {renderSection(pinned.length > 0 ? 'Others' : '', others)}
      
      {notes.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center text-text-placeholder">
          <Lightbulb className="mb-4 h-16 w-16 opacity-20" />
          <p className="text-lg">Your notes appear here</p>
        </div>
      )}
    </div>
  );
};
