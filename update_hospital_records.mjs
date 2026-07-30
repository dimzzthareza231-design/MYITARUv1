import fs from 'fs';
let content = fs.readFileSync('src/contexts/HospitalContext.tsx', 'utf8');

// replace initialRecords with generated records

content = content.replace(/const initialRecords: MedicalRecord\[\] = \[[\s\S]*?\];/g, "const generateRecords = (patients: Patient[]): MedicalRecord[] => {\n  const statuses: ('Completed' | 'Ongoing' | 'Pending')[] = ['Completed', 'Ongoing', 'Pending'];\n  return patients.map((p, i) => ({\n    id: `REC-${(i + 1).toString().padStart(4, '0')}`,\n    patientId: p.id,\n    patientName: p.fullName,\n    date: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString().split('T')[0],\n    diagnosis: p.history.diseases.length > 0 ? p.history.diseases.join(', ') : 'Routine Checkup',\n    treatment: p.history.medications.length > 0 ? p.history.medications.join(', ') : 'None',\n    doctorInCharge: initialDoctors[Math.floor(Math.random() * initialDoctors.length)].name,\n    nurseInCharge: initialNurses[Math.floor(Math.random() * initialNurses.length)].name,\n    status: statuses[Math.floor(Math.random() * statuses.length)]\n  }));\n};\n");

content = content.replace("const [records, setRecords] = useState<MedicalRecord[]>(initialRecords);", "const [records, setRecords] = useState<MedicalRecord[]>(generateRecords(patients));");

fs.writeFileSync('src/contexts/HospitalContext.tsx', content);
