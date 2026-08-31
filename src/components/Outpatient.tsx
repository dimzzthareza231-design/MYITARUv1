import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, UserCircle, Activity, FileText, Pill, CheckCircle, Sparkles, 
  Mic, MicOff, AlertTriangle, Stethoscope, Clock, Users, Calendar, 
  ChevronRight, RefreshCw, Volume2, ShieldCheck, Heart, Eye, Baby, 
  Scissors, Brain, Ear, Wind, Smile, Droplet, Bone, 
  Ribbon, UserCheck, ShieldAlert, Award, FileCode, CheckSquare, Plus, Trash2,
  Printer, ArrowLeft, ExternalLink, HelpCircle, Layers, X, UserPlus, Tv, Phone, MapPin, Check
} from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { useHospital, MASTER_POLI_LIST } from '../contexts/HospitalContext';
import { useToast } from '../contexts/ToastContext';
import { usePatientFlow } from '../contexts/PatientFlowContext';
import { useAntrian } from '../contexts/AntrianContext';
import SmartTable from './SmartTable';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import PatientFlowDashboard from './PatientFlowDashboard';
import { MasterPoli, Pasien, Kunjungan } from '../types';
import PrintPDFButton from './PrintPDFButton';
import { Patient360 } from './RME/Patient360';
import { PoliklinikQueueDisplay } from './PoliklinikQueueDisplay';
import { RegistrationForm } from './Registration/RegistrationForm';
import { WilayahSelector } from './WilayahSelector';

export function Outpatient() {
  const { activeTab } = useOutletContext<{ activeTab: string }>() || { activeTab: 'Pemeriksaan' };
  const { kunjungan, pasien, dokter, perawat, poli, addPasien, addKunjungan, updateKunjunganStatus, updatePasien, syncAllData } = useHospital();
  const { addKunjungan: addKunjunganPatientFlow } = usePatientFlow() || { addKunjungan: () => {} };
  const { daftarkanAntrian } = useAntrian() || { daftarkanAntrian: () => {} };
  const toast = useToast();
  
  // Active Filter / Selection State
  const [selectedPoliFilter, setSelectedPoliFilter] = useState<string>('ALL');
  const [activeQueue, setActiveQueue] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [activeExamTab, setActiveExamTab] = useState<'soap' | 'patient360' | 'scribe'>('soap');
  const [rightPanelView, setRightPanelView] = useState<'display' | 'exam'>(activeTab === 'Antrian Poli' ? 'display' : 'exam');

  useEffect(() => {
    if (activeTab === 'Antrian Poli') {
      setRightPanelView('display');
    } else if (activeTab === 'Pemeriksaan') {
      setRightPanelView('exam');
    }
  }, [activeTab]);

  // Modals State
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);
  const [showUnifiedRegistrationModal, setShowUnifiedRegistrationModal] = useState(false);
  const [showPatient360Modal, setShowPatient360Modal] = useState(false);
  const [selectedPatientForModal, setSelectedPatientForModal] = useState<any>(null);
  const [showAddBookingModal, setShowAddBookingModal] = useState(false);

  // Booking Registrasi State
  const [bookingSearch, setBookingSearch] = useState('');
  const [bookingStatusFilter, setBookingStatusFilter] = useState('ALL');
  const [newBookingForm, setNewBookingForm] = useState({
    pasienId: '',
    namaManual: '',
    noRmManual: '',
    poliId: 'POLI-01',
    dokterId: '',
    tanggal: new Date().toISOString().split('T')[0],
    jam: '08:30',
    penjamin: 'BPJS Kesehatan',
    keluhan: ''
  });

  const [bookingList, setBookingList] = useState<any[]>(() => {
    const saved = localStorage.getItem('hospital_booking_registrasi');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [
      {
        id: 'BK-001',
        booking_code: 'BK-2026-08101',
        nama_pasien: 'Budi Santoso',
        no_rm: 'RM-260801-1001',
        pasien_id: 'P-001',
        poli_tujuan: 'Poli Penyakit Dalam',
        poli_id: 'POLI-01',
        dokter_dpjp: 'dr. Andi Pratama, Sp.PD',
        tanggal_booking: new Date().toISOString().split('T')[0],
        jam_estimasi: '08:30 WIB',
        penjamin: 'BPJS Kesehatan',
        status_booking: 'Terkonfirmasi',
        keluhan: 'Kontrol rutin hipertensi dan diabetes melitus'
      },
      {
        id: 'BK-002',
        booking_code: 'BK-2026-08102',
        nama_pasien: 'Siti Aminah',
        no_rm: 'RM-260801-1002',
        pasien_id: 'P-002',
        poli_tujuan: 'Poli Jantung & Pembuluh Darah',
        poli_id: 'POLI-03',
        dokter_dpjp: 'dr. Citra Lestari, Sp.JP',
        tanggal_booking: new Date().toISOString().split('T')[0],
        jam_estimasi: '09:15 WIB',
        penjamin: 'BPJS Kesehatan',
        status_booking: 'Terkonfirmasi',
        keluhan: 'Evaluasi nyeri dada saat beraktivitas'
      },
      {
        id: 'BK-003',
        booking_code: 'BK-2026-08103',
        nama_pasien: 'Ahmad Dahlan',
        no_rm: 'RM-260802-1003',
        pasien_id: 'P-003',
        poli_tujuan: 'Poli Bedah Umum',
        poli_id: 'POLI-04',
        dokter_dpjp: 'dr. Denny Kurniawan, Sp.B',
        tanggal_booking: new Date().toISOString().split('T')[0],
        jam_estimasi: '10:00 WIB',
        penjamin: 'Umum / Mandiri',
        status_booking: 'Check-In',
        keluhan: 'Kontrol luka post eksisi kista sebasea'
      },
      {
        id: 'BK-004',
        booking_code: 'BK-2026-08104',
        nama_pasien: 'Dewi Sartika',
        no_rm: 'RM-260802-1004',
        pasien_id: 'P-004',
        poli_tujuan: 'Poli Kebidanan & Kandungan',
        poli_id: 'POLI-02',
        dokter_dpjp: 'dr. Budi Setiawan, Sp.OG',
        tanggal_booking: new Date().toISOString().split('T')[0],
        jam_estimasi: '10:45 WIB',
        penjamin: 'BPJS Kesehatan',
        status_booking: 'Terkonfirmasi',
        keluhan: 'Pemeriksaan USG antenatal trimester 2'
      },
      {
        id: 'BK-005',
        booking_code: 'BK-2026-08105',
        nama_pasien: 'Ananda Rizky Pratama',
        no_rm: 'RM-260803-1005',
        pasien_id: 'P-005',
        poli_tujuan: 'Poli Anak (Pediatri)',
        poli_id: 'POLI-05',
        dokter_dpjp: 'dr. Eka Rahmawati, Sp.A',
        tanggal_booking: new Date().toISOString().split('T')[0],
        jam_estimasi: '11:15 WIB',
        penjamin: 'BPJS Kesehatan',
        status_booking: 'Terkonfirmasi',
        keluhan: 'Demam 3 hari naik turun disertai batuk pilek'
      },
      {
        id: 'BK-006',
        booking_code: 'BK-2026-08106',
        nama_pasien: 'Hendra Gunawan',
        no_rm: 'RM-260803-1006',
        pasien_id: 'P-006',
        poli_tujuan: 'Poli Mata (Oftalmologi)',
        poli_id: 'POLI-06',
        dokter_dpjp: 'dr. Farhan Syahputra, Sp.M',
        tanggal_booking: new Date().toISOString().split('T')[0],
        jam_estimasi: '11:45 WIB',
        penjamin: 'Asuransi Inhealth',
        status_booking: 'Terkonfirmasi',
        keluhan: 'Pemeriksaan visus dan refraksi mata kabur'
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('hospital_booking_registrasi', JSON.stringify(bookingList));
  }, [bookingList]);

  // New Patient Queue Form State (in Modal)
  const [modalFormMode, setModalFormMode] = useState<'registered' | 'new'>('registered');
  const [patientSearchInModal, setPatientSearchInModal] = useState('');
  const [newQueueForm, setNewQueueForm] = useState({
    pasienId: '',
    namaManual: '',
    noRmManual: '',
    nikManual: '',
    jenisKelamin: 'L' as 'L' | 'P',
    tanggalLahir: '1990-01-01',
    noHp: '',
    alamat: '',
    provinsi: '',
    kotaKabupaten: '',
    kecamatan: '',
    kelurahan: '',
    poliId: 'POLI-01',
    dokterId: '',
    penjamin: 'BPJS Kesehatan',
    keluhan: '',
    tipeKunjungan: 'Rawat Jalan',
    tandaVital: {
      td: '120/80',
      suhu: '36.5',
      nadi: '80',
      rr: '18',
      spo2: '98'
    }
  });

  // AI Scribe & Talk-To-Text State
  const [transcript, setTranscript] = useState('');
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<any>(null);
  const [activeAudioTarget, setActiveAudioTarget] = useState<'all' | 's' | 'o' | 'a' | 'p'>('all');

  // Form SOAP State
  const [soapData, setSoapData] = useState({
    s: '',
    rpd: '',
    alergi: '',
    o: '',
    lab_rad: '',
    a: '',
    diagnosis_sekunder: '',
    icd10: '',
    p: '',
    tindakan_icd9: '',
    kontrol: '1 Minggu kemudian di Poliklinik',
    vitalSigns: { 
      td: '120/80', 
      nadi: '82', 
      suhu: '36.7', 
      rr: '18', 
      spo2: '99',
      tb: '165',
      bb: '62',
      imt: '22.8'
    }
  });

  // E-Prescribing State
  const [newDrug, setNewDrug] = useState({ name: '', qty: '', rules: '' });
  const [prescriptions, setPrescriptions] = useState<{ name: string; qty: string; rules: string }[]>([]);

  // Doctor Schedule Filter State
  const [docSearch, setDocSearch] = useState('');
  const [docDayFilter, setDocDayFilter] = useState('ALL');
  const [docShiftFilter, setDocShiftFilter] = useState('ALL');
  const [docStatusFilter, setDocStatusFilter] = useState('ALL');

  // Speech Recognition Hook
  const { isRecording, startRecording, stopRecording, isSupported } = useSpeechRecognition({
    onResult: (text) => {
      setTranscript(prev => (prev ? prev + ' ' : '') + text);
      if (activeAudioTarget === 's') {
        setSoapData(prev => ({ ...prev, s: (prev.s ? prev.s + ' ' : '') + text }));
      } else if (activeAudioTarget === 'o') {
        setSoapData(prev => ({ ...prev, o: (prev.o ? prev.o + ' ' : '') + text }));
      } else if (activeAudioTarget === 'a') {
        setSoapData(prev => ({ ...prev, a: (prev.a ? prev.a + ' ' : '') + text }));
      } else if (activeAudioTarget === 'p') {
        setSoapData(prev => ({ ...prev, p: (prev.p ? prev.p + ' ' : '') + text }));
      }
    }
  });

  // Poliklinik List helper
  const allPoliList: MasterPoli[] = useMemo(() => {
    return poli && poli.length > 0 ? poli : MASTER_POLI_LIST;
  }, [poli]);

  // Categories grouping
  const poliByCategory = useMemo(() => {
    const map: Record<string, MasterPoli[]> = {
      'Spesialis Utama': [],
      'Subspesialis': [],
      'Penunjang & Khusus': [],
      'Umum & Kegawatdaruratan': []
    };
    allPoliList.forEach(p => {
      const kat = p.kategori || 'Spesialis Utama';
      if (!map[kat]) map[kat] = [];
      map[kat].push(p);
    });
    return map;
  }, [allPoliList]);

  // Currently selected Poliklinik object
  const currentPoli = useMemo(() => {
    if (selectedPoliFilter === 'ALL') return null;
    return allPoliList.find(p => p.id === selectedPoliFilter) || null;
  }, [selectedPoliFilter, allPoliList]);

  // Filter queues by selected poli, status, and search query
  const filteredQueues = useMemo(() => {
    return kunjungan
      .filter(k => k.tipe === 'Rawat Jalan' || k.tipe === 'Poliklinik' || (k as any).jenis_kunjungan === 'Rawat Jalan')
      .filter(k => {
        if (selectedPoliFilter === 'ALL') return true;
        return k.poli_id === selectedPoliFilter || (k as any).poli === selectedPoliFilter;
      })
      .filter(k => {
        if (statusFilter === 'ALL') return true;
        return k.status === statusFilter;
      })
      .filter(k => {
        const p = pasien.find(px => String(px.id) === String(k.pasien_id));
        const search = searchQuery.toLowerCase();
        return (
          !search ||
          (p?.nama && p.nama.toLowerCase().includes(search)) ||
          (p?.no_rm && p.no_rm.toLowerCase().includes(search)) ||
          (k.nomor_antrian && k.nomor_antrian.toLowerCase().includes(search)) ||
          (k.keluhan_utama && k.keluhan_utama.toLowerCase().includes(search))
        );
      });
  }, [kunjungan, pasien, selectedPoliFilter, statusFilter, searchQuery]);

  // Active visit being examined
  const activeVisit = useMemo(() => {
    if (activeQueue) {
      return kunjungan.find(k => k.id === activeQueue) || null;
    }
    // If a specific poli is chosen, default to first queue if available
    if (selectedPoliFilter !== 'ALL' && filteredQueues.length > 0) {
      return filteredQueues[0];
    }
    return null;
  }, [kunjungan, activeQueue, selectedPoliFilter, filteredQueues]);

  // Auto-set activeQueue when activeVisit is determined
  useEffect(() => {
    if (activeVisit && !activeQueue) {
      setActiveQueue(activeVisit.id);
    }
  }, [activeVisit, activeQueue]);

  // Active patient object with fallback to dummy/resume data
  const activePatient = useMemo(() => {
    if (!activeVisit) return null;
    const found = pasien.find(p => String(p.id) === String(activeVisit.pasien_id));
    if (found) return found;
    return {
      id: activeVisit.pasien_id,
      no_rm: `RM-${activeVisit.nomor_antrian || '001'}`,
      nama: 'Pasien Poliklinik',
      nik: '3171012345670001',
      jenis_kelamin: 'L',
      tanggal_lahir: '1988-05-14',
      telepon: '0812-3456-7890',
      penjamin: 'BPJS Kesehatan',
      alamat: 'Jl. Sehat No. 12, Jakarta',
      keluhan_utama: activeVisit.keluhan_utama
    } as any;
  }, [activeVisit, pasien]);

  const activeDoctor = useMemo(() => {
    if (!activeVisit) return null;
    return dokter.find(d => d.id === activeVisit.dokter_id || d.poli_id === activeVisit.poli_id) || dokter[0];
  }, [activeVisit, dokter]);

  const activePoliObj = useMemo(() => {
    if (!activeVisit) return null;
    return allPoliList.find(p => p.id === activeVisit.poli_id) || null;
  }, [activeVisit, allPoliList]);

  // Sync SOAP state whenever active patient changes
  useEffect(() => {
    if (activePatient) {
      const resume = (activePatient as any).resume_medis;
      const soap = (activePatient as any).soap;

      const tbNum = 165;
      const bbNum = 62;
      const imtCalc = (bbNum / ((tbNum / 100) * (tbNum / 100))).toFixed(1);

      setSoapData({
        s: activeVisit?.keluhan_utama || resume?.keluhan_utama || soap?.s || 'Pasien datang untuk kontrol rutin dan pemeriksaan klinis di Poliklinik.',
        rpd: resume?.riwayat_penyakit_dahulu || 'Tidak ada riwayat penyakit berat sebelumnya.',
        alergi: activePatient.alergi || resume?.alergi || 'Tidak ada riwayat alergi obat.',
        o: resume?.pemeriksaan_fisik || soap?.o || 'Keadaan Umum: Compos Mentis, GCS E4V5M6. Cor/Pulmo: S1-S2 normal, wheezing -/-, rhonki -/-. Abdomen: supel, BU (+) normal. Ekstremitas: akral hangat, edema -/-.',
        lab_rad: resume?.pemeriksaan_penunjang || 'EKG: Sinus Rhythm, HR 80x/m normal. Laboratorium Rutin dalam batas normal.',
        a: resume?.diagnosis_primer?.nama || 'Pemeriksaan Kesehatan Klinis (General Medical Checkup)',
        diagnosis_sekunder: resume?.diagnosis_sekunder?.map((d: any) => d.nama).join(', ') || '',
        icd10: resume?.diagnosis_primer?.kode_icd10 || 'Z00.0',
        p: resume?.rencana_terapi || 'Edukasi pola hidup sehat, kurangi konsumsi garam & gula berlebih, istirahat cukup, dan patuhi konsumsi obat.',
        tindakan_icd9: resume?.tindakan_prosedur?.map((t: any) => `${t.kode_icd9} - ${t.nama}`).join(', ') || '89.52 - Electrocardiogram 12-lead',
        kontrol: resume?.instruksi_kontrol || '1 Minggu kemudian di Poliklinik',
        vitalSigns: {
          td: '120/80',
          nadi: '82',
          suhu: '36.7',
          rr: '18',
          spo2: '99',
          tb: String(tbNum),
          bb: String(bbNum),
          imt: imtCalc
        }
      });

      if (resume?.terapi && Array.isArray(resume.terapi)) {
        setPrescriptions(resume.terapi.map((t: any) => ({
          name: t.nama_obat,
          qty: '10 Tablet',
          rules: `${t.dosis || ''} ${t.frekuensi || '3x1 tablet sesudah makan'}`
        })));
      } else {
        setPrescriptions([
          { name: 'Paracetamol 500mg', qty: '10 Tablet', rules: '3 x 1 tablet bila demam/nyeri' },
          { name: 'Vitamin B Kompleks', qty: '10 Tablet', rules: '1 x 1 tablet sesudah makan pagi' }
        ]);
      }
    }
  }, [activePatient, activeVisit]);

  // Recalculate IMT when TB or BB changes
  const handleVitalChange = (field: string, val: string) => {
    setSoapData(prev => {
      const updatedVitals = { ...prev.vitalSigns, [field]: val };
      if (field === 'tb' || field === 'bb') {
        const tbNum = parseFloat(field === 'tb' ? val : updatedVitals.tb) || 165;
        const bbNum = parseFloat(field === 'bb' ? val : updatedVitals.bb) || 62;
        if (tbNum > 0 && bbNum > 0) {
          updatedVitals.imt = (bbNum / ((tbNum / 100) * (tbNum / 100))).toFixed(1);
        }
      }
      return { ...prev, vitalSigns: updatedVitals };
    });
  };

  // Talk-to-Text AI Analyzer
  const handleAnalyzeTranscript = async (customText?: string) => {
    const textToAnalyze = customText || transcript;
    if (!textToAnalyze.trim()) {
      toast.error('Transkrip suara belum tersedia. Silakan rekam atau muat demo suara.');
      return;
    }

    setIsProcessingAI(true);
    try {
      const res = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clinicalNote: textToAnalyze })
      });

      if (res.ok) {
        const data = await res.json();
        const parsed = {
          raw: textToAnalyze,
          confidence: 94,
          subjective: data.soap?.subjective || data.resume || textToAnalyze,
          objective: data.soap?.objective || 'Tanda vital dalam batas toleransi. Pemeriksaan fisik sesuai keluhan.',
          diagnosisSuggestions: data.icd10 || [
            { code: 'Z00.0', description: 'General medical examination' },
            { code: 'R50.9', description: 'Fever, unspecified' }
          ],
          drugSuggestions: data.recommendations?.map((m: any) => ({
            name: m,
            qty: '10 Tab',
            rules: 'Sesuai indikasi'
          })) || []
        };
        setAiAnalysisResult(parsed);
        toast.success('Analisis AI Scribe selesai!');
      } else {
        throw new Error('AI analysis fallback');
      }
    } catch {
      // Intelligent fallback parser for clinical simulation
      const parsed = {
        raw: textToAnalyze,
        confidence: 88,
        subjective: textToAnalyze,
        objective: 'TD: 120/80 mmHg, Nadi: 80x/m, Suhu: 36.8 C, RR: 18x/m. Thorax/Abdomen dalam batas normal.',
        diagnosisSuggestions: [
          { code: 'K29.7', description: 'Gastritis, unspecified' },
          { code: 'R51', description: 'Headache' },
          { code: 'I10', description: 'Essential (primary) hypertension' }
        ],
        drugSuggestions: [
          { name: 'Paracetamol 500mg', qty: '10 Tab', rules: '3 x 1 tablet bila nyeri/demam' },
          { name: 'Omeprazole 20mg', qty: '10 Kapsul', rules: '2 x 1 kapsul 30 menit sebelum makan' }
        ]
      };
      setAiAnalysisResult(parsed);
      toast.info('Analisis AI Scribe siap diterapkan.');
    } finally {
      setIsProcessingAI(false);
    }
  };

  const handleApplyAIToSOAP = () => {
    if (!aiAnalysisResult) return;

    setSoapData(prev => ({
      ...prev,
      s: (prev.s ? prev.s + '\n' : '') + aiAnalysisResult.subjective,
      o: prev.o || aiAnalysisResult.objective,
      a: prev.a || (aiAnalysisResult.diagnosisSuggestions[0] ? `${aiAnalysisResult.diagnosisSuggestions[0].code} - ${aiAnalysisResult.diagnosisSuggestions[0].description}` : prev.a),
      icd10: aiAnalysisResult.diagnosisSuggestions[0]?.code || prev.icd10
    }));

    if (aiAnalysisResult.drugSuggestions && aiAnalysisResult.drugSuggestions.length > 0) {
      setPrescriptions(prev => [...prev, ...aiAnalysisResult.drugSuggestions]);
    }

    toast.success('Hasil analisis AI berhasil disalin ke form SOAP & Resep!');
  };

  const handleLoadDemoScribe = (tipeCase: 'obgyn' | 'jantung' | 'anak' | 'saraf' | 'umum' | 'bedah' | 'dalam') => {
    let demoText = '';
    if (tipeCase === 'obgyn') {
      demoText = 'Pasien wanita G2P1A0 hamil 32 minggu datang kontrol rutin kandungan. Mengeluh kaki sedikit bengkak dan pegal pinggang. Tekanan darah 110/70, denyut jantung janin 142 kali per menit teratur, letak kepala, gerakan janin aktif. Rencana USG fetomaternal dan preskripsi vitamin kalsium dan asam folat.';
    } else if (tipeCase === 'jantung') {
      demoText = 'Pasien mengeluh dada terasa tidak nyaman dan berdebar terutama saat berolahraga jalan pagi. Riwayat hipertensi 5 tahun. TD 135/85 mmHg, nadi 84x per menit teratur. Auskultasi suara jantung S1 S2 reguler tidak ada murmur. Suspek angina pektoris stabil, direkomendasikan EKG dan treadmill test.';
    } else if (tipeCase === 'anak') {
      demoText = 'Anak usia 4 tahun dibawa orang tua dengan keluhan demam sejak 2 hari, batuk berdahak dan pilek hidung tersumbat. Makan dan minum masih mau sedikit. Suhu 38.2 derajat, RR 24 kali per menit. Tenggorokan hiperemis (+), ronki (-). Diberikan antipiretik paracetamol sirup dan obat batuk ekspektoran.';
    } else if (tipeCase === 'saraf') {
      demoText = 'Pasien pasca stroke 3 bulan lalu mengeluh tangan dan kaki kanan masih terasa kaku dan kesemutan saat digerakkan. Tekanan darah terkontrol 125/80. Kekuatan otot ekstremitas kanan 4/5. Dilanjutkan fisioterapi rutin dan neurotropik.';
    } else if (tipeCase === 'bedah') {
      demoText = 'Pasien mengeluh nyeri perut kanan bawah sejak 1 hari yang lalu, awalnya di sekitar pusar lalu berpindah ke perut kanan bawah. Mual (+), demam subfebris 37.8C. Nyeri tekan McBurney positif, Rovsing sign positif. Suspek apendisitis akut, konsul dokter spesialis bedah.';
    } else if (tipeCase === 'dalam') {
      demoText = 'Pasien mengeluh badan lemas, sering merasa haus dan kencing malam hari lebih dari 4 kali. Riwayat gula darah puasa 190 mg/dL. Tekanan darah 130/85 mmHg. Diagnosis Diabetes Melitus Tipe 2, diresepkan Metformin 500mg 3x1 dan edukasi diet diabetisi.';
    } else {
      demoText = 'Pasien mengeluh nyeri ulu hati dan mual sejak 3 hari, terasa perih setelah terlambat makan dan minum kopi. Tidak ada muntah darah atau BAB hitam. TD 120/80, nyeri tekan epigastrium (+). Diagnosis Gastritis akut, diberikan antasida dan omeprazole.';
    }

    setTranscript(demoText);
    toast.success(`Demo kasus ${tipeCase.toUpperCase()} dimuat. Memproses AI...`);
    handleAnalyzeTranscript(demoText);
  };

  const toggleRecording = (target: 'all' | 's' | 'o' | 'a' | 'p' = 'all') => {
    setActiveAudioTarget(target);
    if (!isSupported) {
      toast.error('Browser tidak mendukung Web Speech API. Pastikan menggunakan Chrome/Edge.');
      return;
    }
    if (isRecording) {
      stopRecording();
      toast.info('⏹️ Perekaman suara dihentikan.');
    } else {
      const ok = startRecording();
      if (ok) {
        toast.info('🎤 AI Scribe mendengarkan... Silakan berbicara');
      } else {
        toast.error('Gagal mengakses mikrofon.');
      }
    }
  };

  const handleAddDrug = () => {
    if (!newDrug.name.trim()) {
      toast.error('Masukkan nama obat');
      return;
    }
    setPrescriptions(prev => [...prev, { ...newDrug, qty: newDrug.qty || '10 Tab', rules: newDrug.rules || '3 x 1 sesudah makan' }]);
    setNewDrug({ name: '', qty: '', rules: '' });
    toast.success('Obat berhasil ditambahkan ke E-Prescription');
  };

  const handleSaveSOAP = () => {
    if (!activeVisit) {
      toast.error('Pilih antrian pasien terlebih dahulu');
      return;
    }
    if (!soapData.s.trim() && !soapData.a.trim()) {
      toast.error('Isi minimal Subjective atau Assessment diagnosis');
      return;
    }

    // 1. Update status kunjungan
    updateKunjunganStatus(activeVisit.id, 'Selesai');

    // 2. Buat objek encounter rekam medis terpadu
    const encounterId = `ENC-${Date.now()}`;
    const newEncounter = {
      id: encounterId,
      visitId: activeVisit.id,
      patientId: String(activePatient?.id || activeVisit.pasien_id),
      no_rm: activePatient?.no_rm || 'RM-000000',
      nama: activePatient?.nama || 'Pasien',
      tanggal: new Date().toISOString(),
      unit: currentPoli ? currentPoli.nama : 'Poliklinik Terpadu',
      dokter: activeDoctor ? activeDoctor.nama : 'dr. Spesialis DPJP',
      subjective: soapData.s,
      objective: soapData.o,
      assessment: soapData.a,
      plan: soapData.p,
      icd10: soapData.icd10 || 'Z00.0',
      tindakan_icd9: soapData.tindakan_icd9,
      alergi: soapData.alergi,
      vitalSigns: soapData.vitalSigns,
      kontrol: soapData.kontrol,
      resep: prescriptions,
      status: 'Selesai'
    };

    // 3. Update master data pasien di HospitalContext (resume medis, soap, tanda vital, alergi)
    if (activePatient && activePatient.id) {
      updatePasien(String(activePatient.id), {
        keluhan_utama: soapData.s,
        alergi: soapData.alergi ? [{ allergen: soapData.alergi, reaction: 'Reaksi Tercatat', severity: 'Sedang' }] : undefined,
        tanda_vital: {
          td: soapData.vitalSigns.td,
          nadi: soapData.vitalSigns.nadi,
          suhu: soapData.vitalSigns.suhu,
          rr: soapData.vitalSigns.rr,
          spo2: soapData.vitalSigns.spo2
        },
        resume_medis: {
          id: `RES-${Date.now()}`,
          tanggal: new Date().toISOString(),
          keluhan_utama: soapData.s,
          riwayat_penyakit_dahulu: soapData.rpd,
          alergi: soapData.alergi,
          pemeriksaan_fisik: soapData.o,
          pemeriksaan_penunjang: soapData.lab_rad,
          diagnosis_primer: { kode_icd10: soapData.icd10 || 'Z00.0', nama: soapData.a || 'Pemeriksaan Klinis' },
          diagnosis_sekunder: soapData.diagnosis_sekunder ? [{ kode_icd10: 'R51', nama: soapData.diagnosis_sekunder }] : [],
          tindakan_prosedur: soapData.tindakan_icd9 ? [{ kode_icd9: '89.52', nama: soapData.tindakan_icd9 }] : [],
          rencana_terapi: soapData.p,
          instruksi_kontrol: soapData.kontrol,
          dokter_dpjp: activeDoctor?.nama || 'dr. Spesialis DPJP',
          unit_pelayanan: currentPoli?.nama || 'Poliklinik',
          terapi: prescriptions.map(p => ({ nama_obat: p.name, dosis: p.qty, frekuensi: p.rules }))
        },
        soap: {
          s: soapData.s,
          o: soapData.o,
          a: soapData.a,
          p: soapData.p
        }
      });
    }

    // 4. Sinkronisasikan ke local storage encounters untuk Rekam Medis (RME & Patient360)
    try {
      const savedEncounters = localStorage.getItem('simrs_rme_encounters');
      const encountersList = savedEncounters ? JSON.parse(savedEncounters) : [];
      encountersList.unshift(newEncounter);
      localStorage.setItem('simrs_rme_encounters', JSON.stringify(encountersList));

      if (activePatient?.id) {
        const ptKey = `simrs_rme_patient_${activePatient.id}`;
        const savedPt = localStorage.getItem(ptKey);
        const ptList = savedPt ? JSON.parse(savedPt) : [];
        ptList.unshift(newEncounter);
        localStorage.setItem(ptKey, JSON.stringify(ptList));
      }

      localStorage.setItem('simrs_rme_soap', JSON.stringify(soapData));
      localStorage.setItem('simrs_soap_draft', JSON.stringify(soapData));
    } catch (e) {
      console.error('Error syncing clinical data with RME storage:', e);
    }

    toast.success(`✅ Pemeriksaan selesai! Data tersinkronisasi ke Rekam Medis (RME) pasien ${activePatient?.nama || ''} & Resep diteruskan ke Farmasi.`);
    
    // Notify next in line
    const nextWaiting = filteredQueues.find(q => q.id !== activeVisit.id && q.status === 'Menunggu');
    if (nextWaiting) {
      setActiveQueue(nextWaiting.id);
    }
  };

  // Add new patient to queue (Quick / Complete Registration)
  const handleAddNewQueue = () => {
    const targetPoli = allPoliList.find(p => p.id === newQueueForm.poliId) || currentPoli || allPoliList[0];
    let chosenPatient = pasien.find(p => String(p.id) === String(newQueueForm.pasienId));
    
    if (modalFormMode === 'new' || !chosenPatient) {
      if (!newQueueForm.namaManual.trim()) {
        toast.error('Silakan isi Nama Lengkap Pasien.');
        return;
      }

      const generatedNoRm = newQueueForm.noRmManual.trim() || `RM-${new Date().toISOString().slice(2, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;
      const generatedNik = newQueueForm.nikManual.trim() || ('3273' + Math.floor(100000000000 + Math.random() * 900000000000));

      const newP: Pasien = {
        id: `P-${Date.now()}`,
        no_rm: generatedNoRm,
        nik: generatedNik,
        nama: newQueueForm.namaManual.trim(),
        jenis_kelamin: newQueueForm.jenisKelamin || 'L',
        tanggal_lahir: newQueueForm.tanggalLahir || '1990-01-01',
        tgl_lahir: newQueueForm.tanggalLahir || '1990-01-01',
        telepon: newQueueForm.noHp.trim() || '0812-8888-9999',
        no_hp: newQueueForm.noHp.trim() || '0812-8888-9999',
        penjamin: newQueueForm.penjamin,
        status: 'Aktif',
        alamat: newQueueForm.alamat.trim() || 'Kota Bandung, Jawa Barat'
      };

      chosenPatient = newP;
      addPasien(newP);
    }

    if (!chosenPatient) {
      toast.error('Gagal memproses data pasien.');
      return;
    }

    const assignedDoc = dokter.find(d => d.id === newQueueForm.dokterId) || 
      dokter.find(d => d.poli_id === targetPoli.id) || 
      dokter[0];

    const currentPoliQueues = kunjungan.filter(k => k.poli_id === targetPoli.id);
    const queueCode = targetPoli.kode || targetPoli.nama.substring(0, 3).toUpperCase();
    const queueNum = String(currentPoliQueues.length + 1).padStart(3, '0');
    const nomorAntrian = `${queueCode}-${queueNum}`;

    const newVisit: Kunjungan = {
      id: `K-${targetPoli.kode}-${Date.now().toString().slice(-4)}`,
      pasien_id: String(chosenPatient.id),
      tanggal: new Date().toISOString().split('T')[0],
      poli_id: targetPoli.id,
      dokter_id: assignedDoc.id,
      penjamin_id: newQueueForm.penjamin.includes('BPJS') ? 'PJ-02' : 'PJ-01',
      status: 'Menunggu',
      tipe: 'Rawat Jalan',
      nomor_antrian: nomorAntrian,
      keluhan_utama: newQueueForm.keluhan.trim() || `Pemeriksaan klinis di ${targetPoli.nama}`
    };

    // 1. Simpan Kunjungan di HospitalContext
    addKunjungan(newVisit);

    // 2. Sinkronkan ke PatientFlowContext
    try {
      if (addKunjunganPatientFlow) {
        addKunjunganPatientFlow({
          no_rm: chosenPatient.no_rm,
          nama_pasien: chosenPatient.nama,
          jenis_kunjungan: 'Rawat Jalan',
          poli: targetPoli.nama,
          dokter: assignedDoc.nama,
          penjamin: newQueueForm.penjamin
        });
      }
    } catch (e) {
      console.warn('PatientFlowContext sync:', e);
    }

    // 3. Sinkronkan ke AntrianContext
    try {
      if (daftarkanAntrian) {
        daftarkanAntrian({
          pasienId: String(chosenPatient.id),
          namaPasien: chosenPatient.nama,
          noRm: chosenPatient.no_rm,
          poliId: targetPoli.id,
          keluhan: newQueueForm.keluhan,
          penjamin: newQueueForm.penjamin
        });
      }
    } catch (e) {
      console.warn('AntrianContext sync:', e);
    }

    // 4. Update Filter & Focus
    setSelectedPoliFilter(targetPoli.id);
    setActiveQueue(newVisit.id);
    setShowAddPatientModal(false);

    toast.success(`🎫 Pasien ${chosenPatient.nama} berhasil didaftarkan ke ${targetPoli.nama}! (No. Antrean: ${nomorAntrian})`);

    // Reset Form State
    setNewQueueForm({
      pasienId: '',
      namaManual: '',
      noRmManual: '',
      nikManual: '',
      jenisKelamin: 'L',
      tanggalLahir: '1990-01-01',
      noHp: '',
      alamat: '',
      provinsi: '',
      kotaKabupaten: '',
      kecamatan: '',
      kelurahan: '',
      poliId: targetPoli.id,
      dokterId: '',
      penjamin: 'BPJS Kesehatan',
      keluhan: '',
      tipeKunjungan: 'Rawat Jalan',
      tandaVital: {
        td: '120/80',
        suhu: '36.5',
        nadi: '80',
        rr: '18',
        spo2: '98'
      }
    });
    setModalFormMode('registered');
    setPatientSearchInModal('');
  };

  // Doctor Filter Logic for Jadwal Dokter Tab
  const filteredDoctors = useMemo(() => {
    return dokter.filter((d) => {
      const matchSearch =
        d.nama.toLowerCase().includes(docSearch.toLowerCase()) ||
        (d.spesialisasi && d.spesialisasi.toLowerCase().includes(docSearch.toLowerCase())) ||
        (d.poli_nama && d.poli_nama.toLowerCase().includes(docSearch.toLowerCase()));

      const matchDay = docDayFilter === 'ALL' || (d.hari && d.hari.includes(docDayFilter));
      const matchShift = docShiftFilter === 'ALL' || (d.shift && d.shift.includes(docShiftFilter));
      const matchStatus = docStatusFilter === 'ALL' || (d.status_jaga && d.status_jaga.includes(docStatusFilter));

      return matchSearch && matchDay && matchShift && matchStatus;
    });
  }, [dokter, docSearch, docDayFilter, docShiftFilter, docStatusFilter]);

  // 1. TAB: PATIENT FLOW
  if (activeTab === 'Patient Flow') {
    return <PatientFlowDashboard />;
  }

  // 2. TAB: BOOKING REGISTRASI
  if (activeTab === 'Booking Registrasi' || activeTab === 'Booking Periksa') {
    const filteredBookings = bookingList.filter(b => {
      const matchSearch = !bookingSearch || 
        b.nama_pasien?.toLowerCase().includes(bookingSearch.toLowerCase()) ||
        b.no_rm?.toLowerCase().includes(bookingSearch.toLowerCase()) ||
        b.booking_code?.toLowerCase().includes(bookingSearch.toLowerCase()) ||
        b.poli_tujuan?.toLowerCase().includes(bookingSearch.toLowerCase());
      const matchStatus = bookingStatusFilter === 'ALL' || b.status_booking === bookingStatusFilter;
      return matchSearch && matchStatus;
    });

    const countTotal = bookingList.length;
    const countConfirmed = bookingList.filter(b => b.status_booking === 'Terkonfirmasi').length;
    const countCheckedIn = bookingList.filter(b => b.status_booking === 'Check-In').length;
    const countDone = bookingList.filter(b => b.status_booking === 'Selesai').length;

    const handleCheckInBooking = (b: any) => {
      // Find patient or create
      let p = pasien.find(px => px.no_rm === b.no_rm || String(px.id) === String(b.pasien_id));
      if (!p) {
        const newP: Pasien = {
          id: b.pasien_id || `P-${Date.now()}`,
          no_rm: b.no_rm,
          nik: '3171' + Math.floor(100000000000 + Math.random() * 900000000000),
          nama: b.nama_pasien,
          jenis_kelamin: 'L',
          tanggal_lahir: '1990-01-01',
          tgl_lahir: '1990-01-01',
          telepon: '0812-8888-9999',
          no_hp: '0812-8888-9999',
          penjamin: b.penjamin,
          status: 'Aktif',
          alamat: 'Kota Bandung'
        };
        addPasien(newP);
        p = newP;
      }

      const targetPoli = allPoliList.find(x => x.id === b.poli_id || x.nama === b.poli_tujuan) || allPoliList[0];
      const targetDoc = dokter.find(d => d.nama === b.dokter_dpjp || d.poli_id === targetPoli.id) || dokter[0];
      const currentPoliQueues = kunjungan.filter(k => k.poli_id === targetPoli.id);
      const queueCode = targetPoli.kode || targetPoli.nama.substring(0, 3).toUpperCase();
      const queueNum = String(currentPoliQueues.length + 1).padStart(3, '0');

      const newVisit: Kunjungan = {
        id: `K-${targetPoli.kode}-${Date.now().toString().slice(-4)}`,
        pasien_id: String(p.id),
        tanggal: new Date().toISOString().split('T')[0],
        poli_id: targetPoli.id,
        dokter_id: targetDoc.id,
        penjamin_id: 'PJ-01',
        status: 'Menunggu',
        tipe: 'Rawat Jalan',
        nomor_antrian: `${queueCode}-${queueNum}`,
        keluhan_utama: b.keluhan || `Booking Registrasi di ${targetPoli.nama}`
      };

      addKunjungan(newVisit);

      // Update booking status
      setBookingList(prev => prev.map(item => item.id === b.id ? { ...item, status_booking: 'Check-In' } : item));
      toast.success(`Pasien ${b.nama_pasien} berhasil Check-In ke Antrian ${targetPoli.nama} (${newVisit.nomor_antrian})`);
    };

    return (
      <div className="p-6 h-full space-y-6">
        {/* Header Bar */}
        <div className="flex flex-wrap justify-between items-center gap-4 bg-slate-800 p-5 rounded-2xl border border-slate-700 shadow-sm">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
              <Calendar className="w-6 h-6 text-cyan-400" />
              Booking & Registrasi Pasien Poliklinik Terpadu
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Kelola pendaftaran pasien baru dengan Form Terpadu 8-Langkah, reservasi poliklinik, dan integrasi Mobile JKN & RME.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button 
              onClick={() => setShowUnifiedRegistrationModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-950/40 transition-all cursor-pointer"
            >
              <UserPlus className="w-4 h-4" /> Daftarkan Pasien Baru (Form Terpadu)
            </button>
            <button 
              onClick={() => setShowAddBookingModal(true)}
              className="px-3.5 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <Plus className="w-4 h-4" /> Tambah Reservasi
            </button>
            <button 
              onClick={syncAllData}
              className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Sinkronisasi
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-800/90 border border-slate-700/80 p-4 rounded-xl flex items-center gap-3.5">
            <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-xl border border-cyan-500/20">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Reservasi</p>
              <p className="text-xl font-black text-white">{countTotal}</p>
            </div>
          </div>
          <div className="bg-slate-800/90 border border-slate-700/80 p-4 rounded-xl flex items-center gap-3.5">
            <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Terkonfirmasi</p>
              <p className="text-xl font-black text-amber-300">{countConfirmed}</p>
            </div>
          </div>
          <div className="bg-slate-800/90 border border-slate-700/80 p-4 rounded-xl flex items-center gap-3.5">
            <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Sudah Check-In</p>
              <p className="text-xl font-black text-blue-300">{countCheckedIn}</p>
            </div>
          </div>
          <div className="bg-slate-800/90 border border-slate-700/80 p-4 rounded-xl flex items-center gap-3.5">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Selesai Poli</p>
              <p className="text-xl font-black text-emerald-300">{countDone}</p>
            </div>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari pasien, No. RM, kode booking, atau poliklinik..."
              value={bookingSearch}
              onChange={(e) => setBookingSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Status:</span>
            <select
              value={bookingStatusFilter}
              onChange={(e) => setBookingStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">Semua Status</option>
              <option value="Terkonfirmasi">Terkonfirmasi</option>
              <option value="Check-In">Check-In</option>
              <option value="Selesai">Selesai</option>
              <option value="Batal">Batal</option>
            </select>
          </div>
        </div>

        {/* Table of Bookings */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-700 flex justify-between items-center">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cyan-400" />
              Daftar Reservasi & Antrian Poliklinik ({filteredBookings.length} Data)
            </h3>
            <span className="text-[11px] text-slate-400">
              Hari ini: {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/60 border-b border-slate-700 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3.5">Kode & Waktu</th>
                  <th className="p-3.5">Pasien (No. RM)</th>
                  <th className="p-3.5">Poliklinik Tujuan</th>
                  <th className="p-3.5">Dokter DPJP</th>
                  <th className="p-3.5">Penjamin</th>
                  <th className="p-3.5">Keluhan</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Aksi Terintegrasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60 text-slate-200">
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-slate-400 text-xs">
                      Tidak ada data booking atau reservasi yang sesuai filter.
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((b) => {
                    const matchedPatient = pasien.find(p => p.no_rm === b.no_rm || String(p.id) === String(b.pasien_id));
                    return (
                      <tr key={b.id} className="hover:bg-slate-700/30 transition-colors">
                        <td className="p-3.5">
                          <div className="font-mono font-bold text-cyan-400">{b.booking_code}</div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3 text-slate-400" /> {b.jam_estimasi || '08:30 WIB'}
                          </div>
                        </td>
                        <td className="p-3.5">
                          <div className="font-bold text-white flex items-center gap-1.5">
                            <UserCircle className="w-3.5 h-3.5 text-slate-400" />
                            {b.nama_pasien}
                          </div>
                          <div className="text-[11px] font-mono text-slate-400">{b.no_rm}</div>
                        </td>
                        <td className="p-3.5">
                          <span className="font-semibold text-slate-200">{b.poli_tujuan}</span>
                        </td>
                        <td className="p-3.5">
                          <span className="text-slate-300">{b.dokter_dpjp}</span>
                        </td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded text-[11px] bg-slate-900 border border-slate-700 text-slate-300 font-semibold">
                            {b.penjamin}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <span className="text-[11px] text-slate-400 line-clamp-1 max-w-[160px]">{b.keluhan || '-'}</span>
                        </td>
                        <td className="p-3.5">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                            b.status_booking === 'Check-In'
                              ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                              : b.status_booking === 'Terkonfirmasi'
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                              : b.status_booking === 'Selesai'
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                              : 'bg-slate-700 text-slate-300 border-slate-600'
                          }`}>
                            {b.status_booking}
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {b.status_booking !== 'Check-In' && b.status_booking !== 'Selesai' && (
                              <button
                                onClick={() => handleCheckInBooking(b)}
                                className="px-2.5 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all shadow-sm cursor-pointer"
                                title="Check-In ke Antrian Poliklinik Hari Ini"
                              >
                                <CheckCircle className="w-3.5 h-3.5" /> Check-In Poli
                              </button>
                            )}

                            {matchedPatient && (
                              <button
                                onClick={() => {
                                  setSelectedPatientForModal(matchedPatient);
                                  setShowPatient360Modal(true);
                                }}
                                className="px-2.5 py-1 bg-purple-950/70 hover:bg-purple-900/80 text-purple-300 border border-purple-700/60 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer"
                                title="Lihat Rekam Medis Elektronik (RME 360°)"
                              >
                                <FileText className="w-3.5 h-3.5" /> RME 360°
                              </button>
                            )}

                            {b.status_booking !== 'Batal' && b.status_booking !== 'Selesai' && (
                              <button
                                onClick={() => {
                                  setBookingList(prev => prev.map(item => item.id === b.id ? { ...item, status_booking: 'Batal' } : item));
                                  toast.info(`Booking ${b.booking_code} telah dibatalkan.`);
                                }}
                                className="p-1 text-slate-400 hover:text-rose-400 rounded-md transition-colors"
                                title="Batalkan Reservasi"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // 3. TAB: JADWAL DOKTER & DOKTER RALAN
  if (activeTab === 'Dokter Ralan' || activeTab === 'Jadwal Dokter' || activeTab === 'Dokter Rawat Jalan') {
    return (
      <div className="p-6 h-full space-y-6">
        {/* Header Bar */}
        <div className="flex flex-wrap justify-between items-center gap-4 bg-slate-800 p-5 rounded-2xl border border-slate-700 shadow-sm">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Stethoscope className="w-6 h-6 text-cyan-400" />
              Direktori & Jadwal Praktik Dokter Poliklinik (24 Poliklinik)
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Informasi jadwal shift, kuota pasien, ruangan poliklinik, dan status bertugas hari ini.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-lg text-cyan-300 font-bold">
              Total: {filteredDoctors.length} Dokter
            </span>
            <button 
              onClick={syncAllData}
              className="px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Sync Data
            </button>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-slate-800/80 p-4 rounded-xl border border-slate-700">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari dokter, spesialisasi, atau poli..."
              value={docSearch}
              onChange={(e) => setDocSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <select
              value={docDayFilter}
              onChange={(e) => setDocDayFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">Semua Hari Praktik</option>
              <option value="Senin">Hari Senin</option>
              <option value="Selasa">Hari Selasa</option>
              <option value="Rabu">Hari Rabu</option>
              <option value="Kamis">Hari Kamis</option>
              <option value="Jumat">Hari Jumat</option>
              <option value="Sabtu">Hari Sabtu</option>
              <option value="Setiap Hari">Setiap Hari (24 Jam)</option>
            </select>
          </div>

          <div>
            <select
              value={docShiftFilter}
              onChange={(e) => setDocShiftFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">Semua Sesi Shift</option>
              <option value="Pagi">Sesi 1 Pagi (08:00 - 12:30)</option>
              <option value="Siang">Sesi 2 Siang (13:00 - 17:00)</option>
              <option value="Shift Pagi">Shift Pagi IGD (07:00 - 14:00)</option>
              <option value="Shift Siang">Shift Siang IGD (14:00 - 21:00)</option>
            </select>
          </div>

          <div>
            <select
              value={docStatusFilter}
              onChange={(e) => setDocStatusFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">Semua Status Jaga</option>
              <option value="Sedang Berpraktik">Sedang Berpraktik</option>
              <option value="Sesi Berikutnya">Sesi Berikutnya</option>
              <option value="Tindakan OK">Tindakan Kamar Operasi</option>
              <option value="Visite Bangsal">Visite Rawat Inap</option>
            </select>
          </div>
        </div>

        {/* Doctor Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDoctors.map((d) => {
            const quota = d.kuota || 30;
            const served = d.pasien_terlayani || 0;
            const percent = Math.min(Math.round((served / quota) * 100), 100);

            return (
              <div 
                key={d.id} 
                className="bg-slate-800/90 border border-slate-700 hover:border-cyan-500/60 p-5 rounded-2xl transition-all shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-xs font-bold text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-2.5 py-1 rounded-md">
                      {d.poli_nama || d.spesialisasi}
                    </span>
                    <span className={`text-[11px] px-2 py-0.5 rounded font-semibold border ${
                      d.status_jaga === 'Sedang Berpraktik' 
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                        : d.status_jaga === 'Tindakan OK'
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                        : d.status_jaga === 'Visite Bangsal'
                        ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                        : 'bg-slate-700 text-slate-300 border-slate-600'
                    }`}>
                      {d.status_jaga || 'Aktif'}
                    </span>
                  </div>

                  <h3 className="font-bold text-white text-base mt-1">{d.nama}</h3>
                  {d.subspesialis && (
                    <p className="text-xs text-cyan-300/80 font-medium mt-0.5">Subsp: {d.subspesialis}</p>
                  )}
                  <p className="text-[11px] text-slate-400 mt-0.5 font-mono">SIP: {d.sip || d.nip || d.id}</p>

                  <div className="mt-3.5 text-xs text-slate-300 space-y-2 bg-slate-900/60 p-3 rounded-xl border border-slate-700/60">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span>Jam Praktik: <strong className="text-slate-200">{d.jam || d.jadwal || '08:00 - 12:30 WIB'}</strong></span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <Calendar className="w-4 h-4 text-indigo-400 shrink-0" />
                      <span>Hari: <strong className="text-slate-200">{d.hari || 'Senin - Jumat'}</strong></span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <UserCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Lokasi: <strong className="text-slate-200">{d.ruangan || 'Poliklinik Terpadu'}</strong></span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <Activity className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>Shift: <strong className="text-slate-200">{d.shift || 'Sesi 1 Pagi'}</strong></span>
                    </div>
                  </div>

                  {/* Quota Progress Bar */}
                  <div className="mt-3 bg-slate-900/40 p-2.5 rounded-lg border border-slate-800">
                    <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                      <span>Kuota Pasien</span>
                      <span className="font-bold text-slate-200">{served} / {quota} Pasien ({percent}%)</span>
                    </div>
                    <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all ${
                          percent >= 90 ? 'bg-rose-500' : percent >= 60 ? 'bg-amber-500' : 'bg-cyan-500'
                        }`} 
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-700/60 flex justify-between items-center text-xs">
                  <span className="text-[11px] text-slate-400 font-mono">{d.kontak || '0812-3456-7890'}</span>
                  <button 
                    onClick={() => {
                      setSelectedPoliFilter(d.poli_id);
                      toast.success(`Membuka pelayanan ${d.poli_nama || d.spesialisasi}`);
                    }}
                    className="text-xs text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-800/80 px-2.5 py-1.5 rounded-lg transition-all"
                  >
                    Pelayanan Poli →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // 4. TAB: DAFTAR POLIKLINIK (Catalog of 24 Poliklinik or Specific Poli Workspace)
  if (activeTab === 'Daftar Poliklinik' && selectedPoliFilter === 'ALL') {
    return (
      <div className="p-6 h-full space-y-8">
        <div className="flex flex-wrap justify-between items-center gap-4 bg-slate-800 p-6 rounded-2xl border border-slate-700">
          <div>
            <h2 className="text-2xl font-black text-white flex items-center gap-3">
              <Stethoscope className="w-7 h-7 text-cyan-400" />
              Katalog Lengkap 24 Poliklinik Klinik
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Pilih poliklinik di bawah ini untuk melihat daftar pasien aktif dan membuka form rekam medis / SOAP terpadu.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setShowAddPatientModal(true);
              }}
              className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-950/40"
            >
              <UserPlus className="w-4 h-4" /> Daftarkan Pasien ke Poli
            </button>
          </div>
        </div>

        {Object.entries(poliByCategory).map(([kategoriName, poliItems]) => (
          <div key={kategoriName} className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-700 pb-2">
              <h3 className="text-lg font-bold text-cyan-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                {kategoriName} ({poliItems.length} Poliklinik)
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {poliItems.map(item => {
                const poliQueues = kunjungan.filter(k => k.poli_id === item.id);
                const queueActiveCount = poliQueues.filter(k => k.status !== 'Selesai' && k.status !== 'Batal').length;
                const docCount = dokter.filter(d => d.poli_id === item.id).length || 1;

                return (
                  <div 
                    key={item.id}
                    onClick={() => {
                      setSelectedPoliFilter(item.id);
                      toast.success(`Membuka Poliklinik: ${item.nama}`);
                    }}
                    className="p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden bg-slate-800/90 border-slate-700 hover:border-cyan-400 hover:bg-slate-800 hover:shadow-xl hover:shadow-cyan-950/40 group"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-3xl p-2 bg-slate-900 rounded-xl border border-slate-700/60 group-hover:scale-110 transition-transform">
                          {item.icon || '🩺'}
                        </span>
                        <span className="text-xs font-mono font-bold bg-slate-900 border border-slate-700 px-2.5 py-1 rounded-lg text-cyan-300">
                          {item.kode}
                        </span>
                      </div>
                      <h4 className="font-bold text-white text-base leading-snug mb-1 group-hover:text-cyan-300 transition-colors">
                        {item.nama}
                      </h4>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{item.deskripsi}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-slate-300 font-semibold">
                          Antrian: <strong className="text-amber-400 font-bold">{poliQueues.length} Pasien</strong>
                        </span>
                      </div>
                      <button className="text-xs font-bold text-cyan-400 group-hover:text-cyan-300 flex items-center gap-1">
                        Buka Poli →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // 5. MAIN WORKSPACE: POLIKLINIK DETAIL & CLINICAL EXAMINATION FORM (SOAP & PATIENT360 & AI SCRIBE)
  return (
    <div className="p-6 h-full flex flex-col space-y-6">
      {/* Top Header & Poliklinik Selector Bar */}
      <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 shadow-md flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          {selectedPoliFilter !== 'ALL' && (
            <button
              onClick={() => {
                setSelectedPoliFilter('ALL');
                toast.info('Kembali ke katalog semua poliklinik');
              }}
              className="p-2.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl transition-all flex items-center gap-1.5 text-xs font-bold"
              title="Kembali ke semua poliklinik"
            >
              <ArrowLeft className="w-4 h-4" /> Kembali
            </button>
          )}

          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{currentPoli?.icon || '🩺'}</span>
              <h2 className="text-xl font-bold text-white">
                {currentPoli ? currentPoli.nama : 'Poliklinik Terpadu & Rekam Medis (EMR)'}
              </h2>
              {currentPoli && (
                <span className="text-xs bg-cyan-900/80 border border-cyan-700 text-cyan-300 px-2.5 py-0.5 rounded-full font-mono font-bold">
                  {currentPoli.kode}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {currentPoli 
                ? `${currentPoli.deskripsi} • DPJP: ${activeDoctor?.nama || 'dr. Spesialis'}`
                : 'Pemeriksaan klinis real-time, form SOAP terstandar, AI Scribe, dan Rekam Medis Elektronik 360°'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Quick Select Poliklinik Dropdown */}
          <div className="flex items-center gap-2 bg-slate-900 px-3 py-2 rounded-xl border border-slate-700">
            <Stethoscope className="w-4 h-4 text-cyan-400" />
            <select
              value={selectedPoliFilter}
              onChange={(e) => {
                setSelectedPoliFilter(e.target.value);
                const pObj = allPoliList.find(x => x.id === e.target.value);
                if (pObj) toast.info(`Poliklinik dialihkan: ${pObj.nama}`);
              }}
              className="bg-transparent text-xs font-bold text-white outline-none cursor-pointer max-w-[200px]"
            >
              <option value="ALL" className="bg-slate-900 text-white">Semua Poliklinik (24 Poli)</option>
              <optgroup label="Spesialis Utama" className="bg-slate-900 text-slate-300">
                {poliByCategory['Spesialis Utama']?.map(p => (
                  <option key={p.id} value={p.id} className="bg-slate-900 text-white">{p.icon} {p.nama}</option>
                ))}
              </optgroup>
              <optgroup label="Subspesialis" className="bg-slate-900 text-slate-300">
                {poliByCategory['Subspesialis']?.map(p => (
                  <option key={p.id} value={p.id} className="bg-slate-900 text-white">{p.icon} {p.nama}</option>
                ))}
              </optgroup>
              <optgroup label="Penunjang & Khusus" className="bg-slate-900 text-slate-300">
                {poliByCategory['Penunjang & Khusus']?.map(p => (
                  <option key={p.id} value={p.id} className="bg-slate-900 text-white">{p.icon} {p.nama}</option>
                ))}
              </optgroup>
              <optgroup label="Umum & IGD" className="bg-slate-900 text-slate-300">
                {poliByCategory['Umum & Kegawatdaruratan']?.map(p => (
                  <option key={p.id} value={p.id} className="bg-slate-900 text-white">{p.icon} {p.nama}</option>
                ))}
              </optgroup>
            </select>
          </div>

          <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-700">
            <button
              onClick={() => setRightPanelView('display')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                rightPanelView === 'display' || !activeVisit
                  ? 'bg-sky-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Tv className="w-3.5 h-3.5" /> Display Antrean TV
            </button>
            {activeVisit && (
              <button
                onClick={() => setRightPanelView('exam')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                  rightPanelView === 'exam'
                    ? 'bg-cyan-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Stethoscope className="w-3.5 h-3.5" /> Periksa ({activePatient?.nama?.split(' ')[0] || 'Pasien'})
              </button>
            )}
          </div>

          <button
            onClick={() => setShowAddPatientModal(true)}
            className="px-3.5 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-cyan-950/40 transition-all"
          >
            <UserPlus className="w-3.5 h-3.5" /> + Pasien Baru
          </button>

          <button
            onClick={() => handleLoadDemoScribe('dalam')}
            className="px-3 py-2 bg-purple-950/60 hover:bg-purple-900/70 border border-purple-700/60 text-purple-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
            title="Muat demo suara AI Scribe kasus Penyakit Dalam"
          >
            <Sparkles className="w-3.5 h-3.5" /> Demo AI
          </button>
        </div>
      </div>

      {/* Main Dual Workspace: Queue List (Left) + SOAP & Rekam Medis Form (Right) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[650px]">
        {/* Left Column (4 cols): Queue & Patient List for Poliklinik */}
        <div className="lg:col-span-4 bg-slate-800 rounded-2xl border border-slate-700 flex flex-col overflow-hidden shadow-lg">
          <div className="p-4 border-b border-slate-700 bg-slate-800/90 space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-cyan-400" />
                <h3 className="font-bold text-white text-sm">
                  Daftar Pasien {currentPoli ? currentPoli.kode : 'Poli'}
                </h3>
              </div>
              <span className="text-xs bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2.5 py-0.5 rounded-full font-bold">
                {filteredQueues.length} Pasien
              </span>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari nama pasien, No. RM, keluhan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:border-cyan-500 outline-none"
              />
            </div>

            {/* Filter Status Pills */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
              {['ALL', 'Menunggu', 'Panggil', 'Diperiksa', 'Selesai'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all ${
                    statusFilter === st
                      ? 'bg-cyan-600 text-white shadow-sm'
                      : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-700'
                  }`}
                >
                  {st === 'ALL' ? 'Semua' : st}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2.5 custom-scrollbar">
            {filteredQueues.length === 0 ? (
              <div className="text-center py-16 px-4">
                <Users className="w-12 h-12 mx-auto text-slate-600 mb-3" />
                <p className="text-sm font-semibold text-slate-400">Tidak ada antrian pasien</p>
                <p className="text-xs text-slate-500 mt-1">Klik tombol "+ Pasien Baru" di atas untuk mendaftarkan pasien ke poli ini.</p>
                <button
                  onClick={() => setShowAddPatientModal(true)}
                  className="mt-4 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-xs font-bold"
                >
                  + Tambah Pasien Sekarang
                </button>
              </div>
            ) : (
              filteredQueues.map((q) => {
                const p = pasien.find(x => String(x.id) === String(q.pasien_id));
                const poliObj = allPoliList.find(pl => pl.id === q.poli_id);
                const isSelected = activeQueue === q.id;

                return (
                  <div
                    key={q.id}
                    onClick={() => {
                      setActiveQueue(q.id);
                      setRightPanelView('exam');
                      toast.info(`Memilih pasien: ${p?.nama || q.nomor_antrian}`);
                    }}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-r from-cyan-950/60 to-slate-800 border-cyan-400 shadow-md ring-1 ring-cyan-500/50'
                        : 'bg-slate-900/70 border-slate-700/80 hover:border-slate-500 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-cyan-400 text-sm bg-slate-950 px-2 py-0.5 rounded border border-cyan-800/60">
                          {q.nomor_antrian}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">RM: {p?.no_rm || '-'}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        q.status === 'Diperiksa' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 animate-pulse' :
                        q.status === 'Panggil' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                        q.status === 'Selesai' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                        'bg-slate-700 text-slate-300'
                      }`}>
                        {q.status}
                      </span>
                    </div>

                    <h4 className="font-bold text-white text-sm mt-1">{p?.nama || 'Pasien Tanpa Nama'}</h4>
                    
                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400 mt-1">
                      <span>{p?.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</span>
                      <span>•</span>
                      <span className="text-emerald-400 font-medium">{p?.penjamin || 'BPJS'}</span>
                      <span>•</span>
                      <span className="text-cyan-300">{poliObj?.nama || q.poli_id}</span>
                    </div>

                    {q.keluhan_utama && (
                      <p className="text-[11px] text-slate-300 bg-slate-950/70 p-2 rounded-lg mt-2 border border-slate-800 line-clamp-1 italic">
                        "{q.keluhan_utama}"
                      </p>
                    )}

                    <div className="mt-3 flex gap-2 pt-2 border-t border-slate-800">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveQueue(q.id);
                          setRightPanelView('exam');
                          updateKunjunganStatus(q.id, 'Diperiksa');
                          toast.success(`Memulai pemeriksaan untuk ${p?.nama || q.nomor_antrian}`);
                        }}
                        className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1"
                      >
                        <Stethoscope className="w-3.5 h-3.5" /> Periksa (SOAP)
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPatientForModal(p || { id: q.pasien_id, nama: 'Pasien' });
                          setShowPatient360Modal(true);
                        }}
                        className="px-2.5 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-xs font-bold transition-colors"
                        title="Buka Rekam Medis Lengkap 360"
                      >
                        <FileText className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateKunjunganStatus(q.id, 'Panggil');
                          const nomor = q.nomor_antrian || 'A-001';
                          const poliNama = poliObj?.nama || 'Poliklinik';
                          const nama = p?.nama || 'Pasien';
                          if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                            window.speechSynthesis.cancel();
                            const utt = new SpeechSynthesisUtterance(`Nomor antrean ${nomor.replace('-', ' ')}, atas nama ${nama}, silakan menuju ${poliNama}`);
                            utt.lang = 'id-ID';
                            window.speechSynthesis.speak(utt);
                          }
                          toast.success(`🔊 Memanggil antrian ${nomor} - ${nama}`);
                        }}
                        className="px-2.5 py-1.5 bg-slate-700 hover:bg-slate-600 text-amber-300 rounded-lg text-xs font-bold transition-colors"
                        title="Panggil Antrian"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column (8 cols): Active Patient Medical Records (EMR) / Form SOAP & Patient360 OR Display Antrean TV */}
        <div className="lg:col-span-8 flex flex-col space-y-4">
          {activeVisit && activePatient && rightPanelView === 'exam' ? (
            <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-xl flex flex-col flex-1 overflow-hidden">
              {/* Header Info Pasien & EMR Switcher */}
              <div className="p-5 bg-gradient-to-r from-slate-800 via-slate-800 to-cyan-950/40 border-b border-slate-700 flex flex-wrap justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center text-2xl text-cyan-300 font-black shadow-inner">
                    {activePatient.nama ? activePatient.nama.charAt(0) : 'P'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h3 className="text-xl font-bold text-white">{activePatient.nama}</h3>
                      <span className="text-xs bg-cyan-900/60 border border-cyan-700 text-cyan-300 px-2.5 py-0.5 rounded-lg font-mono font-bold">
                        {activePatient.no_rm || 'RM-000000'}
                      </span>
                      <span className="text-xs bg-slate-900 text-amber-400 border border-slate-700 px-2 py-0.5 rounded font-mono font-bold">
                        No. Antrian: {activeVisit.nomor_antrian}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                      <span>{activePatient.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</span>
                      <span>•</span>
                      <span>NIK: {activePatient.nik || '-'}</span>
                      <span>•</span>
                      <span>Penjamin: <strong className="text-slate-200">{activePatient.penjamin || 'BPJS'}</strong></span>
                      <span>•</span>
                      <span>Poli: <strong className="text-cyan-400">{activePoliObj?.nama || activeVisit.poli_id}</strong></span>
                    </div>
                  </div>
                </div>

                {/* View Mode Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setRightPanelView('display')}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all bg-sky-950/80 hover:bg-sky-900 border border-sky-700/60 text-sky-300 shadow-sm"
                    title="Buka Layar Display Antrean TV"
                  >
                    <Tv className="w-3.5 h-3.5 text-sky-400" /> Display Antrean TV
                  </button>

                  <button
                    onClick={() => setActiveExamTab('soap')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                      activeExamTab === 'soap'
                        ? 'bg-cyan-600 text-white shadow-md'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    <Stethoscope className="w-3.5 h-3.5" /> Form SOAP & Resep
                  </button>

                  <button
                    onClick={() => setActiveExamTab('patient360')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                      activeExamTab === 'patient360'
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" /> Rekam Medis 360°
                  </button>

                  <button
                    onClick={() => toggleRecording('all')}
                    className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-lg ${
                      isRecording
                        ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
                        : 'bg-pink-600 hover:bg-pink-700 text-white'
                    }`}
                  >
                    {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                    {isRecording ? 'Stop Voice' : 'AI Scribe'}
                  </button>
                </div>
              </div>

              {/* Sub-view 1: Full Patient360 EMR Embed */}
              {activeExamTab === 'patient360' && (
                <div className="p-4 overflow-y-auto flex-1 custom-scrollbar">
                  <Patient360 patient={activePatient} />
                </div>
              )}

              {/* Sub-view 2: Standard SOAP & Clinical Examination */}
              {activeExamTab === 'soap' && (
                <div className="flex flex-col flex-1 overflow-hidden">
                  {/* AI Voice Transcribe Strip */}
                  <div className="bg-purple-950/30 border-b border-purple-900/40 p-3.5">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                        AI Voice Scribe & Natural Language Parser
                      </span>
                      {transcript && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleAnalyzeTranscript()}
                            disabled={isProcessingAI}
                            className="px-3 py-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1"
                          >
                            {isProcessingAI ? 'Menganalisis...' : '🤖 Analisis AI'}
                          </button>
                          <button
                            onClick={() => { setTranscript(''); setAiAnalysisResult(null); }}
                            className="px-2.5 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs rounded-lg"
                          >
                            Reset
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="p-2.5 bg-slate-900/90 border border-slate-700/80 rounded-xl min-h-[50px] max-h-[90px] overflow-y-auto text-xs text-slate-200">
                      {transcript ? (
                        <p className="leading-relaxed font-sans">{transcript}</p>
                      ) : (
                        <p className="text-slate-500 italic">
                          Klik tombol "AI Scribe" untuk merekam dikte suara pemeriksaan dokter secara otomatis.
                        </p>
                      )}
                    </div>

                    {aiAnalysisResult && (
                      <div className="mt-2.5 p-3 bg-emerald-950/30 border border-emerald-800/50 rounded-xl flex justify-between items-center">
                        <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                          <CheckCircle className="w-4 h-4 text-emerald-400" />
                          Hasil AI siap disinkronkan ke SOAP (Confidence: {aiAnalysisResult.confidence}%)
                        </span>
                        <button
                          onClick={handleApplyAIToSOAP}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm"
                        >
                          ✓ Terapkan ke Form SOAP
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Form SOAP Content */}
                  <div id="poli-soap-print-area" className="p-5 overflow-y-auto flex-1 space-y-5 custom-scrollbar">
                    {/* Tanda Vital Strip */}
                    <div className="bg-slate-900/70 p-4 rounded-xl border border-slate-700 space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                          <Activity className="w-4 h-4 text-cyan-400" />
                          Tanda Vital Pasien (Vital Signs)
                        </label>
                        <span className="text-[11px] text-slate-400 font-mono">
                          IMT: <strong className="text-white">{soapData.vitalSigns.imt}</strong> kg/m² ({
                            parseFloat(soapData.vitalSigns.imt) < 18.5 ? 'Kurus' :
                            parseFloat(soapData.vitalSigns.imt) < 25 ? 'Normal' :
                            parseFloat(soapData.vitalSigns.imt) < 30 ? 'Overweight' : 'Obesitas'
                          })
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 block mb-1">TD (mmHg)</label>
                          <input
                            type="text"
                            value={soapData.vitalSigns.td}
                            onChange={(e) => handleVitalChange('td', e.target.value)}
                            className="w-full p-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white font-mono outline-none focus:border-cyan-500"
                            placeholder="120/80"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 block mb-1">Nadi (x/mnt)</label>
                          <input
                            type="text"
                            value={soapData.vitalSigns.nadi}
                            onChange={(e) => handleVitalChange('nadi', e.target.value)}
                            className="w-full p-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white font-mono outline-none focus:border-cyan-500"
                            placeholder="82"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 block mb-1">Suhu (°C)</label>
                          <input
                            type="text"
                            value={soapData.vitalSigns.suhu}
                            onChange={(e) => handleVitalChange('suhu', e.target.value)}
                            className="w-full p-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white font-mono outline-none focus:border-cyan-500"
                            placeholder="36.7"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 block mb-1">RR (x/mnt)</label>
                          <input
                            type="text"
                            value={soapData.vitalSigns.rr}
                            onChange={(e) => handleVitalChange('rr', e.target.value)}
                            className="w-full p-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white font-mono outline-none focus:border-cyan-500"
                            placeholder="18"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 block mb-1">SpO2 (%)</label>
                          <input
                            type="text"
                            value={soapData.vitalSigns.spo2}
                            onChange={(e) => handleVitalChange('spo2', e.target.value)}
                            className="w-full p-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white font-mono outline-none focus:border-cyan-500"
                            placeholder="99"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 block mb-1">TB (cm)</label>
                          <input
                            type="text"
                            value={soapData.vitalSigns.tb}
                            onChange={(e) => handleVitalChange('tb', e.target.value)}
                            className="w-full p-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white font-mono outline-none focus:border-cyan-500"
                            placeholder="165"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 block mb-1">BB (kg)</label>
                          <input
                            type="text"
                            value={soapData.vitalSigns.bb}
                            onChange={(e) => handleVitalChange('bb', e.target.value)}
                            className="w-full p-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white font-mono outline-none focus:border-cyan-500"
                            placeholder="62"
                          />
                        </div>
                      </div>
                    </div>

                    {/* S - Subjective */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                          <span className="w-5 h-5 rounded-md bg-blue-600/30 text-blue-400 flex items-center justify-center font-mono">S</span>
                          Subjective (Anamnesis & Keluhan Utama)
                        </label>
                        <button
                          onClick={() => toggleRecording('s')}
                          className={`text-[11px] font-bold px-2 py-0.5 rounded flex items-center gap-1 ${
                            isRecording && activeAudioTarget === 's' ? 'bg-red-500 text-white' : 'text-purple-400 hover:text-purple-300'
                          }`}
                        >
                          <Mic className="w-3 h-3" /> Voice Scribe S
                        </button>
                      </div>
                      <textarea
                        rows={2}
                        value={soapData.s}
                        onChange={(e) => setSoapData({ ...soapData, s: e.target.value })}
                        placeholder="Keluhan utama dan riwayat penyakit sekarang..."
                        className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:border-cyan-500 outline-none leading-relaxed"
                      />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        <input
                          type="text"
                          value={soapData.rpd}
                          onChange={(e) => setSoapData({ ...soapData, rpd: e.target.value })}
                          placeholder="Riwayat Penyakit Dahulu (RPD)..."
                          className="p-2.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 outline-none"
                        />
                        <input
                          type="text"
                          value={soapData.alergi}
                          onChange={(e) => setSoapData({ ...soapData, alergi: e.target.value })}
                          placeholder="Riwayat Alergi Obat / Makanan..."
                          className="p-2.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-amber-300 placeholder-slate-500 outline-none"
                        />
                      </div>
                    </div>

                    {/* O - Objective */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                          <span className="w-5 h-5 rounded-md bg-emerald-600/30 text-emerald-400 flex items-center justify-center font-mono">O</span>
                          Objective (Pemeriksaan Fisik & Penunjang)
                        </label>
                        <button
                          onClick={() => toggleRecording('o')}
                          className={`text-[11px] font-bold px-2 py-0.5 rounded flex items-center gap-1 ${
                            isRecording && activeAudioTarget === 'o' ? 'bg-red-500 text-white' : 'text-purple-400 hover:text-purple-300'
                          }`}
                        >
                          <Mic className="w-3 h-3" /> Voice Scribe O
                        </button>
                      </div>
                      <textarea
                        rows={2}
                        value={soapData.o}
                        onChange={(e) => setSoapData({ ...soapData, o: e.target.value })}
                        placeholder="Pemeriksaan fisik kepala, leher, thorax, abdomen, ekstremitas, status lokalis..."
                        className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:border-cyan-500 outline-none leading-relaxed"
                      />
                    </div>

                    {/* A - Assessment */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                          <span className="w-5 h-5 rounded-md bg-amber-600/30 text-amber-400 flex items-center justify-center font-mono">A</span>
                          Assessment (Diagnosis ICD-10 Klinis)
                        </label>
                        <span className="text-[11px] text-cyan-400 font-mono">ICD-10 Terpadu BPJS / SatuSehat</span>
                      </div>
                      <div className="grid grid-cols-12 gap-2">
                        <div className="col-span-12 sm:col-span-8">
                          <input
                            type="text"
                            value={soapData.a}
                            onChange={(e) => setSoapData({ ...soapData, a: e.target.value })}
                            placeholder="Diagnosis Primer (Cth: Hipertensi Primer / DM Tipe 2)"
                            className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:border-cyan-500 outline-none"
                          />
                        </div>
                        <div className="col-span-12 sm:col-span-4">
                          <input
                            type="text"
                            value={soapData.icd10}
                            onChange={(e) => setSoapData({ ...soapData, icd10: e.target.value })}
                            placeholder="Kode ICD-10 (Cth: I10, E11.9)"
                            className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-xs text-cyan-300 font-mono placeholder-slate-500 focus:border-cyan-500 outline-none font-bold"
                          />
                        </div>
                      </div>
                      <input
                        type="text"
                        value={soapData.diagnosis_sekunder}
                        onChange={(e) => setSoapData({ ...soapData, diagnosis_sekunder: e.target.value })}
                        placeholder="Diagnosis Sekunder / Komorbiditas (opsional)..."
                        className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-300 placeholder-slate-500 outline-none"
                      />
                    </div>

                    {/* P - Plan & Prescriptions */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                          <span className="w-5 h-5 rounded-md bg-purple-600/30 text-purple-400 flex items-center justify-center font-mono">P</span>
                          Plan (Terapi, E-Prescribing & Edukasi)
                        </label>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={soapData.tindakan_icd9}
                          onChange={(e) => setSoapData({ ...soapData, tindakan_icd9: e.target.value })}
                          placeholder="Tindakan Medis / ICD-9-CM (Cth: 89.52 EKG, Nebulisasi)..."
                          className="p-2.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 outline-none"
                        />
                        <input
                          type="text"
                          value={soapData.kontrol}
                          onChange={(e) => setSoapData({ ...soapData, kontrol: e.target.value })}
                          placeholder="Jadwal Kontrol Ulang..."
                          className="p-2.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 outline-none"
                        />
                      </div>

                      {/* E-Prescribing Table & Add Row */}
                      <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-700 space-y-3">
                        <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                          <Pill className="w-3.5 h-3.5 text-cyan-400" />
                          Resep Elektronik Poliklinik (E-Prescription)
                        </span>

                        <div className="grid grid-cols-12 gap-2 items-end">
                          <div className="col-span-12 sm:col-span-5">
                            <label className="text-[10px] font-semibold text-slate-400 mb-1 block">Nama Obat & Sediaan</label>
                            <input
                              type="text"
                              placeholder="Cth: Amlodipine 10mg, Metformin..."
                              value={newDrug.name}
                              onChange={(e) => setNewDrug({ ...newDrug, name: e.target.value })}
                              className="w-full p-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white outline-none focus:border-cyan-500"
                            />
                          </div>
                          <div className="col-span-6 sm:col-span-2">
                            <label className="text-[10px] font-semibold text-slate-400 mb-1 block">Jumlah</label>
                            <input
                              type="text"
                              placeholder="10 Tab"
                              value={newDrug.qty}
                              onChange={(e) => setNewDrug({ ...newDrug, qty: e.target.value })}
                              className="w-full p-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white outline-none focus:border-cyan-500"
                            />
                          </div>
                          <div className="col-span-6 sm:col-span-3">
                            <label className="text-[10px] font-semibold text-slate-400 mb-1 block">Aturan Pakai</label>
                            <input
                              type="text"
                              placeholder="1 x 1 tab malam"
                              value={newDrug.rules}
                              onChange={(e) => setNewDrug({ ...newDrug, rules: e.target.value })}
                              className="w-full p-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white outline-none focus:border-cyan-500"
                            />
                          </div>
                          <div className="col-span-12 sm:col-span-2">
                            <button
                              type="button"
                              onClick={handleAddDrug}
                              className="w-full py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1"
                            >
                              <Plus className="w-3.5 h-3.5" /> Tambah
                            </button>
                          </div>
                        </div>

                        {prescriptions.length > 0 && (
                          <div className="space-y-1.5 pt-2 border-t border-slate-800">
                            {prescriptions.map((d, i) => (
                              <div key={i} className="flex justify-between items-center p-2 bg-slate-800/90 rounded-lg border border-slate-700/60 text-xs">
                                <div className="flex items-center gap-2">
                                  <Pill className="w-3.5 h-3.5 text-purple-400" />
                                  <span className="font-bold text-white">{d.name}</span>
                                  <span className="text-slate-400">({d.qty})</span>
                                  <span className="text-cyan-300 font-mono text-[11px]">{d.rules}</span>
                                </div>
                                <button
                                  onClick={() => setPrescriptions(prev => prev.filter((_, idx) => idx !== i))}
                                  className="text-rose-400 hover:text-rose-300 p-1"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Bottom Action Bar */}
                  <div className="p-4 bg-slate-900 border-t border-slate-700 flex flex-wrap justify-between items-center gap-3">
                    <div className="flex items-center gap-3">
                      <PrintPDFButton
                        documentData={{
                          ...activePatient,
                          poli: currentPoli?.nama || activePatient.poli || 'Poliklinik Penyakit Dalam',
                          unit_pelayanan: currentPoli?.nama || activePatient.poli || 'Poliklinik Penyakit Dalam',
                          anamnesis: soapData.s || 'Pasien kontrol rutin ke poliklinik.',
                          keluhan: soapData.s,
                          catatan_fisik: soapData.o,
                          diagnosis_utama: soapData.a || 'Pemeriksaan Klinis Rutin',
                          icd10_utama: soapData.icd10 || 'Z00.0',
                          diagnosis_sekunder: soapData.diagnosis_sekunder ? [soapData.diagnosis_sekunder] : undefined,
                          tindakan_icd9: soapData.tindakan_icd9,
                          terapi_obat: prescriptions.map(p => ({
                            nama: p.name,
                            dosis: p.qty,
                            aturan: p.rules,
                            jumlah: p.qty,
                            keterangan: 'Oral'
                          })),
                          tanda_vital: {
                            tekananDarah: soapData.vitalSigns.td,
                            nadi: soapData.vitalSigns.nadi,
                            suhu: soapData.vitalSigns.suhu,
                            spo2: soapData.vitalSigns.spo2,
                            rr: soapData.vitalSigns.rr,
                            bb: soapData.vitalSigns.bb,
                            tb: soapData.vitalSigns.tb
                          },
                          edukasi_instruksi: `1. Kontrol kembali ke ${currentPoli?.nama || 'Poliklinik'} pada ${soapData.kontrol}.\n2. Minum obat secara teratur sesuai petunjuk dokter.`
                        }}
                        docType="resume_medis"
                        filename={`Resume_Poli_${activePatient.no_rm}_${activePatient.nama.replace(/\s+/g, '_')}`}
                        label="Cetak Resume Medis (PDF)"
                        className="text-xs py-2 px-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl font-bold flex items-center gap-1.5"
                      />
                      <button
                        onClick={() => {
                          setSelectedPatientForModal(activePatient);
                          setShowPatient360Modal(true);
                        }}
                        className="text-xs py-2 px-3.5 bg-purple-950/70 hover:bg-purple-900/70 text-purple-300 border border-purple-700/60 rounded-xl font-bold flex items-center gap-1.5"
                      >
                        <FileText className="w-3.5 h-3.5" /> Buka RME 360 Lengkap
                      </button>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <button
                        onClick={() => setActiveQueue(null)}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-colors"
                      >
                        Tutup
                      </button>
                      <button
                        onClick={handleSaveSOAP}
                        className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-emerald-950/40 flex items-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" /> Simpan ke Rekam Medis & Selesaikan
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <PoliklinikQueueDisplay
              currentPoli={currentPoli}
              kunjungan={kunjungan}
              pasien={pasien}
              dokter={dokter}
              allPoliList={allPoliList}
              activeQueueId={activeQueue}
              onSelectQueue={(qId) => {
                setActiveQueue(qId);
                setRightPanelView('exam');
              }}
              onCallQueue={(qId, nomor, nama, poliNama) => {
                updateKunjunganStatus(qId, 'Panggil');
              }}
              onStartExam={(qId) => {
                setActiveQueue(qId);
                updateKunjunganStatus(qId, 'Diperiksa');
                setRightPanelView('exam');
                toast.success('Membuka form pemeriksaan klinis (SOAP)');
              }}
              onPoliChange={(poliId) => {
                setSelectedPoliFilter(poliId);
                const pObj = allPoliList.find(x => x.id === poliId);
                if (pObj) toast.info(`Poliklinik dialihkan: ${pObj.nama}`);
              }}
            />
          )}
        </div>
      </div>

      {/* MODAL 1: Tambah Pasien / Pendaftaran Cepat ke Antrian Poliklinik */}
      {showAddPatientModal && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-5 sm:p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in duration-200 my-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-start border-b border-slate-700 pb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-cyan-500/10 rounded-xl border border-cyan-500/20 text-cyan-400">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white leading-tight">
                    Daftarkan Pasien ke Antrean Poliklinik
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Pilih pasien terdaftar atau daftarkan pasien baru langsung ke antrean dan rekam medis.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAddPatientModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Poliklinik & Dokter Tujuan Bar */}
            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">
                    Poliklinik Tujuan <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={newQueueForm.poliId}
                    onChange={(e) => {
                      const selPoliId = e.target.value;
                      const docsForPoli = dokter.filter(d => d.poli_id === selPoliId);
                      setNewQueueForm({
                        ...newQueueForm,
                        poliId: selPoliId,
                        dokterId: docsForPoli.length > 0 ? docsForPoli[0].id : ''
                      });
                    }}
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:border-cyan-500 font-semibold"
                  >
                    {allPoliList.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.kode} - {p.nama}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">
                    Dokter DPJP Poliklinik
                  </label>
                  <select
                    value={newQueueForm.dokterId}
                    onChange={(e) => setNewQueueForm({ ...newQueueForm, dokterId: e.target.value })}
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:border-cyan-500"
                  >
                    {dokter.filter(d => d.poli_id === newQueueForm.poliId).length > 0 ? (
                      dokter.filter(d => d.poli_id === newQueueForm.poliId).map(d => (
                        <option key={d.id} value={d.id}>{d.nama} ({d.spesialisasi})</option>
                      ))
                    ) : (
                      dokter.map(d => (
                        <option key={d.id} value={d.id}>{d.nama} ({d.spesialisasi || d.poli_nama})</option>
                      ))
                    )}
                  </select>
                </div>
              </div>
            </div>

            {/* Mode Switcher: Pasien Terdaftar vs Pasien Baru */}
            <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700">
              <button
                type="button"
                onClick={() => setModalFormMode('registered')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  modalFormMode === 'registered'
                    ? 'bg-cyan-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Search className="w-3.5 h-3.5" /> Pilih Pasien Terdaftar ({pasien.length})
              </button>
              <button
                type="button"
                onClick={() => setModalFormMode('new')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  modalFormMode === 'new'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" /> Input Pasien Baru Lengkap
              </button>
            </div>

            {/* Mode 1: Pasien Terdaftar */}
            {modalFormMode === 'registered' && (
              <div className="space-y-3 text-xs animate-in fade-in duration-150">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">
                    Cari Pasien (Nama, No. RM, NIK, atau No. HP)
                  </label>
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={patientSearchInModal}
                      onChange={(e) => setPatientSearchInModal(e.target.value)}
                      placeholder="Ketik nama atau No. RM pasien..."
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 outline-none focus:border-cyan-500 text-xs"
                    />
                  </div>
                </div>

                <div className="max-h-44 overflow-y-auto space-y-1.5 border border-slate-700/80 rounded-xl p-2 bg-slate-950/60 custom-scrollbar">
                  {pasien
                    .filter(p => {
                      if (!patientSearchInModal) return true;
                      const q = patientSearchInModal.toLowerCase();
                      return (
                        p.nama.toLowerCase().includes(q) ||
                        p.no_rm.toLowerCase().includes(q) ||
                        (p.nik && p.nik.includes(q)) ||
                        (p.no_hp && p.no_hp.includes(q))
                      );
                    })
                    .slice(0, 20)
                    .map(p => {
                      const isSelected = String(p.id) === String(newQueueForm.pasienId);
                      return (
                        <div
                          key={p.id}
                          onClick={() => {
                            setNewQueueForm({
                              ...newQueueForm,
                              pasienId: String(p.id),
                              namaManual: p.nama,
                              noRmManual: p.no_rm,
                              nikManual: p.nik || '',
                              penjamin: p.penjamin || 'BPJS Kesehatan',
                              noHp: p.no_hp || p.telepon || '',
                              alamat: p.alamat || ''
                            });
                          }}
                          className={`p-2.5 rounded-lg flex items-center justify-between cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-cyan-950/70 border border-cyan-500/60 text-white'
                              : 'bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 text-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                              isSelected ? 'border-cyan-400 bg-cyan-500' : 'border-slate-500'
                            }`}>
                              {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                            </div>
                            <div>
                              <div className="font-bold text-white flex items-center gap-1.5">
                                {p.nama}
                                <span className="text-[10px] font-mono text-cyan-300 font-semibold">({p.no_rm})</span>
                              </div>
                              <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                                <span>NIK: {p.nik || '-'}</span>
                                <span>•</span>
                                <span>{p.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</span>
                                <span>•</span>
                                <span className="text-slate-300">{p.penjamin || 'Umum'}</span>
                              </div>
                            </div>
                          </div>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300 font-semibold">
                            {p.status || 'Aktif'}
                          </span>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* Mode 2: Input Pasien Baru Lengkap */}
            {modalFormMode === 'new' && (
              <div className="space-y-3 text-xs animate-in fade-in duration-150">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-300 block mb-1">
                      Nama Lengkap Pasien <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={newQueueForm.namaManual}
                      onChange={(e) => setNewQueueForm({ ...newQueueForm, namaManual: e.target.value })}
                      placeholder="Cth: Muhammad Rizky Pratama..."
                      className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-300 block mb-1">
                      NIK KTP (16 Digit)
                    </label>
                    <input
                      type="text"
                      maxLength={16}
                      value={newQueueForm.nikManual}
                      onChange={(e) => setNewQueueForm({ ...newQueueForm, nikManual: e.target.value })}
                      placeholder="3273..."
                      className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="font-bold text-slate-300 block mb-1">Jenis Kelamin</label>
                    <select
                      value={newQueueForm.jenisKelamin}
                      onChange={(e) => setNewQueueForm({ ...newQueueForm, jenisKelamin: e.target.value as 'L' | 'P' })}
                      className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white outline-none focus:border-cyan-500"
                    >
                      <option value="L">Laki-laki</option>
                      <option value="P">Perempuan</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-slate-300 block mb-1">Tanggal Lahir</label>
                    <input
                      type="date"
                      value={newQueueForm.tanggalLahir}
                      onChange={(e) => setNewQueueForm({ ...newQueueForm, tanggalLahir: e.target.value })}
                      className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-300 block mb-1">No. Rekam Medis</label>
                    <input
                      type="text"
                      value={newQueueForm.noRmManual}
                      onChange={(e) => setNewQueueForm({ ...newQueueForm, noRmManual: e.target.value })}
                      placeholder="Auto-generate"
                      className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-300 block mb-1">No. HP / WhatsApp</label>
                    <input
                      type="text"
                      value={newQueueForm.noHp}
                      onChange={(e) => setNewQueueForm({ ...newQueueForm, noHp: e.target.value })}
                      placeholder="0812-xxxx-xxxx"
                      className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-300 block mb-1">Detail Alamat Jalan (RT/RW/No. Rumah)</label>
                    <input
                      type="text"
                      value={newQueueForm.alamat}
                      onChange={(e) => setNewQueueForm({ ...newQueueForm, alamat: e.target.value })}
                      placeholder="Cth: Jl. Kebon Sirih No. 12 RT 02/05..."
                      className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                {/* Integrated Region Selector (Provinsi, Kota, Kecamatan, Kelurahan) */}
                <WilayahSelector
                  compactMode={true}
                  selectedProvinsi={newQueueForm.provinsi}
                  selectedKota={newQueueForm.kotaKabupaten}
                  selectedKecamatan={newQueueForm.kecamatan}
                  selectedKelurahan={newQueueForm.kelurahan}
                  onSelectWilayah={(w) => {
                    const detailJalan = newQueueForm.alamat.split(',')[0] || '';
                    const fullAddr = [detailJalan.trim(), w.formattedAlamat].filter(Boolean).join(', ');
                    setNewQueueForm({
                      ...newQueueForm,
                      provinsi: w.provinsi,
                      kotaKabupaten: w.kotaKabupaten,
                      kecamatan: w.kecamatan,
                      kelurahan: w.kelurahan,
                      alamat: fullAddr || w.formattedAlamat || newQueueForm.alamat
                    });
                  }}
                />
              </div>
            )}

            {/* Penjamin & Keluhan Section */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
              <div>
                <label className="font-bold text-slate-300 block mb-1">
                  Penjamin Biaya <span className="text-rose-400">*</span>
                </label>
                <select
                  value={newQueueForm.penjamin}
                  onChange={(e) => setNewQueueForm({ ...newQueueForm, penjamin: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white outline-none focus:border-cyan-500 font-semibold"
                >
                  <option value="BPJS Kesehatan">BPJS Kesehatan (JKN)</option>
                  <option value="Umum / Mandiri">Umum / Mandiri</option>
                  <option value="Asuransi Inhealth">Asuransi Inhealth</option>
                  <option value="Asuransi Allianz Care">Asuransi Allianz Care</option>
                  <option value="Asuransi Prudential">Asuransi Prudential</option>
                  <option value="PT Pertamina (Persero)">PT Pertamina (Persero)</option>
                  <option value="PT PLN (Persero)">PT PLN (Persero)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold text-slate-300 block mb-1">
                  Keluhan Utama / Alasan Kunjungan
                </label>
                <input
                  type="text"
                  value={newQueueForm.keluhan}
                  onChange={(e) => setNewQueueForm({ ...newQueueForm, keluhan: e.target.value })}
                  placeholder="Cth: Kontrol rutin, batuk berdahak 3 hari, nyeri dada..."
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 outline-none focus:border-cyan-500 text-xs"
                />
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className="border-t border-slate-700 pt-4 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowAddPatientModal(false);
                  setShowUnifiedRegistrationModal(true);
                }}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1.5 transition-colors"
              >
                <UserPlus className="w-3.5 h-3.5" /> Buka Form Pendaftaran Terpadu 8 Langkah
              </button>

              <div className="flex items-center gap-2.5 ml-auto">
                <button
                  type="button"
                  onClick={() => setShowAddPatientModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-all"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleAddNewQueue}
                  className="px-5 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-cyan-950/50 flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" /> Daftarkan ke Antrean Poli
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Full Patient360 EMR Viewer */}
      {showPatient360Modal && selectedPatientForModal && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-6xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-4 bg-slate-800 border-b border-slate-700 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">
                  Rekam Medis Elektronik (RME 360°) — {selectedPatientForModal.nama} ({selectedPatientForModal.no_rm})
                </h3>
              </div>
              <button
                onClick={() => setShowPatient360Modal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              <Patient360 patient={selectedPatientForModal} onBack={() => setShowPatient360Modal(false)} />
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Form Pendaftaran Pasien Terpadu (8-Langkah Wizard) */}
      {showUnifiedRegistrationModal && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-6xl max-h-[96vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-4 bg-slate-800 border-b border-slate-700 flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <UserPlus className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="text-base font-bold text-white leading-tight">
                    Form Pendaftaran Pasien Terpadu (Registrasi & Rekam Medis)
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Form 8-langkah terpadu: Demografi, Kontak, Penjamin, Rujukan, Data Medis, dan Tanda Tangan Digital
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowUnifiedRegistrationModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar bg-slate-900">
              <RegistrationForm onClose={() => {
                setShowUnifiedRegistrationModal(false);
                toast.success('Pendaftaran pasien terpadu berhasil diselesaikan.');
              }} />
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: Tambah Booking / Reservasi Jadwal Poliklinik */}
      {showAddBookingModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center border-b border-slate-700 pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-cyan-400" />
                <h3 className="text-lg font-bold text-white">
                  Buat Reservasi / Booking Poliklinik
                </h3>
              </div>
              <button
                onClick={() => setShowAddBookingModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-300 block mb-1">Pilih Pasien Terdaftar</label>
                <select
                  value={newBookingForm.pasienId}
                  onChange={(e) => {
                    const selId = e.target.value;
                    const p = pasien.find(px => String(px.id) === selId);
                    setNewBookingForm({
                      ...newBookingForm,
                      pasienId: selId,
                      namaManual: p?.nama || '',
                      noRmManual: p?.no_rm || '',
                      penjamin: p?.penjamin || 'BPJS Kesehatan'
                    });
                  }}
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:border-cyan-500"
                >
                  <option value="">-- Pasien Baru / Input Manual --</option>
                  {pasien.slice(0, 50).map(p => (
                    <option key={p.id} value={p.id}>
                      {p.no_rm} - {p.nama} ({p.penjamin || 'Umum'})
                    </option>
                  ))}
                </select>
              </div>

              {!newBookingForm.pasienId && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-300 block mb-1">Nama Pasien</label>
                    <input
                      type="text"
                      value={newBookingForm.namaManual}
                      onChange={(e) => setNewBookingForm({ ...newBookingForm, namaManual: e.target.value })}
                      placeholder="Nama Pasien..."
                      className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-300 block mb-1">No. RM (Opsional)</label>
                    <input
                      type="text"
                      value={newBookingForm.noRmManual}
                      onChange={(e) => setNewBookingForm({ ...newBookingForm, noRmManual: e.target.value })}
                      placeholder="RM-XXXX..."
                      className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Poliklinik Tujuan</label>
                  <select
                    value={newBookingForm.poliId}
                    onChange={(e) => setNewBookingForm({ ...newBookingForm, poliId: e.target.value })}
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:border-cyan-500"
                  >
                    {allPoliList.map(p => (
                      <option key={p.id} value={p.id}>{p.nama}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Penjamin</label>
                  <select
                    value={newBookingForm.penjamin}
                    onChange={(e) => setNewBookingForm({ ...newBookingForm, penjamin: e.target.value })}
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:border-cyan-500"
                  >
                    <option value="BPJS Kesehatan">BPJS Kesehatan (JKN)</option>
                    <option value="Umum / Mandiri">Umum / Mandiri</option>
                    <option value="Asuransi Inhealth">Asuransi Inhealth</option>
                    <option value="Asuransi Allianz Care">Asuransi Allianz Care</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Tanggal Kunjungan</label>
                  <input
                    type="date"
                    value={newBookingForm.tanggal}
                    onChange={(e) => setNewBookingForm({ ...newBookingForm, tanggal: e.target.value })}
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Estimasi Jam</label>
                  <input
                    type="text"
                    value={newBookingForm.jam}
                    onChange={(e) => setNewBookingForm({ ...newBookingForm, jam: e.target.value })}
                    placeholder="08:30 WIB"
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Keluhan / Catatan Reservasi</label>
                <textarea
                  rows={2}
                  value={newBookingForm.keluhan}
                  onChange={(e) => setNewBookingForm({ ...newBookingForm, keluhan: e.target.value })}
                  placeholder="Cth: Kontrol rutin pasca rawat inap, evaluasi hasil lab..."
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="border-t border-slate-700 pt-4 flex justify-end gap-2.5">
              <button
                onClick={() => setShowAddBookingModal(false)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-xl text-xs font-bold"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  const targetPoli = allPoliList.find(p => p.id === newBookingForm.poliId) || allPoliList[0];
                  const doc = dokter.find(d => d.poli_id === targetPoli.id) || dokter[0];
                  const patientName = newBookingForm.namaManual || (pasien.find(p => String(p.id) === newBookingForm.pasienId)?.nama) || 'Pasien Baru';
                  const patientRm = newBookingForm.noRmManual || (pasien.find(p => String(p.id) === newBookingForm.pasienId)?.no_rm) || `RM-${Date.now().toString().slice(-6)}`;

                  const newBookingItem = {
                    id: `BK-${Date.now()}`,
                    booking_code: `BK-2026-${Math.floor(10000 + Math.random() * 90000)}`,
                    nama_pasien: patientName,
                    no_rm: patientRm,
                    pasien_id: newBookingForm.pasienId || `P-${Date.now()}`,
                    poli_tujuan: targetPoli.nama,
                    poli_id: targetPoli.id,
                    dokter_dpjp: doc?.nama || 'dr. Spesialis DPJP',
                    tanggal_booking: newBookingForm.tanggal,
                    jam_estimasi: `${newBookingForm.jam} WIB`,
                    penjamin: newBookingForm.penjamin,
                    status_booking: 'Terkonfirmasi',
                    keluhan: newBookingForm.keluhan
                  };

                  setBookingList(prev => [newBookingItem, ...prev]);
                  toast.success(`Reservasi ${newBookingItem.booking_code} untuk ${patientName} berhasil dibuat!`);
                  setShowAddBookingModal(false);
                  setNewBookingForm({
                    pasienId: '',
                    namaManual: '',
                    noRmManual: '',
                    poliId: 'POLI-01',
                    dokterId: '',
                    tanggal: new Date().toISOString().split('T')[0],
                    jam: '08:30',
                    penjamin: 'BPJS Kesehatan',
                    keluhan: ''
                  });
                }}
                className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold shadow-lg"
              >
                Simpan Reservasi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Outpatient;
