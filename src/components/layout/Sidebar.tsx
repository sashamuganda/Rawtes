import { 
  Lightbulb, Bell, Archive, Trash2, 
  ChevronLeft, Tag 
} from 'lucide-react';
import { useAppStore } from '@/store';
import { Button, cn } from '../ui/Button';
import { Link, useLocation } from 'react-router-dom';

/* --- Sidebar --- */
export const Sidebar: React.FC = () => {
  const { sidebarOpen, sidebarCollapsed, setSidebarCollapsed, labels } = useAppStore();
  const location = useLocation();

  const navItems = [
    { icon: Lightbulb, label: 'Notes', path: '/notes' },
    { icon: Bell, label: 'Reminders', path: '/reminders' },
    { icon: Archive, label: 'Archive', path: '/archive' },
    { icon: Trash2, label: 'Trash', path: '/trash' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside 
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-border bg-surface transition-all duration-300 md:relative",
        sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        sidebarCollapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex h-16 items-center justify-between px-6">
        {!sidebarCollapsed && <span className="text-xl font-display font-bold text-accent">Rawtes</span>}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="hidden md:flex"
        >
          <ChevronLeft className={cn("h-5 w-5 transition-transform", sidebarCollapsed && "rotate-180")} />
        </Button>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-surface-hover",
              isActive(item.path) ? "bg-accent-light text-accent-dark hover:bg-accent-light" : "text-text-secondary"
            )}
            title={sidebarCollapsed ? item.label : undefined}
          >
            <item.icon className="h-5 w-5 shrink-0" />
            {!sidebarCollapsed && <span>{item.label}</span>}
          </Link>
        ))}

        <div className="my-4 border-t border-border" />

        {!sidebarCollapsed && (
          <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-text-placeholder">
            Labels
          </div>
        )}

        {labels.map((label) => (
          <Link
            key={label.id}
            to={`/labels/${label.id}`}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-surface-hover",
              isActive(`/labels/${label.id}`) ? "bg-accent-light text-accent-dark hover:bg-accent-light" : "text-text-secondary"
            )}
            title={sidebarCollapsed ? label.name : undefined}
          >
            <Tag className="h-5 w-5 shrink-0" style={{ color: label.color }} />
            {!sidebarCollapsed && <span>{label.name}</span>}
          </Link>
        ))}
      </nav>
    </aside>
  );
};
