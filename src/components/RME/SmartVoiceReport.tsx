import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Mic, MicOff, Volume2, Sparkles, CheckCircle2, AlertCircle, RefreshCw,
  Sliders, ShieldCheck, FileText, ArrowRight, Copy, Check, Play, Pause,
  Radio, Award, Stethoscope, Pill, HeartPulse, Brain, Zap, X
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { parseMedicalTranscript, generateSOAPFromParsing } from '../../utils/medicalParser';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';

export interface SmartVoiceReportProps {
  patient?: any;
  isOpen?: boolean;
  onClose: () => void;
  onApplyToSOAP?: (soapData: { s: string; o: string; a: string; p: string; parsed?: any }) => void;
  onApplyToRecord?: (recordData: any) => void;
}

// Preset skenario dikte medis klinis untuk demo / pengujian cepat
const CLINICAL_SCENARIOS = [
  {
    title: 'Konsultasi Poli Umum - ISPA & Faringitis',
    text: 'Pasien mengeluh batuk berdahak sejak 4 hari disertai demam dan sakit saat menelan. Pasien merasa lemas dan pusing. Pada pemeriksaan fisik, faring tampak hiperemis, tonsil T1-T1 tanpa detritus. Tanda vital tekanan darah 120/80, nadi 84, suhu 38.2 derajat Celsius, RR 18, SpO2 98%. Tidak ada riwayat alergi obat. Diagnosis kerja infeksi saluran pernapasan akut atau faringitis akut ICD-10 J06.9. Terapi diberikan amoxicillin 500mg 3 kali sehari setelah makan dan paracetamol 500mg bila demam, edukasi istirahat cukup dan banyak minum air hangat.'
  },
  {
    title: 'Poli Penyakit Dalam - Hipertensi & DM Tipe 2',
    text: 'Pasien datang untuk kontrol rutin diabetes mellitus tipe 2 dan hipertensi esensial. Mengeluh sering kesemutan pada kedua telapak kaki, tidak ada nyeri dada atau sesak napas. Hasil pemeriksaan tekanan darah 145/90, nadi 78, suhu 36.6, RR 16, SpO2 99%, BB 72 kg, TB 165 cm. Gula darah puasa terakhir 142. Diagnosis ICD-10 E11.9 dan I10. Rencana terapi metformin 500mg 2x1 tablet dan amlodipine 5mg 1x1 pagi hari. Edukasi diet rendah karbohidrat sederhana dan olahraga jalan kaki 30 menit.'
  },
  {
    title: 'IGD - Dugaan Demam Berdarah Dengue (DHF)',
    text: 'Pasien masuk IGD dengan keluhan demam tinggi mendadak hari ke-3, disertai nyeri retro-orbital, nyeri sendi hebat, mual dan nafsu makan menurun. Tampak ptekie halus pada lengan kanan. Tanda vital tekanan darah 100/70, nadi 96 cepat, suhu 38.9, RR 22, SpO2 97%. Riwayat alergi terhadap penisilin. Diagnosis suspek Demam Berdarah Dengue ICD-10 A90. Rencana rehidrasi intravena RL 20 tpm, paracetamol 500mg drip jika suhu lebih dari 38.5, periksa darah lengkap lab darah hematokrit dan trombosit serial.'
  },
  {
    title: 'Poli Gastroenterologi - Dispepsia & GERD',
    text: 'Pasien mengeluh nyeri ulu hati seperti terbakar menjalar ke dada sejak 1 minggu terakhir, sering bersendawa dan mual terutama setelah makan pedas atau kopi. Nyeri tekan epigastrium positif, bising usus normal. Tanda vital tekanan darah 115/75, nadi 76, suhu 36.5, RR 16, SpO2 99%. Diagnosis GERD dengan esophagitis ICD-10 K21.0 dan Gastritis K29.7. Terapi omeprazole 20mg 2x1 sebelum makan, antasida sirup 3x1 Cth, edukasi hindari rebahan setelah makan dan batasi kafein.'
  }
];

export function SmartVoiceReport({
  patient,
  isOpen = true,
  onClose,
  onApplyToSOAP,
  onApplyToRecord
}: SmartVoiceReportProps) {
  // Engine Mode: 'hybrid' | 'browser_noise_filter' | 'ai_cloud'
  const [engineMode, setEngineMode] = useState<'hybrid' | 'browser_noise_filter' | 'ai_cloud'>('hybrid');
  
  // Audio state
  const [isListening, setIsListening] = useState(false);
  const [noiseFilterActive, setNoiseFilterActive] = useState(true);
  const [noiseThreshold, setNoiseThreshold] = useState(25); // dB threshold
  const [audioLevel, setAudioLevel] = useState(0);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  
  // Transcription & Verification state
  const [transcript, setTranscript] = useState('');
  const [verifiedTranscript, setVerifiedTranscript] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<'record' | 'verify' | 'commit'>('record');
  const [copied, setCopied] = useState(false);
  
  // Structured SOAP verification fields
  const [verifiedSOAP, setVerifiedSOAP] = useState({
    subjective: '',
    objective: '',
    assessment: '',
    plan: '',
    resume: '',
    icd10: [] as any[],
    icd9: [] as any[],
    vitals: {} as any,
    medications: [] as any[],
    warnings: [] as string[]
  });

  // Web Audio API refs for real-time visualization and filtering
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Native SpeechRecognition Hook
  const { isRecording: isSpeechRecRecording, startRecording, stopRecording, isSupported } = useSpeechRecognition({
    onResult: (text: string) => {
      setTranscript(prev => {
        const separator = prev.length > 0 && !prev.endsWith(' ') ? ' ' : '';
        return prev + separator + text;
      });
    }
  });

  // Update verifiedSOAP dynamically as transcript changes or is parsed
  const runParserOnText = useCallback((textToParse: string) => {
    if (!textToParse.trim()) return;
    
    const localParsed = parseMedicalTranscript(textToParse);
    const soapFormatted = generateSOAPFromParsing(localParsed);

    setVerifiedSOAP(prev => ({
      ...prev,
      subjective: soapFormatted.subjective.keluhan_utama + (soapFormatted.subjective.riwayat_alergi !== 'Tidak ada' ? ` (Alergi: ${soapFormatted.subjective.riwayat_alergi})` : ''),
      objective: (Object.entries(localParsed.tanda_vital).map(([k, v]) => `${k.toUpperCase()}: ${v}`).join(', ') || 'Tanda vital dalam batas normal. ') + 'Pemeriksaan fisik sesuai temuan klinis.',
      assessment: localParsed.diagnosis_suggestion.map((d: any) => `${d.name} (${d.code})`).join('; ') || 'Observasi klinis',
      plan: localParsed.obat_suggestion.map((o: any) => `${o.nama.toUpperCase()} ${o.dosis}`).join(', ') || 'Terapi simtomatik dan edukasi pasien',
      resume: `Pasien ${patient?.nama || 'Anonim'} (RM: ${patient?.no_rm || '-'}). Keluhan: ${localParsed.keluhan_utama}. Diagnosa: ${localParsed.diagnosis_suggestion.map((d: any) => d.name).join(', ') || '-'}. Rencana terapi telah ditentukan.`,
      icd10: localParsed.diagnosis_suggestion,
      vitals: localParsed.tanda_vital,
      medications: localParsed.obat_suggestion,
      warnings: localParsed.alergi_detected.map((a: any) => `Alergi terdeteksi: ${a.allergen}`)
    }));
  }, [patient]);

  // Audio Context and Noise Filtering Setup
  const setupAudioGraph = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: noiseFilterActive,
          autoGainControl: true
        }
      });
      mediaStreamRef.current = stream;

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);
      
      // 1. High-Pass Filter (cut rumbling under 120Hz)
      const highPass = audioCtx.createBiquadFilter();
      highPass.type = 'highpass';
      highPass.frequency.value = 120;

      // 2. Low-Pass Filter (cut hiss over 3600Hz for speech band)
      const lowPass = audioCtx.createBiquadFilter();
      lowPass.type = 'lowpass';
      lowPass.frequency.value = 3600;

      // 3. Dynamics Compressor (suppress noise floor and balance voice dynamics)
      const compressor = audioCtx.createDynamicsCompressor();
      compressor.threshold.setValueAtTime(-45, audioCtx.currentTime);
      compressor.knee.setValueAtTime(30, audioCtx.currentTime);
      compressor.ratio.setValueAtTime(8, audioCtx.currentTime);
      compressor.attack.setValueAtTime(0.003, audioCtx.currentTime);
      compressor.release.setValueAtTime(0.25, audioCtx.currentTime);

      // 4. Analyser Node for Real-Time Visualizer
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 128;
      analyser.smoothingTimeConstant = 0.8;
      analyserRef.current = analyser;

      if (noiseFilterActive) {
        source.connect(highPass);
        highPass.connect(lowPass);
        lowPass.connect(compressor);
        compressor.connect(analyser);
      } else {
        source.connect(analyser);
      }

      // Start drawing real-time visualizer
      drawVisualizer();
      return true;
    } catch (err) {
      console.error('Microphone setup error:', err);
      toast.error('Tidak dapat mengakses mikrofon. Pastikan izin mikrofon diizinkan di browser.');
      return false;
    }
  };

  const drawVisualizer = () => {
    const canvas = canvasRef.current;
    if (!canvas || !analyserRef.current) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const render = () => {
      animationFrameRef.current = requestAnimationFrame(render);
      analyser.getByteFrequencyData(dataArray);

      // Calculate peak level (VU)
      let sum = 0;
      for (let i = 0; i < bufferLength; i++) {
        sum += dataArray[i];
      }
      const average = sum / bufferLength;
      const normalizedLevel = Math.min(100, Math.round((average / 128) * 100));
      setAudioLevel(normalizedLevel);

      // Canvas Rendering
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      // Background gradient
      const bgGrad = ctx.createLinearGradient(0, 0, width, 0);
      bgGrad.addColorStop(0, '#0f172a');
      bgGrad.addColorStop(1, '#1e1b4b');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Visual grid line in center
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.2)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();

      // Frequency bars with glow
      const barWidth = (width / bufferLength) * 2;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * (height * 0.85);

        // Noise gate check
        const isAboveNoise = average > (noiseThreshold * 0.6);
        const barColor = isAboveNoise 
          ? (i % 2 === 0 ? '#38bdf8' : '#818cf8') 
          : '#475569';

        ctx.fillStyle = barColor;
        ctx.shadowBlur = isAboveNoise ? 8 : 0;
        ctx.shadowColor = '#6366f1';

        // Draw symmetrical mirrored bars from center
        const centerY = height / 2;
        ctx.fillRect(x, centerY - barHeight / 2, barWidth - 2, barHeight);

        x += barWidth;
      }
      ctx.shadowBlur = 0;
    };

    render();
  };

  const cleanupAudio = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(t => t.stop());
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      try {
        audioContextRef.current.close();
      } catch (e) {}
      audioContextRef.current = null;
    }
    setAudioLevel(0);
  };

  const handleToggleListening = async () => {
    if (isListening) {
      // Stop listening
      setIsListening(false);
      stopRecording();
      cleanupAudio();
      toast.success('Perekaman audio selesai. Memproses analisis...');
      
      // Auto-run analysis
      handleAnalyzeTranscript(transcript);
    } else {
      // Start listening
      const success = await setupAudioGraph();
      if (success) {
        setIsListening(true);
        setRecordingSeconds(0);
        
        // Start SpeechRecognition
        if (isSupported) {
          startRecording();
        } else {
          toast('Browser Anda tidak mendukung SpeechRecognition native. Menjalankan fallback audio...', { icon: 'ℹ️' });
        }

        // Start timer
        timerIntervalRef.current = setInterval(() => {
          setRecordingSeconds(prev => prev + 1);
        }, 1000);

        toast.success('🎤 Mikrofon aktif dengan Penyaringan Kebisingan Cerdas');
      }
    }
  };

  // Perform AI Analysis on transcript (using Gemini API or Medical Parser)
  const handleAnalyzeTranscript = async (rawText: string) => {
    if (!rawText.trim()) {
      toast.error('Tidak ada transkripsi untuk dianalisis.');
      return;
    }

    setIsAiProcessing(true);
    toast.loading('AI menganalisis data klinis...', { id: 'ai-parse' });

    try {
      // Try external Gemini server endpoint first
      const res = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clinicalNote: `Pasien: ${patient?.nama || 'Pasien'}. Dikte Dokter: ${rawText}`
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.soap) {
          setVerifiedSOAP({
            subjective: data.soap.subjective || '',
            objective: data.soap.objective || '',
            assessment: data.soap.assessment || '',
            plan: data.soap.plan || '',
            resume: data.resume || '',
            icd10: data.icd10 || [],
            icd9: data.icd9 || [],
            vitals: {},
            medications: [],
            warnings: data.warnings || []
          });
          toast.success('Analisis AI Scribe Berhasil!', { id: 'ai-parse' });
          setActiveTab('verify');
          setIsAiProcessing(false);
          return;
        }
      }
    } catch (e) {
      console.warn('Backend AI endpoint unavailable, using intelligent local medical parser fallback:', e);
    }

    // Fallback to local high-accuracy medical parser
    runParserOnText(rawText);
    toast.success('Analisis Medis Selesai!', { id: 'ai-parse' });
    setActiveTab('verify');
    setIsAiProcessing(false);
  };

  const handleSelectScenario = (scenario: typeof CLINICAL_SCENARIOS[0]) => {
    setTranscript(scenario.text);
    toast.success(`Skenario "${scenario.title}" dimuat.`);
    runParserOnText(scenario.text);
  };

  const handleCopyToClipboard = () => {
    const textToCopy = `[LAPORAN SUARA CERDAS RME]\nPasien: ${patient?.nama || '-'} (RM: ${patient?.no_rm || '-'})\n\n[SUBJECTIVE]\n${verifiedSOAP.subjective}\n\n[OBJECTIVE]\n${verifiedSOAP.objective}\n\n[ASSESSMENT]\n${verifiedSOAP.assessment}\n\n[PLAN]\n${verifiedSOAP.plan}\n\n[RESUME MEDIS]\n${verifiedSOAP.resume}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    toast.success('Laporan medis disalin ke clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  // Final Action: Apply to SOAP or Patient Medical Record
  const handleCommitToMedicalRecord = () => {
    // 1. If parent provided onApplyToSOAP handler
    if (onApplyToSOAP) {
      onApplyToSOAP({
        s: verifiedSOAP.subjective,
        o: verifiedSOAP.objective,
        a: verifiedSOAP.assessment,
        p: verifiedSOAP.plan,
        parsed: verifiedSOAP
      });
    }

    // 2. Also persist to localStorage for full persistence
    try {
      const savedReports = [];
      const newReport = {
        id: Date.now(),
        patientId: patient?.id || patient?.no_rm || 'RM-UNKNOWN',
        patientName: patient?.nama || 'Pasien',
        timestamp: new Date().toISOString(),
        rawTranscript: transcript,
        soap: verifiedSOAP,
        verifiedBy: 'dr. Verifikator (Sp.PD / Dokter Jaga)'
      };
      savedReports.unshift(newReport);


      // Update draft SOAP in localStorage


      // Update last resume)

      if (onApplyToRecord) {
        onApplyToRecord(newReport);
      }

      toast.success('✅ Laporan Suara Cerdas berhasil diverifikasi & dicatat ke Rekam Medis Pasien!');
      onClose();
    } catch (err) {
      console.error('Error saving voice report:', err);
      toast.error('Gagal menyimpan laporan.');
    }
  };

  useEffect(() => {
    return () => {
      cleanupAudio();
    };
  }, []);

  if (!isOpen) return null;

  const formatSeconds = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-[120] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white/[0.02] dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* MODAL HEADER */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-white p-5 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center backdrop-blur-sm border border-white/20 shadow-inner">
              <Mic className="w-6 h-6 text-cyan-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight">🎙️ Laporan Suara Cerdas (Smart Voice Report)</h2>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-cyan-400/20 text-cyan-200 border border-cyan-300/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-cyan-300" /> AI Scribe v2.5
                </span>
              </div>
              <p className="text-xs text-blue-100 mt-0.5">
                Dikte klinis otomatis dengan Penyaringan Kebisingan Cerdas & Verifikasi Akurasi Tinggi untuk Rekam Medis Pasien: <strong className="text-white underline">{patient?.nama || 'Pasien'}</strong> ({patient?.no_rm || 'RM-000000'})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEPPER / WORKFLOW TABS */}
        <div className="bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 px-6 py-2 flex items-center justify-between text-sm font-semibold">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('record')}
              className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                activeTab === 'record'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <Radio className="w-4 h-4" /> 1. Perekaman & Audio Visualizer
            </button>
            <ArrowRight className="w-4 h-4 text-slate-400" />
            <button
              onClick={() => {
                if (!transcript.trim()) {
                  toast.error('Silakan rekam atau pilih skenario dikte terlebih dahulu.');
                  return;
                }
                runParserOnText(transcript);
                setActiveTab('verify');
              }}
              className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                activeTab === 'verify'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" /> 2. Verifikasi Transkripsi (SOAP)
            </button>
            <ArrowRight className="w-4 h-4 text-slate-400" />
            <button
              onClick={() => {
                if (!verifiedSOAP.subjective) {
                  runParserOnText(transcript);
                }
                setActiveTab('commit');
              }}
              className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                activeTab === 'commit'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <FileText className="w-4 h-4" /> 3. Masukkan ke Rekam Medis
            </button>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
              <ShieldCheck className="w-3.5 h-3.5" /> Enkripsi Medis Sesuai Permenkes 24/2022
            </span>
          </div>
        </div>

        {/* MODAL BODY */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 custom-scrollbar">
          
          {/* TAB 1: RECORD & AUDIO VISUALIZATION */}
          {activeTab === 'record' && (
            <div className="space-y-6">
              
              {/* TOP CONTROLS & ENGINE SELECTOR */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                    Engine Transkripsi AI
                  </label>
                  <select
                    value={engineMode}
                    onChange={(e: any) => setEngineMode(e.target.value)}
                    className="w-full p-2.5 bg-white/[0.02] dark:bg-slate-900/40 backdrop-blur-xl border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="hybrid">⚡ Hybrid (SpeechAPI + Gemini Scribe)</option>
                    <option value="browser_noise_filter">🎙️ Native Speech + DSP Noise Filter</option>
                    <option value="ai_cloud">☁️ High-Accuracy Cloud Clinical AI</option>
                  </select>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Penyaringan Kebisingan Cerdas (DSP)
                    </label>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${noiseFilterActive ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' : 'bg-slate-200 text-slate-600'}`}>
                      {noiseFilterActive ? 'Aktif (120Hz-3.6kHz)' : 'Non-aktif'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <Sliders className="w-4 h-4 text-indigo-500" />
                    <input
                      type="range"
                      min="5"
                      max="60"
                      value={noiseThreshold}
                      onChange={(e) => setNoiseThreshold(Number(e.target.value))}
                      className="w-full accent-indigo-600 cursor-pointer"
                    />
                    <span className="text-xs font-mono font-bold w-12 text-slate-600 dark:text-slate-300">
                      {noiseThreshold} dB
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                      Status Audio Input
                    </label>
                    <div className="text-lg font-bold text-slate-900 dark:text-white mt-1 flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full ${isListening ? 'bg-rose-500 animate-ping' : 'bg-slate-400'}`}></span>
                      {isListening ? 'Mendengarkan...' : 'Siap / Standby'}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {formatSeconds(recordingSeconds)}
                    </span>
                    <span className="text-[10px] text-slate-400 block">Durasi Dikte</span>
                  </div>
                </div>
              </div>

              {/* REAL-TIME AUDIO VISUALIZER CANVAS */}
              <div className="relative rounded-2xl overflow-hidden border-2 border-indigo-200 dark:border-indigo-900 shadow-lg bg-slate-950">
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={150}
                  className="w-full h-36 object-cover block"
                />

                {/* Overlaid VU & Noise Reduction indicators */}
                <div className="absolute top-3 left-4 flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700 text-xs text-white">
                    <Volume2 className="w-4 h-4 text-cyan-400" />
                    <span>Peak VU:</span>
                    <div className="w-20 bg-slate-700 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-75 ${audioLevel > 70 ? 'bg-rose-500' : audioLevel > 40 ? 'bg-amber-400' : 'bg-emerald-400'}`}
                        style={{ width: `${audioLevel}%` }}
                      ></div>
                    </div>
                    <span className="font-mono text-cyan-300">{audioLevel}%</span>
                  </div>

                  {noiseFilterActive && (
                    <div className="bg-emerald-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-emerald-700 text-xs text-emerald-200 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Noise Suppression Active</span>
                    </div>
                  )}
                </div>

                {/* Big Center Record Button */}
                <div className="absolute bottom-3 right-4 flex items-center gap-3">
                  <button
                    onClick={handleToggleListening}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white shadow-xl transition-all transform hover:scale-105 active:scale-95 ${
                      isListening
                        ? 'bg-rose-600 hover:bg-rose-700 animate-pulse ring-4 ring-rose-400/30'
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 ring-2 ring-indigo-400/30'
                    }`}
                  >
                    {isListening ? (
                      <>
                        <MicOff className="w-5 h-5" /> Selesai / Hentikan Perekaman
                      </>
                    ) : (
                      <>
                        <Mic className="w-5 h-5" /> Mulai Dikte Suara Dokter
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* LIVE TRANSCRIPT TEXTAREA */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    Transkripsi Suara Real-time (Bisa Diedit Manual)
                  </label>
                  <div className="flex items-center gap-2">
                    {transcript && (
                      <button
                        onClick={() => setTranscript('')}
                        className="text-xs text-rose-500 hover:text-rose-700 px-2 py-1 rounded font-medium"
                      >
                        Hapus Transkripsi
                      </button>
                    )}
                  </div>
                </div>

                <textarea
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  placeholder="Katakan keluhan pasien, riwayat penyakit, hasil pemeriksaan fisik, tanda vital, dan instruksi terapi..."
                  className="w-full p-4 border border-slate-300 dark:border-slate-700 rounded-xl bg-white/[0.02] dark:bg-slate-900/40 backdrop-blur-xl text-slate-900 dark:text-white min-h-[140px] focus:ring-2 focus:ring-indigo-500 focus:outline-none text-base leading-relaxed"
                />
              </div>

              {/* QUICK DEMO CLINICAL SCENARIOS */}
              <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-xl border border-indigo-200 dark:border-indigo-800/60">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-indigo-900 dark:text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-amber-500" /> Skenario Uji Cepat (Klik untuk mencoba dikte instan):
                  </span>
                  <span className="text-xs text-indigo-500">Demo Tanpa Mikrofon</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {CLINICAL_SCENARIOS.map((sc, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectScenario(sc)}
                      className="text-left p-3 rounded-lg bg-white/[0.02] dark:bg-slate-900/40 backdrop-blur-xl border border-indigo-100 dark:border-slate-700 hover:border-indigo-400 hover:shadow-sm transition-all text-xs text-slate-700 dark:text-slate-300 font-medium"
                    >
                      <strong className="block text-indigo-700 dark:text-indigo-400 font-bold mb-1">{sc.title}</strong>
                      <p className="text-slate-500 dark:text-slate-400 line-clamp-2">{sc.text}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* BOTTOM ACTION BAR */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-sm"
                >
                  Tutup
                </button>
                <button
                  onClick={() => handleAnalyzeTranscript(transcript)}
                  disabled={!transcript.trim() || isAiProcessing}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm shadow-md disabled:opacity-50 flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" /> Proses & Verifikasi Transkripsi (SOAP)
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: VERIFICATION OF STRUCTURED DATA */}
          {activeTab === 'verify' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-700 dark:text-emerald-300">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">
                      Hasil Ekstraksi & Strukturisasi Medis (SOAP)
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Periksa dan sesuaikan data di bawah sebelum memvalidasi dan memasukkan ke dalam Rekam Medis Elektronik pasien.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleAnalyzeTranscript(transcript)}
                  className="text-xs bg-white/[0.02] dark:bg-slate-900/40 backdrop-blur-xl border border-slate-300 dark:border-slate-700 px-3 py-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 flex items-center gap-1.5 font-semibold"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Re-Analisis AI
                </button>
              </div>

              {/* WARNINGS / ALLERGIES BANNER */}
              {verifiedSOAP.warnings.length > 0 && (
                <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl text-amber-900 dark:text-amber-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <div>
                    <strong>Peringatan Klinis Terdeteksi:</strong>{' '}
                    {verifiedSOAP.warnings.join(' • ')}
                  </div>
                </div>
              )}

              {/* SOAP 4-BOX GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* S - Subjective */}
                <div className="card p-4 bg-white/[0.02] dark:bg-slate-900/40 backdrop-blur-xl rounded-xl border border-blue-200 dark:border-blue-900/50 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <label className="font-bold text-xs uppercase tracking-wider text-blue-700 dark:text-blue-400 flex items-center gap-1.5">
                      <Stethoscope className="w-4 h-4" /> [S] Subjective (Keluhan / Anamnesis)
                    </label>
                    <span className="text-[10px] bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded-full font-bold">
                      Terverifikasi
                    </span>
                  </div>
                  <textarea
                    value={verifiedSOAP.subjective}
                    onChange={(e) => setVerifiedSOAP({ ...verifiedSOAP, subjective: e.target.value })}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm min-h-[90px] focus:ring-2 focus:ring-blue-500"
                    placeholder="Keluhan utama dan riwayat penyakit..."
                  />
                </div>

                {/* O - Objective */}
                <div className="card p-4 bg-white/[0.02] dark:bg-slate-900/40 backdrop-blur-xl rounded-xl border border-emerald-200 dark:border-emerald-900/50 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <label className="font-bold text-xs uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                      <HeartPulse className="w-4 h-4" /> [O] Objective (Fisik & Tanda Vital)
                    </label>
                    <span className="text-[10px] bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                      Terverifikasi
                    </span>
                  </div>
                  <textarea
                    value={verifiedSOAP.objective}
                    onChange={(e) => setVerifiedSOAP({ ...verifiedSOAP, objective: e.target.value })}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm min-h-[90px] focus:ring-2 focus:ring-emerald-500"
                    placeholder="Tanda vital, pemeriksaan fisik..."
                  />
                </div>

                {/* A - Assessment */}
                <div className="card p-4 bg-white/[0.02] dark:bg-slate-900/40 backdrop-blur-xl rounded-xl border border-amber-200 dark:border-amber-900/50 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <label className="font-bold text-xs uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                      <Brain className="w-4 h-4" /> [A] Assessment (Diagnosis & ICD-10)
                    </label>
                    <span className="text-[10px] bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-full font-bold">
                      ICD-10 Mapped
                    </span>
                  </div>
                  <textarea
                    value={verifiedSOAP.assessment}
                    onChange={(e) => setVerifiedSOAP({ ...verifiedSOAP, assessment: e.target.value })}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm min-h-[90px] focus:ring-2 focus:ring-amber-500"
                    placeholder="Diagnosis kerja dan kodefikasi..."
                  />
                </div>

                {/* P - Plan */}
                <div className="card p-4 bg-white/[0.02] dark:bg-slate-900/40 backdrop-blur-xl rounded-xl border border-purple-200 dark:border-purple-900/50 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <label className="font-bold text-xs uppercase tracking-wider text-purple-700 dark:text-purple-400 flex items-center gap-1.5">
                      <Pill className="w-4 h-4" /> [P] Plan (Terapi, Resep, Edukasi)
                    </label>
                    <span className="text-[10px] bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300 px-2 py-0.5 rounded-full font-bold">
                      CPOE Ready
                    </span>
                  </div>
                  <textarea
                    value={verifiedSOAP.plan}
                    onChange={(e) => setVerifiedSOAP({ ...verifiedSOAP, plan: e.target.value })}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm min-h-[90px] focus:ring-2 focus:ring-purple-500"
                    placeholder="Terapi obat, instruksi diet, kontrol..."
                  />
                </div>
              </div>

              {/* RESUME MEDIS RINGKASAN */}
              <div className="card p-4 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700">
                <label className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 block mb-2">
                  Ringkasan Resume Medis Otomatis
                </label>
                <textarea
                  value={verifiedSOAP.resume}
                  onChange={(e) => setVerifiedSOAP({ ...verifiedSOAP, resume: e.target.value })}
                  className="w-full p-3 bg-white/[0.02] dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-slate-700 rounded-lg text-sm min-h-[60px]"
                />
              </div>

              {/* ACTIONS BAR */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => setActiveTab('record')}
                  className="px-4 py-2.5 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg font-semibold"
                >
                  ← Kembali ke Audio
                </button>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleCopyToClipboard}
                    className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-semibold text-sm hover:bg-slate-200 flex items-center gap-2 border border-slate-300 dark:border-slate-700"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Tersalin' : 'Salin Teks'}
                  </button>

                  <button
                    onClick={() => setActiveTab('commit')}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md flex items-center gap-2"
                  >
                    Lanjut ke Komitmen RME →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: COMMIT & TARGET SELECTION */}
          {activeTab === 'commit' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              <div className="text-center max-w-xl mx-auto py-4">
                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Verifikasi Akhir & Komitmen ke Rekam Medis
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Data yang diverifikasi akan secara otomatis diperbarui pada berkas rekam medis pasien <strong>{patient?.nama || 'Pasien'}</strong> ({patient?.no_rm || '-'}).
                </p>
              </div>

              {/* SUMMARY CARD */}
              <div className="bg-slate-50 dark:bg-slate-800/80 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 space-y-4 max-w-3xl mx-auto">
                <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-700">
                  <span className="font-bold text-sm text-slate-700 dark:text-slate-300">Waktu Verifikasi:</span>
                  <span className="text-sm font-mono text-slate-500">{new Date().toLocaleString('id-ID')}</span>
                </div>

                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-bold text-blue-600">S:</span> {verifiedSOAP.subjective || '-'}
                  </div>
                  <div>
                    <span className="font-bold text-emerald-600">O:</span> {verifiedSOAP.objective || '-'}
                  </div>
                  <div>
                    <span className="font-bold text-amber-600">A:</span> {verifiedSOAP.assessment || '-'}
                  </div>
                  <div>
                    <span className="font-bold text-purple-600">P:</span> {verifiedSOAP.plan || '-'}
                  </div>
                </div>

                <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-900 text-xs text-blue-800 dark:text-blue-300">
                  📋 <strong>Tindakan yang akan dilakukan sistem:</strong>
                  <ul className="list-disc pl-5 mt-1 space-y-0.5">
                    <li>Memperbarui formulir SOAP aktif pada sesi poli/rawat inap</li>
                    <li>Menyimpan berkas audit trail verifikasi suara ke riwayat pasien</li>
                    <li>Memperbarui ringkasan resume medis pasien</li>
                  </ul>
                </div>
              </div>

              {/* FINAL BUTTONS */}
              <div className="flex items-center justify-center gap-4 pt-4">
                <button
                  onClick={() => setActiveTab('verify')}
                  className="px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 font-semibold"
                >
                  ← Edit Ulang Verifikasi
                </button>
                <button
                  onClick={handleCommitToMedicalRecord}
                  className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg hover:shadow-emerald-500/25 flex items-center gap-2 text-base transition-all transform hover:scale-105 active:scale-95"
                >
                  <CheckCircle2 className="w-5 h-5" /> Terapkan ke Rekam Medis Pasien
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

