import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, FlaskConical, Filter, FileText, CheckCircle2, AlertTriangle, Pill, User, Clock, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { useHospital } from '../contexts/HospitalContext';

export function Pharmacy() {
  const { patients } = useHospital();
  const [activeTab, setActiveTab] = useState<'inventory' | 'prescriptions'>('prescriptions');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  // Extract all unique medications from all patients to build a mock inventory
  const inventory = useMemo(() => {
    const medsMap = new Map<string, { count: number, stock: number, category: string }>();
    
    patients.forEach(p => {
      p.history.medications.forEach(med => {
        if (!medsMap.has(med)) {
          // Generate a mock stock level based on the name hash or just random
          const stock = Math.floor(Math.random() * 500) + 10;
          medsMap.set(med, { count: 0, stock, category: med.includes('mg') ? 'Tablet' : 'Syrup/Liquid' });
        }
        medsMap.get(med)!.count += 1;
      });
    });

    return Array.from(medsMap.entries()).map(([name, data]) => ({
      name,
      ...data,
      status: data.stock > 100 ? 'Good' : data.stock > 30 ? 'Low' : 'Critical'
    })).sort((a, b) => a.name.localeCompare(b.name));
  }, [patients]);

  const patientsWithMeds = useMemo(() => {
    return patients
      .filter(p => p.history.medications.length > 0)
      .filter(p => p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || p.rmNumber.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [patients, searchQuery]);

  const selectedPatient = patientsWithMeds.find(p => p.id === selectedPatientId);

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-white">Pharmacy</h1>
          <p className="text-sm text-white/40">Manage inventory and patient prescriptions</p>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab('prescriptions')}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2",
              activeTab === 'prescriptions' ? "bg-primary-emerald/20 text-primary-emerald" : "text-white/40 hover:text-white"
            )}
          >
            <FileText className="w-4 h-4" /> Prescriptions
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2",
              activeTab === 'inventory' ? "bg-blue-500/20 text-blue-400" : "text-white/40 hover:text-white"
            )}
          >
            <FlaskConical className="w-4 h-4" /> Inventory ({inventory.length})
          </button>
        </div>
        
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input 
            type="text" 
            placeholder={activeTab === 'prescriptions' ? "Search patient..." : "Search medication..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 glass-input rounded-xl text-sm w-full sm:w-64"
          />
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <AnimatePresence mode="wait">
          {activeTab === 'prescriptions' ? (
            <motion.div 
              key="prescriptions"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="h-full flex gap-6"
            >
              <div className="w-1/3 glass-panel border border-white/5 flex flex-col overflow-hidden">
                <div className="p-4 border-b border-white/5 font-bold text-white/60 uppercase tracking-widest text-xs flex justify-between">
                  <span>Pending Queue</span>
                  <span>{patientsWithMeds.length} Patients</span>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
                  {patientsWithMeds.map(patient => (
                    <button
                      key={patient.id}
                      onClick={() => setSelectedPatientId(patient.id)}
                      className={cn(
                        "w-full text-left p-3 rounded-xl transition-all border",
                        selectedPatientId === patient.id 
                          ? "bg-primary-emerald/10 border-primary-emerald/30 shadow-lg"
                          : "bg-white/5 border-transparent hover:bg-white/10"
                      )}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={cn("font-bold text-sm truncate", selectedPatientId === patient.id ? "text-primary-emerald" : "text-white")}>{patient.fullName}</span>
                        <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-white/60">{patient.rmNumber}</span>
                      </div>
                      <div className="text-xs text-white/40 flex items-center gap-1">
                        <Pill className="w-3 h-3" /> {patient.history.medications.length} Medications
                      </div>
                    </button>
                  ))}
                  {patientsWithMeds.length === 0 && (
                    <div className="p-8 text-center text-white/40 text-sm">
                      No prescriptions found.
                    </div>
                  )}
                </div>
              </div>

              <div className="w-2/3 glass-panel border border-white/5 flex flex-col overflow-hidden relative">
                {selectedPatient ? (
                  <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                    <div className="flex items-start justify-between mb-8 pb-6 border-b border-white/5">
                      <div className="flex items-center gap-4">
                        <img src={selectedPatient.photoUrl} alt="Patient" className="w-16 h-16 rounded-xl object-cover border border-white/10" />
                        <div>
                          <h2 className="text-xl font-bold text-white mb-1">{selectedPatient.fullName}</h2>
                          <div className="flex gap-3 text-xs text-white/60">
                            <span className="flex items-center gap-1"><User className="w-3 h-3" /> {selectedPatient.age} yo, {selectedPatient.gender}</span>
                            <span className="flex items-center gap-1 font-mono">{selectedPatient.rmNumber}</span>
                          </div>
                        </div>
                      </div>
                      <div className={cn(
                        "px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-widest border",
                        selectedPatient.bpjsStatus === 'Active' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-white/5 text-white/40 border-white/10"
                      )}>
                        BPJS: {selectedPatient.bpjsStatus}
                      </div>
                    </div>

                    <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4">Prescribed Medications</h3>
                    <div className="space-y-4">
                      {selectedPatient.history.medications.map((med, idx) => (
                        <div key={idx} className="bg-white/5 border border-white/10 p-4 rounded-xl flex items-center justify-between group hover:bg-white/10 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                              <Pill className="w-5 h-5 text-blue-400" />
                            </div>
                            <div>
                              <div className="font-bold text-white text-sm">{med}</div>
                              <div className="text-xs text-white/40 mt-1 flex items-center gap-3">
                                <span>1x a day</span>
                                <span className="w-1 h-1 rounded-full bg-white/20"></span>
                                <span>After meal</span>
                              </div>
                            </div>
                          </div>
                          <button className="opacity-0 group-hover:opacity-100 transition-opacity btn-primary py-1.5 px-4 text-xs flex items-center gap-2">
                            Dispense <CheckCircle2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-8 pt-6 border-t border-white/5">
                      <button className="w-full btn-primary py-3 flex justify-center items-center gap-2">
                        Dispense All <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-white/20">
                    <FileText className="w-16 h-16 mb-4 opacity-50" />
                    <p>Select a patient to view prescriptions</p>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="inventory"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="h-full glass-panel border border-white/5 overflow-hidden flex flex-col"
            >
              <div className="overflow-x-auto flex-1 custom-scrollbar">
                <table className="w-full text-left text-sm">
                  <thead className="bg-white/5 sticky top-0 z-10 backdrop-blur-md">
                    <tr>
                      <th className="px-6 py-4 font-bold text-white/40 uppercase tracking-widest text-[10px]">Medication Name</th>
                      <th className="px-6 py-4 font-bold text-white/40 uppercase tracking-widest text-[10px]">Category</th>
                      <th className="px-6 py-4 font-bold text-white/40 uppercase tracking-widest text-[10px]">Prescribed To</th>
                      <th className="px-6 py-4 font-bold text-white/40 uppercase tracking-widest text-[10px]">Stock Level</th>
                      <th className="px-6 py-4 font-bold text-white/40 uppercase tracking-widest text-[10px]">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {inventory.filter(i => i.name.toLowerCase().includes(searchQuery.toLowerCase())).map((item, idx) => (
                      <tr key={idx} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 font-medium text-white">{item.name}</td>
                        <td className="px-6 py-4 text-white/60">{item.category}</td>
                        <td className="px-6 py-4 text-white/60">{item.count} Patients</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-full h-1.5 bg-black/40 rounded-full max-w-[100px] overflow-hidden">
                              <div 
                                className={cn("h-full rounded-full", item.status === 'Critical' ? 'bg-red-400' : item.status === 'Low' ? 'bg-orange-400' : 'bg-primary-emerald')}
                                style={{ width: `${Math.min(100, (item.stock / 500) * 100)}%` }}
                              />
                            </div>
                            <span className="text-xs text-white/60 font-mono">{item.stock}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider",
                            item.status === 'Critical' ? "bg-red-500/20 text-red-400" :
                            item.status === 'Low' ? "bg-orange-500/20 text-orange-400" :
                            "bg-emerald-500/20 text-emerald-400"
                          )}>
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {inventory.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-white/40">No inventory data found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
