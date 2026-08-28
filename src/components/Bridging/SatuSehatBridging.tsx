import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Globe, ShieldCheck, Activity, Database, Server, RefreshCw,
  Search, CheckCircle2, AlertCircle, Send, Key, Code, UserCheck,
  Building, MapPin, Pill, Stethoscope, FileCode, Check
} from 'lucide-react';
import toast from 'react-hot-toast';

export function SatuSehatBridging() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromUrl = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState<string>(tabFromUrl || 'Kelola');

  useEffect(() => {
    if (tabFromUrl) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const tabs = [
    'Kelola',
    'Referensi Praktisi',
    'Referensi Pasien',
    'Mapping Departemen',
    'Mapping Lokasi',
    'Mapping Praktisi',
    'Mapping Obat',
    'Mapping Lab',
    'Mapping Radiologi',
    'Data Response',
    'Verifikasi KYC',
    'Pengaturan'
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto h-full flex flex-col space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 border border-teal-300 dark:border-teal-700">
              KEMENKES RI FHIR R4
            </span>
            <span className="text-xs text-slate-400 font-mono">Org ID: ORG-1002345 (Connected)</span>
          </div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2">
            <span>🌐</span> SatuSehat Platform Bridging
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
            Interoperabilitas Data Rekam Medis Elektronik (RME) Nasional sesuai Standar FHIR HL7 Kemenkes RI.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              toast.promise(
                new Promise(resolve => setTimeout(resolve, 800)),
                {
                  loading: 'Sinkronisasi Token OAuth2 SatuSehat...',
                  success: 'Token Terverifikasi Aktif! Bearer JWT Valid.',
                  error: 'Gagal verifikasi token'
                }
              );
            }}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-teal-900/20 flex items-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Sync Token & Endpoint
          </button>
        </div>
      </div>

      {/* Navigation Submenus */}
      <div className="flex gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 overflow-x-auto custom-scrollbar shrink-0">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === tab
                ? 'bg-teal-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Submenu Views */}
      <div className="flex-1">
        {activeTab === 'Kelola' && <SatuSehatDashboard onNavigate={handleTabChange} />}
        {activeTab === 'Referensi Praktisi' && <ReferensiPraktisiTab />}
        {activeTab === 'Referensi Pasien' && <ReferensiPasienTab />}
        {activeTab === 'Mapping Departemen' && <MappingGenericTab title="Mapping Departemen / Organisasi (Organization)" type="organization" />}
        {activeTab === 'Mapping Lokasi' && <MappingGenericTab title="Mapping Ruangan & Poliklinik (Location)" type="location" />}
        {activeTab === 'Mapping Praktisi' && <MappingGenericTab title="Mapping Dokter & Tenaga Medis (Practitioner)" type="practitioner" />}
        {activeTab === 'Mapping Obat' && <MappingGenericTab title="Mapping Obat & Alkes (KFA Kemenkes)" type="kfa" />}
        {activeTab === 'Mapping Lab' && <MappingGenericTab title="Mapping Uji Laboratorium (LOINC Codes)" type="loinc" />}
        {activeTab === 'Mapping Radiologi' && <MappingGenericTab title="Mapping Modalitas Radiologi (DICOM/LOINC)" type="rad" />}
        {activeTab === 'Data Response' && <DataResponseTab />}
        {activeTab === 'Verifikasi KYC' && <VerifikasiKYCTab />}
        {activeTab === 'Pengaturan' && <PengaturanSatuSehatTab />}
      </div>
    </div>
  );
}

function SatuSehatDashboard({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const [isSyncing, setIsSyncing] = useState(false);

  const stats = [
    { label: 'Total Encounter Terkirim', value: '14,820', change: '+320 hari ini', color: 'text-teal-600' },
    { label: 'Condition / Diagnosa', value: '12,410', change: '+295 hari ini', color: 'text-blue-600' },
    { label: 'MedicationRequest (KFA)', value: '9,850', change: '+180 hari ini', color: 'text-emerald-600' },
    { label: 'Success Rate Sync', value: '99.8%', change: '2 error tertangani', color: 'text-indigo-600' }
  ];

  const handleForceSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      toast.success('42 Bundle FHIR berhasil dikirim ke Kemenkes SatuSehat!');
    }, 1200);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <span className="text-xs font-semibold text-slate-400 block mb-1">{s.label}</span>
            <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
            <span className="text-xs text-slate-500 mt-1 block">{s.change}</span>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="font-bold text-slate-800 dark:text-white text-base">Pipeline Status Pengiriman Data FHIR R4</h3>
            <p className="text-xs text-slate-500">Antrean otomatis data rekam medis terkirim ke platform SatuSehat.</p>
          </div>
          <button
            onClick={handleForceSync}
            disabled={isSyncing}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Mengirim Data...' : 'Kirim Antrean Sync'}
          </button>
        </div>

        <div className="space-y-3">
          {[
            { resource: 'Patient (Identitas Pasien)', status: 'Realtime Synced', queue: 0, time: '3 detik lalu' },
            { resource: 'Encounter (Kunjungan Pasien Rawat Jalan/Inap)', status: 'Realtime Synced', queue: 0, time: '10 detik lalu' },
            { resource: 'Condition (Diagnosa ICD-10 Primer & Sekunder)', status: 'Realtime Synced', queue: 0, time: '15 detik lalu' },
            { resource: 'Observation (Tanda Vital & Hasil Lab/Rad)', status: 'Realtime Synced', queue: 0, time: '30 detik lalu' },
            { resource: 'MedicationRequest (Resep Obat Terintegrasi KFA)', status: 'Realtime Synced', queue: 0, time: '1 menit lalu' },
            { resource: 'Procedure (Tindakan Medis & Operasi)', status: 'Realtime Synced', queue: 0, time: '2 menit lalu' }
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60 text-xs">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{item.resource}</span>
                  <span className="text-[11px] text-slate-400 block">Terakhir sync: {item.time}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ReferensiPraktisiTab() {
  const [nik, setNik] = useState('');
  const [result, setResult] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nik.trim()) return;
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      setResult({
        ihsNumber: 'IHS-1000249811',
        nik: nik,
        name: 'dr. Budi Setiawan, Sp.PD',
        gender: 'Laki-Laki',
        strNumber: '31.1.1.100.2.20.123456',
        sipNumber: '446/SIP.D/2023/001',
        qualification: 'Spesialis Penyakit Dalam',
        status: 'Active Practitioner'
      });
      toast.success('Data Praktisi (IHS Number) ditemukan di Kemenkes!');
    }, 600);
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-5">
      <div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-white">Lookup Referensi Praktisi Kemenkes (IHS Number)</h3>
        <p className="text-xs text-slate-500">Pencarian data dokter/nakes terdaftar di SatuSehat berdasarkan NIK KTP.</p>
      </div>

      <form onSubmit={handleLookup} className="flex gap-2">
        <input
          type="text"
          value={nik}
          onChange={e => setNik(e.target.value)}
          placeholder="Masukkan NIK Dokter (16 digit)..."
          className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-sm focus:ring-2 focus:ring-teal-500 outline-none font-mono"
        />
        <button
          type="submit"
          disabled={isSearching}
          className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold flex items-center gap-2"
        >
          {isSearching ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          Cari Praktisi
        </button>
      </form>

      {result && (
        <div className="p-5 bg-teal-50/50 dark:bg-teal-950/20 border border-teal-500/30 rounded-xl space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-teal-500/20">
            <span className="font-bold text-teal-800 dark:text-teal-300 text-base">{result.name}</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-teal-600 text-white">
              {result.status}
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block">IHS Practitioner Number</span>
              <span className="font-mono font-bold text-slate-800 dark:text-white text-sm">{result.ihsNumber}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Nomor STR</span>
              <span className="font-mono font-bold text-slate-800 dark:text-white">{result.strNumber}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Nomor SIP</span>
              <span className="font-mono font-bold text-slate-800 dark:text-white">{result.sipNumber}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Kualifikasi</span>
              <span className="font-bold text-slate-800 dark:text-white">{result.qualification}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ReferensiPasienTab() {
  const [nik, setNik] = useState('');
  const [result, setResult] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nik.trim()) return;
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      setResult({
        ihsNumber: 'IHS-P-1000847291',
        nik: nik,
        name: 'SITI RAHMAWATI',
        gender: 'Perempuan',
        birthDate: '1992-08-17',
        status: 'Terverifikasi Dukcapil'
      });
      toast.success('Data Pasien (IHS Number) terverifikasi di SatuSehat!');
    }, 600);
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-5">
      <div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-white">Lookup Referensi Pasien SatuSehat (IHS Patient)</h3>
        <p className="text-xs text-slate-500">Verifikasi identitas pasien dan perolehan nomor rekam medis nasional.</p>
      </div>

      <form onSubmit={handleLookup} className="flex gap-2">
        <input
          type="text"
          value={nik}
          onChange={e => setNik(e.target.value)}
          placeholder="Masukkan NIK Pasien (16 digit)..."
          className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-sm focus:ring-2 focus:ring-teal-500 outline-none font-mono"
        />
        <button
          type="submit"
          disabled={isSearching}
          className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold flex items-center gap-2"
        >
          {isSearching ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          Cari Pasien
        </button>
      </form>

      {result && (
        <div className="p-5 bg-teal-50/50 dark:bg-teal-950/20 border border-teal-500/30 rounded-xl space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-teal-500/20">
            <span className="font-bold text-teal-800 dark:text-teal-300 text-base">{result.name}</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-teal-600 text-white">
              {result.status}
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block">IHS Patient Number</span>
              <span className="font-mono font-bold text-slate-800 dark:text-white text-sm">{result.ihsNumber}</span>
            </div>
            <div>
              <span className="text-slate-400 block">NIK</span>
              <span className="font-mono font-bold text-slate-800 dark:text-white">{result.nik}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Jenis Kelamin</span>
              <span className="font-bold text-slate-800 dark:text-white">{result.gender}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Tanggal Lahir</span>
              <span className="font-bold text-slate-800 dark:text-white">{result.birthDate}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MappingGenericTab({ title, type }: { title: string; type: string }) {
  const [items, setItems] = useState(() => {
    
    
    if (type === 'organization') {
      return [
        { id: '1', local: 'Instalasi Rawat Jalan', fhir: 'ORG-RJ-1002', status: 'Mapped' },
        { id: '2', local: 'Instalasi Rawat Inap', fhir: 'ORG-RI-1003', status: 'Mapped' },
        { id: '3', local: 'Instalasi Gawat Darurat (IGD)', fhir: 'ORG-IGD-1001', status: 'Mapped' }
      ];
    }
    if (type === 'kfa') {
      return [
        { id: '1', local: 'Paracetamol 500mg Tab', fhir: '93001029 (KFA)', status: 'Mapped' },
        { id: '2', local: 'Amoxicillin 500mg Cap', fhir: '93002811 (KFA)', status: 'Mapped' },
        { id: '3', local: 'Amlodipine 10mg Tab', fhir: '93004512 (KFA)', status: 'Mapped' }
      ];
    }
    if (type === 'loinc') {
      return [
        { id: '1', local: 'Hemoglobin Darah Lengkap', fhir: '718-7 (LOINC)', status: 'Mapped' },
        { id: '2', local: 'Glukosa Darah Sewaktu (GDS)', fhir: '2345-7 (LOINC)', status: 'Mapped' },
        { id: '3', local: 'Kolesterol Total', fhir: '2093-3 (LOINC)', status: 'Mapped' }
      ];
    }
    return [
      { id: '1', local: 'Poli Penyakit Dalam', fhir: 'LOC-INT-01', status: 'Mapped' },
      { id: '2', local: 'Poli Anak & Tumbuh Kembang', fhir: 'LOC-PED-01', status: 'Mapped' }
    ];
  });

  const [localInput, setLocalInput] = useState('');
  const [fhirInput, setFhirInput] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!localInput || !fhirInput) return;
    const newItems = [...items, { id: String(Date.now()), local: localInput, fhir: fhirInput, status: 'Mapped' }];
    setItems(newItems);

    setLocalInput('');
    setFhirInput('');
    toast.success('Mapping berhasil ditambahkan!');
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-5">
      <div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-white">{title}</h3>
        <p className="text-xs text-slate-500">Korelasi kode internal SIMRS dengan standar Kemenkes SatuSehat.</p>
      </div>

      <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={localInput}
          onChange={e => setLocalInput(e.target.value)}
          placeholder="Nama / Kode Lokal SIMRS..."
          className="flex-1 px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-xs focus:ring-2 focus:ring-teal-500 outline-none"
        />
        <input
          type="text"
          value={fhirInput}
          onChange={e => setFhirInput(e.target.value)}
          placeholder="Kode Standar SatuSehat (KFA/LOINC/IHS)..."
          className="flex-1 px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-xs focus:ring-2 focus:ring-teal-500 outline-none font-mono"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-bold"
        >
          Simpan Mapping
        </button>
      </form>

      <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="p-3">Data Internal SIMRS</th>
              <th className="p-3">Standar SatuSehat Kemenkes</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {items.map((item: any) => (
              <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">{item.local}</td>
                <td className="p-3 font-mono font-bold text-teal-600 dark:text-teal-400">{item.fhir}</td>
                <td className="p-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">
                    {item.status}
                  </span>
                </td>
                <td className="p-3 text-right">
                  <button
                    onClick={() => {
                      const updated = items.filter((x: any) => x.id !== item.id);
                      setItems(updated);

                      toast.success('Mapping dihapus');
                    }}
                    className="text-rose-500 hover:underline text-xs"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DataResponseTab() {
  const samplePayload = {
    resourceType: "Bundle",
    type: "transaction",
    entry: [
      {
        fullUrl: "urn:uuid:enc-001",
        resource: {
          resourceType: "Encounter",
          status: "finished",
          class: {
            system: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
            code: "AMB",
            display: "ambulatory"
          },
          subject: {
            reference: "Patient/IHS-P-1000847291",
            display: "Siti Rahmawati"
          }
        },
        request: {
          method: "POST",
          url: "Encounter"
        }
      }
    ]
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">FHIR R4 Bundle Payload & Response Viewer</h3>
          <p className="text-xs text-slate-500">Pratinjau struktur format JSON standar HL7 FHIR yang dikirimkan ke Kemenkes.</p>
        </div>
        <button
          onClick={() => {
            navigator.clipboard.writeText(JSON.stringify(samplePayload, null, 2));
            toast.success('Payload JSON disalin ke clipboard!');
          }}
          className="px-3 py-1.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold"
        >
          Salin JSON
        </button>
      </div>

      <pre className="p-4 bg-slate-950 text-emerald-400 font-mono text-xs rounded-xl overflow-x-auto border border-slate-800 max-h-96">
        {JSON.stringify(samplePayload, null, 2)}
      </pre>
    </div>
  );
}

function VerifikasiKYCTab() {
  const [qrCodeData] = useState('https://link.kemkes.go.id/kyc-satusehat-faskes-1002');

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm text-center max-w-xl mx-auto space-y-4">
      <UserCheck className="w-12 h-12 text-teal-600 mx-auto" />
      <h3 className="text-lg font-bold text-slate-800 dark:text-white">Verifikasi KYC SatuSehat Fasyankes</h3>
      <p className="text-xs text-slate-500">
        Fasilitas kesehatan ini telah terverifikasi secara resmi di Kementerian Kesehatan RI dengan Akreditasi Paripurna.
      </p>

      <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 inline-block font-mono text-xs text-slate-600 dark:text-slate-300">
        KYC-ID: <strong>KEMKES-KYC-MYITARU-2026</strong>
      </div>
      <br />
      <button
        onClick={() => toast.success('Status KYC: TERVERIFIKASI & AKTIF')}
        className="px-5 py-2.5 bg-teal-600 text-white rounded-xl text-xs font-bold shadow-md hover:bg-teal-500"
      >
        Cek Status KYC Terbaru
      </button>
    </div>
  );
}

function PengaturanSatuSehatTab() {
  const [form, setForm] = useState({
    clientId: 'KEMENKES-PROD-99821-X',
    clientSecret: '****************',
    orgId: 'ORG-1002345',
    authUrl: 'https://api-satusehat.kemkes.go.id/oauth2/v1',
    fhirUrl: 'https://api-satusehat.kemkes.go.id/fhir-r4/v1',
    env: 'Production'
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('simrs_satusehat_config', JSON.stringify(form));
    toast.success('Konfigurasi SatuSehat Kemenkes berhasil disimpan!');
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm max-w-2xl mx-auto space-y-5">
      <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
        <Key className="w-5 h-5 text-teal-600" />
        Kredensial & Pengaturan OAuth2 SatuSehat
      </h3>

      <form onSubmit={handleSave} className="space-y-4 text-xs">
        <div>
          <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Environment</label>
          <select
            value={form.env}
            onChange={e => setForm({ ...form, env: e.target.value })}
            className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 font-medium"
          >
            <option value="Production">Production (Live Server)</option>
            <option value="Staging">Development / Sandbox Staging</option>
          </select>
        </div>

        <div>
          <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Organization ID (Fasyankes)</label>
          <input
            type="text"
            value={form.orgId}
            onChange={e => setForm({ ...form, orgId: e.target.value })}
            className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 font-mono"
            required
          />
        </div>

        <div>
          <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Client ID</label>
          <input
            type="text"
            value={form.clientId}
            onChange={e => setForm({ ...form, clientId: e.target.value })}
            className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 font-mono"
            required
          />
        </div>

        <div>
          <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Client Secret</label>
          <input
            type="password"
            value={form.clientSecret}
            onChange={e => setForm({ ...form, clientSecret: e.target.value })}
            className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 font-mono"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl font-bold shadow-md shadow-teal-900/20"
        >
          Simpan Konfigurasi Kemenkes
        </button>
      </form>
    </div>
  );
}

