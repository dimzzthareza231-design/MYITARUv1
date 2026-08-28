import React, { useState, useRef, useEffect } from 'react';
import { useNotification, Notification } from '../contexts/NotificationContext';
import { Bell, CheckCircle2, AlertTriangle, Info, XCircle, Trash2, Check, X } from 'lucide-react';

function NotificationBell() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification, clearAll } = useNotification();
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState('all');
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const filteredNotifs = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'all') return true;
    return n.type === filter;
  });
  
  const getTypeIcon = (type: Notification['type']) => {
    switch (type) {
        case 'info': return <Info className="w-4 h-4 text-blue-500" />;
        case 'success': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
        case 'warning': return <AlertTriangle className="w-4 h-4 text-orange-500" />;
        case 'error': return <XCircle className="w-4 h-4 text-rose-500" />;
        default: return <Info className="w-4 h-4 text-blue-500" />;
    }
  };
  
  const getTypeColor = (type: Notification['type']) => {
    const colors: Record<string, string> = {
      info: 'border-l-blue-500 bg-blue-50 dark:bg-blue-900/10',
      success: 'border-l-emerald-500 bg-emerald-50 dark:bg-emerald-900/10',
      warning: 'border-l-orange-500 bg-orange-50 dark:bg-orange-900/10',
      error: 'border-l-rose-500 bg-rose-50 dark:bg-rose-900/10'
    };
    return colors[type] || 'border-l-slate-500 bg-slate-50 dark:bg-slate-800';
  };
  
  const timeAgo = (timestamp: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(timestamp).getTime()) / 1000);
    if (seconds < 60) return 'Baru saja';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} menit lalu`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} jam lalu`;
    return `${Math.floor(seconds / 86400)} hari lalu`;
  };
  
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute 1 top-1 right-1 bg-rose-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold shadow-sm ring-2 ring-white dark:ring-slate-900">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200 origin-top-right">
          <div className="bg-slate-50 dark:bg-slate-900/50 p-4 border-b border-slate-200 dark:border-slate-700">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Bell className="w-4 h-4 text-blue-500" />
                Notifikasi
              </h3>
              {unreadCount > 0 && (
                  <span className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-0.5 rounded-full font-bold">
                    {unreadCount} baru
                  </span>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={markAllAsRead}
                className="text-xs flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors bg-white dark:bg-slate-800 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm"
              >
                <Check className="w-3 h-3" /> Tandai dibaca
              </button>
              <button
                onClick={clearAll}
                className="text-xs flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 font-medium transition-colors bg-white dark:bg-slate-800 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm"
              >
                <Trash2 className="w-3 h-3" /> Bersihkan
              </button>
            </div>
          </div>
          
          {/* Filter */}
          <div className="flex border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-x-auto custom-scrollbar">
            {['all', 'unread', 'info', 'success', 'warning', 'error'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2.5 text-xs font-bold whitespace-nowrap transition-colors ${
                  filter === f 
                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-blue-50/50 dark:bg-blue-900/10' 
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                }`}
              >
                {f === 'all' ? 'Semua' : f === 'unread' ? 'Belum Dibaca' : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          
          {/* Notification List */}
          <div className="max-h-96 overflow-y-auto custom-scrollbar">
            {filteredNotifs.length === 0 ? (
              <div className="p-10 text-center flex flex-col items-center justify-center">
                <Bell className="w-10 h-10 text-slate-300 dark:text-slate-600 mb-3" />
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Tidak ada notifikasi</p>
              </div>
            ) : (
              filteredNotifs.map(notif => (
                <div
                  key={notif.id}
                  className={`border-l-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer border-b border-slate-100 dark:border-slate-800 ${getTypeColor(notif.type)} ${!notif.read ? 'bg-opacity-100 dark:bg-opacity-100' : 'bg-transparent dark:bg-transparent opacity-75 grayscale-[0.2]'}`}
                  onClick={() => {
                    markAsRead(notif.id);
                    if (notif.link) {
                      console.log('Navigate to:', notif.link);
                    }
                  }}
                >
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1.5">
                        {getTypeIcon(notif.type)}
                        <span className={`text-sm font-bold ${!notif.read ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>{notif.title}</span>
                        {!notif.read && (
                          <span className="w-2 h-2 bg-blue-500 rounded-full shrink-0"></span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mb-2 leading-relaxed">{notif.message}</p>
                      <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 dark:text-slate-500 uppercase tracking-wider">
                        <span>{notif.module}</span>
                        <span>•</span>
                        <span>{timeAgo(notif.timestamp)}</span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notif.id);
                      }}
                      className="text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 p-1 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded transition-colors shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="border-t border-slate-200 dark:border-slate-700 p-3 bg-slate-50 dark:bg-slate-900/50 text-center">
            <button
              onClick={() => {
                setIsOpen(false);
                // Dispatch event or navigate to preferences
                window.dispatchEvent(new CustomEvent('navigate-notifications'));
              }}
              className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-bold"
            >
              Pengaturan Notifikasi →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
