export interface SOAP {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
}

export interface ICD {
  code: string;
  description: string;
}

export interface AnalysisResult {
  soap: SOAP;
  icd10: ICD[];
  icd9: ICD[];
  resume: string;
  warnings: string[];
  recommendations: string[];
  disclaimer: string;
}

export interface PatientHistory {
  allergies: string[];
  surgeries: string[];
  diseases: string[];
  medications: string[];
  labs: string[];
  inpatient: string[];
  outpatient: string[];
}

export interface Patient {
  id: string;
  rmNumber: string;
  fullName: string;
  photoUrl: string;
  status: 'Active' | 'Inactive' | 'Critical';
  bpjsStatus: 'Active' | 'Inactive';
  bloodType: string;
  age: number;
  gender: 'Laki-laki' | 'Perempuan';
  contact: string;
  emergencyContact: string;
  patientType?: 'Inpatient' | 'Outpatient';
  roomNumber?: string;
  history: PatientHistory;
}

export interface Doctor {
  id: string;
  name: string;
  department: string;
  initials: string;
  status: 'On Duty' | 'Off Duty';
}

export interface Nurse {
  id: string;
  name: string;
  department: string;
  initials: string;
  status: 'On Duty' | 'Off Duty';
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  diagnosis: string;
  treatment: string;
  doctorInCharge: string;
  nurseInCharge?: string;
  status: 'Completed' | 'Ongoing' | 'Pending';
}

export type UserRole = 'Doctor' | 'Nurse' | 'Medical Record' | 'Lab' | 'Management' | 'Admin';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  department: string;
  initials: string;
  status: 'On Duty' | 'Off Duty';
}
