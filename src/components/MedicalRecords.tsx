import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Plus, FileText, CheckCircle2, Clock, User, Stethoscope, XCircle, Activity, FlaskConical } from "lucide-react";
import { useHospital } from '../contexts/HospitalContext';
import { cn } from '../lib/utils';
import type { MedicalRecord } from '../types';

export function MedicalRecords() {
  const { records, addRecord, patients, activeUser, doctors, nurses } = useHospital();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  const [newRecord, setNewRecord] = useState<Partial<MedicalRecord>>({
    patientId: '',
    diagnosis: '',
    treatment: '',
    status: 'Ongoing'
  });

  const filteredRecords = records.filter(r => 
    r.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Medical Records</h1>
          <p className="text-sm text-white/40">Manage patient electronic health records</p>
        </div>
        <button className="btn-primary" onClick={() => setIsAdding(true)}>
          <Plus className="w-4 h-4" />
          <span>New Record</span>
        </button>
      </div>

      <div className="flex-1 glass-panel flex flex-col overflow-hidden border border-white/5">
        <div className="p-4 border-b border-white/5 flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Search by Patient Name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 glass-input text-sm"
            />
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-xs uppercase tracking-wider text-white/40">
                <th className="p-4 font-bold">Record ID</th>
                <th className="p-4 font-bold">Patient</th>
                <th className="p-4 font-bold">Date</th>
                <th className="p-4 font-bold">Diagnosis</th>
                <th className="p-4 font-bold">Doctor in Charge</th>
                <th className="p-4 font-bold">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.slice(0, 100).map(record => (
                <tr key={record.id} onClick={() => setSelectedRecordId(record.id)} className="border-b border-white/5 hover:bg-white/5 transition-colors group cursor-pointer">
                  <td className="p-4 text-sm font-medium text-white/80">{record.id}</td>
                  <td className="p-4">
                    <div className="text-sm text-white font-medium">{record.patientName}</div>
                    <div className="text-xs text-white/40">{record.patientId}</div>
                  </td>
                  <td className="p-4 text-sm text-white/60">{record.date}</td>
                  <td className="p-4">
                    <div className="text-sm text-white max-w-[200px] truncate">{record.diagnosis}</div>
                    <div className="text-xs text-white/40 max-w-[200px] truncate">{record.treatment}</div>
                  </td>
                  <td className="p-4 text-sm text-white/80 flex items-center gap-2">
                    <Stethoscope className="w-3 h-3 text-primary-blue" />
                    {record.doctorInCharge}
                  </td>
                  <td className="p-4">
                    <span className={cn(
                      "px-2 py-1 rounded text-xs font-bold border",
                      record.status === 'Completed' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                      record.status === 'Ongoing' ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                      "bg-orange-500/10 text-orange-400 border-orange-500/20"
                    )}>
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedRecordId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel p-6 w-full max-w-2xl border border-white/10 shadow-2xl flex flex-col max-h-[90vh]"
          >
            <div className="flex justify-between items-center mb-6 shrink-0">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary-emerald" />
                Medical Record Details
              </h2>
              <button onClick={() => setSelectedRecordId(null)} className="text-white/40 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            {(() => {
              const record = records.find(r => r.id === selectedRecordId);
              if (!record) return null;
              const patient = patients.find(p => p.id === record.patientId);
              
              return (
                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-6">
                  <div className="flex flex-col md:flex-row gap-6 p-4 bg-white/5 rounded-xl border border-white/5">
                    {patient && (
                      <img src={patient.photoUrl} alt="Patient" className="w-16 h-16 rounded-xl object-cover border border-white/10" />
                    )}
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-bold text-white">{record.patientName}</h3>
                          <p className="text-xs text-white/60 font-mono">{record.patientId}</p>
                        </div>
                        <span className={cn(
                          "px-2 py-1 rounded text-xs font-bold border",
                          record.status === 'Completed' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                          record.status === 'Ongoing' ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                          "bg-orange-500/10 text-orange-400 border-orange-500/20"
                        )}>
                          {record.status}
                        </span>
                      </div>
                      <div className="mt-4 grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest mb-1">Date</p>
                          <p className="text-sm text-white">{record.date}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest mb-1 flex items-center gap-1"><Stethoscope className="w-3 h-3"/> Doctor in Charge</p>
                          <p className="text-sm text-white">{record.doctorInCharge}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-2 flex items-center gap-2">
                      <Activity className="w-4 h-4 text-orange-400" /> Diagnosis
                    </h4>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                      <p className="text-sm text-white/80 whitespace-pre-wrap">{record.diagnosis}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-2 flex items-center gap-2">
                      <FlaskConical className="w-4 h-4 text-blue-400" /> Treatment & Medication
                    </h4>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                      <p className="text-sm text-white/80 whitespace-pre-wrap">{record.treatment}</p>
                    </div>
                  </div>
                  
                  {patient && patient.history && (
                    <div>
                       <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Patient History Context</h4>
                       <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-3">
                         {patient.history.allergies.length > 0 && (
                            <div>
                               <span className="text-[10px] text-red-400 uppercase font-bold tracking-widest">Allergies: </span>
                               <span className="text-xs text-white/80">{patient.history.allergies.join(', ')}</span>
                            </div>
                         )}
                         {patient.history.diseases.length > 0 && (
                            <div>
                               <span className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Previous Conditions: </span>
                               <span className="text-xs text-white/80">{patient.history.diseases.join(', ')}</span>
                            </div>
                         )}
                       </div>
                    </div>
                  )}

                  <div className="flex gap-4 pt-4 border-t border-white/10">
                     <button className="flex-1 btn-primary py-2.5 text-sm flex items-center justify-center gap-2">
                       <FileText className="w-4 h-4" /> Export PDF
                     </button>
                     <button onClick={() => setSelectedRecordId(null)} className="flex-1 px-4 py-2.5 rounded-lg border border-white/10 hover:bg-white/5 transition-colors text-sm font-medium text-white/80">
                       Close
                     </button>
                  </div>
                </div>
              );
            })()}
          </motion.div>
        </div>
      )}
      
      {isAdding && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel p-6 w-full max-w-lg mx-4 border border-white/10 shadow-2xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Add Medical Record</h2>
              <button onClick={() => setIsAdding(false)} className="text-white/40 hover:text-white">
                <Search className="w-6 h-6 rotate-45" /> {/* Use search rotated as X if X is missing */}
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs text-white/60 mb-1 block">Patient</label>
                <select 
                  className="w-full glass-input p-2 text-sm bg-midnight" 
                  value={newRecord.patientId} 
                  onChange={e => setNewRecord({...newRecord, patientId: e.target.value})}
                >
                  <option value="">Select Patient...</option>
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.fullName} ({p.id})</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="text-xs text-white/60 mb-1 block">Diagnosis</label>
                <textarea 
                  className="w-full glass-input p-2 text-sm min-h-[80px]" 
                  value={newRecord.diagnosis} 
                  onChange={e => setNewRecord({...newRecord, diagnosis: e.target.value})} 
                  placeholder="e.g. Acute Bronchitis" 
                />
              </div>

              <div>
                <label className="text-xs text-white/60 mb-1 block">Treatment / Medication</label>
                <textarea 
                  className="w-full glass-input p-2 text-sm min-h-[80px]" 
                  value={newRecord.treatment} 
                  onChange={e => setNewRecord({...newRecord, treatment: e.target.value})} 
                  placeholder="e.g. Prescribed antibiotics..." 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-white/60 mb-1 block">Status</label>
                  <select 
                    className="w-full glass-input p-2 text-sm bg-midnight" 
                    value={newRecord.status} 
                    onChange={e => setNewRecord({...newRecord, status: e.target.value as any})}
                  >
                    <option value="Completed">Completed</option>
                    <option value="Ongoing">Ongoing</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </div>
              
              <button 
                className="w-full btn-primary mt-6"
                disabled={!newRecord.patientId || !newRecord.diagnosis}
                onClick={() => {
                  const patient = patients.find(p => p.id === newRecord.patientId);
                  if (patient) {
                    addRecord({
                      id: `REC-${Math.floor(Math.random()*10000).toString().padStart(4, '0')}`,
                      patientId: patient.id,
                      patientName: patient.fullName,
                      date: new Date().toISOString().split('T')[0],
                      diagnosis: newRecord.diagnosis || 'Unknown',
                      treatment: newRecord.treatment || 'None',
                      doctorInCharge: activeUser?.name || 'Unknown User',
                      status: newRecord.status as any
                    });
                    setIsAdding(false);
                    setNewRecord({ patientId: '', diagnosis: '', treatment: '', status: 'Ongoing' });
                  }
                }}
              >
                Save Record
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
