import React from 'react';
import { RegistrationFormState } from './types';

interface Props {
  data: RegistrationFormState;
  onChange: (field: string, value: any) => void;
}

export function PekerjaanTab({ data, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">Status Pekerjaan</label>
          <select 
            value={data.statusPekerjaan} 
            onChange={e => onChange('statusPekerjaan', e.target.value)}
            className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-black font-medium"
          >
            <option value="">- Pilih -</option>
            <option value="Bekerja">Bekerja</option>
            <option value="Tidak Bekerja">Tidak Bekerja</option>
            <option value="Pelajar/Mahasiswa">Pelajar/Mahasiswa</option>
            <option value="Pensiunan">Pensiunan</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">Pekerjaan</label>
          <input 
            type="text" 
            value={data.pekerjaan} 
            onChange={e => onChange('pekerjaan', e.target.value)}
            className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-black font-medium"
            placeholder="PNS, Wiraswasta, Karyawan Swasta, dll."
          />
        </div>

        {data.statusPekerjaan === 'Bekerja' && (
          <>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Nama Perusahaan / Instansi</label>
              <input 
                type="text" 
                value={data.namaPerusahaan} 
                onChange={e => onChange('namaPerusahaan', e.target.value)}
                className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-black font-medium"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Jabatan</label>
              <input 
                type="text" 
                value={data.jabatan} 
                onChange={e => onChange('jabatan', e.target.value)}
                className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-black font-medium"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-1">Alamat Perusahaan</label>
              <textarea 
                rows={2}
                value={data.alamatPerusahaan} 
                onChange={e => onChange('alamatPerusahaan', e.target.value)}
                className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-black font-medium"
              />
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">Penghasilan per bulan</label>
          <select 
            value={data.penghasilan} 
            onChange={e => onChange('penghasilan', e.target.value)}
            className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-black font-medium"
          >
            <option value="">- Pilih -</option>
            <option value="< 1 Juta">&lt; 1 Juta</option>
            <option value="1 - 3 Juta">1 - 3 Juta</option>
            <option value="3 - 5 Juta">3 - 5 Juta</option>
            <option value="5 - 10 Juta">5 - 10 Juta</option>
            <option value="> 10 Juta">&gt; 10 Juta</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">Kategori Pekerjaan (Risiko)</label>
          <select 
            value={data.jenisPekerjaan} 
            onChange={e => onChange('jenisPekerjaan', e.target.value)}
            className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-black font-medium"
          >
            <option value="">- Pilih -</option>
            <option value="Risiko Rendah (Kantor, Guru, dll)">Risiko Rendah (Kantor, Guru, dll)</option>
            <option value="Risiko Sedang (Lapangan, Sales, dll)">Risiko Sedang (Lapangan, Sales, dll)</option>
            <option value="Risiko Tinggi (Pabrik, Konstruksi, dll)">Risiko Tinggi (Pabrik, Konstruksi, dll)</option>
          </select>
        </div>

      </div>
    </div>
  );
}
