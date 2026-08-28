import React, { useState } from 'react';
import { Activity, CheckCircle, ChevronRight, AlertTriangle, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

export function SkriningKesehatan() {
  const [step, setStep] = useState(0); // 0: intro, 1: questions, 2: result
  const [answers, setAnswers] = useState<Record<number, boolean>>({});

  const questions = [
    "Apakah Anda sering merasa haus yang berlebihan?",
    "Apakah Anda sering buang air kecil, terutama pada malam hari?",
    "Apakah Anda mengalami penurunan berat badan yang tidak diketahui sebabnya?",
    "Apakah ada anggota keluarga yang menderita Diabetes Mellitus (Kencing Manis)?",
    "Apakah Anda sering merasa pusing atau sakit kepala berat di bagian belakang kepala?",
    "Apakah Anda pernah diberitahu bahwa tekanan darah Anda tinggi?",
    "Apakah Anda merokok atau sering terpapar asap rokok?",
    "Apakah Anda jarang melakukan aktivitas fisik (olahraga kurang dari 30 menit sehari)?"
  ];

  const handleStart = () => setStep(1);

  const handleAnswer = (index: number, answer: boolean) => {
    setAnswers({ ...answers, [index]: answer });
  };

  const handleSubmit = () => {
    if (Object.keys(answers).length < questions.length) {
      toast.error('Harap jawab semua pertanyaan');
      return;
    }
    const result = getResult();
    const data = { answers, result, tgl: new Date().toISOString() };
    const existing = [];
    existing.push(data);

    toast.success('Skrining berhasil disimpan');
    setStep(2);
  };

  const getResult = () => {
    const yesCount = Object.values(answers).filter(v => v).length;
    if (yesCount >= 4) {
      return { 
        status: 'Risiko Tinggi', 
        color: 'text-red-600',
        bg: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
        message: 'Berdasarkan jawaban Anda, Anda memiliki risiko tinggi terhadap penyakit kronis (Hipertensi/Diabetes Mellitus). Segera konsultasikan ke Fasilitas Kesehatan Tingkat Pertama Anda untuk pemeriksaan lebih lanjut.'
      };
    } else if (yesCount >= 2) {
      return { 
        status: 'Risiko Sedang', 
        color: 'text-orange-600',
        bg: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800',
        message: 'Anda memiliki risiko sedang. Jaga pola makan, perbanyak aktivitas fisik, dan rutin cek kesehatan minimal 6 bulan sekali.'
      };
    }
    return { 
      status: 'Risiko Rendah', 
      color: 'text-emerald-600',
      bg: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800',
      message: 'Kondisi Anda saat ini dinilai memiliki risiko rendah terhadap penyakit kronis. Tetap pertahankan gaya hidup sehat!'
    };
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Skrining Kesehatan</h1>
          <p className="text-slate-500">Deteksi dini risiko penyakit kronis</p>
        </div>
      </div>

      {step === 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 text-center space-y-6 shadow-sm">
          <div className="w-24 h-24 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center mx-auto">
            <Activity className="w-12 h-12 text-teal-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Kenali Risiko Penyakit Sejak Dini</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
              Skrining riwayat kesehatan adalah upaya deteksi dini terhadap risiko penyakit kronis seperti Diabetes Mellitus, Hipertensi, Ginjal Kronik, dan Penyakit Jantung Koroner.
            </p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl text-sm text-blue-800 dark:text-blue-300 text-left">
            <p className="font-bold flex items-center gap-2 mb-2"><CheckCircle className="w-4 h-4" /> Manfaat Skrining:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Mencegah terjadinya penyakit kronis</li>
              <li>Mendapatkan penanganan lebih awal jika terdeteksi risiko</li>
              <li>Gratis untuk peserta JKN-KIS 1x dalam setahun</li>
            </ul>
          </div>
          <button 
            onClick={handleStart}
            className="w-full bg-teal-600 text-white py-3 rounded-xl hover:bg-teal-700 font-bold flex items-center justify-center gap-2 transition-colors"
          >
            Mulai Skrining Sekarang <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {step === 1 && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="bg-slate-50 dark:bg-slate-900/50 p-4 border-b border-slate-200 dark:border-slate-700">
            <h2 className="font-bold text-slate-800 dark:text-white">Pertanyaan Skrining ({Object.keys(answers).length}/{questions.length})</h2>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mt-2">
              <div className="bg-teal-600 h-2 rounded-full transition-all" style={{ width: `${(Object.keys(answers).length / questions.length) * 100}%` }}></div>
            </div>
          </div>
          <div className="p-0">
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {questions.map((q, idx) => (
                <div key={idx} className="p-6">
                  <p className="text-slate-800 dark:text-white font-medium mb-4">{idx + 1}. {q}</p>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => handleAnswer(idx, true)}
                      className={`flex-1 py-2 px-4 rounded-lg border font-medium transition-colors ${
                        answers[idx] === true 
                          ? 'bg-teal-50 dark:bg-teal-900/30 border-teal-500 text-teal-700 dark:text-teal-400' 
                          : 'border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                      }`}
                    >
                      Ya
                    </button>
                    <button 
                      onClick={() => handleAnswer(idx, false)}
                      className={`flex-1 py-2 px-4 rounded-lg border font-medium transition-colors ${
                        answers[idx] === false 
                          ? 'bg-teal-50 dark:bg-teal-900/30 border-teal-500 text-teal-700 dark:text-teal-400' 
                          : 'border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                      }`}
                    >
                      Tidak
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-6 border-t border-slate-200 dark:border-slate-700">
              <button 
                onClick={handleSubmit}
                className="w-full bg-teal-600 text-white py-3 rounded-xl hover:bg-teal-700 font-bold transition-colors"
              >
                Simpan Hasil Skrining
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <div className={`rounded-2xl border p-8 text-center space-y-4 ${getResult().bg}`}>
            {getResult().status === 'Risiko Rendah' ? (
              <CheckCircle className={`w-16 h-16 mx-auto ${getResult().color}`} />
            ) : (
              <AlertTriangle className={`w-16 h-16 mx-auto ${getResult().color}`} />
            )}
            <h2 className={`text-2xl font-bold ${getResult().color}`}>Hasil: {getResult().status}</h2>
            <p className="text-slate-700 dark:text-slate-300 font-medium max-w-md mx-auto">
              {getResult().message}
            </p>
          </div>
          
          <button 
            onClick={() => setStep(0)}
            className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 font-bold transition-colors shadow-sm"
          >
            Kembali ke Beranda
          </button>
        </div>
      )}
    </div>
  );


}
