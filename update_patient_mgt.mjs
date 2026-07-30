import fs from 'fs';
let content = fs.readFileSync('src/components/PatientManagement.tsx', 'utf8');

const triageCode = `
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
`;

if (!content.includes('const [listMode')) {
  content = content.replace("  const filteredPatients =", triageCode + "\n  const filteredPatients =");
}

const listHeaderOld = `          <div className="p-4 border-b border-white/5">
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
          </div>`;

const listHeaderNew = `          <div className="p-4 border-b border-white/5 space-y-3">
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
          </div>`;

content = content.replace(listHeaderOld, listHeaderNew);

const listItemsOld = `          <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
            {filteredPatients.slice(0, 100).map(patient => (`;

const listItemsNew = `          <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
            {(listMode === 'directory' ? filteredPatients : triagedPatients).slice(0, 100).map(patient => (`;

content = content.replace(listItemsOld, listItemsNew);

const patientListCardDetails = `                {patient.bpjsStatus === 'Active' && (
                  <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
                )}
              </button>`;
const newPatientListCardDetails = `                {listMode === 'triage' ? (
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
              )}`;

content = content.replace(patientListCardDetails, newPatientListCardDetails);

fs.writeFileSync('src/components/PatientManagement.tsx', content);
