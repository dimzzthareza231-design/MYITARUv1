import fs from 'fs';
let content = fs.readFileSync('src/components/StaffManagement.tsx', 'utf8');

content = content.replace(
  "import { Search, UserPlus, Stethoscope, User, Plus } from 'lucide-react';",
  "import { Search, UserPlus, Stethoscope, User, Plus, XCircle } from 'lucide-react';"
);

content = content.replace(
  "  const [searchQuery, setSearchQuery] = useState('');",
  "  const [searchQuery, setSearchQuery] = useState('');\n  const [isAdding, setIsAdding] = useState(false);\n  const [newStaffType, setNewStaffType] = useState<'doctor'|'nurse'>('doctor');\n  const [newStaff, setNewStaff] = useState({ name: '', department: '', initials: '', status: 'On Duty' as const });"
);

content = content.replace(
  "        <div>\n          <h1 className=\"text-2xl font-bold text-white\">Staff Management</h1>\n          <p className=\"text-sm text-white/40\">Manage medical personnel</p>\n        </div>\n      </div>",
  "        <div>\n          <h1 className=\"text-2xl font-bold text-white\">Staff Management</h1>\n          <p className=\"text-sm text-white/40\">Manage medical personnel</p>\n        </div>\n        <button className=\"btn-primary\" onClick={() => { setIsAdding(true); setNewStaffType(activeTab === 'doctors' ? 'doctor' : 'nurse'); }}>\n          <UserPlus className=\"w-4 h-4\" />\n          <span>Add Staff</span>\n        </button>\n      </div>"
);

const modalCode = `
      {isAdding && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel p-6 w-full max-w-lg mx-4 border border-white/10 shadow-2xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Add New {newStaffType === 'doctor' ? 'Doctor' : 'Nurse'}</h2>
              <button onClick={() => setIsAdding(false)} className="text-white/40 hover:text-white">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs text-white/60 mb-1 block">Staff Type</label>
                <div className="flex gap-2">
                  <button 
                    className={cn("flex-1 py-2 rounded-lg text-sm font-bold border transition-colors", newStaffType === 'doctor' ? "bg-primary-emerald/20 text-emerald-400 border-emerald-500/30" : "bg-white/5 text-white/40 border-white/10")}
                    onClick={() => setNewStaffType('doctor')}
                  >
                    Doctor
                  </button>
                  <button 
                    className={cn("flex-1 py-2 rounded-lg text-sm font-bold border transition-colors", newStaffType === 'nurse' ? "bg-primary-blue/20 text-primary-blue border-primary-blue/30" : "bg-white/5 text-white/40 border-white/10")}
                    onClick={() => setNewStaffType('nurse')}
                  >
                    Nurse
                  </button>
                </div>
              </div>
              <div>
                <label className="text-xs text-white/60 mb-1 block">Full Name</label>
                <input 
                  type="text"
                  className="w-full glass-input p-2 text-sm" 
                  value={newStaff.name} 
                  onChange={e => {
                    const initials = e.target.value.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
                    setNewStaff({...newStaff, name: e.target.value, initials});
                  }}
                  placeholder="e.g. Dr. Andi Wijaya"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-white/60 mb-1 block">Department</label>
                  <input 
                    type="text"
                    className="w-full glass-input p-2 text-sm" 
                    value={newStaff.department} 
                    onChange={e => setNewStaff({...newStaff, department: e.target.value})}
                    placeholder="e.g. Cardiology"
                  />
                </div>
                <div>
                  <label className="text-xs text-white/60 mb-1 block">Initials</label>
                  <input 
                    type="text"
                    className="w-full glass-input p-2 text-sm" 
                    value={newStaff.initials} 
                    onChange={e => setNewStaff({...newStaff, initials: e.target.value})}
                  />
                </div>
              </div>
              
              <button 
                className="w-full btn-primary mt-6"
                disabled={!newStaff.name || !newStaff.department}
                onClick={() => {
                  if (newStaffType === 'doctor') {
                    addDoctor({
                      id: \`DR-\${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}\`,
                      ...newStaff
                    });
                  } else {
                    addNurse({
                      id: \`NR-\${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}\`,
                      ...newStaff
                    });
                  }
                  setIsAdding(false);
                  setNewStaff({ name: '', department: '', initials: '', status: 'On Duty' });
                }}
              >
                Add Staff
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
`;

content = content.replace(
  "    </div>\n  );\n}",
  modalCode
);

fs.writeFileSync('src/components/StaffManagement.tsx', content);
