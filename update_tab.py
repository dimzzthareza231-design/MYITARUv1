import sys

with open('src/components/Registration/Tabs/DataMedisTab.tsx', 'r') as f:
    content = f.read()

old_handle = """  const handleTalkToTextResult = (result: any) => {
    // Populate data from AI result
    if (result.patient_info?.keluhan_utama) {
      onChange('keluhanUtama', result.patient_info.keluhan_utama);
    }
    
    if (result.vital_signs) {
      onChange('tandaVital', {
        ...data.tandaVital,
        td: result.vital_signs.tekanan_darah || data.tandaVital?.td || '',
        nadi: result.vital_signs.nadi?.toString() || data.tandaVital?.nadi || '',
        suhu: result.vital_signs.suhu?.toString() || data.tandaVital?.suhu || '',
      });
    }
    if (result.allergies && result.allergies.length > 0) {
      onChange('riwayatAlergi', result.allergies.map((a: any) => ({
        allergen: a.allergen,
        reaction: a.reaction,
        severity: 'Moderate'
      })));
    }
  };

  const handleTranscriptUpdate = (text: string) => {
    onChange('keluhanUtama', text);
  };"""

new_handle = """  const handleTalkToTextResult = (result: any) => {
    // HANYA isi form jika data benar-benar ada dari percakapan
    if (!result) return;

    // Keluhan Utama - hanya isi jika ada
    if (result.patient_info?.keluhan_utama && result.patient_info.keluhan_utama.trim()) {
      onChange('keluhanUtama', result.patient_info.keluhan_utama);
    }

    // Tanda Vital - hanya isi jika ada data
    if (result.vital_signs && Object.keys(result.vital_signs).length > 0) {
      const currentVitals = data.tandaVital || { td: '', nadi: '', suhu: '', rr: '', spo2: '' };
      onChange('tandaVital', {
        td: result.vital_signs.tekanan_darah || currentVitals.td,
        nadi: result.vital_signs.nadi?.toString() || currentVitals.nadi,
        suhu: result.vital_signs.suhu?.toString() || currentVitals.suhu,
        rr: result.vital_signs.respirasi?.toString() || currentVitals.rr,
        spo2: result.vital_signs.spo2?.toString() || currentVitals.spo2,
      });
    }

    // Alergi - hanya isi jika ada
    if (result.allergies && result.allergies.length > 0) {
      const newAllergies = result.allergies
        .filter((a: any) => a.allergen && a.allergen.trim())
        .map((a: any) => ({
          allergen: a.allergen,
          reaction: a.reaction || '',
          severity: a.severity || 'Moderate'
        }));
      if (newAllergies.length > 0) {
        const existingAllergies = data.riwayatAlergi || [];
        onChange('riwayatAlergi', [...existingAllergies, ...newAllergies]);
      }
    }

    // Problem List - hanya isi jika ada
    if (result.problem_list && result.problem_list.length > 0) {
      const newProblems = result.problem_list
        .filter((p: any) => p.problem && p.problem.trim())
        .map((p: any) => ({
          problem: p.problem,
          icd10: p.icd10 || '',
          onset: p.onset || new Date().toISOString().split('T')[0]
        }));
      if (newProblems.length > 0) {
        const existingProblems = data.problemList || [];
        onChange('problemList', [...existingProblems, ...newProblems]);
      }
    }

    // Obat - hanya isi jika ada
    if (result.medications && result.medications.length > 0) {
      const newMeds = result.medications
        .filter((m: any) => m.name && m.name.trim())
        .map((m: any) => ({
          nama: m.name,
          dosis: m.dose || '',
          frekuensi: m.frequency || ''
        }));
      if (newMeds.length > 0) {
        const existingMeds = data.obatKonsumsi || [];
        onChange('obatKonsumsi', [...existingMeds, ...newMeds]);
      }
    }
  };

  const handleTranscriptUpdate = (text: string) => {
    // HANYA update keluhan jika text tidak kosong
    if (text && text.trim()) {
      onChange('keluhanUtama', text);
    }
  };"""

content = content.replace(old_handle, new_handle)

with open('src/components/Registration/Tabs/DataMedisTab.tsx', 'w') as f:
    f.write(content)

print("Updated DataMedisTab.tsx")
