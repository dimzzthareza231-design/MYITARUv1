import fs from 'fs';
let content = fs.readFileSync('src/components/MedicalRecords.tsx', 'utf8');

const targetStr = `  const [newRecord, setNewRecord] = useState<Partial<MedicalRecord>>({`;
const newStr = `  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  const [newRecord, setNewRecord] = useState<Partial<MedicalRecord>>({`;

content = content.replace(targetStr, newStr);

const trStr = `                <tr key={record.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group cursor-pointer">`;
const newTrStr = `                <tr key={record.id} onClick={() => setSelectedRecordId(record.id)} className="border-b border-white/5 hover:bg-white/5 transition-colors group cursor-pointer">`;

content = content.replace(trStr, newTrStr);

// add the modal logic at the bottom before final closing div
const modalStr = `      {isAdding && (`;

const newModalStr = `      {selectedRecordId && (
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
      
      {isAdding && (`;

content = content.replace(modalStr, newModalStr);

// Ensure imports
if (!content.includes('XCircle')) {
  content = content.replace("import { Search, Plus, FileText, Stethoscope } from 'lucide-react';", "import { Search, Plus, FileText, Stethoscope, XCircle, Activity, FlaskConical } from 'lucide-react';");
}

fs.writeFileSync('src/components/MedicalRecords.tsx', content);
