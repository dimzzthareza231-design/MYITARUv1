const fs = require('fs');
const file = 'src/components/RME/Patient360.tsx';
let code = fs.readFileSync(file, 'utf8');

const regex = /function MedicationsTab\(\{ patientData, setPatientData \}: any\) \{[\s\S]*?^\}/m;

const newComponent = `function MedicationsTab({ patientData, setPatientData }: any) {
  const [filter, setFilter] = useState('All');

  const handleDelete = (id: number) => {
    const updated = patientData.medications.filter((m: any) => m.id !== id);
    setPatientData({ ...patientData, medications: updated });
    toast.success('Obat dihapus');
  };

  const filteredMeds = patientData.medications.filter((m: any) => filter === 'All' || m.status === filter);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Pill className="w-5 h-5 text-blue-500" />
              Riwayat Penggunaan Obat (Medication History)
            </h2>
            <p className="text-sm text-slate-500">Catatan komprehensif obat yang pernah atau sedang dikonsumsi pasien.</p>
          </div>
          <div className="flex gap-2">
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none font-medium"
            >
              <option value="All">Semua Status</option>
              <option value="Active">Active</option>
              <option value="Stopped">Stopped</option>
              <option value="Hold">Hold</option>
            </select>
            <button onClick={() => toast('Form tambah obat', { icon: '🚧' })} className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-sm">
              <Plus className="w-4 h-4" /> Add Record
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr>
                <th className="p-4 font-bold text-slate-500">Nama Obat</th>
                <th className="p-4 font-bold text-slate-500">Dosis & Rute</th>
                <th className="p-4 font-bold text-slate-500">Frekuensi</th>
                <th className="p-4 font-bold text-slate-500">Mulai - Berhenti</th>
                <th className="p-4 font-bold text-slate-500">Status</th>
                <th className="p-4 font-bold text-slate-500">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredMeds.map((m: any) => (
                <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="p-4 font-bold text-slate-900 dark:text-white">{m.name}</td>
                  <td className="p-4 text-slate-600 dark:text-slate-300">{m.dose}</td>
                  <td className="p-4 text-slate-600 dark:text-slate-300">{m.frequency}</td>
                  <td className="p-4 text-slate-600 dark:text-slate-300">{m.startDate} - {m.endDate || 'Sekarang'}</td>
                  <td className="p-4">
                    <select
                      value={m.status}
                      onChange={(e) => {
                        const updated = patientData.medications.map((item: any) => item.id === m.id ? { ...item, status: e.target.value } : item);
                        setPatientData({ ...patientData, medications: updated });
                      }}
                      className={\`px-2 py-1 rounded-full text-xs font-bold border outline-none cursor-pointer \${
                        m.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                        m.status === 'Stopped' ? 'bg-slate-100 text-slate-600 border-slate-300' :
                        'bg-amber-50 text-amber-600 border-amber-200'
                      }\`}
                    >
                      <option value="Active">Active</option>
                      <option value="Stopped">Stopped</option>
                      <option value="Hold">Hold</option>
                    </select>
                  </td>
                  <td className="p-4 flex gap-2">
                    <button className="p-1.5 text-slate-400 hover:text-blue-600 bg-slate-100 hover:bg-blue-50 rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(m.id)} className="p-1.5 text-slate-400 hover:text-rose-600 bg-slate-100 hover:bg-rose-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}`;

code = code.replace(regex, newComponent);
fs.writeFileSync(file, code);
