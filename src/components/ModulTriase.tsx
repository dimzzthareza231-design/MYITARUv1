import React, { useState } from 'react';

export default function ModulTriase() {
  const [formData, setFormData] = useState({
    td_sistolik: '', td_diastolik: '', nadi: '', suhu: '',
    rr: '', spo2: '', bb: '', tb: '',
    keluhan: '', alergi: '',
    skor_triase: '', kategori: '', tindak_lanjut: ''
  });
  
  // Auto-calculate skor triase
  const calculateTriase = () => {
    let score = 0;
    let kategori = 'Hijau';
    
    // Logika triase sederhana
    const suhuNum = parseFloat(formData.suhu) || 36.5;
    const spo2Num = parseFloat(formData.spo2) || 98;

    if (suhuNum > 39 || spo2Num < 90) {
      score = 3; kategori = 'Merah';
    } else if (suhuNum > 38 || spo2Num < 95) {
      score = 2; kategori = 'Kuning';
    } else {
      score = 1; kategori = 'Hijau';
    }
    
    setFormData({ ...formData, skor_triase: score.toString(), kategori });
  };
  
  return (
    <div className="p-6 h-full overflow-y-auto">
      <h1 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-100">🏥 Modul Triase</h1>
      
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <h3 className="font-bold mb-4 text-slate-800 dark:text-slate-100">Input Tanda Vital</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block font-semibold mb-2 text-sm text-slate-700 dark:text-slate-300">TD Sistolik</label>
            <input type="number" value={formData.td_sistolik} onChange={(e) => setFormData({...formData, td_sistolik: e.target.value})} className="w-full p-3 border dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg text-slate-900 dark:text-slate-100" placeholder="120" />
          </div>
          <div>
            <label className="block font-semibold mb-2 text-sm text-slate-700 dark:text-slate-300">TD Diastolik</label>
            <input type="number" value={formData.td_diastolik} onChange={(e) => setFormData({...formData, td_diastolik: e.target.value})} className="w-full p-3 border dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg text-slate-900 dark:text-slate-100" placeholder="80" />
          </div>
          <div>
            <label className="block font-semibold mb-2 text-sm text-slate-700 dark:text-slate-300">Nadi (bpm)</label>
            <input type="number" value={formData.nadi} onChange={(e) => setFormData({...formData, nadi: e.target.value})} className="w-full p-3 border dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg text-slate-900 dark:text-slate-100" placeholder="80" />
          </div>
          <div>
            <label className="block font-semibold mb-2 text-sm text-slate-700 dark:text-slate-300">Suhu (°C)</label>
            <input type="number" step="0.1" value={formData.suhu} onChange={(e) => setFormData({...formData, suhu: e.target.value})} className="w-full p-3 border dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg text-slate-900 dark:text-slate-100" placeholder="36.5" />
          </div>
          <div>
            <label className="block font-semibold mb-2 text-sm text-slate-700 dark:text-slate-300">RR (x/menit)</label>
            <input type="number" value={formData.rr} onChange={(e) => setFormData({...formData, rr: e.target.value})} className="w-full p-3 border dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg text-slate-900 dark:text-slate-100" placeholder="20" />
          </div>
          <div>
            <label className="block font-semibold mb-2 text-sm text-slate-700 dark:text-slate-300">SpO2 (%)</label>
            <input type="number" value={formData.spo2} onChange={(e) => setFormData({...formData, spo2: e.target.value})} className="w-full p-3 border dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg text-slate-900 dark:text-slate-100" placeholder="98" />
          </div>
          <div>
            <label className="block font-semibold mb-2 text-sm text-slate-700 dark:text-slate-300">BB (kg)</label>
            <input type="number" value={formData.bb} onChange={(e) => setFormData({...formData, bb: e.target.value})} className="w-full p-3 border dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg text-slate-900 dark:text-slate-100" placeholder="70" />
          </div>
          <div>
            <label className="block font-semibold mb-2 text-sm text-slate-700 dark:text-slate-300">TB (cm)</label>
            <input type="number" value={formData.tb} onChange={(e) => setFormData({...formData, tb: e.target.value})} className="w-full p-3 border dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg text-slate-900 dark:text-slate-100" placeholder="170" />
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block font-semibold mb-2 text-slate-700 dark:text-slate-300">Keluhan Utama</label>
          <textarea value={formData.keluhan} onChange={(e) => setFormData({...formData, keluhan: e.target.value})} rows={3} className="w-full p-3 border dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg text-slate-900 dark:text-slate-100" />
        </div>
        
        <div className="mb-6">
          <label className="block font-semibold mb-2 text-slate-700 dark:text-slate-300">Riwayat Alergi</label>
          <input type="text" value={formData.alergi} onChange={(e) => setFormData({...formData, alergi: e.target.value})} className="w-full p-3 border dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg text-slate-900 dark:text-slate-100" />
        </div>
        
        <button onClick={calculateTriase} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm">
          🧮 Hitung Skor Triase
        </button>
        
        {/* Hasil Triase */}
        {formData.kategori && (
          <div className={`mt-6 p-6 rounded-xl border-2 shadow-sm ${
            formData.kategori === 'Merah' ? 'bg-red-50 border-red-500 dark:bg-red-900/20' :
            formData.kategori === 'Kuning' ? 'bg-yellow-50 border-yellow-500 dark:bg-yellow-900/20' :
            'bg-green-50 border-green-500 dark:bg-green-900/20'
          }`}>
            <div className="flex items-center gap-6">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl shadow-sm ${
                formData.kategori === 'Merah' ? 'bg-red-500' :
                formData.kategori === 'Kuning' ? 'bg-yellow-500' :
                'bg-green-500'
              } text-white`}>
                {formData.kategori === 'Merah' ? '🔴' : formData.kategori === 'Kuning' ? '⚠️' : '🟢'}
              </div>
              <div>
                <div className={`text-3xl font-bold ${
                  formData.kategori === 'Merah' ? 'text-red-700 dark:text-red-400' :
                  formData.kategori === 'Kuning' ? 'text-yellow-700 dark:text-yellow-400' :
                  'text-green-700 dark:text-green-400'
                }`}>Kategori: {formData.kategori}</div>
                <div className="text-lg text-slate-700 dark:text-slate-300 mt-1 font-semibold">Skor Triase: {formData.skor_triase}</div>
                <div className="text-base mt-2 font-medium text-slate-800 dark:text-slate-200">
                  {formData.kategori === 'Merah' && '⚠️ Gawat Darurat - Langsung ditangani dokter'}
                  {formData.kategori === 'Kuning' && ' Urgent - Antrian prioritas'}
                  {formData.kategori === 'Hijau' && '✓ Non-urgent - Antrian biasa'}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
