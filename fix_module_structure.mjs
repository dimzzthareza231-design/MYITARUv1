import fs from 'fs';
import path from 'path';

// ═══════════════════════════════════════════
// LANGKAH 1: Fix moduleRegistry
// ═══════════════════════════════════════════
const registryPath = path.join(process.cwd(), 'src', 'data', 'moduleRegistry.ts');
let registryExists = fs.existsSync(registryPath);
let registryFile = registryPath;

if (!registryExists) {
  registryFile = registryPath.replace('.ts', '.js');
  registryExists = fs.existsSync(registryFile);
}

if (!registryExists) {
  console.error('❌ File moduleRegistry tidak ditemukan!');
  process.exit(1);
}

let content = fs.readFileSync(registryFile, 'utf8');

// Hapus medical records / master-data dari kategori manapun jika ada
// Pattern: module dengan id 'master-data' atau label mengandung 'Rekam Medis' atau 'Medical'
content = content.replace(/\{\s*id:\s*['"]master-data['"][\s\S]*?submenus:\s*\[[\s\S]*?\]\s*\}\s*,?/g, '');
content = content.replace(/\{\s*id:\s*['"]rekam-medis['"][\s\S]*?submenus:\s*\[[\s\S]*?\]\s*\}\s*,?/g, '');

// Cari kategori Pelayanan dan tambahkan modul Rekam Medis di dalamnya
const pelayananRegex = /(\{\s*id:\s*['"]pelayanan['"][\s\S]*?modules:\s*\[)/;
const pelayananMatch = content.match(pelayananRegex);

const rmeModule = `
    {
      id: 'rekam-medis',
      label: 'Rekam Medis (RME)',
      icon: '📋',
      color: 'from-blue-500 to-indigo-600',
      submenus: ['Daftar Pasien', 'ICD-10 Diagnosis', 'ICD-9 Tindakan', 'Resume Medis']
    },`;

if (pelayananMatch) {
  content = content.replace(pelayananRegex, '$1' + rmeModule);
  console.log('✅ Modul Rekam Medis ditambahkan ke kategori Pelayanan');
} else {
  // Jika tidak ada kategori 'pelayanan', coba cari berdasarkan label
  const pelayananLabelRegex = /(\{\s*id:\s*['"][^'"]*['"]\s*,\s*label:\s*['"]Pelayanan['"][\s\S]*?modules:\s*\[)/;
  const pelayananLabelMatch = content.match(pelayananLabelRegex);
  if (pelayananLabelMatch) {
    content = content.replace(pelayananLabelRegex, '$1' + rmeModule);
    console.log('✅ Modul Rekam Medis ditambahkan ke kategori Pelayanan (via label)');
  } else {
    console.log('⚠️ Kategori Pelayanan tidak ditemukan, menambahkan modul di awal registry');
    content = content.replace(/(MODULE_REGISTRY\s*=\s*\[)/, '$1\n  {\n    id: "pelayanan",\n    label: "Pelayanan",\n    icon: "🏥",\n    navColor: "hover:text-cyan-400",\n    modules: [' + rmeModule + '\n    ]\n  },');
  }
}

// Bersihkan koma ganda
content = content.replace(/,\s*,/g, ',');
content = content.replace(/\[\s*,/g, '[');
content = content.replace(/,\s*\]/g, '\n  ]');

fs.writeFileSync(registryFile, content);
console.log('✅ moduleRegistry berhasil diupdate');

// ═══════════════════════════════════════════
// LANGKAH 2: Fix App.tsx route
// ═══════════════════════════════════════════
const appPath = path.join(process.cwd(), 'src', 'App.tsx');
let appContent = fs.readFileSync(appPath, 'utf8');

// Hapus route master-data yang mengarah ke MedicalRecords
appContent = appContent.replace(/<Route\s+path="master-data"\s+element=\{<ErrorBoundary><MedicalRecords\s*\/><\/ErrorBoundary>\}\s*\/>/g, '');
appContent = appContent.replace(/<Route\s+path="master-data"\s+element=\{<MedicalRecords\s*\/>\}\s*\/>/g, '');

// Tambahkan route baru untuk rekam-medis jika belum ada
if (!appContent.includes('path="rekam-medis"')) {
  // Cari route pendaftaran sebagai anchor
  const anchor = appContent.match(/(<Route\s+path="pendaftaran"[\s\S]*?\/>)/);
  if (anchor) {
    appContent = appContent.replace(
      anchor[0],
      anchor[0] + '\n              <Route path="rekam-medis" element={<ErrorBoundary><MedicalRecords /></ErrorBoundary>} />'
    );
    console.log('✅ Route rekam-medis ditambahkan ke App.tsx');
  } else {
    // Fallback: cari route igd
    const anchor2 = appContent.match(/(<Route\s+path="igd"[\s\S]*?\/>)/);
    if (anchor2) {
      appContent = appContent.replace(
        anchor2[0],
        anchor2[0] + '\n              <Route path="rekam-medis" element={<ErrorBoundary><MedicalRecords /></ErrorBoundary>} />'
      );
      console.log('✅ Route rekam-medis ditambahkan ke App.tsx (via igd anchor)');
    }
  }
}

fs.writeFileSync(appPath, appContent);
console.log('✅ App.tsx berhasil diupdate');

// ═══════════════════════════════════════════
// LANGKAH 3: Verifikasi
// ═══════════════════════════════════════════
const finalRegistry = fs.readFileSync(registryFile, 'utf8');
const hasRME = finalRegistry.includes('rekam-medis');
const hasMasterData = finalRegistry.includes("'master-data'") && finalRegistry.includes('MedicalRecords');

console.log('\n📋 Hasil Verifikasi:');
console.log(`   • Modul RME di Pelayanan: ${hasRME ? '✅ YA' : '❌ TIDAK'}`);
console.log(`   • Master Data masih ada RME: ${hasMasterData ? '❌ MASIH (perlu fix manual)' : '✅ SUDAH DIPINDAH'}`);
console.log('\n🎉 Selesai! Refresh browser untuk melihat perubahan.');
