import React, { useState } from 'react';
import { RegistrationFormState } from './types';
import { CreditCard, CheckCircle, ShieldAlert, AlertCircle, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

interface Props {
  data: RegistrationFormState;
  onChange: (field: string, value: any) => void;
}

export function PenjaminTab({ data, onChange }: Props) {
  const [isVerifying, setIsVerifying] = useState(false);
  const [bpjsStatus, setBpjsStatus] = useState<'none' | 'aktif' | 'tidak_aktif'>('none');

  const checkBpjs = async () => {
    if (!data.noKartuBpjs || data.noKartuBpjs.length !== 13) {
      toast.error('No Kartu BPJS harus 13 digit');
      return;
    }
    if (!data.namaBpjs) {
      toast.error('Nama pada kartu BPJS harus diisi');
      return;
    }
    if (!data.namaIbuKandung) {
      toast.error('Nama Ibu Kandung wajib diisi untuk verifikasi');
      return;
    }
    
    setIsVerifying(true);
    // Simulate API call
    setTimeout(() => {
      setIsVerifying(false);
      setBpjsStatus('aktif');
      onChange('jenisPesertaBpjs', 'PPU (Pekerja Penerima Upah)');
      onChange('kelasBpjs', '1');
      onChange('faskes1Bpjs', 'Klinik Sehat Utama');
      toast.success('Kartu BPJS Aktif dan Terverifikasi');
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <label className="block text-sm font-bold text-slate-700 mb-3">Jenis Penjamin / Metode Pembayaran <span className="text-red-500">*</span></label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['BPJS Kesehatan', 'Asuransi Swasta', 'Perusahaan/Tanggungan Kantor', 'Umum/Tunai'].map(jenis => (
            <label key={jenis} className={`
              border rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all text-center
              ${data.jenisPenjamin === jenis ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-200' : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'}
            `}>
              <input 
                type="radio" 
                className="sr-only" 
                value={jenis} 
                checked={data.jenisPenjamin === jenis}
                onChange={e => onChange('jenisPenjamin', e.target.value)}
              />
              <CreditCard className={`w-8 h-8 mb-2 ${data.jenisPenjamin === jenis ? 'text-blue-600' : 'text-slate-400'}`} />
              <span className={`text-sm font-bold ${data.jenisPenjamin === jenis ? 'text-blue-700' : 'text-slate-600'}`}>{jenis}</span>
            </label>
          ))}
        </div>
      </div>

      {data.jenisPenjamin === 'BPJS Kesehatan' && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
          <h3 className="font-bold text-lg text-emerald-800 mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" /> Data BPJS Kesehatan
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">No Kartu BPJS <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                maxLength={13}
                value={data.noKartuBpjs} 
                onChange={e => onChange('noKartuBpjs', e.target.value)}
                className="w-full p-2 border border-emerald-300 rounded focus:ring-2 focus:ring-emerald-500 outline-none text-black font-medium" 
                placeholder="13 Digit No Kartu"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Nama Sesuai Kartu BPJS <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                value={data.namaBpjs} 
                onChange={e => onChange('namaBpjs', e.target.value)}
                className="w-full p-2 border border-emerald-300 rounded focus:ring-2 focus:ring-emerald-500 outline-none text-black font-medium" 
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-1">Nama Ibu Kandung <span className="text-red-500">*</span> <span className="text-xs font-normal text-slate-500">(Wajib untuk verifikasi V-Claim)</span></label>
              <input 
                type="text" 
                value={data.namaIbuKandung} 
                onChange={e => onChange('namaIbuKandung', e.target.value)}
                className="w-full p-2 border border-emerald-300 rounded focus:ring-2 focus:ring-emerald-500 outline-none text-black font-medium" 
              />
            </div>
            
            <div className="md:col-span-2">
              <button 
                type="button" 
                onClick={checkBpjs} 
                disabled={isVerifying}
                className="bg-emerald-600 text-white px-6 py-2 rounded font-bold hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-2"
              >
                {isVerifying ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldAlert className="w-4 h-4" />}
                {isVerifying ? 'Mengecek...' : 'Cek Keaktifan BPJS'}
              </button>
            </div>

            {bpjsStatus !== 'none' && (
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white rounded-lg border border-emerald-100">
                <div>
                  <div className="text-xs text-slate-500 mb-1">Status Kepesertaan</div>
                  {bpjsStatus === 'aktif' ? (
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded text-sm font-bold">AKTIF</span>
                  ) : (
                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-sm font-bold">TIDAK AKTIF</span>
                  )}
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1">Jenis Peserta</div>
                  <div className="font-bold text-sm text-slate-800">{data.jenisPesertaBpjs || '-'}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1">Kelas Perawatan</div>
                  <div className="font-bold text-sm text-slate-800">{data.kelasBpjs ? `Kelas ${data.kelasBpjs}` : '-'}</div>
                </div>
                <div className="md:col-span-3">
                  <div className="text-xs text-slate-500 mb-1">Faskes Tingkat 1</div>
                  <div className="font-bold text-sm text-slate-800">{data.faskes1Bpjs || '-'}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {data.jenisPenjamin === 'Asuransi Swasta' && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-bold text-lg text-blue-800 mb-4">Data Asuransi Swasta</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Nama Asuransi <span className="text-red-500">*</span></label>
              <select 
                value={data.namaAsuransi} 
                onChange={e => onChange('namaAsuransi', e.target.value)}
                className="w-full p-2 border border-blue-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-black font-medium"
              >
                <option value="">- Pilih Asuransi -</option>
                <option value="Prudential">Prudential</option>
                <option value="Allianz">Allianz</option>
                <option value="AIA">AIA</option>
                <option value="Manulife">Manulife</option>
                <option value="AXA Mandiri">AXA Mandiri</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">No Polis <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                value={data.noPolis} 
                onChange={e => onChange('noPolis', e.target.value)}
                className="w-full p-2 border border-blue-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-black font-medium" 
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Nama Tertanggung</label>
              <input 
                type="text" 
                value={data.namaTertanggung} 
                onChange={e => onChange('namaTertanggung', e.target.value)}
                className="w-full p-2 border border-blue-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-black font-medium" 
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Masa Berlaku Sampai</label>
              <input 
                type="date" 
                value={data.masaBerlakuAsuransi} 
                onChange={e => onChange('masaBerlakuAsuransi', e.target.value)}
                className="w-full p-2 border border-blue-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-black font-medium" 
              />
            </div>
            <div className="md:col-span-2">
              <button type="button" onClick={() => toast.success('Asuransi valid')} className="bg-blue-600 text-white px-4 py-2 rounded font-bold hover:bg-blue-700">
                Verifikasi Asuransi
              </button>
            </div>
          </div>
        </div>
      )}

      {data.jenisPenjamin === 'Perusahaan/Tanggungan Kantor' && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
          <h3 className="font-bold text-lg text-amber-800 mb-4">Data Tanggungan Perusahaan</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Nama Perusahaan Penjamin <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                value={data.perusahaanPenjamin} 
                onChange={e => onChange('perusahaanPenjamin', e.target.value)}
                className="w-full p-2 border border-amber-300 rounded focus:ring-2 focus:ring-amber-500 outline-none text-black font-medium" 
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">No Kartu/ID Karyawan</label>
              <input 
                type="text" 
                value={data.noKaryawan} 
                onChange={e => onChange('noKaryawan', e.target.value)}
                className="w-full p-2 border border-amber-300 rounded focus:ring-2 focus:ring-amber-500 outline-none text-black font-medium" 
              />
            </div>
          </div>
        </div>
      )}

      {data.jenisPenjamin === 'Umum/Tunai' && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
          <h3 className="font-bold text-lg text-slate-800 mb-4">Pembayaran Umum</h3>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Metode Pembayaran Default</label>
            <select 
              value={data.metodePembayaran} 
              onChange={e => onChange('metodePembayaran', e.target.value)}
              className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-black font-medium"
            >
              <option value="Tunai">Tunai / Cash</option>
              <option value="Debit">Kartu Debit</option>
              <option value="Kredit">Kartu Kredit</option>
              <option value="QRIS">QRIS</option>
              <option value="Transfer">Transfer Bank</option>
            </select>
            <p className="text-xs text-slate-500 mt-2">
              <AlertCircle className="w-3 h-3 inline mr-1" />
              Metode pembayaran dapat diubah di bagian Kasir/Billing.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
