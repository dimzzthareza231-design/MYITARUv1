const fs = require('fs');
const file = 'src/components/RME/Patient360.tsx';
let code = fs.readFileSync(file, 'utf8');

// 1. Add new lucide-react imports
code = code.replace(
  /import \{\s*User, Activity, AlertTriangle,/g, 
  "import { LayoutDashboard, CalendarDays, Building2, User, Activity, AlertTriangle,"
);

// 2. Replace Patient360 function
const patient360Regex = /export function Patient360[\s\S]*?(?=\/\/ ═══════════════════════════════════════════════════════════\n\/\/ OVERVIEW TAB)/;

const newPatient360 = `export function Patient360({ patient, onBack }: { patient?: any, onBack?: () => void }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [patientData, setPatientData] = useState<any>(null);
  const [showConsent, setShowConsent] = useState(false);
  const [showSmartVoice, setShowSmartVoice] = useState(false);

  useEffect(() => {
    const defaultData = {
      ...(patient || {}),
      allergies: patient?.allergies || [
        { id: 1, allergen: 'Penicillin', reaction: 'Urticaria, Anaphylaxis risk', severity: 'Severe', tanggal_diketahui: '10 Jan 2020', verified_by: 'Dr. Sarah' },
        { id: 2, allergen: 'Seafood', reaction: 'Itching', severity: 'Mild', tanggal_diketahui: '05 Mar 2018', verified_by: 'Dr. Budi' }
      ],
      problem_list: patient?.problem_list || [
        { id: 1, nama: 'Type 2 Diabetes Mellitus', kode_icd10: 'E11.9', tanggal_onset: '2022-03-10', severity: 'Moderate', status: 'Active' },
        { id: 2, nama: 'Essential (primary) hypertension', kode_icd10: 'I10', tanggal_onset: '2021-06-20', severity: 'Moderate', status: 'Active' }
      ],
      medications: patient?.medications || [
        { id: 1, name: 'Metformin', dose: '500 mg - Oral', frequency: '2x1', startDate: '2022-03-15', status: 'Active' },
        { id: 2, name: 'Amlodipine', dose: '5 mg - Oral', frequency: '1x1', startDate: '2021-06-25', status: 'Active' }
      ],
      vitals: patient?.vitals || [
        { id: 1, date: '01 Aug 2026 08:00', bp: '130/85', hr: '78', temp: '36.5', rr: '18', spo2: '98', tb: '170', bb: '75' },
        { id: 2, date: '01 Jul 2026 09:30', bp: '125/80', hr: '75', temp: '36.6', rr: '16', spo2: '99', tb: '170', bb: '74.5' }
      ]
    };
    setPatientData(defaultData);
  }, [patient]);

  const handleApplyVoiceToSOAP = (data: { s: string; o: string; a: string; p: string; parsed?: any }) => {
    if (data.parsed?.vitals && Object.keys(data.parsed.vitals).length > 0) {
      const v = data.parsed.vitals;
      const newVital = {
        id: Date.now(),
        date: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        bp: v.tekanan_darah || '120/80',
        hr: v.nadi || '80',
        temp: v.suhu || '36.5',
        rr: '18',
        spo2: v.spo2 || '98',
        tb: '170',
        bb: '70'
      };
      setPatientData((prev: any) => ({
        ...prev,
        vitals: [newVital, ...(prev?.vitals || [])]
      }));
    }
    if (data.parsed?.icd10 && data.parsed.icd10.length > 0) {
      const newProblems = data.parsed.icd10.map((d: any, idx: number) => ({
        id: Date.now() + idx,
        nama: d.name,
        kode_icd10: d.code,
        tanggal_onset: new Date().toISOString().split('T')[0],
        severity: 'Moderate',
        status: 'Active'
      }));
      setPatientData((prev: any) => ({
        ...prev,
        problem_list: [...newProblems, ...(prev?.problem_list || [])]
      }));
    }
    toast.success('Rekam medis pasien diperbarui dari Laporan Suara Cerdas');
    setActiveTab('encounters');
  };

  if (!patientData) return null;

  const sidebarGroups = [
    {
      title: 'PATIENT CHART',
      items: [
        { id: 'overview', label: 'Clinical Overview', icon: User },
        { id: 'encounters', label: 'Encounters', icon: CalendarDays },
      ]
    },
    {
      title: 'LONGITUDINAL RECORD',
      items: [
        { id: 'problems', label: 'Problem List', icon: ClipboardList },
        { id: 'allergies', label: 'Allergies', icon: AlertTriangle },
        { id: 'medications', label: 'Medication History', icon: Pill },
        { id: 'vitals', label: 'Vital Signs', icon: HeartPulse },
        { id: 'immunizations', label: 'Immunizations', icon: Syringe },
        { id: 'growth', label: 'Growth Chart', icon: Scale },
      ]
    },
    {
      title: 'INVESTIGATIONS',
      items: [
        { id: 'laboratory', label: 'Laboratory', icon: FlaskConical },
        { id: 'radiology', label: 'Radiology', icon: ScanLine },
      ]
    },
    {
      title: 'ADMINISTRATION',
      items: [
        { id: 'legal', label: 'Documents & Resume', icon: FileSignature },
        { id: 'audit', label: 'Keamanan & Audit', icon: ShieldCheck },
      ]
    },
    {
      title: 'AI ASSISTANTS',
      items: [
        { id: 'voice_report', label: 'Laporan Suara Cerdas', icon: Mic },
        { id: 'search_grounding', label: 'Search Grounding', icon: Globe },
      ]
    }
  ];

  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden relative">
      {/* ───────────────────────────────────────────────────────── */}
      {/* 1. PATIENT HEADER (STRONG, CLEAR IDENTITY)               */}
      {/* ───────────────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 sm:p-5 shrink-0 shadow-sm z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex gap-4 items-start w-full md:w-auto">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center text-2xl font-bold border border-blue-200 dark:border-blue-800 shrink-0 uppercase shadow-inner">
            {patientData?.nama?.charAt(0) || 'P'}
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-1.5">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-tight">
                {patientData?.nama || 'Nama Pasien'}
              </h1>
              <span className="text-xs font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700">
                {patientData?.no_rm || 'RM-000000'}
              </span>
              <span className="text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700">
                {patientData?.jenis_kelamin === 'P' ? 'Perempuan' : 'Laki-laki'} • {patientData?.umur || 35} Thn
              </span>
            </div>
            
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs">
              {patientData.allergies?.length > 0 ? (
                <div className="flex items-center gap-1.5 font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 px-2.5 py-1 rounded-md border border-rose-200 dark:border-rose-900/50 animate-pulse">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  Alergi: {patientData.allergies.map((a:any) => a.allergen).join(', ')}
                </div>
              ) : (
                <div className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-1 rounded-md border border-emerald-200 dark:border-emerald-900/50">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Tidak ada alergi
                </div>
              )}
              
              <div className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-1 rounded-md border border-emerald-200 dark:border-emerald-900/50">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Rawat Jalan
              </div>
              <div className="flex items-center gap-1.5 font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 px-2.5 py-1 rounded-md border border-blue-200 dark:border-blue-900/50">
                <Building2 className="w-3.5 h-3.5" />
                Poli Umum
              </div>
              <div className="flex items-center gap-1.5 font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30 px-2.5 py-1 rounded-md border border-indigo-200 dark:border-indigo-900/50">
                <Stethoscope className="w-3.5 h-3.5" />
                dr. Budi Santoso
              </div>
              
              {/* PENDING ALERTS */}
              <div className="flex items-center gap-1.5 font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 px-2.5 py-1 rounded-md border border-amber-200 dark:border-amber-900/50 cursor-help" title="Pending: Hasil Lab belum diverifikasi">
                <AlertTriangle className="w-3.5 h-3.5" />
                1 Pending Item
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <PrintPDFButton 
            filename={\`RME_\${patientData?.nama || 'Pasien'}\`} 
            label="Print RME" 
            className="text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 !text-slate-700 dark:!text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700" 
            documentData={patientData}
            docType="resume_medis"
            title="RINGKASAN REKAM MEDIS"
          />
          {onBack && (
            <button onClick={onBack} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors ml-2" title="Tutup Rekam Medis (Esc)">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────── */}
      {/* 2. MAIN LAYOUT (SIDEBAR + CONTENT)                        */}
      {/* ───────────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* SIDEBAR NAVIGATION */}
        <div className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex-col overflow-y-auto custom-scrollbar hidden md:flex shrink-0">
          <div className="p-4 space-y-6">
            {sidebarGroups.map((group, idx) => (
              <div key={idx}>
                <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 px-2">
                  {group.title}
                </h4>
                <div className="space-y-1">
                  {group.items.map(item => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={\`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-all \${
                          isActive 
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shadow-sm border border-blue-100 dark:border-blue-800/50' 
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                        }\`}
                      >
                        <Icon className={\`w-4 h-4 \${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}\`} />
                        {item.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MOBILE TABS (FALLBACK) */}
        <div className="md:hidden flex gap-2 overflow-x-auto p-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shrink-0 custom-scrollbar">
          {sidebarGroups.flatMap(g => g.items).map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={\`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap \${
                  isActive 
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800/50' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }\`}
              >
                <Icon className="w-3.5 h-3.5" />
                {item.label}
              </button>
            )
          })}
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50 dark:bg-slate-950 p-4 sm:p-6 lg:p-8">
          <div className="max-w-5xl mx-auto">
            {activeTab === 'overview' && <OverviewTab patientData={patientData} />}
            {activeTab === 'encounters' && <EncountersTab patientData={patientData} onOpenVoice={() => setShowSmartVoice(true)} />}
            
            {activeTab === 'voice_report' && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
                <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 mx-auto mb-4 border border-indigo-100 dark:border-indigo-800/50 shadow-inner">
                  <Mic className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Laporan Suara Cerdas</h2>
                <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto mb-8">
                  Dikte suara medis real-time dengan filter kebisingan cerdas untuk <strong>{patientData?.nama}</strong>. Hasil dikte akan otomatis diubah menjadi format SOAP terstruktur oleh AI.
                </p>
                <button
                  onClick={() => setShowSmartVoice(true)}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold px-8 py-4 rounded-xl shadow-lg flex items-center gap-3 mx-auto transform hover:scale-105 transition-all"
                >
                  <Mic className="w-5 h-5 text-cyan-300 animate-pulse" /> 
                  Mulai Perekaman Dikte
                </button>
              </div>
            )}

            {activeTab === 'search_grounding' && (
              <MedicalSearchGrounding
                context={\`Pasien: \${patientData?.nama}, Usia: \${patientData?.umur || 35} tahun, Masalah Aktif: \${patientData?.problem_list?.map((p: any) => p.nama).join(', ') || '-'}\`}
                onApplyRecommendation={(rec) => {
                  const saved = localStorage.getItem('simrs_soap_draft'); const currentDraft = JSON.parse(saved || '{}'); localStorage.setItem('simrs_soap_draft', JSON.stringify({ ...currentDraft, plan: (currentDraft.plan || '') + \`\\n\\n[Google Search Grounding]:\\n\${rec}\` }));
                  toast.success('Rekomendasi diterapkan ke draft SOAP.');
                }}
              />
            )}
            
            {/* For compatibility with existing tabs if they are called directly */}
            {activeTab === 'triase' && <TriaseTab />}
            {activeTab === 'fisik' && <FisikTab />}
            {activeTab === 'soap' && <SoapTab onOpenVoice={() => setShowSmartVoice(true)} />}
            {activeTab === 'kode' && <KodeTab />}
            {activeTab === 'cpoe' && <CPOETab patientData={patientData} />}
            
            {activeTab === 'legal' && <LegalTab patientData={patientData} />}
            {activeTab === 'audit' && <AuditTab />}
            {activeTab === 'problems' && <ProblemListTab patientData={patientData} setPatientData={setPatientData} />}
            {activeTab === 'medications' && <MedicationsTab patientData={patientData} setPatientData={setPatientData} />}
            {activeTab === 'allergies' && <AllergiesTab patientData={patientData} setPatientData={setPatientData} />}
            {activeTab === 'vitals' && <VitalsTab patientData={patientData} />}
            {activeTab === 'immunizations' && <ImmunizationsTab />}
            {activeTab === 'growth' && <GrowthChartTab />}
            {activeTab === 'laboratory' && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
                <FlaskConical className="w-16 h-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Riwayat Laboratorium</h3>
                <p className="text-slate-500 dark:text-slate-400">Belum ada hasil pemeriksaan laboratorium untuk pasien ini.</p>
              </div>
            )}
            {activeTab === 'radiology' && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
                <ScanLine className="w-16 h-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Riwayat Radiologi</h3>
                <p className="text-slate-500 dark:text-slate-400">Belum ada hasil pemeriksaan radiologi untuk pasien ini.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showConsent && <InformedConsentModal patient={patientData} onClose={() => setShowConsent(false)} />}
      
      {showSmartVoice && (
        <SmartVoiceReport
          patient={patientData}
          isOpen={showSmartVoice}
          onClose={() => setShowSmartVoice(false)}
          onApplyToSOAP={handleApplyVoiceToSOAP}
          onApplyToRecord={(rec) => {
            toast.success('Laporan suara terverifikasi dan masuk ke audit log pasien.');
          }}
        />
      )}
    </div>
  );
}
`;

code = code.replace(patient360Regex, newPatient360);

fs.writeFileSync(file, code);
