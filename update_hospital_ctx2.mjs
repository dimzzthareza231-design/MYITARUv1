import fs from 'fs';
let content = fs.readFileSync('src/contexts/HospitalContext.tsx', 'utf8');

// Ensure User is imported
content = content.replace(
  "import { Patient, Doctor, Nurse, MedicalRecord } from '../types';",
  "import { Patient, Doctor, Nurse, MedicalRecord, User } from '../types';"
);

// Add initialUsers
const initialUsersCode = `
const initialUsers: User[] = [
  { id: 'USR-001', name: 'Dr. Budi Santoso', role: 'Doctor', department: 'Cardiology', initials: 'BS', status: 'On Duty' },
  { id: 'USR-002', name: 'Dr. Sarah Connor', role: 'Doctor', department: 'Neurology', initials: 'SC', status: 'On Duty' },
  { id: 'USR-003', name: 'Siti Aminah, RN', role: 'Nurse', department: 'Emergency', initials: 'SA', status: 'On Duty' },
  { id: 'USR-004', name: 'Ahmad, S.Kom', role: 'Medical Record', department: 'Medical Records', initials: 'AH', status: 'On Duty' },
  { id: 'USR-005', name: 'Ratna, AMd.AK', role: 'Lab', department: 'Laboratory', initials: 'RA', status: 'On Duty' },
  { id: 'USR-006', name: 'Admin System', role: 'Management', department: 'IT / Admin', initials: 'AD', status: 'On Duty' },
];
`;
content = content.replace("const initialDoctors", initialUsersCode + "\nconst initialDoctors");

// Update Context Type
content = content.replace(
  "  activeDoctor: Doctor | null;\n  setActiveDoctor: (doctor: Doctor) => void;",
  "  activeDoctor: Doctor | null;\n  setActiveDoctor: (doctor: Doctor) => void;\n  users: User[];\n  activeUser: User;\n  setActiveUser: (user: User) => void;"
);

// Update Provider state
content = content.replace(
  "  const [activeDoctor, setActiveDoctor] = useState<Doctor | null>(initialDoctors[0]);",
  "  const [activeDoctor, setActiveDoctor] = useState<Doctor | null>(initialDoctors[0]);\n  const [users, setUsers] = useState<User[]>(initialUsers);\n  const [activeUser, setActiveUser] = useState<User>(initialUsers[0]);"
);

// Update Provider value
content = content.replace(
  "value={{ patients, addPatient, doctors, addDoctor, activeDoctor, setActiveDoctor, nurses, addNurse, records, addRecord }}",
  "value={{ patients, addPatient, doctors, addDoctor, activeDoctor, setActiveDoctor, users, activeUser, setActiveUser, nurses, addNurse, records, addRecord }}"
);

fs.writeFileSync('src/contexts/HospitalContext.tsx', content);
