import React from 'react';
import { Menu, Search as SearchIcon, Sun, Moon, Settings, User, LogOut } from 'lucide-react';
import { useAppStore } from '@/store';
import { Button } from '../ui/Button';
import { Input } from '../ui/Modal';
import { Dropdown, DropdownTrigger, DropdownContent, DropdownItem } from '../ui/Dropdown';
import { Link } from 'react-router-dom';

export const TopBar: React.FC = () => {
  const { toggleSidebar, theme, setTheme, user, logout } = useAppStore();

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-surface px-4 md:px-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
        <div className="hidden items-center gap-2 md:flex">
          <h1 className="text-2xl font-display font-bold text-accent">Rawtes</h1>
        </div>
      </div>

      <div className="flex max-w-xl flex-1 items-center px-4">
        <div className="relative w-full">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-placeholder" />
          <Input 
            placeholder="Search notes..." 
            className="w-full bg-surface-hover pl-10 border-none focus-visible:ring-1"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>

        <Dropdown>
          <DropdownTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt={user.login} className="h-8 w-8 rounded-full" />
              ) : (
                <User className="h-5 w-5" />
              )}
            </Button>
          </DropdownTrigger>
          <DropdownContent align="end">
            <div className="px-2 py-1.5 text-sm font-medium border-b border-border mb-1">
              {user?.name || user?.login}
            </div>
            <DropdownItem asChild>
              <Link to="/settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" /> Settings
              </Link>
            </DropdownItem>
            <DropdownItem onClick={logout} className="text-danger flex items-center gap-2">
              <LogOut className="h-4 w-4" /> Sign out
            </DropdownItem>
          </DropdownContent>
        </Dropdown>
      </div>
    </header>
  );
};
