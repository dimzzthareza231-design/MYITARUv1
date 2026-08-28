import React, { useState, useRef, useEffect } from 'react';
import { Video, MessageSquare, Send, PhoneCall, Stethoscope, User } from 'lucide-react';
import toast from 'react-hot-toast';

export function KonsultasiDokter() {
  const [activeTab, setActiveTab] = useState('chat');
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, sender: 'dokter', text: 'Selamat pagi, Pak Budi. Ada yang bisa saya bantu hari ini?', time: '09:00' },
    { id: 2, sender: 'pasien', text: 'Selamat pagi Dok. Saya ingin konsultasi tentang hasil lab kemarin.', time: '09:02' },
    { id: 3, sender: 'dokter', text: 'Baik, saya sudah melihat hasil lab Bapak. Gula darah puasa Bapak 110 mg/dL, masih dalam batas normal. Apakah ada keluhan lain?', time: '09:05' },
  ]);
  const [inCall, setInCall] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = { id: Date.now(), sender: 'pasien', text: chatInput, time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, userMsg]);
    setChatInput('');

    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now(),
        sender: 'dokter',
        text: 'Terima kasih atas informasinya. Saya akan catat dan berikan rekomendasi lebih lanjut. Apakah ada hal lain yang ingin ditanyakan?',
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 2000);
  };

  const handleStartCall = () => {
    setInCall(true);
    toast.success('Memulai video call dengan dokter (simulasi)');
  };

  const handleEndCall = () => {
    setInCall(false);
    toast.success('Video call diakhiri');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Video className="w-6 h-6 text-teal-600" /> Konsultasi Dokter (Telemedicine)
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Konsultasi dengan dokter secara online</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center">
            <Stethoscope className="w-7 h-7 text-teal-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-slate-800 dark:text-white">Dr. Ahmad Fauzi</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Dokter Umum - Klinik Sehat Utama</p>
            <span className="inline-block mt-1 px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full text-xs font-bold">Online</span>
          </div>
          {!inCall && (
            <button
              onClick={handleStartCall}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-bold hover:bg-teal-700 flex items-center gap-2"
            >
              <Video className="w-4 h-4" /> Video Call
            </button>
          )}
        </div>
      </div>

      {inCall && (
        <div className="bg-slate-900 rounded-xl p-6 text-center">
          <div className="w-24 h-24 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Stethoscope className="w-12 h-12 text-slate-400" />
          </div>
          <p className="text-white font-bold mb-2">Video Call dengan Dr. Ahmad Fauzi</p>
          <p className="text-slate-400 text-sm mb-4">00:05:32</p>
          <button
            onClick={handleEndCall}
            className="px-6 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 flex items-center gap-2 mx-auto"
          >
            <PhoneCall className="w-4 h-4" /> Akhiri Panggilan
          </button>
        </div>
      )}

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
          <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-teal-600" /> Chat Konsultasi
          </h3>
        </div>
        <div className="h-80 overflow-y-auto p-4 space-y-4">
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.sender === 'pasien' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] p-3 rounded-xl ${
                msg.sender === 'pasien'
                  ? 'bg-teal-600 text-white rounded-br-none'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-white rounded-bl-none'
              }`}>
                <div className="flex items-center gap-2 mb-1">
                  {msg.sender === 'dokter' ? <Stethoscope className="w-3 h-3 text-teal-500" /> : <User className="w-3 h-3" />}
                  <span className={`text-[10px] ${msg.sender === 'pasien' ? 'text-teal-200' : 'text-slate-400'}`}>{msg.time}</span>
                </div>
                <p className="text-sm">{msg.text}</p>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
        <form onSubmit={handleSend} className="p-4 border-t border-slate-200 dark:border-slate-700 flex gap-2">
          <input
            type="text"
            className="flex-1 p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 focus:ring-2 focus:ring-teal-500 outline-none"
            placeholder="Ketik pesan..."
            value={chatInput}
            onChange={e => setChatInput(e.target.value)}
          />
          <button
            type="submit"
            className="px-4 py-3 bg-teal-600 text-white rounded-lg font-bold hover:bg-teal-700 flex items-center gap-2"
          >
            <Send className="w-4 h-4" /> Kirim
          </button>
        </form>
      </div>
    </div>
  );
}
