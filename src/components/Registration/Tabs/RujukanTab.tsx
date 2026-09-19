import React, { useState } from 'react';
import { RegistrationFormState } from './types';
import { Search, MapPin, ExternalLink, Sparkles, Building2, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { dokterByPenempatan, SEMUA_DOKTER } from '../../../data/seedData';
import { GoogleMapsHealthLocator, MedicalFacility } from '../../Common/GoogleMapsHealthLocator';

interface Props {
  data: RegistrationFormState;
  onChange: (field: keyof RegistrationFormState, value: any) => void;
}

export function RujukanTab({ data, onChange }: Props) {
  const [showMapsModal, setShowMapsModal] = useState(false);
  const inputClass = "w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-500 outline-none font-medium text-xs";
  const labelClass = "block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1";

  const handleSelectFacility = (fac: MedicalFacility) => {
    onChange('faskesPengirim', `${fac.name} (${fac.category})`);
    setShowMapsModal(false);
    toast.success(`Faskes rujukan "${fac.name}" berhasil dipilih dari Google Maps!`);
  };

  const checkRujukan = () => {
    toast.success('Rujukan ditemukan! Data disinkronisasi.');
    onChange('faskesPengirim', 'Puskesmas Melati');
    onChange('diagnosisRujukan', 'E11.9 - Type 2 diabetes mellitus');
    onChange('tanggalRujukan', new Date().toISOString().split('T')[0]);
  };

  const getPoliList = () => {
    const list = new Set<string>();
    dokterByPenempatan('Poli').forEach(d => list.add(d.poli));
    return Array.from(list).sort();
  };

  const availableDoctors = data.jenisKunjungan === 'IGD' 
    ? dokterByPenempatan('IGD')
    : SEMUA_DOKTER.filter(d => !data.poliTujuan || d.poli === data.poliTujuan);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-bold text-base text-slate-800 dark:text-slate-100 mb-4">Informasi Kunjungan</h3>
        
        <div className="mb-5">
          <label className={labelClass}>Jenis Kunjungan <span className="text-red-500">*</span></label>
          <div className="flex flex-wrap gap-4 mt-2">
            {['Rawat Jalan', 'IGD', 'Rawat Inap', 'One Day Care', 'Medical Check-Up'].map(jenis => (
              <label key={jenis} className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-300">
                <input 
                  type="radio" 
                  name="jenisKunjungan" 
                  value={jenis} 
                  checked={data.jenisKunjungan === jenis} 
                  onChange={e => onChange('jenisKunjungan', e.target.value)}
                  className="w-4 h-4 text-blue-600 dark:text-cyan-500 focus:ring-blue-500"
                />
                <span>{jenis}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {data.jenisKunjungan !== 'IGD' && (
            <div>
              <label className={labelClass}>Poli Tujuan <span className="text-red-500">*</span></label>
              <select 
                value={data.poliTujuan} 
                onChange={e => onChange('poliTujuan', e.target.value)}
                className={inputClass}
              >
                <option value="">- Pilih Poli -</option>
                {getPoliList().map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          )}
          
          <div>
            <label className={labelClass}>
              Dokter Pilihan (Opsional)
            </label>
            <select 
              value={data.dokterPilihan} 
              onChange={e => onChange('dokterPilihan', e.target.value)}
              className={inputClass}
            >
              <option value="">- Dokter Tersedia -</option>
              {availableDoctors.map(d => (
                <option key={d.id} value={d.nama}>{d.nama} - {d.spesialis || d.poli}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
          <div>
            <label className={labelClass}>Sumber Informasi Pasien</label>
            <select 
              value={data.sumberInformasi} 
              onChange={e => onChange('sumberInformasi', e.target.value)}
              className={inputClass}
            >
              <option value="">- Pilih Sumber -</option>
              <option value="Walk-in">Datang Langsung (Walk-in)</option>
              <option value="Rujukan Klinik/Klinik">Rujukan Klinik / Faskes</option>
              <option value="Keluarga/Teman">Keluarga / Teman</option>
              <option value="Website/Internet">Website / Internet</option>
              <option value="Media Sosial">Media Sosial</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Cara Datang</label>
            <select 
              value={data.caraDatang} 
              onChange={e => onChange('caraDatang', e.target.value)}
              className={inputClass}
            >
              <option value="">- Pilih Cara Datang -</option>
              <option value="Sendiri/Keluarga">Sendiri / Diantar Keluarga</option>
              <option value="Ambulans">Ambulans</option>
              <option value="Diantar Polisi">Diantar Polisi</option>
            </select>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200 dark:border-slate-700 pt-6 mt-6">
        <h3 className="font-bold text-base text-slate-800 dark:text-slate-100 mb-4">Informasi Rujukan</h3>
        <div className="mb-4">
          <label className={labelClass}>Ada Rujukan?</label>
          <div className="flex gap-4 mt-1">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-300">
              <input type="radio" name="adaRujukan" value="Ya" checked={data.adaRujukan === 'Ya'} onChange={e => onChange('adaRujukan', 'Ya')} className="w-4 h-4 text-blue-600 dark:text-cyan-500" />
              <span>Ya</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-300">
              <input type="radio" name="adaRujukan" value="Tidak" checked={data.adaRujukan === 'Tidak'} onChange={e => onChange('adaRujukan', 'Tidak')} className="w-4 h-4 text-blue-600 dark:text-cyan-500" />
              <span>Tidak</span>
            </label>
          </div>
        </div>
        {data.adaRujukan === 'Ya' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-slate-50 dark:bg-slate-800/60 p-5 rounded-xl border border-slate-200 dark:border-slate-700">
            <div>
              <label className={labelClass}>Jenis Rujukan</label>
              <select value={data.jenisRujukan} onChange={e => onChange('jenisRujukan', e.target.value)} className={inputClass}>
                <option value="BPJS">Rujukan BPJS (Faskes 1 / RS)</option>
                <option value="Non-BPJS">Rujukan Umum / Dokter Spesialis</option>
              </select>
            </div>
            
            <div className="relative">
              <label className={labelClass}>No Rujukan <span className="text-red-500">*</span></label>
              <div className="flex gap-2">
                <input type="text" value={data.noRujukan} onChange={e => onChange('noRujukan', e.target.value)} className={inputClass} placeholder="Nomor surat rujukan..." />
                <button type="button" onClick={checkRujukan} className="bg-blue-600 dark:bg-cyan-600 text-white px-3.5 rounded-lg hover:bg-blue-700 dark:hover:bg-cyan-500 transition-colors"><Search className="w-4 h-4" /></button>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className={labelClass}>Faskes Pengirim</label>
                <button
                  type="button"
                  onClick={() => setShowMapsModal(true)}
                  className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                >
                  <MapPin className="w-3 h-3" />
                  <span>Cari di Google Maps</span>
                </button>
              </div>
              <div className="flex gap-2">
                <input type="text" value={data.faskesPengirim} onChange={e => onChange('faskesPengirim', e.target.value)} className={inputClass} placeholder="Nama faskes pengirim..." />
                <button
                  type="button"
                  onClick={() => setShowMapsModal(true)}
                  title="Cari lokasi & jejaring faskes di Google Maps"
                  className="px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center justify-center transition"
                >
                  <MapPin className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div>
              <label className={labelClass}>Tanggal Rujukan</label>
              <input type="date" value={data.tanggalRujukan} onChange={e => onChange('tanggalRujukan', e.target.value)} className={inputClass} />
            </div>
            
            <div className="md:col-span-2">
              <label className={labelClass}>Diagnosis Rujukan (ICD-10)</label>
              <input type="text" value={data.diagnosisRujukan} onChange={e => onChange('diagnosisRujukan', e.target.value)} className={inputClass} placeholder="Cth: E11.9 - Diabetes Mellitus" />
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-slate-200 dark:border-slate-700 pt-6 mt-6">
        <h3 className="font-bold text-base text-slate-800 dark:text-slate-100 mb-4">Surat Kontrol Ulang</h3>
        <div className="mb-4">
          <label className={labelClass}>Ada Surat Kontrol?</label>
          <div className="flex gap-4 mt-1">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-300">
              <input type="radio" name="adaSuratKontrol" value="Ya" checked={data.adaSuratKontrol === 'Ya'} onChange={e => onChange('adaSuratKontrol', 'Ya')} className="w-4 h-4 text-blue-600 dark:text-cyan-500" />
              <span>Ya</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-300">
              <input type="radio" name="adaSuratKontrol" value="Tidak" checked={data.adaSuratKontrol === 'Tidak'} onChange={e => onChange('adaSuratKontrol', 'Tidak')} className="w-4 h-4 text-blue-600 dark:text-cyan-500" />
              <span>Tidak</span>
            </label>
          </div>
        </div>
        {data.adaSuratKontrol === 'Ya' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-slate-50 dark:bg-slate-800/60 p-5 rounded-xl border border-slate-200 dark:border-slate-700">
            <div>
              <label className={labelClass}>No Surat Kontrol</label>
              <input type="text" value={data.noSuratKontrol} onChange={e => onChange('noSuratKontrol', e.target.value)} className={inputClass} placeholder="No SKDP / Surat Kontrol..." />
            </div>
            <div>
              <label className={labelClass}>Tanggal Kontrol</label>
              <input type="date" value={data.tanggalKontrol} onChange={e => onChange('tanggalKontrol', e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Dokter Penanggung Jawab</label>
              <input type="text" value={data.dokterSK} onChange={e => onChange('dokterSK', e.target.value)} className={inputClass} placeholder="Nama dokter..." />
            </div>
            <div>
              <label className={labelClass}>Poli Tujuan Kontrol</label>
              <input type="text" value={data.poliSK} onChange={e => onChange('poliSK', e.target.value)} className={inputClass} placeholder="Nama poli..." />
            </div>
          </div>
        )}
      </div>

      {/* Google Maps Faskes Selector Modal */}
      {showMapsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-800 w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-4 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h4 className="font-bold text-sm text-slate-800 dark:text-white">
                  Pilih Faskes Rujukan Terverifikasi di Google Maps
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setShowMapsModal(false)}
                className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white transition"
              >
                ✕
              </button>
            </div>
            
            <div className="p-4 overflow-y-auto flex-1">
              <GoogleMapsHealthLocator
                initialQuery="Puskesmas dan RS Rujukan BPJS terdekat"
                defaultCategory="bpjs"
                onSelectFacility={handleSelectFacility}
                selectButtonLabel="Pilih Sebagai Faskes Pengirim"
                title="Google Maps Faskes & Rujukan Selector"
                subtitle="Cari dan hubungkan fasilitas kesehatan pengirim rujukan secara akurat"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

