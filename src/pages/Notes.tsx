import React from 'react';
import { useAppStore } from '@/store';
import { useNotes } from '@/hooks/useNotes';
import { useAuth } from '@/hooks/useAuth';
import { NoteGrid } from '@/components/notes/NoteCard';
import { CreateNoteBar } from '@/components/notes/CreateNoteBar';
import { Button } from '@/components/ui/Button';
import { DeviceCodeModal } from '@/components/auth/AuthGuard';
import { Info } from 'lucide-react';

/* --- Login Page --- */
export const LoginPage: React.FC = () => {
  const { login } = useAppStore();
  useAuth();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg px-6">
      <div className="flex flex-col items-center text-center max-w-2xl gap-8">
        <h1 className="text-6xl md:text-8xl font-display font-bold text-accent animate-fade-in">
          Rawtes
        </h1>
        <p className="text-xl md:text-2xl font-body text-text-secondary animate-slide-up">
          Your notes. Yours alone. Stored entirely in your GitHub account.
          No servers. No subscriptions. Absolute privacy.
        </p>

        <div className="flex flex-col items-center gap-4 animate-slide-up" style={{ animationDelay: '200ms' }}>
          <Button size="lg" className="px-10 h-14 text-lg gap-3" onClick={login}>
            Continue with GitHub
          </Button>
          <p className="text-sm text-text-placeholder">
            "We never see your notes. Ever."
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 text-left">
          {[
            { title: 'Zero Cost', desc: 'Runs on GitHub Pages and Gists for free.' },
            { title: 'Privacy First', desc: 'No database. No tracking. No telemetry.' },
            { title: 'Offline Built-in', desc: 'Work anywhere. Sync when online.' }
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-lg bg-surface border border-border">
              <h3 className="font-bold text-text-primary mb-1">{item.title}</h3>
              <p className="text-sm text-text-secondary">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <DeviceCodeModal />
    </div>
  );
};

/* --- Notes Page --- */
export const NotesPage: React.FC = () => {
  const { notes } = useAppStore();
  const { isLoading } = useNotes();
  
  const activeNotes = notes.filter(n => !n.archived && !n.trashed);

  return (
    <div>
      <CreateNoteBar />
      {isLoading && notes.length === 0 ? (
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        </div>
      ) : (
        <NoteGrid notes={activeNotes} />
      )}
    </div>
  );
};

/* --- Archive Page --- */
export const ArchivePage: React.FC = () => {
  const { notes } = useAppStore();
  const archivedNotes = notes.filter(n => n.archived && !n.trashed);

  return (
    <div>
      <div className="mb-6 flex items-center gap-2 rounded-lg bg-blue-50 p-4 text-blue-800 border border-blue-100">
        <Info className="h-5 w-5" />
        <span className="text-sm font-medium">Archive — Notes here are hidden from search and your main notes view.</span>
      </div>
      <NoteGrid notes={archivedNotes} />
    </div>
  );
};

/* --- Trash Page --- */
export const TrashPage: React.FC = () => {
  const { notes } = useAppStore();
  const trashedNotes = notes.filter(n => n.trashed);

  return (
    <div>
      <div className="mb-6 flex items-center gap-2 rounded-lg bg-red-50 p-4 text-red-800 border border-red-100">
        <Info className="h-5 w-5" />
        <span className="text-sm font-medium">Trash — Notes are permanently deleted after 7 days.</span>
      </div>
      <NoteGrid notes={trashedNotes} />
    </div>
  );
};
