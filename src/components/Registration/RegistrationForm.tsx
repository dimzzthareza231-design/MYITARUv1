import React, { useState, useEffect } from 'react';
import { RegistrationFormState } from './Tabs/types';
import { DemografiTab } from './Tabs/DemografiTab';
import { KontakTab } from './Tabs/KontakTab';
import { PekerjaanTab } from './Tabs/PekerjaanTab';
import { PenjaminTab } from './Tabs/PenjaminTab';
import { DokumenTab } from './Tabs/DokumenTab';
import { RujukanTab } from './Tabs/RujukanTab';
import { DataMedisTab } from './Tabs/DataMedisTab';
import { PersetujuanTab } from './Tabs/PersetujuanTab';
import { ChevronRight, ChevronLeft, Save, Printer, UserCircle, Check, Sparkles, RotateCcw, AlertCircle, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import { useHospital } from '../../contexts/HospitalContext';
import { usePatientFlow } from '../../contexts/PatientFlowContext';
import { useAntrian, DAFTAR_POLI } from "../../contexts/AntrianContext";

export function RegistrationForm({ initialData, onClose }: { initialData?: any, onClose?: () => void }) {
  const { addPasien, addKunjungan: addKunjunganMaster } = useHospital();
  const { addKunjungan } = usePatientFlow();
  const { daftarkanAntrian } = useAntrian();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 8;
  const [draftDetected, setDraftDetected] = useState(false);
  const [draftTime, setDraftTime] = useState<string>('');
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // Function to create default form state
  const createDefaultState = (): RegistrationFormState => {
    const today = new Date();
    const dateStr = today.getFullYear().toString().slice(2) + 
                   (today.getMonth() + 1).toString().padStart(2, '0') + 
                   today.getDate().toString().padStart(2, '0');
    const randomStr = Math.floor(1000 + Math.random() * 9000).toString();
    
    return {
      noRm: `RM-${dateStr}-${randomStr}`,
      nik: '',
      namaLengkap: '',
      namaPanggilan: '',
      tempatLahir: '',
      tanggalLahir: '',
      jenisKelamin: 'L',
      golonganDarah: '',
      rhesus: '',
      agama: 'Islam',
      sukuBangsa: 'Sunda/Jawa',
      kewarganegaraan: 'WNI',
      noPaspor: '',
      bahasa: 'Indonesia',
      statusPerkawinan: 'Belum Menikah',
      pendidikanTerakhir: 'SMA/Sederajat',

      alamatKtp: '',
      samaDenganKtp: true,
      alamatDomisili: '',
      rt: '',
      rw: '',
      kelurahan: '',
      kecamatan: '',
      kotaKabupaten: '',
      provinsi: '',
      kodePos: '',
      noHpUtama: '',
      noHpAlternatif: '',
      email: '',
      kontakDarurat: [],

      pekerjaan: 'Karyawan Swasta',
      statusPekerjaan: 'Bekerja',
      namaPerusahaan: '',
      alamatPerusahaan: '',
      jabatan: '',
      penghasilan: '3 - 5 Juta',
      jenisPekerjaan: 'Risiko Rendah (Kantor, Guru, dll)',

      jenisPenjamin: 'BPJS Kesehatan',
      noKartuBpjs: '',
      namaBpjs: '',
      jenisPesertaBpjs: '',
      kelasBpjs: '1',
      faskes1Bpjs: '',
      namaIbuKandung: '',
      namaAsuransi: '',
      noPolis: '',
      namaTertanggung: '',
      masaBerlakuAsuransi: '',
      limitCoverage: '',
      perusahaanPenjamin: '',
      noKaryawan: '',
      masaBerlakuPerusahaan: '',
      coveragePerusahaan: '',
      metodePembayaran: 'Tunai',

      dokumenFiles: [],

      jenisKunjungan: 'Rawat Jalan',
      poliTujuan: 'Poliklinik Penyakit Dalam',
      dokterPilihan: '',
      sumberInformasi: 'Datang Langsung (Walk-in)',
      caraDatang: 'Sendiri / Diantar Keluarga',
      adaRujukan: 'Tidak',
      jenisRujukan: 'BPJS',
      noRujukan: '',
      faskesPengirim: '',
      tanggalRujukan: '',
      diagnosisRujukan: '',
      adaSuratKontrol: 'Tidak',
      noSuratKontrol: '',
      tanggalKontrol: '',
      dokterSK: '',
      poliSK: '',

      keluhanUtama: '',
      riwayatAlergi: [],
      tandaVital: { td: '120/80', nadi: '80', suhu: '36.5', rr: '18', spo2: '99' },
      problemList: [],
      obatKonsumsi: [],

      setujuUmum: false,
      setujuPdp: false,
      setujuHakKewajiban: false,
      pernyataanBenar: false,
      ttdData: { nama: '', hubungan: 'Pasien Sendiri', nik: '', tanggalWaktu: '', signature: '' },
      
      ...initialData
    };
  };

  const [formData, setFormData] = useState<RegistrationFormState>(createDefaultState);

  // Check draft in localStorage on mount
  useEffect(() => {
    try {
      const savedDraft = localStorage.getItem('simrs_registration_draft');
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft);
        if (parsed && parsed.savedAt) {
          setDraftTime(new Date(parsed.savedAt).toLocaleString('id-ID'));
          setDraftDetected(true);
        }
      }
    } catch (err) {
      console.error('Error loading draft check:', err);
    }
  }, []);

  // Auto-save draft periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (formData.namaLengkap || formData.nik || formData.noHpUtama) {
        localStorage.setItem('simrs_registration_draft', JSON.stringify({
          ...formData,
          savedAt: new Date().toISOString()
        }));
      }
    }, 15000);
    return () => clearInterval(interval);
  }, [formData]);

  const loadDraft = () => {
    try {
      const savedDraft = localStorage.getItem('simrs_registration_draft');
      if (savedDraft) {
        const { savedAt, ...parsedData } = JSON.parse(savedDraft);
        setFormData(parsedData);
        setDraftDetected(false);
        toast.success('Draft pendaftaran berhasil dimuat!');
      }
    } catch (err) {
      toast.error('Gagal memuat draft.');
    }
  };

  const discardDraft = () => {
    localStorage.removeItem('simrs_registration_draft');
    setDraftDetected(false);
    toast('Draft lama dihapus.', { icon: 'ℹ️' });
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const saveDraft = () => {
    localStorage.setItem('simrs_registration_draft', JSON.stringify({
      ...formData,
      savedAt: new Date().toISOString()
    }));
    toast.success('Draft berhasil disimpan!');
  };

  // Populate Dummy Data for Testing / Fast Registration
  const populateDummyData = () => {
    const randomNik = '3273' + Math.floor(100000000000 + Math.random() * 900000000000).toString();
    const randomBpjs = '000' + Math.floor(1000000000 + Math.random() * 9000000000).toString();
    
    setFormData(prev => ({
      ...prev,
      nik: randomNik,
      namaLengkap: 'Budi Santoso',
      namaPanggilan: 'Budi',
      tempatLahir: 'Bandung',
      tanggalLahir: '1988-05-14',
      jenisKelamin: 'L',
      golonganDarah: 'O',
      rhesus: '+',
      agama: 'Islam',
      sukuBangsa: 'Sunda',
      noHpUtama: '081234567890',
      email: 'budi.santoso@gmail.com',
      alamatKtp: 'Jl. Merdeka No. 45, Kel. Citarum, Kec. Bandung Wetan, Kota Bandung',
      samaDenganKtp: true,
      alamatDomisili: 'Jl. Merdeka No. 45, Kel. Citarum, Kec. Bandung Wetan, Kota Bandung',
      rt: '003',
      rw: '007',
      provinsi: 'Jawa Barat',
      kotaKabupaten: 'Kota Bandung',
      kecamatan: 'Bandung Wetan',
      kelurahan: 'Citarum',
      kodePos: '40115',
      kontakDarurat: [{ nama: 'Siti Rahma', hubungan: 'Istri', noHp: '081987654321', alamat: 'Jl. Merdeka No. 45' }],
      statusPekerjaan: 'Bekerja',
      pekerjaan: 'Karyawan Swasta',
      namaPerusahaan: 'PT Nusantara Jaya',
      jenisPenjamin: 'BPJS Kesehatan',
      noKartuBpjs: randomBpjs,
      namaBpjs: 'Budi Santoso',
      namaIbuKandung: 'Amina',
      jenisKunjungan: 'Rawat Jalan',
      poliTujuan: 'Poliklinik Penyakit Dalam',
      sumberInformasi: 'Datang Langsung (Walk-in)',
      caraDatang: 'Sendiri / Diantar Keluarga',
      keluhanUtama: 'Pusing dan demam sejak 2 hari yang lalu, lemas dan mual.',
      tandaVital: { td: '120/80', nadi: '82', suhu: '37.2', rr: '18', spo2: '98' },
      riwayatAlergi: [{ allergen: 'Penisilin', reaction: 'Gatal-gatal', severity: 'Mild' }],
      setujuUmum: true,
      setujuPdp: true,
      setujuHakKewajiban: true,
      pernyataanBenar: true,
      ttdData: {
        nama: 'Budi Santoso',
        hubungan: 'Pasien Sendiri',
        nik: randomNik,
        tanggalWaktu: new Date().toISOString(),
        signature: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iNTAiPjx3aXRoIHN0cm9rZT0iYmxhY2siLz48L3N2Zz4='
      }
    }));
    toast.success('✨ Data dummy pasien berhasil diisikan untuk testing!');
  };

  // Step Validation Logic
  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!formData.nik || formData.nik.length < 16) {
          toast.error('NIK wajib diisi 16 digit');
          return false;
        }
        if (!formData.namaLengkap) {
          toast.error('Nama lengkap wajib diisi');
          return false;
        }
        if (!formData.tempatLahir) {
          toast.error('Tempat lahir wajib diisi');
          return false;
        }
        if (!formData.tanggalLahir) {
          toast.error('Tanggal lahir wajib diisi');
          return false;
        }
        return true;

      case 2:
        if (!formData.noHpUtama || formData.noHpUtama.length < 10) {
          toast.error('No. HP Utama wajib diisi (minimal 10 digit)');
          return false;
        }
        if (!formData.alamatKtp) {
          toast.error('Alamat detail KTP wajib diisi');
          return false;
        }
        if (!formData.samaDenganKtp && !formData.alamatDomisili) {
          toast.error('Alamat domisili wajib diisi jika berbeda dengan KTP');
          return false;
        }
        if (!formData.provinsi) {
          toast.error('Provinsi wajib dipilih');
          return false;
        }
        return true;

      case 3:
        // Pekerjaan step is mostly optional, default true
        return true;

      case 4:
        if (formData.jenisPenjamin === 'BPJS Kesehatan') {
          if (!formData.noKartuBpjs || formData.noKartuBpjs.length !== 13) {
            toast.error('No Kartu BPJS Kesehatan harus 13 digit');
            return false;
          }
          if (!formData.namaBpjs) {
            toast.error('Nama sesuai Kartu BPJS wajib diisi');
            return false;
          }
          if (!formData.namaIbuKandung) {
            toast.error('Nama Ibu Kandung wajib diisi untuk BPJS');
            return false;
          }
        } else if (formData.jenisPenjamin === 'Asuransi Swasta') {
          if (!formData.namaAsuransi) {
            toast.error('Nama Asuransi Swasta wajib diisi');
            return false;
          }
          if (!formData.noPolis) {
            toast.error('Nomor Polis wajib diisi');
            return false;
          }
        }
        return true;

      case 5:
        // Dokumen
        return true;

      case 6:
        if (formData.adaRujukan === 'Ya') {
          if (!formData.noRujukan) {
            toast.error('Nomor Surat Rujukan wajib diisi');
            return false;
          }
          if (!formData.faskesPengirim) {
            toast.error('Faskes Pengirim Rujukan wajib diisi');
            return false;
          }
        }
        return true;

      case 7:
        if (!formData.keluhanUtama) {
          toast.error('Keluhan Utama pasien wajib diisi');
          return false;
        }
        return true;

      case 8:
        if (!formData.setujuUmum || !formData.setujuPdp || !formData.setujuHakKewajiban || !formData.pernyataanBenar) {
          toast.error('Anda wajib mencentang seluruh persetujuan & pernyataan');
          return false;
        }
        if (!formData.ttdData?.nama || !formData.ttdData?.nik) {
          toast.error('Nama dan NIK penandatangan wajib diisi');
          return false;
        }
        if (!formData.ttdData?.signature) {
          toast.error('Goresan tanda tangan digital wajib diisi');
          return false;
        }
        return true;

      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps(prev => [...prev, currentStep]);
      }
      if (currentStep < totalSteps) setCurrentStep(c => c + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(c => c - 1);
  };

  const handleTabClick = (stepIndex: number) => {
    // Can navigate freely backwards or forward if previous steps validated
    if (stepIndex < currentStep) {
      setCurrentStep(stepIndex);
    } else {
      let isValidSoFar = true;
      for (let s = 1; s < stepIndex; s++) {
        if (!validateStep(s)) {
          isValidSoFar = false;
          setCurrentStep(s);
          break;
        }
      }
      if (isValidSoFar) {
        setCurrentStep(stepIndex);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all steps from 1 to 8
    for (let s = 1; s <= totalSteps; s++) {
      if (!validateStep(s)) {
        setCurrentStep(s);
        return;
      }
    }

    // Convert state to proper patient format
    const fullAddress = [
      formData.alamatKtp, 
      formData.rt ? `RT ${formData.rt}` : '', 
      formData.rw ? `RW ${formData.rw}` : '', 
      formData.kelurahan ? `Kel. ${formData.kelurahan}` : '', 
      formData.kecamatan ? `Kec. ${formData.kecamatan}` : '', 
      formData.kotaKabupaten, 
      formData.provinsi
    ].filter(Boolean).join(', ') || formData.alamatDomisili || 'Kota Bandung, Jawa Barat';

    const newPatient = {
      id: Date.now().toString(),
      no_rm: formData.noRm,
      nik: formData.nik,
      nama: formData.namaLengkap,
      nama_pasien: formData.namaLengkap,
      jenis_kelamin: formData.jenisKelamin,
      tgl_lahir: formData.tanggalLahir,
      tanggal_lahir: formData.tanggalLahir,
      no_hp: formData.noHpUtama,
      telepon: formData.noHpUtama,
      penjamin: formData.jenisPenjamin,
      status: 'Aktif',
      alamat: fullAddress,
      alamat_ktp: formData.alamatKtp,
      alamat_domisili: formData.alamatDomisili,
      golongan_darah: formData.golonganDarah || 'O',
      rhesus: formData.rhesus || '+',
      agama: formData.agama || 'Islam',
      pekerjaan: formData.pekerjaan || 'Karyawan Swasta',
      status_pekerjaan: formData.statusPekerjaan,
      pendidikan: formData.pendidikanTerakhir || 'SMA/Sederajat',
      status_perkawinan: formData.statusPerkawinan || 'Belum Menikah',
      suku_bangsa: formData.sukuBangsa || 'Sunda/Jawa',
      bahasa: formData.bahasa || 'Indonesia',
      kewarganegaraan: formData.kewarganegaraan || 'WNI',
      kontak_darurat: formData.kontakDarurat || [],
      no_kartu_bpjs: formData.noKartuBpjs || '',
      nama_ibu_kandung: formData.namaIbuKandung || '',
      keluhan_utama: formData.keluhanUtama || '',
      diagnosa_primer: formData.diagnosisRujukan || '',
      tanda_vital: formData.tandaVital
    };
    
    // Save to HospitalContext (Master Data)
    addPasien(newPatient as any);

    const poliObject = DAFTAR_POLI.find(p => p.nama === formData.poliTujuan) || DAFTAR_POLI[0];
    const hasilAntrian = daftarkanAntrian({
      pasienId: newPatient.id,
      namaPasien: newPatient.nama,
      noRm: newPatient.no_rm,
      poliId: poliObject.id,
      keluhan: formData.keluhanUtama,
      penjamin: formData.jenisPenjamin
    });

    const commonKunjunganData = {
      tanggal: new Date().toISOString(),
      poli_id: poliObject.id,
      dokter_id: 'D1',
      penjamin_id: formData.jenisPenjamin.toLowerCase().includes('bpjs') ? 'PJ-02' : 'PJ-01',
      nomor_antrian: hasilAntrian ? hasilAntrian.nomorAntrian : `A-${Math.floor(Math.random() * 100).toString().padStart(3, '0')}`,
      tipe: formData.jenisKunjungan || 'Rawat Jalan'
    };

    // Add Visit to Hospital Context
    addKunjunganMaster({
      id: `K-${Math.floor(Math.random() * 10000)}`,
      pasien_id: newPatient.id,
      status: 'Menunggu',
      ...commonKunjunganData
    } as any);

    // Add Visit to Patient Flow Context
    addKunjungan({
      no_rm: formData.noRm,
      nama_pasien: formData.namaLengkap,
      jenis_kunjungan: formData.jenisKunjungan || 'Rawat Jalan',
      poli: formData.poliTujuan || 'Poli Umum',
      dokter: formData.dokterPilihan || 'dr. Jaga Poliklinik',
      penjamin: formData.jenisPenjamin
    });
    
    // Clean up draft
    localStorage.removeItem('simrs_registration_draft');

    toast.success(`🎉 Pasien ${newPatient.nama} berhasil terdaftar! RM: ${newPatient.no_rm}`, {
      duration: 5000,
      icon: '✅'
    });

    if (onClose) {
      setTimeout(onClose, 800);
    }
  };

  const stepTitles = [
    'Demografi', 'Kontak & Alamat', 'Pekerjaan', 'Penjamin', 
    'Dokumen', 'Rujukan', 'Data Medis', 'Persetujuan'
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col flex-1">
      {/* Draft Notification Banner */}
      {draftDetected && (
        <div className="bg-amber-500/15 dark:bg-amber-950/40 border-b border-amber-500/30 p-3.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-center gap-2.5 text-xs text-amber-900 dark:text-amber-200 font-medium">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>Draft pendaftaran sebelumnya ditemukan (disimpan pada: <strong>{draftTime}</strong>).</span>
          </div>
          <div className="flex items-center gap-2">
            <button 
              type="button" 
              onClick={loadDraft}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-lg shadow transition-all"
            >
              Muat Draft
            </button>
            <button 
              type="button" 
              onClick={discardDraft}
              className="px-3 py-1.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 font-bold text-xs rounded-lg transition-all"
            >
              Hapus Draft
            </button>
          </div>
        </div>
      )}

      {/* Header & Progress */}
      <div className="bg-slate-50 dark:bg-slate-800/90 border-b border-slate-200 dark:border-slate-700 p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-800 dark:text-white flex items-center gap-2">
              <UserCircle className="w-6 h-6 text-blue-600 dark:text-cyan-400" />
              Formulir Pendaftaran Pasien Baru Terpadu
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
              Lengkapi 8 langkah pendaftaran master data pasien, penjamin, dan registrasi kunjungan awal.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button 
              type="button"
              onClick={populateDummyData} 
              className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 rounded-lg text-xs font-bold hover:bg-indigo-100 dark:hover:bg-indigo-900/60 flex items-center gap-1 shadow-sm transition-all"
              title="Isi otomatis dengan data dummy untuk mempermudah testing"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> Auto-Fill Dummy
            </button>
            <button 
              type="button"
              onClick={saveDraft} 
              className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-1 shadow-sm transition-all"
            >
              <Save className="w-3.5 h-3.5 text-cyan-500" /> Simpan Draft
            </button>
            {onClose && (
              <button 
                type="button"
                onClick={onClose} 
                className="px-3 py-1.5 bg-slate-200 dark:bg-slate-700 border border-transparent rounded-lg text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600 shadow-sm transition-all"
              >
                Tutup
              </button>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 mb-2 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-cyan-600 dark:to-cyan-400 h-2.5 rounded-full transition-all duration-300 shadow" 
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 font-bold">
          <span>Langkah {currentStep} dari {totalSteps}</span>
          <span className="text-blue-600 dark:text-cyan-400">{currentStep}. {stepTitles[currentStep - 1]}</span>
        </div>
        
        {/* Tab Headers Desktop */}
        <div className="hidden md:flex gap-1.5 mt-4 overflow-x-auto pb-1 custom-scrollbar">
          {stepTitles.map((title, idx) => {
            const stepNum = idx + 1;
            const isCurrent = currentStep === stepNum;
            const isDone = completedSteps.includes(stepNum);

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleTabClick(stepNum)}
                className={`px-3 py-2 text-xs font-bold whitespace-nowrap rounded-t-xl transition-all flex items-center gap-1.5 ${
                  isCurrent 
                    ? 'bg-blue-600 dark:bg-cyan-600 text-white shadow-md' 
                    : isDone
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-b-0 border-slate-200 dark:border-slate-700'
                }`}
              >
                {isDone ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <span>{stepNum}.</span>}
                <span>{title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">
        <form id="registrationForm" onSubmit={handleSubmit}>
          <div className={currentStep === 1 ? 'block' : 'hidden'}><DemografiTab data={formData} onChange={handleChange} /></div>
          <div className={currentStep === 2 ? 'block' : 'hidden'}><KontakTab data={formData} onChange={handleChange} /></div>
          <div className={currentStep === 3 ? 'block' : 'hidden'}><PekerjaanTab data={formData} onChange={handleChange} /></div>
          <div className={currentStep === 4 ? 'block' : 'hidden'}><PenjaminTab data={formData} onChange={handleChange} /></div>
          <div className={currentStep === 5 ? 'block' : 'hidden'}><DokumenTab data={formData} onChange={handleChange} /></div>
          <div className={currentStep === 6 ? 'block' : 'hidden'}><RujukanTab data={formData} onChange={handleChange} /></div>
          <div className={currentStep === 7 ? 'block' : 'hidden'}><DataMedisTab data={formData} onChange={handleChange} /></div>
          <div className={currentStep === 8 ? 'block' : 'hidden'}><PersetujuanTab data={formData} onChange={handleChange} /></div>
        </form>
      </div>

      {/* Footer Navigation */}
      <div className="bg-slate-50 dark:bg-slate-800/90 border-t border-slate-200 dark:border-slate-700 p-4 flex justify-between items-center">
        <button 
          type="button" 
          onClick={handlePrev}
          disabled={currentStep === 1}
          className="px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 transition-all shadow-sm"
        >
          <ChevronLeft className="w-4 h-4" /> Sebelumnya
        </button>
        
        {currentStep < totalSteps ? (
          <button 
            type="button" 
            onClick={handleNext}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 dark:bg-cyan-600 dark:hover:bg-cyan-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md transition-all cursor-pointer hover:scale-[1.02] active:scale-95"
          >
            <span>Langkah Selanjutnya ({currentStep + 1}/{totalSteps})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button 
            form="registrationForm"
            type="submit"
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-950/40 transition-all cursor-pointer hover:scale-[1.02] active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>Simpan Data & Daftarkan Kunjungan</span>
          </button>
        )}
      </div>
    </div>
  );
}


