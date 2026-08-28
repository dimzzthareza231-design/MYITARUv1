import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '../utils/storage';

export interface Notification {
  id: number;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  module: string;
  timestamp: string;
  read: boolean;
  link?: string;
}

interface NotificationPreferences {
  inApp: boolean;
  email: boolean;
  whatsapp: boolean;
  sms: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  preferences: NotificationPreferences;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => Notification;
  markAsRead: (id: number) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: number) => void;
  clearAll: () => void;
  updatePreferences: (newPrefs: Partial<NotificationPreferences>) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    inApp: true,
    email: true,
    whatsapp: false,
    sms: false
  });
  
  useEffect(() => {
    const saved = storage.get('notifications', null);
    if (saved && Array.isArray(saved) && saved.length > 0) {
      setNotifications(saved);
    } else {
      const dummy: Notification[] = [
        {
          id: 1,
          type: 'info',
          title: 'Pasien Baru Terdaftar',
          message: 'Budi Santoso telah terdaftar dengan No. RM RM-00123',
          module: 'Registrasi',
          timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
          read: false,
          link: '/pasien/123'
        },
        {
          id: 2,
          type: 'warning',
          title: 'Rujukan Akan Kadaluarsa',
          message: '3 rujukan BPJS akan kadaluarsa dalam 7 hari',
          module: 'BPJS',
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          read: false,
          link: '/bpjs/rujukan'
        },
        {
          id: 3,
          type: 'success',
          title: 'Klaim BPJS Approved',
          message: 'Klaim KLM-20260801-001 telah disetujui BPJS',
          module: 'Billing',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          read: true,
          link: '/bpjs/klaim/55'
        },
        {
          id: 4,
          type: 'error',
          title: 'Stok Obat Hampir Habis',
          message: 'Paracetamol 500mg tersisa 10 strip',
          module: 'Farmasi',
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
          read: true,
          link: '/farmasi/stok'
        },
        {
          id: 5,
          type: 'info',
          title: 'Appointment Reminder',
          message: 'Siti Aminah memiliki janji temu hari ini pukul 14:00',
          module: 'Poli',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          read: true,
          link: '/poli/jadwal'
        }
      ];
      setNotifications(dummy);
      storage.set('notifications', dummy);
    }
    
    const savedPrefs = storage.get('notification_preferences', null);
    if (savedPrefs) {
      setPreferences(savedPrefs);
    }
  }, []);
  
  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: Notification = {
      id: Date.now(),
      ...notification,
      timestamp: new Date().toISOString(),
      read: false
    };
    const updated = [newNotif, ...notifications];
    setNotifications(updated);
    storage.set('notifications', updated);
    
    // Simulasi kirim ke channel lain
    if (preferences.email) console.log('📧 Email sent:', notification);
    if (preferences.whatsapp) console.log('💬 WhatsApp sent:', notification);
    if (preferences.sms) console.log('📱 SMS sent:', notification);
    
    return newNotif;
  };
  
  const markAsRead = (id: number) => {
    const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    setNotifications(updated);
    storage.set('notifications', updated);
  };
  
  const markAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    storage.set('notifications', updated);
  };
  
  const deleteNotification = (id: number) => {
    const updated = notifications.filter(n => n.id !== id);
    setNotifications(updated);
    storage.set('notifications', updated);
  };
  
  const clearAll = () => {
    setNotifications([]);
    storage.set('notifications', []);
  };
  
  const updatePreferences = (newPrefs: Partial<NotificationPreferences>) => {
    const updated = { ...preferences, ...newPrefs };
    setPreferences(updated);
    storage.set('notification_preferences', updated);
  };
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      preferences,
      addNotification,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      clearAll,
      updatePreferences
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
