import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/store';
import { useSaveNote } from '@/hooks/useSaveNote';
import { useNote } from '@/hooks/useNotes';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { RichTextEditor } from '../editor/RichTextEditor';
import type { Note, ChecklistItem } from '@/types/note';
import { ulid } from 'ulid';
import { Plus, Trash2, CheckSquare, Square } from 'lucide-react';
import { cn } from '../ui/Button';

/* --- NoteEditor --- */
export const NoteEditor: React.FC = () => {
  const { activeModal, activeNoteId, setActiveModal } = useAppStore();
  const note = useNote(activeNoteId);
  const { saveNote } = useSaveNote();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [type, setType] = useState<'text' | 'checklist'>('text');
  const [color, setColor] = useState<Note['color']>('default');

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setItems(note.items || []);
      setType(note.type as any);
      setColor(note.color);
    }
  }, [note]);

  if (!note && activeModal === 'note' && activeNoteId) return null;

  const handleClose = () => setActiveModal(null);

  const handleChange = (updates: Partial<Note>) => {
    if (!note) return;
    const updatedNote = { ...note, ...updates, updatedAt: new Date().toISOString() };
    saveNote(updatedNote);
  };

  return (
    <Modal 
      open={activeModal === 'note'} 
      onOpenChange={(open) => !open && handleClose()}
      className={cn("max-w-2xl p-0", color !== 'default' && `bg-note-${color}`)}
    >
      <div className="flex flex-col p-6">
        <div className="flex items-center justify-between mb-4">
          <input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              handleChange({ title: e.target.value });
            }}
            placeholder="Title"
            className="text-2xl font-body font-bold bg-transparent border-none outline-none w-full placeholder:text-text-placeholder"
          />
        </div>

        <div className="min-h-[300px]">
          {type === 'checklist' ? (
            <ChecklistEditor 
              items={items} 
              onChange={(newItems) => {
                setItems(newItems);
                handleChange({ items: newItems });
              }} 
            />
          ) : (
            <RichTextEditor 
              content={content} 
              onChange={(newContent) => {
                setContent(newContent);
                handleChange({ content: newContent });
              }} 
            />
          )}
        </div>

        <div className="mt-8 flex items-center justify-between border-t border-black/5 pt-4">
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={() => setType(type === 'text' ? 'checklist' : 'text')}>
              {type === 'text' ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4" />}
            </Button>
            <div className="mx-2 h-4 w-[1px] bg-black/5" />
          </div>
          <Button variant="ghost" onClick={handleClose}>Close</Button>
        </div>
      </div>
    </Modal>
  );
};

/* --- ChecklistEditor --- */
interface ChecklistEditorProps {
  items: ChecklistItem[];
  onChange: (items: ChecklistItem[]) => void;
}

export const ChecklistEditor: React.FC<ChecklistEditorProps> = ({ items, onChange }) => {
  const addItem = () => {
    const newItem: ChecklistItem = {
      id: ulid(),
      text: '',
      checked: false,
      order: items.length
    };
    onChange([...items, newItem]);
  };

  const updateItem = (id: string, text: string) => {
    onChange(items.map(i => i.id === id ? { ...i, text } : i));
  };

  const toggleItem = (id: string) => {
    onChange(items.map(i => i.id === id ? { ...i, checked: !i.checked } : i));
  };

  const removeItem = (id: string) => {
    onChange(items.filter(i => i.id !== id));
  };

  return (
    <div className="flex flex-col gap-2">
      {items.map((item) => (
        <div key={item.id} className="group flex items-center gap-2">
          <button onClick={() => toggleItem(item.id)} className="text-text-placeholder hover:text-accent">
            {item.checked ? <CheckSquare className="h-5 w-5 text-accent" /> : <Square className="h-5 w-5" />}
          </button>
          <input
            value={item.text}
            onChange={(e) => updateItem(item.id, e.target.value)}
            className={cn(
              "flex-1 bg-transparent border-none outline-none text-sm placeholder:text-text-placeholder",
              item.checked && "line-through text-text-secondary"
            )}
            placeholder="List item"
          />
          <button 
            onClick={() => removeItem(item.id)}
            className="opacity-0 group-hover:opacity-100 p-1 text-text-placeholder hover:text-danger transition-opacity"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
      <button 
        onClick={addItem}
        className="flex items-center gap-3 text-sm text-text-placeholder hover:text-text-secondary py-2 px-1"
      >
        <Plus className="h-4 w-4" /> Add item
      </button>
    </div>
  );
};
