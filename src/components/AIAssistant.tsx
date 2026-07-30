import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Send, Stethoscope, AlertCircle, FileCheck, CheckCircle2, Loader2, Sparkles, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { AnalysisResult } from '../types';

const medicalTerms = [
  "Hypertension (I10)",
  "Type 2 Diabetes Mellitus (E11.9)",
  "Amlodipine 5mg",
  "Metformin 500mg",
  "Atorvastatin 20mg",
  "Headache (R51)",
  "Ibuprofen 400mg",
  "Paracetamol 500mg",
  "Lisinopril 10mg",
  "Amoxicillin 500mg",
  "Hyperlipidemia (E78.5)"
];

export function AIAssistant() {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [cursorIndex, setCursorIndex] = useState(-1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'id-ID'; // Defaulting to Indonesian based on context, can be adjusted
      
      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript + ' ';
          }
        }
        
        if (finalTranscript) {
           setInput((prev) => prev + (prev && !prev.endsWith(' ') ? ' ' : '') + finalTranscript);
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsRecording(false);
        if (event.error === 'not-allowed' || event.error === 'no-speech') {
           // Fallback
           simulateDictation();
        }
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  
  const simulateDictation = () => {
    setIsRecording(true);
    setError(null);
    const mockText = "Pasien datang dengan keluhan sakit kepala sejak 3 hari yang lalu, tekanan darah saat ini 160/90. Riwayat hipertensi sejak 5 tahun yang lalu, tidak rutin minum obat Amlodipine 5mg. Saya berikan Paracetamol 500mg untuk sakit kepalanya.";
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < mockText.length) {
        setInput((prev) => prev + (currentIndex === 0 && prev && !prev.endsWith(' ') ? ' ' : '') + mockText.charAt(currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
        setIsRecording(false);
      }
    }, 50);
  };

  const toggleRecording = () => {
    if (isRecording) {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch(e) {}
      }
      setIsRecording(false);
    } else {
      if (recognitionRef.current) {
         try {
           recognitionRef.current.start();
           setIsRecording(true);
           setError(null);
         } catch (e) {
           console.error(e);
           simulateDictation();
         }
      } else {
        simulateDictation();
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInput(value);
    
    const cursor = e.target.selectionStart;
    setCursorIndex(cursor);
    
    const words = value.slice(0, cursor).split(/\s+/);
    const currentWord = words[words.length - 1];
    
    if (currentWord.length >= 2) {
      const matched = medicalTerms.filter(t => t.toLowerCase().includes(currentWord.toLowerCase()));
      setSuggestions(matched);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    const words = input.slice(0, cursorIndex).split(/\s+/);
    words.pop(); // remove the partial word
    const newTextBeforeCursor = (words.length > 0 ? words.join(' ') + ' ' : '') + suggestion + ' ';
    const newTextAfterCursor = input.slice(cursorIndex);
    
    setInput(newTextBeforeCursor + newTextAfterCursor);
    setSuggestions([]);
  };

  const handleAnalyze = async () => {
    if (!input.trim()) return;
    
    setIsAnalyzing(true);
    setError(null);
    
    try {
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clinicalNote: input })
      });
      
      if (!response.ok) {
        throw new Error('Analysis failed. Please try again.');
      }
      
      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleVoiceSimulation = () => {
    setInput("Pasien mengalami hipertensi dengan tekanan darah 160/100 disertai nyeri kepala yang terus menerus sejak 2 hari yang lalu. Pasien juga mengeluh mual dan pandangan sedikit kabur. Riwayat minum amlodipine 5mg tapi sering lupa.");
  };

  return (
    <div className="h-full flex flex-col lg:flex-row gap-6">
      {/* Input Section */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full lg:w-1/3 flex flex-col gap-4"
      >
        <div className="glass-panel p-6 flex-1 flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-primary-emerald to-primary-blue rounded-lg">
              <Sparkles className="w-5 h-5 text-black" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Medical Assistant</h2>
              <p className="text-xs text-white/40">Voice/Text to Clinical Record</p>
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-4">
            {isRecording && (
              <div className="px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center gap-3 self-start mb-[-8px] z-10 shadow-[0_0_15px_rgba(52,211,153,0.2)]">
                <div className="flex items-center gap-1 h-4">
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-1 bg-emerald-400 rounded-full"
                      animate={{ height: ["4px", i % 2 === 0 ? "16px" : "12px", "4px"] }}
                      transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.15,
                      }}
                    />
                  ))}
                </div>
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Voice Recognition Active</span>
              </div>
            )}
            <div className="relative flex-1 flex flex-col">
              <textarea
                className="w-full flex-1 glass-input resize-none p-4"
                placeholder="Start typing clinical notes, or use Voice Input..."
                value={input}
                onChange={handleInputChange}
                onSelect={(e) => setCursorIndex((e.target as HTMLTextAreaElement).selectionStart)}
              />
              <AnimatePresence>
                {suggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-[110%] left-0 z-50 w-full max-w-sm bg-panel border border-white/10 rounded-xl shadow-xl overflow-hidden"
                  >
                    <div className="p-2 border-b border-white/5 bg-white/5 text-[10px] uppercase tracking-widest text-white/40 font-bold">
                      Suggested Terms
                    </div>
                    <ul className="max-h-48 overflow-y-auto">
                      {suggestions.map((suggestion, idx) => (
                        <li key={idx}>
                          <button
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="w-full text-left px-4 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                          >
                            {suggestion}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={toggleRecording}
                className={`btn-secondary flex-1 transition-all ${isRecording ? 'bg-red-500/20 border-red-500/50 text-red-400 hover:bg-red-500/30' : ''}`}
                title={isRecording ? "Stop Recording" : "Start Voice Dictation"}
              >
                {isRecording ? (
                  <>
                    <MicOff className="w-5 h-5" />
                    <span className="font-bold">Stop Recording...</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-5 h-5 text-primary-emerald" />
                    <span>Dictate</span>
                  </>
                )}
              </button>
              
              <button 
                onClick={handleAnalyze}
                disabled={isAnalyzing || !input.trim()}
                className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAnalyzing ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
                <span>Analyze</span>
              </button>
            </div>
          </div>
          
          {error && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Results Section */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full lg:w-2/3"
      >
        {result ? (
          <div className="space-y-6 overflow-y-auto h-full pr-2 custom-scrollbar">
            {/* Disclaimer */}
            <div className="bg-panel-light border border-yellow-500/20 rounded-xl p-4 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-yellow-200/80">{result.disclaimer}</p>
            </div>

            {/* SOAP Notes */}
            <div className="glass-panel p-6 bg-white/[0.03]">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-white">
                <FileCheck className="w-5 h-5 text-primary-blue" />
                SOAP Documentation
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-black/40 rounded-xl p-4 border border-white/5">
                  <h4 className="text-[10px] font-bold text-primary-emerald uppercase tracking-widest mb-2">Subjective (S)</h4>
                  <p className="text-sm text-white/80 leading-relaxed">{result.soap.subjective}</p>
                </div>
                <div className="bg-black/40 rounded-xl p-4 border border-white/5">
                  <h4 className="text-[10px] font-bold text-primary-blue uppercase tracking-widest mb-2">Objective (O)</h4>
                  <p className="text-sm text-white/80 leading-relaxed">{result.soap.objective}</p>
                </div>
                <div className="bg-black/40 rounded-xl p-4 border border-white/5">
                  <h4 className="text-[10px] font-bold text-secondary-purple uppercase tracking-widest mb-2">Assessment (A)</h4>
                  <p className="text-sm text-white/80 leading-relaxed">{result.soap.assessment}</p>
                </div>
                <div className="bg-black/40 rounded-xl p-4 border border-white/5">
                  <h4 className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-2">Plan (P)</h4>
                  <p className="text-sm text-white/80 leading-relaxed">{result.soap.plan}</p>
                </div>
              </div>
            </div>

            {/* ICD Coding */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-panel p-6">
                <h3 className="text-[10px] font-bold text-primary-emerald uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Stethoscope className="w-4 h-4" />
                  ICD-10 Suggestions
                </h3>
                <div className="space-y-3">
                  {result.icd10.map((icd, idx) => (
                    <div key={idx} className="flex gap-3 items-center justify-between bg-white/5 border border-white/5 p-3 rounded-lg">
                      <p className="text-xs text-white flex-1">{icd.description}</p>
                      <span className="text-xs font-mono text-primary-emerald font-bold">
                        {icd.code}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-panel p-6">
                <h3 className="text-[10px] font-bold text-primary-blue uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Stethoscope className="w-4 h-4" />
                  ICD-9-CM Suggestions
                </h3>
                <div className="space-y-3">
                  {result.icd9.map((icd, idx) => (
                    <div key={idx} className="flex gap-3 items-center justify-between bg-white/5 border border-white/5 p-3 rounded-lg">
                      <p className="text-xs text-white flex-1">{icd.description}</p>
                      <span className="text-xs font-mono text-primary-blue font-bold">
                        {icd.code}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Warnings & Recommendations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(result.warnings && result.warnings.length > 0) && (
                <div className="glass-panel p-6 border-red-500/30">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-red-400">
                    <AlertCircle className="w-5 h-5" />
                    Clinical Warnings
                  </h3>
                  <ul className="space-y-2">
                    {result.warnings.map((warning, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-red-200">
                        <span className="text-red-500 mt-1">•</span>
                        <span>{warning}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="glass-panel p-6">
                <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary-blue" />
                  Next Steps (Resume Medis)
                </h3>
                <p className="text-sm text-white/80 leading-relaxed mb-4">
                  {result.resume}
                </p>
                <div className="space-y-3">
                  {result.recommendations.map((rec, idx) => (
                    <div key={idx} className="flex gap-3 items-start">
                      <div className="w-1 bg-primary-emerald rounded-full self-stretch mt-1 mb-1"></div>
                      <div className="text-xs text-white/60 leading-relaxed">
                        {rec}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="h-8" /> {/* Spacer */}
          </div>
        ) : (
          <div className="h-full glass-panel flex flex-col items-center justify-center p-12 text-center border-dashed border-2">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
              <BrainCircuit className="w-10 h-10 text-white/20" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Awaiting Input</h3>
            <p className="text-white/40 max-w-md">
              Enter clinical notes or use voice simulation to generate automated SOAP documentation, ICD coding, and clinical recommendations.
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}

function BrainCircuit(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 4.5a2.5 2.5 0 0 0-4.96-.46 2.5 2.5 0 0 0-1.98 3 2.5 2.5 0 0 0-1.32 4.24 3 3 0 0 0 .34 5.58 2.5 2.5 0 0 0 2.96 3.08 2.5 2.5 0 0 0 4.91.05L12 20V4.5Z" />
      <path d="M16 8V5c0-1.1.9-2 2-2" />
      <path d="M12 13h4" />
      <path d="M12 18h6a2 2 0 0 1 2 2v1" />
      <path d="M19 18v-4" />
      <path d="M22 14h-4" />
      <path d="M16 11v3" />
    </svg>
  );
}
