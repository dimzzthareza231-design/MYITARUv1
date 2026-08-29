import React from 'react';
import { RegistrationFormState } from './types';
import { Search, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import { dokterByPenempatan, SEMUA_DOKTER } from '../../../data/seedData';

interface Props {
  data: RegistrationFormState;
  onChange: (field: keyof RegistrationFormState, value: any) => void;
}

export function RujukanTab({ data, onChange }: Props) {
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
      <div className="mb-6">
        <h3 className="font-bold text-lg text-slate-800 mb-4">Informasi Kunjungan</h3>
        
        <div className="mb-4">
          <label className="block text-sm font-bold text-slate-700 mb-1">Jenis Kunjungan <span className="text-red-500">*</span></label>
          <div className="flex flex-wrap gap-4">
            {['Rawat Jalan', 'IGD', 'Rawat Inap', 'One Day Care', 'Medical Check-Up'].map(jenis => (
              <label key={jenis} className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="jenisKunjungan" 
                  value={jenis} 
                  checked={data.jenisKunjungan === jenis} 
                  onChange={e => onChange('jenisKunjungan', e.target.value)}
                  className="text-blue-600"
                />
                <span>{jenis}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.jenisKunjungan !== 'IGD' && (
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Poli Tujuan</label>
              <select 
                value={data.poliTujuan} 
                onChange={e => onChange('poliTujuan', e.target.value)}
                className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-black font-medium"
              >
                <option value="">- Pilih Poli -</option>
                {getPoliList().map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">
              Dokter Pilihan (Opsional)
            </label>
            <select 
              value={data.dokterPilihan} 
              onChange={e => onChange('dokterPilihan', e.target.value)}
              className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-black font-medium"
            >
              <option value="">- Dokter Tersedia -</option>
              {availableDoctors.map(d => (
                <option key={d.id} value={d.nama}>{d.nama} - {d.spesialis || d.poli}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Sumber Informasi</label>
            <select 
              value={data.sumberInformasi} 
              onChange={e => onChange('sumberInformasi', e.target.value)}
              className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-black font-medium"
            >
              <option value="">- Pilih -</option>
              <option value="Walk-in">Datang Langsung (Walk-in)</option>
              <option value="Rujukan Klinik/Klinik">Rujukan Klinik/Klinik</option>
              <option value="Keluarga/Teman">Keluarga/Teman</option>
              <option value="Website/Internet">Website/Internet</option>
              <option value="Media Sosial">Media Sosial</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Cara Datang</label>
            <select 
              value={data.caraDatang} 
              onChange={e => onChange('caraDatang', e.target.value)}
              className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-black font-medium"
            >
              <option value="">- Pilih -</option>
              <option value="Sendiri/Keluarga">Sendiri / Diantar Keluarga</option>
              <option value="Ambulans">Ambulans</option>
              <option value="Diantar Polisi">Diantar Polisi</option>
            </select>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200 pt-6 mt-6">
        <h3 className="font-bold text-lg text-slate-800 mb-4">Informasi Rujukan</h3>
        <div className="mb-4">
          <label className="block text-sm font-bold text-slate-700 mb-2">Ada Rujukan?</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="adaRujukan" value="Ya" checked={data.adaRujukan === 'Ya'} onChange={e => onChange('adaRujukan', 'Ya')} className="text-blue-600" />
              <span>Ya</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="adaRujukan" value="Tidak" checked={data.adaRujukan === 'Tidak'} onChange={e => onChange('adaRujukan', 'Tidak')} className="text-blue-600" />
              <span>Tidak</span>
            </label>
          </div>
        </div>
        {data.adaRujukan === 'Ya' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Jenis Rujukan</label>
              <select value={data.jenisRujukan} onChange={e => onChange('jenisRujukan', e.target.value)} className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-black font-medium">
                <option value="BPJS">Rujukan BPJS</option>
                <option value="Non-BPJS">Rujukan Umum/Lainnya</option>
              </select>
            </div>
            
            <div className="relative">
              <label className="block text-sm font-bold text-slate-700 mb-1">No Rujukan <span className="text-red-500">*</span></label>
              <div className="flex gap-2">
                <input type="text" value={data.noRujukan} onChange={e => onChange('noRujukan', e.target.value)} className="flex-1 p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-black font-medium" />
                <button type="button" onClick={checkRujukan} className="bg-blue-600 text-white px-3 rounded hover:bg-blue-700"><Search className="w-4 h-4" /></button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Faskes Pengirim</label>
              <input type="text" value={data.faskesPengirim} onChange={e => onChange('faskesPengirim', e.target.value)} className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-black font-medium" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Tanggal Rujukan</label>
              <input type="date" value={data.tanggalRujukan} onChange={e => onChange('tanggalRujukan', e.target.value)} className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-black font-medium" />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-1">Diagnosis Rujukan (ICD-10)</label>
              <input type="text" value={data.diagnosisRujukan} onChange={e => onChange('diagnosisRujukan', e.target.value)} className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-black font-medium" placeholder="Cth: E11.9" />
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-slate-200 pt-6 mt-6">
        <h3 className="font-bold text-lg text-slate-800 mb-4">Surat Kontrol</h3>
        <div className="mb-4">
          <label className="block text-sm font-bold text-slate-700 mb-2">Ada Surat Kontrol?</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="adaSuratKontrol" value="Ya" checked={data.adaSuratKontrol === 'Ya'} onChange={e => onChange('adaSuratKontrol', 'Ya')} className="text-blue-600" />
              <span>Ya</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="adaSuratKontrol" value="Tidak" checked={data.adaSuratKontrol === 'Tidak'} onChange={e => onChange('adaSuratKontrol', 'Tidak')} className="text-blue-600" />
              <span>Tidak</span>
            </label>
          </div>
        </div>
        {data.adaSuratKontrol === 'Ya' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">No Surat Kontrol</label>
              <input type="text" value={data.noSuratKontrol} onChange={e => onChange('noSuratKontrol', e.target.value)} className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-black font-medium" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Tanggal Kontrol</label>
              <input type="date" value={data.tanggalKontrol} onChange={e => onChange('tanggalKontrol', e.target.value)} className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-black font-medium" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Dokter</label>
              <input type="text" value={data.dokterSK} onChange={e => onChange('dokterSK', e.target.value)} className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-black font-medium" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Poli</label>
              <input type="text" value={data.poliSK} onChange={e => onChange('poliSK', e.target.value)} className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-black font-medium" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
