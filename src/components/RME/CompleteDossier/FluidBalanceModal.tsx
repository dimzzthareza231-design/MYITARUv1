import React, { useState } from 'react';
import { Droplet, User, HeartPulse, Scale, CheckCircle2, Printer, Save, Clock } from 'lucide-react';
import { toast } from 'react-hot-toast';
import PrintPDFButton from '../../PrintPDFButton';

interface FluidBalanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: any;
}

export function FluidBalanceModal({ isOpen, onClose, patient }: FluidBalanceModalProps) {
  const [formData, setFormData] = useState(() => {
    const key = `hospital_fluid_balance_${patient?.no_rm || patient?.id || 'default'}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      tanggalObservasi: new Date().toISOString().split('T')[0],
      shift: '24 Jam Penuh',
      bbPasien: patient?.bb || 60,
      intake: {
        oralEnteral: 600,
        parenteralInfus: 1500,
        injeksiObat: 200,
        transfusi: 0,
        totalIntake: 2300,
      },
      output: {
        urine: 1400,
        drainStoma: 50,
        muntahNGT: 0,
        pendarahan: 0,
        feses: 150,
        iwl: 600, // 10 ml/kgBB/24 jam = 600 ml
        totalOutput: 2200,
      },
      balans24Jam: 100, // +100 ml
      diuresis: '0.97 ml/kgBB/jam (Adekuat)',
      evaluasiKlinis: 'Balans cairan positif ringan (+100 ml/24 jam), diuresis adekuat (> 0.5 ml/kgBB/jam), turgor kulit elastis, mukosa bibir lembab, tidak ada edema perifer.',
      perawatPenanggungJawab: 'Ns. Ratna Sari, S.Kep',
    };
  });

  if (!isOpen) return null;

  // Recalculate totals dynamically
  const handleIntakeChange = (field: string, val: number) => {
    const newIntake = { ...formData.intake, [field]: val };
    const totalIntake = (newIntake.oralEnteral || 0) + (newIntake.parenteralInfus || 0) + (newIntake.injeksiObat || 0) + (newIntake.transfusi || 0);
    newIntake.totalIntake = totalIntake;
    const totalOutput = formData.output.totalOutput;
    const balans24Jam = totalIntake - totalOutput;
    setFormData({ ...formData, intake: newIntake, balans24Jam });
  };

  const handleOutputChange = (field: string, val: number) => {
    const newOutput = { ...formData.output, [field]: val };
    const totalOutput = (newOutput.urine || 0) + (newOutput.drainStoma || 0) + (newOutput.muntahNGT || 0) + (newOutput.pendarahan || 0) + (newOutput.feses || 0) + (newOutput.iwl || 0);
    newOutput.totalOutput = totalOutput;
    const totalIntake = formData.intake.totalIntake;
    const balans24Jam = totalIntake - totalOutput;
    setFormData({ ...formData, output: newOutput, balans24Jam });
  };

  const handleSave = () => {
    const key = `hospital_fluid_balance_${patient?.no_rm || patient?.id || 'default'}`;
    localStorage.setItem(key, JSON.stringify(formData));
    toast.success('Lembar Balans Cairan 24 Jam berhasil disimpan!');
    onClose();
  };

  const documentDataForPrint = {
    ...patient,
    fluidBalanceData: formData,
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[120] p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* HEADER */}
        <div className="bg-sky-600 text-white p-4 sm:p-5 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 rounded-xl">
              <Droplet className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold">Lembar Pemantauan Balans Cairan & IWL (24 Jam)</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-sky-500/80 font-mono">Permenkes 24/2022</span>
              </div>
              <p className="text-xs text-sky-100">
                Pasien: <span className="font-bold">{patient?.nama}</span> (No. RM: {patient?.no_rm || '-'}) • Pemantauan Intake, Output & Diuresis Jam-Jaman
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-sky-200 hover:text-white text-2xl font-light w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10"
          >
            ×
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 overflow-y-auto space-y-5 text-slate-800 dark:text-slate-100 text-sm">
          
          {/* Header Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
            <div>
              <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">Tanggal Observasi</label>
              <input
                type="date"
                value={formData.tanggalObservasi}
                onChange={(e) => setFormData({ ...formData, tanggalObservasi: e.target.value })}
                className="w-full p-2 text-xs border rounded-lg bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">Shift / Periode</label>
              <input
                type="text"
                value={formData.shift}
                onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
                className="w-full p-2 text-xs border rounded-lg bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 font-semibold"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">Berat Badan Pasien (kg)</label>
              <input
                type="number"
                value={formData.bbPasien}
                onChange={(e) => setFormData({ ...formData, bbPasien: Number(e.target.value) })}
                className="w-full p-2 text-xs border rounded-lg bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 font-mono font-bold"
              />
            </div>
          </div>

          {/* Intake vs Output Dual Column */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* INTAKE */}
            <div className="p-4 rounded-xl border border-sky-200 dark:border-sky-900/60 bg-sky-50/40 dark:bg-sky-950/20 space-y-3">
              <div className="flex justify-between items-center border-b border-sky-200 dark:border-sky-800 pb-2">
                <span className="font-bold text-xs uppercase tracking-wider text-sky-950 dark:text-sky-300">INTAKE CAIRAN (MASUK)</span>
                <span className="text-xs font-black text-sky-700 dark:text-sky-400">{formData.intake.totalIntake} ml</span>
              </div>
              <div className="space-y-2 text-xs">
                <div>
                  <label className="block text-[11px] text-slate-600 dark:text-slate-400">Oral & Minum / Sonde NGT (ml)</label>
                  <input
                    type="number"
                    value={formData.intake.oralEnteral}
                    onChange={(e) => handleIntakeChange('oralEnteral', Number(e.target.value))}
                    className="w-full p-1.5 border rounded bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-600 dark:text-slate-400">Infus Intravena / Parenteral (ml)</label>
                  <input
                    type="number"
                    value={formData.intake.parenteralInfus}
                    onChange={(e) => handleIntakeChange('parenteralInfus', Number(e.target.value))}
                    className="w-full p-1.5 border rounded bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-600 dark:text-slate-400">Injeksi Obat & Drip (ml)</label>
                  <input
                    type="number"
                    value={formData.intake.injeksiObat}
                    onChange={(e) => handleIntakeChange('injeksiObat', Number(e.target.value))}
                    className="w-full p-1.5 border rounded bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-600 dark:text-slate-400">Transfusi Darah / Produk Darah (ml)</label>
                  <input
                    type="number"
                    value={formData.intake.transfusi}
                    onChange={(e) => handleIntakeChange('transfusi', Number(e.target.value))}
                    className="w-full p-1.5 border rounded bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* OUTPUT */}
            <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/40 dark:bg-amber-950/20 space-y-3">
              <div className="flex justify-between items-center border-b border-amber-200 dark:border-amber-800 pb-2">
                <span className="font-bold text-xs uppercase tracking-wider text-amber-950 dark:text-amber-300">OUTPUT CAIRAN (KELUAR)</span>
                <span className="text-xs font-black text-amber-700 dark:text-amber-400">{formData.output.totalOutput} ml</span>
              </div>
              <div className="space-y-2 text-xs">
                <div>
                  <label className="block text-[11px] text-slate-600 dark:text-slate-400">Urin (Kateter / Spontan) (ml)</label>
                  <input
                    type="number"
                    value={formData.output.urine}
                    onChange={(e) => handleOutputChange('urine', Number(e.target.value))}
                    className="w-full p-1.5 border rounded bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-600 dark:text-slate-400">Drain / Stoma / Cairan NGT (ml)</label>
                  <input
                    type="number"
                    value={formData.output.drainStoma}
                    onChange={(e) => handleOutputChange('drainStoma', Number(e.target.value))}
                    className="w-full p-1.5 border rounded bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-600 dark:text-slate-400">Feses & Muntah (ml)</label>
                  <input
                    type="number"
                    value={formData.output.feses}
                    onChange={(e) => handleOutputChange('feses', Number(e.target.value))}
                    className="w-full p-1.5 border rounded bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-600 dark:text-slate-400">Insensible Water Loss (IWL = 10 x BB) (ml)</label>
                  <input
                    type="number"
                    value={formData.output.iwl}
                    onChange={(e) => handleOutputChange('iwl', Number(e.target.value))}
                    className="w-full p-1.5 border rounded bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Hasil Balans */}
          <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-3">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase block">Total Balans Cairan 24 Jam</span>
              <span className={`text-2xl font-black ${formData.balans24Jam >= 0 ? 'text-sky-600 dark:text-sky-400' : 'text-rose-600 dark:text-rose-400'}`}>
                {formData.balans24Jam > 0 ? `+${formData.balans24Jam}` : formData.balans24Jam} ml
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-slate-500 uppercase block">Laju Diuresis (ml/kgBB/jam)</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white font-mono">{formData.diuresis}</span>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Evaluasi & Rekomendasi Terapi Cairan</label>
            <textarea
              rows={2}
              value={formData.evaluasiKlinis}
              onChange={(e) => setFormData({ ...formData, evaluasiKlinis: e.target.value })}
              className="w-full p-2.5 text-xs border rounded-lg bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700"
            />
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center shrink-0">
          <PrintPDFButton
            filename={`Balans_Cairan_${patient?.no_rm || 'Pasien'}`}
            label="Cetak Balans Cairan"
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl"
            documentData={documentDataForPrint}
            docType="fluid_balance"
            title="LEMBAR BALANS CAIRAN 24 JAM"
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
              className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md"
            >
              <Save className="w-4 h-4" /> Simpan Balans Cairan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
