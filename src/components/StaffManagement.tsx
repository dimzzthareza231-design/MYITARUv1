import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, UserPlus, Stethoscope, User, Plus, XCircle } from 'lucide-react';
import { useHospital } from '../contexts/HospitalContext';
import { cn } from '../lib/utils';
import type { Doctor, Nurse } from '../types';

export function StaffManagement() {
  const { doctors, nurses, addDoctor, addNurse } = useHospital();
  const [activeTab, setActiveTab] = useState<'doctors' | 'nurses'>('doctors');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newStaffType, setNewStaffType] = useState<'doctor'|'nurse'>('doctor');
  const [newStaff, setNewStaff] = useState({ name: '', department: '', initials: '', status: 'On Duty' as const });
  
  const filteredDoctors = doctors.filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()) || d.id.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredNurses = nurses.filter(n => n.name.toLowerCase().includes(searchQuery.toLowerCase()) || n.id.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Staff Management</h1>
          <p className="text-sm text-white/40">Manage medical personnel</p>
        </div>
        <button className="btn-primary" onClick={() => { setIsAdding(true); setNewStaffType(activeTab === 'doctors' ? 'doctor' : 'nurse'); }}>
          <UserPlus className="w-4 h-4" />
          <span>Add Staff</span>
        </button>
      </div>

      <div className="glass-panel p-2 flex gap-2 w-fit border border-white/5">
        <button 
          onClick={() => setActiveTab('doctors')}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 flex items-center gap-2",
            activeTab === 'doctors' ? "bg-primary-emerald text-black" : "text-white/40 hover:text-white hover:bg-white/5"
          )}
        >
          <Stethoscope className="w-4 h-4" /> Doctors ({doctors.length})
        </button>
        <button 
          onClick={() => setActiveTab('nurses')}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 flex items-center gap-2",
            activeTab === 'nurses' ? "bg-primary-blue text-white" : "text-white/40 hover:text-white hover:bg-white/5"
          )}
        >
          <User className="w-4 h-4" /> Nurses ({nurses.length})
        </button>
      </div>

      <div className="flex-1 glass-panel flex flex-col overflow-hidden border border-white/5">
        <div className="p-4 border-b border-white/5 flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Search by Name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 glass-input text-sm"
            />
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <AnimatePresence mode="popLayout">
              {(activeTab === 'doctors' ? filteredDoctors : filteredNurses).map((staff) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  key={staff.id}
                  className="glass-panel p-5 flex flex-col border border-white/5 hover:border-white/10 transition-colors group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-500/20 to-primary-blue/20 border border-white/10 flex items-center justify-center text-lg font-bold text-white shrink-0 group-hover:scale-110 transition-transform">
                      {staff.initials}
                    </div>
                    <span className={cn(
                      "px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest border",
                      staff.status === 'On Duty' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-white/5 text-white/40 border-white/10"
                    )}>
                      {staff.status}
                    </span>
                  </div>
                  
                  <div className="mt-auto">
                    <h3 className="font-bold text-white text-lg truncate">{staff.name}</h3>
                    <div className="text-sm text-primary-emerald font-medium mb-1 truncate">{staff.department}</div>
                    <div className="text-xs text-white/40 font-mono tracking-wider">{staff.id}</div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {isAdding && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel p-6 w-full max-w-lg mx-4 border border-white/10 shadow-2xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Add New {newStaffType === 'doctor' ? 'Doctor' : 'Nurse'}</h2>
              <button onClick={() => setIsAdding(false)} className="text-white/40 hover:text-white">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs text-white/60 mb-1 block">Staff Type</label>
                <div className="flex gap-2">
                  <button 
                    className={cn("flex-1 py-2 rounded-lg text-sm font-bold border transition-colors", newStaffType === 'doctor' ? "bg-primary-emerald/20 text-emerald-400 border-emerald-500/30" : "bg-white/5 text-white/40 border-white/10")}
                    onClick={() => setNewStaffType('doctor')}
                  >
                    Doctor
                  </button>
                  <button 
                    className={cn("flex-1 py-2 rounded-lg text-sm font-bold border transition-colors", newStaffType === 'nurse' ? "bg-primary-blue/20 text-primary-blue border-primary-blue/30" : "bg-white/5 text-white/40 border-white/10")}
                    onClick={() => setNewStaffType('nurse')}
                  >
                    Nurse
                  </button>
                </div>
              </div>
              <div>
                <label className="text-xs text-white/60 mb-1 block">Full Name</label>
                <input 
                  type="text"
                  className="w-full glass-input p-2 text-sm" 
                  value={newStaff.name} 
                  onChange={e => {
                    const initials = e.target.value.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
                    setNewStaff({...newStaff, name: e.target.value, initials});
                  }}
                  placeholder="e.g. Dr. Andi Wijaya"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-white/60 mb-1 block">Department</label>
                  <input 
                    type="text"
                    className="w-full glass-input p-2 text-sm" 
                    value={newStaff.department} 
                    onChange={e => setNewStaff({...newStaff, department: e.target.value})}
                    placeholder="e.g. Cardiology"
                  />
                </div>
                <div>
                  <label className="text-xs text-white/60 mb-1 block">Initials</label>
                  <input 
                    type="text"
                    className="w-full glass-input p-2 text-sm" 
                    value={newStaff.initials} 
                    onChange={e => setNewStaff({...newStaff, initials: e.target.value})}
                  />
                </div>
              </div>
              
              <button 
                className="w-full btn-primary mt-6"
                disabled={!newStaff.name || !newStaff.department}
                onClick={() => {
                  if (newStaffType === 'doctor') {
                    addDoctor({
                      id: `DR-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
                      ...newStaff
                    });
                  } else {
                    addNurse({
                      id: `NR-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
                      ...newStaff
                    });
                  }
                  setIsAdding(false);
                  setNewStaff({ name: '', department: '', initials: '', status: 'On Duty' });
                }}
              >
                Add Staff
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

