import React, { useState } from 'react';
import { TrendingUp, Plus, Baby, Activity, Scale, Ruler, CheckCircle2, AlertTriangle } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ReferenceLine } from 'recharts';
import { toast } from 'react-hot-toast';

export interface GrowthDataPoint {
  ageMonths: number;
  ageLabel: string;
  weightKg: number;
  heightCm: number;
  bmi: number;
  headCircumferenceCm?: number;
  date: string;
}

export function GrowthChartTab({ patientData }: { patientData: any }) {
  const [chartType, setChartType] = useState<'weight' | 'height' | 'bmi'>('weight');
  const [showAddModal, setShowAddModal] = useState(false);

  // WHO Standard Percentile curves data simulation (Age 0 - 60 Months)
  const whoWeightCurve = [
    { age: 0, sdNeg3: 2.1, sdNeg2: 2.5, median: 3.3, sdPos2: 4.4, sdPos3: 5.0, patient: 3.4 },
    { age: 6, sdNeg3: 5.5, sdNeg2: 6.4, median: 7.9, sdPos2: 9.8, sdPos3: 10.8, patient: 8.1 },
    { age: 12, sdNeg3: 7.1, sdNeg2: 8.1, median: 9.6, sdPos2: 11.5, sdPos3: 12.4, patient: 9.8 },
    { age: 18, sdNeg3: 8.2, sdNeg2: 9.2, median: 10.9, sdPos2: 13.0, sdPos3: 14.1, patient: 11.2 },
    { age: 24, sdNeg3: 9.0, sdNeg2: 10.1, median: 12.2, sdPos2: 14.5, sdPos3: 15.8, patient: 12.5 },
    { age: 36, sdNeg3: 10.8, sdNeg2: 12.0, median: 14.3, sdPos2: 17.2, sdPos3: 19.0, patient: 14.6 },
    { age: 48, sdNeg3: 12.3, sdNeg2: 13.8, median: 16.3, sdPos2: 19.8, sdPos3: 22.0, patient: 16.8 },
    { age: 60, sdNeg3: 13.7, sdNeg2: 15.3, median: 18.3, sdPos2: 22.5, sdPos3: 25.2, patient: 18.9 },
  ];

  const whoHeightCurve = [
    { age: 0, sdNeg3: 45.0, sdNeg2: 46.5, median: 49.9, sdPos2: 53.4, sdPos3: 55.0, patient: 50.5 },
    { age: 6, sdNeg3: 61.2, sdNeg2: 63.3, median: 67.6, sdPos2: 71.9, sdPos3: 74.0, patient: 68.0 },
    { age: 12, sdNeg3: 70.0, sdNeg2: 72.0, median: 75.7, sdPos2: 80.5, sdPos3: 82.5, patient: 76.5 },
    { age: 18, sdNeg3: 76.8, sdNeg2: 79.2, median: 82.3, sdPos2: 87.0, sdPos3: 89.2, patient: 83.2 },
    { age: 24, sdNeg3: 81.0, sdNeg2: 84.1, median: 87.8, sdPos2: 93.0, sdPos3: 95.5, patient: 88.5 },
    { age: 36, sdNeg3: 88.5, sdNeg2: 92.4, median: 96.1, sdPos2: 102.5, sdPos3: 105.0, patient: 97.0 },
    { age: 48, sdNeg3: 95.0, sdNeg2: 99.1, median: 103.3, sdPos2: 110.0, sdPos3: 113.0, patient: 104.5 },
    { age: 60, sdNeg3: 100.5, sdNeg2: 105.3, median: 110.0, sdPos2: 117.2, sdPos3: 120.5, patient: 111.2 },
  ];

  const [growthHistory, setGrowthHistory] = useState<GrowthDataPoint[]>([
    { ageMonths: 60, ageLabel: '5 Tahun', weightKg: 18.9, heightCm: 111.2, bmi: 15.3, headCircumferenceCm: 50.5, date: '30 Aug 2026' },
    { ageMonths: 48, ageLabel: '4 Tahun', weightKg: 16.8, heightCm: 104.5, bmi: 15.4, headCircumferenceCm: 49.8, date: '12 Aug 2025' },
    { ageMonths: 36, ageLabel: '3 Tahun', weightKg: 14.6, heightCm: 97.0, bmi: 15.5, headCircumferenceCm: 49.0, date: '15 Agu 2024' },
    { ageMonths: 24, ageLabel: '2 Tahun', weightKg: 12.5, heightCm: 88.5, bmi: 16.0, headCircumferenceCm: 48.0, date: '10 Agu 2023' },
  ]);

  const [newPoint, setNewPoint] = useState({
    ageMonths: 60,
    weightKg: 19.0,
    heightCm: 112.0,
    headCircumferenceCm: 51.0,
    date: new Date().toISOString().split('T')[0]
  });

  const handleAddPoint = () => {
    const bmi = Number((newPoint.weightKg / Math.pow(newPoint.heightCm / 100, 2)).toFixed(1));
    const created: GrowthDataPoint = {
      ageMonths: Number(newPoint.ageMonths),
      ageLabel: `${newPoint.ageMonths} Bulan`,
      weightKg: Number(newPoint.weightKg),
      heightCm: Number(newPoint.heightCm),
      headCircumferenceCm: Number(newPoint.headCircumferenceCm),
      bmi,
      date: newPoint.date
    };

    setGrowthHistory([created, ...growthHistory]);
    setShowAddModal(false);
    toast.success('Data pengukuran antropometri baru berhasil disimpan');
  };

  const chartData = chartType === 'weight' ? whoWeightCurve : whoHeightCurve;
  const unitLabel = chartType === 'weight' ? 'kg' : 'cm';
  const titleLabel = chartType === 'weight' ? 'Berat Badan menurut Umur (BB/U)' : 'Panjang/Tinggi Badan menurut Umur (TB/U)';

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* HEADER SECTION */}
      <div className="bg-white/[0.02] dark:bg-slate-900/40 backdrop-blur-xl rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
              <Baby className="w-6 h-6 text-pink-600 dark:text-pink-400" />
              Kurva Pertumbuhan Anak (WHO Growth Standard / KMS)
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Pemantauan persentil antropometri anak berbasis standar WHO 2006 & Kemenkes untuk deteksi dini stunting dan gizi buruk.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-pink-600 hover:bg-pink-700 text-white text-sm font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" /> Catat Antropometri
            </button>
          </div>
        </div>

        {/* NUTRITIONAL STATUS BANNER */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="bg-emerald-50 dark:bg-emerald-950/40 p-4 rounded-xl border border-emerald-200 dark:border-emerald-800">
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-bold text-xs">
              <CheckCircle2 className="w-4 h-4" /> Status BB/U
            </div>
            <p className="text-base font-extrabold text-emerald-900 dark:text-emerald-100 mt-1">Gizi Baik (Normal)</p>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Z-Score: +0.4 SD</p>
          </div>

          <div className="bg-emerald-50 dark:bg-emerald-950/40 p-4 rounded-xl border border-emerald-200 dark:border-emerald-800">
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-bold text-xs">
              <CheckCircle2 className="w-4 h-4" /> Status TB/U
            </div>
            <p className="text-base font-extrabold text-emerald-900 dark:text-emerald-100 mt-1">Tinggi Normal</p>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Bebas Stunting (+0.6 SD)</p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950/40 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 font-bold text-xs">
              <Scale className="w-4 h-4" /> BB/TB (IMT/U)
            </div>
            <p className="text-base font-extrabold text-blue-900 dark:text-blue-100 mt-1">15.3 kg/m²</p>
            <p className="text-[11px] text-blue-600 dark:text-blue-400 font-medium">Normoweight (Median)</p>
          </div>

          <div className="bg-purple-50 dark:bg-purple-950/40 p-4 rounded-xl border border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300 font-bold text-xs">
              <Ruler className="w-4 h-4" /> Lingkar Kepala
            </div>
            <p className="text-base font-extrabold text-purple-900 dark:text-purple-100 mt-1">50.5 cm</p>
            <p className="text-[11px] text-purple-600 dark:text-purple-400 font-medium">Normocephalic</p>
          </div>
        </div>
      </div>

      {/* GRAPH CARD */}
      <div className="bg-white/[0.02] dark:bg-slate-900/40 backdrop-blur-xl rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-pink-500" /> {titleLabel}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Plot kurva Z-Score -3SD, -2SD, Median (0SD), +2SD, +3SD</p>
          </div>

          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setChartType('weight')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                chartType === 'weight'
                  ? 'bg-pink-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Berat Badan (BB/U)
            </button>
            <button
              onClick={() => setChartType('height')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                chartType === 'height'
                  ? 'bg-pink-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Tinggi Badan (TB/U)
            </button>
          </div>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
              <XAxis dataKey="age" label={{ value: 'Usia (Bulan)', position: 'insideBottom', offset: -10 }} />
              <YAxis label={{ value: unitLabel, angle: -90, position: 'insideLeft' }} />
              <Tooltip
                formatter={(val: any, name: any) => {
                  const key = String(name || '');
                  const labels: Record<string, string> = {
                    patient: 'Data Pasien',
                    median: 'Median (0 SD)',
                    sdPos2: '+2 SD (Batas Atas)',
                    sdNeg2: '-2 SD (Batas Bawah Stunting)',
                    sdPos3: '+3 SD',
                    sdNeg3: '-3 SD (Sangat Kurang)'
                  };
                  return [`${val} ${unitLabel}`, labels[key] || key];
                }}
              />
              <Legend verticalAlign="top" height={36} />

              <Line type="monotone" dataKey="sdPos3" stroke="#cbd5e1" strokeDasharray="3 3" name="+3 SD" dot={false} />
              <Line type="monotone" dataKey="sdPos2" stroke="#f59e0b" strokeDasharray="4 4" name="+2 SD (Over)" dot={false} />
              <Line type="monotone" dataKey="median" stroke="#10b981" strokeWidth={2.5} name="Median (Normal)" dot={false} />
              <Line type="monotone" dataKey="sdNeg2" stroke="#ef4444" strokeDasharray="4 4" name="-2 SD (Stunting/Gizi Kurang)" dot={false} />
              <Line type="monotone" dataKey="sdNeg3" stroke="#991b1b" strokeDasharray="3 3" name="-3 SD" dot={false} />
              
              {/* PATIENT ACTUAL LINE */}
              <Line
                type="monotone"
                dataKey="patient"
                stroke="#db2777"
                strokeWidth={3.5}
                name="Pasien (Aktual)"
                dot={{ r: 6, fill: '#db2777', stroke: '#fff', strokeWidth: 2 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* HISTORY TABLE */}
      <div className="bg-white/[0.02] dark:bg-slate-900/40 backdrop-blur-xl rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800">
          <h4 className="font-bold text-sm text-slate-900 dark:text-white">Riwayat Pengukuran Antropometri</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-4">Tanggal Ukur</th>
                <th className="p-4">Usia</th>
                <th className="p-4">Berat Badan</th>
                <th className="p-4">Tinggi Badan</th>
                <th className="p-4">IMT (BMI)</th>
                <th className="p-4">Lingkar Kepala</th>
                <th className="p-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {growthHistory.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-4 font-bold text-slate-900 dark:text-white">{item.date}</td>
                  <td className="p-4 text-slate-600 dark:text-slate-300">{item.ageLabel}</td>
                  <td className="p-4 font-mono font-bold text-pink-600">{item.weightKg} kg</td>
                  <td className="p-4 font-mono font-bold text-blue-600">{item.heightCm} cm</td>
                  <td className="p-4 font-mono">{item.bmi} kg/m²</td>
                  <td className="p-4 font-mono">{item.headCircumferenceCm || '-'} cm</td>
                  <td className="p-4 text-center">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                      Gizi Baik
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD POINT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/[0.02] dark:bg-slate-900/40 backdrop-blur-xl rounded-2xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-5 bg-pink-600 text-white flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Scale className="w-5 h-5" /> Catat Pengukuran Baru
                </h3>
                <p className="text-xs text-pink-100 mt-0.5">Pasien: {patientData?.nama}</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-white/80 hover:text-white p-1">✕</button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Tanggal Pengukuran
                  </label>
                  <input
                    type="date"
                    value={newPoint.date}
                    onChange={e => setNewPoint({ ...newPoint, date: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Usia (Bulan)
                  </label>
                  <input
                    type="number"
                    value={newPoint.ageMonths}
                    onChange={e => setNewPoint({ ...newPoint, ageMonths: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    BB (kg) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={newPoint.weightKg}
                    onChange={e => setNewPoint({ ...newPoint, weightKg: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none font-bold text-pink-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    TB/PB (cm) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={newPoint.heightCm}
                    onChange={e => setNewPoint({ ...newPoint, heightCm: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none font-bold text-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    LK (cm)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={newPoint.headCircumferenceCm}
                    onChange={e => setNewPoint({ ...newPoint, headCircumferenceCm: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none font-bold text-purple-600"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl"
              >
                Batal
              </button>
              <button
                onClick={handleAddPoint}
                className="bg-pink-600 hover:bg-pink-700 text-white text-sm font-bold px-5 py-2 rounded-xl shadow-md transition-all"
              >
                Simpan Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
