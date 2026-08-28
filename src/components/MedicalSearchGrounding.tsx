import React, { useState } from 'react';
import { Search, Globe, ExternalLink, Sparkles, AlertCircle, BookOpen, ShieldCheck, Loader2, X, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

interface GroundedSource {
  title: string;
  url: string;
}

interface GroundedSearchResult {
  answer: string;
  sources: GroundedSource[];
  searchQueries?: string[];
}

interface MedicalSearchGroundingProps {
  initialQuery?: string;
  context?: string;
  isOpen?: boolean;
  onClose?: () => void;
  onApplyRecommendation?: (text: string) => void;
}

export function MedicalSearchGrounding({
  initialQuery = '',
  context = '',
  isOpen = true,
  onClose,
  onApplyRecommendation
}: MedicalSearchGroundingProps) {
  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GroundedSearchResult | null>(null);

  const suggestedQueries = [
    "Pedoman tatalaksana terbaru Demam Berdarah Dengue (DBD) Kemenkes RI",
    "Dosis dan kontraindikasi kombinasi Metformin dan Glimepiride pada lansia",
    "Protokol tatalaksana Hipertensi Emergensi & Urgensi menurut PERKI",
    "Interaksi obat Antasida dengan Antibiotik Golongan Kuinolon (Ciprofloxacin)",
    "Rekomendasi vaksinasi Dewasa PAPDI terbaru"
  ];

  const handleSearch = async (searchQuery: string = query) => {
    if (!searchQuery.trim()) {
      toast.error('Silakan masukkan pertanyaan atau topik medis.');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/ai/grounded-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: searchQuery,
          context
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Gagal mengambil data dari Google Search');
      }

      setResult(data);
      toast.success('Informasi klinis berbasis Google Search berhasil dimuat!');
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Gagal mencari referensi medis terkini.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden transition-all">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-700 p-5 text-white flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
            <Globe className="w-6 h-6 text-cyan-200 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold">Google Search Grounding Klinis</h2>
              <span className="bg-cyan-400/20 text-cyan-200 border border-cyan-300/30 text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Live Web Data
              </span>
            </div>
            <p className="text-xs text-blue-100">
              Pencarian evidens klinis, protokol Kemenkes, pedoman IDI, dan referensi obat terkini berbasis Google Search.
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="p-6 space-y-6">
        {/* Search Input Bar */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSearch();
                }}
                placeholder="Tuliskan pertanyaan klinis, interaksi obat, pedoman Kemenkes/WHO..."
                className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none text-sm transition-all"
              />
            </div>
            <button
              onClick={() => handleSearch()}
              disabled={loading}
              className="bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 text-white font-bold px-6 py-3 rounded-xl flex items-center gap-2 shadow-md transition-all shrink-0 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Mencari...</span>
                </>
              ) : (
                <>
                  <Globe className="w-5 h-5" />
                  <span>Cari Data Web</span>
                </>
              )}
            </button>
          </div>

          {/* Quick suggestions */}
          <div className="flex flex-wrap gap-2 pt-1">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium py-1">Topik Cepat:</span>
            {suggestedQueries.map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setQuery(item);
                  handleSearch(item);
                }}
                className="text-xs bg-slate-100 dark:bg-slate-700/60 hover:bg-cyan-50 hover:text-cyan-700 dark:hover:bg-slate-700 dark:hover:text-cyan-300 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-600 transition-colors cursor-pointer text-left"
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="p-10 text-center rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="relative w-16 h-16 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-cyan-500/20 border-t-cyan-500 animate-spin"></div>
              <Globe className="w-8 h-8 text-cyan-500 absolute inset-0 m-auto animate-pulse" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 dark:text-white">Menghubungi Google Search Grounding...</h4>
              <p className="text-xs text-slate-500 mt-1">Mengambil artikel jurnal, konsensus Kemenkes, dan literatur klinis terbaru secara real-time.</p>
            </div>
          </div>
        )}

        {/* Results Display */}
        {result && !loading && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Answer Box */}
            <div className="bg-slate-50 dark:bg-slate-900/60 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-4 border-b border-slate-200 dark:border-slate-700 pb-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                  <h3 className="font-bold text-slate-900 dark:text-white">Rangkuman Evidens & Pedoman Klinis Terverifikasi</h3>
                </div>
                {onApplyRecommendation && (
                  <button
                    onClick={() => {
                      onApplyRecommendation(result.answer);
                      toast.success('Rekomendasi disalin ke catatan medis/rencana terapi.');
                    }}
                    className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-sm transition-colors cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" /> Terapkan ke Plan Medis
                  </button>
                )}
              </div>

              {/* Main Content Formatted */}
              <div className="prose dark:prose-invert max-w-none text-sm text-slate-700 dark:text-slate-200 whitespace-pre-line leading-relaxed">
                {result.answer}
              </div>

              {/* Disclaimer */}
              <div className="mt-5 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-800 dark:text-amber-300">
                  <strong>Clinical Decision Support Notice:</strong> Informasi di atas dihasilkan melalui Gemini dengan Google Search Grounding untuk membantu dokter dan staf medis. Keputusan akhir tetap berada pada kewenangan profesional dokter penanggung jawab pelayanan (DPJP).
                </p>
              </div>
            </div>

            {/* Sources / Citations List */}
            {result.sources && result.sources.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    Sumber Rujukan Web & Jurnal Resmi ({result.sources.length})
                  </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {result.sources.map((src, idx) => (
                    <a
                      key={idx}
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-cyan-500 hover:shadow-md transition-all flex items-center justify-between group"
                    >
                      <div className="min-w-0 pr-3">
                        <p className="font-semibold text-xs text-slate-800 dark:text-slate-200 truncate group-hover:text-cyan-600 dark:group-hover:text-cyan-400">
                          {src.title || src.url}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5 font-mono">
                          {src.url}
                        </p>
                      </div>
                      <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-cyan-500 shrink-0 transition-colors" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
