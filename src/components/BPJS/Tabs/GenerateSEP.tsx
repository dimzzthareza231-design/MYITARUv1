import React, { useState, useEffect } from 'react';
import { Search, ChevronRight, CheckCircle2, Ticket, Printer, RefreshCw, Eye, XCircle } from 'lucide-react';
import { BPJS_KEYS, initBPJSData } from '../bpjsData';
import toast from 'react-hot-toast';
import { Modal } from '../../Modal';
import PrintPDFButton from '../../PrintPDFButton';

export function GenerateSEP() {
  const [step, setStep] = useState(1);
  const [pasienSearch, setPasienSearch] = useState('');
  const [selectedPasien, setSelectedPasien] = useState<any>(null);
  const [dasarSEP, setDasarSEP] = useState('rujukan');
  const [isGenerating, setIsGenerating] = useState(false);
  const [sepList, setSepList] = useState<any[]>([]);

  useEffect(() => {
    initBPJSData();
    loadSepData();
  }, []);

  const loadSepData = () => {
    setSepList([]);
  };

  const handleSearchPasien = (e: React.FormEvent) => {
    e.preventDefault();
    const term = (pasienSearch || '').trim();
    if (!term) return;
    const raw = localStorage.getItem('hospital_patients');
    const allPasien: any[] = raw ? JSON.parse(raw) : [];
    const found = allPasien.find((p: any) => {
      if (!p) return false;
      const noKartu = String(p.noKartu || p.no_kartu || '');
      const nik = String(p.nik || '');
      const nama = String(p.nama || p.nama_pasien || '');
      return noKartu.includes(term) || nik.includes(term) || nama.toLowerCase().includes(term.toLowerCase());
    });
    if (found) {
      setSelectedPasien(found);
      toast.success('Pasien ditemukan & kepesertaan aktif!');
    } else {
      toast.error('Pasien tidak ditemukan');
    }
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      const newSep = {
        noSep: `0001R0${Math.floor(Math.random() * 1000000000)}`,
        tglSep: new Date().toISOString().split('T')[0],
        noKartu: selectedPasien.noKartu,
        nama: selectedPasien.nama,
        poli: 'Penyakit Dalam', // mock
        diagnosa: 'A09 - Diarrhoea', // mock
        kelas: selectedPasien.kelas,
        status: 'Tercetak'
      };
      const updatedList = [newSep, ...sepList];

      setSepList(updatedList);
      toast.success(`Berhasil Generate SEP: ${newSep.noSep}`);
      setStep(4); // Success step
    }, 2000);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Pembuatan SEP</h1>
        <p className="text-slate-500">Generate Surat Eligibilitas Peserta terintegrasi V-Claim</p>
      </div>

      {step < 4 ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex border-b border-slate-200">
            <div className={`flex-1 py-4 text-center text-sm font-bold ${step >= 1 ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' : 'text-slate-500'}`}>
              1. Pilih Pasien
            </div>
            <div className={`flex-1 py-4 text-center text-sm font-bold ${step >= 2 ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' : 'text-slate-500'}`}>
              2. Dasar Pelayanan
            </div>
            <div className={`flex-1 py-4 text-center text-sm font-bold ${step >= 3 ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' : 'text-slate-500'}`}>
              3. Konfirmasi & Generate
            </div>
          </div>

          <div className="p-6">
            {step === 1 && (
              <div className="space-y-6 max-w-2xl mx-auto">
                <form onSubmit={handleSearchPasien} className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Masukkan No Kartu BPJS atau NIK..." 
                      className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                      value={pasienSearch}
                      onChange={e => setPasienSearch(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="px-6 py-3 bg-slate-800 text-white font-bold rounded-lg hover:bg-slate-900">
                    Cari
                  </button>
                </form>

                {selectedPasien && (
                  <div className="p-4 border border-emerald-200 bg-emerald-50 rounded-lg flex items-start gap-4">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 mt-1" />
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-800">{selectedPasien.nama}</h3>
                      <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                        <div><span className="text-slate-500">No Kartu:</span> {selectedPasien.noKartu}</div>
                        <div><span className="text-slate-500">NIK:</span> {selectedPasien.nik}</div>
                        <div><span className="text-slate-500">Status:</span> <span className="font-bold text-emerald-600">AKTIF</span></div>
                        <div><span className="text-slate-500">Kelas:</span> {selectedPasien.kelas}</div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end pt-4">
                  <button 
                    disabled={!selectedPasien} 
                    onClick={() => setStep(2)}
                    className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg disabled:opacity-50 hover:bg-blue-700 flex items-center gap-2"
                  >
                    Selanjutnya <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 max-w-2xl mx-auto">
                <div className="space-y-3">
                  <label className="block text-sm font-bold text-slate-700">Dasar Pembuatan SEP</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['rujukan', 'kontrol', 'igd'].map(type => (
                      <button 
                        key={type}
                        onClick={() => setDasarSEP(type)}
                        className={`p-3 border rounded-lg text-sm font-bold text-center capitalize ${dasarSEP === type ? 'border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-500' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                      >
                        {type === 'kontrol' ? 'Surat Kontrol' : type === 'igd' ? 'IGD / Gawat Darurat' : 'Rujukan'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Pilih Referensi</label>
                    <select className="w-full p-2 border border-slate-300 rounded-lg text-sm bg-white outline-none">
                      <option>Pilih data referensi (Dummy)</option>
                      <option>1234567890 - Puskesmas Melati - 15 Okt 2023</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <button onClick={() => setStep(1)} className="px-6 py-2 border border-slate-300 text-slate-700 font-bold rounded-lg hover:bg-slate-50">Kembali</button>
                  <button onClick={() => setStep(3)} className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 flex items-center gap-2">
                    Selanjutnya <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 max-w-3xl mx-auto">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-bold text-slate-800 border-b pb-2">Informasi Pasien</h3>
                    <div className="text-sm space-y-2">
                      <div className="flex justify-between"><span className="text-slate-500">Nama</span> <span className="font-bold">{selectedPasien?.nama}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">No Kartu</span> <span>{selectedPasien?.noKartu}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Hak Kelas</span> <span>{selectedPasien?.kelas}</span></div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-bold text-slate-800 border-b pb-2">Detail Layanan</h3>
                    <div className="text-sm space-y-2">
                      <div className="flex justify-between"><span className="text-slate-500">Tujuan</span> <span className="font-bold">Rawat Jalan</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Poli Tujuan</span> <span>Penyakit Dalam</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Dokter</span> <span>Dr. Andi (Dummy)</span></div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 space-y-3">
                  <label className="block text-sm font-bold text-slate-700">Catatan Tambahan</label>
                  <input type="text" className="w-full p-2 border border-slate-300 rounded-lg text-sm outline-none" placeholder="Opsional..." />
                </div>

                <div className="flex justify-between pt-6 border-t">
                  <button disabled={isGenerating} onClick={() => setStep(2)} className="px-6 py-2 border border-slate-300 text-slate-700 font-bold rounded-lg hover:bg-slate-50 disabled:opacity-50">Kembali</button>
                  <button onClick={handleGenerate} disabled={isGenerating} className="px-8 py-2 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 flex items-center gap-2 disabled:opacity-70">
                    {isGenerating ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Ticket className="w-5 h-5" />}
                    {isGenerating ? 'Memproses ke V-Claim...' : 'Generate SEP Sekarang'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-emerald-200 shadow-sm p-8 text-center max-w-2xl mx-auto space-y-6">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">SEP Berhasil Digenerate!</h2>
            <p className="text-slate-500 mt-2">Data telah berhasil disubmit ke sistem BPJS V-Claim.</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg inline-block border border-slate-200">
            <div className="text-sm text-slate-500 mb-1">Nomor SEP</div>
            <div className="text-3xl font-mono font-bold text-slate-800 tracking-wider">{sepList[0]?.noSep}</div>
          </div>
          <div className="flex justify-center gap-4 pt-4">
            <button onClick={() => { setStep(1); setSelectedPasien(null); setPasienSearch(''); }} className="px-6 py-2 border border-slate-300 text-slate-700 font-bold rounded-lg hover:bg-slate-50">
              Buat SEP Lain
            </button>
            <PrintPDFButton 
              documentData={{
                nama: sepList[0]?.nama || selectedPasien?.nama,
                no_rm: sepList[0]?.noKartu || selectedPasien?.noKartu,
                no_sep: sepList[0]?.noSep,
                unit_pelayanan: sepList[0]?.poli || 'Poliklinik Penyakit Dalam',
                diagnosis_utama: sepList[0]?.diagnosa || 'Pemeriksaan Rawat Jalan BPJS',
                penjamin: 'BPJS Kesehatan (V-Claim Terverifikasi)',
                edukasi_instruksi: 'Surat Eligibilitas Peserta (SEP) ini berlaku sebagai bukti jaminan pelayanan kesehatan BPJS di Klinik MYITARU.'
              }}
              docType="general"
              filename={`SEP_${sepList[0]?.noSep || 'Resmi'}`} 
              label="Cetak / Pratinjau SEP" 
              title="SURAT ELIGIBILITAS PESERTA (SEP)"
              className="px-6 py-2" 
            />
          </div>
        </div>
      )}

      {/* Tabel Histori SEP */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mt-8">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-slate-800">Riwayat SEP Terakhir</h3>
          <button onClick={loadSepData} className="text-slate-400 hover:text-blue-600"><RefreshCw className="w-4 h-4" /></button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b text-slate-500 bg-white">
                <th className="p-3 font-bold">No SEP</th>
                <th className="p-3 font-bold">Tanggal</th>
                <th className="p-3 font-bold">Pasien</th>
                <th className="p-3 font-bold">Poli</th>
                <th className="p-3 font-bold">Status</th>
                <th className="p-3 font-bold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sepList.map((sep, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="p-3 font-mono text-blue-600">{sep.noSep}</td>
                  <td className="p-3">{sep.tglSep}</td>
                  <td className="p-3 font-bold text-slate-800">{sep.nama}</td>
                  <td className="p-3">{sep.poli}</td>
                  <td className="p-3">
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs font-bold">{sep.status}</span>
                  </td>
                  <td className="p-3 text-center">
                    <div className="flex justify-center items-center gap-1.5">
                      <PrintPDFButton
                        documentData={{
                          nama: sep.nama,
                          no_rm: sep.noKartu,
                          no_sep: sep.noSep,
                          unit_pelayanan: sep.poli,
                          diagnosis_utama: sep.diagnosa || 'Pemeriksaan Rawat Jalan BPJS',
                          penjamin: 'BPJS Kesehatan (V-Claim Terverifikasi)',
                          edukasi_instruksi: 'Surat Eligibilitas Peserta (SEP) ini berlaku sebagai bukti jaminan pelayanan kesehatan BPJS di Klinik MYITARU.'
                        }}
                        docType="general"
                        filename={`SEP_${sep.noSep}`}
                        label="Cetak"
                        title="SURAT ELIGIBILITAS PESERTA (SEP)"
                        className="py-1 px-2 text-xs font-semibold"
                      />
                      <button className="text-slate-400 hover:text-red-600 p-1"><XCircle className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {sepList.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">Belum ada riwayat SEP.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );


}
