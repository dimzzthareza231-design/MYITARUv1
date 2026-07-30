import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ClipboardList, User, Activity, TestTube, FileEdit, Building2, Lock, Save, Edit3, XCircle } from 'lucide-react';
import { useHospital } from '../contexts/HospitalContext';
import { cn } from '../lib/utils';

export function FormsModule() {
  const { activeUser } = useHospital();
  const [activeTab, setActiveTab] = useState('rawat_inap');
  const [isEditMode, setIsEditMode] = useState(false);
  const [formFields, setFormFields] = useState<Record<string, { label: string, type: string, locked?: boolean }[]>>({
    rawat_inap: [
      { label: 'Patient RM Number', type: 'text' },
      { label: 'Room Assignment', type: 'select' },
      { label: 'Admission Date', type: 'date' },
      { label: 'Primary Diagnosis', type: 'text' },
      { label: 'Deposit Amount (Rp)', type: 'number', locked: true }
    ],
    rawat_jalan: [
      { label: 'Patient RM Number', type: 'text' },
      { label: 'Polyclinic', type: 'select' },
      { label: 'Attending Physician', type: 'select' },
      { label: 'Chief Complaint', type: 'textarea' }
    ],
    laboratorium: [
      { label: 'Patient RM Number', type: 'text' },
      { label: 'Test Type (Hematology/Clinical)', type: 'select' },
      { label: 'Sample Source', type: 'text' },
      { label: 'Results / Values', type: 'textarea' },
      { label: 'Lab Technician Signature', type: 'text', locked: true }
    ],
    dokter: [
      { label: 'Subjective (Anamnesis)', type: 'textarea' },
      { label: 'Objective (Physical Exam)', type: 'textarea' },
      { label: 'Assessment (Diagnosis)', type: 'text' },
      { label: 'Plan (Therapy & Prescriptions)', type: 'textarea' }
    ],
    perawat: [
      { label: 'Blood Pressure (mmHg)', type: 'text' },
      { label: 'Heart Rate (bpm)', type: 'number' },
      { label: 'Temperature (°C)', type: 'number' },
      { label: 'Nursing Care Plan', type: 'textarea' }
    ],
    rekam_medis: [
      { label: 'ICD-10 Code', type: 'text' },
      { label: 'ICD-9-CM Code', type: 'text' },
      { label: 'Document Completeness Status', type: 'select' },
      { label: 'File Retention Category', type: 'select', locked: true }
    ],
    management: [
      { label: 'Policy Update Notes', type: 'textarea' },
      { label: 'Approval Status', type: 'select' },
      { label: 'Access Level Settings', type: 'select', locked: true },
      { label: 'Budget Allocation', type: 'number', locked: true }
    ]
  });

  const tabs = [
    { id: 'rawat_inap', label: 'Rawat Inap', icon: Building2 },
    { id: 'rawat_jalan', label: 'Rawat Jalan', icon: User },
    { id: 'laboratorium', label: 'Laboratorium', icon: TestTube },
    { id: 'dokter', label: 'Form Dokter', icon: Activity },
    { id: 'perawat', label: 'Form Perawat', icon: ClipboardList },
    { id: 'rekam_medis', label: 'Rekam Medis', icon: FileEdit },
    { id: 'management', label: 'Management', icon: Lock },
  ];

  const canEditTemplate = activeUser?.role === 'Management' || activeUser?.role === 'Admin';

  const currentFields = formFields[activeTab] || [];

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-white">Forms & Workflows</h1>
          <p className="text-sm text-white/40">Role-based data entry and process management</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsEditMode(!isEditMode)}
            className={cn("btn-primary", isEditMode ? "bg-orange-500/20 text-orange-400 border-orange-500/30" : "bg-white/10 text-white")}
          >
            {isEditMode ? <Save className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
            <span>{isEditMode ? 'Finish Editing' : 'Edit Template'}</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex gap-6 min-h-0">
        {/* Tab Selection */}
        <div className="w-64 shrink-0 glass-panel border border-white/5 p-4 flex flex-col gap-2 overflow-y-auto custom-scrollbar">
          {tabs.map((tab) => (
            <button 
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setIsEditMode(false); }}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors text-left",
                activeTab === tab.id ? 'bg-primary-emerald/10 text-primary-emerald border border-primary-emerald/20' : 'text-white/40 hover:bg-white/5 hover:text-white border border-transparent'
              )}
            >
              <tab.icon className="w-4 h-4 shrink-0" /> {tab.label}
            </button>
          ))}
        </div>

        {/* Form Content */}
        <div className="flex-1 glass-panel border border-white/5 p-8 overflow-y-auto custom-scrollbar">
          {isEditMode && !canEditTemplate ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-white/40">
              <Lock className="w-16 h-16 mb-4 text-orange-400 opacity-50" />
              <h3 className="text-xl font-bold text-white mb-2">Restricted Access</h3>
              <p className="max-w-md text-sm">Modifying form templates and hospital policies requires official authorization from the Hospital Management. Your current role ({activeUser?.role}) does not have these privileges.</p>
              <button onClick={() => setIsEditMode(false)} className="mt-6 px-4 py-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors">
                Return to View Mode
              </button>
            </div>
          ) : (
            <div className="max-w-3xl space-y-8">
              <div className="border-b border-white/10 pb-6">
                <h2 className="text-xl font-bold text-white mb-2">{tabs.find(t => t.id === activeTab)?.label} - Data Entry</h2>
                <p className="text-sm text-white/60">
                  {activeTab === 'dokter' && 'Job Desk: Mengisi asesmen medis, diagnosa pasien, dan meresepkan obat.'}
                  {activeTab === 'perawat' && 'Job Desk: Melakukan triase, observasi tanda-tanda vital, dan asuhan keperawatan.'}
                  {activeTab === 'rekam_medis' && 'Job Desk: Koding diagnosa (ICD-10/9), verifikasi kelengkapan berkas, dan retensi.'}
                  {activeTab === 'laboratorium' && 'Job Desk: Menginput hasil uji sampel, validasi nilai kritis, dan otorisasi hasil lab.'}
                  {activeTab === 'rawat_inap' && 'Job Desk: Manajemen pendaftaran pasien masuk, alokasi ruangan, dan persetujuan deposit.'}
                  {activeTab === 'rawat_jalan' && 'Job Desk: Registrasi poliklinik, antrian dokter, dan validasi jaminan.'}
                  {activeTab === 'management' && 'Job Desk: Penyesuaian kebijakan RS, persetujuan akses keamanan, dan audit finansial.'}
                </p>
              </div>

              {isEditMode && (
                <div className="mb-6 p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl flex items-start gap-3">
                  <Lock className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-orange-400">Template Edit Mode</h4>
                    <p className="text-xs text-orange-400/80 mt-1">You are modifying the core form fields. Fields marked with "LOCKED" cannot be removed even by Management due to strict compliance rules (security, APK settings, core medical IDs).</p>
                  </div>
                </div>
              )}

              <div className="space-y-6">
                {currentFields.map((field, idx) => (
                  <div key={idx} className="relative group">
                    <label className="text-xs text-white/60 mb-2 flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        {field.label}
                        {field.locked && <Lock className="w-3 h-3 text-red-400" title="Locked by Compliance" />}
                      </span>
                      {isEditMode && !field.locked && (
                        <button className="text-red-400/50 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                          <XCircle className="w-4 h-4" />
                        </button>
                      )}
                    </label>
                    
                    {field.type === 'textarea' ? (
                      <textarea className="w-full glass-input p-3 text-sm min-h-[100px]" placeholder={`Enter ${field.label.toLowerCase()}...`} disabled={isEditMode} />
                    ) : field.type === 'select' ? (
                      <select className="w-full glass-input p-3 text-sm bg-midnight" disabled={isEditMode}>
                        <option>Select an option...</option>
                      </select>
                    ) : (
                      <input type={field.type} className="w-full glass-input p-3 text-sm" placeholder={`Enter ${field.label.toLowerCase()}...`} disabled={isEditMode} />
                    )}
                  </div>
                ))}

                {isEditMode && (
                  <button className="w-full py-4 border border-dashed border-white/20 rounded-xl text-white/40 hover:text-white hover:border-white/40 hover:bg-white/5 transition-all flex items-center justify-center gap-2 text-sm font-medium">
                    <User className="w-4 h-4" /> Add New Custom Field
                  </button>
                )}
              </div>

              {!isEditMode && (
                <div className="pt-6 border-t border-white/10 flex justify-end">
                  <button className="btn-primary">
                    <Save className="w-4 h-4" /> Save Record
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
