import React from 'react';
import { RegistrationFormState } from './types';
import { Trash2 } from 'lucide-react';

interface Props {
  data: RegistrationFormState;
  onChange: (field: string, value: any) => void;
}

export function KontakTab({ data, onChange }: Props) {
  const handleSamaDenganKtp = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    onChange('samaDenganKtp', checked);
    if (checked) {
      onChange('alamatDomisili', data.alamatKtp);
    }
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">Alamat Sesuai KTP <span className="text-red-500">*</span></label>
          <textarea 
            rows={3}
            value={data.alamatKtp} 
            onChange={e => {
              onChange('alamatKtp', e.target.value);
              if (data.samaDenganKtp) onChange('alamatDomisili', e.target.value);
            }}
            className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-black font-medium" 
          />
        </div>

        <div>
          <div className="flex justify-between items-end mb-1">
            <label className="block text-sm font-bold text-slate-700">Alamat Domisili <span className="text-red-500">*</span></label>
            <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
              <input type="checkbox" checked={data.samaDenganKtp} onChange={handleSamaDenganKtp} className="w-4 h-4 rounded text-blue-600" />
              Sama dengan KTP
            </label>
          </div>
          <textarea 
            rows={3}
            disabled={data.samaDenganKtp}
            value={data.alamatDomisili} 
            onChange={e => onChange('alamatDomisili', e.target.value)}
            className={`w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none ${data.samaDenganKtp ? 'bg-slate-100' : ''}`}
          />
        </div>

        <div className="flex gap-4">
          <div className="w-1/2">
            <label className="block text-sm font-bold text-slate-700 mb-1">RT</label>
            <input type="text" maxLength={3} value={data.rt} onChange={e => onChange('rt', e.target.value)} className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-black font-medium" />
          </div>
          <div className="w-1/2">
            <label className="block text-sm font-bold text-slate-700 mb-1">RW</label>
            <input type="text" maxLength={3} value={data.rw} onChange={e => onChange('rw', e.target.value)} className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-black font-medium" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">Kelurahan / Desa <span className="text-red-500">*</span></label>
          <input type="text" value={data.kelurahan} onChange={e => onChange('kelurahan', e.target.value)} className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-black font-medium" placeholder="Cari kelurahan..." />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">Kecamatan</label>
          <input type="text" value={data.kecamatan} onChange={e => onChange('kecamatan', e.target.value)} className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-black font-medium" />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">Kota / Kabupaten</label>
          <input type="text" value={data.kotaKabupaten} onChange={e => onChange('kotaKabupaten', e.target.value)} className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-black font-medium" />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">Provinsi</label>
          <input type="text" value={data.provinsi} onChange={e => onChange('provinsi', e.target.value)} className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-black font-medium" />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">Kode Pos</label>
          <input type="text" value={data.kodePos} onChange={e => onChange('kodePos', e.target.value)} className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-black font-medium" />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">No HP Utama <span className="text-red-500">*</span></label>
          <input type="text" value={data.noHpUtama} onChange={e => onChange('noHpUtama', e.target.value)} className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-black font-medium" placeholder="08xxx" />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">No HP Alternatif</label>
          <input type="text" value={data.noHpAlternatif} onChange={e => onChange('noHpAlternatif', e.target.value)} className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-black font-medium" />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">Email</label>
          <input type="email" value={data.email} onChange={e => onChange('email', e.target.value)} className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-black font-medium" />
        </div>
      </div>

      <div className="border-t pt-6 mt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg text-slate-800">Kontak Darurat</h3>
          {data.kontakDarurat.length < 3 && (
            <button type="button" onClick={addKontakDarurat} className="text-blue-600 font-bold hover:underline text-sm">+ Tambah Kontak</button>
          )}
        </div>

        <div className="space-y-4">
          {data.kontakDarurat.map((kontak, idx) => (
            <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-lg relative">
              <button type="button" onClick={() => removeKontak(idx)} className="absolute top-4 right-4 text-red-500 hover:text-red-700">
                <Trash2 className="w-4 h-4" />
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Nama Kontak <span className="text-red-500">*</span></label>
                  <input type="text" value={kontak.nama} onChange={e => updateKontak(idx, 'nama', e.target.value)} className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-black font-medium" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Hubungan <span className="text-red-500">*</span></label>
                  <select value={kontak.hubungan} onChange={e => updateKontak(idx, 'hubungan', e.target.value)} className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-black font-medium">
                    <option value="">- Pilih -</option>
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
                  <label className="block text-sm font-bold text-slate-700 mb-1">No HP <span className="text-red-500">*</span></label>
                  <input type="text" value={kontak.noHp} onChange={e => updateKontak(idx, 'noHp', e.target.value)} className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-black font-medium" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Alamat</label>
                  <input type="text" value={kontak.alamat} onChange={e => updateKontak(idx, 'alamat', e.target.value)} className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-black font-medium" placeholder="Isi jika berbeda dengan domisili" />
                </div>
              </div>
            </div>
          ))}
          {data.kontakDarurat.length === 0 && (
            <div className="text-center p-4 border border-dashed rounded text-slate-500">
              Belum ada kontak darurat ditambahkan.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
