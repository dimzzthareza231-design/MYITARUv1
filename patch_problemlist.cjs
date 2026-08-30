const fs = require('fs');
const file = 'src/components/RME/Patient360.tsx';
let code = fs.readFileSync(file, 'utf8');

const regex = /function ProblemListTab\(\{ patientData, setPatientData \}: any\) \{[\s\S]*?^\}/m;

const newComponent = `function ProblemListTab({ patientData, setPatientData }: any) {
  const [filter, setFilter] = useState('Active');
  
  const handleDelete = (id: number) => {
    const updated = patientData.problem_list.filter((p: any) => p.id !== id);
    setPatientData({ ...patientData, problem_list: updated });
    toast.success('Problem dihapus');
  };

  const filteredProblems = patientData.problem_list.filter((p: any) => filter === 'All' || p.status === filter);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-blue-500" />
              Daftar Masalah Klinis (Problem List)
            </h2>
            <p className="text-sm text-slate-500">Diagnosis dan masalah medis longitudinal pasien</p>
          </div>
          <div className="flex items-center gap-2">
            <select 
              value={filter} 
              onChange={e => setFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium outline-none"
            >
              <option value="All">Semua Status</option>
              <option value="Active">Active</option>
              <option value="Resolved">Resolved</option>
              <option value="Historical">Historical</option>
              <option value="Suspected">Suspected</option>
              <option value="Ruled Out">Ruled Out</option>
            </select>
            <button onClick={() => toast('Form tambah problem', { icon: '🚧' })} className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-sm">
              <Plus className="w-4 h-4" /> Add Problem
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr>
                <th className="p-4 font-bold text-slate-500">Diagnosis / Problem</th>
                <th className="p-4 font-bold text-slate-500">ICD-10</th>
                <th className="p-4 font-bold text-slate-500">Onset Date</th>
                <th className="p-4 font-bold text-slate-500">Severity</th>
                <th className="p-4 font-bold text-slate-500">Status</th>
                <th className="p-4 font-bold text-slate-500">Recorded By</th>
                <th className="p-4 font-bold text-slate-500">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredProblems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">Tidak ada data untuk status {filter}</td>
                </tr>
              ) : filteredProblems.map((p: any) => (
                <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="p-4 font-bold text-slate-900 dark:text-white">{p.nama}</td>
                  <td className="p-4"><span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 font-mono text-slate-600 dark:text-slate-300 rounded border border-slate-200 dark:border-slate-700">{p.kode_icd10}</span></td>
                  <td className="p-4">{p.tanggal_onset}</td>
                  <td className="p-4">
                    <span className={\`px-2 py-1 rounded text-xs font-bold \${p.severity === 'Severe' ? 'bg-rose-50 text-rose-600 border border-rose-200' : p.severity === 'Moderate' ? 'bg-amber-50 text-amber-600 border border-amber-200' : 'bg-emerald-50 text-emerald-600 border border-emerald-200'}\`}>{p.severity}</span>
                  </td>
                  <td className="p-4">
                    <select 
                      value={p.status}
                      onChange={(e) => {
                        const updated = patientData.problem_list.map((item: any) => item.id === p.id ? { ...item, status: e.target.value } : item);
                        setPatientData({ ...patientData, problem_list: updated });
                        toast.success(\`Status diagnosis diubah menjadi \${e.target.value}\`);
                      }}
                      className={\`px-2 py-1 rounded text-xs font-bold border outline-none cursor-pointer \${
                        p.status === 'Active' ? 'bg-blue-50 text-blue-600 border-blue-200' : 
                        p.status === 'Resolved' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 
                        p.status === 'Historical' ? 'bg-slate-100 text-slate-600 border-slate-300' : 
                        p.status === 'Suspected' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                        'bg-rose-50 text-rose-600 border-rose-200'
                      }\`}
                    >
                      <option value="Active">Active</option>
                      <option value="Resolved">Resolved</option>
                      <option value="Historical">Historical</option>
                      <option value="Suspected">Suspected</option>
                      <option value="Ruled Out">Ruled Out</option>
                    </select>
                  </td>
                  <td className="p-4 text-xs text-slate-500">
                    <div>dr. Budi Santoso</div>
                    <div className="text-[10px]">{p.tanggal_onset}</div>
                  </td>
                  <td className="p-4 flex gap-2">
                    <button className="p-1.5 text-slate-400 hover:text-blue-600 bg-slate-100 hover:bg-blue-50 rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(p.id)} className="p-1.5 text-slate-400 hover:text-rose-600 bg-slate-100 hover:bg-rose-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
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
