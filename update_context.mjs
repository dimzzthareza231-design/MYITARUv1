import fs from 'fs';
let content = fs.readFileSync('src/contexts/HospitalContext.tsx', 'utf8');

// Replace import to include Nurse, MedicalRecord
content = content.replace(
  "import { Patient, Doctor } from '../types';",
  "import { Patient, Doctor, Nurse, MedicalRecord } from '../types';"
);

const newInitialData = `
const initialNurses: Nurse[] = [
  { id: 'NR-001', name: 'Nurse Joy', department: 'Emergency', initials: 'NJ', status: 'On Duty' },
  { id: 'NR-002', name: 'Nurse Ratched', department: 'Psychiatry', initials: 'NR', status: 'Off Duty' }
];

const initialRecords: MedicalRecord[] = [
  {
    id: 'REC-001',
    patientId: 'PT-2023-0891',
    patientName: 'Budi Santoso',
    date: '2023-12-05',
    diagnosis: 'Hypertension, T2DM',
    treatment: 'Amlodipine 5mg, Metformin 500mg',
    doctorInCharge: 'Dr. Sarah Connor',
    nurseInCharge: 'Nurse Joy',
    status: 'Completed'
  },
  {
    id: 'REC-002',
    patientId: 'PT-2023-0892',
    patientName: 'Siti Aminah',
    date: '2023-12-06',
    diagnosis: 'Asthma Exacerbation',
    treatment: 'Nebulization, Salbutamol',
    doctorInCharge: 'Dr. John Smith',
    status: 'Ongoing'
  }
];

interface HospitalContextType {
  patients: Patient[];
  addPatient: (patient: Patient) => void;
  doctors: Doctor[];
  addDoctor: (doctor: Doctor) => void;
  activeDoctor: Doctor | null;
  setActiveDoctor: (doctor: Doctor) => void;
  nurses: Nurse[];
  addNurse: (nurse: Nurse) => void;
  records: MedicalRecord[];
  addRecord: (record: MedicalRecord) => void;
}
`;

content = content.replace(
  /interface HospitalContextType \{[\s\S]*?\}/,
  newInitialData
);

const newProviderLogic = `
  const [patients, setPatients] = useState<Patient[]>(generatePatients(1284));
  const [doctors, setDoctors] = useState<Doctor[]>(initialDoctors);
  const [activeDoctor, setActiveDoctor] = useState<Doctor | null>(initialDoctors[0]);
  const [nurses, setNurses] = useState<Nurse[]>(initialNurses);
  const [records, setRecords] = useState<MedicalRecord[]>(initialRecords);

  const addPatient = (patient: Patient) => {
    setPatients((prev) => [patient, ...prev]);
  };

  const addDoctor = (doctor: Doctor) => {
    setDoctors((prev) => [...prev, doctor]);
  };

  const addNurse = (nurse: Nurse) => {
    setNurses((prev) => [...prev, nurse]);
  };

  const addRecord = (record: MedicalRecord) => {
    setRecords((prev) => [record, ...prev]);
  };

  return (
    <HospitalContext.Provider value={{ patients, addPatient, doctors, addDoctor, activeDoctor, setActiveDoctor, nurses, addNurse, records, addRecord }}>
      {children}
    </HospitalContext.Provider>
  );
`;

content = content.replace(
  /const \[patients, setPatients\] = useState<Patient\[\]>\(generatePatients\(1284\)\);[\s\S]*?<\/HospitalContext.Provider>\n  \);/,
  newProviderLogic
);

fs.writeFileSync('src/contexts/HospitalContext.tsx', content);
