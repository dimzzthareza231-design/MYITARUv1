import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, User, RefreshCcw } from 'lucide-react';
import toast from 'react-hot-toast';

export function HumanAI() {
  const [messages, setMessages] = useState<any[]>([
    { role: 'ai', text: 'Halo! Saya adalah Human AI, asisten cerdas BPJS Kesehatan. Saya bisa membantu Anda dengan informasi kepesertaan, tagihan, klaim, dan layanan JKN. Ada yang bisa saya bantu?', time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = { role: 'user', text: input, time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    setTimeout(() => {
      const responses = [
        'Untuk mengecek status kepesertaan Anda, silakan buka menu "Info Peserta" dan masukkan NIK atau nomor kartu BPJS Anda. Sistem akan menampilkan status aktif/nonaktif kepesertaan Anda.',
        'Iuran JKN untuk Kelas 3 adalah Rp 35.000/bulan, Kelas 2 Rp 100.000/bulan, dan Kelas 1 Rp 150.000/bulan. Pembayaran dapat dilakukan melalui Virtual Account, minimarket, atau autodebit.',
        'Untuk mengubah data peserta seperti alamat atau nomor HP, Anda bisa mengakses menu "Perubahan Data Peserta". Perubahan akan diproses dalam 1-3 hari kerja.',
        'Jika Anda ingin pindah Faskes Tingkat 1, silakan gunakan menu "Perubahan Faskes". Perubahan berlaku mulai tanggal 1 bulan berikutnya.',
        'Untuk klaim atau pertanyaan tentang layanan, saya sarankan menghubungi Call Center 165 atau datang ke kantor cabang BPJS terdekat dengan membawa identitas diri.'
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setMessages(prev => [...prev, { role: 'ai', text: randomResponse, time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) }]);
      setIsLoading(false);
    }, 1500);
  };

  const handleReset = () => {
    setMessages([{ role: 'ai', text: 'Percakapan direset. Ada yang bisa saya bantu lagi?', time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) }]);
    toast.success('Percakapan direset');
  };

  const quickQuestions = [
    'Cek status kepesertaan',
    'Berapa iuran JKN?',
    'Cara pindah Faskes',
    'Cara klaim layanan'
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Bot className="w-6 h-6 text-teal-600" /> Human AI
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Asisten kecerdasan buatan untuk interaksi dengan pengguna</p>
        </div>
        <button
          onClick={handleReset}
          className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2"
        >
          <RefreshCcw className="w-4 h-4" /> Reset Percakapan
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col h-[600px]">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] p-3 rounded-xl ${
                msg.role === 'user'
                  ? 'bg-teal-600 text-white rounded-br-none'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-white rounded-bl-none'
              }`}>
                <div className="flex items-center gap-2 mb-1">
                  {msg.role === 'ai' ? <Bot className="w-4 h-4 text-teal-500" /> : <User className="w-4 h-4" />}
                  <span className={`text-[10px] ${msg.role === 'user' ? 'text-teal-200' : 'text-slate-400'}`}>{msg.time}</span>
                </div>
                <p className="text-sm leading-relaxed">{msg.text}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-slate-100 dark:bg-slate-700 p-3 rounded-lg">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-slate-700">
          <div className="flex gap-2 mb-3 flex-wrap">
            {quickQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => setInput(q)}
                className="px-3 py-1.5 bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400 rounded-full text-xs font-bold hover:bg-teal-100 dark:hover:bg-teal-900/40 border border-teal-200 dark:border-teal-800"
              >
                {q}
              </button>
            ))}
          </div>
          <form onSubmit={handleSend} className="flex gap-2">
            <input
              type="text"
              className="flex-1 p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 focus:ring-2 focus:ring-teal-500 outline-none"
              placeholder="Ketik pertanyaan Anda..."
              value={input}
              onChange={e => setInput(e.target.value)}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-4 py-3 bg-teal-600 text-white rounded-lg font-bold hover:bg-teal-700 disabled:opacity-50 flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
