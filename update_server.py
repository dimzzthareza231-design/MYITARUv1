import sys

with open('server.ts', 'r') as f:
    content = f.read()

old_logic = """      const prompt = `You are MY ITARU AI, a world-class Clinical Decision Support System and Medical Assistant.
Analyze the following clinical note or transcription provided by a doctor.

Clinical Note:
"${clinicalNote}"

Perform the following tasks:
1. Convert the note into a structured SOAP format (Subjective, Objective, Assessment, Plan).
2. Recommend likely ICD-10 codes based on the assessment.
3. Recommend likely ICD-9-CM codes based on the assessment.
4. Provide a clinical summary (Resume Medis).
5. Identify any missing critical data or potential drug interaction warnings (if applicable based on the context).
6. Provide a recommendation for next steps.

IMPORTANT: You are an assistant, NOT a doctor. Ensure you state that this is for clinical decision support only and not a final diagnosis.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              soap: {
                type: Type.OBJECT,
                properties: {
                  subjective: { type: Type.STRING },
                  objective: { type: Type.STRING },
                  assessment: { type: Type.STRING },
                  plan: { type: Type.STRING }
                }
              },
              icd10: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    code: { type: Type.STRING },
                    description: { type: Type.STRING }
                  }
                }
              },
              icd9: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    code: { type: Type.STRING },
                    description: { type: Type.STRING }
                  }
                }
              },
              resume: { type: Type.STRING },
              warnings: { type: Type.ARRAY, items: { type: Type.STRING } },
              recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
              disclaimer: { type: Type.STRING }
            },
            required: ['soap', 'icd10', 'icd9', 'resume', 'warnings', 'recommendations', 'disclaimer']
          }
        }
      });"""

new_logic = """      let prompt = '';
      let responseSchema: any = null;
      let requiredFields: string[] = [];

      if (req.body.context === 'registration') {
        prompt = `Anda adalah asisten AI untuk sistem pendaftaran klinik. Analisis percakapan antara petugas pendaftaran, dokter, dan pasien berikut ini.

Percakapan:
"${clinicalNote}"

Ekstrak informasi berikut dari percakapan (jika ada):
1. Keluhan utama pasien
2. Tanda-tanda vital (tekanan darah, nadi, suhu, respirasi, SpO2)
3. Alergi yang disebutkan
4. Masalah kesehatan yang disebutkan
5. Obat yang sedang dikonsumsi

PENTING:
- Hanya ekstrak data yang BENAR-BENAR disebutkan dalam percakapan
- Jangan mengarang atau menambahkan data yang tidak ada
- Jika tidak ada data untuk kategori tertentu, biarkan kosong`;
        
        responseSchema = {
          type: Type.OBJECT,
          properties: {
            keluhan_utama: { type: Type.STRING },
            vital_signs: {
              type: Type.OBJECT,
              properties: {
                tekanan_darah: { type: Type.STRING },
                nadi: { type: Type.STRING },
                suhu: { type: Type.STRING },
                respirasi: { type: Type.STRING },
                spo2: { type: Type.STRING }
              }
            },
            allergies: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  allergen: { type: Type.STRING },
                  reaction: { type: Type.STRING },
                  severity: { type: Type.STRING }
                }
              }
            },
            problem_list: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  problem: { type: Type.STRING },
                  icd10: { type: Type.STRING }
                }
              }
            },
            medications: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  dose: { type: Type.STRING }
                }
              }
            }
          }
        };
        requiredFields = ['keluhan_utama', 'vital_signs', 'allergies', 'problem_list', 'medications'];
      } else {
        prompt = `You are MY ITARU AI, a world-class Clinical Decision Support System and Medical Assistant.
Analyze the following clinical note or transcription provided by a doctor.

Clinical Note:
"${clinicalNote}"

Perform the following tasks:
1. Convert the note into a structured SOAP format (Subjective, Objective, Assessment, Plan).
2. Recommend likely ICD-10 codes based on the assessment.
3. Recommend likely ICD-9-CM codes based on the assessment.
4. Provide a clinical summary (Resume Medis).
5. Identify any missing critical data or potential drug interaction warnings (if applicable based on the context).
6. Provide a recommendation for next steps.

IMPORTANT: You are an assistant, NOT a doctor. Ensure you state that this is for clinical decision support only and not a final diagnosis.`;
        
        responseSchema = {
          type: Type.OBJECT,
          properties: {
            soap: {
              type: Type.OBJECT,
              properties: {
                subjective: { type: Type.STRING },
                objective: { type: Type.STRING },
                assessment: { type: Type.STRING },
                plan: { type: Type.STRING }
              }
            },
            icd10: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  code: { type: Type.STRING },
                  description: { type: Type.STRING }
                }
              }
            },
            icd9: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  code: { type: Type.STRING },
                  description: { type: Type.STRING }
                }
              }
            },
            resume: { type: Type.STRING },
            warnings: { type: Type.ARRAY, items: { type: Type.STRING } },
            recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
            disclaimer: { type: Type.STRING }
          }
        };
        requiredFields = ['soap', 'icd10', 'icd9', 'resume', 'warnings', 'recommendations', 'disclaimer'];
      }

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            ...responseSchema,
            required: requiredFields
          }
        }
      });"""

content = content.replace(old_logic, new_logic)

with open('server.ts', 'w') as f:
    f.write(content)

print("Updated server.ts")
