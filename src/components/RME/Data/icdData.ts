// ═══════════════════════════════════════════════════════════════════════════
// MYITARU SIMRS — DATABASE KODEFIKASI KLINIS ICD-10 & ICD-9-CM LENGKAP
// Standar WHO, Permenkes RI No. 24/2022 & INA-CBGs BPJS Kesehatan
// ═══════════════════════════════════════════════════════════════════════════

export interface ICD10Item {
  code: string;
  desc: string;
  desc_id: string;
  category: string;
  chapter: string;
  inacbg_hint?: string;
  chronic?: boolean;
}

export interface ICD9Item {
  code: string;
  desc: string;
  desc_id: string;
  category: string;
  unit: string;
  tarif_estimasi?: number;
}

export const ICD10_DATABASE: ICD10Item[] = [
  // BAB I: Penyakit Infeksi & Parasit (A00-B99)
  { code: 'A09', desc: 'Infectious gastroenteritis and colitis, unspecified', desc_id: 'Gastroenteritis Akut (Diare Akut Infeksi)', category: 'Penyakit Infeksi', chapter: 'Bab I (A00-B99)', inacbg_hint: 'K-4-17-I' },
  { code: 'A01.0', desc: 'Typhoid fever', desc_id: 'Demam Tifoid (Tipes)', category: 'Penyakit Infeksi', chapter: 'Bab I (A00-B99)', inacbg_hint: 'A-4-13-I' },
  { code: 'A90', desc: 'Dengue fever [classical dengue]', desc_id: 'Demam Dengue (DD)', category: 'Penyakit Infeksi', chapter: 'Bab I (A00-B99)', inacbg_hint: 'A-4-10-I' },
  { code: 'A91', desc: 'Dengue haemorrhagic fever', desc_id: 'Demam Berdarah Dengue (DBD / DHF)', category: 'Penyakit Infeksi', chapter: 'Bab I (A00-B99)', inacbg_hint: 'A-4-10-II' },
  { code: 'A15.0', desc: 'Tuberculosis of lung, confirmed by sputum microscopy', desc_id: 'Tuberkulosis Paru BTA Positif (TB Paru)', category: 'Penyakit Infeksi', chapter: 'Bab I (A00-B99)', inacbg_hint: 'J-4-10-I', chronic: true },
  { code: 'A16.2', desc: 'Tuberculosis of lung, without mention of bacteriological or histological confirmation', desc_id: 'Tuberkulosis Paru Klinis', category: 'Penyakit Infeksi', chapter: 'Bab I (A00-B99)', inacbg_hint: 'J-4-10-I', chronic: true },
  { code: 'B20', desc: 'Human immunodeficiency virus [HIV] disease resulting in infectious and parasitic diseases', desc_id: 'Infeksi HIV dengan Komplikasi', category: 'Penyakit Infeksi', chapter: 'Bab I (A00-B99)', inacbg_hint: 'A-4-15-I', chronic: true },
  { code: 'B18.2', desc: 'Chronic viral hepatitis C', desc_id: 'Hepatitis C Kronik', category: 'Penyakit Infeksi', chapter: 'Bab I (A00-B99)', inacbg_hint: 'H-4-12-I', chronic: true },
  { code: 'B18.1', desc: 'Chronic viral hepatitis B without delta-agent', desc_id: 'Hepatitis B Kronis', category: 'Penyakit Infeksi', chapter: 'Bab I (A00-B99)', inacbg_hint: 'H-4-12-I', chronic: true },
  { code: 'B01.9', desc: 'Varicella without complication', desc_id: 'Varicella (Cacar Air)', category: 'Penyakit Infeksi', chapter: 'Bab I (A00-B99)', inacbg_hint: 'A-4-11-I' },
  { code: 'B02.9', desc: 'Zoster without complication', desc_id: 'Herpes Zoster', category: 'Penyakit Infeksi', chapter: 'Bab I (A00-B99)', inacbg_hint: 'A-4-11-I' },
  { code: 'A41.9', desc: 'Sepsis, unspecified organism', desc_id: 'Sepsis Bakterial Berat', category: 'Penyakit Infeksi', chapter: 'Bab I (A00-B99)', inacbg_hint: 'A-4-14-III' },

  // BAB II: Neoplasma / Kanker (C00-D48)
  { code: 'C50.9', desc: 'Malignant neoplasm of breast, unspecified', desc_id: 'Kanker Payudara (Ca Mammae)', category: 'Neoplasma', chapter: 'Bab II (C00-D48)', inacbg_hint: 'C-4-13-I', chronic: true },
  { code: 'C53.9', desc: 'Malignant neoplasm of cervix uteri, unspecified', desc_id: 'Kanker Leher Rahim (Ca Serviks)', category: 'Neoplasma', chapter: 'Bab II (C00-D48)', inacbg_hint: 'C-4-14-I', chronic: true },
  { code: 'C34.9', desc: 'Malignant neoplasm of bronchus or lung, unspecified', desc_id: 'Kanker Paru (Ca Paru)', category: 'Neoplasma', chapter: 'Bab II (C00-D48)', inacbg_hint: 'C-4-11-I', chronic: true },
  { code: 'C18.9', desc: 'Malignant neoplasm of colon, unspecified', desc_id: 'Kanker Usus Besar (Ca Kolon)', category: 'Neoplasma', chapter: 'Bab II (C00-D48)', inacbg_hint: 'C-4-10-I', chronic: true },
  { code: 'D24', desc: 'Benign neoplasm of breast', desc_id: 'Fibroadenoma Mammae (FAM / Tumor Jinak Payudara)', category: 'Neoplasma', chapter: 'Bab II (C00-D48)', inacbg_hint: 'J-1-10-I' },
  { code: 'D25.9', desc: 'Leiomyoma of uterus, unspecified', desc_id: 'Mioma Uteri (Tumor Jinak Rahim)', category: 'Neoplasma', chapter: 'Bab II (C00-D48)', inacbg_hint: 'W-1-11-I' },

  // BAB IV: Endokrin, Nutrisi & Metabolik (E00-E90)
  { code: 'E11.9', desc: 'Type 2 diabetes mellitus without complications', desc_id: 'Diabetes Melitus Tipe 2 Tanpa Komplikasi (DM Tipe 2)', category: 'Endokrin', chapter: 'Bab IV (E00-E90)', inacbg_hint: 'E-4-10-I', chronic: true },
  { code: 'E11.5', desc: 'Type 2 diabetes mellitus with peripheral circulatory complications', desc_id: 'DM Tipe 2 dengan Angiopati / Ulkus Diabetikum', category: 'Endokrin', chapter: 'Bab IV (E00-E90)', inacbg_hint: 'E-4-10-II', chronic: true },
  { code: 'E11.2', desc: 'Type 2 diabetes mellitus with renal complications', desc_id: 'Nefropati Diabetik (DM Tipe 2 Ginjal)', category: 'Endokrin', chapter: 'Bab IV (E00-E90)', inacbg_hint: 'E-4-10-II', chronic: true },
  { code: 'E10.9', desc: 'Type 1 diabetes mellitus without complications', desc_id: 'Diabetes Melitus Tipe 1', category: 'Endokrin', chapter: 'Bab IV (E00-E90)', inacbg_hint: 'E-4-10-I', chronic: true },
  { code: 'E16.2', desc: 'Hypoglycaemia, unspecified', desc_id: 'Hipoglikemia Akut', category: 'Endokrin', chapter: 'Bab IV (E00-E90)', inacbg_hint: 'E-4-11-I' },
  { code: 'E05.9', desc: 'Thyrotoxicosis, unspecified', desc_id: 'Tirotoksikosis / Hipertiroidisme', category: 'Endokrin', chapter: 'Bab IV (E00-E90)', inacbg_hint: 'E-4-12-I', chronic: true },
  { code: 'E03.9', desc: 'Hypothyroidism, unspecified', desc_id: 'Hipotiroidisme', category: 'Endokrin', chapter: 'Bab IV (E00-E90)', inacbg_hint: 'E-4-12-I', chronic: true },
  { code: 'E78.5', desc: 'Hyperlipidaemia, unspecified', desc_id: 'Dislipidemia / Kolesterol Tinggi', category: 'Endokrin', chapter: 'Bab IV (E00-E90)', inacbg_hint: 'E-4-13-I', chronic: true },
  { code: 'E79.0', desc: 'Hyperuricaemia without signs of inflammatory arthritis', desc_id: 'Hiperurisemia (Asam Urat Tinggi)', category: 'Endokrin', chapter: 'Bab IV (E00-E90)', inacbg_hint: 'E-4-13-I' },
  { code: 'E66.9', desc: 'Obesity, unspecified', desc_id: 'Obesitas Klinis', category: 'Endokrin', chapter: 'Bab IV (E00-E90)', inacbg_hint: 'E-4-14-I' },
  { code: 'E46', desc: 'Unspecified protein-energy malnutrition', desc_id: 'Gizi Buruk / Malnutrisi Energi Protein (MEP)', category: 'Endokrin', chapter: 'Bab IV (E00-E90)', inacbg_hint: 'K-4-18-I' },

  // BAB IX: Sistem Kardiovaskular & Sirkulasi (I00-I99)
  { code: 'I10', desc: 'Essential (primary) hypertension', desc_id: 'Hipertensi Primer (Tekanan Darah Tinggi)', category: 'Kardiovaskular', chapter: 'Bab IX (I00-I99)', inacbg_hint: 'I-4-17-I', chronic: true },
  { code: 'I11.0', desc: 'Hypertensive heart disease with (congestive) heart failure', desc_id: 'Penyakit Jantung Hipertensi dengan Gagal Jantung (HHD + CHF)', category: 'Kardiovaskular', chapter: 'Bab IX (I00-I99)', inacbg_hint: 'I-4-12-II', chronic: true },
  { code: 'I50.9', desc: 'Heart failure, unspecified', desc_id: 'Gagal Jantung Kongestif (CHF / Dekompensasi Kordis)', category: 'Kardiovaskular', chapter: 'Bab IX (I00-I99)', inacbg_hint: 'I-4-12-I', chronic: true },
  { code: 'I25.1', desc: 'Atherosclerotic heart disease', desc_id: 'Penyakit Jantung Koroner (PJK / CAD)', category: 'Kardiovaskular', chapter: 'Bab IX (I00-I99)', inacbg_hint: 'I-4-10-I', chronic: true },
  { code: 'I20.9', desc: 'Angina pectoris, unspecified', desc_id: 'Angina Pectoris (Nyeri Dada Koroner)', category: 'Kardiovaskular', chapter: 'Bab IX (I00-I99)', inacbg_hint: 'I-4-10-I' },
  { code: 'I21.9', desc: 'Acute myocardial infarction, unspecified', desc_id: 'Infark Miokard Akut (IMA / Serangan Jantung)', category: 'Kardiovaskular', chapter: 'Bab IX (I00-I99)', inacbg_hint: 'I-4-11-II' },
  { code: 'I63.9', desc: 'Cerebral infarction, unspecified', desc_id: 'Stroke Non-Hemoragik (Stroke Iskemik / Sumbatan)', category: 'Kardiovaskular', chapter: 'Bab IX (I00-I99)', inacbg_hint: 'I-4-14-I', chronic: true },
  { code: 'I61.9', desc: 'Nontraumatic intracerebral haemorrhage, unspecified', desc_id: 'Stroke Hemoragik (Pendarahan Otak)', category: 'Kardiovaskular', chapter: 'Bab IX (I00-I99)', inacbg_hint: 'I-4-14-II' },
  { code: 'I48.9', desc: 'Atrial fibrillation and atrial flutter, unspecified', desc_id: 'Atrial Fibrilasi (Aritmia Jantung)', category: 'Kardiovaskular', chapter: 'Bab IX (I00-I99)', inacbg_hint: 'I-4-15-I', chronic: true },
  { code: 'I84.9', desc: 'Haemorrhoids without complication, unspecified', desc_id: 'Hemoroid (Wasir / Ambeien)', category: 'Kardiovaskular', chapter: 'Bab IX (I00-I99)', inacbg_hint: 'K-1-12-I' },

  // BAB X: Sistem Respirasi (J00-J99)
  { code: 'J06.9', desc: 'Acute upper respiratory infection, unspecified', desc_id: 'Infeksi Saluran Pernapasan Akut (ISPA)', category: 'Respirasi', chapter: 'Bab X (J00-J99)', inacbg_hint: 'J-4-16-I' },
  { code: 'J00', desc: 'Acute nasopharyngitis [common cold]', desc_id: 'Common Cold (Flu / Pilek Akut)', category: 'Respirasi', chapter: 'Bab X (J00-J99)', inacbg_hint: 'J-4-16-I' },
  { code: 'J02.9', desc: 'Acute pharyngitis, unspecified', desc_id: 'Faringitis Akut (Radang Tenggorokan)', category: 'Respirasi', chapter: 'Bab X (J00-J99)', inacbg_hint: 'J-4-16-I' },
  { code: 'J03.9', desc: 'Acute tonsillitis, unspecified', desc_id: 'Tonsilitis Akut (Radang Amandel)', category: 'Respirasi', chapter: 'Bab X (J00-J99)', inacbg_hint: 'J-4-16-I' },
  { code: 'J18.9', desc: 'Pneumonia, unspecified organism', desc_id: 'Pneumonia Komunitas (Radang Paru Akut)', category: 'Respirasi', chapter: 'Bab X (J00-J99)', inacbg_hint: 'J-4-14-I' },
  { code: 'J20.9', desc: 'Acute bronchitis, unspecified', desc_id: 'Bronkitis Akut', category: 'Respirasi', chapter: 'Bab X (J00-J99)', inacbg_hint: 'J-4-15-I' },
  { code: 'J45.9', desc: 'Asthma, unspecified', desc_id: 'Asma Bronkial Akut & Kronik', category: 'Respirasi', chapter: 'Bab X (J00-J99)', inacbg_hint: 'J-4-13-I', chronic: true },
  { code: 'J44.9', desc: 'Chronic obstructive pulmonary disease, unspecified', desc_id: 'Penyakit Paru Obstruktif Kronis (PPOK)', category: 'Respirasi', chapter: 'Bab X (J00-J99)', inacbg_hint: 'J-4-12-I', chronic: true },
  { code: 'J90', desc: 'Pleural effusion, not elsewhere classified', desc_id: 'Efusi Pleura (Cairan Paru)', category: 'Respirasi', chapter: 'Bab X (J00-J99)', inacbg_hint: 'J-4-11-I' },

  // BAB XI: Sistem Pencernaan (K00-K93)
  { code: 'K21.0', desc: 'Gastro-oesophageal reflux disease with oesophagitis', desc_id: 'GERD dengan Esofagitis', category: 'Pencernaan', chapter: 'Bab XI (K00-K93)', inacbg_hint: 'K-4-15-I', chronic: true },
  { code: 'K21.9', desc: 'Gastro-oesophageal reflux disease without oesophagitis', desc_id: 'GERD (Refluks Asam Lambung)', category: 'Pencernaan', chapter: 'Bab XI (K00-K93)', inacbg_hint: 'K-4-15-I', chronic: true },
  { code: 'K29.7', desc: 'Gastritis, unspecified', desc_id: 'Gastritis Akut / Kronik (Sakit Maag)', category: 'Pencernaan', chapter: 'Bab XI (K00-K93)', inacbg_hint: 'K-4-15-I' },
  { code: 'K30', desc: 'Dyspepsia', desc_id: 'Dispepsia Fungsional', category: 'Pencernaan', chapter: 'Bab XI (K00-K93)', inacbg_hint: 'K-4-15-I' },
  { code: 'K35.8', desc: 'Other and unspecified acute appendicitis', desc_id: 'Apendisitis Akut (Radang Usus Buntu)', category: 'Pencernaan', chapter: 'Bab XI (K00-K93)', inacbg_hint: 'K-1-10-I' },
  { code: 'K80.2', desc: 'Calculus of gallbladder without cholecystitis', desc_id: 'Kolelitiasis (Batu Empedu)', category: 'Pencernaan', chapter: 'Bab XI (K00-K93)', inacbg_hint: 'K-1-11-I' },
  { code: 'K40.9', desc: 'Unilateral inguinal hernia, without obstruction or gangrene', desc_id: 'Hernia Inguinalis Lateralis (HIL / Turun Berok)', category: 'Pencernaan', chapter: 'Bab XI (K00-K93)', inacbg_hint: 'K-1-13-I' },
  { code: 'K76.0', desc: 'Fatty (change of) liver, not elsewhere classified', desc_id: 'Perlemakan Hati (Fatty Liver)', category: 'Pencernaan', chapter: 'Bab XI (K00-K93)', inacbg_hint: 'H-4-13-I', chronic: true },
  { code: 'K70.3', desc: 'Alcoholic cirrhosis of liver', desc_id: 'Sirosis Hati', category: 'Pencernaan', chapter: 'Bab XI (K00-K93)', inacbg_hint: 'H-4-11-II', chronic: true },

  // BAB XIII: Muskuloskeletal & Jaringan Ikat (M00-M99)
  { code: 'M54.5', desc: 'Low back pain', desc_id: 'Low Back Pain (LBP / Nyeri Pinggang Bawah)', category: 'Muskuloskeletal', chapter: 'Bab XIII (M00-M99)', inacbg_hint: 'M-4-12-I', chronic: true },
  { code: 'M17.9', desc: 'Osteoarthritis of knee, unspecified', desc_id: 'Osteoartritis Sendi Lutut (OA Genu)', category: 'Muskuloskeletal', chapter: 'Bab XIII (M00-M99)', inacbg_hint: 'M-4-10-I', chronic: true },
  { code: 'M10.9', desc: 'Gout, unspecified', desc_id: 'Artritis Gout Akut (Nyeri Sendi Asam Urat)', category: 'Muskuloskeletal', chapter: 'Bab XIII (M00-M99)', inacbg_hint: 'M-4-11-I' },
  { code: 'M06.9', desc: 'Rheumatoid arthritis, unspecified', desc_id: 'Reumatoid Artritis', category: 'Muskuloskeletal', chapter: 'Bab XIII (M00-M99)', inacbg_hint: 'M-4-11-I', chronic: true },
  { code: 'M79.1', desc: 'Myalgia', desc_id: 'Mialgia (Nyeri Otot & Pegal Linu)', category: 'Muskuloskeletal', chapter: 'Bab XIII (M00-M99)', inacbg_hint: 'M-4-13-I' },
  { code: 'M77.9', desc: 'Enthesopathy, unspecified', desc_id: 'Tendinitis / Nyeri Sendi Tendon', category: 'Muskuloskeletal', chapter: 'Bab XIII (M00-M99)', inacbg_hint: 'M-4-13-I' },

  // BAB XIV: Genitourinaria / Ginjal & Saluran Kemih (N00-N99)
  { code: 'N39.0', desc: 'Urinary tract infection, site not specified', desc_id: 'Infeksi Saluran Kemih (ISK)', category: 'Genitourinaria', chapter: 'Bab XIV (N00-N99)', inacbg_hint: 'N-4-14-I' },
  { code: 'N18.9', desc: 'Chronic kidney disease, unspecified', desc_id: 'Gagal Ginjal Kronis (GGK / CKD)', category: 'Genitourinaria', chapter: 'Bab XIV (N00-N99)', inacbg_hint: 'N-4-10-II', chronic: true },
  { code: 'N17.9', desc: 'Acute kidney failure, unspecified', desc_id: 'Gagal Ginjal Akut (GGA / AKI)', category: 'Genitourinaria', chapter: 'Bab XIV (N00-N99)', inacbg_hint: 'N-4-10-I' },
  { code: 'N20.1', desc: 'Calculus of ureter', desc_id: 'Batu Saluran Kemih / Ureter (Ureterolitiasis)', category: 'Genitourinaria', chapter: 'Bab XIV (N00-N99)', inacbg_hint: 'N-1-10-I' },
  { code: 'N20.0', desc: 'Calculus of kidney', desc_id: 'Batu Ginjal (Nefrolitiasis)', category: 'Genitourinaria', chapter: 'Bab XIV (N00-N99)', inacbg_hint: 'N-1-10-I' },
  { code: 'N40', desc: 'Hyperplasia of prostate', desc_id: 'Pembesaran Prostat Jinak (BPH)', category: 'Genitourinaria', chapter: 'Bab XIV (N00-N99)', inacbg_hint: 'N-1-11-I', chronic: true },

  // BAB XVIII: Gejala, Tanda & Kelainan Klinis (R00-R99)
  { code: 'R50.9', desc: 'Fever, unspecified', desc_id: 'Febris (Demam Tanpa Penyebab Jelas)', category: 'Gejala Umum', chapter: 'Bab XVIII (R00-R99)', inacbg_hint: 'A-4-10-I' },
  { code: 'R51', desc: 'Headache', desc_id: 'Sefalgia (Sakit Kepala Akut)', category: 'Gejala Umum', chapter: 'Bab XVIII (R00-R99)', inacbg_hint: 'G-4-14-I' },
  { code: 'R07.4', desc: 'Chest pain, unspecified', desc_id: 'Nyeri Dada (Chest Pain)', category: 'Gejala Umum', chapter: 'Bab XVIII (R00-R99)', inacbg_hint: 'I-4-18-I' },
  { code: 'R10.4', desc: 'Other and unspecified abdominal pain', desc_id: 'Kolik Abdomen / Sakit Perut Akut', category: 'Gejala Umum', chapter: 'Bab XVIII (R00-R99)', inacbg_hint: 'K-4-16-I' },
  { code: 'R42', desc: 'Dizziness and giddiness', desc_id: 'Vertigo / Pusing Berputar', category: 'Gejala Umum', chapter: 'Bab XVIII (R00-R99)', inacbg_hint: 'G-4-15-I' },
  { code: 'R05', desc: 'Cough', desc_id: 'Batuk Akut / Kronik', category: 'Gejala Umum', chapter: 'Bab XVIII (R00-R99)', inacbg_hint: 'J-4-16-I' },
  { code: 'R06.0', desc: 'Dyspnoea', desc_id: 'Sesak Napas', category: 'Gejala Umum', chapter: 'Bab XVIII (R00-R99)', inacbg_hint: 'J-4-16-I' },
  { code: 'R55', desc: 'Syncope and collapse', desc_id: 'Sinkop / Pingsan Mendadak', category: 'Gejala Umum', chapter: 'Bab XVIII (R00-R99)', inacbg_hint: 'I-4-19-I' },

  // BAB XIX: Cedera, Keracunan & Trauma (S00-T98)
  { code: 'S06.0', desc: 'Concussion', desc_id: 'Cedera Kepala Ringan (CKR / Gegar Otak)', category: 'Trauma & Bedah', chapter: 'Bab XIX (S00-T98)', inacbg_hint: 'G-4-10-I' },
  { code: 'S01.0', desc: 'Open wound of scalp', desc_id: 'Luka Robek Kulit Kepala (Vulnus Laceratum)', category: 'Trauma & Bedah', chapter: 'Bab XIX (S00-T98)', inacbg_hint: 'J-1-11-I' },
  { code: 'S52.5', desc: 'Fracture of lower end of radius', desc_id: 'Fraktur Tulang Radius Bawah (Patah Lengan)', category: 'Trauma & Bedah', chapter: 'Bab XIX (S00-T98)', inacbg_hint: 'M-1-10-I' },
  { code: 'S72.0', desc: 'Fracture of neck of femur', desc_id: 'Fraktur Leher Tulang Paha (Fraktur Femur)', category: 'Trauma & Bedah', chapter: 'Bab XIX (S00-T98)', inacbg_hint: 'M-1-11-I' },
  { code: 'T14.1', desc: 'Open wound of unspecified body region', desc_id: 'Luka Terbuka / Luka Robek (Vulnus)', category: 'Trauma & Bedah', chapter: 'Bab XIX (S00-T98)', inacbg_hint: 'J-1-12-I' },
  { code: 'T20.0', desc: 'Burn of unspecified degree of head and neck', desc_id: 'Luka Bakar (Combustio)', category: 'Trauma & Bedah', chapter: 'Bab XIX (S00-T98)', inacbg_hint: 'J-4-17-I' }
];

export const ICD9_DATABASE: ICD9Item[] = [
  // DIAGNOSTIK & MONITORING
  { code: '89.52', desc: 'Electrocardiogram', desc_id: 'Elektrokardiogram (EKG 12-Lead)', category: 'Diagnostik', unit: 'Poli Jantung / IGD', tarif_estimasi: 125000 },
  { code: '87.44', desc: 'Routine chest x-ray, so described', desc_id: 'Rontgen Foto Thorax PA/AP', category: 'Radiologi', unit: 'Instalasi Radiologi', tarif_estimasi: 175000 },
  { code: '88.76', desc: 'Diagnostic ultrasound of abdomen and retroperitoneum', desc_id: 'USG Abdomen Lengkap', category: 'Radiologi', unit: 'Instalasi Radiologi', tarif_estimasi: 250000 },
  { code: '88.72', desc: 'Diagnostic ultrasound of heart', desc_id: 'Ekokardiografi (USG Jantung)', category: 'Diagnostik', unit: 'Poli Jantung', tarif_estimasi: 550000 },
  { code: '87.03', desc: 'Computerized axial tomography of head', desc_id: 'CT-Scan Kepala / Otak Tanpa Kontras', category: 'Radiologi', unit: 'Instalasi Radiologi', tarif_estimasi: 850000 },
  { code: '45.13', desc: 'Other endoscopy of small intestine', desc_id: 'Esofagogastroduodenoskopi (Endoskopi Saluran Cerna Atas)', category: 'Diagnostik', unit: 'Poli Gastro / Endoskopi', tarif_estimasi: 1200000 },
  { code: '89.39', desc: 'Other nonoperative measurements and examinations', desc_id: 'Pemeriksaan Spirometri (Fungsi Paru)', category: 'Diagnostik', unit: 'Poli Paru', tarif_estimasi: 200000 },
  { code: '89.14', desc: 'Electroencephalogram', desc_id: 'Elektroensefalografi (EEG Rekam Gelombang Otak)', category: 'Diagnostik', unit: 'Poli Saraf', tarif_estimasi: 450000 },

  // TINDAKAN TERAPI, INJEKSI & RUANG PERAWATAN
  { code: '99.21', desc: 'Injection of antibiotic', desc_id: 'Pemberian Injeksi Antibiotik Intravena (IV)', category: 'Terapi & Injeksi', unit: 'Bangsal / Rawat Inap', tarif_estimasi: 45000 },
  { code: '99.04', desc: 'Transfusion of packed cells', desc_id: 'Transfusi Darah / Packed Red Cells (PRC)', category: 'Terapi & Injeksi', unit: 'Bangsal / IGD', tarif_estimasi: 350000 },
  { code: '99.15', desc: 'Parenteral infusion of concentrated nutritional substances', desc_id: 'Infus Nutrisi Parenteral Konsentrat (TPN)', category: 'Terapi & Injeksi', unit: 'Bangsal / ICU', tarif_estimasi: 150000 },
  { code: '93.94', desc: 'Respiratory medication administered by nebulizer', desc_id: 'Inhalasi Terapi Nebulisasi', category: 'Terapi & Injeksi', unit: 'Poli Paru / IGD', tarif_estimasi: 65000 },
  { code: '38.93', desc: 'Venous catheterization, not elsewhere classified', desc_id: 'Pemasangan Kanula Infus Intravena (IV Catheter)', category: 'Prosedur Klinis', unit: 'Seluruh Unit', tarif_estimasi: 50000 },
  { code: '96.04', desc: 'Insertion of endotracheal tube', desc_id: 'Intubasi Pipa Endotrakeal (Pemasangan ETT)', category: 'Gawat Darurat & ICU', unit: 'IGD / ICU / OK', tarif_estimasi: 400000 },
  { code: '96.71', desc: 'Continuous invasive mechanical ventilation for less than 96 consecutive hours', desc_id: 'Ventilator Mekanik Invasif (< 96 Jam)', category: 'Gawat Darurat & ICU', unit: 'ICU', tarif_estimasi: 1500000 },
  { code: '93.90', desc: 'Non-invasive mechanical ventilation', desc_id: 'Ventilasi Non-Invasif (CPAP / BiPAP)', category: 'Gawat Darurat & ICU', unit: 'ICU / IGD', tarif_estimasi: 650000 },
  { code: '39.95', desc: 'Hemodialysis', desc_id: 'Hemodialisa Rutin (Cuci Darah)', category: 'Prosedur Khusus', unit: 'Unit Hemodialisa', tarif_estimasi: 950000 },
  { code: '93.39', desc: 'Other physical therapy', desc_id: 'Fisioterapi & Rehabilitasi Medik', category: 'Rehabilitasi', unit: 'Instalasi Rehab Medik', tarif_estimasi: 110000 },

  // PROSEDUR BEDAH & KAMAR OPERASI
  { code: '47.09', desc: 'Other appendectomy', desc_id: 'Apendektomi (Operasi Usus Buntu)', category: 'Bedah & Operasi', unit: 'Kamar Operasi (OK)', tarif_estimasi: 4500000 },
  { code: '74.1', desc: 'Low cervical cesarean section', desc_id: 'Sectio Caesarea (Operasi Sesar Transperitoneal)', category: 'Kebidanan & Bedah', unit: 'Kamar Bersalin / OK', tarif_estimasi: 6500000 },
  { code: '86.22', desc: 'Excisional debridement of wound, infection, or burn', desc_id: 'Debridement & Pembersihan Luka Bedah', category: 'Bedah & Operasi', unit: 'Kamar Operasi / IGD', tarif_estimasi: 850000 },
  { code: '86.59', desc: 'Closure of skin and subcutaneous tissue of other sites', desc_id: 'Penjahitan Luka Terbuka (Hecting)', category: 'Bedah & Operasi', unit: 'IGD / Bedah Minor', tarif_estimasi: 150000 },
  { code: '79.35', desc: 'Open reduction of fracture with internal fixation, femur', desc_id: 'ORIF Fraktur Femur (Operasi Patah Tulang Paha)', category: 'Bedah & Operasi', unit: 'Kamar Operasi (OK)', tarif_estimasi: 9500000 },
  { code: '54.91', desc: 'Percutaneous abdominal drainage', desc_id: 'Drainase Perkutan Cairan Abdomen (Paracentesis)', category: 'Prosedur Klinis', unit: 'Bangsal / OK', tarif_estimasi: 350000 },
  { code: '53.00', desc: 'Unilateral repair of inguinal hernia, not otherwise specified', desc_id: 'Herniorafi / Operasi Hernia Inguinalis', category: 'Bedah & Operasi', unit: 'Kamar Operasi (OK)', tarif_estimasi: 5200000 },
  { code: '51.22', desc: 'Cholecystectomy', desc_id: 'Kolesistektomi (Operasi Pengangkatan Kantung Empedu)', category: 'Bedah & Operasi', unit: 'Kamar Operasi (OK)', tarif_estimasi: 7800000 },
  { code: '93.54', desc: 'Application of other cast', desc_id: 'Pemasangan Gips Imobilisasi Fraktur', category: 'Prosedur Klinis', unit: 'Poli Orthopedi / IGD', tarif_estimasi: 220000 }
];
