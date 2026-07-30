import React, { useState } from 'react';
import { UserPlus, XCircle, Bed, FlaskConical } from 'lucide-react';
import { 
  Activity, 
  BrainCircuit, 
  LayoutDashboard, 
  Users, 
  FileText, 
  Settings, 
  LogOut,
  CreditCard,
  Receipt,
  Shield,
  Stethoscope
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { useHospital } from '../contexts/HospitalContext';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
  onLogout: () => void;
}

export function Sidebar({ currentView, onViewChange, onLogout }: SidebarProps) {
  const { activeUser } = useHospital();
  
  const menuGroups = [
    {
      category: 'Clinical',
      items: [
        { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
        { id: 'ai-assistant', label: 'AI Assistant', icon: BrainCircuit },
        { id: 'patients', label: 'Patients', icon: Users },
        { id: 'beds', label: 'Bed Management', icon: Bed },
        { id: 'pharmacy', label: 'Pharmacy', icon: FlaskConical },
        { id: 'records', label: 'Records', icon: FileText },
        { id: 'forms-doctor', label: 'Forms (Doctor)', icon: FileText },
        { id: 'forms-nurse', label: 'Forms (Nurse)', icon: FileText },
        { id: 'forms-medical-record', label: 'Forms (Med Record)', icon: FileText },
        { id: 'analytics', label: 'Analytics', icon: Activity },
      ]
    },
    {
      category: 'Billing',
      items: [
        { id: 'invoices', label: 'Invoices', icon: Receipt },
        { id: 'claims', label: 'Insurance Claims', icon: CreditCard },
      ]
    },
    {
      category: 'Admin',
      items: [
        { id: 'staff', label: 'Staff Management', icon: Stethoscope },
        { id: 'security', label: 'Security Logs', icon: Shield },
        { id: 'settings', label: 'Settings', icon: Settings },
      ]
    }
  ];

  return (
    <aside className="w-64 h-screen border-r border-white/5 bg-sidebar flex flex-col fixed left-0 top-0 z-40 overflow-hidden">
      <div className="p-6 flex items-center gap-3 shrink-0">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-emerald to-primary-blue flex items-center justify-center">
          <span className="font-bold text-black text-lg">M</span>
        </div>
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-white">
            MYITARU <span className="text-primary-emerald">AI</span>
          </h1>
          <p className="text-[10px] uppercase tracking-widest text-primary-emerald/70 font-semibold mt-0.5">
            Medical Intelligence
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar px-4 pb-6 space-y-6">
        {menuGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="space-y-2">
            <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest px-2 mb-3">
              {group.category}
            </p>
            <div className="space-y-1">
              {group.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 relative group overflow-hidden",
                    currentView === item.id 
                      ? "text-primary-emerald bg-primary-emerald/10 border border-primary-emerald/20 shadow-lg shadow-emerald-900/20" 
                      : "text-white/40 hover:text-white hover:bg-white/5 border border-transparent"
                  )}
                >
                  <item.icon className={cn(
                    "w-4 h-4 transition-colors duration-300 relative z-10", 
                    currentView === item.id ? "text-primary-emerald" : "group-hover:text-primary-emerald"
                  )} />
                  <span className="font-medium text-sm relative z-10">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 mt-auto border-t border-white/5 shrink-0">
        <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-all duration-300 border border-transparent">
          <LogOut className="w-4 h-4" />
          <span className="font-medium text-sm">Logout</span>
        </button>
        
        <div className="mt-4 px-3 py-3 rounded-xl bg-white/5 border border-white/5 flex flex-col gap-3 relative">
          <div className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 transition-colors pointer-events-none">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-white/60">{activeUser?.initials || '??'}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate text-white">{activeUser?.name || 'Unknown'}</p>
                <p className="text-[10px] text-primary-emerald uppercase tracking-widest font-bold truncate">{activeUser?.role || 'Staff'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
