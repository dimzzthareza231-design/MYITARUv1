import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Bot, User, Activity, FileText, Pill, ShieldAlert, Trash2, Loader2 } from 'lucide-react';
import { logAIAttempt } from '../lib/activityLogger';

interface ChatMessage {
  role: 'ai' | 'user';
  content: string;
  timestamp?: string;
  isFallback?: boolean;
}

export function AIAssistantPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'ai',
      content: 'Halo! Saya MY ITARU AI (Clinical Decision Support System). Ada yang bisa saya bantu hari ini? Anda dapat menanyakan analisis gejala, rekomendasi ICD-10/ICD-9, panduan dosis Fornas, atau kepatuhan klaim BPJS.',
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isTyping]);

  const handleSend = async (customText?: string) => {
    const textToSend = customText || input;
    if (!textToSend.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput('');
    setIsTyping(true);

    const startTime = Date.now();

    try {
      const res = await fetch('/api/ai/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          conversationHistory: newHistory.slice(-6)
        })
      });

      const data = await res.json();
      const latency = Date.now() - startTime;

      const aiReply: ChatMessage = {
        role: 'ai',
        content: data.reply || 'Maaf, tidak ada respons yang dihasilkan.',
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        isFallback: !!data.fallback
      };

      setMessages(prev => [...prev, aiReply]);

      logAIAttempt({
        action: 'AI_COPILOT_CHAT',
        status: data.fallback ? 'WARNING' : 'SUCCESS',
        module: 'AIAssistantPanel',
        queryOrContext: textToSend,
        resultSummary: aiReply.content.slice(0, 100),
        latencyMs: latency
      });
    } catch (err: any) {
      console.error('AI Copilot Fetch Error:', err);
      const latency = Date.now() - startTime;

      setMessages(prev => [
        ...prev,
        {
          role: 'ai',
          content: 'Maaf, terjadi kendala saat menghubungkan ke server AI. Silakan coba sesaat lagi.',
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          isFallback: true
        }
      ]);

      logAIAttempt({
        action: 'AI_COPILOT_CHAT',
        status: 'FAILED',
        module: 'AIAssistantPanel',
        queryOrContext: textToSend,
        resultSummary: err?.message || 'Network error',
        latencyMs: latency
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        role: 'ai',
        content: 'Percakapan telah direset. Ada yang ingin Anda konsultasikan terkait rekam medis atau panduan klinis?',
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <>
      {/* Floating Button */}
      <button 
        id="btn-open-ai-copilot"
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-600 text-white rounded-full shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center z-50 group ${isOpen ? 'hidden' : 'flex'}`}
        title="Buka AI Medical Assistant"
      >
        <Sparkles className="w-7 h-7 animate-pulse" />
        <span className="absolute right-full mr-3 bg-slate-900 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg pointer-events-none">
          MY ITARU AI Assistant
        </span>
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div 
          id="panel-ai-copilot"
          className="fixed bottom-6 right-6 w-[92vw] sm:w-[420px] h-[580px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl z-[100] flex flex-col border border-slate-200 dark:border-slate-800 animate-in slide-in-from-bottom-4 duration-200 overflow-hidden"
        >
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-700 text-white flex items-center justify-between shrink-0 shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h2 className="font-bold text-sm">MY ITARU AI</h2>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-400 text-emerald-950 uppercase">
                    Gemini 3.8
                  </span>
                </div>
                <p className="text-[11px] text-emerald-100">Clinical Decision Support & Coder</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button 
                id="btn-clear-ai-chat"
                onClick={handleClearChat}
                className="p-1.5 hover:bg-white/20 rounded-lg text-white/80 hover:text-white transition-colors"
                title="Bersihkan Percakapan"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button 
                id="btn-close-ai-copilot"
                onClick={() => setIsOpen(false)} 
                className="p-1.5 hover:bg-white/20 rounded-lg text-white/80 hover:text-white transition-colors"
                title="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50 dark:bg-slate-950/60">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                  msg.role === 'ai' 
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' 
                    : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                }`}>
                  {msg.role === 'ai' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>
                <div className={`max-w-[82%] p-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  msg.role === 'ai' 
                    ? 'bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 text-slate-800 dark:text-slate-200 rounded-tl-none shadow-sm' 
                    : 'bg-blue-600 text-white rounded-tr-none shadow-sm'
                }`}>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  {msg.timestamp && (
                    <span className={`block text-[10px] mt-1.5 text-right ${msg.role === 'ai' ? 'text-slate-400 dark:text-slate-500' : 'text-blue-200'}`}>
                      {msg.timestamp}
                    </span>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-tl-none shadow-sm flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-emerald-600 animate-spin" />
                  <span className="text-xs text-slate-500 dark:text-slate-400">Menganalisis panduan klinis...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Preset Action Chips */}
          <div className="px-3 py-2 bg-slate-100/80 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex gap-1.5 overflow-x-auto custom-scrollbar shrink-0">
            <button 
              onClick={() => handleSend('Diagnosis banding untuk pasien febris 5 hari disertai trombositopenia dan petekie')} 
              className="text-[11px] px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full whitespace-nowrap text-slate-700 dark:text-slate-300 hover:border-emerald-400 hover:text-emerald-600 transition-colors shrink-0 flex items-center gap-1"
            >
              <Activity className="w-3 h-3 text-emerald-500" /> Gejala Febris
            </button>
            <button 
              onClick={() => handleSend('Cek potensi interaksi obat: Warfarin dengan Ciprofloxacin')} 
              className="text-[11px] px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full whitespace-nowrap text-slate-700 dark:text-slate-300 hover:border-amber-400 hover:text-amber-600 transition-colors shrink-0 flex items-center gap-1"
            >
              <Pill className="w-3 h-3 text-amber-500" /> Interaksi Obat
            </button>
            <button 
              onClick={() => handleSend('Berapa kode ICD-10 dan tarif INA-CBG untuk Sectio Caesarea dengan komplikasi preeklampsia?')} 
              className="text-[11px] px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full whitespace-nowrap text-slate-700 dark:text-slate-300 hover:border-blue-400 hover:text-blue-600 transition-colors shrink-0 flex items-center gap-1"
            >
              <FileText className="w-3 h-3 text-blue-500" /> Koder ICD-10
            </button>
          </div>

          {/* Input Form */}
          <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shrink-0">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }} 
              className="relative flex items-center"
            >
              <input 
                id="input-ai-copilot"
                type="text" 
                className="w-full pl-3.5 pr-11 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white placeholder:text-slate-400"
                placeholder="Konsultasi gejala, obat, ICD-10, atau klaim..."
                value={input}
                onChange={e => setInput(e.target.value)}
                disabled={isTyping}
              />
              <button 
                id="btn-send-ai-copilot"
                type="submit"
                className="absolute right-1.5 p-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-40 disabled:hover:bg-emerald-600 transition-colors shadow-sm"
                disabled={!input.trim() || isTyping}
                title="Kirim Pesan"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <p className="text-[10px] text-center text-slate-400 dark:text-slate-500 mt-1.5">
              MY ITARU AI adalah sistem pendukung keputusan klinis. Verifikasi DPJP tetap diperlukan.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
