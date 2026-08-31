import React from 'react';
import { RegistrationFormState } from './types';

interface Props {
  data: RegistrationFormState;
  onChange: (field: string, value: any) => void;
}

export function PekerjaanTab({ data, onChange }: Props) {
  const inputClass = "w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-500 outline-none font-medium text-xs";
  const labelClass = "block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1";

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>Status Pekerjaan</label>
          <select 
            value={data.statusPekerjaan} 
            onChange={e => onChange('statusPekerjaan', e.target.value)}
            className={inputClass}
          >
            <option value="">- Pilih Status Pekerjaan -</option>
            <option value="Bekerja">Bekerja</option>
            <option value="Tidak Bekerja">Tidak Bekerja</option>
            <option value="Pelajar/Mahasiswa">Pelajar/Mahasiswa</option>
            <option value="Pensiunan">Pensiunan</option>
          </select>
        </div>

        <div>
          <label className={labelClass}>Pekerjaan</label>
          <input 
            type="text" 
            value={data.pekerjaan} 
            onChange={e => onChange('pekerjaan', e.target.value)}
            className={inputClass}
            placeholder="PNS, Wiraswasta, Karyawan Swasta, dll."
          />
        </div>

        {data.statusPekerjaan === 'Bekerja' && (
          <>
            <div>
              <label className={labelClass}>Nama Perusahaan / Instansi</label>
              <input 
                type="text" 
                value={data.namaPerusahaan} 
                onChange={e => onChange('namaPerusahaan', e.target.value)}
                className={inputClass}
                placeholder="Nama perusahaan tempat bekerja..."
              />
            </div>
            
            <div>
              <label className={labelClass}>Jabatan</label>
              <input 
                type="text" 
                value={data.jabatan} 
                onChange={e => onChange('jabatan', e.target.value)}
                className={inputClass}
                placeholder="Jabatan pekerjaan..."
              />
            </div>

            <div className="md:col-span-2">
              <label className={labelClass}>Alamat Perusahaan</label>
              <textarea 
                rows={2}
                value={data.alamatPerusahaan} 
                onChange={e => onChange('alamatPerusahaan', e.target.value)}
                className={inputClass}
                placeholder="Alamat kantor / tempat kerja..."
              />
            </div>
          </>
        )}

        <div>
          <label className={labelClass}>Penghasilan Per Bulan</label>
          <select 
            value={data.penghasilan} 
            onChange={e => onChange('penghasilan', e.target.value)}
            className={inputClass}
          >
            <option value="">- Pilih Kisaran Penghasilan -</option>
            <option value="< 1 Juta">&lt; 1 Juta</option>
            <option value="1 - 3 Juta">1 - 3 Juta</option>
            <option value="3 - 5 Juta">3 - 5 Juta</option>
            <option value="5 - 10 Juta">5 - 10 Juta</option>
            <option value="> 10 Juta">&gt; 10 Juta</option>
          </select>
        </div>

        <div>
          <label className={labelClass}>Kategori Pekerjaan (Risiko)</label>
          <select 
            value={data.jenisPekerjaan} 
            onChange={e => onChange('jenisPekerjaan', e.target.value)}
            className={inputClass}
          >
            <option value="">- Pilih Kategori Risiko -</option>
            <option value="Risiko Rendah (Kantor, Guru, dll)">Risiko Rendah (Kantor, Guru, dll)</option>
            <option value="Risiko Sedang (Lapangan, Sales, dll)">Risiko Sedang (Lapangan, Sales, dll)</option>
            <option value="Risiko Tinggi (Pabrik, Konstruksi, dll)">Risiko Tinggi (Pabrik, Konstruksi, dll)</option>
          </select>
        </div>

      </div>
    </div>
  );
}

