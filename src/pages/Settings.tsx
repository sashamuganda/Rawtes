import React from 'react';
import { useAppStore } from '@/store';
import { Button } from '@/components/ui/Button';
import { Download, Trash2, Sun, Moon, Monitor, Grid, List as ListIcon } from 'lucide-react';
import { cn } from '@/components/ui/Button';

export const SettingsPage: React.FC = () => {
  const { theme, setTheme, viewMode, setViewMode, user, logout, notes } = useAppStore();

  const exportData = () => {
    const data = {
      notes,
      exportedAt: new Date().toISOString(),
      user: user?.login
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `rawtes-export-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h2 className="text-3xl font-display font-bold mb-8 text-text-primary">Settings</h2>

      <section className="mb-12">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-text-placeholder mb-4">Appearance</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col gap-3">
            <span className="text-sm font-medium">Theme</span>
            <div className="flex bg-surface-hover p-1 rounded-lg border border-border w-fit">
              {[
                { id: 'light', icon: Sun, label: 'Light' },
                { id: 'dark', icon: Moon, label: 'Dark' },
                { id: 'system', icon: Monitor, label: 'System' }
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id as any)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-md transition-all text-sm font-medium",
                    theme === t.id ? "bg-surface text-accent shadow-sm" : "text-text-secondary hover:text-text-primary"
                  )}
                >
                  <t.icon className="h-4 w-4" />
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-sm font-medium">Default View</span>
            <div className="flex bg-surface-hover p-1 rounded-lg border border-border w-fit">
              {[
                { id: 'grid', icon: Grid, label: 'Grid' },
                { id: 'list', icon: ListIcon, label: 'List' }
              ].map((v) => (
                <button
                  key={v.id}
                  onClick={() => setViewMode(v.id as any)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-md transition-all text-sm font-medium",
                    viewMode === v.id ? "bg-surface text-accent shadow-sm" : "text-text-secondary hover:text-text-primary"
                  )}
                >
                  <v.icon className="h-4 w-4" />
                  {v.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-text-placeholder mb-4">Data Management</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-surface border border-border">
            <div>
              <p className="font-medium">Export Notes</p>
              <p className="text-sm text-text-secondary">Download a JSON backup of all your notes and labels.</p>
            </div>
            <Button variant="outline" className="gap-2" onClick={exportData}>
              <Download className="h-4 w-4" /> Export JSON
            </Button>
          </div>
          
          <div className="flex items-center justify-between p-4 rounded-lg bg-red-50/50 border border-red-100">
            <div>
              <p className="font-medium text-red-900">Delete Account Cache</p>
              <p className="text-sm text-red-700">Clear local storage and sign out. Your Gist is NOT deleted.</p>
            </div>
            <Button variant="danger" className="gap-2" onClick={logout}>
              <Trash2 className="h-4 w-4" /> Sign out & Clear
            </Button>
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-text-placeholder mb-4">Account</h3>
        <div className="flex items-center gap-4 p-4 rounded-lg bg-surface border border-border">
          <img src={user?.avatar_url} alt={user?.login} className="h-12 w-12 rounded-full border border-border" />
          <div>
            <p className="font-bold text-lg">{user?.name || user?.login}</p>
            <p className="text-sm text-text-secondary">@{user?.login}</p>
          </div>
        </div>
      </section>
    </div>
  );
};
