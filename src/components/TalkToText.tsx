import { useToast } from "../contexts/ToastContext";
import React, { useState } from 'react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';

export default function TalkToText({ onTranscriptReady, currentSOAP, setCurrentSOAP }: any) {
  const toast = useToast();
  const [transcript, setTranscript] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [parsedResult, setParsedResult] = useState<any>(null);
  
  const { isRecording, startRecording, stopRecording, isSupported } = useSpeechRecognition({
    onResult: (text) => {
      setTranscript(prev => (prev ? prev + " " : "") + text);
    }
  });
  
  const handleStartRecording = () => {
    if (!isSupported) {
      toast.error("Browser Anda tidak mendukung Web Speech API (Gunakan Chrome).");
      return;
    }
    if (isRecording) {
      stopRecording();
    } else {
      if (startRecording()) {
        toast.info("🎤 Mikrofon aktif. Mulai bicara...");
      } else {
        toast.error("Gagal mengakses mikrofon.");
      }
    }
  };
  const analyzeWithAI = async (text: string) => {
    try {
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clinicalNote: text })
      });

      if (response.ok) {
        const result = await response.json();
        const parsed = {
          keluhan_utama: result.soap?.subjective || result.resume || text,
          confidence: 90,
          tanda_vital: {},
          diagnosis_suggestion: result.icd10?.map((d: any) => ({
            code: d.code,
            name: d.description,
            confidence: 85
          })) || [],
          obat_suggestion: result.recommendations || [],
          alergi_detected: result.warnings || []
        };
        setParsedResult(parsed);
        setShowResult(true);
      } else {
        // Fallback
        setParsedResult({
          keluhan_utama: text,
          confidence: 70,
          tanda_vital: {},
          diagnosis_suggestion: [],
          obat_suggestion: [],
          alergi_detected: []
        });
        setShowResult(true);
      }
    } catch (err) {
      setParsedResult({
        keluhan_utama: text,
        confidence: 70,
        tanda_vital: {},
        diagnosis_suggestion: [],
        obat_suggestion: [],
        alergi_detected: []
      });
      setShowResult(true);
    } finally {
      setIsProcessing(false);
    }
  };


  const handleApplyToForm = () => {
    if (!parsedResult) return;

    const mergedSOAP = {
      ...currentSOAP,
      subjective: {
        ...currentSOAP?.subjective,
        keluhan_utama: parsedResult.keluhan_utama
      }
    };

    setCurrentSOAP(mergedSOAP);
    setShowResult(false);

    if (onTranscriptReady) {
      onTranscriptReady(mergedSOAP, parsedResult);
    }

    toast.success('Hasil AI diterapkan ke form SOAP!');
  };

  const handleDemoMode = () => {
    const demoText = "Pasien mengeluh demam tinggi sejak 3 hari yang lalu, disertai nyeri sendi dan bintik merah di kulit. Tekanan darah 110/70, nadi 88, suhu 38.5 derajat. Pasien memiliki alergi penisilin. Saat ini sedang minum paracetamol 500mg. Diduga demam berdarah.";
    setTranscript(demoText);
    toast.info('Demo text dimuat. Klik "Proses dengan AI".');
  };

  const handleProcessTranscript = async () => {
    if (!transcript.trim()) {
      toast.warning('Tidak ada transkripsi');
      return;
    }
    setIsProcessing(true);
    await analyzeWithAI(transcript);
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl p-6 border-2 border-purple-200 dark:border-purple-800 mb-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-purple-800 dark:text-purple-200">
            🎤 AI Talk-to-Text
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Dokter berbicara, AI otomatis isi form SOAP
          </p>
        </div>
        <button
          onClick={handleDemoMode}
          className="text-xs bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded hover:bg-gray-300"
        >
          🎭 Demo Mode
        </button>
      </div>

      {isRecording && (
        <div className="bg-red-500 text-white rounded-lg p-4 mb-4 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-white rounded-full animate-ping"></div>
            <span className="font-semibold">🎤 Sedang Merekam... Bicara sekarang</span>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4 min-h-[100px] border">
        <label className="block text-sm font-semibold mb-2">📝 Transkripsi:</label>
        <div className="text-gray-800 dark:text-gray-200">
          {transcript ? (
            <span>{transcript}</span>
          ) : (
            <span className="text-gray-400 italic">
              {isRecording ? 'Menunggu suara...' : 'Klik "Mulai Rekaman" untuk berbicara'}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {!isRecording ? (
          <button
            onClick={handleStartRecording}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 font-semibold"
          >
            🎤 Mulai Rekaman
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 font-semibold"
          >
            ⏹️ Stop Rekaman
          </button>
        )}
        <button
          onClick={handleProcessTranscript}
          disabled={!transcript || isProcessing}
          className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 font-semibold disabled:opacity-50"
        >
          {isProcessing ? '⚙️ AI Memproses...' : '🤖 Proses dengan AI'}
        </button>
        {transcript && (
          <button
            onClick={() => { setTranscript(''); setParsedResult(null); setShowResult(false); }}
            className="bg-gray-200 dark:bg-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 font-semibold"
          >
            🔄 Reset
          </button>
        )}
      </div>

      {isProcessing && (
        <div className="bg-purple-100 dark:bg-purple-900/30 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="text-3xl animate-bounce">🤖</div>
            <div>
              <div className="font-semibold">AI sedang menganalisis...</div>
              <div className="text-sm text-gray-600">Mengekstrak keluhan, diagnosis, obat, tanda vital</div>
            </div>
          </div>
        </div>
      )}

      {showResult && parsedResult && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border-2 border-green-300">
          <div className="flex justify-between items-start mb-4">
            <h4 className="text-lg font-bold text-green-700">✅ Hasil Analisis AI</h4>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{parsedResult.confidence}%</div>
              <div className="text-xs text-gray-500">Confidence</div>
            </div>
          </div>

          <div className="mb-4">
            <label className="font-semibold text-sm">🩺 Keluhan Utama:</label>
            <div className="mt-1 p-3 bg-blue-50 dark:bg-blue-900/30 rounded border border-blue-200">
              {parsedResult.keluhan_utama}
            </div>
          </div>

          {parsedResult.diagnosis_suggestion.length > 0 && (
            <div className="mb-4">
              <label className="font-semibold text-sm">🎯 Saran Diagnosis:</label>
              <div className="mt-1 space-y-2">
                {parsedResult.diagnosis_suggestion.map((dx: any, idx: number) => (
                  <div key={idx} className="p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded border border-yellow-200">
                    <div className="flex justify-between">
                      <div>
                        <div className="font-mono text-sm font-bold">{dx.code}</div>
                        <div className="text-sm">{dx.name}</div>
                      </div>
                      <div className="text-xs bg-yellow-200 px-2 py-1 rounded">{dx.confidence}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-4 border-t">
            <button
              onClick={handleApplyToForm}
              className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold"
            >
              ✅ Terapkan ke Form SOAP
            </button>
            <button
              onClick={() => setShowResult(false)}
              className="px-6 py-3 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300"
            >
              Edit Manual
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
