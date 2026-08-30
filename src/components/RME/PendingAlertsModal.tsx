import React from 'react';
import { AlertCircle, CheckCircle2, Clock, FileSignature, FlaskConical, ShieldAlert, ArrowRight, X } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface PendingAlertsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tabId: string) => void;
  patientData: any;
}

export function PendingAlertsModal({ isOpen, onClose, onNavigateTab, patientData }: PendingAlertsModalProps) {
  if (!isOpen) return null;

  const alerts = [
    {
      id: 'alert-1',
      type: 'warning',
      icon: FlaskConical,
      title: 'Hasil Lab Darah Butuh Verifikasi DPJP',
      desc: 'Pemeriksaan Panel Glukosa & HbA1c (ORD-LAB-88210) telah selesai dan memerlukan verifikasi serta TTE oleh DPJP.',
      tab: 'investigations_lab',
      actionLabel: 'Buka Hasil Lab'
    },
    {
      id: 'alert-2',
      type: 'info',
      icon: FileSignature,
      title: 'TTE Resume Medis Belum Ditandatangani',
      desc: 'Resume medis rawat jalan kunjungan 30 Agu 2026 belum dibubuhi Tanda Tangan Elektronik (BSrE).',
      tab: 'legal_docs',
      actionLabel: 'Tandatangani Dokumen'
    },
    {
      id: 'alert-3',
      type: 'danger',
      icon: ShieldAlert,
      title: 'Peringatan Kontraindikasi Alergi Penisilin',
      desc: 'Pasien memiliki riwayat alergi berat Penisilin (Anafilaksis). Pastikan peresepan antibiotik golongan Beta-Laktam dihindari.',
      tab: 'allergies',
      actionLabel: 'Cek Riwayat Alergi'
    }
  ];

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-5 bg-amber-500 text-white flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">Peringatan Klinis & Tugas Tertunda</h3>
              <p className="text-xs text-amber-100">Pasien: {patientData?.nama} ({patientData?.no_rm})</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-white/80 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-3.5 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {alerts.map(a => {
            const Icon = a.icon;
            return (
              <div
                key={a.id}
                className={`p-4 rounded-xl border flex flex-col gap-2 transition-all ${
                  a.type === 'danger'
                    ? 'bg-rose-50/80 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800/60 text-rose-900 dark:text-rose-200'
                    : a.type === 'warning'
                    ? 'bg-amber-50/80 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200'
                    : 'bg-blue-50/80 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800/60 text-blue-900 dark:text-blue-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg shrink-0 ${
                    a.type === 'danger' ? 'bg-rose-100 dark:bg-rose-900/60 text-rose-600' :
                    a.type === 'warning' ? 'bg-amber-100 dark:bg-amber-900/60 text-amber-600' :
                    'bg-blue-100 dark:bg-blue-900/60 text-blue-600'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-xs">{a.title}</h4>
                    <p className="text-xs mt-1 leading-relaxed opacity-90">{a.desc}</p>
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => {
                      onNavigateTab(a.tab);
                      onClose();
                      toast.success(`Membuka menu ${a.title}`);
                    }}
                    className={`text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shadow-sm ${
                      a.type === 'danger' ? 'bg-rose-600 hover:bg-rose-700 text-white' :
                      a.type === 'warning' ? 'bg-amber-600 hover:bg-amber-700 text-white' :
                      'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    <span>{a.actionLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
