import React from 'react';
import { RegistrationFormState } from './types';
import { HelpCircle } from 'lucide-react';

interface Props {
  data: RegistrationFormState;
  onChange: (field: string, value: any) => void;
}

export function DemografiTab({ data, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">No RM</label>
          <input type="text" disabled value={data.noRm} className="w-full p-2 border border-slate-300 rounded bg-slate-100 text-black font-medium" />
        </div>
        
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">NIK <span className="text-red-500">*</span></label>
          <input 
            type="text" 
            maxLength={16}
            value={data.nik} 
            onChange={e => onChange('nik', e.target.value)}
            className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-black font-medium" 
            placeholder="16 digit NIK"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">Nama Lengkap (Sesuai KTP) <span className="text-red-500">*</span></label>
          <input 
            type="text" 
            value={data.namaLengkap} 
            onChange={e => onChange('namaLengkap', e.target.value)}
            className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-black font-medium" 
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">Nama Panggilan</label>
          <input 
            type="text" 
            value={data.namaPanggilan} 
            onChange={e => onChange('namaPanggilan', e.target.value)}
            className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-black font-medium" 
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">Tempat Lahir <span className="text-red-500">*</span></label>
          <input 
            type="text" 
            value={data.tempatLahir} 
            onChange={e => onChange('tempatLahir', e.target.value)}
            className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-black font-medium" 
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">Tanggal Lahir <span className="text-red-500">*</span></label>
          <div className="flex gap-2">
            <input 
              type="date" 
              max={new Date().toISOString().split('T')[0]}
              value={data.tanggalLahir} 
              onChange={e => onChange('tanggalLahir', e.target.value)}
              className="flex-1 p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-black font-medium" 
            />
            {data.tanggalLahir && (
              <div className="flex items-center px-3 bg-slate-100 border border-slate-300 rounded text-sm text-slate-600 font-bold">
                {Math.floor((new Date().getTime() - new Date(data.tanggalLahir).getTime()) / 31557600000)} Thn
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">Jenis Kelamin <span className="text-red-500">*</span></label>
          <div className="flex gap-4 p-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                name="jenisKelamin" 
                value="L" 
                checked={data.jenisKelamin === 'L'}
                onChange={e => onChange('jenisKelamin', e.target.value)}
                className="w-4 h-4 text-blue-600"
              />
              <span>Laki-laki</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                name="jenisKelamin" 
                value="P" 
                checked={data.jenisKelamin === 'P'}
                onChange={e => onChange('jenisKelamin', e.target.value)}
                className="w-4 h-4 text-blue-600"
              />
              <span>Perempuan</span>
            </label>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-bold text-slate-700 mb-1">Golongan Darah</label>
            <select 
              value={data.golonganDarah} 
              onChange={e => onChange('golonganDarah', e.target.value)}
              className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-black font-medium"
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
              <label className="block text-sm font-bold text-slate-700 mb-1">Rhesus</label>
              <select 
                value={data.rhesus} 
                onChange={e => onChange('rhesus', e.target.value)}
                className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-black font-medium"
              >
                <option value="">- Pilih -</option>
                <option value="+">Positif (+)</option>
                <option value="-">Negatif (-)</option>
              </select>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">Agama</label>
          <select 
            value={data.agama} 
            onChange={e => onChange('agama', e.target.value)}
            className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-black font-medium"
          >
            <option value="">- Pilih -</option>
            <option value="Islam">Islam</option>
            <option value="Kristen">Kristen</option>
            <option value="Katolik">Katolik</option>
            <option value="Hindu">Hindu</option>
            <option value="Buddha">Buddha</option>
            <option value="Konghucu">Konghucu</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">Suku/Bangsa</label>
          <input 
            type="text" 
            value={data.sukuBangsa} 
            onChange={e => onChange('sukuBangsa', e.target.value)}
            className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-black font-medium" 
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">Kewarganegaraan</label>
          <div className="flex gap-4 p-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                name="kewarganegaraan" 
                value="WNI" 
                checked={data.kewarganegaraan === 'WNI'}
                onChange={e => onChange('kewarganegaraan', e.target.value)}
                className="w-4 h-4 text-blue-600"
              />
              <span>WNI</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                name="kewarganegaraan" 
                value="WNA" 
                checked={data.kewarganegaraan === 'WNA'}
                onChange={e => onChange('kewarganegaraan', e.target.value)}
                className="w-4 h-4 text-blue-600"
              />
              <span>WNA</span>
            </label>
          </div>
        </div>

        {data.kewarganegaraan === 'WNA' && (
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">No Paspor</label>
            <input 
              type="text" 
              value={data.noPaspor} 
              onChange={e => onChange('noPaspor', e.target.value)}
              className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-black font-medium" 
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">Bahasa yang digunakan</label>
          <select 
            value={data.bahasa} 
            onChange={e => onChange('bahasa', e.target.value)}
            className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-black font-medium"
          >
            <option value="Indonesia">Indonesia</option>
            <option value="Daerah">Daerah</option>
            <option value="Inggris">Inggris</option>
            <option value="Lainnya">Lainnya</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">Status Perkawinan</label>
          <select 
            value={data.statusPerkawinan} 
            onChange={e => onChange('statusPerkawinan', e.target.value)}
            className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-black font-medium"
          >
            <option value="">- Pilih -</option>
            <option value="Belum Kawin">Belum Kawin</option>
            <option value="Kawin">Kawin</option>
            <option value="Cerai Hidup">Cerai Hidup</option>
            <option value="Cerai Mati">Cerai Mati</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">Pendidikan Terakhir</label>
          <select 
            value={data.pendidikanTerakhir} 
            onChange={e => onChange('pendidikanTerakhir', e.target.value)}
            className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-black font-medium"
          >
            <option value="">- Pilih -</option>
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
