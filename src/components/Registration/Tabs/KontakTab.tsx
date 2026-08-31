import React from 'react';
import { RegistrationFormState } from './types';
import { Trash2, MapPin } from 'lucide-react';
import { DATA_WILAYAH_INDONESIA } from '../../../data/wilayahIndonesia';

interface Props {
  data: RegistrationFormState;
  onChange: (field: string, value: any) => void;
}

export function KontakTab({ data, onChange }: Props) {
  const inputClass = "w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-500 outline-none font-medium text-xs";
  const labelClass = "block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1";

  const handleSamaDenganKtp = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    onChange('samaDenganKtp', checked);
    if (checked) {
      onChange('alamatDomisili', data.alamatKtp);
    }
  };

  // Helper lists for cascading region dropdowns
  const provinsiList = DATA_WILAYAH_INDONESIA.map(p => p.nama);
  const selectedProvObj = DATA_WILAYAH_INDONESIA.find(p => p.nama === data.provinsi);
  const kotaList = selectedProvObj ? selectedProvObj.kota.map(k => k.nama) : [];
  const selectedKotaObj = selectedProvObj ? selectedProvObj.kota.find(k => k.nama === data.kotaKabupaten) : undefined;
  const kecamatanList = selectedKotaObj ? selectedKotaObj.kecamatan.map(k => k.nama) : [];
  const selectedKecObj = selectedKotaObj ? selectedKotaObj.kecamatan.find(k => k.nama === data.kecamatan) : undefined;
  const kelurahanList = selectedKecObj ? selectedKecObj.kelurahan : [];

  const updateFullFormattedAddress = (prov: string, kota: string, kec: string, kel: string) => {
    const detailJalan = (data.alamatKtp || '').split(', Kel.')[0].split(', Kec.')[0] || '';
    const parts = [
      detailJalan.trim(),
      kel ? `Kel. ${kel}` : '',
      kec ? `Kec. ${kec}` : '',
      kota ? kota : '',
      prov ? `Prov. ${prov}` : ''
    ].filter(Boolean);
    const newFormatted = parts.join(', ');
    if (newFormatted) {
      onChange('alamatKtp', newFormatted);
      if (data.samaDenganKtp) {
        onChange('alamatDomisili', newFormatted);
      }
    }
  };

  const handleProvinsiChange = (val: string) => {
    onChange('provinsi', val);
    onChange('kotaKabupaten', '');
    onChange('kecamatan', '');
    onChange('kelurahan', '');
    updateFullFormattedAddress(val, '', '', '');
  };

  const handleKotaChange = (val: string) => {
    onChange('kotaKabupaten', val);
    onChange('kecamatan', '');
    onChange('kelurahan', '');
    updateFullFormattedAddress(data.provinsi, val, '', '');
  };

  const handleKecamatanChange = (val: string) => {
    onChange('kecamatan', val);
    onChange('kelurahan', '');
    updateFullFormattedAddress(data.provinsi, data.kotaKabupaten, val, '');
  };

  const handleKelurahanChange = (val: string) => {
    onChange('kelurahan', val);
    updateFullFormattedAddress(data.provinsi, data.kotaKabupaten, data.kecamatan, val);
  };

  const addKontakDarurat = () => {
    if (data.kontakDarurat.length >= 3) return;
    onChange('kontakDarurat', [...data.kontakDarurat, { nama: '', hubungan: '', noHp: '', alamat: '' }]);
  };

  const updateKontak = (index: number, field: string, value: string) => {
    const newKontak = [...data.kontakDarurat];
    newKontak[index] = { ...newKontak[index], [field]: value };
    onChange('kontakDarurat', newKontak);
  };

  const removeKontak = (index: number) => {
    const newKontak = [...data.kontakDarurat];
    newKontak.splice(index, 1);
    onChange('kontakDarurat', newKontak);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>
            Alamat Detail Sesuai KTP (Nama Jalan, No. Rumah) <span className="text-red-500">*</span>
          </label>
          <textarea 
            rows={2}
            value={data.alamatKtp} 
            onChange={e => {
              onChange('alamatKtp', e.target.value);
              if (data.samaDenganKtp) onChange('alamatDomisili', e.target.value);
            }}
            placeholder="Cth: Jl. Kebon Sirih No. 12..."
            className={inputClass} 
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className={labelClass}>Alamat Domisili <span className="text-red-500">*</span></label>
            <label className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 cursor-pointer font-semibold">
              <input type="checkbox" checked={data.samaDenganKtp} onChange={handleSamaDenganKtp} className="w-4 h-4 rounded text-blue-600 dark:text-cyan-500" />
              Sama dengan KTP
            </label>
          </div>
          <textarea 
            rows={2}
            disabled={data.samaDenganKtp}
            value={data.alamatDomisili} 
            onChange={e => onChange('alamatDomisili', e.target.value)}
            placeholder="Cth: Jl. Kebon Sirih No. 12..."
            className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-500 outline-none text-xs font-medium ${
              data.samaDenganKtp 
                ? 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400' 
                : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white'
            }`}
          />
        </div>

        <div className="flex gap-3">
          <div className="w-1/2">
            <label className={labelClass}>RT</label>
            <input type="text" maxLength={3} value={data.rt} onChange={e => onChange('rt', e.target.value)} className={inputClass} placeholder="001" />
          </div>
          <div className="w-1/2">
            <label className={labelClass}>RW</label>
            <input type="text" maxLength={3} value={data.rw} onChange={e => onChange('rw', e.target.value)} className={inputClass} placeholder="002" />
          </div>
        </div>

        {/* Integrated Wilayah Dropdowns */}
        <div>
          <label className={labelClass}>Provinsi <span className="text-red-500">*</span></label>
          <select 
            value={data.provinsi} 
            onChange={e => handleProvinsiChange(e.target.value)}
            className={inputClass}
          >
            <option value="">-- Pilih Provinsi --</option>
            {provinsiList.map(prov => (
              <option key={prov} value={prov}>{prov}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Kota / Kabupaten <span className="text-red-500">*</span></label>
          <select 
            value={data.kotaKabupaten} 
            onChange={e => handleKotaChange(e.target.value)}
            disabled={!data.provinsi}
            className={`${inputClass} disabled:opacity-50`}
          >
            <option value="">-- Pilih Kota/Kabupaten --</option>
            {kotaList.map(kt => (
              <option key={kt} value={kt}>{kt}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Kecamatan <span className="text-red-500">*</span></label>
          <select 
            value={data.kecamatan} 
            onChange={e => handleKecamatanChange(e.target.value)}
            disabled={!data.kotaKabupaten}
            className={`${inputClass} disabled:opacity-50`}
          >
            <option value="">-- Pilih Kecamatan --</option>
            {kecamatanList.map(kc => (
              <option key={kc} value={kc}>{kc}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Kelurahan / Desa <span className="text-red-500">*</span></label>
          <select 
            value={data.kelurahan} 
            onChange={e => handleKelurahanChange(e.target.value)}
            disabled={!data.kecamatan}
            className={`${inputClass} disabled:opacity-50`}
          >
            <option value="">-- Pilih Kelurahan/Desa --</option>
            {kelurahanList.map(kl => (
              <option key={kl} value={kl}>{kl}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Kode Pos</label>
          <input type="text" maxLength={5} value={data.kodePos} onChange={e => onChange('kodePos', e.target.value)} className={inputClass} placeholder="Cth: 40132" />
        </div>

        <div>
          <label className={labelClass}>No HP Utama <span className="text-red-500">*</span></label>
          <input type="text" value={data.noHpUtama} onChange={e => onChange('noHpUtama', e.target.value)} className={inputClass} placeholder="08xxxxxxxxxx" />
        </div>

        <div>
          <label className={labelClass}>No HP Alternatif</label>
          <input type="text" value={data.noHpAlternatif} onChange={e => onChange('noHpAlternatif', e.target.value)} className={inputClass} placeholder="08xxxxxxxxxx" />
        </div>

        <div>
          <label className={labelClass}>Email Pasien</label>
          <input type="email" value={data.email} onChange={e => onChange('email', e.target.value)} className={inputClass} placeholder="pasien@email.com" />
        </div>
      </div>

      <div className="border-t border-slate-200 dark:border-slate-700 pt-6 mt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-base text-slate-800 dark:text-slate-100">Kontak Darurat</h3>
          {data.kontakDarurat.length < 3 && (
            <button type="button" onClick={addKontakDarurat} className="text-blue-600 dark:text-cyan-400 font-bold hover:underline text-xs">+ Tambah Kontak</button>
          )}
        </div>

        <div className="space-y-4">
          {data.kontakDarurat.map((kontak, idx) => (
            <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl relative">
              <button type="button" onClick={() => removeKontak(idx)} className="absolute top-4 right-4 text-rose-500 hover:text-rose-700 p-1 rounded-lg">
                <Trash2 className="w-4 h-4" />
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Nama Kontak <span className="text-red-500">*</span></label>
                  <input type="text" value={kontak.nama} onChange={e => updateKontak(idx, 'nama', e.target.value)} className={inputClass} placeholder="Nama kerabat/keluarga..." />
                </div>
                <div>
                  <label className={labelClass}>Hubungan <span className="text-red-500">*</span></label>
                  <select value={kontak.hubungan} onChange={e => updateKontak(idx, 'hubungan', e.target.value)} className={inputClass}>
                    <option value="">- Pilih Hubungan -</option>
                    <option value="Suami">Suami</option>
                    <option value="Istri">Istri</option>
                    <option value="Ayah">Ayah</option>
                    <option value="Ibu">Ibu</option>
                    <option value="Anak">Anak</option>
                    <option value="Saudara">Saudara</option>
                    <option value="Kerabat">Kerabat</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>No HP <span className="text-red-500">*</span></label>
                  <input type="text" value={kontak.noHp} onChange={e => updateKontak(idx, 'noHp', e.target.value)} className={inputClass} placeholder="08xxxxxxxxxx" />
                </div>
                <div>
                  <label className={labelClass}>Alamat</label>
                  <input type="text" value={kontak.alamat} onChange={e => updateKontak(idx, 'alamat', e.target.value)} className={inputClass} placeholder="Isi jika berbeda dengan domisili" />
                </div>
              </div>
            </div>
          ))}
          {data.kontakDarurat.length === 0 && (
            <div className="text-center p-4 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-slate-500 dark:text-slate-400 text-xs font-medium">
              Belum ada kontak darurat ditambahkan.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

