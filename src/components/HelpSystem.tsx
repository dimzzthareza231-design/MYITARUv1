import React, { useState } from 'react';
import { LifeBuoy, Search, X, ChevronRight, ThumbsUp, ThumbsDown, PlayCircle } from 'lucide-react';
import { useHospital } from '../contexts/HospitalContext';

export function HelpSystem() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { artikelBantuan } = useHospital();
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null);

  const filtered = artikelBantuan.filter(a => 
    a.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const activeArticle = artikelBantuan.find(a => a.id === selectedArticle);

  return (
    <>
      {/* Floating Help Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-[var(--color-primary-blue)] text-white rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center z-50 group"
      >
        <LifeBuoy className="w-7 h-7" />
        <span className="absolute right-full mr-4 bg-slate-800 text-white text-sm px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Pusat Bantuan
        </span>
      </button>

      {/* Help Panel */}
      {isOpen && (
        <div className="fixed inset-y-0 right-0 w-full md:w-96 bg-white dark:bg-slate-900 shadow-2xl z-[100] flex flex-col border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-300">
          <div className="p-4 bg-[var(--color-primary-blue)] text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <LifeBuoy className="w-5 h-5" />
              <h2 className="font-bold text-lg">Pusat Bantuan ITARU</h2>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/20 rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 border-b border-slate-200 dark:border-slate-800 shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Cari panduan atau tutorial..."
                className="w-full pl-9 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-primary-blue)]"
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); setSelectedArticle(null); }}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
            {selectedArticle && activeArticle ? (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-200">
                <button 
                  onClick={() => setSelectedArticle(null)}
                  className="text-[var(--color-primary-blue)] text-sm font-medium flex items-center gap-1 mb-4 hover:underline"
                >
                  <ChevronRight className="w-4 h-4 rotate-180" /> Kembali
                </button>
                <div className="inline-block px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold uppercase rounded mb-3">
                  {activeArticle.kategori}
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">{activeArticle.judul}</h3>
                
                {/* Embedded Video Placeholder */}
                <div className="w-full aspect-video bg-slate-200 dark:bg-slate-800 rounded-lg mb-4 flex flex-col items-center justify-center text-slate-400 hover:text-[var(--color-primary-blue)] cursor-pointer transition-colors group">
                  <PlayCircle className="w-12 h-12 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">Tonton Video Tutorial</span>
                </div>

                <div className="prose prose-sm dark:prose-invert">
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{activeArticle.konten}</p>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
                  <p className="text-sm text-center text-slate-500 mb-4">Apakah artikel ini membantu?</p>
                  <div className="flex justify-center gap-4">
                    <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-900/30 rounded-lg transition-colors text-sm font-medium">
                      <ThumbsUp className="w-4 h-4" /> Ya
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30 rounded-lg transition-colors text-sm font-medium">
                      <ThumbsDown className="w-4 h-4" /> Tidak
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                  {searchQuery ? 'Hasil Pencarian' : 'Artikel Populer'}
                </p>
                {filtered.map(a => (
                  <button 
                    key={a.id}
                    onClick={() => setSelectedArticle(a.id)}
                    className="w-full text-left p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700 group"
                  >
                    <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-1 group-hover:text-[var(--color-primary-blue)] transition-colors">{a.judul}</h4>
                    <p className="text-xs text-slate-500 line-clamp-1">{a.konten}</p>
                  </button>
                ))}
                {filtered.length === 0 && (
                  <div className="text-center py-8 text-slate-500">
                    Tidak menemukan panduan yang dicari.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
