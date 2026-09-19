import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Bot, Search, RefreshCw, Eye } from 'lucide-react';
import PrintPDFButton from '../../PrintPDFButton';
import { initBPJSData } from '../bpjsData';

export function KlaimBPJS() {
  const [klaimList, setKlaimList] = useState<any[]>([]);
  const [selectedKlaim, setSelectedKlaim] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Ensure BPJS data is initialized before loading
    initBPJSData();
    loadKlaimData();
  }, []);

  const loadKlaimData = () => {
    try {
      const saved = localStorage.getItem('simrs_bpjs_klaim');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setKlaimList(parsed);
          return;
        }
      }
    } catch (e) {
      console.error('Error loading bpjs_klaim:', e);
    }
    setKlaimList([]);
  };

  const handleViewDetail = (klaim: any) => {
    setSelectedKlaim(klaim);
    setShowDetailModal(true);
  };

  const filteredKlaim = (klaimList || []).filter(k => {
    if (!k) return false;
    const term = (searchTerm || '').trim().toLowerCase();
    if (!term) return true;

    const noKlaim = String(k.no_klaim || k.noKlaim || k.id || '').toLowerCase();
    const namaPasien = String(k.nama_pasien || k.namaPasien || k.pasien || k.nama || '').toLowerCase();
    const noSep = String(k.no_sep || k.noSep || k.noSEP || '').toLowerCase();
    const diagnosis = String(k.diagnosis_utama || k.diagnosis || k.diagnosa || '').toLowerCase();
    const status = String(k.status || '').toLowerCase();

    return noKlaim.includes(term) || namaPasien.includes(term) || noSep.includes(term) || diagnosis.includes(term) || status.includes(term);
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-slate-800 dark:text-white">Manajemen Klaim BPJS</h1>

      <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4 mb-4 border border-slate-200 dark:border-slate-700">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari berdasarkan No Klaim, No SEP, atau Nama Pasien..."
              className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={loadKlaimData}
            className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden border border-slate-200 dark:border-slate-700">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 dark:bg-slate-700/50">
            <tr>
              <th className="p-3 text-left">No Klaim</th>
              <th className="p-3 text-left">No SEP</th>
              <th className="p-3 text-left">Pasien</th>
              <th className="p-3 text-left">Diagnosis</th>
              <th className="p-3 text-left">Total</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {filteredKlaim.map((klaim) => (
              <tr key={klaim.id} className="border-t hover:bg-gray-50 dark:hover:bg-slate-700/50">
                <td className="p-3 font-mono text-blue-600 dark:text-blue-400 font-bold">{klaim.no_klaim}</td>
                <td className="p-3 font-mono text-slate-500 dark:text-slate-400">{klaim.no_sep}</td>
                <td className="p-3 font-medium text-slate-800 dark:text-white">{klaim.nama_pasien}</td>
                <td className="p-3 text-slate-600 dark:text-slate-300">{klaim.diagnosis_utama}</td>
                <td className="p-3 font-medium text-slate-800 dark:text-white">Rp {(klaim.total_biaya || 0).toLocaleString()}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    ['Disetujui', 'Klaim Cair'].includes(klaim.status) ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300' :
                    ['Draft', 'Siap Kirim', 'Diajukan'].includes(klaim.status) ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300' :
                    ['Verifikasi Vedika'].includes(klaim.status) ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300' :
                    ['Dispute'].includes(klaim.status) ? 'bg-rose-100 dark:bg-rose-900/40 text-rose-800 dark:text-rose-300' :
                    'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-300'
                  }`}>
                    {klaim.status}
                  </span>
                </td>
                <td className="p-3 text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    <PrintPDFButton
                      documentData={{
                        nama: klaim.nama_pasien,
                        no_rm: klaim.no_rm || klaim.no_sep,
                        no_sep: klaim.no_sep,
                        no_klaim: klaim.no_klaim,
                        diagnosis_utama: klaim.diagnosis_utama,
                        tindakan: klaim.tindakan_utama,
                        biaya_total: klaim.total_biaya,
                        penjamin: 'BPJS Kesehatan (INA-CBGs)',
                        edukasi_instruksi: `Klaim INA-CBGs telah tercatat dengan total biaya Rp ${(klaim.total_biaya || 0).toLocaleString()}.`
                      }}
                      docType="billing"
                      filename={`Klaim_BPJS_${klaim.no_klaim}`}
                      label="Cetak"
                      title="BERKAS PENGAJUAN KLAIM BPJS"
                      className="py-1 px-2 text-xs font-semibold"
                    />
                    <button
                      onClick={() => handleViewDetail(klaim)}
                      className="bg-blue-600 text-white px-2.5 py-1 rounded hover:bg-blue-700 font-medium text-xs transition-colors"
                    >
                      Detail
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredKlaim.length === 0 && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-500 dark:text-slate-400">
                  Tidak ada klaim yang ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showDetailModal && selectedKlaim && (
        <ModalDetailKlaim
          klaim={selectedKlaim}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedKlaim(null);
          }}
        />
      )}
    </div>
  );


function ModalDetailKlaim({ klaim, onClose }: { klaim: any, onClose: () => void }) {
  const [activeTab, setActiveTab] = useState('data');
  const [aiResult, setAiResult] = useState<any>(null);

  const tabs = [
    { id: 'data', label: 'Data Klaim' },
    { id: 'biaya', label: 'Detail Biaya' },
    { id: 'inacbg', label: 'INA-CBGs' },
    { id: 'validator', label: 'AI Validator' },
    { id: 'log', label: 'Status Log' }
  ];

  const handleAnalyzeAI = async () => {
    setAiResult({ loading: true });
    toast.loading('AI sedang menganalisis klaim...', { id: 'ai-analyze' });
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast.dismiss('ai-analyze');
    setAiResult({
      loading: false,
      score: 85,
      suggestions: [
        'Tambahkan tindakan 99.21 (Infus terapi)',
        'Lengkapi diagnosis sekunder'
      ]
    });
    toast.success('Analisis AI selesai!');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200 dark:border-slate-700">
        <div className="bg-slate-800 text-white p-5 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">Detail Klaim BPJS</h2>
            <p className="text-sm text-slate-300 mt-1 font-mono">{klaim.no_klaim}</p>
          </div>
          <div className="flex items-center gap-3">
            <PrintPDFButton
              documentData={{
                nama: klaim.nama_pasien,
                no_rm: klaim.no_rm || klaim.no_sep,
                no_sep: klaim.no_sep,
                no_klaim: klaim.no_klaim,
                diagnosis_utama: klaim.diagnosis_utama,
                tindakan: klaim.tindakan_utama,
                biaya_total: klaim.total_biaya,
                penjamin: 'BPJS Kesehatan (INA-CBGs)',
                edukasi_instruksi: `Klaim INA-CBGs telah tercatat dengan total biaya Rp ${(klaim.total_biaya || 0).toLocaleString()}.`
              }}
              docType="billing"
              filename={`Klaim_BPJS_${klaim.no_klaim}`}
              label="Cetak / Pratinjau Berkas Klaim"
              title="BERKAS PENGAJUAN KLAIM BPJS"
              className="py-1.5 px-3 text-xs"
            />
            <button onClick={onClose} className="text-2xl text-slate-400 hover:text-white transition-colors leading-none">×</button>
          </div>
        </div>

        <div className="flex border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-4 font-medium text-sm whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">
          {activeTab === 'data' && (
            <div className="space-y-6">
              <h3 className="font-bold text-lg text-slate-800 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2">Informasi Utama</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1 block">No SEP</label>
                  <p className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg font-mono border border-slate-200 dark:border-slate-600">{klaim.no_sep}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1 block">Pasien</label>
                  <p className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg font-medium border border-slate-200 dark:border-slate-600">{klaim.nama_pasien}</p>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1 block">Diagnosis Utama</label>
                  <p className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600">{klaim.diagnosis_utama}</p>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1 block">Tindakan Utama</label>
                  <p className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600">{klaim.tindakan_utama}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'biaya' && (
            <div>
              <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-4">Detail Biaya Tindakan & Obat</h3>
              <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="p-3 text-left font-semibold text-slate-700 dark:text-slate-300">Item / Deskripsi</th>
                      <th className="p-3 text-center font-semibold text-slate-700 dark:text-slate-300">Jumlah</th>
                      <th className="p-3 text-right font-semibold text-slate-700 dark:text-slate-300">Harga Satuan</th>
                      <th className="p-3 text-right font-semibold text-slate-700 dark:text-slate-300">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    <tr>
                      <td className="p-3">Jasa Medis Dokter Spesialis</td>
                      <td className="p-3 text-center">1</td>
                      <td className="p-3 text-right">Rp 500.000</td>
                      <td className="p-3 text-right font-medium">Rp 500.000</td>
                    </tr>
                    <tr>
                      <td className="p-3">Obat Kronis (Paket)</td>
                      <td className="p-3 text-center">5</td>
                      <td className="p-3 text-right">Rp 100.000</td>
                      <td className="p-3 text-right font-medium">Rp 500.000</td>
                    </tr>
                  </tbody>
                  <tfoot className="bg-slate-50 dark:bg-slate-700/50 border-t border-slate-200 dark:border-slate-700">
                    <tr>
                      <td colSpan={3} className="p-3 text-right font-bold text-slate-800 dark:text-slate-200">Total Biaya Diajukan</td>
                      <td className="p-3 text-right font-bold text-blue-600 dark:text-blue-400 text-base">Rp {(klaim.total_biaya || 0).toLocaleString()}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'inacbg' && (
            <div>
              <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-4">Hasil Grouping INA-CBGs</h3>
              <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-1 block">Kode CBGs</label>
                    <p className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-blue-100 dark:border-blue-700 font-mono font-bold text-lg shadow-sm">J-1-01-I</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-1 block">Deskripsi Group</label>
                    <p className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-blue-100 dark:border-blue-700 shadow-sm">Diabetes Mellitus dengan Komplikasi (Ringan)</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-1 block">Severity Level</label>
                    <p className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-blue-100 dark:border-blue-700 shadow-sm flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-emerald-500"></span> Level 1 (Ringan)
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-1 block">Tarif Klinik Kelas B (Regional 1)</label>
                    <p className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-blue-100 dark:border-blue-700 shadow-sm font-bold text-blue-700 dark:text-blue-400 text-xl">Rp 5.500.000</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'validator' && (
            <div className="h-full flex flex-col">
              <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-4">AI Klaim Validator</h3>
              {!aiResult ? (
                <div className="flex-1 flex flex-col items-center justify-center p-12 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-700/30">
                  <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300 rounded-full flex items-center justify-center text-3xl mb-4">🤖</div>
                  <h4 className="font-bold text-slate-800 dark:text-white mb-2 text-center text-lg">Validasi Klaim dengan AI</h4>
                  <p className="text-slate-500 dark:text-slate-400 text-center max-w-md mb-6">AI akan menganalisis kesesuaian antara diagnosis, tindakan, dan standar koding INA-CBG untuk mencegah potensi pending atau dispute klaim.</p>
                  <button
                    onClick={handleAnalyzeAI}
                    className="bg-purple-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-purple-700 transition-colors shadow-sm flex items-center gap-2"
                  >
                    <Bot className="w-5 h-5" /> Mulai Analisis AI
                  </button>
                </div>
              ) : aiResult.loading ? (
                <div className="flex-1 flex flex-col items-center justify-center p-12 py-20">
                  <div className="text-5xl mb-6 animate-spin">⚙️</div>
                  <p className="text-lg font-medium text-slate-600 dark:text-slate-300">AI sedang mengekstrak dan menganalisis data klaim...</p>
                  <div className="w-64 h-2 bg-slate-200 dark:bg-slate-700 rounded-full mt-6 overflow-hidden">
                    <div className="h-full bg-purple-600 animate-pulse w-full"></div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-xl p-8 text-white shadow-lg flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium opacity-80 mb-1">Skor Kelengkapan & Kepatuhan Klaim</div>
                      <div className="text-6xl font-bold">{aiResult.score}<span className="text-2xl opacity-70">/100</span></div>
                    </div>
                    <div className="text-right">
                      <div className="inline-block px-4 py-2 bg-white/20 rounded-lg backdrop-blur-sm border border-white/30 font-medium">
                        Status: <span className="text-emerald-300 font-bold">Potensi Lolos</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                      <span className="text-xl">💡</span> Saran Perbaikan AI:
                    </h4>
                    <div className="space-y-3">
                      {aiResult.suggestions.map((suggestion: string, idx: number) => (
                        <div key={idx} className="p-4 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-xl flex justify-between items-center shadow-sm">
                          <span className="text-amber-900 dark:text-amber-200 font-medium">{suggestion}</span>
                          <button 
                            onClick={() => toast.success('Saran diterapkan!')}
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 hover:bg-blue-50 dark:hover:bg-slate-700 px-3 py-1.5 rounded-lg text-sm font-bold transition-colors"
                          >
                            Terapkan
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'log' && (
            <div>
              <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-6">Status Log & Riwayat Transmisi</h3>
              <div className="space-y-0 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white dark:border-slate-800 bg-emerald-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                    ✓
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-bold text-slate-800 dark:text-white">Draft Dibuat</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">01 Ags 2026, 10:30</div>
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-300">Dibuat oleh Admin Kasir (Sistem)</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

}
