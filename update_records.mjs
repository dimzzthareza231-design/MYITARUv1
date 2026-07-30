import fs from 'fs';
let content = fs.readFileSync('src/components/MedicalRecords.tsx', 'utf8');

content = content.replace(
  "const { records, addRecord, patients, activeDoctor, doctors, nurses } = useHospital();",
  "const { records, addRecord, patients, activeUser, doctors, nurses } = useHospital();"
);

content = content.replace(
  "doctorInCharge: activeDoctor?.name || 'Dr. Unknown',",
  "doctorInCharge: activeUser?.name || 'Unknown User',"
);

fs.writeFileSync('src/components/MedicalRecords.tsx', content);
