import React, { useState } from 'react';
import { Activity, Heart, Scale, Moon, Calculator } from 'lucide-react';
import toast from 'react-hot-toast';

export function FiturBUGAR() {
  const [activeTab, setActiveTab] = useState('aktivitas');
  const [formData, setFormData] = useState({
    beratBadan: '',
    tinggiBadan: '',
    tekananDarah: '',
    gulaDarah: '',
    detakJantung: '',
    suhu: '',
    spo2: ''
  });

  const calculateBMI = () => {
    const bb = parseFloat(formData.beratBadan);
    const tb = parseFloat(formData.tinggiBadan) / 100;
    if (!bb || !tb) {
      toast.error('Masukkan berat dan tinggi badan');
      return;
    }
    const bmi = bb / (tb * tb);
    let kategori = '';
    if (bmi < 18.5) kategori = 'Berat Badan Kurang';
    else if (bmi < 25) kategori = 'Normal';
    else if (bmi < 30) kategori = 'Overweight';
    else kategori = 'Obesitas';
    toast.success(`BMI Anda: ${bmi.toFixed(1)} (${kategori})`);
  };

  const handleSaveVital = () => {
    const data = { ...formData, tgl: new Date().toISOString() };
    const existing = JSON.parse(localStorage.getItem('vitalData') || '[]');
    existing.push(data);
    localStorage.setItem('vitalData', JSON.stringify(existing));
    toast.success('Data tanda vital berhasil disimpan');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Fitur BUGAR</h1>
          <p className="text-slate-500">Pantau kesehatan dan kebugaran Anda</p>
        </div>
      </div>
      <div className="flex gap-2 mb-6">
        <button 
          onClick={() => setActiveTab('aktivitas')}
          className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'aktivitas' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-700'}`}
        >
          <Activity className="w-4 h-4 inline mr-2" /> Aktivitas
        </button>
        <button 
          onClick={() => setActiveTab('pengukuran')}
          className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'pengukuran' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-700'}`}
        >
          <Scale className="w-4 h-4 inline mr-2" /> Pengukuran
        </button>
        <button 
          onClick={() => setActiveTab('vital')}
          className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'vital' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-700'}`}
        >
          <Heart className="w-4 h-4 inline mr-2" /> Tanda Vital
        </button>
        <button 
          onClick={() => setActiveTab('tidur')}
          className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'tidur' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-700'}`}
        >
          <Moon className="w-4 h-4 inline mr-2" /> Tidur
        </button>
      </div>
      {activeTab === 'aktivitas' && (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h3 className="font-bold mb-4">Aktivitas Kebugaran Hari Ini</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
              <p className="text-3xl font-bold text-blue-600">5,234</p>
              <p className="text-sm text-slate-500">Langkah</p>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
              <p className="text-3xl font-bold text-green-600">245</p>
              <p className="text-sm text-slate-500">Kalori</p>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-center">
              <p className="text-3xl font-bold text-purple-600">3.2</p>
              <p className="text-sm text-slate-500">KM Jarak</p>
            </div>
            <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-center">
              <p className="text-3xl font-bold text-orange-600">45</p>
              <p className="text-sm text-slate-500">Menit Aktif</p>
            </div>
          </div>
        </div>
      )}
      {activeTab === 'pengukuran' && (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h3 className="font-bold mb-4">Pengukuran Tubuh</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Berat Badan (kg)</label>
              <input 
                type="number" 
                className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900"
                value={formData.beratBadan}
                onChange={(e) => setFormData({...formData, beratBadan: e.target.value})}
                placeholder="Contoh: 65"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tinggi Badan (cm)</label>
              <input 
                type="number" 
                className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900"
                value={formData.tinggiBadan}
                onChange={(e) => setFormData({...formData, tinggiBadan: e.target.value})}
                placeholder="Contoh: 170"
              />
            </div>
          </div>
          <button 
            onClick={calculateBMI}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
          >
            <Calculator className="w-4 h-4 inline mr-2" /> Hitung BMI
          </button>
        </div>
      )}
      {activeTab === 'vital' && (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h3 className="font-bold mb-4">Tanda Vital</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Tekanan Darah (mmHg)</label>
              <input 
                type="text" 
                className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900"
                value={formData.tekananDarah}
                onChange={(e) => setFormData({...formData, tekananDarah: e.target.value})}
                placeholder="120/80"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Gula Darah (mg/dL)</label>
              <input 
                type="number" 
                className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900"
                value={formData.gulaDarah}
                onChange={(e) => setFormData({...formData, gulaDarah: e.target.value})}
                placeholder="100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Detak Jantung (bpm)</label>
              <input 
                type="number" 
                className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900"
                value={formData.detakJantung}
                onChange={(e) => setFormData({...formData, detakJantung: e.target.value})}
                placeholder="72"
              />
            </div>
          </div>
          <button 
            onClick={handleSaveVital}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
          >
            Simpan Data
          </button>
        </div>
      )}
    </div>
  );
}
