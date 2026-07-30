import fs from 'fs';
let content = fs.readFileSync('src/components/PatientManagement.tsx', 'utf8');

content = content.replace(
  `                    <div className="flex items-center gap-1.5 text-white/60">\n                      <Shield className={cn("w-4 h-4", selectedPatient.bpjsStatus === 'Active' ? "text-emerald-400" : "text-white/40")} />\n                      <span>BPJS: {selectedPatient.bpjsStatus}</span>\n                    </div>\n                  </div>`,
  `                    <div className="flex items-center gap-1.5 text-white/60">\n                      <Shield className={cn("w-4 h-4", selectedPatient.bpjsStatus === 'Active' ? "text-emerald-400" : "text-white/40")} />\n                      <span>BPJS: {selectedPatient.bpjsStatus}</span>\n                    </div>\n                    <div className="flex items-center gap-1.5 text-white/60">\n                      <Bed className="w-4 h-4 text-purple-400" />\n                      <span>{selectedPatient.patientType || 'Outpatient'} {selectedPatient.roomNumber ? \`(\${selectedPatient.roomNumber})\` : ''}</span>\n                    </div>\n                  </div>`
);

fs.writeFileSync('src/components/PatientManagement.tsx', content);
