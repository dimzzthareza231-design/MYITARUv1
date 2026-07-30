import fs from 'fs';
let content = fs.readFileSync('src/components/PatientManagement.tsx', 'utf8');

// Remove MOCK_PATIENTS and add imports
content = content.replace(/const MOCK_PATIENTS = \[[\s\S]*?\];\n\n/, '');
content = content.replace("import { cn } from '../lib/utils';", "import { cn } from '../lib/utils';\nimport { useHospital } from '../contexts/HospitalContext';\nimport type { Patient } from '../types';");

// Use context
content = content.replace(
  "export function PatientManagement() {", 
  "export function PatientManagement() {\n  const { patients, addPatient } = useHospital();\n  const [isAdding, setIsAdding] = useState(false);\n  const [newPatient, setNewPatient] = useState<Partial<Patient>>({ fullName: '', rmNumber: '', age: 30, gender: 'Laki-laki', bloodType: 'O+', status: 'Active', bpjsStatus: 'Active', contact: '', emergencyContact: '' });\n"
);

// Replace MOCK_PATIENTS usages with patients
content = content.replace(/MOCK_PATIENTS\[0\]\.id/g, 'patients[0]?.id || ""');
content = content.replace(/MOCK_PATIENTS\.find/g, 'patients.find');
content = content.replace(/\|\| MOCK_PATIENTS\[0\]/g, '|| patients[0]');
content = content.replace(/MOCK_PATIENTS\.filter/g, 'patients.filter');

// Add onClick to add patient button
content = content.replace(
  /<button className="btn-primary">/,
  '<button className="btn-primary" onClick={() => setIsAdding(true)}>'
);

// Append the modal at the end of the return statement
const modalContent = `
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
                    id: \`PT-\${new Date().getFullYear()}-\${Math.floor(Math.random()*10000).toString().padStart(4, '0')}\`,
                    rmNumber: newPatient.rmNumber || \`RM-\${Math.floor(Math.random()*1000000)}\`,
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
`;

content = content.replace(/    <\/div>\n  \);\n}/, modalContent);

fs.writeFileSync('src/components/PatientManagement.tsx', content);
