const fs = require('fs');
const file = 'src/components/RME/Patient360.tsx';
let code = fs.readFileSync(file, 'utf8');

const regex = /function OverviewTab\(\{ patientData \}: \{ patientData: any \}\) \{[\s\S]*?^\}/m;

const newOverview = `function OverviewTab({ patientData }: { patientData: any }) {
  if (!patientData) return null;

  const activeProblems = patientData.problem_list?.filter((p: any) => p.status === 'Active') || [];
  const activeMeds = patientData.medications?.filter((m: any) => m.status === 'Active') || [];
  const allergies = patientData.allergies || [];
  const latestVitals = patientData.vitals?.[0] || null;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Problems */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col h-full">
          <div className="flex items-center gap-2 mb-3">
            <ClipboardList className="w-5 h-5 text-blue-500" />
            <h3 className="font-bold text-slate-900 dark:text-white">Active Problems</h3>
          </div>
          <div className="flex-1 space-y-2">
            {activeProblems.length > 0 ? activeProblems.map((p: any, i: number) => (
              <div key={i} className="text-sm border-l-2 border-blue-500 pl-3 py-1 bg-slate-50 dark:bg-slate-800/50 rounded-r-lg">
                <div className="font-bold text-slate-800 dark:text-white">{p.nama}</div>
                <div className="text-xs text-slate-500">{p.kode_icd10} • Onset: {p.tanggal_onset}</div>
              </div>
            )) : <p className="text-sm text-slate-500 italic">No active problems</p>}
          </div>
        </div>

        {/* Active Medications */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col h-full">
          <div className="flex items-center gap-2 mb-3">
            <Pill className="w-5 h-5 text-emerald-500" />
            <h3 className="font-bold text-slate-900 dark:text-white">Active Medications</h3>
          </div>
          <div className="flex-1 space-y-2">
            {activeMeds.length > 0 ? activeMeds.map((m: any, i: number) => (
              <div key={i} className="text-sm border-l-2 border-emerald-500 pl-3 py-1 bg-slate-50 dark:bg-slate-800/50 rounded-r-lg">
                <div className="font-bold text-slate-800 dark:text-white">{m.name}</div>
                <div className="text-xs text-slate-500">{m.dose} • {m.frequency}</div>
              </div>
            )) : <p className="text-sm text-slate-500 italic">No active medications</p>}
          </div>
        </div>

        {/* Allergies */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col h-full">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-rose-500" />
            <h3 className="font-bold text-slate-900 dark:text-white">Allergies</h3>
          </div>
          <div className="flex-1 space-y-2">
            {allergies.length > 0 ? allergies.map((a: any, i: number) => (
              <div key={i} className="text-sm border-l-2 border-rose-500 pl-3 py-1 bg-slate-50 dark:bg-slate-800/50 rounded-r-lg">
                <div className="font-bold text-slate-800 dark:text-white">{a.allergen}</div>
                <div className="text-xs text-rose-600">{a.reaction}</div>
              </div>
            )) : <p className="text-sm text-slate-500 italic">No known allergies</p>}
          </div>
        </div>

        {/* Latest Vitals */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col h-full">
          <div className="flex items-center gap-2 mb-3">
            <HeartPulse className="w-5 h-5 text-indigo-500" />
            <h3 className="font-bold text-slate-900 dark:text-white">Latest Vitals</h3>
          </div>
          {latestVitals ? (
            <div className="flex-1 grid grid-cols-2 gap-2 text-sm">
              <div className="bg-slate-50 dark:bg-slate-800/80 p-2 rounded-lg text-center">
                <div className="text-[10px] text-slate-500 uppercase font-bold">BP</div>
                <div className="font-bold text-rose-600">{latestVitals.bp}</div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/80 p-2 rounded-lg text-center">
                <div className="text-[10px] text-slate-500 uppercase font-bold">HR</div>
                <div className="font-bold text-emerald-600">{latestVitals.hr}</div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/80 p-2 rounded-lg text-center">
                <div className="text-[10px] text-slate-500 uppercase font-bold">Temp</div>
                <div className="font-bold text-amber-600">{latestVitals.temp}°C</div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/80 p-2 rounded-lg text-center">
                <div className="text-[10px] text-slate-500 uppercase font-bold">SpO2</div>
                <div className="font-bold text-blue-600">{latestVitals.spo2}%</div>
              </div>
              <div className="col-span-2 text-xs text-center text-slate-500 mt-1">Recorded: {latestVitals.date}</div>
            </div>
          ) : (
            <p className="text-sm text-slate-500 italic">No vitals recorded</p>
          )}
        </div>
      </div>

    </div>
  );
}`;

code = code.replace(regex, newOverview);
fs.writeFileSync(file, code);
