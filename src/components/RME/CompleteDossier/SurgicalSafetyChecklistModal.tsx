import React, { useState } from 'react';
import { ShieldCheck, User, CheckCircle2, AlertTriangle, Printer, Save, CheckSquare } from 'lucide-react';
import { toast } from 'react-hot-toast';
import PrintPDFButton from '../../PrintPDFButton';

interface SurgicalSafetyChecklistModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: any;
}

export function SurgicalSafetyChecklistModal({ isOpen, onClose, patient }: SurgicalSafetyChecklistModalProps) {
  const [formData, setFormData] = useState(() => {
    const key = `hospital_ssc_${patient?.no_rm || patient?.id || 'default'}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      namaOperasi: 'Laparoscopy Appendectomy + Peritoneal Lavage',
      operator: 'dr. Budi Santoso, Sp.B, FInaCS',
      anestesiolog: 'dr. Maya Indriani, Sp.An-TI, FIP',
      ruangOperasi: 'OK 02 - Bedah Sentral',
      signIn: {
        identitasTerkonfirmasi: true,
        lokasiOperasiDitandai: true,
        mesinAnestesiObatLengkap: true,
        pulseOximeterBerfungsi: true,
        riwayatAlergiDicek: true,
        risikoAspirasiDinilai: true,
        risikoPerdarahan500ml: false,
      },
      timeOut: {
        seluruhTimMemperkenalkanDiri: true,
        bacaUlangIdentitasDanTindakan: true,
        antibiotikProfilaksis60Mnt: true,
        antisipasiKondisiKritis: true,
        hasilRadiologiDitampilkan: true,
      },
      signOut: {
        namaTindakanTercatat: true,
        penghitunganKasaInstrumenLengkap: true,
        spesimenDiberiLabelBenar: true,
        masalahPeralatanDitangani: true,
        perhatianKhususPemulihanPACU: 'Awasi tanda syok, balans cairan, posisi semi-Fowler, drip analgetik terjadwal.',
      },
      perawatSirkuler: 'Ns. Dian Purnama, S.Kep',
    };
  });

  if (!isOpen) return null;

  const handleSave = () => {
    const key = `hospital_ssc_${patient?.no_rm || patient?.id || 'default'}`;
    localStorage.setItem(key, JSON.stringify(formData));
    toast.success('Surgical Safety Checklist (WHO / KARS) berhasil disimpan!');
    onClose();
  };

  const documentDataForPrint = {
    ...patient,
    surgicalSafetyData: formData,
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[120] p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* HEADER */}
        <div className="bg-emerald-700 text-white p-4 sm:p-5 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 rounded-xl">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold">WHO Surgical Safety Checklist (Keselamatan Bedah)</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-600/80 font-mono">Standar SKP.4 KARS</span>
              </div>
              <p className="text-xs text-emerald-100">
                Pasien: <span className="font-bold">{patient?.nama}</span> (No. RM: {patient?.no_rm || '-'}) • Protokol Sign In, Time Out, Sign Out
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-emerald-200 hover:text-white text-2xl font-light w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10"
          >
            ×
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-800 dark:text-slate-100 text-sm">
          
          {/* Operasi Meta */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
            <div>
              <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">Rencana Tindakan Bedah</label>
              <input
                type="text"
                value={formData.namaOperasi}
                onChange={(e) => setFormData({ ...formData, namaOperasi: e.target.value })}
                className="w-full p-2 text-xs border rounded-lg bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 font-bold"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">Dokter Operator (Bedah)</label>
              <input
                type="text"
                value={formData.operator}
                onChange={(e) => setFormData({ ...formData, operator: e.target.value })}
                className="w-full p-2 text-xs border rounded-lg bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">Dokter Spesialis Anestesi</label>
              <input
                type="text"
                value={formData.anestesiolog}
                onChange={(e) => setFormData({ ...formData, anestesiolog: e.target.value })}
                className="w-full p-2 text-xs border rounded-lg bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700"
              />
            </div>
          </div>

          {/* 3 PHASES */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* PHASE 1: SIGN IN */}
            <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/40 dark:bg-blue-950/20 space-y-3">
              <div className="flex items-center gap-2 border-b border-blue-200 dark:border-blue-800 pb-2">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">1</span>
                <div>
                  <h4 className="font-bold text-xs text-blue-950 dark:text-blue-200 uppercase">SIGN IN</h4>
                  <p className="text-[10px] text-blue-600 dark:text-blue-400">Sebelum Induksi Anestesi</p>
                </div>
              </div>
              <div className="space-y-2 text-xs">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.signIn.identitasTerkonfirmasi}
                    onChange={(e) => setFormData({ ...formData, signIn: { ...formData.signIn, identitasTerkonfirmasi: e.target.checked } })}
                    className="mt-0.5 rounded text-blue-600"
                  />
                  <span>Identitas, informed consent & gelang terkonfirmasi</span>
                </label>
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.signIn.lokasiOperasiDitandai}
                    onChange={(e) => setFormData({ ...formData, signIn: { ...formData.signIn, lokasiOperasiDitandai: e.target.checked } })}
                    className="mt-0.5 rounded text-blue-600"
                  />
                  <span>Area / sisi sayatan telah ditandai (Site Marking)</span>
                </label>
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.signIn.mesinAnestesiObatLengkap}
                    onChange={(e) => setFormData({ ...formData, signIn: { ...formData.signIn, mesinAnestesiObatLengkap: e.target.checked } })}
                    className="mt-0.5 rounded text-blue-600"
                  />
                  <span>Mesin anestesi & medikasi sedia lengkap</span>
                </label>
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.signIn.pulseOximeterBerfungsi}
                    onChange={(e) => setFormData({ ...formData, signIn: { ...formData.signIn, pulseOximeterBerfungsi: e.target.checked } })}
                    className="mt-0.5 rounded text-blue-600"
                  />
                  <span>Pulse oximeter terpasang & berfungsi baik</span>
                </label>
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.signIn.riwayatAlergiDicek}
                    onChange={(e) => setFormData({ ...formData, signIn: { ...formData.signIn, riwayatAlergiDicek: e.target.checked } })}
                    className="mt-0.5 rounded text-blue-600"
                  />
                  <span>Riwayat alergi telah dikonfirmasi</span>
                </label>
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.signIn.risikoAspirasiDinilai}
                    onChange={(e) => setFormData({ ...formData, signIn: { ...formData.signIn, risikoAspirasiDinilai: e.target.checked } })}
                    className="mt-0.5 rounded text-blue-600"
                  />
                  <span>Risiko aspirasi / jalan napas sulit dinilai</span>
                </label>
              </div>
            </div>

            {/* PHASE 2: TIME OUT */}
            <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/40 dark:bg-amber-950/20 space-y-3">
              <div className="flex items-center gap-2 border-b border-amber-200 dark:border-amber-800 pb-2">
                <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-xs">2</span>
                <div>
                  <h4 className="font-bold text-xs text-amber-950 dark:text-amber-200 uppercase">TIME OUT</h4>
                  <p className="text-[10px] text-amber-600 dark:text-amber-400">Sebelum Insisi Kulit</p>
                </div>
              </div>
              <div className="space-y-2 text-xs">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.timeOut.seluruhTimMemperkenalkanDiri}
                    onChange={(e) => setFormData({ ...formData, timeOut: { ...formData.timeOut, seluruhTimMemperkenalkanDiri: e.target.checked } })}
                    className="mt-0.5 rounded text-amber-600"
                  />
                  <span>Seluruh anggota tim memperkenalkan nama & peran</span>
                </label>
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.timeOut.bacaUlangIdentitasDanTindakan}
                    onChange={(e) => setFormData({ ...formData, timeOut: { ...formData.timeOut, bacaUlangIdentitasDanTindakan: e.target.checked } })}
                    className="mt-0.5 rounded text-amber-600"
                  />
                  <span>Konfirmasi lisan nama pasien & prosedur bedah</span>
                </label>
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.timeOut.antibiotikProfilaksis60Mnt}
                    onChange={(e) => setFormData({ ...formData, timeOut: { ...formData.timeOut, antibiotikProfilaksis60Mnt: e.target.checked } })}
                    className="mt-0.5 rounded text-amber-600"
                  />
                  <span>Antibiotik profilaksis sudah masuk ≤ 60 menit</span>
                </label>
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.timeOut.antisipasiKondisiKritis}
                    onChange={(e) => setFormData({ ...formData, timeOut: { ...formData.timeOut, antisipasiKondisiKritis: e.target.checked } })}
                    className="mt-0.5 rounded text-amber-600"
                  />
                  <span>Antisipasi kejadian kritis & perkiraan durasi</span>
                </label>
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.timeOut.hasilRadiologiDitampilkan}
                    onChange={(e) => setFormData({ ...formData, timeOut: { ...formData.timeOut, hasilRadiologiDitampilkan: e.target.checked } })}
                    className="mt-0.5 rounded text-amber-600"
                  />
                  <span>Foto radiologi / penunjang penting terpampang</span>
                </label>
              </div>
            </div>

            {/* PHASE 3: SIGN OUT */}
            <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/20 space-y-3">
              <div className="flex items-center gap-2 border-b border-emerald-200 dark:border-emerald-800 pb-2">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">3</span>
                <div>
                  <h4 className="font-bold text-xs text-emerald-950 dark:text-emerald-200 uppercase">SIGN OUT</h4>
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400">Sebelum Menutup Luka Bedah</p>
                </div>
              </div>
              <div className="space-y-2 text-xs">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.signOut.namaTindakanTercatat}
                    onChange={(e) => setFormData({ ...formData, signOut: { ...formData.signOut, namaTindakanTercatat: e.target.checked } })}
                    className="mt-0.5 rounded text-emerald-600"
                  />
                  <span>Nama tindakan definitif telah dicatat resmi</span>
                </label>
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.signOut.penghitunganKasaInstrumenLengkap}
                    onChange={(e) => setFormData({ ...formData, signOut: { ...formData.signOut, penghitunganKasaInstrumenLengkap: e.target.checked } })}
                    className="mt-0.5 rounded text-emerald-600"
                  />
                  <span>Jumlah kasa, jarum, instrumen sesuai (Lengkap)</span>
                </label>
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.signOut.spesimenDiberiLabelBenar}
                    onChange={(e) => setFormData({ ...formData, signOut: { ...formData.signOut, spesimenDiberiLabelBenar: e.target.checked } })}
                    className="mt-0.5 rounded text-emerald-600"
                  />
                  <span>Label spesimen jaringan PA diberi nama & No RM</span>
                </label>
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.signOut.masalahPeralatanDitangani}
                    onChange={(e) => setFormData({ ...formData, signOut: { ...formData.signOut, masalahPeralatanDitangani: e.target.checked } })}
                    className="mt-0.5 rounded text-emerald-600"
                  />
                  <span>Tidak ada kendala / malfungsi alat operasi</span>
                </label>
              </div>
            </div>
          </div>

          {/* Catatan PACU & Perawat Sirkuler */}
          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Instruksi Khusus Perawatan Pasca Bedah & PACU</label>
              <textarea
                rows={2}
                value={formData.signOut.perhatianKhususPemulihanPACU}
                onChange={(e) => setFormData({ ...formData, signOut: { ...formData.signOut, perhatianKhususPemulihanPACU: e.target.value } })}
                className="w-full p-2.5 text-xs border rounded-lg bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Perawat Sirkuler (Kamar Operasi)</label>
              <input
                type="text"
                value={formData.perawatSirkuler}
                onChange={(e) => setFormData({ ...formData, perawatSirkuler: e.target.value })}
                className="w-full p-2 text-xs border rounded-lg bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700"
              />
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center shrink-0">
          <PrintPDFButton
            filename={`SSC_${patient?.no_rm || 'Pasien'}`}
            label="Cetak Lembar SSC"
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl"
            documentData={documentDataForPrint}
            docType="surgical_safety_checklist"
            title="WHO SURGICAL SAFETY CHECKLIST"
          />

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold hover:bg-slate-300"
            >
              Tutup
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md"
            >
              <Save className="w-4 h-4" /> Simpan Surgical Checklist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
