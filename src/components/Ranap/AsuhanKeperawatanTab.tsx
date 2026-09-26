import React, { useState, useEffect } from 'react';
import { 
  HeartPulse, Activity, ClipboardList, Plus, Search, Filter, 
  CheckCircle2, Clock, User, AlertTriangle, ShieldCheck, Thermometer,
  Droplets, FileText, Send, Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Modal } from '../Modal';

interface AsuhanKeperawatanItem {
  id: string;
  bed_id: string;
  ruangan: string;
  no_rm: string;
  nama_pasien: string;
  usia: number;
  sdki_diagnosa: string;
  slki_luaran: string;
  siki_intervensi: string[];
  vital_signs: {
    td: string;
    hr: number;
    suhu: number;
    rr: number;
    spo2: number;
    nyeri: number;
    gcs: string;
  };
  shift: 'Pagi' | 'Siang' | 'Malam';
  perawat_pj: string;
  tgl_catat: string;
  sbar_catatan: {
    situation: string;
    background: string;
    assessment: string;
    recommendation: string;
  };
}

const INITIAL_ASKEP_DATA: AsuhanKeperawatanItem[] = [
  {
    id: 'ASK-001',
    bed_id: 'B-101',
    ruangan: 'Mawar (Kamar 101)',
    no_rm: 'RM-260714-0012',
    nama_pasien: 'Ahmad Yani',
    usia: 52,
    sdki_diagnosa: 'D.0001 Bersihan Jalan Napas Tidak Efektif b.d Spasme Jalan Napas',
    slki_luaran: 'L.01001 Bersihan Jalan Napas Meningkat (Batuk efektif meningkat, sputum menurun)',
    siki_intervensi: [
      'I.01011 Manajemen Jalan Napas (Fowler/Semi-fowler)',
      'I.01014 Pemantauan Respirasi (Frekuensi, irama, kedalaman)',
      'I.01018 Fisioterapi Dada & Nebulisasi Ventolin 2.5mg'
    ],
    vital_signs: {
      td: '120/80',
      hr: 82,
      suhu: 36.8,
      rr: 20,
      spo2: 98,
      nyeri: 2,
      gcs: 'E4M6V5 (15)'
    },
    shift: 'Pagi',
    perawat_pj: 'Ns. Siti Rahmawati, S.Kep',
    tgl_catat: 'Hari ini, 07:30 WIB',
    sbar_catatan: {
      situation: 'Pasien batuk berdahak berkurang setelah nebulisasi pertama.',
      background: 'Post MRS hari ke-2 dengan diagnosa Pneumonia.',
      assessment: 'Ronkhi basah halus berkurang di lobus kanan bawah, SpO2 stabil 98% room air.',
      recommendation: 'Lanjutkan nebulisasi jam 14:00 WIB dan observasi RR per 4 jam.'
    }
  },
  {
    id: 'ASK-002',
    bed_id: 'B-102',
    ruangan: 'Melati (Kamar 204)',
    no_rm: 'RM-260715-0034',
    nama_pasien: 'Siti Aminah',
    usia: 46,
    sdki_diagnosa: 'D.0077 Nyeri Akut b.d Agen Pencedera Fisik (Post Op Laparatomi H-1)',
    slki_luaran: 'L.08066 Tingkat Nyeri Menurun (Keluhan nyeri menurun, meringis menurun)',
    siki_intervensi: [
      'I.08238 Manajemen Nyeri (Identifikasi lokasi, karakteristik, durasi)',
      'I.08243 Pemberian Analgesik (Ketorolac 30mg IV sesuai instruksi DPJP)',
      'I.08240 Terapi Relaksasi Napas Dalam'
    ],
    vital_signs: {
      td: '115/75',
      hr: 88,
      suhu: 37.1,
      rr: 18,
      spo2: 99,
      nyeri: 4,
      gcs: 'E4M6V5 (15)'
    },
    shift: 'Pagi',
    perawat_pj: 'Ns. Hendra Kurniawan, S.Kep',
    tgl_catat: 'Hari ini, 08:00 WIB',
    sbar_catatan: {
      situation: 'Pasien mengeluh nyeri luka operasi skala 4 saat bergerak miring kanan/kiri.',
      background: 'Post Appendectomy laparotomi H-1, luka operasi terbalut kasa steril kering.',
      assessment: 'TTV stabil, tanda infeksi luka nihil, bising usus (+), flatus (+).',
      recommendation: 'Edukasi mobilisasi dini bertahap dan analgesik terjadwal jam 12:00 WIB.'
    }
  }
];

interface AsuhanKeperawatanTabProps {
  beds: any[];
}

export function AsuhanKeperawatanTab({ beds }: AsuhanKeperawatanTabProps) {
  const [askepList, setAskepList] = useState<AsuhanKeperawatanItem[]>(() => {
    const saved = localStorage.getItem('hospital_asuhan_keperawatan_ranap');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.warn(e);
      }
    }
    return INITIAL_ASKEP_DATA;
  });

  useEffect(() => {
    localStorage.setItem('hospital_asuhan_keperawatan_ranap', JSON.stringify(askepList));
  }, [askepList]);

  const [search, setSearch] = useState('');
  const [filterShift, setFilterShift] = useState('Semua');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAskep, setSelectedAskep] = useState<AsuhanKeperawatanItem | null>(null);

  // New form state
  const [formPatientBed, setFormPatientBed] = useState('');
  const [formSdki, setFormSdki] = useState('D.0077 Nyeri Akut b.d Agen Pencedera Fisik');
  const [formSlki, setFormSlki] = useState('L.08066 Tingkat Nyeri Menurun');
  const [formSiki, setFormSiki] = useState('I.08238 Manajemen Nyeri, I.08240 Terapi Relaksasi');
  const [formTd, setFormTd] = useState('120/80');
  const [formHr, setFormHr] = useState(80);
  const [formSuhu, setFormSuhu] = useState(36.7);
  const [formRr, setFormRr] = useState(20);
  const [formSpo2, setFormSpo2] = useState(98);
  const [formNyeri, setFormNyeri] = useState(3);
  const [formShift, setFormShift] = useState<'Pagi' | 'Siang' | 'Malam'>('Pagi');
  const [formPerawat, setFormPerawat] = useState('Ns. Nurul Hidayah, S.Kep');
  const [formSituation, setFormSituation] = useState('');
  const [formAssessment, setFormAssessment] = useState('');
  const [formRecommendation, setFormRecommendation] = useState('');

  const occupiedBeds = beds.filter(b => b.status === 'Terisi' && b.patient);

  const filteredList = askepList.filter(item => {
    const matchSearch = 
      item.nama_pasien.toLowerCase().includes(search.toLowerCase()) ||
      item.no_rm.toLowerCase().includes(search.toLowerCase()) ||
      item.ruangan.toLowerCase().includes(search.toLowerCase()) ||
      item.sdki_diagnosa.toLowerCase().includes(search.toLowerCase());
    const matchShift = filterShift === 'Semua' || item.shift === filterShift;
    return matchSearch && matchShift;
  });

  const handleCreateAskep = (e: React.FormEvent) => {
    e.preventDefault();
    const bedObj = beds.find(b => b.id === formPatientBed) || occupiedBeds[0];
    const patientName = bedObj ? bedObj.patient : 'Pasien Rawat Inap';
    const noRm = bedObj ? (bedObj.no_rm || 'RM-260801-0099') : 'RM-260801-0099';

    const newItem: AsuhanKeperawatanItem = {
      id: `ASK-${Date.now()}`,
      bed_id: bedObj?.id || 'B-101',
      ruangan: `${bedObj?.room || 'Bangsal'} - Bed ${bedObj?.id || '101'}`,
      no_rm: noRm,
      nama_pasien: patientName,
      usia: 45,
      sdki_diagnosa: formSdki,
      slki_luaran: formSlki,
      siki_intervensi: formSiki.split(',').map(s => s.trim()),
      vital_signs: {
        td: formTd,
        hr: Number(formHr),
        suhu: Number(formSuhu),
        rr: Number(formRr),
        spo2: Number(formSpo2),
        nyeri: Number(formNyeri),
        gcs: 'E4M6V5 (15)'
      },
      shift: formShift,
      perawat_pj: formPerawat,
      tgl_catat: 'Baru saja',
      sbar_catatan: {
        situation: formSituation || 'Kondisi umum pasien tenang dan kooperatif.',
        background: 'Rawat inap hari berjalan sesuai rencana DPJP.',
        assessment: formAssessment || 'Tanda vital dalam rentang stabil dan terkontrol.',
        recommendation: formRecommendation || 'Monitor TTV shift berikutnya dan lanjutkan terapi oral.'
      }
    };

    setAskepList([newItem, ...askepList]);
    toast.success('Dokumentasi Asuhan Keperawatan & TTV berhasil disimpan');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            Asuhan Keperawatan &amp; Pemantauan TTV Bangsal
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Dokumentasi Askep terstandar PPNI (SDKI, SLKI, SIKI), monitoring tanda vital per shift, dan serah terima Handover SBAR.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-2 transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" /> Catat Askep &amp; TTV Baru
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Cari berdasarkan Nama Pasien, No. RM, Ruangan, atau Diagnosa Keperawatan..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select 
            value={filterShift}
            onChange={e => setFilterShift(e.target.value)}
            className="text-xs py-2 px-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="Semua">Semua Shift</option>
            <option value="Pagi">Shift Pagi (07:00 - 14:00)</option>
            <option value="Siang">Shift Siang (14:00 - 21:00)</option>
            <option value="Malam">Shift Malam (21:00 - 07:00)</option>
          </select>
        </div>
      </div>

      {/* Cards of Nursing Care */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredList.map(item => (
          <div 
            key={item.id} 
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm space-y-4 hover:border-emerald-500/50 transition-colors"
          >
            {/* Top Row: Patient Info & Shift */}
            <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-700/60 pb-3">
              <div>
                <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                  {item.ruangan}
                </span>
                <h4 className="text-base font-bold text-slate-900 dark:text-white mt-1">{item.nama_pasien}</h4>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-mono font-semibold">
                  {item.no_rm} • {item.usia} Tahun
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
                  Shift {item.shift}
                </span>
                <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-end gap-1">
                  <Clock className="w-3 h-3" /> {item.tgl_catat}
                </div>
              </div>
            </div>

            {/* Vital Signs Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-100 dark:border-slate-700/60 text-center">
              <div>
                <span className="text-[10px] text-slate-400 font-bold block">TD (mmHg)</span>
                <span className="text-xs font-black text-slate-800 dark:text-slate-200">{item.vital_signs.td}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold block">HR (bpm)</span>
                <span className="text-xs font-black text-slate-800 dark:text-slate-200">{item.vital_signs.hr}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold block">Suhu (°C)</span>
                <span className="text-xs font-black text-amber-600">{item.vital_signs.suhu}°</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold block">RR (/mnt)</span>
                <span className="text-xs font-black text-slate-800 dark:text-slate-200">{item.vital_signs.rr}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold block">SpO2 (%)</span>
                <span className="text-xs font-black text-emerald-600">{item.vital_signs.spo2}%</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold block">Nyeri (0-10)</span>
                <span className={`text-xs font-black ${item.vital_signs.nyeri >= 4 ? 'text-rose-600' : 'text-slate-700 dark:text-slate-200'}`}>
                  {item.vital_signs.nyeri}/10
                </span>
              </div>
            </div>

            {/* 3S Indonesian Nursing Standards */}
            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-rose-50/60 dark:bg-rose-950/20 rounded-lg border border-rose-100 dark:border-rose-900/30">
                <span className="text-[10px] font-bold text-rose-700 dark:text-rose-300 uppercase block">SDKI (Diagnosa Keperawatan):</span>
                <span className="font-semibold text-rose-900 dark:text-rose-200">{item.sdki_diagnosa}</span>
              </div>
              <div className="p-2.5 bg-indigo-50/60 dark:bg-indigo-950/20 rounded-lg border border-indigo-100 dark:border-indigo-900/30">
                <span className="text-[10px] font-bold text-indigo-700 dark:text-indigo-300 uppercase block">SLKI (Luaran &amp; Kriteria Hasil):</span>
                <span className="font-semibold text-indigo-900 dark:text-indigo-200">{item.slki_luaran}</span>
              </div>
              <div className="p-2.5 bg-emerald-50/60 dark:bg-emerald-950/20 rounded-lg border border-emerald-100 dark:border-emerald-900/30">
                <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 uppercase block">SIKI (Intervensi Keperawatan):</span>
                <ul className="list-disc list-inside text-emerald-900 dark:text-emerald-200 space-y-0.5 mt-0.5">
                  {item.siki_intervensi.map((interv, idx) => (
                    <li key={idx}>{interv}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* SBAR Handover Box */}
            <div className="p-3 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-200/60 dark:border-slate-700/60 text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300 mb-1">
                <FileText className="w-3.5 h-3.5 text-slate-500" />
                <span>Catatan Serah Terima (Handover SBAR)</span>
              </div>
              <div className="text-slate-600 dark:text-slate-300">
                <strong className="text-slate-700 dark:text-slate-200">S:</strong> {item.sbar_catatan.situation}
              </div>
              <div className="text-slate-600 dark:text-slate-300">
                <strong className="text-slate-700 dark:text-slate-200">A:</strong> {item.sbar_catatan.assessment}
              </div>
              <div className="text-slate-600 dark:text-slate-300">
                <strong className="text-slate-700 dark:text-slate-200">R:</strong> {item.sbar_catatan.recommendation}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-[11px] text-slate-500">
              <span>Perawat PJ: <strong className="text-slate-700 dark:text-slate-300">{item.perawat_pj}</strong></span>
              <span className="text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Terverifikasi EMR
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Catat Askep */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Dokumentasi Asuhan Keperawatan & TTV Bangsal"
      >
        <form onSubmit={handleCreateAskep} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Pilih Pasien Bangsal:
            </label>
            <select
              value={formPatientBed}
              onChange={e => setFormPatientBed(e.target.value)}
              className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              {occupiedBeds.map(b => (
                <option key={b.id} value={b.id}>
                  {b.room} - Bed {b.id} ({b.patient} - {b.no_rm})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Shift:</label>
              <select
                value={formShift}
                onChange={e => setFormShift(e.target.value as any)}
                className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="Pagi">Shift Pagi (07:00 - 14:00)</option>
                <option value="Siang">Shift Siang (14:00 - 21:00)</option>
                <option value="Malam">Shift Malam (21:00 - 07:00)</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Nama Perawat PJ:</label>
              <input
                type="text"
                value={formPerawat}
                onChange={e => setFormPerawat(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                required
              />
            </div>
          </div>

          {/* TTV Inputs */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Tanda Vital (TTV):</label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              <div>
                <span className="text-[10px] text-slate-400">TD:</span>
                <input type="text" value={formTd} onChange={e => setFormTd(e.target.value)} className="w-full p-1.5 border rounded text-xs bg-white dark:bg-slate-800" placeholder="120/80" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400">Nadi (bpm):</span>
                <input type="number" value={formHr} onChange={e => setFormHr(Number(e.target.value))} className="w-full p-1.5 border rounded text-xs bg-white dark:bg-slate-800" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400">Suhu (°C):</span>
                <input type="number" step="0.1" value={formSuhu} onChange={e => setFormSuhu(Number(e.target.value))} className="w-full p-1.5 border rounded text-xs bg-white dark:bg-slate-800" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400">RR (/mnt):</span>
                <input type="number" value={formRr} onChange={e => setFormRr(Number(e.target.value))} className="w-full p-1.5 border rounded text-xs bg-white dark:bg-slate-800" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400">SpO2 (%):</span>
                <input type="number" value={formSpo2} onChange={e => setFormSpo2(Number(e.target.value))} className="w-full p-1.5 border rounded text-xs bg-white dark:bg-slate-800" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400">Nyeri (0-10):</span>
                <input type="number" min="0" max="10" value={formNyeri} onChange={e => setFormNyeri(Number(e.target.value))} className="w-full p-1.5 border rounded text-xs bg-white dark:bg-slate-800" />
              </div>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">SDKI (Diagnosa Keperawatan):</label>
            <input
              type="text"
              value={formSdki}
              onChange={e => setFormSdki(e.target.value)}
              className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">SLKI (Luaran Keperawatan):</label>
            <input
              type="text"
              value={formSlki}
              onChange={e => setFormSlki(e.target.value)}
              className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">SIKI (Intervensi Keperawatan, pisahkan koma):</label>
            <textarea
              value={formSiki}
              onChange={e => setFormSiki(e.target.value)}
              rows={2}
              className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">SBAR Situation &amp; Assessment:</label>
            <input
              type="text"
              placeholder="Situation..."
              value={formSituation}
              onChange={e => setFormSituation(e.target.value)}
              className="w-full p-2 mb-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
            <input
              type="text"
              placeholder="Recommendation..."
              value={formRecommendation}
              onChange={e => setFormRecommendation(e.target.value)}
              className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 dark:text-slate-300 font-bold"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-md flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" /> Simpan Askep &amp; TTV
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
