import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bed, User, Activity, AlertTriangle, Plus, Search, Filter, Info, Phone, Calendar } from 'lucide-react';
import { useHospital } from '../contexts/HospitalContext';
import { cn } from '../lib/utils';
import { Patient } from '../types';

export function BedManagement() {
  const { patients } = useHospital();
  
  const wards = [
    { id: 'icu', name: 'ICU', capacity: 50, type: 'Critical Care' },
    { id: 'vip', name: 'VIP Pavilion', capacity: 100, type: 'Premium' },
    { id: 'melati', name: 'Melati (Maternity)', capacity: 150, type: 'General' },
    { id: 'mawar', name: 'Mawar (Surgical)', capacity: 200, type: 'General' },
    { id: 'anggrek', name: 'Anggrek (Pediatrics)', capacity: 150, type: 'General' },
    { id: 'dahlia', name: 'Dahlia (Internal Med)', capacity: 200, type: 'General' },
  ];

  const bedsByWard = useMemo(() => {
    // In a real app, patients would already have valid room assignments
    // For demo purposes, we will deterministically place some patients into beds
    const inpatients = patients.filter(p => p.patientType === 'Inpatient' || p.status === 'Critical' || parseInt(p.id.split('-')[2] || '0') % 5 === 0);
    const bedAssignments: Record<string, { bedId: string, patient?: Patient }[]> = {};
    
    let inpatientIndex = 0;
    
    wards.forEach(ward => {
      bedAssignments[ward.id] = [];
      for (let i = 1; i <= ward.capacity; i++) {
        const bedId = `${ward.id.toUpperCase()}-${i.toString().padStart(3, '0')}`;
        
        let patient = inpatients.find(p => p.roomNumber === bedId);
        
        if (!patient && inpatientIndex < inpatients.length && (i % 3 !== 0)) {
            patient = inpatients[inpatientIndex++];
            patient = {...patient, roomNumber: bedId, patientType: 'Inpatient'};
        }
        
        bedAssignments[ward.id].push({
          bedId,
          patient
        });
      }
    });
    
    return bedAssignments;
  }, [patients]);

  const [selectedWard, setSelectedWard] = useState(wards[0].id);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBed, setSelectedBed] = useState<{bedId: string, patient?: Patient} | null>(null);

  const currentBeds = bedsByWard[selectedWard] || [];
  
  const filteredBeds = currentBeds.filter(bed => {
    if (!searchTerm) return true;
    const matchBed = bed.bedId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchPatient = bed.patient?.fullName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRM = bed.patient?.rmNumber.toLowerCase().includes(searchTerm.toLowerCase());
    return matchBed || matchPatient || matchRM;
  });

  const getOccupancyStats = () => {
    let total = 0;
    let occupied = 0;
    let critical = 0;
    wards.forEach(w => {
      total += w.capacity;
      const wardBeds = bedsByWard[w.id] || [];
      occupied += wardBeds.filter(b => b.patient).length;
      critical += wardBeds.filter(b => b.patient?.status === 'Critical').length;
    });
    return { total, occupied, available: total - occupied, rate: Math.round((occupied/total)*100) || 0, critical };
  };
  const stats = getOccupancyStats();

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-white">Bed Management</h1>
          <p className="text-sm text-white/40">Real-time room occupancy and patient assignment</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input 
              type="text" 
              placeholder="Search bed, patient, RM..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 glass-input rounded-xl text-sm w-64"
            />
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 shrink-0">
        <div className="glass-panel p-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-1">Total Beds</p>
            <p className="text-2xl font-bold text-white">{stats.total}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
            <Bed className="w-5 h-5 text-white/60" />
          </div>
        </div>
        <div className="glass-panel p-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-primary-emerald uppercase tracking-widest font-bold mb-1">Available</p>
            <p className="text-2xl font-bold text-primary-emerald">{stats.available}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-primary-emerald/10 flex items-center justify-center border border-primary-emerald/20">
            <Bed className="w-5 h-5 text-primary-emerald" />
          </div>
        </div>
        <div className="glass-panel p-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-primary-blue uppercase tracking-widest font-bold mb-1">Occupancy Rate</p>
            <p className="text-2xl font-bold text-primary-blue">{stats.rate}%</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-primary-blue/10 flex items-center justify-center border border-primary-blue/20">
            <Activity className="w-5 h-5 text-primary-blue" />
          </div>
        </div>
        <div className="glass-panel p-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-orange-400 uppercase tracking-widest font-bold mb-1">Critical Patients</p>
            <p className="text-2xl font-bold text-orange-400">{stats.critical}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
            <AlertTriangle className="w-5 h-5 text-orange-400" />
          </div>
        </div>
      </div>

      <div className="flex-1 flex gap-6 min-h-0">
        {/* Ward Selection */}
        <div className="w-64 shrink-0 glass-panel border border-white/5 p-4 flex flex-col gap-2 overflow-y-auto custom-scrollbar">
          {wards.map((ward) => {
            const wardBeds = bedsByWard[ward.id] || [];
            const occupied = wardBeds.filter(b => b.patient).length;
            const rate = Math.round((occupied / ward.capacity) * 100);
            return (
              <button 
                key={ward.id}
                onClick={() => { setSelectedWard(ward.id); setSelectedBed(null); }}
                className={cn(
                  "w-full text-left p-4 rounded-xl border transition-all",
                  selectedWard === ward.id 
                    ? "bg-primary-emerald/10 border-primary-emerald/30 shadow-lg" 
                    : "bg-white/5 border-transparent hover:bg-white/10"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={cn("font-bold text-sm", selectedWard === ward.id ? "text-primary-emerald" : "text-white")}>{ward.name}</span>
                  <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-bold", rate > 80 ? "bg-orange-500/20 text-orange-400" : "bg-primary-emerald/20 text-primary-emerald")}>
                    {rate}%
                  </span>
                </div>
                <div className="text-xs text-white/40 flex justify-between">
                  <span>{ward.type}</span>
                  <span>{occupied}/{ward.capacity}</span>
                </div>
                {/* Progress bar */}
                <div className="w-full h-1.5 bg-black/40 rounded-full mt-3 overflow-hidden">
                  <div 
                    className={cn("h-full rounded-full transition-all", rate > 80 ? "bg-orange-400" : "bg-primary-emerald")} 
                    style={{ width: `${rate}%` }}
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* Bed Grid & Detail */}
        <div className="flex-1 flex gap-6 min-h-0">
          <div className={cn("flex-1 glass-panel border border-white/5 p-6 overflow-y-auto custom-scrollbar transition-all", selectedBed ? 'lg:flex-none lg:w-2/3' : '')}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white">{wards.find(w => w.id === selectedWard)?.name} - Layout</h2>
              <div className="flex gap-4 text-xs font-medium text-white/40">
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-primary-emerald/20 border border-primary-emerald/40 block"></span> Available</div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-blue-500/20 border border-blue-500/40 block"></span> Occupied</div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-orange-500/20 border border-orange-500/40 block"></span> Critical</div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
              {filteredBeds.map(bed => {
                const isOccupied = !!bed.patient;
                const isCritical = bed.patient?.status === 'Critical';
                const isSelected = selectedBed?.bedId === bed.bedId;

                return (
                  <button
                    key={bed.bedId}
                    onClick={() => setSelectedBed(bed)}
                    className={cn(
                      "p-4 rounded-xl border text-left transition-all relative overflow-hidden group",
                      isSelected ? "ring-2 ring-white/20" : "",
                      isCritical 
                        ? "bg-orange-500/10 border-orange-500/30 hover:bg-orange-500/20" 
                        : isOccupied 
                          ? "bg-blue-500/10 border-blue-500/30 hover:bg-blue-500/20" 
                          : "bg-primary-emerald/5 border-primary-emerald/20 hover:bg-primary-emerald/10"
                    )}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className={cn(
                        "text-xs font-bold px-2 py-1 rounded-md bg-black/40",
                        isCritical ? "text-orange-400" : isOccupied ? "text-blue-400" : "text-primary-emerald"
                      )}>
                        {bed.bedId}
                      </span>
                      {isOccupied ? (
                        <User className={cn("w-4 h-4", isCritical ? "text-orange-400" : "text-blue-400")} />
                      ) : (
                        <Bed className="w-4 h-4 text-primary-emerald" />
                      )}
                    </div>
                    {isOccupied ? (
                      <div>
                        <div className="text-sm font-bold text-white truncate">{bed.patient?.fullName}</div>
                        <div className="text-[10px] text-white/60 truncate mt-1">{bed.patient?.rmNumber}</div>
                        {bed.patient?.history.diseases.length ? (
                          <div className="text-[10px] text-white/40 truncate mt-1 italic">
                            {bed.patient.history.diseases[0]}
                          </div>
                        ) : null}
                      </div>
                    ) : (
                      <div className="mt-2 text-sm font-medium text-white/40">Available</div>
                    )}
                  </button>
                )
              })}
              {filteredBeds.length === 0 && (
                <div className="col-span-full py-12 text-center text-white/40">
                  No beds found matching your search.
                </div>
              )}
            </div>
          </div>

          <AnimatePresence>
            {selectedBed && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex-1 glass-panel border border-white/5 p-6 overflow-y-auto custom-scrollbar hidden lg:block"
              >
                <div className="flex items-center justify-between mb-6 pb-6 border-b border-white/5">
                  <h3 className="text-xl font-bold text-white">Bed {selectedBed.bedId}</h3>
                  <button onClick={() => setSelectedBed(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                    <User className="w-5 h-5 text-white/40" />
                  </button>
                </div>

                {selectedBed.patient ? (
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <img src={selectedBed.patient.photoUrl} alt="Patient" className="w-16 h-16 rounded-xl object-cover border border-white/10" />
                      <div>
                        <h4 className="text-lg font-bold text-white">{selectedBed.patient.fullName}</h4>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs font-mono bg-white/10 px-2 py-0.5 rounded text-white/70">{selectedBed.patient.rmNumber}</span>
                          <span className={cn(
                            "text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full",
                            selectedBed.patient.status === 'Critical' ? "bg-orange-500/20 text-orange-400" : "bg-blue-500/20 text-blue-400"
                          )}>
                            {selectedBed.patient.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                      <div>
                        <p className="text-[10px] text-white/40 uppercase font-bold tracking-wider mb-1">Age / Gender</p>
                        <p className="text-sm text-white">{selectedBed.patient.age} / {selectedBed.patient.gender}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-white/40 uppercase font-bold tracking-wider mb-1">Blood Type</p>
                        <p className="text-sm text-white font-bold text-red-400">{selectedBed.patient.bloodType}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-white/40 uppercase font-bold tracking-wider mb-1 flex items-center gap-1"><Phone className="w-3 h-3"/> Contact</p>
                        <p className="text-sm text-white truncate">{selectedBed.patient.contact}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-white/40 uppercase font-bold tracking-wider mb-1">BPJS Status</p>
                        <p className={cn("text-sm font-medium", selectedBed.patient.bpjsStatus === 'Active' ? 'text-primary-emerald' : 'text-white/40')}>{selectedBed.patient.bpjsStatus}</p>
                      </div>
                    </div>

                    <div>
                      <h5 className="text-xs font-bold text-white/60 uppercase tracking-widest mb-3">Primary Diagnoses</h5>
                      <div className="flex flex-wrap gap-2">
                        {selectedBed.patient.history.diseases.length > 0 ? (
                          selectedBed.patient.history.diseases.map((d, i) => (
                            <span key={i} className="text-xs px-2.5 py-1 rounded-md bg-white/5 text-white/80 border border-white/10">{d}</span>
                          ))
                        ) : (
                          <span className="text-xs text-white/40">No recorded diagnoses.</span>
                        )}
                      </div>
                    </div>

                    <div>
                      <h5 className="text-xs font-bold text-white/60 uppercase tracking-widest mb-3">Active Medications</h5>
                      <div className="space-y-2">
                        {selectedBed.patient.history.medications.length > 0 ? (
                          selectedBed.patient.history.medications.map((m, i) => (
                            <div key={i} className="text-xs p-2 rounded-lg bg-blue-500/5 text-blue-200 border border-blue-500/10 flex items-start gap-2">
                              <Activity className="w-3 h-3 mt-0.5 shrink-0" />
                              <span>{m}</span>
                            </div>
                          ))
                        ) : (
                          <span className="text-xs text-white/40">No active medications.</span>
                        )}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/5 flex gap-3">
                      <button className="flex-1 btn-primary py-2 text-xs">View Full Record</button>
                      <button className="flex-1 px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 transition-colors text-xs font-medium text-white/80">Transfer Patient</button>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 rounded-full bg-primary-emerald/10 border border-primary-emerald/20 flex items-center justify-center mb-4">
                      <Bed className="w-8 h-8 text-primary-emerald" />
                    </div>
                    <h4 className="text-lg font-bold text-white mb-2">Bed is Available</h4>
                    <p className="text-sm text-white/40 max-w-[200px] mb-6">This bed is currently unassigned and ready for a new patient.</p>
                    <button className="btn-primary flex items-center gap-2">
                      <Plus className="w-4 h-4" /> Assign Patient
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
