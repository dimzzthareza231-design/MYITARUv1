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
import { ChevronRight, ChevronLeft, Save, Printer, UserCircle } from 'lucide-react';
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

  const [formData, setFormData] = useState<RegistrationFormState>(() => {
    // Generate RM format YYMMDD-XXXX
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
      agama: '',
      sukuBangsa: '',
      kewarganegaraan: 'WNI',
      noPaspor: '',
      bahasa: 'Indonesia',
      statusPerkawinan: '',
      pendidikanTerakhir: '',

      alamatKtp: '',
      samaDenganKtp: false,
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

      pekerjaan: '',
      statusPekerjaan: '',
      namaPerusahaan: '',
      alamatPerusahaan: '',
      jabatan: '',
      penghasilan: '',
      jenisPekerjaan: '',

      jenisPenjamin: 'Umum/Tunai',
      noKartuBpjs: '',
      namaBpjs: '',
      jenisPesertaBpjs: '',
      kelasBpjs: '',
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
      poliTujuan: '',
      dokterPilihan: '',
      sumberInformasi: '',
      caraDatang: '',
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
      tandaVital: { td: '', nadi: '', suhu: '', rr: '', spo2: '' },
      problemList: [],
      obatKonsumsi: [],

      setujuUmum: false,
      setujuPdp: false,
      setujuHakKewajiban: false,
      pernyataanBenar: false,
      ttdData: { nama: '', hubungan: '', nik: '', tanggalWaktu: '', signature: '' },
      
      ...initialData
    };
  });

  // Auto-save draft
  useEffect(() => {
    const interval = setInterval(() => {
      localStorage.setItem('registration_draft', JSON.stringify(formData));
    }, 30000);
    return () => clearInterval(interval);
  }, [formData]);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const saveDraft = () => {
    localStorage.setItem('registration_draft', JSON.stringify(formData));
    toast.success('Draft berhasil disimpan');
  };

  const handleNext = () => {
    if (currentStep < totalSteps) setCurrentStep(c => c + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(c => c - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validations for final step
    if (!formData.setujuUmum || !formData.setujuPdp || !formData.setujuHakKewajiban || !formData.pernyataanBenar) {
      toast.error('Anda harus mencentang semua persetujuan');
      return;
    }
    
    if (!formData.ttdData.signature || !formData.ttdData.nama || !formData.ttdData.nik) {
      toast.error('Data tanda tangan tidak lengkap');
      return;
    }

    // Save logic
    toast.success('Pendaftaran berhasil disimpan!');
    
    // Convert state to proper patient format
    const newPatient = {
      id: Date.now().toString(),
      no_rm: formData.noRm,
      nik: formData.nik,
      nama: formData.namaLengkap,
      jenis_kelamin: formData.jenisKelamin,
      tgl_lahir: formData.tanggalLahir,
      no_hp: formData.noHpUtama,
      penjamin: formData.jenisPenjamin,
      status: 'Menunggu'
    };
    
    // Simpan ke HospitalContext (Data Master)
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
      penjamin_id: formData.jenisPenjamin === 'BPJS' ? 'PJ-02' : 'PJ-01',
      nomor_antrian: hasilAntrian ? hasilAntrian.nomorAntrian : `A-${Math.floor(Math.random() * 100).toString().padStart(3, '0')}`,
      tipe: formData.jenisKunjungan || 'Rawat Jalan'
    };

    // Tambah Kunjungan ke Master (untuk Modul Poli/Outpatient, Kasir, dll)
    addKunjunganMaster({
      id: `K-${Math.floor(Math.random() * 10000)}`,
      pasien_id: newPatient.id,
      status: 'Menunggu',
      ...commonKunjunganData
    } as any);

    // Integrasi dengan modul Patient Flow
    addKunjungan({
      no_rm: formData.noRm,
      nama_pasien: formData.namaLengkap,
      jenis_kunjungan: formData.jenisKunjungan || 'Rawat Jalan',
      poli: formData.poliTujuan || 'Poli Umum',
      dokter: formData.dokterPilihan || '-',
      penjamin: formData.jenisPenjamin
    });
    
    if (hasilAntrian) {
      toast.success(`✅ Pasien terdaftar! Nomor Antrian: ${hasilAntrian.nomorAntrian}`, {
        duration: 6000,
        icon: '🎫'
      });
    }

    localStorage.removeItem('registration_draft');
    if (onClose) {
        setTimeout(onClose, 1000);
    }
  };

  const stepTitles = [
    'Data Demografi', 'Alamat & Kontak', 'Pekerjaan', 'Penjamin', 
    'Dokumen', 'Rujukan', 'Data Medis', 'Persetujuan'
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden flex flex-col flex-1">
      {/* Header & Progress */}
      <div className="bg-slate-50 border-b border-slate-200 p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <UserCircle className="w-6 h-6 text-blue-600" />
            Form Pendaftaran Pasien Terpadu
          </h2>
          <div className="flex gap-2">
            <button onClick={saveDraft} className="px-3 py-1.5 bg-white border border-slate-300 rounded text-sm font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1 shadow-sm">
              <Save className="w-4 h-4" /> Simpan Draft
            </button>
            {onClose && (
                <button onClick={onClose} className="px-3 py-1.5 bg-slate-200 border border-transparent rounded text-sm font-bold text-slate-700 hover:bg-slate-300 flex items-center gap-1 shadow-sm">
                Batal
                </button>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-200 rounded-full h-2.5 mb-2">
          <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${(currentStep / totalSteps) * 100}%` }}></div>
        </div>
        <div className="flex justify-between text-xs text-slate-500 font-bold">
          <span>Langkah {currentStep} dari {totalSteps}</span>
          <span>{stepTitles[currentStep - 1]}</span>
        </div>
        
        {/* Tab Headers Desktop */}
        <div className="hidden md:flex gap-1 mt-4 overflow-x-auto pb-1">
            {stepTitles.map((title, idx) => (
                <button
                    key={idx}
                    onClick={() => setCurrentStep(idx + 1)}
                    className={`px-3 py-2 text-sm font-bold whitespace-nowrap rounded-t-lg transition-colors ${
                        currentStep === idx + 1 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-b-0 border-slate-200'
                    }`}
                >
                    {idx + 1}. {title}
                </button>
            ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto p-6 bg-white">
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

      {/* Footer Nav */}
      <div className="bg-slate-50 border-t border-slate-200 p-4 flex justify-between items-center">
        <button 
          type="button" 
          onClick={handlePrev}
          disabled={currentStep === 1}
          className="px-6 py-2 bg-white border border-slate-300 text-slate-700 font-bold rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <ChevronLeft className="w-5 h-5" /> Sebelumnya
        </button>
        
        {currentStep < totalSteps ? (
          <button 
            type="button" 
            onClick={handleNext}
            className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 flex items-center gap-2 shadow-sm"
          >
            Selanjutnya <ChevronRight className="w-5 h-5" />
          </button>
        ) : (
          <button 
            form="registrationForm"
            type="submit"
            className="px-6 py-2 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 flex items-center gap-2 shadow-sm"
          >
            <Printer className="w-5 h-5" /> Simpan & Cetak Antrian
          </button>
        )}
      </div>
    </div>
  );
}
