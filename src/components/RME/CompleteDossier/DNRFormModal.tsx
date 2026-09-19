import React, { useState } from 'react';
import { ShieldAlert, AlertOctagon, CheckCircle2, User, FileText, CheckSquare } from 'lucide-react';
import { toast } from 'react-hot-toast';
import PrintPDFButton from '../../PrintPDFButton';

interface DNRModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: any;
}

export function DNRFormModal({ isOpen, onClose, patient }: DNRModalProps) {
  const [penandatangan, setPenandatangan] = useState<'Pasien Sendiri' | 'Keluarga / Wali Sah'>('Keluarga / Wali Sah');
  const [namaWali, setNamaWali] = useState('Budi Santoso');
  const [hubunganWali, setHubunganWali] = useState('Anak Kandung');
  const [nikWali, setNikWali] = useState('3271041982050002');
  const [alasanMedis, setAlasanMedis] = useState('Kondisi penyakit stadium terminal (End-stage organ failure) dengan prognosis ad vitam dubia ad malam. Tim medis telah menjelaskan manfaat vs risiko RJP.');
  const [tindakanDibatasi, setTindakanDibatasi] = useState({
    rjpKompresiDada: true,
    intubasiVentilator: true,
    defibrilasiDCShock: true,
    obatVasopresorDosisTinggi: true,
    kenyamananPaliatifTetapDiberikan: true,
  });
  const [konfirmasiPaliatif, setKonfirmasiPaliatif] = useState(true);

  if (!isOpen) return null;

  const handleSave = () => {
    const key = `hospital_legal_dnr_${patient?.no_rm || patient?.id || 'default'}`;
    const dnrData = {
      id: Date.now(),
      tanggal: new Date().toISOString(),
      penandatangan,
      wali: { nama: namaWali, hubungan: hubunganWali, nik: nikWali },
      alasanMedis,
      tindakanDibatasi,
      dokterPenanggungJawab: 'dr. Hendra Gunawan, Sp.An-TI, Subsp.IC(K)',
      saksi1: 'Ns. Fitri Handayani, S.Kep',
      saksi2: `${namaWali} (${hubunganWali})`
    };
    localStorage.setItem(key, JSON.stringify(dnrData));
    toast.success('Formulir Do Not Resuscitate (DNR) berhasil divalidasi dan disimpan!');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[120] p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl border border-rose-300 dark:border-rose-900 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* HEADER */}
        <div className="bg-rose-700 text-white p-4 sm:p-5 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 rounded-xl">
              <AlertOctagon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold">Formulir Perintah Jangan Dilakukan Resusitasi (Do Not Resuscitate - DNR)</h2>
              <p className="text-xs text-rose-100">
                Pasien: <span className="font-bold">{patient?.nama}</span> ({patient?.no_rm}) • Dokumen Hukum Legal-Medik Permenkes No. 24/2022
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white text-2xl font-bold w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10">✕</button>
        </div>

        {/* BODY */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm">
          
          {/* WARNING BANNER */}
          <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 rounded-xl flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="text-xs text-rose-800 dark:text-rose-200">
              <p className="font-bold">PERNYATAAN PENTING KEPUTUSAN ETHICAL-LEGAL MEDIS:</p>
              <p className="mt-1">
                Formulir ini mendokumentasikan instruksi medis dan persetujuan penolakan tindakan Resusitasi Jantung Paru (RJP/CPR) jika terjadi henti jantung atau henti nafas. 
                <span className="font-bold"> Perawatan suportif, terapi kenyamanan paliatif, dan analgesik pereda nyeri TETAP DIBERIKAN secara optimal.</span>
              </p>
            </div>
          </div>

          {/* IDENTITY OF SIGNER */}
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs border-b pb-2">
              1. Identitas Penandatangan / Pemberi Kuasa
            </h3>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="penandatangan"
                  value="Pasien Sendiri"
                  checked={penandatangan === 'Pasien Sendiri'}
                  onChange={(e) => setPenandatangan(e.target.value as any)}
                  className="w-4 h-4 text-rose-600"
                />
                <span className="font-bold text-slate-800 dark:text-slate-200">Pasien Sendiri (Kompeten secara mental)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="penandatangan"
                  value="Keluarga / Wali Sah"
                  checked={penandatangan === 'Keluarga / Wali Sah'}
                  onChange={(e) => setPenandatangan(e.target.value as any)}
                  className="w-4 h-4 text-rose-600"
                />
                <span className="font-bold text-slate-800 dark:text-slate-200">Keluarga Terdekat / Wali Pengampu Sah (Proxy)</span>
              </label>
            </div>

            {penandatangan === 'Keluarga / Wali Sah' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700">
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Nama Lengkap Wali:</label>
                  <input type="text" value={namaWali} onChange={(e) => setNamaWali(e.target.value)} className="w-full p-2 border rounded font-medium bg-white dark:bg-slate-900" />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Hubungan dengan Pasien:</label>
                  <input type="text" value={hubunganWali} onChange={(e) => setHubunganWali(e.target.value)} className="w-full p-2 border rounded font-medium bg-white dark:bg-slate-900" />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">NIK KTP Wali:</label>
                  <input type="text" value={nikWali} onChange={(e) => setNikWali(e.target.value)} className="w-full p-2 border rounded font-mono bg-white dark:bg-slate-900" />
                </div>
              </div>
            )}
          </div>

          {/* CLINICAL JUSTIFICATION */}
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs border-b pb-2">
              2. Indikasi & Pertimbangan Klinis DPJP
            </h3>
            <textarea
              value={alasanMedis}
              onChange={(e) => setAlasanMedis(e.target.value)}
              rows={3}
              className="w-full p-2.5 border rounded-lg bg-white dark:bg-slate-900 dark:border-slate-700 font-medium"
            />
          </div>

          {/* LIMITATION SCOPES */}
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs border-b pb-2">
              3. Lingkup Pembatasan Resusitasi
            </h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2.5 p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/40 cursor-pointer">
                <input type="checkbox" checked={tindakanDibatasi.rjpKompresiDada} onChange={(e) => setTindakanDibatasi({ ...tindakanDibatasi, rjpKompresiDada: e.target.checked })} className="w-4 h-4 text-rose-600 rounded" />
                <span className="font-medium text-slate-800 dark:text-slate-200">❌ TIDAK dilakukan Kompresi Dada Luar (Chest Compression RJP)</span>
              </label>
              <label className="flex items-center gap-2.5 p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/40 cursor-pointer">
                <input type="checkbox" checked={tindakanDibatasi.intubasiVentilator} onChange={(e) => setTindakanDibatasi({ ...tindakanDibatasi, intubasiVentilator: e.target.checked })} className="w-4 h-4 text-rose-600 rounded" />
                <span className="font-medium text-slate-800 dark:text-slate-200">❌ TIDAK dilakukan Intubasi Endotrakeal / Pemasangan Ventilator Mekanik Invasif</span>
              </label>
              <label className="flex items-center gap-2.5 p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/40 cursor-pointer">
                <input type="checkbox" checked={tindakanDibatasi.defibrilasiDCShock} onChange={(e) => setTindakanDibatasi({ ...tindakanDibatasi, defibrilasiDCShock: e.target.checked })} className="w-4 h-4 text-rose-600 rounded" />
                <span className="font-medium text-slate-800 dark:text-slate-200">❌ TIDAK dilakukan Kejutan Listrik Jantung (Defibrilasi / Kardioversi DC Shock)</span>
              </label>
              <label className="flex items-center gap-2.5 p-2 rounded-lg border border-emerald-300 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20 cursor-pointer">
                <input type="checkbox" checked={tindakanDibatasi.kenyamananPaliatifTetapDiberikan} onChange={(e) => setTindakanDibatasi({ ...tindakanDibatasi, kenyamananPaliatifTetapDiberikan: e.target.checked })} className="w-4 h-4 text-emerald-600 rounded" />
                <span className="font-bold text-emerald-800 dark:text-emerald-300">✓ TETAP DIBERIKAN: Terapi Oksigen, Pengontrol Nyeri (Analgesik), Hidrasi, & Perawatan Higienis</span>
              </label>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center shrink-0">
          <PrintPDFButton
            filename={`Formulir_DNR_${patient?.no_rm || 'Pasien'}`}
            label="Cetak Lembar DNR"
            className="text-xs bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold px-4 py-2 rounded-xl"
            documentData={patient}
            docType="formulir_dnr"
            title="FORMULIR PERINTAH JANGAN DILAKUKAN RESUSITASI (DNR)"
          />

          <div className="flex gap-2">
            <button onClick={onClose} className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl">
              Batal
            </button>
            <button onClick={handleSave} className="px-5 py-2 text-xs font-bold text-white bg-rose-700 hover:bg-rose-800 rounded-xl shadow-sm flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Simpan & Otorisasi DNR
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
