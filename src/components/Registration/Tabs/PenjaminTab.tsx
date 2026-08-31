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

  const inputClass = "w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-500 outline-none font-medium text-xs";
  const labelClass = "block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1";

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
        <label className={labelClass}>
          Jenis Penjamin / Metode Pembayaran <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
          {['BPJS Kesehatan', 'Asuransi Swasta', 'Perusahaan/Tanggungan Kantor', 'Umum/Tunai'].map(jenis => (
            <label key={jenis} className={`
              border rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all text-center
              ${data.jenisPenjamin === jenis 
                ? 'border-blue-600 dark:border-cyan-500 bg-blue-50 dark:bg-cyan-950/40 ring-2 ring-blue-200 dark:ring-cyan-800' 
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-blue-300 dark:hover:border-cyan-600 hover:bg-slate-50 dark:hover:bg-slate-700/50'}
            `}>
              <input 
                type="radio" 
                className="sr-only" 
                value={jenis} 
                checked={data.jenisPenjamin === jenis}
                onChange={e => onChange('jenisPenjamin', e.target.value)}
              />
              <CreditCard className={`w-7 h-7 mb-2 ${data.jenisPenjamin === jenis ? 'text-blue-600 dark:text-cyan-400' : 'text-slate-400 dark:text-slate-500'}`} />
              <span className={`text-xs font-bold ${data.jenisPenjamin === jenis ? 'text-blue-700 dark:text-cyan-300' : 'text-slate-600 dark:text-slate-300'}`}>{jenis}</span>
            </label>
          ))}
        </div>
      </div>

      {data.jenisPenjamin === 'BPJS Kesehatan' && (
        <div className="bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 rounded-xl p-5">
          <h3 className="font-bold text-base text-emerald-800 dark:text-emerald-300 mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /> Data BPJS Kesehatan
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>No Kartu BPJS <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                maxLength={13}
                value={data.noKartuBpjs} 
                onChange={e => onChange('noKartuBpjs', e.target.value)}
                className={inputClass}
                placeholder="13 Digit No Kartu"
              />
            </div>
            <div>
              <label className={labelClass}>Nama Sesuai Kartu BPJS <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                value={data.namaBpjs} 
                onChange={e => onChange('namaBpjs', e.target.value)}
                className={inputClass}
                placeholder="Nama peserta BPJS..."
              />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Nama Ibu Kandung <span className="text-red-500">*</span> <span className="text-xs font-normal text-slate-500 dark:text-slate-400">(Wajib untuk verifikasi V-Claim)</span></label>
              <input 
                type="text" 
                value={data.namaIbuKandung} 
                onChange={e => onChange('namaIbuKandung', e.target.value)}
                className={inputClass}
                placeholder="Nama ibu kandung..."
              />
            </div>
            
            <div className="md:col-span-2">
              <button 
                type="button" 
                onClick={checkBpjs} 
                disabled={isVerifying}
                className="bg-emerald-600 dark:bg-emerald-500 text-white px-5 py-2.5 rounded-lg font-bold hover:bg-emerald-700 dark:hover:bg-emerald-600 disabled:opacity-50 flex items-center gap-2 text-xs transition-colors shadow-sm"
              >
                {isVerifying ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldAlert className="w-4 h-4" />}
                {isVerifying ? 'Mengecek ke V-Claim...' : 'Cek Keaktifan BPJS (V-Claim)'}
              </button>
            </div>

            {bpjsStatus !== 'none' && (
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white dark:bg-slate-900 rounded-lg border border-emerald-200 dark:border-emerald-800">
                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-1 font-semibold">Status Kepesertaan</div>
                  {bpjsStatus === 'aktif' ? (
                    <span className="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 rounded text-xs font-bold">AKTIF</span>
                  ) : (
                    <span className="px-2.5 py-1 bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-300 rounded text-xs font-bold">TIDAK AKTIF</span>
                  )}
                </div>
                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-1 font-semibold">Jenis Peserta</div>
                  <div className="font-bold text-xs text-slate-800 dark:text-slate-200">{data.jenisPesertaBpjs || '-'}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-1 font-semibold">Kelas Perawatan</div>
                  <div className="font-bold text-xs text-slate-800 dark:text-slate-200">{data.kelasBpjs ? `Kelas ${data.kelasBpjs}` : '-'}</div>
                </div>
                <div className="md:col-span-3">
                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-1 font-semibold">Faskes Tingkat 1</div>
                  <div className="font-bold text-xs text-slate-800 dark:text-slate-200">{data.faskes1Bpjs || '-'}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {data.jenisPenjamin === 'Asuransi Swasta' && (
        <div className="bg-blue-50/70 dark:bg-slate-800/80 border border-blue-200 dark:border-slate-700 rounded-xl p-5">
          <h3 className="font-bold text-base text-blue-800 dark:text-cyan-300 mb-4">Data Asuransi Swasta</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Nama Asuransi <span className="text-red-500">*</span></label>
              <select 
                value={data.namaAsuransi} 
                onChange={e => onChange('namaAsuransi', e.target.value)}
                className={inputClass}
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
              <label className={labelClass}>No Polis <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                value={data.noPolis} 
                onChange={e => onChange('noPolis', e.target.value)}
                className={inputClass}
                placeholder="No polis..."
              />
            </div>
            <div>
              <label className={labelClass}>Nama Tertanggung</label>
              <input 
                type="text" 
                value={data.namaTertanggung} 
                onChange={e => onChange('namaTertanggung', e.target.value)}
                className={inputClass}
                placeholder="Nama pemegang polis..."
              />
            </div>
            <div>
              <label className={labelClass}>Masa Berlaku Sampai</label>
              <input 
                type="date" 
                value={data.masaBerlakuAsuransi} 
                onChange={e => onChange('masaBerlakuAsuransi', e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="md:col-span-2">
              <button type="button" onClick={() => toast.success('Asuransi valid')} className="bg-blue-600 dark:bg-cyan-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 dark:hover:bg-cyan-500 text-xs">
                Verifikasi Asuransi
              </button>
            </div>
          </div>
        </div>
      )}

      {data.jenisPenjamin === 'Perusahaan/Tanggungan Kantor' && (
        <div className="bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-xl p-5">
          <h3 className="font-bold text-base text-amber-800 dark:text-amber-300 mb-4">Data Tanggungan Perusahaan</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Nama Perusahaan Penjamin <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                value={data.perusahaanPenjamin} 
                onChange={e => onChange('perusahaanPenjamin', e.target.value)}
                className={inputClass}
                placeholder="Nama PT / Instansi..."
              />
            </div>
            <div>
              <label className={labelClass}>No Kartu/ID Karyawan</label>
              <input 
                type="text" 
                value={data.noKaryawan} 
                onChange={e => onChange('noKaryawan', e.target.value)}
                className={inputClass}
                placeholder="NIP / No Karyawan..."
              />
            </div>
          </div>
        </div>
      )}

      {data.jenisPenjamin === 'Umum/Tunai' && (
        <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
          <h3 className="font-bold text-base text-slate-800 dark:text-slate-100 mb-4">Pembayaran Umum</h3>
          <div>
            <label className={labelClass}>Metode Pembayaran Default</label>
            <select 
              value={data.metodePembayaran} 
              onChange={e => onChange('metodePembayaran', e.target.value)}
              className={inputClass}
            >
              <option value="Tunai">Tunai / Cash</option>
              <option value="Debit">Kartu Debit</option>
              <option value="Kredit">Kartu Kredit</option>
              <option value="QRIS">QRIS</option>
              <option value="Transfer">Transfer Bank</option>
            </select>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              Metode pembayaran dapat disesuaikan kembali di bagian Kasir/Billing saat transaksi.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}

