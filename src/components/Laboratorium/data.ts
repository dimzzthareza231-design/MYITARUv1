import { 
  LabCatalogTest, AnalyzerMachine, LeveyJenningsPoint, 
  BloodBankStock, CrossmatchOrder, LabOrder, LabParameterResult
} from './types';

// ==========================================
// 1. MASTER KATALOG PEMERIKSAAN LABORATORIUM
// ==========================================
export const KATALOG_LAB_MASTER: LabCatalogTest[] = [
  {
    kode: 'LAB-HEM-01',
    loinc_code: '58410-2',
    nama_pemeriksaan: 'Hematologi Lengkap (CBC + Diff)',
    kategori: 'Hematologi',
    spesimen: 'Darah Vena (Whole Blood)',
    wadah: 'Tabung EDTA (Ungu)',
    volume_min: '2.0 mL',
    metode: 'Automated Flow Cytometry & Impedance',
    hari_kerja: 'Setiap Hari (24 Jam)',
    waktu_selesai_menit: 45,
    tarif_umum: 95000,
    tarif_bpjs: 85000,
    puasa_info: 'Tidak perlu puasa khusus',
    nilai_rujukan_dewasa_l: 'Hb: 13.5-17.5 g/dL, Leukosit: 4.5-11.0 10^3/uL',
    nilai_rujukan_dewasa_p: 'Hb: 12.0-15.5 g/dL, Leukosit: 4.5-11.0 10^3/uL',
    nilai_rujukan_anak: 'Hb: 11.0-14.5 g/dL, Leukosit: 5.0-14.5 10^3/uL',
    satuan: 'Multivariat',
    default_parameters: [
      { param_code: 'HB', param_name: 'Hemoglobin (Hb)', satuan: 'g/dL', ref_male: '13.5 - 17.5', ref_female: '12.0 - 15.5', ref_child: '11.0 - 14.5', metode: 'Cyanmethemoglobin / SLS', critical_low: 7.0, critical_high: 20.0 },
      { param_code: 'LEU', param_name: 'Leukosit (WBC)', satuan: '10^3/uL', ref_male: '4.5 - 11.0', ref_female: '4.5 - 11.0', ref_child: '5.0 - 14.5', metode: 'Flow Cytometry', critical_low: 2.0, critical_high: 30.0 },
      { param_code: 'PLT', param_name: 'Trombosit (PLT)', satuan: '10^3/uL', ref_male: '150 - 450', ref_female: '150 - 450', ref_child: '150 - 450', metode: 'Electrical Impedance', critical_low: 50, critical_high: 1000 },
      { param_code: 'HT', param_name: 'Hematokrit (Ht)', satuan: '%', ref_male: '40.0 - 52.0', ref_female: '36.0 - 48.0', ref_child: '33.0 - 43.0', metode: 'Cumulative Pulse Height Detection', critical_low: 20.0, critical_high: 60.0 },
      { param_code: 'RBC', param_name: 'Eritrosit (RBC)', satuan: '10^6/uL', ref_male: '4.5 - 5.9', ref_female: '4.0 - 5.2', ref_child: '3.8 - 5.0', metode: 'Electrical Impedance' },
      { param_code: 'MCV', param_name: 'MCV', satuan: 'fL', ref_male: '80.0 - 96.0', ref_female: '80.0 - 96.0', ref_child: '76.0 - 90.0', metode: 'Kalkulasi Ht/RBC' },
      { param_code: 'MCH', param_name: 'MCH', satuan: 'pg', ref_male: '27.0 - 32.0', ref_female: '27.0 - 32.0', ref_child: '25.0 - 31.0', metode: 'Kalkulasi Hb/RBC' },
      { param_code: 'MCHC', param_name: 'MCHC', satuan: 'g/dL', ref_male: '32.0 - 36.0', ref_female: '32.0 - 36.0', ref_child: '32.0 - 36.0', metode: 'Kalkulasi Hb/Ht' },
      { param_code: 'NEU', param_name: 'Neutrofil Segmen', satuan: '%', ref_male: '50.0 - 70.0', ref_female: '50.0 - 70.0', ref_child: '40.0 - 60.0', metode: 'Flow Cytometry' },
      { param_code: 'LYM', param_name: 'Limfosit', satuan: '%', ref_male: '20.0 - 40.0', ref_female: '20.0 - 40.0', ref_child: '30.0 - 50.0', metode: 'Flow Cytometry' },
      { param_code: 'MON', param_name: 'Monosit', satuan: '%', ref_male: '2.0 - 8.0', ref_female: '2.0 - 8.0', ref_child: '2.0 - 8.0', metode: 'Flow Cytometry' },
      { param_code: 'EOS', param_name: 'Eosinofil', satuan: '%', ref_male: '1.0 - 4.0', ref_female: '1.0 - 4.0', ref_child: '1.0 - 4.0', metode: 'Flow Cytometry' },
      { param_code: 'BAS', param_name: 'Basofil', satuan: '%', ref_male: '0.0 - 1.0', ref_female: '0.0 - 1.0', ref_child: '0.0 - 1.0', metode: 'Flow Cytometry' }
    ]
  },
  {
    kode: 'LAB-HEM-02',
    loinc_code: '30341-2',
    nama_pemeriksaan: 'Laju Endap Darah (LED / ESR)',
    kategori: 'Hematologi',
    spesimen: 'Darah Citrate / EDTA',
    wadah: 'Tabung Citrate (Biru)',
    volume_min: '1.5 mL',
    metode: 'Westergren Automated Optic',
    hari_kerja: 'Setiap Hari',
    waktu_selesai_menit: 60,
    tarif_umum: 45000,
    tarif_bpjs: 40000,
    puasa_info: 'Tidak perlu puasa',
    nilai_rujukan_dewasa_l: '0 - 15 mm/jam',
    nilai_rujukan_dewasa_p: '0 - 20 mm/jam',
    nilai_rujukan_anak: '0 - 10 mm/jam',
    satuan: 'mm/jam',
    default_parameters: [
      { param_code: 'LED', param_name: 'Laju Endap Darah (LED)', satuan: 'mm/jam', ref_male: '0 - 15', ref_female: '0 - 20', ref_child: '0 - 10', metode: 'Westergren Otomatis' }
    ]
  },
  {
    kode: 'LAB-HEM-03',
    loinc_code: '883-9',
    nama_pemeriksaan: 'Golongan Darah & Rhesus (ABO & Rh)',
    kategori: 'Hematologi',
    spesimen: 'Darah EDTA / Whole Blood',
    wadah: 'Tabung EDTA (Ungu)',
    volume_min: '1.0 mL',
    metode: 'Gel Test Card / Aglutinasi Slide',
    hari_kerja: 'Setiap Hari (24 Jam)',
    waktu_selesai_menit: 20,
    tarif_umum: 40000,
    tarif_bpjs: 35000,
    puasa_info: 'Tidak perlu puasa',
    nilai_rujukan_dewasa_l: 'A / B / AB / O (Rh Positif)',
    nilai_rujukan_dewasa_p: 'A / B / AB / O (Rh Positif)',
    nilai_rujukan_anak: 'A / B / AB / O (Rh Positif)',
    satuan: 'Kualitatif',
    default_parameters: [
      { param_code: 'ABO', param_name: 'Golongan Darah ABO', satuan: '-', ref_male: 'A / B / AB / O', ref_female: 'A / B / AB / O', ref_child: 'A / B / AB / O', metode: 'Aglutinasi Card Test' },
      { param_code: 'RH', param_name: 'Faktor Rhesus (D)', satuan: '-', ref_male: 'Positif (+)', ref_female: 'Positif (+)', ref_child: 'Positif (+)', metode: 'Aglutinasi Anti-D' }
    ]
  },
  {
    kode: 'LAB-KIM-01',
    loinc_code: '2345-7',
    nama_pemeriksaan: 'Glukosa Darah Sewaktu (GDS)',
    kategori: 'Kimia Klinik',
    spesimen: 'Serum / Plasma Fluoride',
    wadah: 'Tabung Serum Gel (Kuning)',
    volume_min: '1.0 mL',
    metode: 'Hexokinase / GOD-PAP Enzymatic',
    hari_kerja: 'Setiap Hari (24 Jam)',
    waktu_selesai_menit: 30,
    tarif_umum: 40000,
    tarif_bpjs: 35000,
    puasa_info: 'Tanpa puasa',
    nilai_rujukan_dewasa_l: '70 - 140 mg/dL',
    nilai_rujukan_dewasa_p: '70 - 140 mg/dL',
    nilai_rujukan_anak: '70 - 120 mg/dL',
    satuan: 'mg/dL',
    default_parameters: [
      { param_code: 'GDS', param_name: 'Glukosa Darah Sewaktu (GDS)', satuan: 'mg/dL', ref_male: '70 - 140', ref_female: '70 - 140', ref_child: '70 - 120', metode: 'GOD-PAP', critical_low: 45, critical_high: 450 }
    ]
  },
  {
    kode: 'LAB-KIM-02',
    loinc_code: '4548-4',
    nama_pemeriksaan: 'HbA1c (Glycated Hemoglobin)',
    kategori: 'Kimia Klinik',
    spesimen: 'Darah EDTA',
    wadah: 'Tabung EDTA (Ungu)',
    volume_min: '2.0 mL',
    metode: 'HPLC (High Performance Liquid Chromatography)',
    hari_kerja: 'Setiap Hari',
    waktu_selesai_menit: 60,
    tarif_umum: 165000,
    tarif_bpjs: 150000,
    puasa_info: 'Tidak perlu puasa',
    nilai_rujukan_dewasa_l: '< 5.7 % (Normal), 5.7-6.4% (Prediabetes), >= 6.5% (Diabetes)',
    nilai_rujukan_dewasa_p: '< 5.7 % (Normal), 5.7-6.4% (Prediabetes), >= 6.5% (Diabetes)',
    nilai_rujukan_anak: '< 5.7 %',
    satuan: '%',
    default_parameters: [
      { param_code: 'HBA1C', param_name: 'Hemoglobin A1c (HbA1c)', satuan: '%', ref_male: '< 5.7', ref_female: '< 5.7', ref_child: '< 5.7', metode: 'HPLC NGSP Certified', critical_high: 14.0 }
    ]
  },
  {
    kode: 'LAB-KIM-03',
    loinc_code: '2093-3',
    nama_pemeriksaan: 'Profil Lipid Lengkap',
    kategori: 'Kimia Klinik',
    spesimen: 'Serum',
    wadah: 'Tabung Serum Gel (Kuning)',
    volume_min: '2.0 mL',
    metode: 'Enzymatic Colorimetric Homogeneous',
    hari_kerja: 'Setiap Hari',
    waktu_selesai_menit: 60,
    tarif_umum: 175000,
    tarif_bpjs: 155000,
    puasa_info: 'Puasa 10-12 jam sebelum pengambilan darah',
    nilai_rujukan_dewasa_l: 'Kolesterol: < 200, HDL: > 40, LDL: < 100, TG: < 150 mg/dL',
    nilai_rujukan_dewasa_p: 'Kolesterol: < 200, HDL: > 50, LDL: < 100, TG: < 150 mg/dL',
    nilai_rujukan_anak: 'Kolesterol: < 170, HDL: > 45, LDL: < 110, TG: < 100 mg/dL',
    satuan: 'mg/dL',
    default_parameters: [
      { param_code: 'CHOL', param_name: 'Kolesterol Total', satuan: 'mg/dL', ref_male: '< 200', ref_female: '< 200', ref_child: '< 170', metode: 'CHOD-PAP' },
      { param_code: 'HDL', param_name: 'Kolesterol HDL', satuan: 'mg/dL', ref_male: '> 40', ref_female: '> 50', ref_child: '> 45', metode: 'Direct Clearance' },
      { param_code: 'LDL', param_name: 'Kolesterol LDL (Direct)', satuan: 'mg/dL', ref_male: '< 100', ref_female: '< 100', ref_child: '< 110', metode: 'Direct Clearance' },
      { param_code: 'TRIG', param_name: 'Trigliserida', satuan: 'mg/dL', ref_male: '< 150', ref_female: '< 150', ref_child: '< 100', metode: 'GPO-PAP' }
    ]
  },
  {
    kode: 'LAB-KIM-04',
    loinc_code: '2160-0',
    nama_pemeriksaan: 'Fungsi Ginjal (Ureum, Kreatinin & Asam Urat)',
    kategori: 'Kimia Klinik',
    spesimen: 'Serum',
    wadah: 'Tabung Serum Gel (Kuning)',
    volume_min: '2.0 mL',
    metode: 'Jaffe / Enzymatic IDMS-Traceable',
    hari_kerja: 'Setiap Hari (24 Jam)',
    waktu_selesai_menit: 45,
    tarif_umum: 125000,
    tarif_bpjs: 110000,
    puasa_info: 'Tidak perlu puasa khusus',
    nilai_rujukan_dewasa_l: 'Ureum: 15-45 mg/dL, Kreatinin: 0.7-1.3 mg/dL, eGFR: > 90, Asam Urat: 3.5-7.2 mg/dL',
    nilai_rujukan_dewasa_p: 'Ureum: 15-40 mg/dL, Kreatinin: 0.6-1.1 mg/dL, eGFR: > 90, Asam Urat: 2.6-6.0 mg/dL',
    nilai_rujukan_anak: 'Ureum: 10-36 mg/dL, Kreatinin: 0.3-0.7 mg/dL',
    satuan: 'mg/dL',
    default_parameters: [
      { param_code: 'UREUM', param_name: 'Ureum (BUN)', satuan: 'mg/dL', ref_male: '15.0 - 45.0', ref_female: '15.0 - 40.0', ref_child: '10.0 - 36.0', metode: 'Urease GLDH', critical_high: 100.0 },
      { param_code: 'CREAT', param_name: 'Kreatinin Serum', satuan: 'mg/dL', ref_male: '0.70 - 1.30', ref_female: '0.60 - 1.10', ref_child: '0.30 - 0.70', metode: 'Enzymatic IDMS', critical_high: 5.0 },
      { param_code: 'EGFR', param_name: 'eGFR (CKD-EPI 2021)', satuan: 'mL/min/1.73m²', ref_male: '> 90', ref_female: '> 90', ref_child: '> 90', metode: 'Kalkulasi CKD-EPI' },
      { param_code: 'URIC', param_name: 'Asam Urat (Uric Acid)', satuan: 'mg/dL', ref_male: '3.5 - 7.2', ref_female: '2.6 - 6.0', ref_child: '2.0 - 5.5', metode: 'Uricase PAP' }
    ]
  },
  {
    kode: 'LAB-KIM-05',
    loinc_code: '1920-8',
    nama_pemeriksaan: 'Fungsi Hati (SGOT, SGPT & Bilirubin)',
    kategori: 'Kimia Klinik',
    spesimen: 'Serum',
    wadah: 'Tabung Serum Gel (Kuning)',
    volume_min: '2.0 mL',
    metode: 'IFCC UV with Pyridoxal Phosphate',
    hari_kerja: 'Setiap Hari (24 Jam)',
    waktu_selesai_menit: 45,
    tarif_umum: 145000,
    tarif_bpjs: 130000,
    puasa_info: 'Tidak perlu puasa khusus',
    nilai_rujukan_dewasa_l: 'SGOT: < 40 U/L, SGPT: < 41 U/L, Bilirubin Total: 0.2-1.2 mg/dL',
    nilai_rujukan_dewasa_p: 'SGOT: < 32 U/L, SGPT: < 33 U/L, Bilirubin Total: 0.2-1.2 mg/dL',
    nilai_rujukan_anak: 'SGOT: < 45 U/L, SGPT: < 35 U/L',
    satuan: 'U/L & mg/dL',
    default_parameters: [
      { param_code: 'SGOT', param_name: 'SGOT / AST', satuan: 'U/L', ref_male: '< 40', ref_female: '< 32', ref_child: '< 45', metode: 'IFCC 37°C', critical_high: 500 },
      { param_code: 'SGPT', param_name: 'SGPT / ALT', satuan: 'U/L', ref_male: '< 41', ref_female: '< 33', ref_child: '< 35', metode: 'IFCC 37°C', critical_high: 500 },
      { param_code: 'BILI_TOT', param_name: 'Bilirubin Total', satuan: 'mg/dL', ref_male: '0.20 - 1.20', ref_female: '0.20 - 1.20', ref_child: '0.20 - 1.00', metode: 'Diazo DPD', critical_high: 15.0 },
      { param_code: 'BILI_DIR', param_name: 'Bilirubin Direk', satuan: 'mg/dL', ref_male: '< 0.30', ref_female: '< 0.30', ref_child: '< 0.30', metode: 'Diazo DPD' },
      { param_code: 'ALBUMIN', param_name: 'Albumin Serum', satuan: 'g/dL', ref_male: '3.5 - 5.2', ref_female: '3.5 - 5.2', ref_child: '3.8 - 5.4', metode: 'BCG (Bromocresol Green)', critical_low: 2.0 }
    ]
  },
  {
    kode: 'LAB-ELE-01',
    loinc_code: '2951-2',
    nama_pemeriksaan: 'Elektrolit Serum (Na, K, Cl)',
    kategori: 'Elektrolit & Gas Darah',
    spesimen: 'Serum / Darah Heparin',
    wadah: 'Tabung Serum Gel (Kuning)',
    volume_min: '1.5 mL',
    metode: 'ISE (Ion Selective Electrode) Direct',
    hari_kerja: 'Setiap Hari (24 Jam)',
    waktu_selesai_menit: 30,
    tarif_umum: 135000,
    tarif_bpjs: 120000,
    puasa_info: 'Tidak perlu puasa',
    nilai_rujukan_dewasa_l: 'Na: 135-147, K: 3.5-5.0, Cl: 95-105 mmol/L',
    nilai_rujukan_dewasa_p: 'Na: 135-147, K: 3.5-5.0, Cl: 95-105 mmol/L',
    nilai_rujukan_anak: 'Na: 135-145, K: 3.6-5.2, Cl: 96-106 mmol/L',
    satuan: 'mmol/L',
    default_parameters: [
      { param_code: 'NA', param_name: 'Natrium (Na)', satuan: 'mmol/L', ref_male: '135.0 - 147.0', ref_female: '135.0 - 147.0', ref_child: '135.0 - 145.0', metode: 'ISE Direct', critical_low: 120.0, critical_high: 160.0 },
      { param_code: 'K', param_name: 'Kalium (K)', satuan: 'mmol/L', ref_male: '3.50 - 5.00', ref_female: '3.50 - 5.00', ref_child: '3.60 - 5.20', metode: 'ISE Direct', critical_low: 2.80, critical_high: 6.50 },
      { param_code: 'CL', param_name: 'Klorida (Cl)', satuan: 'mmol/L', ref_male: '95.0 - 105.0', ref_female: '95.0 - 105.0', ref_child: '96.0 - 106.0', metode: 'ISE Direct', critical_low: 80.0, critical_high: 125.0 }
    ]
  },
  {
    kode: 'LAB-ELE-02',
    loinc_code: '24338-6',
    nama_pemeriksaan: 'Analisa Gas Darah (AGD / BGA)',
    kategori: 'Elektrolit & Gas Darah',
    spesimen: 'Darah Arteri Heparin',
    wadah: 'Tabung Heparin (Hijau)',
    volume_min: '1.0 mL Syringe Heparin',
    metode: 'Amperometric & Potentiometric Electrodes',
    hari_kerja: 'Setiap Hari (24 Jam Cito)',
    waktu_selesai_menit: 20,
    tarif_umum: 220000,
    tarif_bpjs: 195000,
    puasa_info: 'Cito tanpa puasa (Bebas udara)',
    nilai_rujukan_dewasa_l: 'pH: 7.35-7.45, pCO2: 35-45 mmHg, pO2: 80-100 mmHg, HCO3: 22-26 mEq/L, SO2: 95-99%',
    nilai_rujukan_dewasa_p: 'pH: 7.35-7.45, pCO2: 35-45 mmHg, pO2: 80-100 mmHg, HCO3: 22-26 mEq/L, SO2: 95-99%',
    nilai_rujukan_anak: 'pH: 7.35-7.45, pCO2: 35-45 mmHg',
    satuan: 'Multivariat',
    default_parameters: [
      { param_code: 'PH', param_name: 'pH Arteri', satuan: '-', ref_male: '7.350 - 7.450', ref_female: '7.350 - 7.450', ref_child: '7.350 - 7.450', metode: 'Potentiometric', critical_low: 7.200, critical_high: 7.600 },
      { param_code: 'PCO2', param_name: 'pCO2', satuan: 'mmHg', ref_male: '35.0 - 45.0', ref_female: '35.0 - 45.0', ref_child: '35.0 - 45.0', metode: 'Severinghaus Electrode', critical_low: 20.0, critical_high: 70.0 },
      { param_code: 'PO2', param_name: 'pO2', satuan: 'mmHg', ref_male: '80.0 - 100.0', ref_female: '80.0 - 100.0', ref_child: '80.0 - 100.0', metode: 'Clark Electrode', critical_low: 50.0 },
      { param_code: 'HCO3', param_name: 'HCO3 (Aktual)', satuan: 'mmol/L', ref_male: '22.0 - 26.0', ref_female: '22.0 - 26.0', ref_child: '22.0 - 26.0', metode: 'Kalkulasi Henderson-Hasselbalch', critical_low: 10.0, critical_high: 40.0 },
      { param_code: 'BE', param_name: 'Base Excess (BE)', satuan: 'mmol/L', ref_male: '-2.0 - +2.0', ref_female: '-2.0 - +2.0', ref_child: '-2.0 - +2.0', metode: 'Kalkulasi Siggaard-Andersen' },
      { param_code: 'SO2', param_name: 'Saturasi O2 (sO2)', satuan: '%', ref_male: '95.0 - 99.0', ref_female: '95.0 - 99.0', ref_child: '95.0 - 99.0', metode: 'Oximetry Kalkulasi', critical_low: 85.0 }
    ]
  },
  {
    kode: 'LAB-URI-01',
    loinc_code: '24357-6',
    nama_pemeriksaan: 'Urinalisis Lengkap (Urine Rutin & Sedimen)',
    kategori: 'Urinalisis & Feses',
    spesimen: 'Urine Pagi / Sewaktu (Midstream)',
    wadah: 'Pot Urine Steril',
    volume_min: '15.0 mL',
    metode: 'Dry Chemistry Reflectance & Flow Imaging Sedimen',
    hari_kerja: 'Setiap Hari (24 Jam)',
    waktu_selesai_menit: 35,
    tarif_umum: 65000,
    tarif_bpjs: 55000,
    puasa_info: 'Urine porsi tengah (midstream)',
    nilai_rujukan_dewasa_l: 'Kuning jernih, pH: 5.0-7.5, Protein (-), Glukosa (-), Leukosit: 0-3/LPB, Eritrosit: 0-1/LPB',
    nilai_rujukan_dewasa_p: 'Kuning jernih, pH: 5.0-7.5, Protein (-), Glukosa (-), Leukosit: 0-5/LPB, Eritrosit: 0-1/LPB',
    nilai_rujukan_anak: 'Kuning jernih, Sedimen normal',
    satuan: 'Multivariat',
    default_parameters: [
      { param_code: 'WARNA', param_name: 'Warna Urine', satuan: '-', ref_male: 'Kuning Muda - Tua', ref_female: 'Kuning Muda - Tua', ref_child: 'Kuning Muda', metode: 'Visual / Sensor Optik' },
      { param_code: 'KEJERNIHAN', param_name: 'Kejernihan', satuan: '-', ref_male: 'Jernih', ref_female: 'Jernih', ref_child: 'Jernih', metode: 'Visual' },
      { param_code: 'BJ', param_name: 'Berat Jenis (BJ)', satuan: '-', ref_male: '1.005 - 1.030', ref_female: '1.005 - 1.030', ref_child: '1.005 - 1.025', metode: 'Refractometer' },
      { param_code: 'PH_U', param_name: 'pH Urine', satuan: '-', ref_male: '5.0 - 7.5', ref_female: '5.0 - 7.5', ref_child: '5.0 - 7.0', metode: 'Test Strip Reagent' },
      { param_code: 'PROT_U', param_name: 'Protein Urine', satuan: '-', ref_male: 'Negatif (-)', ref_female: 'Negatif (-)', ref_child: 'Negatif (-)', metode: 'Colorimetric Strip' },
      { param_code: 'GLU_U', param_name: 'Glukosa Urine', satuan: '-', ref_male: 'Negatif (-)', ref_female: 'Negatif (-)', ref_child: 'Negatif (-)', metode: 'Enzymatic Strip' },
      { param_code: 'LEU_EST', param_name: 'Leukosit Esterase', satuan: '-', ref_male: 'Negatif (-)', ref_female: 'Negatif (-)', ref_child: 'Negatif (-)', metode: 'Enzyme Strip' },
      { param_code: 'NITRIT', param_name: 'Nitrit', satuan: '-', ref_male: 'Negatif (-)', ref_female: 'Negatif (-)', ref_child: 'Negatif (-)', metode: 'Greiss Reaction' },
      { param_code: 'SED_LEU', param_name: 'Sedimen Leukosit', satuan: '/LPB', ref_male: '0 - 3', ref_female: '0 - 5', ref_child: '0 - 3', metode: 'Automated Image Microscopy' },
      { param_code: 'SED_ERI', param_name: 'Sedimen Eritrosit', satuan: '/LPB', ref_male: '0 - 1', ref_female: '0 - 2', ref_child: '0 - 1', metode: 'Automated Image Microscopy' },
      { param_code: 'SED_EPI', param_name: 'Sel Epitel', satuan: '/LPK', ref_male: 'Positif Ringan (0-2)', ref_female: 'Positif Ringan (0-5)', ref_child: 'Positif Ringan', metode: 'Microscopy' }
    ]
  },
  {
    kode: 'LAB-IMU-01',
    loinc_code: '65753-6',
    nama_pemeriksaan: 'Dengue NS1 Antigen & IgG/IgM',
    kategori: 'Imunoserologi & Infeksi',
    spesimen: 'Serum / Plasma EDTA',
    wadah: 'Tabung Serum Gel (Kuning)',
    volume_min: '1.5 mL',
    metode: 'Rapid Immunochromatography Combo',
    hari_kerja: 'Setiap Hari (24 Jam Cito)',
    waktu_selesai_menit: 25,
    tarif_umum: 195000,
    tarif_bpjs: 175000,
    puasa_info: 'Tidak perlu puasa',
    nilai_rujukan_dewasa_l: 'NS1: Negatif, IgM: Negatif, IgG: Negatif',
    nilai_rujukan_dewasa_p: 'NS1: Negatif, IgM: Negatif, IgG: Negatif',
    nilai_rujukan_anak: 'Semua Negatif',
    satuan: 'Kualitatif',
    default_parameters: [
      { param_code: 'DENGUE_NS1', param_name: 'Dengue NS1 Ag', satuan: '-', ref_male: 'Negatif (-)', ref_female: 'Negatif (-)', ref_child: 'Negatif (-)', metode: 'Immunochromatography' },
      { param_code: 'DENGUE_IGM', param_name: 'Dengue IgM', satuan: '-', ref_male: 'Negatif (-)', ref_female: 'Negatif (-)', ref_child: 'Negatif (-)', metode: 'Immunochromatography' },
      { param_code: 'DENGUE_IGG', param_name: 'Dengue IgG', satuan: '-', ref_male: 'Negatif (-)', ref_female: 'Negatif (-)', ref_child: 'Negatif (-)', metode: 'Immunochromatography' }
    ]
  },
  {
    kode: 'LAB-IMU-02',
    loinc_code: '5196-1',
    nama_pemeriksaan: 'Hepatitis B Surface Antigen (HBsAg Kualitatif)',
    kategori: 'Imunoserologi & Infeksi',
    spesimen: 'Serum',
    wadah: 'Tabung Serum Gel (Kuning)',
    volume_min: '1.5 mL',
    metode: 'CLIA (Chemiluminescence Immunoassay)',
    hari_kerja: 'Setiap Hari',
    waktu_selesai_menit: 40,
    tarif_umum: 110000,
    tarif_bpjs: 95000,
    puasa_info: 'Tidak perlu puasa',
    nilai_rujukan_dewasa_l: 'Non-Reaktif (< 1.00 S/CO)',
    nilai_rujukan_dewasa_p: 'Non-Reaktif (< 1.00 S/CO)',
    nilai_rujukan_anak: 'Non-Reaktif',
    satuan: 'S/CO',
    default_parameters: [
      { param_code: 'HBSAG', param_name: 'HBsAg', satuan: 'S/CO', ref_male: 'Non-Reaktif (< 1.00)', ref_female: 'Non-Reaktif (< 1.00)', ref_child: 'Non-Reaktif (< 1.00)', metode: 'CLIA Abbott Architect' }
    ]
  },
  {
    kode: 'LAB-IMU-03',
    loinc_code: '48425-3',
    nama_pemeriksaan: 'Troponin I Kuantitatif (Cardiac Marker Cito)',
    kategori: 'Imunoserologi & Infeksi',
    spesimen: 'Plasma Heparin / Serum',
    wadah: 'Tabung Heparin (Hijau)',
    volume_min: '1.5 mL',
    metode: 'High-Sensitivity Chemiluminescence Immunoassay (hs-cTnI)',
    hari_kerja: 'Setiap Hari (24 Jam Cito)',
    waktu_selesai_menit: 25,
    tarif_umum: 285000,
    tarif_bpjs: 250000,
    puasa_info: 'Cito tanpa puasa',
    nilai_rujukan_dewasa_l: '< 26.0 ng/L (99th percentile)',
    nilai_rujukan_dewasa_p: '< 16.0 ng/L (99th percentile)',
    nilai_rujukan_anak: '< 15.0 ng/L',
    satuan: 'ng/L',
    default_parameters: [
      { param_code: 'TROP_I', param_name: 'High-Sensitivity Troponin I', satuan: 'ng/L', ref_male: '< 26.0', ref_female: '< 16.0', ref_child: '< 15.0', metode: 'hs-CLIA', critical_high: 50.0 }
    ]
  },
  {
    kode: 'LAB-IMU-04',
    loinc_code: '1988-5',
    nama_pemeriksaan: 'C-Reactive Protein (CRP Kuantitatif)',
    kategori: 'Imunoserologi & Infeksi',
    spesimen: 'Serum',
    wadah: 'Tabung Serum Gel (Kuning)',
    volume_min: '1.5 mL',
    metode: 'Immunoturbidimetry High Sensitivity',
    hari_kerja: 'Setiap Hari',
    waktu_selesai_menit: 35,
    tarif_umum: 140000,
    tarif_bpjs: 125000,
    puasa_info: 'Tidak perlu puasa',
    nilai_rujukan_dewasa_l: '< 5.0 mg/L',
    nilai_rujukan_dewasa_p: '< 5.0 mg/L',
    nilai_rujukan_anak: '< 5.0 mg/L',
    satuan: 'mg/L',
    default_parameters: [
      { param_code: 'CRP_QUANT', param_name: 'CRP Kuantitatif', satuan: 'mg/L', ref_male: '< 5.0', ref_female: '< 5.0', ref_child: '< 5.0', metode: 'Immunoturbidimetric', critical_high: 100.0 }
    ]
  },
  {
    kode: 'LAB-TOX-01',
    loinc_code: '44018-0',
    nama_pemeriksaan: 'Skrining Narkoba 6 Parameter',
    kategori: 'Toksikologi & Narkoba',
    spesimen: 'Urine Segar',
    wadah: 'Pot Urine Steril',
    volume_min: '20.0 mL',
    metode: 'Rapid Lateral Flow Multi-Panel',
    hari_kerja: 'Setiap Hari',
    waktu_selesai_menit: 20,
    tarif_umum: 250000,
    tarif_bpjs: 0,
    puasa_info: 'Pengambilan sampel diawasi langsung',
    nilai_rujukan_dewasa_l: 'Semua Parameter Negatif (-)',
    nilai_rujukan_dewasa_p: 'Semua Parameter Negatif (-)',
    nilai_rujukan_anak: 'Semua Parameter Negatif (-)',
    satuan: 'Kualitatif',
    default_parameters: [
      { param_code: 'AMP', param_name: 'Amphetamine (AMP)', satuan: '-', ref_male: 'Negatif (-)', ref_female: 'Negatif (-)', ref_child: 'Negatif (-)', metode: 'Immunoassay Strip' },
      { param_code: 'MET', param_name: 'Methamphetamine / Shabu (MET)', satuan: '-', ref_male: 'Negatif (-)', ref_female: 'Negatif (-)', ref_child: 'Negatif (-)', metode: 'Immunoassay Strip' },
      { param_code: 'THC', param_name: 'Cannabinoids / Ganja (THC)', satuan: '-', ref_male: 'Negatif (-)', ref_female: 'Negatif (-)', ref_child: 'Negatif (-)', metode: 'Immunoassay Strip' },
      { param_code: 'MOP', param_name: 'Morphine / Opiates (MOP)', satuan: '-', ref_male: 'Negatif (-)', ref_female: 'Negatif (-)', ref_child: 'Negatif (-)', metode: 'Immunoassay Strip' },
      { param_code: 'BZO', param_name: 'Benzodiazepines (BZO)', satuan: '-', ref_male: 'Negatif (-)', ref_female: 'Negatif (-)', ref_child: 'Negatif (-)', metode: 'Immunoassay Strip' },
      { param_code: 'COC', param_name: 'Cocaine (COC)', satuan: '-', ref_male: 'Negatif (-)', ref_female: 'Negatif (-)', ref_child: 'Negatif (-)', metode: 'Immunoassay Strip' }
    ]
  }
];

// ==========================================
// 2. DAFTAR MESIN ANALYZER LABORATORIUM
// ==========================================
export const DAFTAR_ANALYZER_LAB: AnalyzerMachine[] = [
  {
    id: 'ALAT-HEM-01',
    nama_alat: 'Sysmex XN-1000 Hematology Analyzer',
    merk: 'Sysmex Corporation Japan',
    modalitas: 'Hematologi 6-Part Diff & Retikulosit',
    serial_number: 'XN1000-ID-98214',
    ruangan: 'Lab Hematologi Sentral (Lt. 1)',
    status: 'Operasional / Siap',
    koneksi_lis: 'Connected (HL7/ASTM)',
    status_qc_hari_ini: 'Passed (Westgard In-Control)',
    total_sampel_hari_ini: 42,
    suhu_reagen_chiller: '18.4°C (Kamar Terkontrol)',
    lot_reagen_aktif: 'LOT-XN-2026A8',
    exp_reagen: '2026-12-31',
    last_maintenance: '2026-08-01 (Preventive Maintenance BPFK)'
  },
  {
    id: 'ALAT-KIM-01',
    nama_alat: 'Roche Cobas c311 Clinical Chemistry',
    merk: 'Roche Diagnostics Germany',
    modalitas: 'Kimia Klinik & ISE Elektrolit',
    serial_number: 'COBAS-C311-55420',
    ruangan: 'Lab Kimia Klinik (Lt. 1)',
    status: 'Sedang Running Sample',
    koneksi_lis: 'Connected (HL7/ASTM)',
    status_qc_hari_ini: 'Passed (Westgard In-Control)',
    total_sampel_hari_ini: 68,
    suhu_reagen_chiller: '4.2°C (Refrigerated Compartment)',
    lot_reagen_aktif: 'LOT-COBAS-GLU-992',
    exp_reagen: '2027-02-15',
    last_maintenance: '2026-08-10 (Monthly Cal BPFK)'
  },
  {
    id: 'ALAT-IMU-01',
    nama_alat: 'Abbott Architect i1000SR Immunoassay',
    merk: 'Abbott Laboratories USA',
    modalitas: 'Imunoserologi, Hormon & Kardiak Marker',
    serial_number: 'ARCH-I1000-88731',
    ruangan: 'Lab Imunologi & Serologi (Lt. 1)',
    status: 'Operasional / Siap',
    koneksi_lis: 'Connected (HL7/ASTM)',
    status_qc_hari_ini: 'Passed (Westgard In-Control)',
    total_sampel_hari_ini: 29,
    suhu_reagen_chiller: '3.8°C (Internal Cooler)',
    lot_reagen_aktif: 'LOT-ARCH-TN-411',
    exp_reagen: '2026-11-20',
    last_maintenance: '2026-07-28'
  },
  {
    id: 'ALAT-BGA-01',
    nama_alat: 'Radiometer ABL800 Flex Gas Darah',
    merk: 'Radiometer Medical Denmark',
    modalitas: 'Analisa Gas Darah, Elektrolit & Oximetri',
    serial_number: 'ABL800-DK-77123',
    ruangan: 'Lab Cito IGD & ICU (Lt. 1)',
    status: 'Operasional / Siap',
    koneksi_lis: 'Connected (HL7/ASTM)',
    status_qc_hari_ini: 'Passed (Westgard In-Control)',
    total_sampel_hari_ini: 18,
    suhu_reagen_chiller: '22.0°C (Cassette Solution)',
    lot_reagen_aktif: 'LOT-ABL-GAS-663',
    exp_reagen: '2026-10-30',
    last_maintenance: '2026-08-15'
  },
  {
    id: 'ALAT-URI-01',
    nama_alat: 'Dirui FUS-2000 Automated Urinalysis',
    merk: 'Dirui Industrial',
    modalitas: 'Kimia Urine Kering & Morfologi Sedimen AI',
    serial_number: 'FUS2000-99321',
    ruangan: 'Lab Urinalisis & Cairan Tubuh',
    status: 'Operasional / Siap',
    koneksi_lis: 'Connected (HL7/ASTM)',
    status_qc_hari_ini: 'Passed (Westgard In-Control)',
    total_sampel_hari_ini: 35,
    suhu_reagen_chiller: 'Suhu Ruang 20°C',
    lot_reagen_aktif: 'LOT-DIR-STRIP-2026',
    exp_reagen: '2027-01-10',
    last_maintenance: '2026-08-05'
  }
];

// ==========================================
// 3. DATA KONTROL KUALITAS (LEVEY-JENNINGS)
// ==========================================
export const QC_HEMOGLOBIN_DATA: LeveyJenningsPoint[] = [
  { run: 1, date: '01/08', value: 14.1, mean: 14.0, sd1_plus: 14.3, sd2_plus: 14.6, sd3_plus: 14.9, sd1_minus: 13.7, sd2_minus: 13.4, sd3_minus: 13.1, status_westgard: 'In-Control' },
  { run: 2, date: '02/08', value: 13.9, mean: 14.0, sd1_plus: 14.3, sd2_plus: 14.6, sd3_plus: 14.9, sd1_minus: 13.7, sd2_minus: 13.4, sd3_minus: 13.1, status_westgard: 'In-Control' },
  { run: 3, date: '03/08', value: 14.0, mean: 14.0, sd1_plus: 14.3, sd2_plus: 14.6, sd3_plus: 14.9, sd1_minus: 13.7, sd2_minus: 13.4, sd3_minus: 13.1, status_westgard: 'In-Control' },
  { run: 4, date: '04/08', value: 14.2, mean: 14.0, sd1_plus: 14.3, sd2_plus: 14.6, sd3_plus: 14.9, sd1_minus: 13.7, sd2_minus: 13.4, sd3_minus: 13.1, status_westgard: 'In-Control' },
  { run: 5, date: '05/08', value: 14.4, mean: 14.0, sd1_plus: 14.3, sd2_plus: 14.6, sd3_plus: 14.9, sd1_minus: 13.7, sd2_minus: 13.4, sd3_minus: 13.1, status_westgard: '1-2s Warning' },
  { run: 6, date: '06/08', value: 14.1, mean: 14.0, sd1_plus: 14.3, sd2_plus: 14.6, sd3_plus: 14.9, sd1_minus: 13.7, sd2_minus: 13.4, sd3_minus: 13.1, status_westgard: 'In-Control' },
  { run: 7, date: '07/08', value: 13.8, mean: 14.0, sd1_plus: 14.3, sd2_plus: 14.6, sd3_plus: 14.9, sd1_minus: 13.7, sd2_minus: 13.4, sd3_minus: 13.1, status_westgard: 'In-Control' },
  { run: 8, date: '08/08', value: 14.0, mean: 14.0, sd1_plus: 14.3, sd2_plus: 14.6, sd3_plus: 14.9, sd1_minus: 13.7, sd2_minus: 13.4, sd3_minus: 13.1, status_westgard: 'In-Control' },
  { run: 9, date: '09/08', value: 13.9, mean: 14.0, sd1_plus: 14.3, sd2_plus: 14.6, sd3_plus: 14.9, sd1_minus: 13.7, sd2_minus: 13.4, sd3_minus: 13.1, status_westgard: 'In-Control' },
  { run: 10, date: '10/08', value: 14.1, mean: 14.0, sd1_plus: 14.3, sd2_plus: 14.6, sd3_plus: 14.9, sd1_minus: 13.7, sd2_minus: 13.4, sd3_minus: 13.1, status_westgard: 'In-Control' },
  { run: 11, date: '11/08', value: 14.0, mean: 14.0, sd1_plus: 14.3, sd2_plus: 14.6, sd3_plus: 14.9, sd1_minus: 13.7, sd2_minus: 13.4, sd3_minus: 13.1, status_westgard: 'In-Control' },
  { run: 12, date: '12/08', value: 13.7, mean: 14.0, sd1_plus: 14.3, sd2_plus: 14.6, sd3_plus: 14.9, sd1_minus: 13.7, sd2_minus: 13.4, sd3_minus: 13.1, status_westgard: 'In-Control' },
  { run: 13, date: '13/08', value: 14.2, mean: 14.0, sd1_plus: 14.3, sd2_plus: 14.6, sd3_plus: 14.9, sd1_minus: 13.7, sd2_minus: 13.4, sd3_minus: 13.1, status_westgard: 'In-Control' },
  { run: 14, date: '14/08', value: 14.0, mean: 14.0, sd1_plus: 14.3, sd2_plus: 14.6, sd3_plus: 14.9, sd1_minus: 13.7, sd2_minus: 13.4, sd3_minus: 13.1, status_westgard: 'In-Control' },
  { run: 15, date: '15/08', value: 13.9, mean: 14.0, sd1_plus: 14.3, sd2_plus: 14.6, sd3_plus: 14.9, sd1_minus: 13.7, sd2_minus: 13.4, sd3_minus: 13.1, status_westgard: 'In-Control' },
  { run: 16, date: '16/08', value: 14.1, mean: 14.0, sd1_plus: 14.3, sd2_plus: 14.6, sd3_plus: 14.9, sd1_minus: 13.7, sd2_minus: 13.4, sd3_minus: 13.1, status_westgard: 'In-Control' },
  { run: 17, date: '17/08', value: 14.0, mean: 14.0, sd1_plus: 14.3, sd2_plus: 14.6, sd3_plus: 14.9, sd1_minus: 13.7, sd2_minus: 13.4, sd3_minus: 13.1, status_westgard: 'In-Control' },
  { run: 18, date: '18/08', value: 13.8, mean: 14.0, sd1_plus: 14.3, sd2_plus: 14.6, sd3_plus: 14.9, sd1_minus: 13.7, sd2_minus: 13.4, sd3_minus: 13.1, status_westgard: 'In-Control' },
  { run: 19, date: '19/08', value: 14.0, mean: 14.0, sd1_plus: 14.3, sd2_plus: 14.6, sd3_plus: 14.9, sd1_minus: 13.7, sd2_minus: 13.4, sd3_minus: 13.1, status_westgard: 'In-Control' },
  { run: 20, date: '20/08', value: 14.3, mean: 14.0, sd1_plus: 14.3, sd2_plus: 14.6, sd3_plus: 14.9, sd1_minus: 13.7, sd2_minus: 13.4, sd3_minus: 13.1, status_westgard: '1-2s Warning' },
  { run: 21, date: '21/08', value: 14.1, mean: 14.0, sd1_plus: 14.3, sd2_plus: 14.6, sd3_plus: 14.9, sd1_minus: 13.7, sd2_minus: 13.4, sd3_minus: 13.1, status_westgard: 'In-Control' },
  { run: 22, date: '22/08', value: 13.9, mean: 14.0, sd1_plus: 14.3, sd2_plus: 14.6, sd3_plus: 14.9, sd1_minus: 13.7, sd2_minus: 13.4, sd3_minus: 13.1, status_westgard: 'In-Control' },
  { run: 23, date: '23/08', value: 14.0, mean: 14.0, sd1_plus: 14.3, sd2_plus: 14.6, sd3_plus: 14.9, sd1_minus: 13.7, sd2_minus: 13.4, sd3_minus: 13.1, status_westgard: 'In-Control' },
  { run: 24, date: '24/08', value: 14.1, mean: 14.0, sd1_plus: 14.3, sd2_plus: 14.6, sd3_plus: 14.9, sd1_minus: 13.7, sd2_minus: 13.4, sd3_minus: 13.1, status_westgard: 'In-Control' },
  { run: 25, date: '25/08', value: 14.0, mean: 14.0, sd1_plus: 14.3, sd2_plus: 14.6, sd3_plus: 14.9, sd1_minus: 13.7, sd2_minus: 13.4, sd3_minus: 13.1, status_westgard: 'In-Control' }
];

// ==========================================
// 4. STOK BANK DARAH RUMAH SAKIT (BDRS)
// ==========================================
export const STOK_BANK_DARAH_INITIAL: BloodBankStock[] = [
  { id: 'BD-001', no_kantong: 'BDRS-26-A-0101', golongan_darah: 'A', rhesus: '+', jenis_komponen: 'Packed Red Cells (PRC)', volume_ml: 250, tanggal_sadap: '2026-08-15', tanggal_exp: '2026-09-19', asal_darah: 'PMI Kota Bandung', status: 'Tersedia', suhu_penyimpanan: '4.0°C', lokasi_chiller: 'Blood Bank Refrigerator Chiller-A1' },
  { id: 'BD-002', no_kantong: 'BDRS-26-A-0102', golongan_darah: 'A', rhesus: '+', jenis_komponen: 'Packed Red Cells (PRC)', volume_ml: 250, tanggal_sadap: '2026-08-16', tanggal_exp: '2026-09-20', asal_darah: 'PMI Kota Bandung', status: 'Tersedia', suhu_penyimpanan: '3.8°C', lokasi_chiller: 'Blood Bank Refrigerator Chiller-A1' },
  { id: 'BD-003', no_kantong: 'BDRS-26-A-0103', golongan_darah: 'A', rhesus: '+', jenis_komponen: 'Fresh Frozen Plasma (FFP)', volume_ml: 200, tanggal_sadap: '2026-08-10', tanggal_exp: '2027-08-10', asal_darah: 'PMI Kota Bandung', status: 'Tersedia', suhu_penyimpanan: '-25.0°C', lokasi_chiller: 'Deep Freezer Plasma F1' },
  { id: 'BD-004', no_kantong: 'BDRS-26-B-0201', golongan_darah: 'B', rhesus: '+', jenis_komponen: 'Packed Red Cells (PRC)', volume_ml: 250, tanggal_sadap: '2026-08-18', tanggal_exp: '2026-09-22', asal_darah: 'PMI Prov. Jabar', status: 'Tersedia', suhu_penyimpanan: '4.1°C', lokasi_chiller: 'Blood Bank Refrigerator Chiller-B1' },
  { id: 'BD-005', no_kantong: 'BDRS-26-B-0202', golongan_darah: 'B', rhesus: '+', jenis_komponen: 'Thrombocyte Concentrate (TC)', volume_ml: 50, tanggal_sadap: '2026-08-24', tanggal_exp: '2026-08-29', asal_darah: 'PMI Kota Bandung', status: 'Crossmatched (Reservasi)', suhu_penyimpanan: '22.0°C (Agitator)', lokasi_chiller: 'Platelet Incubator & Agitator PL-1' },
  { id: 'BD-006', no_kantong: 'BDRS-26-O-0301', golongan_darah: 'O', rhesus: '+', jenis_komponen: 'Packed Red Cells (PRC)', volume_ml: 250, tanggal_sadap: '2026-08-19', tanggal_exp: '2026-09-23', asal_darah: 'PMI Kota Bandung', status: 'Tersedia', suhu_penyimpanan: '3.9°C', lokasi_chiller: 'Blood Bank Refrigerator Chiller-O1' },
  { id: 'BD-007', no_kantong: 'BDRS-26-O-0302', golongan_darah: 'O', rhesus: '+', jenis_komponen: 'Packed Red Cells (PRC)', volume_ml: 250, tanggal_sadap: '2026-08-20', tanggal_exp: '2026-09-24', asal_darah: 'PMI Kota Bandung', status: 'Tersedia', suhu_penyimpanan: '4.0°C', lokasi_chiller: 'Blood Bank Refrigerator Chiller-O1' },
  { id: 'BD-008', no_kantong: 'BDRS-26-O-0303', golongan_darah: 'O', rhesus: '+', jenis_komponen: 'Whole Blood (WB)', volume_ml: 350, tanggal_sadap: '2026-08-12', tanggal_exp: '2026-09-16', asal_darah: 'BDRS Internal Donor', status: 'Tersedia', suhu_penyimpanan: '4.2°C', lokasi_chiller: 'Blood Bank Refrigerator Chiller-O1' },
  { id: 'BD-009', no_kantong: 'BDRS-26-AB-0401', golongan_darah: 'AB', rhesus: '+', jenis_komponen: 'Packed Red Cells (PRC)', volume_ml: 250, tanggal_sadap: '2026-08-14', tanggal_exp: '2026-09-18', asal_darah: 'PMI Kota Bandung', status: 'Tersedia', suhu_penyimpanan: '4.0°C', lokasi_chiller: 'Blood Bank Refrigerator Chiller-AB1' },
  { id: 'BD-010', no_kantong: 'BDRS-26-O-0309', golongan_darah: 'O', rhesus: '-', jenis_komponen: 'Packed Red Cells (PRC)', volume_ml: 250, tanggal_sadap: '2026-08-21', tanggal_exp: '2026-09-25', asal_darah: 'PMI Prov. Jabar', status: 'Tersedia', suhu_penyimpanan: '3.7°C', lokasi_chiller: 'Blood Bank Chiller Rak Khusus Rhesus Negatif' }
];

export const ANALYZER_MACHINES_MOCK = DAFTAR_ANALYZER_LAB;
export const LEVEY_JENNINGS_MOCK = QC_HEMOGLOBIN_DATA;
export const INITIAL_LAB_ORDERS_MOCK = generateInitialLabOrders();
export const BLOOD_STOCK_MOCK = STOK_BANK_DARAH_INITIAL;

export const CROSSMATCH_ORDERS_INITIAL: CrossmatchOrder[] = [
  {
    id: 'XM-2608-01',
    no_permintaan_bdrs: 'REQ-BDRS-2608-001',
    no_rm: 'RM-260814-0012',
    nama_pasien: 'Tn. Hendra Wijaya',
    ruangan: 'Bangsal Dahlia (Ranap Bed 204)',
    golongan_darah_pasien: 'A',
    rhesus_pasien: '+',
    komponen: 'Packed Red Cells (PRC)',
    jumlah_kantong: 2,
    diagnosa: 'Anemia Gravis ec Perdarahan Saluran Cerna Atas',
    hb_terkini: 6.8,
    target_hb: 10.0,
    reaksi_mayor: 'Aglutinasi (-)',
    reaksi_minor: 'Aglutinasi (-)',
    autokontrol: 'Negatif (-)',
    kesimpulan: 'Kompatibel (Aman Ditransfusikan)',
    status: 'Siap Dikeluarkan',
    petugas_bdrs: 'Apt. Siti Rohmah, S.Tr.Kes',
    tanggal_uji: '2026-08-26'
  },
  {
    id: 'XM-2608-02',
    no_permintaan_bdrs: 'REQ-BDRS-2608-002',
    no_rm: 'RM-260818-0045',
    nama_pasien: 'Ny. Dewi Sartika',
    ruangan: 'Kamar Operasi (OK Bedah)',
    golongan_darah_pasien: 'B',
    rhesus_pasien: '+',
    komponen: 'Thrombocyte Concentrate (TC)',
    jumlah_kantong: 4,
    diagnosa: 'Trombositopenia Berat Pre-Sectio Caesarea',
    hb_terkini: 11.2,
    target_hb: 11.2,
    reaksi_mayor: 'Aglutinasi (-)',
    reaksi_minor: 'Aglutinasi (-)',
    autokontrol: 'Negatif (-)',
    kesimpulan: 'Kompatibel (Aman Ditransfusikan)',
    status: 'Sedang Crossmatch',
    petugas_bdrs: 'Apt. Siti Rohmah, S.Tr.Kes',
    tanggal_uji: '2026-08-26'
  }
];

export const CROSSMATCH_ORDERS_MOCK = CROSSMATCH_ORDERS_INITIAL;

// ==========================================
// 5. TEMPLATE EKSPERTISE DOKTER SP.PK
// ==========================================
export const TEMPLATE_EKSPERTISE_SP_PK = [
  {
    id: 'TPL-HEM-NORMAL',
    nama: 'Hematologi Rutin Dalam Batas Normal',
    kategori: 'Hematologi',
    interpretasi: 'Hasil pemeriksaan hematologi rutin menunjukkan kadar Hemoglobin, Leukosit, Hematokrit, Indeks Eritrosit, dan Trombosit dalam batas nilai rujukan normal.',
    saran: 'Korelasikan dengan gambaran klinis pasien. Kontrol berkala sesuai indikasi.'
  },
  {
    id: 'TPL-HEM-DHF',
    nama: 'Kecurigaan Infeksi Dengue (DHF Stage)',
    kategori: 'Hematologi & Imunologi',
    interpretasi: 'Ditemukan Trombositopenia progresif disertai peningkatan Hematokrit (hemokonsentrasi) dan Leukopenia relatif. Hasil NS1 Ag Positif mengonfirmasi infeksi virus Dengue fase akut.',
    saran: 'Saran: Monitor tanda vital, cairan parenteral, dan evaluasi ulang Hematologi Rutin serial setiap 12-24 jam untuk memantau risiko kebocoran plasma.'
  },
  {
    id: 'TPL-HEM-ANEMIA',
    nama: 'Anemia Mikrositik Hipokromik',
    kategori: 'Hematologi',
    interpretasi: 'Kadar Hemoglobin dan Hematokrit menurun bermakna dengan penurunan MCV (< 80 fL) dan MCH (< 27 pg), sesuai dengan gambaran Anemia Mikrositik Hipokromik.',
    saran: 'Saran: Pemeriksaan Profil Besi (Serum Iron, TIBC, Ferritin Serum) untuk membedakan Anemia Defisiensi Besi atau Thalassemia Trait.'
  },
  {
    id: 'TPL-KIM-CKD',
    nama: 'Gangguan Fungsi Ginjal (Azotemia / CKD)',
    kategori: 'Kimia Klinik',
    interpretasi: 'Peningkatan kadar Ureum dan Kreatinin serum dengan penurunan eGFR (< 60 mL/min/1.73m²), menunjukkan adanya penurunan fungsi filtrasi glomerulus.',
    saran: 'Saran: Evaluasi elektrolit, urinalisis proteinuria kuantitatif, dan USG Ginjal untuk melihat diferensiasi kortikomedular.'
  },
  {
    id: 'TPL-KIM-HEPATITIS',
    nama: 'Kerusakan Hepatoseluler Akut (Transaminitis)',
    kategori: 'Kimia Klinik',
    interpretasi: 'Peningkatan enzim transaminase hati (SGOT dan SGPT > 3x batas atas normal) disertai hiperbilirubinemia direk, menunjukkan adanya cedera sel hepar aktif.',
    saran: 'Saran: Evaluasi serologi viral hepatitis (Anti-HAV IgM, HBsAg, Anti-HCV) dan USG Abdomen Hepatobilier.'
  },
  {
    id: 'TPL-ACS-CARDIAC',
    nama: 'Sindrom Koroner Akut (Peningkatan Cardiac Troponin)',
    kategori: 'Imunoserologi & Kardiak',
    interpretasi: 'Kadar High-Sensitivity Troponin I meningkat signifikan melampaui batas persentil ke-99 (Positif), mengindikasikan adanya cedera/nekrosis miokard akut.',
    saran: 'NILAI KRITIS: Segera laporkan ke DPJP Jantung / IGD untuk evaluasi EKG serial dan penatalaksanaan ACS/NSTEMI sesuai protokol.'
  }
];

// ==========================================
// 6. INITIAL LAB ORDERS DATA GENERATION
// ==========================================
export function generateInitialLabOrders(): LabOrder[] {
  return [
    {
      id: 'LAB-260826-0001',
      no_order_rs: 'ORD-LAB-9921',
      no_rm: 'RM-260814-0012',
      nama_pasien: 'Tn. Hendra Wijaya',
      nik: '3273011204850001',
      jenis_kelamin: 'L',
      tanggal_lahir: '1985-04-12',
      umur: '41 Th',
      ruangan_asal: 'IGD (Instalasi Gawat Darurat)',
      jenis_pelayanan: 'IGD',
      penjamin: 'BPJS Kesehatan',
      dokter_pengirim: 'dr. Satria Pratama, Sp.PD',
      tanggal_order: '2026-08-26',
      waktu_order: '08:15 WIB',
      prioritas: 'Cito / Emergency',
      diagnosa_klinis: 'Demam Hari ke-4 Suspek Dengue Hemorrhagic Fever (DHF) dd Febris Tifoid',
      catatan_klinis: 'Demam tinggi mendadak, menggigil, nyeri retroorbital, petechiae (+) di ekstremitas atas.',
      status: 'Selesai & Tervalidasi',
      sampling_info: {
        waktu_sampling: '08:22 WIB',
        petugas_phlebotomist: 'Bambang Irawan, A.Md.AK',
        lokasi_pengambilan: 'Bed 02 Triase IGD',
        kondisi_sampel: 'Baik / Homogen',
        volume_cukup: true,
        wadah_tabung: ['Tabung EDTA (Ungu)', 'Tabung Serum Gel (Kuning)'],
        barcode_specimen: 'SPEC-260826-0001-EDTA'
      },
      waktu_terima_lab: '08:25 WIB',
      analis_pemeriksa: 'Siti Nurhaliza, S.Tr.Kes',
      waktu_selesai_analisis: '09:05 WIB',
      dokter_sp_pk: 'dr. Hendra Gunawan, Sp.PK',
      waktu_validasi: '09:12 WIB',
      status_validasi: 'Final / Tervalidasi',
      qr_verifikasi_code: 'MYITARU-LAB-VERIFIED-20260826-0001-PK',
      tests_ordered: [
        { kode: 'LAB-HEM-01', nama_pemeriksaan: 'Hematologi Lengkap (CBC + Diff)', kategori: 'Hematologi', biaya: 95000, wadah_sampel: 'Tabung EDTA (Ungu)', loinc_code: '58410-2' },
        { kode: 'LAB-IMU-01', nama_pemeriksaan: 'Dengue NS1 Antigen & IgG/IgM', kategori: 'Imunoserologi & Infeksi', biaya: 195000, wadah_sampel: 'Tabung Serum Gel (Kuning)', loinc_code: '65753-6' }
      ],
      total_biaya: 290000,
      parameter_results: [
        { id: 'PR-01', test_code: 'HB', parameter_name: 'Hemoglobin (Hb)', hasil: 14.8, nilai_rujukan: '13.5 - 17.5', satuan: 'g/dL', flag: 'N', is_critical: false, metode_pemeriksaan: 'Cyanmethemoglobin' },
        { id: 'PR-02', test_code: 'LEU', parameter_name: 'Leukosit (WBC)', hasil: 2.8, nilai_rujukan: '4.5 - 11.0', satuan: '10^3/uL', flag: 'L', is_critical: false, metode_pemeriksaan: 'Flow Cytometry' },
        { id: 'PR-03', test_code: 'PLT', parameter_name: 'Trombosit (PLT)', hasil: 54, nilai_rujukan: '150 - 450', satuan: '10^3/uL', flag: 'L', is_critical: false, metode_pemeriksaan: 'Electrical Impedance' },
        { id: 'PR-04', test_code: 'HT', parameter_name: 'Hematokrit (Ht)', hasil: 49.2, nilai_rujukan: '40.0 - 52.0', satuan: '%', flag: 'N', is_critical: false, metode_pemeriksaan: 'Cumulative Pulse Height' },
        { id: 'PR-05', test_code: 'DENGUE_NS1', parameter_name: 'Dengue NS1 Antigen', hasil: 'Positif (+)', nilai_rujukan: 'Negatif (-)', satuan: '-', flag: 'P', is_critical: true, metode_pemeriksaan: 'Immunochromatography' },
        { id: 'PR-06', test_code: 'DENGUE_IGM', parameter_name: 'Dengue IgM', hasil: 'Positif (+)', nilai_rujukan: 'Negatif (-)', satuan: '-', flag: 'P', is_critical: false, metode_pemeriksaan: 'Immunochromatography' },
        { id: 'PR-07', test_code: 'DENGUE_IGG', parameter_name: 'Dengue IgG', hasil: 'Negatif (-)', nilai_rujukan: 'Negatif (-)', satuan: '-', flag: 'N', is_critical: false, metode_pemeriksaan: 'Immunochromatography' }
      ],
      interpretasi_sp_pk: 'Ditemukan Leukopenia (2.8 x10^3/uL) dan Trombositopenia signifikan (54 x10^3/uL) disertai hasil NS1 Antigen Positif (+) dan IgM Dengue Positif (+). Sangat sesuai dengan Infeksi Dengue Akut Primer (DHF).',
      saran_klinis: 'Observasi ketat tanda vital, pertahankan hidrasi adekuat, dan lakukan evaluasi Hematologi Rutin berkala per 12 jam untuk antisipasi fase kritis.',
      critical_finding: {
        is_critical: false,
        is_reported: true,
        reported_at: '09:15 WIB',
        reported_by: 'dr. Hendra Gunawan, Sp.PK',
        received_by: 'dr. Satria Pratama (DPJP IGD)',
        room: 'IGD Bed 02',
        method: 'Telepon / SBAR',
        notes: 'Hasil Trombosit 54.000 dan NS1 (+) telah dilaporkan via telepon dan dikonfirmasi read-back oleh dokter jaga IGD.'
      },
      ai_pathology_analysis: {
        clinical_summary: 'Pola khas Dengue Infection: Leukopenia + Trombositopenia + NS1 Positif.',
        key_findings: ['Trombosit 54 x10^3/uL (Trombositopenia)', 'Leukosit 2.8 x10^3/uL (Leukopenia)', 'NS1 Antigen Reactive'],
        differential_considerations: ['Dengue Hemorrhagic Fever Grade I/II', 'Viral Exanthem'],
        recommended_follow_up: ['Monitoring serial trombosit dan hematokrit setiap 12 jam', 'Waspadai warning signs syok (Dengue Shock Syndrome)'],
        confidence_score: 98
      }
    },
    {
      id: 'LAB-260826-0002',
      no_order_rs: 'ORD-LAB-9922',
      no_rm: 'RM-260818-0045',
      nama_pasien: 'Ny. Dewi Sartika',
      nik: '3273025508900003',
      jenis_kelamin: 'P',
      tanggal_lahir: '1990-08-15',
      umur: '36 Th',
      ruangan_asal: 'Poli Penyakit Dalam (Ralan)',
      jenis_pelayanan: 'Rawat Jalan',
      penjamin: 'BPJS Kesehatan',
      dokter_pengirim: 'dr. Linda Kusumawati, Sp.PD',
      tanggal_order: '2026-08-26',
      waktu_order: '08:40 WIB',
      prioritas: 'Rutin',
      diagnosa_klinis: 'Diabetes Melitus Tipe 2 Tidak Terkontrol + Hipertensi Stage II',
      catatan_klinis: 'Evaluasi 3 bulanan kadar gula darah dan skrining nefropati diabetik.',
      status: 'Menunggu Validasi',
      sampling_info: {
        waktu_sampling: '08:50 WIB',
        petugas_phlebotomist: 'Agus Triyono, A.Md.AK',
        lokasi_pengambilan: 'Sampling Room Poli Ralan',
        kondisi_sampel: 'Baik / Homogen',
        volume_cukup: true,
        wadah_tabung: ['Tabung EDTA (Ungu)', 'Tabung Serum Gel (Kuning)', 'Pot Urine Steril'],
        barcode_specimen: 'SPEC-260826-0002-SR'
      },
      waktu_terima_lab: '09:00 WIB',
      analis_pemeriksa: 'Rian Hidayat, S.Tr.Kes',
      waktu_selesai_analisis: '09:40 WIB',
      dokter_sp_pk: 'dr. Hendra Gunawan, Sp.PK',
      status_validasi: 'Draft',
      tests_ordered: [
        { kode: 'LAB-KIM-01', nama_pemeriksaan: 'Glukosa Darah Sewaktu (GDS)', kategori: 'Kimia Klinik', biaya: 40000, wadah_sampel: 'Tabung Serum Gel (Kuning)', loinc_code: '2345-7' },
        { kode: 'LAB-KIM-02', nama_pemeriksaan: 'HbA1c (Glycated Hemoglobin)', kategori: 'Kimia Klinik', biaya: 165000, wadah_sampel: 'Tabung EDTA (Ungu)', loinc_code: '4548-4' },
        { kode: 'LAB-KIM-04', nama_pemeriksaan: 'Fungsi Ginjal (Ureum, Kreatinin & Asam Urat)', kategori: 'Kimia Klinik', biaya: 125000, wadah_sampel: 'Tabung Serum Gel (Kuning)', loinc_code: '2160-0' }
      ],
      total_biaya: 330000,
      parameter_results: [
        { id: 'PR-10', test_code: 'GDS', parameter_name: 'Glukosa Darah Sewaktu', hasil: 248, nilai_rujukan: '70 - 140', satuan: 'mg/dL', flag: 'H', is_critical: false, metode_pemeriksaan: 'GOD-PAP' },
        { id: 'PR-11', test_code: 'HBA1C', parameter_name: 'HbA1c', hasil: 9.4, nilai_rujukan: '< 5.7', satuan: '%', flag: 'H', is_critical: false, metode_pemeriksaan: 'HPLC NGSP Certified' },
        { id: 'PR-12', test_code: 'UREUM', parameter_name: 'Ureum (BUN)', hasil: 38.2, nilai_rujukan: '15.0 - 40.0', satuan: 'mg/dL', flag: 'N', is_critical: false, metode_pemeriksaan: 'Urease GLDH' },
        { id: 'PR-13', test_code: 'CREAT', parameter_name: 'Kreatinin Serum', hasil: 1.05, nilai_rujukan: '0.60 - 1.10', satuan: 'mg/dL', flag: 'N', is_critical: false, metode_pemeriksaan: 'Enzymatic IDMS' },
        { id: 'PR-14', test_code: 'EGFR', parameter_name: 'eGFR (CKD-EPI 2021)', hasil: 68.4, nilai_rujukan: '> 90', satuan: 'mL/min/1.73m²', flag: 'L', is_critical: false, metode_pemeriksaan: 'Kalkulasi CKD-EPI' },
        { id: 'PR-15', test_code: 'URIC', parameter_name: 'Asam Urat', hasil: 6.8, nilai_rujukan: '2.6 - 6.0', satuan: 'mg/dL', flag: 'H', is_critical: false, metode_pemeriksaan: 'Uricase PAP' }
      ],
      interpretasi_sp_pk: 'Kadar HbA1c 9.4% dan GDS 248 mg/dL mengindikasikan kontrol glikemik yang buruk dalam 3 bulan terakhir. Fungsi ginjal menunjukkan penurunan eGFR ringan (68.4 mL/min) disertai hiperurisemia.',
      saran_klinis: 'Eskalasi regimen terapi antidiabetes, edukasi diet rendah purin dan evaluasi mikroalbuminuria urine sewaktu.',
      ai_pathology_analysis: {
        clinical_summary: 'Uncontrolled T2DM with Early Renal Impairment & Hyperuricemia.',
        key_findings: ['HbA1c 9.4% (Tinggi)', 'GDS 248 mg/dL', 'eGFR 68.4 mL/min/1.73m² (Mildly Decreased)', 'Uric Acid 6.8 mg/dL'],
        differential_considerations: ['Diabetic Kidney Disease Stage G2', 'Metabolic Syndrome'],
        recommended_follow_up: ['Pemeriksaan Urine ACR (Albumin-to-Creatinine Ratio)', 'Konsultasi Gizi Klinis'],
        confidence_score: 95
      }
    },
    {
      id: 'LAB-260826-0003',
      no_order_rs: 'ORD-LAB-9923',
      no_rm: 'RM-260820-0088',
      nama_pasien: 'Tn. Rahmat Mulyana',
      nik: '3273031006780002',
      jenis_kelamin: 'L',
      tanggal_lahir: '1978-06-10',
      umur: '48 Th',
      ruangan_asal: 'ICU (Intensive Care Unit)',
      jenis_pelayanan: 'Rawat Inap',
      penjamin: 'Umum / Tunai',
      dokter_pengirim: 'dr. Farhan Malik, Sp.An-KIC',
      tanggal_order: '2026-08-26',
      waktu_order: '09:00 WIB',
      prioritas: 'Cito / Emergency',
      diagnosa_klinis: 'Sepsis Berat ec Pneumonia Komunitas + ARDS On Ventilator',
      catatan_klinis: 'Pasien intubasi, sesak berat, desaturasi, evaluasi analisa gas darah dan biomarker sepsis.',
      status: 'Sedang Dianalisis',
      sampling_info: {
        waktu_sampling: '09:05 WIB',
        petugas_phlebotomist: 'Bambang Irawan, A.Md.AK',
        lokasi_pengambilan: 'Bed 03 ICU Sentral',
        kondisi_sampel: 'Baik / Homogen',
        volume_cukup: true,
        wadah_tabung: ['Tabung Heparin (Hijau)', 'Tabung Serum Gel (Kuning)'],
        barcode_specimen: 'SPEC-260826-0003-HEP'
      },
      waktu_terima_lab: '09:10 WIB',
      analis_pemeriksa: 'Rian Hidayat, S.Tr.Kes',
      tests_ordered: [
        { kode: 'LAB-ELE-02', nama_pemeriksaan: 'Analisa Gas Darah (AGD / BGA)', kategori: 'Elektrolit & Gas Darah', biaya: 220000, wadah_sampel: 'Tabung Heparin (Hijau)', loinc_code: '24338-6' },
        { kode: 'LAB-ELE-01', nama_pemeriksaan: 'Elektrolit Serum (Na, K, Cl)', kategori: 'Elektrolit & Gas Darah', biaya: 135000, wadah_sampel: 'Tabung Serum Gel (Kuning)', loinc_code: '2951-2' },
        { kode: 'LAB-IMU-04', nama_pemeriksaan: 'C-Reactive Protein (CRP Kuantitatif)', kategori: 'Imunoserologi & Infeksi', biaya: 140000, wadah_sampel: 'Tabung Serum Gel (Kuning)', loinc_code: '1988-5' }
      ],
      total_biaya: 495000,
      parameter_results: []
    },
    {
      id: 'LAB-260826-0004',
      no_order_rs: 'ORD-LAB-9924',
      no_rm: 'RM-260822-0105',
      nama_pasien: 'Tn. Ahmad Fauzi',
      nik: '3273041503650004',
      jenis_kelamin: 'L',
      tanggal_lahir: '1965-03-15',
      umur: '61 Th',
      ruangan_asal: 'IGD (Instalasi Gawat Darurat)',
      jenis_pelayanan: 'IGD',
      penjamin: 'BPJS Kesehatan',
      dokter_pengirim: 'dr. Ahmad Dahlan, Sp.JP',
      tanggal_order: '2026-08-26',
      waktu_order: '09:15 WIB',
      prioritas: 'Cito / Emergency',
      diagnosa_klinis: 'Acute Coronary Syndrome (ACS) Suspek NSTEMI',
      catatan_klinis: 'Nyeri dada retrosternal menjalar ke lengan kiri dan leher sejak 2 jam SMRS, keringat dingin (+).',
      status: 'Selesai & Tervalidasi',
      sampling_info: {
        waktu_sampling: '09:20 WIB',
        petugas_phlebotomist: 'Bambang Irawan, A.Md.AK',
        lokasi_pengambilan: 'Bed 01 Resusitasi IGD',
        kondisi_sampel: 'Baik / Homogen',
        volume_cukup: true,
        wadah_tabung: ['Tabung Heparin (Hijau)'],
        barcode_specimen: 'SPEC-260826-0004-CARD'
      },
      waktu_terima_lab: '09:22 WIB',
      analis_pemeriksa: 'Siti Nurhaliza, S.Tr.Kes',
      waktu_selesai_analisis: '09:42 WIB',
      dokter_sp_pk: 'dr. Hendra Gunawan, Sp.PK',
      waktu_validasi: '09:45 WIB',
      status_validasi: 'Final / Tervalidasi',
      qr_verifikasi_code: 'MYITARU-LAB-VERIFIED-20260826-0004-PK',
      tests_ordered: [
        { kode: 'LAB-IMU-03', nama_pemeriksaan: 'Troponin I Kuantitatif (Cardiac Marker Cito)', kategori: 'Imunoserologi & Infeksi', biaya: 285000, wadah_sampel: 'Tabung Heparin (Hijau)', loinc_code: '48425-3' }
      ],
      total_biaya: 285000,
      parameter_results: [
        { id: 'PR-20', test_code: 'TROP_I', parameter_name: 'High-Sensitivity Troponin I', hasil: 842.5, nilai_rujukan: '< 26.0', satuan: 'ng/L', flag: 'HH', is_critical: true, metode_pemeriksaan: 'hs-CLIA Architect' }
      ],
      interpretasi_sp_pk: 'NILAI KRITIS (CRITICAL VALUE): High-Sensitivity Troponin I meningkat masif (842.5 ng/L, cut-off < 26 ng/L). Sangat mengindikasikan adanya cedera/nekrosis miokard akut aktif (Myocardial Infarction).',
      saran_klinis: 'Segera lakukan tatalaksana ACS/NSTEMI agresif, pemberian DAPT, antikoagulan, dan persiapan kateterisasi jantung/PCI bila diindikasikan.',
      critical_finding: {
        is_critical: true,
        is_reported: true,
        reported_at: '09:47 WIB',
        reported_by: 'dr. Hendra Gunawan, Sp.PK',
        received_by: 'dr. Ahmad Dahlan, Sp.JP (DPJP Kardiologi)',
        room: 'IGD Resusitasi Bed 01',
        method: 'Telepon / SBAR',
        notes: 'Nilai Kritis Troponin I 842.5 ng/L dilaporkan langsung ke dr. Ahmad Dahlan via hotline IGD dan telah dikonfirmasi dengan teknik SBAR.'
      },
      ai_pathology_analysis: {
        clinical_summary: 'Positive High-Risk Cardiac Biomarker (Troponin I Elevation > 30x upper limit).',
        key_findings: ['Troponin I 842.5 ng/L (Marked Elevation)'],
        differential_considerations: ['NSTEMI / STEMI', 'Acute Myocarditis', 'Takotsubo Cardiomyopathy'],
        recommended_follow_up: ['Serial EKG 12-lead', 'Echocardiography Bedside', 'Aktivasi Code STEMI / Cath Lab Team'],
        confidence_score: 99
      }
    },
    {
      id: 'LAB-260826-0005',
      no_order_rs: 'ORD-LAB-9925',
      no_rm: 'RM-260819-0056',
      nama_pasien: 'Sdr. Kevin Sanjaya',
      nik: '3273052001990005',
      jenis_kelamin: 'L',
      tanggal_lahir: '1999-01-20',
      umur: '27 Th',
      ruangan_asal: 'Medical Check Up (MCU)',
      jenis_pelayanan: 'MCU',
      penjamin: 'Umum / Tunai',
      dokter_pengirim: 'dr. Ratna Sari, Sp.Ok',
      tanggal_order: '2026-08-26',
      waktu_order: '09:30 WIB',
      prioritas: 'Rutin',
      diagnosa_klinis: 'Skrining Pra-Kerja Karyawan Baru (Medical Check-up Lengkap)',
      catatan_klinis: 'Pemeriksaan kesehatan menyeluruh termasuk tes bebas narkoba.',
      status: 'Sampling / Pengambilan',
      tests_ordered: [
        { kode: 'LAB-HEM-01', nama_pemeriksaan: 'Hematologi Lengkap (CBC + Diff)', kategori: 'Hematologi', biaya: 95000, wadah_sampel: 'Tabung EDTA (Ungu)', loinc_code: '58410-2' },
        { kode: 'LAB-URI-01', nama_pemeriksaan: 'Urinalisis Lengkap (Urine Rutin & Sedimen)', kategori: 'Urinalisis & Feses', biaya: 65000, wadah_sampel: 'Pot Urine Steril', loinc_code: '24357-6' },
        { kode: 'LAB-IMU-02', nama_pemeriksaan: 'Hepatitis B Surface Antigen (HBsAg Kualitatif)', kategori: 'Imunoserologi & Infeksi', biaya: 110000, wadah_sampel: 'Tabung Serum Gel (Kuning)', loinc_code: '5196-1' },
        { kode: 'LAB-TOX-01', nama_pemeriksaan: 'Skrining Narkoba 6 Parameter', kategori: 'Toksikologi & Narkoba', biaya: 250000, wadah_sampel: 'Pot Urine Steril', loinc_code: '44018-0' }
      ],
      total_biaya: 520000,
      parameter_results: []
    },
    {
      id: 'LAB-260826-0006',
      no_order_rs: 'ORD-LAB-9926',
      no_rm: 'RM-260816-0033',
      nama_pasien: 'Ny. Siti Aminah',
      nik: '3273066011750006',
      jenis_kelamin: 'P',
      tanggal_lahir: '1975-11-20',
      umur: '50 Th',
      ruangan_asal: 'Bangsal Teratai (Ranap Kelas 1)',
      jenis_pelayanan: 'Rawat Inap',
      penjamin: 'Asuransi Mandiri Inhealth',
      dokter_pengirim: 'dr. Hendra Gunawan, Sp.PD-KGEH',
      tanggal_order: '2026-08-26',
      waktu_order: '09:45 WIB',
      prioritas: 'Rutin',
      diagnosa_klinis: 'Ikterus Obstruktif Suspek Kolelitiasis / Koledokolitiasis',
      catatan_klinis: 'Sclera ikterik, BAK pekat seperti teh, nyeri perut kuadran kanan atas.',
      status: 'Order Masuk',
      tests_ordered: [
        { kode: 'LAB-KIM-05', nama_pemeriksaan: 'Fungsi Hati (SGOT, SGPT & Bilirubin)', kategori: 'Kimia Klinik', biaya: 145000, wadah_sampel: 'Tabung Serum Gel (Kuning)', loinc_code: '1920-8' }
      ],
      total_biaya: 145000,
      parameter_results: []
    }
  ];
}
