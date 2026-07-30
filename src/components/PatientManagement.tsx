import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, UserPlus, Activity, Phone, AlertCircle, 
  Droplet, Shield, HeartPulse, FileText, FlaskConical, 
  Stethoscope, Bed, PhoneCall, CheckCircle2, XCircle
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useHospital } from '../contexts/HospitalContext';
import type { Patient } from '../types';

// Mock Patient Data
export function PatientManagement() {
  const { patients, addPatient } = useHospital();
  const [isAdding, setIsAdding] = useState(false);
  const [newPatient, setNewPatient] = useState<Partial<Patient>>({ fullName: '', rmNumber: '', age: 30, gender: 'Laki-laki', bloodType: 'O+', status: 'Active', bpjsStatus: 'Active', contact: '', emergencyContact: '' });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id || "");

  const selectedPatient = patients.find(p => p.id === selectedPatientId) || patients[0];


  const [listMode, setListMode] = useState<'directory' | 'triage'>('directory');

  const triagedPatients = React.useMemo(() => {
    return patients.map(p => {
      // Mock AI Triage logic
      let score = 0;
      let reasons = [];
      
      if (p.age > 65) { score += 20; reasons.push('Elderly'); }
      if (p.history.diseases.includes('Hipertensi') || p.history.diseases.includes('Hypertension')) { score += 30; reasons.push('Hypertension History'); }
      if (p.history.diseases.includes('Diabetes')) { score += 20; reasons.push('Diabetes'); }
      if (p.history.diseases.includes('Stroke') || p.history.diseases.includes('Heart Disease')) { score += 50; reasons.push('Critical History'); }
      if (p.status === 'Critical') { score += 100; reasons.push('Current Critical Status'); }
      
      // randomize a bit for realism
      const vitalsRandom = Math.floor(Math.random() * 40);
      score += vitalsRandom;
      if (vitalsRandom > 30) reasons.push('Abnormal Vitals Detected');
      
      return { ...p, triageScore: score, triageReasons: reasons };
    }).sort((a, b) => b.triageScore - a.triageScore);
  }, [patients]);

  const filteredPatients = patients.filter(p => 
    p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.rmNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Patient Management</h1>
          <p className="text-sm text-white/40">Manage patient records and profiles</p>
        </div>
        <button className="btn-primary" onClick={() => setIsAdding(true)}>
          <UserPlus className="w-4 h-4" />
          <span>Add New Patient</span>
        </button>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
        {/* Patient List */}
        <div className="lg:col-span-4 flex flex-col glass-panel overflow-hidden border border-white/5">
          <div className="p-4 border-b border-white/5 space-y-3">
            <div className="flex bg-white/5 p-1 rounded-xl">
              <button 
                onClick={() => setListMode('directory')}
                className={cn("flex-1 text-xs py-1.5 rounded-lg font-bold transition-all", listMode === 'directory' ? "bg-white/10 text-white" : "text-white/40 hover:text-white")}
              >Directory</button>
              <button 
                onClick={() => setListMode('triage')}
                className={cn("flex-1 text-xs py-1.5 rounded-lg font-bold transition-all flex items-center justify-center gap-1", listMode === 'triage' ? "bg-orange-500/20 text-orange-400" : "text-white/40 hover:text-white")}
              ><Activity className="w-3 h-3" /> AI Triage</button>
            </div>
            {listMode === 'directory' && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="text"
                  placeholder="Search by name, ID, or RM..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 glass-input text-sm"
                />
              </div>
            )}
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
            {(listMode === 'directory' ? filteredPatients : triagedPatients).slice(0, 100).map(patient => (
              <div key={patient.id} className="flex flex-col gap-1">
              <button
                onClick={() => setSelectedPatientId(patient.id)}
                className={cn(
                  "w-full text-left p-3 rounded-xl transition-all duration-300 flex items-center gap-3 border",
                  selectedPatientId === patient.id
                    ? "bg-primary-emerald/10 border-primary-emerald/20 shadow-lg shadow-emerald-900/10"
                    : "bg-transparent border-transparent hover:bg-white/5 hover:border-white/5"
                )}
              >
                <img 
                  src={patient.photoUrl} 
                  alt={patient.fullName} 
                  className="w-10 h-10 rounded-full object-cover border border-white/10"
                />
                <div className="flex-1 overflow-hidden">
                  <div className="font-semibold text-white truncate text-sm">{patient.fullName}</div>
                  <div className="text-[10px] text-white/40 font-bold uppercase tracking-wider truncate">
                    {patient.rmNumber}
                  </div>
                </div>
                {listMode === 'triage' ? (
                  <div className={cn("shrink-0 px-2 py-1 rounded-lg text-xs font-bold border", 
                    (patient as any).triageScore >= 100 ? "bg-red-500/20 text-red-400 border-red-500/30" : 
                    (patient as any).triageScore >= 60 ? "bg-orange-500/20 text-orange-400 border-orange-500/30" : 
                    "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                  )}>
                    {(patient as any).triageScore} pts
                  </div>
                ) : (
                  patient.bpjsStatus === 'Active' && (
                    <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
                  )
                )}
              </button>
              {listMode === 'triage' && selectedPatientId === patient.id && (
                <div className="px-3 pb-3 pt-1 text-[10px] text-white/60">
                  <div className="font-bold text-orange-400 mb-1">AI Triage Flags:</div>
                  <ul className="list-disc pl-4 space-y-0.5">
                    {(patient as any).triageReasons.map((r: string, i: number) => <li key={i}>{r}</li>)}
                  </ul>
                  <button className="mt-2 w-full py-1.5 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/30 font-bold hover:bg-orange-500/20 transition-colors">
                    Prioritize for Bed Assignment
                  </button>
                </div>
              )}
              </div>
            ))}
          </div>
        </div>

        {/* Patient Profile Card */}
        <div className="lg:col-span-8 flex flex-col min-h-0 overflow-y-auto custom-scrollbar pr-2 pb-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedPatient.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Header / Basic Info */}
              <div className="glass-panel p-6 border border-white/5 flex flex-col md:flex-row gap-6 items-start md:items-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-emerald/5 rounded-full blur-[80px]" />
                
                <div className="relative">
                  <img 
                    src={selectedPatient.photoUrl} 
                    alt={selectedPatient.fullName} 
                    className="w-24 h-24 rounded-2xl object-cover border-2 border-primary-emerald/20 shadow-xl"
                  />
                  <div className={cn(
                    "absolute -bottom-2 -right-2 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border",
                    selectedPatient.status === 'Active' 
                      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" 
                      : "bg-red-500/20 text-red-400 border-red-500/30"
                  )}>
                    {selectedPatient.status}
                  </div>
                </div>

                <div className="flex-1 z-10">
                  <div className="flex flex-wrap items-center gap-3 mb-1">
                    <h2 className="text-2xl font-bold text-white">{selectedPatient.fullName}</h2>
                    <span className="px-2 py-1 bg-white/10 rounded text-[10px] text-white/60 font-bold tracking-wider">
                      {selectedPatient.id}
                    </span>
                  </div>
                  <div className="text-primary-emerald text-sm font-medium mb-4 flex items-center gap-2">
                    <FileText className="w-4 h-4" /> RM: {selectedPatient.rmNumber}
                  </div>
                  
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-1.5 text-white/60">
                      <Activity className="w-4 h-4" />
                      <span>{selectedPatient.age} Thn, {selectedPatient.gender}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-white/60">
                      <Droplet className="w-4 h-4 text-red-400" />
                      <span>Gol. Darah: {selectedPatient.bloodType}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-white/60">
                      <Shield className={cn("w-4 h-4", selectedPatient.bpjsStatus === 'Active' ? "text-emerald-400" : "text-white/40")} />
                      <span>BPJS: {selectedPatient.bpjsStatus}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-white/60">
                      <Bed className="w-4 h-4 text-purple-400" />
                      <span>{selectedPatient.patientType || 'Outpatient'} {selectedPatient.roomNumber ? `(${selectedPatient.roomNumber})` : ''}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="glass-panel p-4 border border-white/5 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-1">Kontak Pasien</div>
                    <div className="text-sm text-white">{selectedPatient.contact}</div>
                  </div>
                </div>
                <div className="glass-panel p-4 border border-white/5 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-400 shrink-0">
                    <PhoneCall className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-1">Emergency Contact</div>
                    <div className="text-sm text-white">{selectedPatient.emergencyContact}</div>
                  </div>
                </div>
              </div>

              {/* Medical History Sections */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Riwayat Penyakit & Pengobatan */}
                <div className="space-y-4">
                  <div className="glass-panel p-5 border border-white/5 h-full">
                    <div className="flex items-center gap-2 mb-4 text-emerald-400">
                      <HeartPulse className="w-5 h-5" />
                      <h3 className="font-semibold text-white">Penyakit & Pengobatan</h3>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <div className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-2">Riwayat Penyakit</div>
                        <ul className="space-y-1">
                          {selectedPatient.history.diseases.map((item, idx) => (
                            <li key={idx} className="text-sm text-white/80 flex items-start gap-2">
                              <span className="text-emerald-400 mt-1">•</span> {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <div className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-2">Riwayat Pengobatan</div>
                        <ul className="space-y-1">
                          {selectedPatient.history.medications.map((item, idx) => (
                            <li key={idx} className="text-sm text-white/80 flex items-start gap-2">
                              <span className="text-blue-400 mt-1">•</span> {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Alergi & Operasi */}
                <div className="space-y-4">
                  <div className="glass-panel p-5 border border-white/5 h-full">
                    <div className="flex items-center gap-2 mb-4 text-red-400">
                      <AlertCircle className="w-5 h-5" />
                      <h3 className="font-semibold text-white">Alergi & Operasi</h3>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <div className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-2">Riwayat Alergi</div>
                        {selectedPatient.history.allergies.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {selectedPatient.history.allergies.map((item, idx) => (
                              <span key={idx} className="px-2 py-1 rounded bg-red-500/10 text-red-400 text-xs border border-red-500/20">
                                {item}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <div className="text-sm text-white/40">Tidak ada riwayat alergi</div>
                        )}
                      </div>
                      <div>
                        <div className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-2">Riwayat Operasi</div>
                        <ul className="space-y-1">
                          {selectedPatient.history.surgeries.map((item, idx) => (
                            <li key={idx} className="text-sm text-white/80 flex items-start gap-2">
                              <span className="text-white/40 mt-1">•</span> {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Lab & Rawat */}
                <div className="space-y-4 md:col-span-2">
                  <div className="glass-panel p-5 border border-white/5">
                    <div className="flex items-center gap-2 mb-4 text-purple-400">
                      <FlaskConical className="w-5 h-5" />
                      <h3 className="font-semibold text-white">Laboratorium & Kunjungan</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <div className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-2 flex items-center gap-1">
                          <FlaskConical className="w-3 h-3" /> Riwayat Lab
                        </div>
                        <ul className="space-y-2">
                          {selectedPatient.history.labs.map((item, idx) => (
                            <li key={idx} className="text-xs text-white/80 bg-white/5 p-2 rounded border border-white/5">
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <div className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-2 flex items-center gap-1">
                          <Bed className="w-3 h-3" /> Rawat Inap
                        </div>
                        <ul className="space-y-2">
                          {selectedPatient.history.inpatient.map((item, idx) => (
                            <li key={idx} className="text-xs text-white/80 bg-white/5 p-2 rounded border border-white/5">
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <div className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-2 flex items-center gap-1">
                          <Stethoscope className="w-3 h-3" /> Rawat Jalan
                        </div>
                        <ul className="space-y-2">
                          {selectedPatient.history.outpatient.map((item, idx) => (
                            <li key={idx} className="text-xs text-white/80 bg-white/5 p-2 rounded border border-white/5">
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel p-6 w-full max-w-lg mx-4 border border-white/10 shadow-2xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Add New Patient</h2>
              <button onClick={() => setIsAdding(false)} className="text-white/40 hover:text-white">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-white/60 mb-1 block">Full Name</label>
                  <input type="text" className="w-full glass-input p-2 text-sm" value={newPatient.fullName} onChange={e => setNewPatient({...newPatient, fullName: e.target.value})} placeholder="e.g. John Doe" />
                </div>
                <div>
                  <label className="text-xs text-white/60 mb-1 block">RM Number</label>
                  <input type="text" className="w-full glass-input p-2 text-sm" value={newPatient.rmNumber} onChange={e => setNewPatient({...newPatient, rmNumber: e.target.value})} placeholder="e.g. RM-123456" />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-white/60 mb-1 block">Age</label>
                  <input type="number" className="w-full glass-input p-2 text-sm" value={newPatient.age} onChange={e => setNewPatient({...newPatient, age: parseInt(e.target.value)})} />
                </div>
                <div>
                  <label className="text-xs text-white/60 mb-1 block">Gender</label>
                  <select className="w-full glass-input p-2 text-sm bg-midnight" value={newPatient.gender} onChange={e => setNewPatient({...newPatient, gender: e.target.value as any})}>
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-white/60 mb-1 block">Blood Type</label>
                  <select className="w-full glass-input p-2 text-sm bg-midnight" value={newPatient.bloodType} onChange={e => setNewPatient({...newPatient, bloodType: e.target.value})}>
                    <option value="A+">A+</option>
                    <option value="B+">B+</option>
                    <option value="O+">O+</option>
                    <option value="AB+">AB+</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-white/60 mb-1 block">Contact</label>
                  <input type="text" className="w-full glass-input p-2 text-sm" value={newPatient.contact} onChange={e => setNewPatient({...newPatient, contact: e.target.value})} placeholder="e.g. +62..." />
                </div>
                <div>
                  <label className="text-xs text-white/60 mb-1 block">Emergency</label>
                  <input type="text" className="w-full glass-input p-2 text-sm" value={newPatient.emergencyContact} onChange={e => setNewPatient({...newPatient, emergencyContact: e.target.value})} placeholder="e.g. Wife - +62..." />
                </div>
              </div>
              
              <button 
                className="w-full btn-primary mt-6"
                onClick={() => {
                  addPatient({
                    id: `PT-${new Date().getFullYear()}-${Math.floor(Math.random()*10000).toString().padStart(4, '0')}`,
                    rmNumber: newPatient.rmNumber || `RM-${Math.floor(Math.random()*1000000)}`,
                    fullName: newPatient.fullName || 'Unknown',
                    photoUrl: 'https://i.pravatar.cc/150?u=' + Math.random(),
                    status: 'Active',
                    bpjsStatus: 'Active',
                    bloodType: newPatient.bloodType || 'O+',
                    age: newPatient.age || 30,
                    gender: newPatient.gender as any,
                    contact: newPatient.contact || '',
                    emergencyContact: newPatient.emergencyContact || '',
                    history: { allergies: [], surgeries: [], diseases: [], medications: [], labs: [], inpatient: [], outpatient: [] }
                  });
                  setIsAdding(false);
                }}
              >
                Save Patient
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

