import React, { useRef } from 'react';
import { LabOrder } from './types';
import { Printer, X, ShieldCheck, CheckCircle2, AlertTriangle, QrCode } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import { DocumentPreviewModal } from '../Documents/DocumentPreviewModal';

interface CetakHasilModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: LabOrder | null;
}

export function CetakHasilModal({ isOpen, onClose, order }: CetakHasilModalProps) {
  const toast = useToast();
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !order) return null;

  const handlePrint = () => {
    toast.success('Membuka dialog cetak lembar hasil laboratorium...');
    window.print();
  };

  const hasCritical = order.parameter_results.some(p => p.is_critical);

  
    const customContent = (
        <div className="bg-white text-slate-900 p-8 w-full max-w-4xl mx-auto space-y-6">

            {/* KOP SURAT KLINIK */}
            <div className="border-b-2 border-slate-900 pb-4 text-center relative">
              <div className="flex items-center justify-between">
                <div className="text-left flex items-center gap-3">
                  <div className="w-14 h-14 bg-cyan-700 text-white rounded-2xl flex items-center justify-center font-extrabold text-2xl shadow-sm">
                    M
                  </div>
                  <div>
                    <h1 className="text-xl font-extrabold tracking-tight text-slate-900 uppercase">
                      Klinik MYITARU SEHAT UTAMA
                    </h1>
                    <p className="text-xs text-slate-600 font-medium">
                      Instalasi Laboratorium Patologi Klinik & Bank Darah (LIS)
                    </p>
                    <p className="text-[10px] text-slate-500">
                      Jl. Kesehatan No. 45 Bandung • Telp: (022) 7890-1234 • Email: lab@myitaru-simrs.co.id
                    </p>
                  </div>
                </div>
                <div className="text-right font-mono text-[11px] text-slate-500">
                  <span className="px-2 py-0.5 bg-slate-100 border border-slate-300 rounded font-bold block text-slate-800">
                    ISO 15189 KARS Terakreditasi
                  </span>
                  <span className="block mt-1">No. Lab: <strong>{order.id}</strong></span>
                  <span className="block text-[10px]">No. Order: {order.id}</span>
                </div>
              </div>
            </div>

            {/* PATIENT & ORDER DETAILS GRID */}
            <div className="grid grid-cols-2 gap-4 text-xs border border-slate-200 rounded-lg p-3 bg-slate-50/50">
              <div className="space-y-1">
                <div className="flex">
                  <span className="w-32 text-slate-500">No. Rekam Medis</span>
                  <span className="font-mono font-bold text-slate-900">: {order.no_rm}</span>
                </div>
                <div className="flex">
                  <span className="w-32 text-slate-500">Nama Pasien</span>
                  <span className="font-bold text-slate-900">: {order.nama_pasien}</span>
                </div>
                <div className="flex">
                  <span className="w-32 text-slate-500">NIK / Identitas</span>
                  <span>: {order.nik || '-'}</span>
                </div>
                <div className="flex">
                  <span className="w-32 text-slate-500">Jenis Kelamin / Umur</span>
                  <span>: {order.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'} / {order.umur}</span>
                </div>
                <div className="flex">
                  <span className="w-32 text-slate-500">Penjamin / Asuransi</span>
                  <span className="font-semibold text-slate-800">: {order.penjamin}</span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex">
                  <span className="w-32 text-slate-500">Ruangan Asal</span>
                  <span className="font-semibold text-slate-800">: {order.ruangan_asal}</span>
                </div>
                <div className="flex">
                  <span className="w-32 text-slate-500">Dokter Pengirim</span>
                  <span className="font-semibold text-slate-800">: {order.dokter_pengirim}</span>
                </div>
                <div className="flex">
                  <span className="w-32 text-slate-500">Waktu Sampling</span>
                  <span>: {order.sampling_info?.waktu_sampling || '-'}</span>
                </div>
                <div className="flex">
                  <span className="w-32 text-slate-500">Waktu Selesai</span>
                  <span>: {order.waktu_selesai_analisis || order.waktu_validasi || '-'}</span>
                </div>
                <div className="flex">
                  <span className="w-32 text-slate-500">Diagnosa Klinis</span>
                  <span className="italic text-slate-700 truncate">: {order.diagnosa_klinis}</span>
                </div>
              </div>
            </div>

            {/* CRITICAL FINDING ALERT IF APPLICABLE */}
            {hasCritical && (
              <div className="p-3 bg-rose-50 border-l-4 border-rose-600 rounded text-rose-900 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <div>
                  <span className="font-bold block">PERHATIAN: Terdapat Nilai Kritis (Panic Value)</span>
                  <span>Hasil ini telah dilaporkan kepada dokter pengirim / DPJP sesuai protokol keselamatan pasien.</span>
                </div>
              </div>
            )}

            {/* TABLE OF PARAMETERS */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-300 pb-1">
                Hasil Pengujian Parameter
              </h4>

              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-y border-slate-300 font-bold text-slate-700">
                    <th className="py-2 px-2">Pemeriksaan</th>
                    <th className="py-2 px-2 text-center">Hasil</th>
                    <th className="py-2 px-2 text-center">Flag</th>
                    <th className="py-2 px-2">Satuan</th>
                    <th className="py-2 px-2">Nilai Rujukan</th>
                    <th className="py-2 px-2">Metode</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {order.parameter_results.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-slate-400 italic">
                        Belum ada parameter yang selesai dianalisis.
                      </td>
                    </tr>
                  ) : (
                    order.parameter_results.map((param) => {
                      const isHigh = param.flag === 'H' || param.flag === 'HH';
                      const isLow = param.flag === 'L' || param.flag === 'LL';
                      const isPos = param.flag === 'P';

                      return (
                        <tr 
                          key={param.id}
                          className={param.is_critical ? 'bg-rose-50/70 font-semibold' : ''}
                        >
                          <td className="py-1.5 px-2 font-medium text-slate-900">
                            {param.parameter_name}
                          </td>
                          <td className={`py-1.5 px-2 text-center font-mono font-bold ${
                            param.is_critical ? 'text-rose-700 text-sm' :
                            isHigh ? 'text-amber-700' :
                            isLow ? 'text-blue-700' :
                            isPos ? 'text-rose-700' : 'text-slate-800'
                          }`}>
                            {param.hasil}
                          </td>
                          <td className="py-1.5 px-2 text-center">
                            {param.flag && param.flag !== 'N' && (
                              <span className={`px-1.5 py-0.5 rounded text-[10px] font-extrabold ${
                                param.is_critical ? 'bg-rose-600 text-white' :
                                isHigh ? 'bg-amber-200 text-amber-900' :
                                isLow ? 'bg-blue-200 text-blue-900' :
                                'bg-rose-100 text-rose-800'
                              }`}>
                                {param.flag}
                              </span>
                            )}
                          </td>
                          <td className="py-1.5 px-2 text-slate-600 font-mono">
                            {param.satuan}
                          </td>
                          <td className="py-1.5 px-2 text-slate-600 font-mono">
                            {param.nilai_rujukan}
                          </td>
                          <td className="py-1.5 px-2 text-slate-500 text-[10px]">
                            {param.metode_pemeriksaan || '-'}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* INTERPRETASI & CATATAN DOKTER SP.PK */}
            <div className="space-y-3 pt-2 text-xs">
              {order.interpretasi_sp_pk && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="font-bold text-slate-800 block text-[11px] uppercase tracking-wide">
                    Kesan / Interpretasi Patologi Klinik:
                  </span>
                  <p className="mt-1 text-slate-700 leading-relaxed font-medium">
                    {order.interpretasi_sp_pk}
                  </p>
                </div>
              )}

              {order.saran_klinis && (
                <div className="p-2.5 bg-blue-50/60 border border-blue-200 rounded-lg text-blue-950">
                  <span className="font-bold block text-[10px] uppercase tracking-wide text-blue-800">
                    Saran Tindak Lanjut:
                  </span>
                  <p className="mt-0.5 leading-normal">
                    {order.saran_klinis}
                  </p>
                </div>
              )}
            </div>

            {/* FOOTER & DIGITAL SIGNATURE */}
            <div className="pt-6 border-t border-slate-300 grid grid-cols-2 gap-6 items-end text-xs">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-slate-500 text-[10px]">
                  <QrCode className="w-10 h-10 text-slate-800 shrink-0" />
                  <div>
                    <span className="font-mono block text-slate-700 font-bold">
                      {order.qr_verifikasi_code || `MYITARU-LAB-${order.id}`}
                    </span>
                    <span>Tervalidasi secara elektronik (BSrE BSSN)</span>
                    <span className="block text-[9px] text-slate-400">Hasil ini sah tanpa tanda tangan basah</span>
                  </div>
                </div>
              </div>

              <div className="text-right space-y-1">
                <p className="text-slate-500">
                  Bandung, {order.tanggal_order} {order.waktu_validasi || ''}
                </p>
                <p className="text-slate-600 font-medium">Dokter Penanggung Jawab Lab (Sp.PK),</p>
                
                <div className="py-2 flex justify-end">
                  <div className="px-3 py-1 border border-emerald-500/40 bg-emerald-50 text-emerald-800 rounded text-[10px] font-bold inline-flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>DIGITALLY SIGNED & VERIFIED</span>
                  </div>
                </div>

                <p className="font-bold text-slate-900 underline">
                  {order.dokter_sp_pk || 'dr. Hendra Gunawan, Sp.PK'}
                </p>
                <p className="text-[10px] text-slate-500 font-mono">
                  SIP: 446.1/1920/Dinkes-SpPK/2023
                </p>
              </div>
            </div>

            
            {/* LEGAL DISCLAIMER */}
            <div className="text-[9px] text-slate-400 text-center pt-2 border-t border-slate-100">
              Dokumen ini merupakan rekam medis elektronik resmi Klinik MYITARU SEHAT UTAMA yang dilindungi oleh undang-undang kerahasiaan medis.
            </div>
        </div>
    );

    return (
        <DocumentPreviewModal 
            isOpen={isOpen}
            onClose={onClose}
            customContent={customContent}
            title={`Hasil_Lab_${order.id || order.id}`}
        />
    );
}
