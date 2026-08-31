import React from 'react';
import { RegistrationFormState } from './types';

interface Props {
  data: RegistrationFormState;
  onChange: (field: string, value: any) => void;
}

export function DemografiTab({ data, onChange }: Props) {
  const inputClass = "w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-500 outline-none font-medium text-xs";
  const labelClass = "block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1";

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>No RM</label>
          <input 
            type="text" 
            disabled 
            value={data.noRm} 
            className="w-full p-2.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono font-bold text-xs" 
          />
        </div>
        
        <div>
          <label className={labelClass}>NIK <span className="text-red-500">*</span></label>
          <input 
            type="text" 
            maxLength={16}
            value={data.nik} 
            onChange={e => onChange('nik', e.target.value)}
            className={inputClass} 
            placeholder="16 digit NIK..."
          />
        </div>

        <div>
          <label className={labelClass}>Nama Lengkap (Sesuai KTP) <span className="text-red-500">*</span></label>
          <input 
            type="text" 
            value={data.namaLengkap} 
            onChange={e => onChange('namaLengkap', e.target.value)}
            className={inputClass} 
            placeholder="Nama lengkap pasien..."
          />
        </div>

        <div>
          <label className={labelClass}>Nama Panggilan</label>
          <input 
            type="text" 
            value={data.namaPanggilan} 
            onChange={e => onChange('namaPanggilan', e.target.value)}
            className={inputClass} 
            placeholder="Nama panggilan..."
          />
        </div>

        <div>
          <label className={labelClass}>Tempat Lahir <span className="text-red-500">*</span></label>
          <input 
            type="text" 
            value={data.tempatLahir} 
            onChange={e => onChange('tempatLahir', e.target.value)}
            className={inputClass} 
            placeholder="Kota kelahiran..."
          />
        </div>

        <div>
          <label className={labelClass}>Tanggal Lahir <span className="text-red-500">*</span></label>
          <div className="flex gap-2">
            <input 
              type="date" 
              max={new Date().toISOString().split('T')[0]}
              value={data.tanggalLahir} 
              onChange={e => onChange('tanggalLahir', e.target.value)}
              className={`${inputClass} flex-1`} 
            />
            {data.tanggalLahir && (
              <div className="flex items-center px-3 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-xs text-slate-700 dark:text-slate-200 font-bold whitespace-nowrap">
                {Math.floor((new Date().getTime() - new Date(data.tanggalLahir).getTime()) / 31557600000)} Thn
              </div>
            )}
          </div>
        </div>

        <div>
          <label className={labelClass}>Jenis Kelamin <span className="text-red-500">*</span></label>
          <div className="flex gap-6 p-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-200">
              <input 
                type="radio" 
                name="jenisKelamin" 
                value="L" 
                checked={data.jenisKelamin === 'L'}
                onChange={e => onChange('jenisKelamin', e.target.value)}
                className="w-4 h-4 text-blue-600 dark:text-cyan-500"
              />
              <span>Laki-laki</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-200">
              <input 
                type="radio" 
                name="jenisKelamin" 
                value="P" 
                checked={data.jenisKelamin === 'P'}
                onChange={e => onChange('jenisKelamin', e.target.value)}
                className="w-4 h-4 text-blue-600 dark:text-cyan-500"
              />
              <span>Perempuan</span>
            </label>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="flex-1">
            <label className={labelClass}>Golongan Darah</label>
            <select 
              value={data.golonganDarah} 
              onChange={e => onChange('golonganDarah', e.target.value)}
              className={inputClass}
            >
              <option value="">- Pilih -</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="AB">AB</option>
              <option value="O">O</option>
              <option value="-">Tidak Tahu</option>
            </select>
          </div>
          {data.golonganDarah && data.golonganDarah !== '-' && (
            <div className="w-1/3">
              <label className={labelClass}>Rhesus</label>
              <select 
                value={data.rhesus} 
                onChange={e => onChange('rhesus', e.target.value)}
                className={inputClass}
              >
                <option value="">- Pilih -</option>
                <option value="+">Positif (+)</option>
                <option value="-">Negatif (-)</option>
              </select>
            </div>
          )}
        </div>

        <div>
          <label className={labelClass}>Agama</label>
          <select 
            value={data.agama} 
            onChange={e => onChange('agama', e.target.value)}
            className={inputClass}
          >
            <option value="">- Pilih Agama -</option>
            <option value="Islam">Islam</option>
            <option value="Kristen">Kristen</option>
            <option value="Katolik">Katolik</option>
            <option value="Hindu">Hindu</option>
            <option value="Buddha">Buddha</option>
            <option value="Konghucu">Konghucu</option>
          </select>
        </div>

        <div>
          <label className={labelClass}>Suku/Bangsa</label>
          <input 
            type="text" 
            value={data.sukuBangsa} 
            onChange={e => onChange('sukuBangsa', e.target.value)}
            className={inputClass} 
            placeholder="Cth: Sunda, Jawa, Batak..."
          />
        </div>

        <div>
          <label className={labelClass}>Kewarganegaraan</label>
          <div className="flex gap-6 p-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-200">
              <input 
                type="radio" 
                name="kewarganegaraan" 
                value="WNI" 
                checked={data.kewarganegaraan === 'WNI'}
                onChange={e => onChange('kewarganegaraan', e.target.value)}
                className="w-4 h-4 text-blue-600 dark:text-cyan-500"
              />
              <span>WNI</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-200">
              <input 
                type="radio" 
                name="kewarganegaraan" 
                value="WNA" 
                checked={data.kewarganegaraan === 'WNA'}
                onChange={e => onChange('kewarganegaraan', e.target.value)}
                className="w-4 h-4 text-blue-600 dark:text-cyan-500"
              />
              <span>WNA</span>
            </label>
          </div>
        </div>

        {data.kewarganegaraan === 'WNA' && (
          <div>
            <label className={labelClass}>No Paspor</label>
            <input 
              type="text" 
              value={data.noPaspor} 
              onChange={e => onChange('noPaspor', e.target.value)}
              className={inputClass} 
              placeholder="Nomor Paspor WNA..."
            />
          </div>
        )}

        <div>
          <label className={labelClass}>Bahasa Komunikasi</label>
          <select 
            value={data.bahasa} 
            onChange={e => onChange('bahasa', e.target.value)}
            className={inputClass}
          >
            <option value="Indonesia">Indonesia</option>
            <option value="Daerah">Daerah</option>
            <option value="Inggris">Inggris</option>
            <option value="Lainnya">Lainnya</option>
          </select>
        </div>

        <div>
          <label className={labelClass}>Status Perkawinan</label>
          <select 
            value={data.statusPerkawinan} 
            onChange={e => onChange('statusPerkawinan', e.target.value)}
            className={inputClass}
          >
            <option value="">- Pilih Status -</option>
            <option value="Belum Kawin">Belum Kawin</option>
            <option value="Kawin">Kawin</option>
            <option value="Cerai Hidup">Cerai Hidup</option>
            <option value="Cerai Mati">Cerai Mati</option>
          </select>
        </div>

        <div>
          <label className={labelClass}>Pendidikan Terakhir</label>
          <select 
            value={data.pendidikanTerakhir} 
            onChange={e => onChange('pendidikanTerakhir', e.target.value)}
            className={inputClass}
          >
            <option value="">- Pilih Pendidikan -</option>
            <option value="SD">SD</option>
            <option value="SMP">SMP</option>
            <option value="SMA/SMK">SMA/SMK</option>
            <option value="D1-D3">D1-D3</option>
            <option value="S1/D4">S1/D4</option>
            <option value="S2">S2</option>
            <option value="S3">S3</option>
          </select>
        </div>

      </div>
    </div>
  );
}

