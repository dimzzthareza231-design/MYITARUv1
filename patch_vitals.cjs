const fs = require('fs');
const file = 'src/components/RME/Patient360.tsx';
let code = fs.readFileSync(file, 'utf8');

const vitalsRegex = /function VitalsTab\(\{ patientData \}: any\) \{[\s\S]*?^\}/m;

const newVitals = `function VitalsTab({ patientData }: any) {
  const chartData = [...(patientData.vitals || [])].reverse().map(v => {
    const bpParts = v.bp.split('/');
    return {
      date: v.date.split(' ')[0],
      systolic: parseInt(bpParts[0]),
      diastolic: parseInt(bpParts[1]),
      hr: parseInt(v.hr)
    };
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
          <HeartPulse className="w-5 h-5 text-rose-500" /> Tren Tanda Vital (Blood Pressure & Heart Rate)
        </h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="date" tick={{fontSize: 12}} tickLine={false} axisLine={false} />
              <YAxis tick={{fontSize: 12}} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Line type="monotone" dataKey="systolic" stroke="#ef4444" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} name="Sistolik" />
              <Line type="monotone" dataKey="diastolic" stroke="#3b82f6" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} name="Diastolik" />
              <Line type="monotone" dataKey="hr" stroke="#10b981" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} name="Nadi" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card p-6 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold">Vital Signs History</h2>
          <button onClick={() => toast('Form tambah vital', { icon: '🚧' })} className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Vitals
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr>
                <th className="p-4 font-bold text-slate-500">Tanggal & Waktu</th>
                <th className="p-4 font-bold text-slate-500">TD (mmHg)</th>
                <th className="p-4 font-bold text-slate-500">Nadi</th>
                <th className="p-4 font-bold text-slate-500">Suhu (°C)</th>
                <th className="p-4 font-bold text-slate-500">RR</th>
                <th className="p-4 font-bold text-slate-500">SpO2</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {patientData.vitals.map((v: any) => (
                <tr key={v.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="p-4">{v.date}</td>
                  <td className="p-4 font-bold text-rose-600 dark:text-rose-400">{v.bp}</td>
                  <td className="p-4 font-bold text-emerald-600 dark:text-emerald-400">{v.hr}</td>
                  <td className="p-4">{v.temp}</td>
                  <td className="p-4">{v.rr}</td>
                  <td className="p-4">{v.spo2}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}`;

code = code.replace(vitalsRegex, newVitals);
fs.writeFileSync(file, code);
