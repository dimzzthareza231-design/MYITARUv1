import fs from 'fs';
let content = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');

content = content.replace(
  "  const { activeDoctor, setActiveDoctor, addDoctor, doctors } = useHospital();",
  "  const { activeUser, users, setActiveUser } = useHospital();"
);

content = content.replace(
  "            <div className=\"flex items-center gap-3\">\n              <div className=\"w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0\">\n                <span className=\"text-xs font-bold text-white/60\">{activeDoctor?.initials || 'DR'}</span>\n              </div>\n              <div className=\"flex-1 min-w-0\">\n                <p className=\"text-sm font-medium truncate text-white\">{activeDoctor?.name || 'Dr. Unknown'}</p>\n                <p className=\"text-[10px] text-primary-emerald uppercase tracking-widest font-bold truncate\">{activeDoctor?.department || 'General'}</p>\n              </div>\n            </div>",
  "            <div className=\"flex items-center gap-3\">\n              <div className=\"w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0\">\n                <span className=\"text-xs font-bold text-white/60\">{activeUser?.initials || '??'}</span>\n              </div>\n              <div className=\"flex-1 min-w-0\">\n                <p className=\"text-sm font-medium truncate text-white\">{activeUser?.name || 'Unknown'}</p>\n                <p className=\"text-[10px] text-primary-emerald uppercase tracking-widest font-bold truncate\">{activeUser?.role || 'Staff'}</p>\n              </div>\n            </div>"
);

// Remove the DoctorSelect popup from Sidebar because we moved it to Header
content = content.replace(/\{showDoctorSelect && \([\s\S]*?\)\}        <\/div>/g, "        </div>");
content = content.replace(/\{isAddingDoctor && \([\s\S]*?\}\)/g, "");

content = content.replace(
  "  const [isAddingDoctor, setIsAddingDoctor] = useState(false);\n  const [newDoc, setNewDoc] = useState({ name: '', department: '' });\n  const [showDoctorSelect, setShowDoctorSelect] = useState(false);",
  ""
);

content = content.replace(
  "className=\"w-full flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors\"",
  "className=\"w-full flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 transition-colors pointer-events-none\"" // Disabled clicking since it moved to header
);
content = content.replace(
  "onClick={() => setShowDoctorSelect(!showDoctorSelect)}",
  ""
);

fs.writeFileSync('src/components/Sidebar.tsx', content);
