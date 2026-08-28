const MEDICAL_KEYWORDS = {
  keluhan: ['keluhan', 'mengeluh', 'sakit', 'nyeri', 'demam', 'pusing', 'mual', 'muntah', 'diare', 'batuk', 'sesak', 'lemas', 'gatal', 'bengkak'],
  diagnosis: {
    'diabetes': { code: 'E11.9', name: 'Type 2 Diabetes Mellitus', confidence: 90 },
    'hipertensi': { code: 'I10', name: 'Essential Hypertension', confidence: 92 },
    'darah tinggi': { code: 'I10', name: 'Essential Hypertension', confidence: 88 },
    'asma': { code: 'J45.9', name: 'Asthma', confidence: 85 },
    'pneumonia': { code: 'J18.9', name: 'Pneumonia', confidence: 90 },
    'demam berdarah': { code: 'A90', name: 'Dengue Fever', confidence: 95 },
    'tipes': { code: 'A01.0', name: 'Typhoid Fever', confidence: 90 },
    'migrain': { code: 'G43.9', name: 'Migraine', confidence: 85 },
    'gastritis': { code: 'K29.7', name: 'Gastritis', confidence: 88 },
    'maag': { code: 'K30', name: 'Dyspepsia', confidence: 80 }
  },
  obat: ['paracetamol', 'amoxicillin', 'omeprazole', 'metformin', 'amlodipine', 'ibuprofen'],
  alergi: ['alergi', 'penisilin', 'seafood', 'udang', 'kacang']
};

export function parseMedicalTranscript(transcript: string) {
  const result: any = {
    raw_text: transcript,
    confidence: 0,
    keluhan_utama: '',
    diagnosis_suggestion: [],
    obat_suggestion: [],
    alergi_detected: [],
    tanda_vital: {}
  };
  
  const text = transcript.toLowerCase();
  const sentences = text.split(/[.,!?]+/).filter(s => s.trim());
  
  // 1. Deteksi Keluhan
  const keluhanMatches: string[] = [];
  MEDICAL_KEYWORDS.keluhan.forEach(keyword => {
    if (text.includes(keyword)) {
      const sentence = sentences.find(s => s.includes(keyword));
      if (sentence && !keluhanMatches.includes(sentence.trim())) {
        keluhanMatches.push(sentence.trim());
      }
    }
  });
  result.keluhan_utama = keluhanMatches.join('. ') || 'Tidak terdeteksi';
  
  // 2. Deteksi Diagnosis
  Object.entries(MEDICAL_KEYWORDS.diagnosis).forEach(([keyword, icd]) => {
    if (text.includes(keyword)) {
      result.diagnosis_suggestion.push({ keyword, ...icd });
    }
  });
  
  // 3. Deteksi Obat
  MEDICAL_KEYWORDS.obat.forEach(keyword => {
    if (text.includes(keyword)) {
      const dosisPattern = new RegExp(`${keyword}\\s*(\\d+\\s*(mg|ml|gr|tablet))`, 'i');
      const dosisMatch = text.match(dosisPattern);
      result.obat_suggestion.push({
        nama: keyword,
        dosis: dosisMatch ? dosisMatch[1] : 'tidak disebutkan'
      });
    }
  });
  
  // 4. Deteksi Alergi
  MEDICAL_KEYWORDS.alergi.forEach(keyword => {
    if (text.includes(keyword)) {
      const index = text.indexOf(keyword);
      const afterKeyword = text.substring(index + keyword.length, index + keyword.length + 30);
      const allergen = afterKeyword.split(/[,.\s]/)[0];
      result.alergi_detected.push({ allergen: allergen || keyword });
    }
  });
  
  // 5. Deteksi Tanda Vital
  const tdMatch = text.match(/(\d{2,3})\s*[\/\\]\s*(\d{2,3})/);
  if (tdMatch) result.tanda_vital.tekanan_darah = `${tdMatch[1]}/${tdMatch[2]} mmHg`;
  
  const nadiMatch = text.match(/nadi\s*(\d{2,3})/i);
  if (nadiMatch) result.tanda_vital.nadi = `${nadiMatch[1]} bpm`;
  
  const suhuMatch = text.match(/suhu\s*(\d{2}\.?\d?)/i);
  if (suhuMatch) result.tanda_vital.suhu = `${suhuMatch[1]} °C`;
  
  const spo2Match = text.match(/spo2\s*(\d{2,3})/i);
  if (spo2Match) result.tanda_vital.spo2 = `${spo2Match[1]}%`;
  
  // 6. Hitung confidence
  let score = 0;
  if (result.keluhan_utama && result.keluhan_utama !== 'Tidak terdeteksi') score += 25;
  if (result.diagnosis_suggestion.length > 0) score += 25;
  if (Object.keys(result.tanda_vital).length > 0) score += 20;
  if (result.obat_suggestion.length > 0) score += 15;
  if (result.alergi_detected.length > 0) score += 15;
  result.confidence = Math.min(score, 100);
  
  return result;
}

export function generateSOAPFromParsing(parsed: any) {
  return {
    subjective: {
      keluhan_utama: parsed.keluhan_utama,
      riwayat_penyakit_sekarang: parsed.raw_text,
      riwayat_alergi: parsed.alergi_detected.map((a: any) => a.allergen).join(', ') || 'Tidak ada'
    },
    objective: {
      tanda_vital: parsed.tanda_vital,
      pemeriksaan_fisik: 'Sesuai keluhan pasien'
    },
    assessment: {
      diagnosis_primer: parsed.diagnosis_suggestion[0] || null,
      diagnosis_sekunder: parsed.diagnosis_suggestion.slice(1) || []
    },
    plan: {
      obat: parsed.obat_suggestion,
      edukasi: 'Pasien diedukasi tentang kondisi dan rencana perawatan'
    }
  };
}
