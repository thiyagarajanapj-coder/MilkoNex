import React, { useState } from 'react';
import { useFarm } from '../context/FarmContext';
import { Card } from '../components/ui/Card';
import { Bell, AlertTriangle, Info, CheckCircle2, Search, Filter } from 'lucide-react';
import { format } from 'date-fns';
import type { AlertNotification } from '../lib/types';

const Alerts = () => {
  const { alerts, setAlerts } = useFarm();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const displayAlerts = alerts.filter(alert => {
    if (filter === 'unread' && alert.isRead) return false;
    if (searchTerm && !alert.message.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const unreadCount = alerts.filter(a => !a.isRead).length;

  const markAsRead = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, isRead: true } : a));
  };

  const markAllAsRead = () => {
    setAlerts(prev => prev.map(a => ({ ...a, isRead: true })));
  };

  const getSeverityIcon = (severity: AlertNotification['severity']) => {
    switch (severity) {
      case 'CRITICAL': return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'WARNING': return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'INFO': return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getSeverityBg = (severity: AlertNotification['severity'], isRead: boolean) => {
    if (isRead) return 'bg-background border-border';
    switch (severity) {
      case 'CRITICAL': return 'bg-red-50 border-red-200';
      case 'WARNING': return 'bg-amber-50 border-amber-200';
      case 'INFO': return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold tracking-tight mr-4">Notification Center</h1>
          {unreadCount > 0 && (
            <span className="bg-primary text-primary-foreground text-xs font-bold px-2.5 py-0.5 rounded-full">
              {unreadCount} Unread
            </span>
          )}
        </div>
        <button 
          onClick={markAllAsRead}
          disabled={unreadCount === 0}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-input bg-background hover:bg-muted h-10 px-4 py-2 disabled:opacity-50"
        >
          <CheckCircle2 className="mr-2 h-4 w-4 text-muted-foreground" />
          Mark all as read
        </button>
      </div>

      <Card>
        <div className="p-4 border-b border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-muted/30">
          <div className="flex space-x-2">
            <button 
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${filter === 'all' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'}`}
              onClick={() => setFilter('all')}
            >
              All Alerts
            </button>
            <button 
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${filter === 'unread' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'}`}
              onClick={() => setFilter('unread')}
            >
              Unread
            </button>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search alerts..."
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 pl-9 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="divide-y divide-border">
          {displayAlerts.length > 0 ? (
            displayAlerts.map(alert => (
              <div 
                key={alert.id} 
                className={`p-4 flex gap-4 transition-colors ${getSeverityBg(alert.severity, alert.isRead)}`}
              >
                <div className={`mt-0.5 shrink-0 p-2 rounded-full h-fit ${
                  !alert.isRead ? (
                    alert.severity === 'CRITICAL' ? 'bg-red-100' :
                    alert.severity === 'WARNING' ? 'bg-amber-100' : 'bg-blue-100'
                  ) : 'bg-muted'
                }`}>
                  {getSeverityIcon(alert.severity)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className={`text-sm font-semibold ${!alert.isRead ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {alert.type} Alert
                    </h4>
                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                      {format(new Date(alert.date), 'MMM dd, hh:mm a')}
                    </span>
                  </div>
                  <p className={`text-sm mb-2 ${!alert.isRead ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {alert.message}
                  </p>
                  
                  {!alert.isRead && (
                    <button 
                      onClick={() => markAsRead(alert.id)}
                      className="text-xs font-medium text-primary hover:underline"
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-muted-foreground">
              <Bell className="mx-auto h-12 w-12 opacity-20 mb-4" />
              <p>No alerts found matching your criteria.</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Alerts;
