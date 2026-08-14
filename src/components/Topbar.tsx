import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Bell, Search, Sun, Moon, LogOut, Menu } from 'lucide-react';
import { format } from 'date-fns';
import { useFarm } from '../context/FarmContext';

export const Topbar = ({ onMenuClick }: { onMenuClick: () => void }) => {
  const { user, logout } = useAuth();
  const { alerts } = useFarm();
  const [isDark, setIsDark] = useState(false);
  const unreadAlerts = alerts.filter(a => !a.isRead).length;

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <header className="bg-card border-b border-border h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
      <div className="flex flex-1">
        <button
          type="button"
          className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted focus:outline-none"
          onClick={onMenuClick}
        >
          <Menu className="h-6 w-6" />
        </button>
        <div className="hidden md:flex items-center">
          <span className="text-lg font-semibold text-foreground">Green Acres Farm</span>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="hidden md:flex relative text-muted-foreground focus-within:text-foreground">
          <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="search"
            className="block w-full rounded-md border border-input bg-background py-2 pl-10 pr-3 text-sm placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
            placeholder="Search cows, alerts..."
          />
        </div>
        
        <div className="text-sm font-medium text-muted-foreground hidden sm:block">
          {format(new Date(), 'MMM dd, yyyy')}
        </div>

        <button
          type="button"
          className="p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors relative"
        >
          <Bell className="h-6 w-6" />
          {unreadAlerts > 0 && (
            <span className="absolute top-1 right-1 block h-2.5 w-2.5 rounded-full bg-destructive ring-2 ring-card" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setIsDark(!isDark)}
          className="p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          {isDark ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
        </button>

        <div className="flex items-center space-x-2 border-l border-border pl-4">
          <div className="flex flex-col text-right hidden sm:block">
            <span className="text-sm font-medium text-foreground">{user?.name}</span>
            <span className="text-xs text-muted-foreground capitalize">{user?.role}</span>
          </div>
          <button
            onClick={logout}
            className="p-1 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
            title="Logout"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
