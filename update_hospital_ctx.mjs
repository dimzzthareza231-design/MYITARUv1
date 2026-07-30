import fs from 'fs';
let content = fs.readFileSync('src/contexts/HospitalContext.tsx', 'utf8');

content = content.replace(
  "      emergencyContact: 'Siti Rahma (Istri) - +62 812-9876-5432',\n      history: {",
  "      emergencyContact: 'Siti Rahma (Istri) - +62 812-9876-5432',\n      patientType: 'Outpatient',\n      history: {"
);

content = content.replace(
  "      emergencyContact: 'Ahmad (Suami) - +62 856-1234-5678',\n      history: {",
  "      emergencyContact: 'Ahmad (Suami) - +62 856-1234-5678',\n      patientType: 'Inpatient',\n      roomNumber: 'Melati-204',\n      history: {"
);

// update generatePatients
content = content.replace(
  "        emergencyContact: `Emergency - ${Math.floor(Math.random() * 9000000) + 1000000}`,\n        history: {",
  "        emergencyContact: `Emergency - ${Math.floor(Math.random() * 9000000) + 1000000}`,\n        patientType: Math.random() > 0.7 ? 'Inpatient' : 'Outpatient',\n        roomNumber: Math.random() > 0.7 ? `Room ${Math.floor(Math.random() * 900) + 100}` : undefined,\n        history: {"
);

// make sure roomNumber only exists for Inpatients in the generated mock data
content = content.replace(
  "        patientType: Math.random() > 0.7 ? 'Inpatient' : 'Outpatient',\n        roomNumber: Math.random() > 0.7 ? `Room ${Math.floor(Math.random() * 900) + 100}` : undefined,\n        history: {",
  "        patientType: (i % 3 === 0) ? 'Inpatient' : 'Outpatient',\n        roomNumber: (i % 3 === 0) ? `Room ${Math.floor(Math.random() * 900) + 100}` : undefined,\n        history: {"
);

fs.writeFileSync('src/contexts/HospitalContext.tsx', content);
