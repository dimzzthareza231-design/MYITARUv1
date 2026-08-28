import React from 'react';
import { Star, MessageSquareReply, Filter } from 'lucide-react';
import { dummyFeedback } from '../dummyData';

export function FeedbackPanduan() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Feedback Pengguna</h1>
          <p className="text-slate-500">Tinjau masukan dan rating panduan dari pengguna</p>
        </div>
        <button className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 flex items-center gap-2">
          <Filter className="w-4 h-4" /> Filter
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="p-4 text-xs font-bold text-slate-500 uppercase">Tanggal</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase">Panduan</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase">Pengguna</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase">Rating</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase">Komentar</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {dummyFeedback.map((fb) => (
              <tr key={fb.id} className="hover:bg-slate-50">
                <td className="p-4 text-sm text-slate-600 whitespace-nowrap">{fb.date}</td>
                <td className="p-4 font-medium text-slate-800">{fb.guide}</td>
                <td className="p-4 text-sm text-slate-700">{fb.user}</td>
                <td className="p-4">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star key={star} className={`w-4 h-4 ${star <= fb.rating ? 'fill-current' : 'text-slate-200'}`} />
                    ))}
                  </div>
                </td>
                <td className="p-4">
                  <div className="text-sm text-slate-700 line-clamp-2">{fb.comment}</div>
                  <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase
                    ${fb.category === 'Membantu' ? 'bg-emerald-100 text-emerald-700' : 
                      fb.category === 'Membingungkan' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                    {fb.category}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <button className="px-3 py-1.5 border border-slate-300 rounded text-xs font-medium text-slate-700 hover:bg-slate-50 inline-flex items-center gap-1">
                    <MessageSquareReply className="w-3 h-3" /> Balas
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
