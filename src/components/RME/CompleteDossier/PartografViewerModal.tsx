import React, { useState } from 'react';
import { Activity, HeartPulse, CheckCircle2, User, Clock, AlertTriangle, ShieldCheck } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine } from 'recharts';
import { toast } from 'react-hot-toast';
import PrintPDFButton from '../../PrintPDFButton';

interface PartografModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: any;
}

export function PartografViewerModal({ isOpen, onClose, patient }: PartografModalProps) {
  const [dataPoints, setDataPoints] = useState([
    { jam: '08:00', waktuJam: 0, pembukaan: 4, turunKepala: 4, djj: 140, hisFrekuensi: 3, hisDurasi: 35, tdSistol: 110, tdDiastol: 70, nadi: 80, ketuban: 'J', penyusupan: '0' },
    { jam: '09:00', waktuJam: 1, pembukaan: 5, turunKepala: 3, djj: 138, hisFrekuensi: 3, hisDurasi: 40, tdSistol: 115, tdDiastol: 75, nadi: 82, ketuban: 'J', penyusupan: '0' },
    { jam: '10:00', waktuJam: 2, pembukaan: 6, turunKepala: 3, djj: 142, hisFrekuensi: 4, hisDurasi: 45, tdSistol: 120, tdDiastol: 80, nadi: 84, ketuban: 'J', penyusupan: '1' },
    { jam: '11:00', waktuJam: 3, pembukaan: 8, turunKepala: 2, djj: 136, hisFrekuensi: 4, hisDurasi: 45, tdSistol: 120, tdDiastol: 80, nadi: 86, ketuban: 'J', penyusupan: '1' },
    { jam: '12:00', waktuJam: 4, pembukaan: 10, turunKepala: 0, djj: 144, hisFrekuensi: 5, hisDurasi: 50, tdSistol: 125, tdDiastol: 80, nadi: 88, ketuban: 'P', penyusupan: '1' },
  ]);

  const [newEntry, setNewEntry] = useState({
    jam: '13:00',
    waktuJam: 5,
    pembukaan: 10,
    turunKepala: 0,
    djj: 140,
    hisFrekuensi: 5,
    hisDurasi: 50,
    tdSistol: 120,
    tdDiastol: 80,
    nadi: 84,
    ketuban: 'P',
    penyusupan: '1'
  });

  const [gravida, setGravida] = useState('G2P1A0');
  const [ketubanPecahSejak, setKetubanPecahSejak] = useState('Pukul 06:30 WIB (Jernih)');
  const [mulesSejak, setMulesSejak] = useState('Pukul 04:00 WIB');

  if (!isOpen) return null;

  // Chart data with Alert (Waspada) and Action (Bertindak) lines
  const chartData = dataPoints.map((dp, idx) => ({
    ...dp,
    garisWaspada: 4 + dp.waktuJam * 1, // Alert line starts at 4 cm, progresses 1 cm/hr
    garisBertindak: dp.waktuJam >= 4 ? 4 + (dp.waktuJam - 4) * 1 : null, // Action line is 4 hours to the right
  }));

  const handleAddDataPoint = () => {
    setDataPoints([...dataPoints, { ...newEntry, waktuJam: dataPoints.length }]);
    toast.success('Titik observasi partograf berhasil ditambahkan!');
  };

  const handleSave = () => {
    const key = `hospital_partograf_${patient?.no_rm || patient?.id || 'default'}`;
    const partografData = {
      id: Date.now(),
      tanggal: new Date().toISOString(),
      gravida,
      ketubanPecahSejak,
      mulesSejak,
      dataPoints,
      bidan: 'Bd. Novita Wulandari, S.Tr.Keb / dr. Sp.OG'
    };
    localStorage.setItem(key, JSON.stringify(partografData));
    toast.success('Lembar Partograf Pemantauan Persalinan berhasil disimpan!');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[120] p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* HEADER */}
        <div className="bg-pink-600 text-white p-4 sm:p-5 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 rounded-xl">
              <HeartPulse className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold">Lembar Partograf WHO (Pemantauan Kemajuan Persalinan)</h2>
              <p className="text-xs text-pink-100">
                Ibu: <span className="font-bold">{patient?.nama}</span> ({patient?.no_rm}) • Standar Asuhan Persalinan Normal (APN Kemenkes RI)
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white text-2xl font-bold w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10">✕</button>
        </div>

        {/* BODY */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm">
          
          {/* OBSTETRIC DEMOGRAPHICS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
            <div>
              <label className="block text-slate-500 font-bold mb-1">Status Obstetri (GPA):</label>
              <input
                type="text"
                value={gravida}
                onChange={(e) => setGravida(e.target.value)}
                className="w-full p-2 border rounded-lg bg-white dark:bg-slate-900 font-bold text-pink-600"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-bold mb-1">Mules / His Dirasakan Sejak:</label>
              <input
                type="text"
                value={mulesSejak}
                onChange={(e) => setMulesSejak(e.target.value)}
                className="w-full p-2 border rounded-lg bg-white dark:bg-slate-900 font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-bold mb-1">Ketuban Pecah Sejak & Sifat:</label>
              <input
                type="text"
                value={ketubanPecahSejak}
                onChange={(e) => setKetubanPecahSejak(e.target.value)}
                className="w-full p-2 border rounded-lg bg-white dark:bg-slate-900 font-medium"
              />
            </div>
          </div>

          {/* PARTOGRAPH DILATION & DESCENT CHART */}
          <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3 shadow-xs">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs flex items-center gap-2">
                <Activity className="w-4 h-4 text-pink-600" /> Kurva Pembukaan Serviks & Garis Waspada / Bertindak (WHO)
              </h3>
              <div className="flex items-center gap-3 text-[11px] font-bold">
                <span className="flex items-center gap-1 text-pink-600"><span className="w-2.5 h-2.5 rounded-full bg-pink-600 inline-block"/> Pembukaan (cm)</span>
                <span className="flex items-center gap-1 text-amber-600"><span className="w-2.5 h-0.5 bg-amber-500 inline-block"/> Garis Waspada</span>
                <span className="flex items-center gap-1 text-rose-600"><span className="w-2.5 h-0.5 bg-rose-600 inline-block"/> Garis Bertindak</span>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="jam" />
                  <YAxis domain={[0, 10]} ticks={[0, 2, 4, 6, 8, 10]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="pembukaan" stroke="#db2777" strokeWidth={3} dot={{ r: 5 }} name="Pembukaan Serviks (cm)" />
                  <Line type="monotone" dataKey="garisWaspada" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" name="Garis Waspada" />
                  <Line type="monotone" dataKey="garisBertindak" stroke="#e11d48" strokeWidth={2} strokeDasharray="3 3" name="Garis Bertindak" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* OBSERVATION TABLE */}
          <div className="space-y-2">
            <h4 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
              Tabel Observasi Lengkap (DJJ, His, Tanda Vital, Urin & Ketuban):
            </h4>
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b dark:border-slate-700">
                  <tr>
                    <th className="p-2.5">Jam</th>
                    <th className="p-2.5 text-center">Pembukaan</th>
                    <th className="p-2.5 text-center">Turun Kepala</th>
                    <th className="p-2.5 text-center">DJJ (x/m)</th>
                    <th className="p-2.5 text-center">His (x/10m & Durasi)</th>
                    <th className="p-2.5 text-center">Ketuban / Molase</th>
                    <th className="p-2.5 text-center">Tensi & Nadi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900">
                  {dataPoints.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="p-2.5 font-mono font-bold text-pink-600">{row.jam}</td>
                      <td className="p-2.5 text-center font-bold">{row.pembukaan} cm</td>
                      <td className="p-2.5 text-center font-mono">{row.turunKepala}/5</td>
                      <td className="p-2.5 text-center font-bold text-blue-600">{row.djj} x/m</td>
                      <td className="p-2.5 text-center">{row.hisFrekuensi}x / {row.hisDurasi}"</td>
                      <td className="p-2.5 text-center">{row.ketuban === 'J' ? 'Jernih' : row.ketuban === 'P' ? 'Pecah' : 'Utuh'} / {row.penyusupan}</td>
                      <td className="p-2.5 text-center">{row.tdSistol}/{row.tdDiastol} mmHg • {row.nadi} x/m</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center shrink-0">
          <PrintPDFButton
            filename={`Partograf_${patient?.no_rm || 'Pasien'}`}
            label="Cetak Lembar Partograf"
            className="text-xs bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold px-4 py-2 rounded-xl"
            documentData={patient}
            docType="partograf"
            title="LEMBAR PARTOGRAF PERSALINAN (WHO)"
          />

          <div className="flex gap-2">
            <button onClick={onClose} className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl">
              Batal
            </button>
            <button onClick={handleSave} className="px-5 py-2 text-xs font-bold text-white bg-pink-600 hover:bg-pink-700 rounded-xl shadow-sm flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Simpan Partograf
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
