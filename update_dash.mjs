import fs from 'fs';
let content = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

const oldDiseaseData = `const diseaseTrendData = [
  { name: 'Hypertension', cases: 120 },
  { name: 'Diabetes', cases: 85 },
  { name: 'URI', cases: 65 },
  { name: 'Asthma', cases: 40 },
];`;

const newDiseaseData = `const diseaseTrendData = [
  { name: 'ISPA', cases: 1450 },
  { name: 'Hipertensi', cases: 1200 },
  { name: 'Diabetes', cases: 950 },
  { name: 'TBC', cases: 850 },
  { name: 'Dengue', cases: 620 },
  { name: 'Stroke', cases: 410 },
];`;

content = content.replace(oldDiseaseData, newDiseaseData);

const newsSection = `
      {/* 2026 Health News Dashboard */}
      <motion.div variants={itemVariants} className="glass-panel p-6 mt-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Indonesia Health Updates 2026</h3>
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Latest National Medical News & Directives</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              title: 'Integrasi Rekam Medis Elektronik (RME) Nasional Mencapai 98%',
              date: '24 Jul 2026',
              source: 'Kemenkes RI',
              summary: 'Seluruh fasilitas kesehatan tingkat pertama dan lanjutan kini terhubung dengan platform SATUSEHAT, mempermudah rujukan lintas provinsi.',
              tag: 'Technology'
            },
            {
              title: 'Vaksinasi Demam Berdarah Dengue (DBD) Jadi Program Nasional Gratis',
              date: '20 Jul 2026',
              source: 'Ditjen P2P',
              summary: 'Merespon siklus lima tahunan, pemerintah menetapkan vaksinasi DBD sebagai imunisasi rutin untuk anak usia sekolah dasar.',
              tag: 'Public Health'
            },
            {
              title: 'Penurunan Signifikan Kasus Stunting ke Angka 8.5%',
              date: '15 Jul 2026',
              source: 'BKKBN',
              summary: 'Program intervensi gizi spesifik sejak 2021 berhasil menekan angka stunting nasional di bawah target SDGs.',
              tag: 'Pediatrics'
            },
            {
              title: 'Penerapan AI dalam Deteksi Dini TBC Meningkatkan Kesembuhan 40%',
              date: '10 Jul 2026',
              source: 'IDI',
              summary: 'Penggunaan kecerdasan buatan pada pembacaan foto toraks rontgen di puskesmas mempercepat penanganan kasus tuberkulosis paru.',
              tag: 'Innovation'
            }
          ].map((news, i) => (
            <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary-emerald">{news.tag}</span>
                <span className="text-[10px] text-white/40">{news.date}</span>
              </div>
              <h4 className="text-sm font-bold text-white mb-2 leading-snug">{news.title}</h4>
              <p className="text-xs text-white/60 mb-4 line-clamp-3">{news.summary}</p>
              <div className="text-[10px] text-white/40 font-semibold">Sumber: {news.source}</div>
            </div>
          ))}
        </div>
      </motion.div>
`;

content = content.replace("      </div>\n    </motion.div>", "      </div>\n" + newsSection + "\n    </motion.div>");

fs.writeFileSync('src/components/Dashboard.tsx', content);
