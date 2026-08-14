import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Beef, 
  Droplets, 
  Wheat, 
  Activity, 
  HeartHandshake, 
  Thermometer, 
  DollarSign, 
  Package, 
  BarChart3, 
  FileText, 
  Bell, 
  Settings 
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Cows', href: '/cows', icon: Beef },
  { name: 'Milk Production', href: '/milk', icon: Droplets },
  { name: 'Feed Management', href: '/feed', icon: Wheat },
  { name: 'Health & Vaccination', href: '/health', icon: Activity },
  { name: 'Breeding', href: '/breeding', icon: HeartHandshake },
  { name: 'Temperature', href: '/temperature', icon: Thermometer },
  { name: 'Expenses & Income', href: '/finance', icon: DollarSign, adminOnly: true },
  { name: 'Inventory', href: '/inventory', icon: Package },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Reports', href: '/reports', icon: FileText },
  { name: 'Alerts', href: '/alerts', icon: Bell },
  { name: 'Settings', href: '/settings', icon: Settings, adminOnly: true },
];

export const Sidebar = () => {
  const { user } = useAuth();
  
  return (
    <div className="flex flex-col w-64 bg-card border-r border-border h-full">
      <div className="flex items-center h-16 shrink-0 px-4 border-b border-border">
        <img src="/logo.png" alt="MilkoNex Logo" className="h-8 w-8 object-contain" />
        <span className="ml-3 text-lg font-bold text-foreground">MilkoNex</span>
      </div>
      <div className="flex flex-col flex-1 overflow-y-auto py-4">
        <nav className="flex-1 px-2 space-y-1">
          {navigation.map((item) => {
            if (item.adminOnly && user?.role !== 'admin') return null;
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) => cn(
                  isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors'
                )}
              >
                {({ isActive }) => (
                  <>
                    <item.icon
                      className={cn(
                        isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground',
                        'mr-3 shrink-0 h-5 w-5 transition-colors'
                      )}
                      aria-hidden="true"
                    />
                    {item.name}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
