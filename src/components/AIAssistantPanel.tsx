import React, { useState } from 'react';
import { Sparkles, X, Send, Bot, User, Activity, FileText } from 'lucide-react';

export function AIAssistantPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', content: 'Halo! Saya asisten AI MYITARU. Ada yang bisa saya bantu hari ini? Anda bisa meminta saya untuk menganalisis gejala, mengecek interaksi obat, atau memvalidasi klaim.' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;
    
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    setInput('');
    setIsTyping(true);

    // Mock AI response
    setTimeout(() => {
      let response = "Maaf, saya sedang dalam mode demonstrasi. Namun, saya dapat membantu menganalisis diagnosis, interaksi obat, dan validasi klaim BPJS secara otomatis di form yang relevan.";
      
      if (input.toLowerCase().includes('demam') || input.toLowerCase().includes('gejala')) {
        response = "Berdasarkan gejala demam, diagnosis banding yang mungkin adalah:\n1. Dengue Fever (A90) - 85%\n2. Typhoid Fever (A01.0) - 60%\n3. Malaria (B54) - 30%\n\nSaran Pemeriksaan: Cek Darah Lengkap, NS1 Antigen.";
      } else if (input.toLowerCase().includes('obat') || input.toLowerCase().includes('resep')) {
        response = "Saya dapat membantu mengecek interaksi obat. Silakan ketik nama obat yang ingin dicek.";
      }

      setMessages(prev => [...prev, { role: 'ai', content: response }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <>
      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-emerald-400 to-[var(--color-primary-blue)] text-white rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center z-50 group ${isOpen ? 'hidden' : 'flex'}`}
      >
        <Sparkles className="w-7 h-7" />
        <span className="absolute right-full mr-4 bg-slate-800 text-white text-sm px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          AI Assistant
        </span>
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 sm:w-96 h-[500px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl z-[100] flex flex-col border border-slate-200 dark:border-slate-800 animate-in slide-in-from-bottom-4 duration-300 overflow-hidden">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-emerald-500 to-[var(--color-primary-blue)] text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <Bot className="w-6 h-6" />
              <div>
                <h2 className="font-bold text-md">MYITARU AI</h2>
                <p className="text-xs text-emerald-100">Clinical Decision Support</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/20 rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-900/50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'ai' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400' : 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400'}`}>
                  {msg.role === 'ai' ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                </div>
                <div className={`p-3 rounded-2xl text-sm ${msg.role === 'ai' ? 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-tl-none' : 'bg-[var(--color-primary-blue)] text-white rounded-tr-none'}`}>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-tl-none flex gap-1 items-center">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="px-4 pb-2 bg-slate-50 dark:bg-slate-900/50 flex gap-2 overflow-x-auto custom-scrollbar shrink-0">
             <button onClick={() => setInput('Saran diagnosis untuk demam dan nyeri sendi')} className="text-xs px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full whitespace-nowrap text-slate-600 dark:text-slate-400 hover:border-emerald-300 transition-colors">
               <Activity className="w-3 h-3 inline mr-1" /> Cek Gejala
             </button>
             <button onClick={() => setInput('Buatkan resume medis')} className="text-xs px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full whitespace-nowrap text-slate-600 dark:text-slate-400 hover:border-emerald-300 transition-colors">
               <FileText className="w-3 h-3 inline mr-1" /> Resume Medis
             </button>
          </div>

          {/* Input */}
          <div className="p-4 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 shrink-0">
            <div className="relative flex items-center">
              <input 
                type="text" 
                className="w-full pl-4 pr-12 py-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Tanya AI Assistant..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
              />
              <button 
                onClick={handleSend}
                className="absolute right-2 p-1.5 bg-[var(--color-primary-blue)] text-white rounded-full hover:bg-blue-600 transition-colors"
                disabled={!input.trim()}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
