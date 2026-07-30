import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Patient, Doctor, Nurse, MedicalRecord, User } from '../types';

// Mock Initial Data
const generatePatients = (count: number): Patient[] => {
  const patients: Patient[] = [
    {
      id: 'PT-2023-0891',
      rmNumber: 'RM-000000',
      fullName: 'Budi Santoso',
      photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80',
      status: 'Active',
      bpjsStatus: 'Active',
      bloodType: 'O+',
      age: 45,
      gender: 'Laki-laki',
      contact: '+62 812-3456-7890',
      emergencyContact: 'Siti Rahma (Istri) - +62 812-9876-5432',
      patientType: 'Outpatient',
      history: {
        allergies: ['Penicillin', 'Seafood'],
        surgeries: ['Appendectomy (2015)'],
        diseases: ['Hypertension', 'Type 2 Diabetes Mellitus'],
        medications: ['Amlodipine 5mg', 'Metformin 500mg'],
        labs: ['HbA1c 7.2% (12/05/2023)', 'Cholesterol 210 mg/dL (12/05/2023)'],
        inpatient: ['RSUD - Dengue Fever (2021)'],
        outpatient: ['Klinik Utama - Routine Checkup (Jan 2023)', 'Poli Penyakit Dalam - Kontrol HT (Mar 2023)']
      }
    },
    {
      id: 'PT-2023-0892',
      rmNumber: 'RM-000001',
      fullName: 'Siti Aminah',
      photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80',
      status: 'Active',
      bpjsStatus: 'Inactive',
      bloodType: 'A+',
      age: 32,
      gender: 'Perempuan',
      contact: '+62 856-7890-1234',
      emergencyContact: 'Ahmad (Suami) - +62 856-1234-5678',
      patientType: 'Inpatient',
      roomNumber: 'Melati-204',
      history: {
        allergies: ['Debu', 'Dingin'],
        surgeries: ['Sectio Caesarea (2019)'],
        diseases: ['Asthma'],
        medications: ['Salbutamol Inhaler (PRN)'],
        labs: ['Hemoglobin 11.5 g/dL (01/02/2023)'],
        inpatient: ['RS Ibu dan Anak - Persalinan (2019)'],
        outpatient: ['Poli Paru - Kontrol Asma (Feb 2023)']
      }
    }
  ];

  const firstNames = ['Andi', 'Bagas', 'Citra', 'Dewi', 'Eko', 'Fitri', 'Gilang', 'Hendra', 'Intan', 'Joko', 'Kartika', 'Lestari'];
  const lastNames = ['Pratama', 'Saputra', 'Wijaya', 'Kusuma', 'Setiawan', 'Nugroho', 'Lestari', 'Sari', 'Putri', 'Rahman'];
  const bloodTypes = ['A+', 'B+', 'O+', 'AB+', 'A-', 'B-', 'O-', 'AB-'];
  
  for (let i = 2; i < count; i++) {
    const isMale = Math.random() > 0.5;
    patients.push({
      id: `PT-2023-${(893 + i).toString().padStart(4, '0')}`,
      rmNumber: `RM-${i.toString().padStart(6, '0')}`,
      fullName: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
      photoUrl: `https://i.pravatar.cc/150?u=${i}`,
      status: Math.random() > 0.95 ? 'Critical' : 'Active',
      bpjsStatus: Math.random() > 0.3 ? 'Active' : 'Inactive',
      bloodType: bloodTypes[Math.floor(Math.random() * bloodTypes.length)],
      age: Math.floor(Math.random() * 60) + 18,
      gender: isMale ? 'Laki-laki' : 'Perempuan',
      contact: '+62 8' + Math.floor(1000000000 + Math.random() * 9000000000).toString(),
      emergencyContact: 'Family - +62 8' + Math.floor(1000000000 + Math.random() * 9000000000).toString(),
      history: {
        allergies: Math.random() > 0.8 ? ['Dust'] : [],
        surgeries: [],
        diseases: [],
        medications: [],
        labs: [],
        inpatient: [],
        outpatient: []
      }
    });
  }
  return patients;
};


const initialUsers: User[] = [
  { id: 'USR-001', name: 'Dr. Budi Santoso, Sp.JP', role: 'Doctor', department: 'Cardiology', initials: 'BS', status: 'On Duty' },
  { id: 'USR-002', name: 'Dr. Sarah Connor, Sp.N', role: 'Doctor', department: 'Neurology', initials: 'SC', status: 'On Duty' },
  { id: 'USR-003', name: 'Siti Aminah, S.Kep., Ns.', role: 'Nurse', department: 'Emergency', initials: 'SA', status: 'On Duty' },
  { id: 'USR-004', name: 'Ahmad, A.Md.RMIK', role: 'Medical Record', department: 'Medical Records', initials: 'AH', status: 'On Duty' },
  { id: 'USR-005', name: 'Ratna, AMd.AK', role: 'Lab', department: 'Laboratory', initials: 'RA', status: 'On Duty' },
  { id: 'USR-006', name: 'M. Reza, S.Kom., M.TI', role: 'Management', department: 'IT / Admin', initials: 'AD', status: 'On Duty' },
];

const initialDoctors: Doctor[] = [
  { id: 'DR-001', name: 'Dr. Sarah Connor', department: 'Neurology Dept.', initials: 'SC', status: 'On Duty' },
  { id: 'DR-002', name: 'Dr. John Smith', department: 'Cardiology Dept.', initials: 'JS', status: 'Off Duty' }
];


const initialNurses: Nurse[] = [
  { id: 'NR-001', name: 'Nurse Joy', department: 'Emergency', initials: 'NJ', status: 'On Duty' },
  { id: 'NR-002', name: 'Nurse Ratched', department: 'Psychiatry', initials: 'NR', status: 'Off Duty' }
];

const generateRecords = (patients: Patient[]): MedicalRecord[] => {
  const statuses: ('Completed' | 'Ongoing' | 'Pending')[] = ['Completed', 'Ongoing', 'Pending'];
  return patients.map((p, i) => ({
    id: `REC-${(i + 1).toString().padStart(4, '0')}`,
    patientId: p.id,
    patientName: p.fullName,
    date: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString().split('T')[0],
    diagnosis: p.history.diseases.length > 0 ? p.history.diseases.join(', ') : 'Routine Checkup',
    treatment: p.history.medications.length > 0 ? p.history.medications.join(', ') : 'None',
    doctorInCharge: initialDoctors[Math.floor(Math.random() * initialDoctors.length)].name,
    nurseInCharge: initialNurses[Math.floor(Math.random() * initialNurses.length)].name,
    status: statuses[Math.floor(Math.random() * statuses.length)]
  }));
};


interface HospitalContextType {
  patients: Patient[];
  addPatient: (patient: Patient) => void;
  doctors: Doctor[];
  addDoctor: (doctor: Doctor) => void;
  activeDoctor: Doctor | null;
  setActiveDoctor: (doctor: Doctor) => void;
  users: User[];
  activeUser: User;
  setActiveUser: (user: User) => void;
  nurses: Nurse[];
  addNurse: (nurse: Nurse) => void;
  records: MedicalRecord[];
  addRecord: (record: MedicalRecord) => void;
}


const HospitalContext = createContext<HospitalContextType | undefined>(undefined);

export const HospitalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  
  const [patients, setPatients] = useState<Patient[]>(generatePatients(1284));
  const [doctors, setDoctors] = useState<Doctor[]>(initialDoctors);
  const [activeDoctor, setActiveDoctor] = useState<Doctor | null>(initialDoctors[0]);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [activeUser, setActiveUser] = useState<User>(initialUsers[0]);
  const [nurses, setNurses] = useState<Nurse[]>(initialNurses);
  const [records, setRecords] = useState<MedicalRecord[]>(generateRecords(patients));

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
    <HospitalContext.Provider value={{ patients, addPatient, doctors, addDoctor, activeDoctor, setActiveDoctor, users, activeUser, setActiveUser, nurses, addNurse, records, addRecord }}>
      {children}
    </HospitalContext.Provider>
  );

};

export const useHospital = () => {
  const context = useContext(HospitalContext);
  if (!context) {
    throw new Error('useHospital must be used within a HospitalProvider');
  }
  return context;
};
