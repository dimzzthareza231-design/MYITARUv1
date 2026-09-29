import React from 'react';
import { HospitalDocumentModel } from '../../types/document';
import { ShieldCheck, AlertTriangle, CheckCircle2, User, HeartPulse, Activity, Zap, Microscope, FileText, Baby, AlertOctagon, FileWarning } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface DossierTemplateProps {
  document: HospitalDocumentModel;
  renderHeader: (badge?: string, sub?: string) => React.ReactNode;
  renderFooter: (customRole?: string, signerName?: string, signerSip?: string) => React.ReactNode;
  renderWatermark: () => React.ReactNode;
  containerStyle: React.CSSProperties;
}

export function DossierTemplateRenderer({
  document,
  renderHeader,
  renderFooter,
  renderWatermark,
  containerStyle,
}: DossierTemplateProps) {
  const { subject, signer } = document;
  const todayStr = signer.tanggal || new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

  // Patient Demographic Banner
  const renderPatientInfo = () => (
    <section className="bg-slate-50 p-3 rounded-lg border border-slate-300 text-xs mb-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div>
          <span className="text-[10px] text-slate-500 font-bold block uppercase">No. Rekam Medis</span>
          <span className="font-mono font-black text-blue-950 text-sm">{subject.no_rm || '-'}</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-500 font-bold block uppercase">Nama Pasien</span>
          <span className="font-black text-slate-900">{subject.nama || '-'}</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-500 font-bold block uppercase">Tgl Lahir / Usia</span>
          <span className="text-slate-800">{subject.tgl_lahir || '-'} ({subject.umur || '-'} Thn)</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-500 font-bold block uppercase">Penjamin / Ruang</span>
          <span className="text-slate-800 font-semibold">{subject.penjamin || 'BPJS'} / {subject.ruangan || subject.poli || 'Rawat Inap'}</span>
        </div>
      </div>
    </section>
  );

  // 1. ASESMEN RISIKO JATUH
  if (document.type === 'asesmen_risiko_jatuh' && document.fallRiskData) {
    const data = document.fallRiskData;
    return (
      <div className="printable-hospital-doc bg-white text-slate-900 shadow-2xl mx-auto my-0 p-8 sm:p-12 relative overflow-hidden font-sans border border-slate-300" style={containerStyle}>
        {renderWatermark()}
        {renderHeader('SKP.6 KARS', 'LEMBAR ASESMEN KESELAMATAN PASIEN')}
        <div className="text-center my-3 border-b-2 border-slate-900 pb-2">
          <h2 className="text-base sm:text-lg font-black uppercase text-slate-950">{document.judulDokumen}</h2>
          <p className="text-xs font-semibold text-slate-600">Skala Penilaian: {data.scaleType === 'morse' ? 'Morse Fall Scale (Dewasa)' : 'Humpty Dumpty (Pediatri)'} • Shift: {data.shift}</p>
        </div>
        {renderPatientInfo()}
        <main className="space-y-4 text-xs leading-relaxed">
          <div className="p-3 bg-amber-50/70 border border-amber-300 rounded-lg flex justify-between items-center">
            <div>
              <span className="font-bold text-amber-950 uppercase text-[11px] block">Hasil Penilaian Risiko Jatuh:</span>
              <span className="text-base font-black text-amber-900">{data.kategori}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-500 block uppercase font-bold">Total Skor</span>
              <span className="text-2xl font-black text-amber-700">{data.skor}</span>
            </div>
          </div>
          <div className="border border-slate-300 rounded-lg overflow-hidden">
            <div className="bg-slate-100 p-2 font-bold text-slate-800 border-b border-slate-300 uppercase text-[11px]">Intervensi Pencegahan Pasien Jatuh yang Telah Diimplementasikan</div>
            <div className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {Object.entries(data.intervensi).map(([k, v]) => (
                <div key={k} className="flex items-center gap-2">
                  <span className={`w-4 h-4 rounded flex items-center justify-center font-bold text-[10px] ${v ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-400'}`}>{v ? '✓' : '✕'}</span>
                  <span className="text-slate-800">
                    {k === 'gelangKuning' && 'Pemasangan gelang kuning penanda risiko jatuh'}
                    {k === 'segitigaJatuh' && 'Pemasangan tanda segitiga jatuh di atas tempat tidur'}
                    {k === 'bedRailTerkunci' && 'Pengaman tempat tidur (bed rails) terpasang & terkunci'}
                    {k === 'belJangkauan' && 'Tombol bel perawat berada dalam jangkauan pasien'}
                    {k === 'lantaiKering' && 'Lantai ruangan kering, bebas hambatan & cukup pencahayaan'}
                    {k === 'edukasiKeluarga' && 'Edukasi pencegahan jatuh kepada pasien & keluarga'}
                    {k === 'pendampinganMobilisasi' && 'Pendampingan aktif saat mobilisasi / ke kamar mandi'}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded text-slate-700">
            <span className="font-bold">Catatan Klinis:</span> Re-asesmen dilakukan setiap pergantian shift jaga atau jika terjadi perubahan status klinis / perpindahan ruangan.
          </div>
        </main>
        {renderFooter('Perawat Penilai Shift,', data.petugas)}
      </div>
    );
  }

  // 2. SKRINING GIZI LANJUT
  if (document.type === 'skrining_gizi_lanjut' && document.nutritionData) {
    const data = document.nutritionData;
    return (
      <div className="printable-hospital-doc bg-white text-slate-900 shadow-2xl mx-auto my-0 p-8 sm:p-12 relative overflow-hidden font-sans border border-slate-300" style={containerStyle}>
        {renderWatermark()}
        {renderHeader('ASUHAN GIZI PAGT', 'INSTALASI GIZI & DIETETIK KLINIS')}
        <div className="text-center my-3 border-b-2 border-slate-900 pb-2">
          <h2 className="text-base sm:text-lg font-black uppercase text-slate-950">{document.judulDokumen}</h2>
          <p className="text-xs font-semibold text-slate-600">Standar Asuhan Gizi Terstandar (PAGT) / Malnutrition Screening Tool (MST)</p>
        </div>
        {renderPatientInfo()}
        <main className="space-y-4 text-xs leading-relaxed">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 bg-emerald-50/60 border border-emerald-300 rounded-lg text-center">
            <div><span className="text-[10px] text-slate-500 font-bold block">Berat Badan</span><span className="font-black text-slate-900">{data.bb} kg</span></div>
            <div><span className="text-[10px] text-slate-500 font-bold block">Tinggi Badan</span><span className="font-black text-slate-900">{data.tb} cm</span></div>
            <div><span className="text-[10px] text-slate-500 font-bold block">Indeks Massa Tubuh (IMT)</span><span className="font-black text-emerald-800">{data.imt} kg/m²</span></div>
            <div><span className="text-[10px] text-slate-500 font-bold block">Status Antropometri</span><span className="font-bold text-slate-900">{data.imtKategori}</span></div>
          </div>
          <div className="p-3 bg-white border border-slate-300 rounded-lg space-y-2">
            <div className="flex justify-between border-b pb-1 font-bold text-slate-900">
              <span>Skrining Risiko Malnutrisi (Skor MST): <strong>{data.mstScore}</strong></span>
              <span className={`px-2 py-0.5 rounded text-[11px] ${data.isMalnourished ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'}`}>{data.isMalnourished ? 'Beresiko Malnutrisi (Skor ≥ 2)' : 'Tidak Beresiko Malnutrisi'}</span>
            </div>
            <div><span className="font-bold text-slate-700">Diagnosis Gizi (PAGT):</span><p className="p-2 bg-slate-50 rounded border border-slate-200 mt-0.5">{data.diagnosisGizi}</p></div>
            <div><span className="font-bold text-slate-700">Preskripsi Diet & Intervensi:</span><p className="p-2 bg-slate-50 rounded border border-slate-200 mt-0.5 font-medium">{data.intervensiGizi}</p></div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 text-slate-800">
              <div><span className="text-[10px] text-slate-500 block font-bold">Bentuk Makanan</span><span>{data.bentukMakanan}</span></div>
              <div><span className="text-[10px] text-slate-500 block font-bold">Rute Pemberian</span><span>{data.rutePemberian}</span></div>
              <div><span className="text-[10px] text-slate-500 block font-bold">Kebutuhan Energi / Protein</span><span>{data.targetKalori} kkal / {data.targetProtein} g</span></div>
            </div>
          </div>
        </main>
        {renderFooter('Dietisien Penanggung Jawab,', data.dietisien)}
      </div>
    );
  }

  // 3. ASESMEN & MANAJEMEN NYERI
  if (document.type === 'asesmen_nyeri' && document.painData) {
    const data = document.painData;
    return (
      <div className="printable-hospital-doc bg-white text-slate-900 shadow-2xl mx-auto my-0 p-8 sm:p-12 relative overflow-hidden font-sans border border-slate-300" style={containerStyle}>
        {renderWatermark()}
        {renderHeader('MANAJEMEN NYERI', 'STANDAR PELAYANAN MEDIS & KARS')}
        <div className="text-center my-3 border-b-2 border-slate-900 pb-2">
          <h2 className="text-base sm:text-lg font-black uppercase text-slate-950">{document.judulDokumen}</h2>
          <p className="text-xs font-semibold text-slate-600">Evaluasi Skala Nyeri Komprehensif (Metode: {data.metode})</p>
        </div>
        {renderPatientInfo()}
        <main className="space-y-4 text-xs leading-relaxed">
          <div className="p-3 bg-rose-50/70 border border-rose-300 rounded-lg flex justify-between items-center">
            <div>
              <span className="font-bold text-rose-950 uppercase text-[11px] block">Tingkat Derajat Nyeri Pasien:</span>
              <span className="text-base font-black text-rose-900">{data.kategori} (Skala {data.skala} / 10)</span>
            </div>
            <div className="flex gap-1">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <span key={num} className={`w-6 h-6 rounded flex items-center justify-center font-bold text-[10px] ${data.skala === num ? 'bg-rose-600 text-white ring-2 ring-rose-400' : 'bg-slate-200 text-slate-600'}`}>{num}</span>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 p-3 bg-white border border-slate-300 rounded-lg">
            <div><span className="text-slate-500 font-bold block">Lokasi Nyeri:</span><span className="font-semibold text-slate-900">{data.lokasi}</span></div>
            <div><span className="text-slate-500 font-bold block">Onset / Durasi:</span><span className="font-semibold text-slate-900">{data.onset}</span></div>
            <div><span className="text-slate-500 font-bold block">Kualitas Nyeri:</span><span className="font-semibold text-slate-900">{data.kualitas}</span></div>
            <div><span className="text-slate-500 font-bold block">Faktor Provokasi / Meredakan:</span><span className="font-semibold text-slate-900">{data.provokasi}</span></div>
            <div><span className="text-slate-500 font-bold block">Radiasi / Penjalaran:</span><span className="font-semibold text-slate-900">{data.radiasi}</span></div>
            <div><span className="text-slate-500 font-bold block">Frekuensi:</span><span className="font-semibold text-slate-900">{data.frekuensi}</span></div>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-300 rounded-lg space-y-2">
            <div><span className="font-bold text-slate-800">Tata Laksana Farmakologis:</span><p className="text-slate-900 font-mono mt-0.5">{data.terapiFarmakologi}</p></div>
            <div><span className="font-bold text-slate-800">Tata Laksana Non-Farmakologis:</span><p className="text-slate-900 mt-0.5">{data.terapiNonFarmakologi}</p></div>
            <div><span className="font-bold text-slate-800">Evaluasi Respon Pasca Intervensi (Re-asesmen 30 Menit):</span><p className="text-emerald-800 font-semibold mt-0.5">{data.responSetelahIntervensi}</p></div>
          </div>
        </main>
        {renderFooter('Petugas Penilai Nyeri,', data.evaluator)}
      </div>
    );
  }

  // 4. ASESMEN BARTHEL INDEX ADL
  if (document.type === 'asesmen_barthel' && document.barthelData) {
    const data = document.barthelData;
    return (
      <div className="printable-hospital-doc bg-white text-slate-900 shadow-2xl mx-auto my-0 p-8 sm:p-12 relative overflow-hidden font-sans border border-slate-300" style={containerStyle}>
        {renderWatermark()}
        {renderHeader('REHABILITASI MEDIK', 'ASESMEN FUNGSIONAL PASIEN (ADL)')}
        <div className="text-center my-3 border-b-2 border-slate-900 pb-2">
          <h2 className="text-base sm:text-lg font-black uppercase text-slate-950">{document.judulDokumen}</h2>
          <p className="text-xs font-semibold text-slate-600">Indeks Kemandirian Aktivitas Kehidupan Sehari-hari (Barthel Index 10 Parameter)</p>
        </div>
        {renderPatientInfo()}
        <main className="space-y-4 text-xs leading-relaxed">
          <div className="p-3 bg-indigo-50/70 border border-indigo-300 rounded-lg flex justify-between items-center">
            <div>
              <span className="font-bold text-indigo-950 uppercase text-[11px] block">Kategori Tingkat Ketergantungan:</span>
              <span className="text-base font-black text-indigo-900">{data.kategori}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-500 block uppercase font-bold">Total Skor Barthel</span>
              <span className="text-2xl font-black text-indigo-800">{data.skor} / 100</span>
            </div>
          </div>
          <table className="w-full border-collapse border border-slate-300 text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                <th className="p-2 border border-slate-300 text-left">Parameter Aktivitas (ADL)</th>
                <th className="p-2 border border-slate-300 text-center w-24">Skor Pasien</th>
                <th className="p-2 border border-slate-300 text-left">Deskripsi Kemandirian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr><td className="p-2 border border-slate-300 font-semibold">1. Makan & Minum</td><td className="p-2 border border-slate-300 text-center font-bold">{data.parameterScores.makan ?? 10}</td><td className="p-2 border border-slate-300">{data.kemandirianMakan}</td></tr>
              <tr><td className="p-2 border border-slate-300 font-semibold">2. Mandi</td><td className="p-2 border border-slate-300 text-center font-bold">{data.parameterScores.mandi ?? 5}</td><td className="p-2 border border-slate-300">{data.kemandirianMandi}</td></tr>
              <tr><td className="p-2 border border-slate-300 font-semibold">3. Berpakaian</td><td className="p-2 border border-slate-300 text-center font-bold">{data.parameterScores.berpakaian ?? 10}</td><td className="p-2 border border-slate-300">{data.kemandirianBerpakaian}</td></tr>
              <tr><td className="p-2 border border-slate-300 font-semibold">4. Transfer (Tempat Tidur ke Kursi)</td><td className="p-2 border border-slate-300 text-center font-bold">{data.parameterScores.transfer ?? 15}</td><td className="p-2 border border-slate-300">{data.kemandirianTransfer}</td></tr>
              <tr><td className="p-2 border border-slate-300 font-semibold">5. Mobilitas Berjalan</td><td className="p-2 border border-slate-300 text-center font-bold">{data.parameterScores.mobilitas ?? 15}</td><td className="p-2 border border-slate-300">{data.kemandirianMobilitas}</td></tr>
            </tbody>
          </table>
        </main>
        {renderFooter('Fisioterapis / Evaluator,', data.fisioterapis)}
      </div>
    );
  }

  // 5. PARTOGRAF WHO
  if (document.type === 'partograf' && document.partografData) {
    const data = document.partografData;
    return (
      <div className="printable-hospital-doc bg-white text-slate-900 shadow-2xl mx-auto my-0 p-8 sm:p-12 relative overflow-hidden font-sans border border-slate-300" style={containerStyle}>
        {renderWatermark()}
        {renderHeader('PELAYANAN MATERNAL & OBSTETRI', 'LEMBAR PARTOGRAF RESMI WHO')}
        <div className="text-center my-3 border-b-2 border-slate-900 pb-2">
          <h2 className="text-base sm:text-lg font-black uppercase text-slate-950">{document.judulDokumen}</h2>
          <p className="text-xs font-semibold text-slate-600">Pemantauan Fase Aktif Persalinan (Garis Waspada & Garis Bertindak)</p>
        </div>
        {renderPatientInfo()}
        <main className="space-y-4 text-xs leading-relaxed">
          <div className="p-2.5 bg-pink-50 border border-pink-200 rounded grid grid-cols-3 gap-2">
            <div><span className="text-[10px] text-slate-500 font-bold block">Status Obstetri</span><span className="font-bold text-slate-900">{data.gravida}</span></div>
            <div><span className="text-[10px] text-slate-500 font-bold block">Ketuban Pecah Sejak</span><span className="text-slate-800">{data.ketubanPecahSejak}</span></div>
            <div><span className="text-[10px] text-slate-500 font-bold block">Mules Sejak</span><span className="text-slate-800">{data.mulesSejak}</span></div>
          </div>
          <table className="w-full border-collapse border border-slate-300 text-center text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-900 font-bold border-b border-slate-300">
                <th className="p-1.5 border border-slate-300">Waktu</th>
                <th className="p-1.5 border border-slate-300">Pembukaan (cm)</th>
                <th className="p-1.5 border border-slate-300">Turun Kepala</th>
                <th className="p-1.5 border border-slate-300">DJJ (x/m)</th>
                <th className="p-1.5 border border-slate-300">His / 10m (Durasi)</th>
                <th className="p-1.5 border border-slate-300">Tensi / Nadi</th>
                <th className="p-1.5 border border-slate-300">Air Ketuban</th>
              </tr>
            </thead>
            <tbody>
              {data.dataPoints.map((dp, i) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="p-1.5 border border-slate-300 font-bold">{dp.jam}</td>
                  <td className="p-1.5 border border-slate-300 font-black text-pink-700">{dp.pembukaan} cm</td>
                  <td className="p-1.5 border border-slate-300">{dp.turunKepala}/5</td>
                  <td className="p-1.5 border border-slate-300">{dp.djj}</td>
                  <td className="p-1.5 border border-slate-300">{dp.hisFrekuensi}x ({dp.hisDurasi}")</td>
                  <td className="p-1.5 border border-slate-300">{dp.tdSistol}/{dp.tdDiastol} ({dp.nadi})</td>
                  <td className="p-1.5 border border-slate-300">{dp.ketuban === 'J' ? 'Jernih' : dp.ketuban === 'P' ? 'Pecah' : dp.ketuban}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </main>
        {renderFooter('Bidan / Dokter DPJP Maternal,', data.bidanDPJP)}
      </div>
    );
  }

  // 6. SKOR APGAR & NEONATAL
  if (document.type === 'asesmen_neonatus_apgar' && document.apgarData) {
    const data = document.apgarData;
    return (
      <div className="printable-hospital-doc bg-white text-slate-900 shadow-2xl mx-auto my-0 p-8 sm:p-12 relative overflow-hidden font-sans border border-slate-300" style={containerStyle}>
        {renderWatermark()}
        {renderHeader('PELAYANAN PERINATOLOGI', 'PENILAIAN BAYI BARU LAHIR')}
        <div className="text-center my-3 border-b-2 border-slate-900 pb-2">
          <h2 className="text-base sm:text-lg font-black uppercase text-slate-950">{document.judulDokumen}</h2>
          <p className="text-xs font-semibold text-slate-600">Dokumentasi Kelahiran & Skor APGAR Menit ke-1 dan Menit ke-5</p>
        </div>
        {renderPatientInfo()}
        <main className="space-y-4 text-xs leading-relaxed">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 bg-cyan-50/70 border border-cyan-300 rounded-lg text-center">
            <div><span className="text-[10px] text-slate-500 font-bold block">Tgl & Jam Lahir</span><span className="font-bold text-slate-900">{data.tglLahir}, {data.jamLahir}</span></div>
            <div><span className="text-[10px] text-slate-500 font-bold block">Berat / Panjang Lahir</span><span className="font-black text-slate-900">{data.beratLahir} g / {data.panjangBadan} cm</span></div>
            <div><span className="text-[10px] text-slate-500 font-bold block">Skor APGAR 1 Menit</span><span className="font-black text-cyan-800 text-base">{data.skorApgar1Min} / 10</span></div>
            <div><span className="text-[10px] text-slate-500 font-bold block">Skor APGAR 5 Menit</span><span className="font-black text-emerald-700 text-base">{data.skorApgar5Min} / 10</span></div>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-300 rounded-lg space-y-2">
            <div className="font-bold text-slate-900 uppercase">Profilaksis & Imunisasi Bayi Baru Lahir:</div>
            <div className="grid grid-cols-3 gap-2">
              <span className="p-2 bg-white rounded border border-slate-200">✓ Injeksi Vitamin K1 (1 mg IM): <strong>{data.profilaksisVitK ? 'Diberikan' : '-'}</strong></span>
              <span className="p-2 bg-white rounded border border-slate-200">✓ Salep Mata Antibiotik: <strong>{data.salepMata ? 'Diberikan' : '-'}</strong></span>
              <span className="p-2 bg-white rounded border border-slate-200">✓ Imunisasi Hepatitis B (Hb0): <strong>{data.imunisasiHb0 ? 'Diberikan' : '-'}</strong></span>
            </div>
            <div><span className="font-bold text-slate-800">Tindakan Resusitasi / Bantuan Awal:</span><p className="p-2 bg-white rounded border border-slate-200 mt-0.5">{data.resusitasiDilakukan}</p></div>
          </div>
        </main>
        {renderFooter('Dokter Spesialis Anak (Sp.A),', data.dokterAnak)}
      </div>
    );
  }

  // 7. FORMULIR DNR (DO NOT RESUSCITATE)
  if (document.type === 'formulir_dnr' && document.dnrData) {
    const data = document.dnrData;
    return (
      <div className="printable-hospital-doc bg-white text-slate-900 shadow-2xl mx-auto my-0 p-8 sm:p-12 relative overflow-hidden font-sans border-2 border-rose-400" style={containerStyle}>
        {renderWatermark()}
        {renderHeader('DOKUMEN LEGAL-MEDIK', 'PERINTAH PEMBATASAN RESUSITASI')}
        <div className="text-center my-3 border-b-2 border-rose-900 pb-2">
          <h2 className="text-base sm:text-lg font-black uppercase text-rose-900">{document.judulDokumen}</h2>
          <p className="text-xs font-semibold text-slate-600">Instruksi Medis & Persetujuan Penolakan Resusitasi Jantung Paru (RJP)</p>
        </div>
        {renderPatientInfo()}
        <main className="space-y-4 text-xs leading-relaxed">
          <div className="p-3 bg-rose-50 border border-rose-300 rounded text-rose-950 font-medium">
            Saya yang bertanda tangan di bawah ini: <strong>{data.wali?.nama || data.penandatangan}</strong> ({data.wali?.hubungan || 'Wali Sah'}), NIK: {data.wali?.nik || '-'}, menyatakan telah menerima penjelasan lengkap mengenai kondisi medis pasien dan menyetujui perintah Do Not Resuscitate (DNR).
          </div>
          <div><span className="font-bold text-slate-900">Alasan Medis Klinis:</span><p className="p-2 bg-slate-50 border border-slate-200 rounded mt-0.5">{data.alasanMedis}</p></div>
          <div className="border border-rose-300 rounded-lg p-3 bg-white space-y-1.5">
            <span className="font-bold text-rose-900 uppercase">Tindakan yang Tidak Dilakukan saat Henti Jantung / Nafas:</span>
            <p className="text-slate-800">• Kompresi Dada Luar (RJP / CPR) • Pemasangan Pipa Endotrakeal (Intubasi) & Ventilator Mekik • Kejut Listrik Jantung (Defibrilasi) • Obat Vasopresor Dosis Tinggi.</p>
            <p className="text-emerald-800 font-bold pt-1 border-t border-slate-200">✓ Perawatan paliatif, oksigenasi, hidrasi, dan obat pereda nyeri TETAP DIBERIKAN.</p>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-2 text-center">
            <div className="p-2 border border-slate-300 rounded">
              <span className="text-[10px] text-slate-500 block uppercase">Pemberi Persetujuan</span>
              <p className="font-bold mt-8 border-b pb-1">{data.wali?.nama || subject.nama}</p>
              <span className="text-[10px] text-slate-500">Keluarga / Pasien</span>
            </div>
            <div className="p-2 border border-slate-300 rounded">
              <span className="text-[10px] text-slate-500 block uppercase">Dokter DPJP Konsultan</span>
              <p className="font-bold mt-8 border-b pb-1">{data.dokterPenanggungJawab}</p>
              <span className="text-[10px] text-slate-500">Spesialis Penanggung Jawab</span>
            </div>
          </div>
        </main>
        {renderFooter('DPJP Penanggung Jawab,', data.dokterPenanggungJawab)}
      </div>
    );
  }

  // 8. SURAT PULANG PAKSA (APS / DAMA)
  if (document.type === 'pulang_paksa' && document.pulangPaksaData) {
    const data = document.pulangPaksaData;
    return (
      <div className="printable-hospital-doc bg-white text-slate-900 shadow-2xl mx-auto my-0 p-8 sm:p-12 relative overflow-hidden font-sans border border-slate-300" style={containerStyle}>
        {renderWatermark()}
        {renderHeader('SURAT KELUAR RUMAH SAKIT', 'PULANG ATAS PERMINTAAN SENDIRI')}
        <div className="text-center my-3 border-b-2 border-slate-900 pb-2">
          <h2 className="text-base sm:text-lg font-black uppercase text-slate-950">{document.judulDokumen}</h2>
          <p className="text-xs font-semibold text-slate-600">Pelepasan Tanggung Jawab Hukum & Edukasi Risiko Penghentian Perawatan Medis</p>
        </div>
        {renderPatientInfo()}
        <main className="space-y-4 text-xs leading-relaxed">
          <div className="p-3 bg-amber-50 border border-amber-300 rounded text-slate-900">
            Saya yang bertanda tangan di bawah ini: <strong>{data.namaPenandatangan}</strong> ({data.hubungan}), menyatakan meminta pemulangan pasien sebelum diizinkan secara medis oleh Dokter Penanggung Jawab Pelayanan (DPJP).
          </div>
          <div><span className="font-bold text-slate-800">Alasan Permintaan Pulang:</span><p className="p-2 bg-slate-50 border border-slate-200 rounded mt-0.5">{data.alasanPulang}</p></div>
          <div className="p-3 bg-white border border-slate-300 rounded space-y-1">
            <span className="font-bold text-slate-900 uppercase">Pernyataan Pembebasan Tanggung Jawab:</span>
            <p className="text-slate-700 leading-normal">{data.edukasiDiberikan}</p>
            <p className="text-slate-700 font-medium pt-1">Dengan ini membebaskan pihak Rumah Sakit dan Dokter dari segala tuntutan hukum, kecacatan atau akibat fatal yang terjadi akibat keputusan ini.</p>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-2 text-center">
            <div className="p-2 border border-slate-200 rounded">
              <span className="text-[10px] text-slate-500 block uppercase">Pemohon Pulang Paksa</span>
              <p className="font-bold mt-8 border-b pb-1">{data.namaPenandatangan}</p>
              <span className="text-[10px] text-slate-500">Pasien / Wali Sah</span>
            </div>
            <div className="p-2 border border-slate-200 rounded">
              <span className="text-[10px] text-slate-500 block uppercase">Saksi Perawat Jaga</span>
              <p className="font-bold mt-8 border-b pb-1">{data.saksiPerawat}</p>
              <span className="text-[10px] text-slate-500">Staf Keperawatan</span>
            </div>
          </div>
        </main>
        {renderFooter('Dokter DPJP Mengetahui,', data.dokterDPJP)}
      </div>
    );
  }

  // 9. EKG / EEG
  if (document.type === 'grafik_ekg_eeg' && document.ekgData) {
    const data = document.ekgData;
    return (
      <div className="printable-hospital-doc bg-white text-slate-900 shadow-2xl mx-auto my-0 p-8 sm:p-12 relative overflow-hidden font-sans border border-slate-300" style={containerStyle}>
        {renderWatermark()}
        {renderHeader('HASIL ELEKTROFISIOLOGI', 'INSTALASI DIAGNOSTIK KARDIOVASKULAR')}
        <div className="text-center my-3 border-b-2 border-slate-900 pb-2">
          <h2 className="text-base sm:text-lg font-black uppercase text-slate-950">{document.judulDokumen}</h2>
          <p className="text-xs font-semibold text-slate-600">Pemeriksaan: {data.jenisPemeriksaan} • Kecepatan: 25 mm/s • Kalibrasi: 10 mm/mV</p>
        </div>
        {renderPatientInfo()}
        <main className="space-y-4 text-xs leading-relaxed">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 bg-red-50/60 border border-red-300 rounded-lg text-center">
            <div><span className="text-[10px] text-slate-500 font-bold block">Irama Jantung</span><span className="font-bold text-slate-900">{data.irama}</span></div>
            <div><span className="text-[10px] text-slate-500 font-bold block">Heart Rate</span><span className="font-black text-red-800 text-sm">{data.heartRate} x/mnt</span></div>
            <div><span className="text-[10px] text-slate-500 font-bold block">Axis Jantung</span><span className="font-bold text-slate-900">{data.axisJantung}</span></div>
            <div><span className="text-[10px] text-slate-500 font-bold block">Kompleks QRS</span><span className="font-bold text-slate-900">{data.kompleksQRS}</span></div>
          </div>
          <table className="w-full border-collapse border border-slate-300 text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-900 font-bold border-b border-slate-300">
                <th className="p-2 border border-slate-300 text-left">Gelombang / Interval</th>
                <th className="p-2 border border-slate-300 text-left">Hasil Analisis Morfologi</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="p-2 border border-slate-300 font-bold">Gelombang P</td><td className="p-2 border border-slate-300">{data.gelombangP}</td></tr>
              <tr><td className="p-2 border border-slate-300 font-bold">Interval PR</td><td className="p-2 border border-slate-300">{data.intervalPR}</td></tr>
              <tr><td className="p-2 border border-slate-300 font-bold">Segmen ST</td><td className="p-2 border border-slate-300">{data.segmenST}</td></tr>
              <tr><td className="p-2 border border-slate-300 font-bold">Gelombang T</td><td className="p-2 border border-slate-300">{data.gelombangT}</td></tr>
            </tbody>
          </table>
          <div className="p-3 bg-slate-50 border border-slate-300 rounded-lg">
            <span className="font-bold text-slate-900 uppercase">Kesimpulan Ekspertise Spesialis Jantung:</span>
            <p className="text-slate-900 font-semibold mt-1 p-2 bg-white rounded border border-slate-200">{data.kesimpulan}</p>
          </div>
        </main>
        {renderFooter('Dokter Spesialis Jantung & Pembuluh Darah,', data.spesialisJantung)}
      </div>
    );
  }

  // 10. PATOLOGI ANATOMI
  if (document.type === 'laporan_patologi_anatomi' && document.patologiAnatomiData) {
    const data = document.patologiAnatomiData;
    return (
      <div className="printable-hospital-doc bg-white text-slate-900 shadow-2xl mx-auto my-0 p-8 sm:p-12 relative overflow-hidden font-sans border border-slate-300" style={containerStyle}>
        {renderWatermark()}
        {renderHeader('PATOLOGI ANATOMI', 'LABORATORIUM HISTOPATOLOGI')}
        <div className="text-center my-3 border-b-2 border-slate-900 pb-2">
          <h2 className="text-base sm:text-lg font-black uppercase text-slate-950">{document.judulDokumen}</h2>
          <p className="text-xs font-semibold text-slate-600">Nomor Registrasi PA: {data.noPA} • Asal Jaringan: {data.lokasiJaringan}</p>
        </div>
        {renderPatientInfo()}
        <main className="space-y-4 text-xs leading-relaxed">
          <div className="p-2.5 bg-purple-50 border border-purple-200 rounded">
            <span className="font-bold text-purple-950">Tindakan Pengambilan Spesimen: </span>
            <span className="text-slate-900">{data.tindakanBiopsi}</span>
          </div>
          <div><span className="font-bold text-slate-900">Pemeriksaan Makroskopis:</span><p className="p-2 bg-slate-50 border border-slate-200 rounded mt-0.5">{data.makroskopis}</p></div>
          <div><span className="font-bold text-slate-900">Pemeriksaan Mikroskopis:</span><p className="p-2 bg-slate-50 border border-slate-200 rounded mt-0.5">{data.mikroskopis}</p></div>
          <div className="p-3 bg-white border-2 border-purple-400 rounded-lg">
            <span className="font-bold text-purple-950 uppercase">Diagnosis / Kesimpulan Histopatologis:</span>
            <p className="text-slate-950 font-black text-sm mt-1">{data.kesimpulanPA}</p>
            {data.stagingTnm && <p className="text-[11px] text-slate-600 font-mono mt-1">Staging / Grading: {data.stagingTnm}</p>}
          </div>
        </main>
        {renderFooter('Dokter Spesialis Patologi Anatomi (Sp.PA),', data.dokterSpPA)}
      </div>
    );
  }

  // 11. SURAT KEMATIAN (SKK WHO)
  if (document.type === 'surat_kematian' && document.suratKematianData) {
    const data = document.suratKematianData;
    return (
      <div className="printable-hospital-doc bg-white text-slate-900 shadow-2xl mx-auto my-0 p-8 sm:p-12 relative overflow-hidden font-sans border-2 border-slate-900" style={containerStyle}>
        {renderWatermark()}
        {renderHeader('SURAT RESMI RUMAH SAKIT', 'SURAT KETERANGAN KEMATIAN')}
        <div className="text-center my-3 border-b-2 border-slate-900 pb-2">
          <h2 className="text-base sm:text-lg font-black uppercase text-slate-950">{document.judulDokumen}</h2>
          <p className="text-xs font-semibold text-slate-600">Nomor: {data.noSurat} • Standar ICD-10 WHO Cause of Death</p>
        </div>
        {renderPatientInfo()}
        <main className="space-y-4 text-xs leading-relaxed">
          <div className="p-3 bg-slate-100 rounded text-slate-900 grid grid-cols-2 gap-2 font-medium">
            <div>Waktu Meninggal: <strong>{data.tglMeninggal}, {data.jamMeninggal}</strong></div>
            <div>Tempat Meninggal: <strong>{data.tempatMeninggal}</strong></div>
          </div>
          <div className="border border-slate-300 rounded p-3 bg-white space-y-2">
            <span className="font-bold text-slate-900 uppercase">Urutan Penyebab Kematian (WHO International Form):</span>
            <div className="space-y-1.5 pl-2">
              <p><strong>I. (a) Penyebab Langsung:</strong> {data.whoCauseOfDeath.part1.a.penyakit} <span className="text-slate-500">({data.whoCauseOfDeath.part1.a.selangWaktu})</span></p>
              {data.whoCauseOfDeath.part1.b && <p><strong>(b) Penyebab Antara:</strong> {data.whoCauseOfDeath.part1.b.penyakit} <span className="text-slate-500">({data.whoCauseOfDeath.part1.b.selangWaktu})</span></p>}
              {data.whoCauseOfDeath.part1.c && <p><strong>(c) Penyebab Dasar:</strong> {data.whoCauseOfDeath.part1.c.penyakit} <span className="text-slate-500">({data.whoCauseOfDeath.part1.c.selangWaktu})</span></p>}
              {data.whoCauseOfDeath.part2 && <p className="pt-1 border-t"><strong>II. Kondisi Signifikan Lain:</strong> {data.whoCauseOfDeath.part2}</p>}
            </div>
          </div>
          <div className="text-slate-600 text-[11px] italic">Keterangan: {data.keteranganOtopsi}</div>
        </main>
        {renderFooter('Dokter yang Memeriksa Jenazah,', data.dokterPemeriksa)}
      </div>
    );
  }

  // 12. GENERAL CONSENT (PERSETUJUAN UMUM)
  if (document.type === 'general_consent' && document.generalConsentData) {
    const data = document.generalConsentData;
    return (
      <div className="printable-hospital-doc bg-white text-slate-900 shadow-2xl mx-auto my-0 p-8 sm:p-12 relative overflow-hidden font-sans border border-slate-300" style={containerStyle}>
        {renderWatermark()}
        {renderHeader('FORMULIR RM.01', 'PERSETUJUAN UMUM PELAYANAN')}
        <div className="text-center my-3 border-b-2 border-slate-900 pb-2">
          <h2 className="text-base sm:text-lg font-black uppercase text-slate-950">{document.judulDokumen}</h2>
          <p className="text-xs font-semibold text-slate-600">Hak & Kewajiban Pasien, Kerahasiaan Informasi Medis, & Persetujuan Tindakan Umum</p>
        </div>
        {renderPatientInfo()}
        <main className="space-y-4 text-xs leading-relaxed">
          <div className="p-3 bg-blue-50/70 border border-blue-200 rounded text-slate-800 space-y-1.5">
            <span className="font-bold text-blue-950 uppercase text-[11px] block">Butir Persetujuan & Komitmen:</span>
            <p>1. <strong>Persetujuan Perawatan & Pengobatan Umum:</strong> Menyetujui pemeriksaan fisik, pemeriksaan penunjang lab/radiologi rutin, pemasangan infus, dan pemberian obat sesuai standar medis.</p>
            <p>2. <strong>Pelepasan Informasi Medis:</strong> Memberi kuasa membuka data medis untuk klaim penjamin ({data.penjaminBiaya}) dan pelaporan SatuSehat Kemenkes RI.</p>
            <p>3. <strong>Tata Tertib & Hak Kewajiban:</strong> Telah memahami hak privasi, jam besuk, dan larangan merokok di lingkungan fasilitas kesehatan.</p>
          </div>
          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
            <span className="font-bold text-slate-800">Anggota Keluarga yang Diberi Kuasa Mengetahui Data Pasien:</span>
            <p className="text-slate-900 mt-0.5">{data.anggotaKeluargaDiizinkanBesuk}</p>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-3 text-center">
            <div className="p-2 border border-slate-200 rounded">
              <span className="text-[10px] text-slate-500 block uppercase">Yang Menyatakan Persetujuan</span>
              <p className="font-bold mt-8 border-b pb-1">{data.namaPemberiPersetujuan}</p>
              <span className="text-[10px] text-slate-500">Pasien / Wali ({data.hubunganDenganPasien})</span>
            </div>
            <div className="p-2 border border-slate-200 rounded">
              <span className="text-[10px] text-slate-500 block uppercase">Petugas Admisi / Saksi</span>
              <p className="font-bold mt-8 border-b pb-1">{data.saksiPetugasAdmisi}</p>
              <span className="text-[10px] text-slate-500">Petugas Registrasi RME</span>
            </div>
          </div>
        </main>
        {renderFooter('Petugas Pendaftaran & RME,', data.saksiPetugasAdmisi)}
      </div>
    );
  }

  // 13. INFORMED CONSENT (PERSETUJUAN TINDAKAN)
  if (document.type === 'informed_consent' && document.informedConsentData) {
    const data = document.informedConsentData;
    return (
      <div className="printable-hospital-doc bg-white text-slate-900 shadow-2xl mx-auto my-0 p-8 sm:p-12 relative overflow-hidden font-sans border border-slate-300" style={containerStyle}>
        {renderWatermark()}
        {renderHeader('FORMULIR RM.02', 'PERSETUJUAN TINDAKAN MEDIS')}
        <div className="text-center my-3 border-b-2 border-slate-900 pb-2">
          <h2 className="text-base sm:text-lg font-black uppercase text-slate-950">{document.judulDokumen}</h2>
          <p className="text-xs font-semibold text-slate-600">Tindakan: <strong>{data.namaTindakanMedis}</strong> • Status: <strong className={data.statusPernyataan === 'SETUJU' ? 'text-emerald-700' : 'text-rose-700'}>{data.statusPernyataan}</strong></p>
        </div>
        {renderPatientInfo()}
        <main className="space-y-4 text-xs leading-relaxed">
          <table className="w-full border-collapse border border-slate-300 text-xs">
            <tbody>
              <tr><td className="p-2 border border-slate-300 font-bold bg-slate-50 w-44">Dokter Pelaksana Tindakan</td><td className="p-2 border border-slate-300">{data.dokterPelaksana}</td></tr>
              <tr><td className="p-2 border border-slate-300 font-bold bg-slate-50">Indikasi Tindakan</td><td className="p-2 border border-slate-300">{data.indikasiTindakan}</td></tr>
              <tr><td className="p-2 border border-slate-300 font-bold bg-slate-50">Tata Cara / Prosedur</td><td className="p-2 border border-slate-300">{data.tataCaraTindakan}</td></tr>
              <tr><td className="p-2 border border-slate-300 font-bold bg-slate-50">Risiko & Komplikasi</td><td className="p-2 border border-slate-300 text-rose-800">{data.risikoDanKomplikasi}</td></tr>
              <tr><td className="p-2 border border-slate-300 font-bold bg-slate-50">Prognosis & Alternatif</td><td className="p-2 border border-slate-300">{data.prognosisTindakan} (Alt: {data.alternatifTindakan || '-'})</td></tr>
            </tbody>
          </table>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded">
            Dengan ini menyatakan <strong>{data.statusPernyataan}</strong> untuk dilakukannya tindakan medis tersebut di atas setelah memahami seluruh risiko, manfaat, dan konsekuensinya.
          </div>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-2 border border-slate-200 rounded">
              <span className="text-[10px] text-slate-500 block uppercase">Yang Membuat Pernyataan</span>
              <p className="font-bold mt-8 border-b pb-1">{data.namaYangMenyatakan}</p>
              <span className="text-[10px] text-slate-500">{data.hubunganDenganPasien}</span>
            </div>
            <div className="p-2 border border-slate-200 rounded">
              <span className="text-[10px] text-slate-500 block uppercase">Dokter Pemberi Edukasi</span>
              <p className="font-bold mt-8 border-b pb-1">{data.dokterPelaksana}</p>
              <span className="text-[10px] text-slate-500">Dokter Operator</span>
            </div>
          </div>
        </main>
        {renderFooter('Dokter Penanggung Jawab Pelayanan,', data.dokterPelaksana)}
      </div>
    );
  }

  // 14. CPPT (CATATAN PERKEMBANGAN TERINTEGRASI)
  if (document.type === 'cppt' && document.cpptData) {
    const data = document.cpptData;
    return (
      <div className="printable-hospital-doc bg-white text-slate-900 shadow-2xl mx-auto my-0 p-8 sm:p-12 relative overflow-hidden font-sans border border-slate-300" style={containerStyle}>
        {renderWatermark()}
        {renderHeader('FORMULIR RM.03', 'CATATAN PERKEMBANGAN PASIEN TERINTEGRASI')}
        <div className="text-center my-3 border-b-2 border-slate-900 pb-2">
          <h2 className="text-base sm:text-lg font-black uppercase text-slate-950">{document.judulDokumen}</h2>
          <p className="text-xs font-semibold text-slate-600">Model Dokumentasi SOAP / SBAR Interprofesional (DPJP, Perawat, Apoteker, Dietisien)</p>
        </div>
        {renderPatientInfo()}
        <main className="space-y-3 text-xs leading-relaxed">
          <table className="w-full border-collapse border border-slate-300 text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-900 font-bold border-b border-slate-300 text-center">
                <th className="p-2 border border-slate-300 w-24">Waktu</th>
                <th className="p-2 border border-slate-300 w-28">Profesi / PPA</th>
                <th className="p-2 border border-slate-300 text-left">Hasil Asesmen Pasien (SOAP)</th>
                <th className="p-2 border border-slate-300 text-left w-48">Instruksi Tenaga Kesehatan</th>
                <th className="p-2 border border-slate-300 w-24">Review DPJP</th>
              </tr>
            </thead>
            <tbody>
              {data.entries.map((entry, idx) => (
                <tr key={idx} className="align-top hover:bg-slate-50">
                  <td className="p-2 border border-slate-300 text-center font-mono">
                    <span className="block font-bold">{entry.tanggal}</span>
                    <span className="text-[10px] text-slate-500">{entry.jam}</span>
                  </td>
                  <td className="p-2 border border-slate-300 text-center">
                    <span className="font-bold block text-blue-900">{entry.profesi}</span>
                    <span className="text-[10px] text-slate-600">{entry.namaPetugas}</span>
                  </td>
                  <td className="p-2 border border-slate-300">
                    <p><strong>S:</strong> {entry.sbarSoap.s}</p>
                    <p><strong>O:</strong> {entry.sbarSoap.o}</p>
                    <p><strong>A:</strong> {entry.sbarSoap.a}</p>
                    <p><strong>P:</strong> {entry.sbarSoap.p}</p>
                  </td>
                  <td className="p-2 border border-slate-300 font-medium text-slate-800">{entry.instruksiPPA}</td>
                  <td className="p-2 border border-slate-300 text-center">
                    {entry.verifikasiDPJP?.diverifikasi ? (
                      <span className="text-[10px] font-bold text-emerald-700 block">✓ Diverifikasi<br/><span className="font-normal text-slate-500">{entry.verifikasiDPJP.jamVerifikasi}</span></span>
                    ) : (
                      <span className="text-[10px] text-amber-600 font-bold">Pending DPJP</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </main>
        {renderFooter('Dokter Penanggung Jawab Pelayanan (DPJP),', signer.nama)}
      </div>
    );
  }

  // 15. ASESMEN AWAL RAWAT INAP
  if (document.type === 'asesmen_medis_ranap' && document.asesmenRanapData) {
    const data = document.asesmenRanapData;
    return (
      <div className="printable-hospital-doc bg-white text-slate-900 shadow-2xl mx-auto my-0 p-8 sm:p-12 relative overflow-hidden font-sans border border-slate-300" style={containerStyle}>
        {renderWatermark()}
        {renderHeader('FORMULIR RM.04', 'ASESMEN AWAL RAWAT INAP')}
        <div className="text-center my-3 border-b-2 border-slate-900 pb-2">
          <h2 className="text-base sm:text-lg font-black uppercase text-slate-950">{document.judulDokumen}</h2>
          <p className="text-xs font-semibold text-slate-600">Pemeriksaan Medis & Keperawatan Komprehensif dalam 24 Jam Pertama Admisi</p>
        </div>
        {renderPatientInfo()}
        <main className="space-y-4 text-xs leading-relaxed">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 p-2.5 bg-slate-100 rounded text-center">
            <div><span className="text-[10px] text-slate-500 block">Tekanan Darah</span><span className="font-bold">{data.tandaVital.td}</span></div>
            <div><span className="text-[10px] text-slate-500 block">Frekuensi Nadi</span><span className="font-bold">{data.tandaVital.nadi}</span></div>
            <div><span className="text-[10px] text-slate-500 block">Suhu Tubuh</span><span className="font-bold">{data.tandaVital.suhu}</span></div>
            <div><span className="text-[10px] text-slate-500 block">Frekuensi Nafas</span><span className="font-bold">{data.tandaVital.rr}</span></div>
            <div><span className="text-[10px] text-slate-500 block">Saturasi O2</span><span className="font-bold">{data.tandaVital.spo2}</span></div>
          </div>
          <div className="space-y-2 p-3 bg-white border border-slate-300 rounded-lg">
            <div><span className="font-bold text-slate-800">Keluhan Utama & Riwayat Penyakit Sekarang:</span><p className="text-slate-900 mt-0.5">{data.keluhanUtama} • {data.riwayatPenyakitSekarang}</p></div>
            <div><span className="font-bold text-slate-800">Pemeriksaan Fisik Sistemik:</span><p className="text-slate-900 mt-0.5">{data.pemeriksaanFisikLengkap}</p></div>
            <div className="p-2 bg-blue-50 border border-blue-200 rounded"><span className="font-black text-blue-950 block">DIAGNOSIS KERJA / ADMISI:</span><span className="text-sm font-bold text-blue-900">{data.diagnosisMasuk}</span></div>
            <div><span className="font-bold text-slate-800">Rencana Terapi Awal:</span><p className="text-slate-900 font-mono mt-0.5">{data.terapiAwal}</p></div>
          </div>
        </main>
        {renderFooter('Dokter DPJP Utama,', data.dpjpUtama)}
      </div>
    );
  }

  // 16. SURGICAL SAFETY CHECKLIST
  if (document.type === 'surgical_safety_checklist' && document.surgicalSafetyData) {
    const data = document.surgicalSafetyData;
    return (
      <div className="printable-hospital-doc bg-white text-slate-900 shadow-2xl mx-auto my-0 p-8 sm:p-12 relative overflow-hidden font-sans border border-slate-300" style={containerStyle}>
        {renderWatermark()}
        {renderHeader('KAMAR OPERASI', 'SURGICAL SAFETY CHECKLIST')}
        <div className="text-center my-3 border-b-2 border-slate-900 pb-2">
          <h2 className="text-base sm:text-lg font-black uppercase text-slate-950">{document.judulDokumen}</h2>
          <p className="text-xs font-semibold text-slate-600">Tindakan: {data.namaOperasi} • Ruangan: {data.ruangOperasi}</p>
        </div>
        {renderPatientInfo()}
        <main className="space-y-4 text-xs leading-relaxed">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="border border-blue-300 rounded p-2.5 bg-blue-50/50">
              <span className="font-black text-blue-900 block border-b pb-1 text-[11px]">1. SIGN IN (Sebelum Induksi)</span>
              <ul className="space-y-1 mt-2">
                <li>✓ Identitas, lokasi & izin terkonfirmasi</li>
                <li>✓ Penandaan area operasi jelas</li>
                <li>✓ Mesin anestesi & obat lengkap</li>
                <li>✓ Pulse oximeter terpasang & berfungsi</li>
                <li>✓ Riwayat alergi dikonfirmasi</li>
              </ul>
            </div>
            <div className="border border-amber-300 rounded p-2.5 bg-amber-50/50">
              <span className="font-black text-amber-900 block border-b pb-1 text-[11px]">2. TIME OUT (Sebelum Insisi)</span>
              <ul className="space-y-1 mt-2">
                <li>✓ Semua tim perkenalkan nama & peran</li>
                <li>✓ Konfirmasi nama pasien & tindakan</li>
                <li>✓ Antibiotik profilaksis sudah masuk</li>
                <li>✓ Antisipasi kejadian kritis dibahas</li>
                <li>✓ Hasil foto rontgen ditampilkan</li>
              </ul>
            </div>
            <div className="border border-emerald-300 rounded p-2.5 bg-emerald-50/50">
              <span className="font-black text-emerald-900 block border-b pb-1 text-[11px]">3. SIGN OUT (Sebelum Menutup Luka)</span>
              <ul className="space-y-1 mt-2">
                <li>✓ Nama tindakan operasi dicatat</li>
                <li>✓ Jumlah kasa, jarum & alat lengkap</li>
                <li>✓ Label spesimen PA terverifikasi</li>
                <li>✓ Evaluasi PACU: {data.signOut.perhatianKhususPemulihanPACU}</li>
              </ul>
            </div>
          </div>
        </main>
        {renderFooter('Perawat Sirkuler Kamar Operasi,', data.perawatSirkuler)}
      </div>
    );
  }

  // 17. LAPORAN OPERASI
  if (document.type === 'laporan_operasi' && document.laporanOperasiData) {
    const data = document.laporanOperasiData;
    return (
      <div className="printable-hospital-doc bg-white text-slate-900 shadow-2xl mx-auto my-0 p-8 sm:p-12 relative overflow-hidden font-sans border border-slate-300" style={containerStyle}>
        {renderWatermark()}
        {renderHeader('BEDAH SENTRAL', 'LAPORAN OPERASI & ANESTESI')}
        <div className="text-center my-3 border-b-2 border-slate-900 pb-2">
          <h2 className="text-base sm:text-lg font-black uppercase text-slate-950">{document.judulDokumen}</h2>
          <p className="text-xs font-semibold text-slate-600">Tindakan: <strong>{data.namaOperasi}</strong> • Durasi: {data.jamMulai} - {data.jamSelesai} ({data.durasiMenit} Menit)</p>
        </div>
        {renderPatientInfo()}
        <main className="space-y-4 text-xs leading-relaxed">
          <div className="grid grid-cols-2 gap-2 p-2.5 bg-slate-50 border border-slate-300 rounded">
            <div><span className="text-slate-500 font-bold block">Operator:</span><span>{data.dokterOperator} (Asisten: {data.asistenOperator})</span></div>
            <div><span className="text-slate-500 font-bold block">Anestesiolog:</span><span>{data.dokterAnestesi} ({data.jenisAnestesi})</span></div>
            <div><span className="text-slate-500 font-bold block">Diagnosis Pra-Bedah:</span><span className="font-bold">{data.diagnosisPraBedah}</span></div>
            <div><span className="text-slate-500 font-bold block">Diagnosis Pasca-Bedah:</span><span className="font-bold">{data.diagnosisPascaBedah}</span></div>
          </div>
          <div><span className="font-bold text-slate-900">Temuan Intraoperatif:</span><p className="p-2 bg-slate-50 border border-slate-200 rounded mt-0.5">{data.temuanIntraoperatif}</p></div>
          <div><span className="font-bold text-slate-900">Uraian / Tahapan Pembedahan:</span><p className="p-2 bg-slate-50 border border-slate-200 rounded mt-0.5 whitespace-pre-line font-mono text-[11px]">{data.tahapanUraianPembedahan}</p></div>
          <div className="grid grid-cols-2 gap-2 text-slate-800">
            <div>Perdarahan: <strong>{data.jumlahPerdarahan}</strong></div>
            <div>Jaringan Dikirim ke Lab PA: <strong>{data.jaringanDikirimKePA ? 'Ya (Spesimen Terkirim)' : 'Tidak'}</strong></div>
          </div>
        </main>
        {renderFooter('Dokter Spesialis Bedah (Operator),', data.dokterOperator)}
      </div>
    );
  }

  // 18. REKONSILIASI OBAT & KPO
  if (document.type === 'rekonsiliasi_obat' && document.rekonsiliasiObatData) {
    const data = document.rekonsiliasiObatData;
    return (
      <div className="printable-hospital-doc bg-white text-slate-900 shadow-2xl mx-auto my-0 p-8 sm:p-12 relative overflow-hidden font-sans border border-slate-300" style={containerStyle}>
        {renderWatermark()}
        {renderHeader('FARMASI KLINIS', 'REKONSILIASI & PEMBERIAN OBAT (KPO)')}
        <div className="text-center my-3 border-b-2 border-slate-900 pb-2">
          <h2 className="text-base sm:text-lg font-black uppercase text-slate-950">{document.judulDokumen}</h2>
          <p className="text-xs font-semibold text-slate-600">Rekonsiliasi Admisi & Catatan Pemberian Obat Rawat Inap (KPO)</p>
        </div>
        {renderPatientInfo()}
        <main className="space-y-4 text-xs leading-relaxed">
          <div className="border border-slate-300 rounded overflow-hidden">
            <div className="bg-slate-100 p-2 font-bold text-slate-800 border-b border-slate-300 uppercase text-[11px]">1. Rekonsiliasi Obat dari Rumah</div>
            <table className="w-full text-xs text-left">
              <thead><tr className="border-b bg-slate-50"><th className="p-1.5">Nama Obat</th><th className="p-1.5">Dosis & Rute</th><th className="p-1.5">Tindak Lanjut DPJP</th></tr></thead>
              <tbody>{data.riwayatObatSebelumAdmisi.map((o, i) => (<tr key={i} className="border-b"><td className="p-1.5 font-bold">{o.namaObat}</td><td className="p-1.5">{o.dosis} ({o.aturanPakai})</td><td className="p-1.5">{o.tindakLanjut}</td></tr>))}</tbody>
            </table>
          </div>
          <div className="border border-slate-300 rounded overflow-hidden">
            <div className="bg-slate-100 p-2 font-bold text-slate-800 border-b border-slate-300 uppercase text-[11px]">2. Catatan Pemberian Obat (KPO) Rawat Inap</div>
            <table className="w-full text-xs text-left">
              <thead><tr className="border-b bg-slate-50"><th className="p-1.5">Nama Obat & Sediaan</th><th className="p-1.5">Dosis & Frekuensi</th><th className="p-1.5">Jadwal Jam</th><th className="p-1.5">Perawat & Status</th></tr></thead>
              <tbody>{data.catatanPemberianObatKPO.map((o, i) => (<tr key={i} className="border-b"><td className="p-1.5 font-bold">{o.namaObat}</td><td className="p-1.5">{o.dosisRute} ({o.frekuensi})</td><td className="p-1.5">{o.jamPemberian}</td><td className="p-1.5 font-semibold text-emerald-700">{o.status} ({o.perawatPelaksana})</td></tr>))}</tbody>
            </table>
          </div>
        </main>
        {renderFooter('Apoteker Farmasi Klinis,', data.apotekerKlinis)}
      </div>
    );
  }

  // 19. FLUID BALANCE
  if (document.type === 'fluid_balance' && document.fluidBalanceData) {
    const data = document.fluidBalanceData;
    return (
      <div className="printable-hospital-doc bg-white text-slate-900 shadow-2xl mx-auto my-0 p-8 sm:p-12 relative overflow-hidden font-sans border border-slate-300" style={containerStyle}>
        {renderWatermark()}
        {renderHeader('OBSERVASI KHUSUS', 'LEMBAR BALANS CAIRAN 24 JAM')}
        <div className="text-center my-3 border-b-2 border-slate-900 pb-2">
          <h2 className="text-base sm:text-lg font-black uppercase text-slate-950">{document.judulDokumen}</h2>
          <p className="text-xs font-semibold text-slate-600">Observasi: {data.tanggalObservasi} • {data.shift} • BB Pasien: {data.bbPasien} kg</p>
        </div>
        {renderPatientInfo()}
        <main className="space-y-4 text-xs leading-relaxed">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-blue-50/70 border border-blue-300 rounded space-y-1">
              <span className="font-bold text-blue-950 block border-b pb-1 text-[11px]">INTAKE CAIRAN:</span>
              <p>Oral / Enteral: <strong>{data.intake.oralEnteral} ml</strong></p>
              <p>Infus Parenteral: <strong>{data.intake.parenteralInfus} ml</strong></p>
              <p>Injeksi Obat & Transfusi: <strong>{data.intake.injeksiObat + data.intake.transfusi} ml</strong></p>
              <p className="border-t pt-1 font-black text-blue-900">Total Intake: {data.intake.totalIntake} ml</p>
            </div>
            <div className="p-3 bg-amber-50/70 border border-amber-300 rounded space-y-1">
              <span className="font-bold text-amber-950 block border-b pb-1 text-[11px]">OUTPUT CAIRAN:</span>
              <p>Urin (Diuresis): <strong>{data.output.urine} ml</strong></p>
              <p>Drain / Muntah / Feses: <strong>{data.output.drainStoma + data.output.muntahNGT + data.output.feses} ml</strong></p>
              <p>Insensible Water Loss (IWL): <strong>{data.output.iwl} ml</strong></p>
              <p className="border-t pt-1 font-black text-amber-900">Total Output: {data.output.totalOutput} ml</p>
            </div>
          </div>
          <div className="p-3 bg-slate-100 rounded flex justify-between items-center text-sm font-bold">
            <span>Balans Cairan 24 Jam: <strong className={data.balans24Jam >= 0 ? 'text-blue-900' : 'text-rose-900'}>{data.balans24Jam > 0 ? `+${data.balans24Jam}` : data.balans24Jam} ml</strong></span>
            <span className="text-xs text-slate-700">Diuresis: {data.diuresis}</span>
          </div>
        </main>
        {renderFooter('Perawat Penanggung Jawab Balans,', data.perawatPenanggungJawab)}
      </div>
    );
  }

  // 20. DISCHARGE PLANNING
  if (document.type === 'discharge_planning' && document.dischargePlanningData) {
    const data = document.dischargePlanningData;
    return (
      <div className="printable-hospital-doc bg-white text-slate-900 shadow-2xl mx-auto my-0 p-8 sm:p-12 relative overflow-hidden font-sans border border-slate-300" style={containerStyle}>
        {renderWatermark()}
        {renderHeader('RENCANA PEMULANGAN', 'DISCHARGE PLANNING TERINTEGRASI')}
        <div className="text-center my-3 border-b-2 border-slate-900 pb-2">
          <h2 className="text-base sm:text-lg font-black uppercase text-slate-950">{document.judulDokumen}</h2>
          <p className="text-xs font-semibold text-slate-600">Instruksi Rawat Mandiri di Rumah & Jadwal Kontrol Pasca Rawat Inap</p>
        </div>
        {renderPatientInfo()}
        <main className="space-y-4 text-xs leading-relaxed">
          <div className="p-3 bg-emerald-50 border border-emerald-300 rounded space-y-1">
            <span className="font-bold text-emerald-950 block">Kriteria Kesiapan Pulang:</span>
            <p>✓ Tanda vital stabil • ✓ Nyeri terkontrol • ✓ Dapat mobilisasi mandiri • ✓ Edukasi obat pulang telah diberikan.</p>
          </div>
          <div><span className="font-bold text-slate-900">Instruksi Perawatan di Rumah:</span><p className="p-2 bg-slate-50 border border-slate-200 rounded mt-0.5">{data.instruksiPerawatanRumah}</p></div>
          <div className="border border-slate-300 rounded overflow-hidden">
            <div className="bg-slate-100 p-2 font-bold text-slate-800 border-b border-slate-300 uppercase text-[11px]">Resep Obat Pulang</div>
            <table className="w-full text-xs text-left">
              <thead><tr className="border-b bg-slate-50"><th className="p-1.5">Nama Obat</th><th className="p-1.5">Aturan Pakai</th><th className="p-1.5">Keterangan</th></tr></thead>
              <tbody>{data.obatPulang.map((o, i) => (<tr key={i} className="border-b"><td className="p-1.5 font-bold">{o.nama}</td><td className="p-1.5">{o.aturan}</td><td className="p-1.5">{o.keterangan}</td></tr>))}</tbody>
            </table>
          </div>
          <div className="p-2.5 bg-rose-50 border border-rose-200 rounded text-rose-950"><span className="font-bold block">Tanda Bahaya (Segera ke IGD):</span>{data.tandaBahayaEmergency}</div>
          <div className="p-2.5 bg-blue-50 border border-blue-200 rounded text-blue-950 font-bold">Jadwal Kontrol: {data.jadwalKontrolPoli}</div>
        </main>
        {renderFooter('Dokter Penanggung Jawab Pelayanan,', data.dokterDPJP)}
      </div>
    );
  }

  // 21. TRANSFER PASIEN (SBAR)
  if (document.type === 'transfer_pasien' && document.transferPasienData) {
    const data = document.transferPasienData;
    return (
      <div className="printable-hospital-doc bg-white text-slate-900 shadow-2xl mx-auto my-0 p-8 sm:p-12 relative overflow-hidden font-sans border border-slate-300" style={containerStyle}>
        {renderWatermark()}
        {renderHeader('PELAYANAN TRANSFER', 'FORMULIR TRANSFER PASIEN (SBAR)')}
        <div className="text-center my-3 border-b-2 border-slate-900 pb-2">
          <h2 className="text-base sm:text-lg font-black uppercase text-slate-950">{document.judulDokumen}</h2>
          <p className="text-xs font-semibold text-slate-600">{data.jenisTransfer} • Dari: {data.unitAsal} ➔ Ke: {data.unitTujuan}</p>
        </div>
        {renderPatientInfo()}
        <main className="space-y-4 text-xs leading-relaxed">
          <div className="border border-slate-300 rounded p-3 bg-white space-y-2">
            <span className="font-bold text-slate-900 uppercase block border-b pb-1">Metode Serah Terima Klinis (SBAR):</span>
            <p><strong>S (Situation):</strong> {data.sbar.situation}</p>
            <p><strong>B (Background):</strong> {data.sbar.background}</p>
            <p><strong>A (Assessment):</strong> {data.sbar.assessment}</p>
            <p><strong>R (Recommendation):</strong> {data.sbar.recommendation}</p>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded grid grid-cols-2 gap-2">
            <div><span className="font-bold text-slate-800 block">Tanda Vital Saat Pindah:</span>TD: {data.tandaVitalSaatPindah.td} | Nadi: {data.tandaVitalSaatPindah.nadi} | SpO2: {data.tandaVitalSaatPindah.spo2}</div>
            <div><span className="font-bold text-slate-800 block">Alat Terpasang:</span>{data.alatMedisTerpasang.join(', ')}</div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-center pt-2">
            <div className="p-2 border border-slate-200 rounded">
              <span className="text-[10px] text-slate-500 block uppercase">Petugas Pengantar</span>
              <p className="font-bold mt-8 border-b pb-1">{data.petugasPengantar}</p>
            </div>
            <div className="p-2 border border-slate-200 rounded">
              <span className="text-[10px] text-slate-500 block uppercase">Petugas Penerima</span>
              <p className="font-bold mt-8 border-b pb-1">{data.petugasPenerima}</p>
            </div>
          </div>
        </main>
        {renderFooter('Petugas Pengantar Transfer,', data.petugasPengantar)}
      </div>
    );
  }

  return null;
}
