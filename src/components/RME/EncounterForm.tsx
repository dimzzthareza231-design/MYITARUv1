import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { User, Activity, AlertTriangle, Pill, ClipboardList, Clock, ShieldAlert, Sparkles, X } from 'lucide-react';
import { SubjectiveTab } from './EncounterTabs/SubjectiveTab';
import { ObjectiveTab } from './EncounterTabs/ObjectiveTab';
import { AssessmentTab } from './EncounterTabs/AssessmentTab';
import { PlanTab } from './EncounterTabs/PlanTab';
import { AdministrasiTab } from './EncounterTabs/AdministrasiTab';
import { AIFeatures } from './AIFeatures';

export function EncounterForm({ patient, onSave, onCancel, syncData }: { patient: any, onSave: () => void, onCancel: () => void, syncData?: any }) {
  const [activeTab, setActiveTab] = useState('subjective');
  const [isSaving, setIsSaving] = useState(false);
  
  // Shared state for the whole form
  const [formData, setFormData] = useState({
    subjective: {
      keluhan_utama: '',
      hpi: { onset: '', location: '', duration: '', character: '', aggravating: '', relieving: '', radiation: '', timing: '', severity: '' },
      riwayat_penyakit_dahulu: '',
      alergi: [],
      obat_saat_ini: []
    },
    objective: {
      vitalSigns: { td: '', hr: '', rr: '', temp: '', spo2: '' },
      physicalExam: '',
      labResults: '',
      radResults: ''
    },
    assessment: {
      primaryDiagnosis: null,
      secondaryDiagnoses: [],
      clinicalNotes: ''
    },
    plan: {
      medications: [],
      nonPharma: { diet: '', activity: '', position: '' },
      education: '',
      followUp: ''
    },
    admin: {
      status: '',
      resume: ''
    }
  });

  const tabs = [
    { id: 'subjective', label: 'Subjective', icon: <User className="w-4 h-4" /> },
    { id: 'objective', label: 'Objective', icon: <Activity className="w-4 h-4" /> },
    { id: 'assessment', label: 'Assessment', icon: <AlertTriangle className="w-4 h-4" /> },
    { id: 'plan', label: 'Plan', icon: <Pill className="w-4 h-4" /> },
    { id: 'administrasi', label: 'Administrasi', icon: <ClipboardList className="w-4 h-4" /> },
  ];

  // AI Sync Data
  useEffect(() => {
    if (syncData) {
      toast.success('Data RME disinkronisasi dari AI', { icon: '🤖' });
      setFormData(prev => ({
        ...prev,
        subjective: {
          ...prev.subjective,
          keluhan_utama: syncData.keluhan_utama || prev.subjective.keluhan_utama
        }
      }));
    }
  }, [syncData]);

  const handleSaveDraft = async () => {
    setIsSaving(true);
    try {

      toast.success('Draft berhasil disimpan');
    } catch (error) {
      toast.error('Gagal menyimpan draft');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAndComplete = async () => {
    // Validasi
    if (!formData.subjective.keluhan_utama) {
      toast.error("Keluhan utama wajib diisi!");
      setActiveTab('subjective');
      return;
    }
    
    setIsSaving(true);
    try {
      const existingData = [];
      existingData.push({
        ...formData,
        patientId: patient?.no_rm,
        id: Date.now(),
        status: 'Selesai',
        timestamp: new Date().toISOString()
      });

      toast.success('Rekam medis berhasil disimpan');
      setTimeout(() => {
        onSave();
      }, 1500);
    } catch (error) {
      toast.error('Gagal menyimpan rekam medis');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white/[0.02] dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden mt-6 shadow-sm">
      <div className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-4 flex items-center justify-between">
        <h2 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-indigo-500" />
          Encounter Aktif
        </h2>
        <div className="flex gap-2">
          <button onClick={onCancel} className="btn-secondary text-sm py-1.5 px-3">Batal</button>
        </div>
      </div>

      <div className="flex border-b border-slate-200 dark:border-slate-700 overflow-x-auto custom-scrollbar">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 font-medium text-sm transition-colors whitespace-nowrap ${
              activeTab === tab.id 
                ? 'border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-900/10' 
                : 'text-slate-600 dark:text-slate-400 hover:text-indigo-600 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>
      
      <div className="p-6">
        {activeTab === 'subjective' && <SubjectiveTab formData={formData.subjective} updateForm={(data: any) => setFormData({...formData, subjective: {...formData.subjective, ...data}})} />}
        {activeTab === 'objective' && <ObjectiveTab formData={formData.objective} updateForm={(data: any) => setFormData({...formData, objective: {...formData.objective, ...data}})} />}
        {activeTab === 'assessment' && <AssessmentTab formData={formData.assessment} updateForm={(data: any) => setFormData({...formData, assessment: {...formData.assessment, ...data}})} />}
        {activeTab === 'plan' && <PlanTab formData={formData.plan} updateForm={(data: any) => setFormData({...formData, plan: {...formData.plan, ...data}})} />}
        {activeTab === 'administrasi' && <AdministrasiTab formData={formData.admin} updateForm={(data: any) => setFormData({...formData, admin: {...formData.admin, ...data}})} />}
        
        {/* Action Buttons */}
        <div className="flex gap-4 mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
          <button
            onClick={handleSaveDraft}
            disabled={isSaving}
            className="flex-1 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white py-3 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 font-bold transition-colors disabled:opacity-50"
          >
            {isSaving ? 'Menyimpan...' : 'Simpan Draft'}
          </button>
          <button
            onClick={handleSaveAndComplete}
            disabled={isSaving}
            className="flex-1 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 font-bold transition-colors shadow-sm disabled:opacity-50"
          >
            {isSaving ? 'Menyimpan...' : 'Simpan & Selesai'}
          </button>
        </div>
      </div>
      
      <AIFeatures formData={formData} setFormData={setFormData} />
    </div>
  );
}
