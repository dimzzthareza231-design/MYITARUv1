import express from 'express';
import path from 'path';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));

  // AI Medical Assistant Endpoint
  app.post('/api/ai/analyze', async (req, res) => {
    try {
      const { clinicalNote } = req.body;

      if (!clinicalNote) {
        return res.status(400).json({ error: 'Clinical note is required.' });
      }

      if (!process.env.GEMINI_API_KEY) {
        throw new Error('GEMINI_API_KEY is not configured.');
      }

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

      const prompt = `
You are MY ITARU AI, a world-class Clinical Decision Support System and Medical Assistant.
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

IMPORTANT: You are an assistant, NOT a doctor. Ensure you state that this is for clinical decision support only and not a final diagnosis.
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
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
      });

      if (!response.text) {
         throw new Error('Failed to generate AI response');
      }

      const data = JSON.parse(response.text);
      res.json(data);
    } catch (error: any) {
      console.error('AI Analysis Error:', error);
      
      // Fallback jika API sedang sibuk (Error 503)
      const errStr = String(error?.message || error);
      if (errStr.includes('503') || errStr.includes('UNAVAILABLE') || errStr.includes('demand') || errStr.includes('overloaded')) {
        console.log('Sending fallback data due to 503 AI API Error');
        return res.json({
          soap: {
            subjective: req.body.clinicalNote || "Keluhan pasien",
            objective: "(Data Fallback - AI Sedang Sibuk)",
            assessment: "(Data Fallback - AI Sedang Sibuk)",
            plan: "(Data Fallback - AI Sedang Sibuk)"
          },
          icd10: [{ code: "Z00.0", description: "General medical examination (Fallback)" }],
          icd9: [],
          resume: "Sistem mendeteksi tingginya permintaan pada server AI (Error 503). Fitur otomatisasi sedang dialihkan ke mode manual sementara.",
          warnings: ["Peringatan: Server AI sedang penuh. Harap isi form secara manual."],
          recommendations: ["Silakan ketik manual atau coba fitur AI kembali dalam beberapa menit."],
          disclaimer: "Ini adalah hasil fallback karena AI model mengalami high demand."
        });
      }

      res.status(500).json({ error: error.message || 'An error occurred during AI analysis.' });
    }
  });

  // ⭐ ENDPOINT BARU: AI Medical Intelligence & Clinical Search Grounding
  app.post('/api/ai/grounded-search', async (req, res) => {
    try {
      const { query, context } = req.body;

      if (!query) {
        return res.status(400).json({ error: 'Query is required.' });
      }

      if (!process.env.GEMINI_API_KEY) {
        throw new Error('GEMINI_API_KEY is not configured.');
      }

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

      const prompt = `
You are MY ITARU Medical Search & Clinical Evidence Assistant, an integrated AI assistant in the SIMRS hospital system.
Provide up-to-date, accurate, evidence-based medical information in Bahasa Indonesia using Google Search data.

Clinical / Query Context:
${context ? `Context: "${context}"\n` : ''}
User Medical Query:
"${query}"

Instructions:
1. Provide a comprehensive, accurate clinical summary based on the latest medical guidelines (Kemenkes RI, WHO, IDI, FDA, BPOM, PubMed, clinical trials, or trusted medical literature).
2. Detail guidelines, indications, dosages, contraindications, or treatment protocols where relevant.
3. Highlight any critical clinical warnings, red flags, or drug interactions.
4. Structure the answer clearly with headings, bullet points, and concise explanations.
5. Emphasize that this information is for clinical decision support for healthcare professionals and not an independent medical diagnosis.
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }]
        }
      });

      const responseText = response.text || '';
      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const searchQueries = response.candidates?.[0]?.groundingMetadata?.webSearchQueries || [];

      // Extract sources
      const sources = groundingChunks
        .map((chunk: any) => chunk.web)
        .filter((web: any) => web && web.uri)
        .map((web: any) => ({
          title: web.title || web.uri,
          url: web.uri
        }));

      res.json({
        answer: responseText,
        sources,
        searchQueries,
        groundingMetadata: response.candidates?.[0]?.groundingMetadata || null
      });
    } catch (error: any) {
      console.error('AI Grounded Search Error:', error);
      res.status(500).json({
        error: error.message || 'Failed to perform grounded medical search.',
        answer: 'Terjadi kendala saat menghubungkan ke Google Search Grounding. Silakan coba lagi.'
      });
    }
  });

  // ⭐ ENDPOINT: Transkripsi Suara via Gemini
  app.post('/api/ai/transcribe', async (req, res) => {
    try {
      const { audioBase64, mimeType } = req.body;

      if (!audioBase64) {
        return res.status(400).json({ error: 'Audio data is required.' });
      }

      if (!process.env.GEMINI_API_KEY) {
        throw new Error('GEMINI_API_KEY is not configured.');
      }

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: [
          {
            role: 'user',
            parts: [
              {
                inlineData: {
                  mimeType: (mimeType || 'audio/webm').split(';')[0].replace('audio/mp4', 'audio/x-m4a'),
                  data: audioBase64
                }
              },
              {
                text: 'Transcribe this audio recording into text. It is an Indonesian medical consultation or patient complaint. Return ONLY the exact transcribed text, nothing else, without extra formatting. If no speech is detected or it is purely noise, return exactly: TIDAK_ADA_SUARA'
              }
            ]
          }
        ]
      });

      if (!response.text) {
        throw new Error('Failed to transcribe audio');
      }

      res.json({ transcript: response.text.trim() });
    } catch (error: any) {
      console.error('Transcription Error:', error);
      
      const errStr = String(error?.message || error);
      if (errStr.includes('503') || errStr.includes('UNAVAILABLE') || errStr.includes('demand') || errStr.includes('overloaded')) {
        console.log('Sending fallback data due to 503 AI API Error on transcribe');
        return res.json({ transcript: "(Mohon maaf, server AI saat ini sedang sibuk/Error 503. Silakan ketik manual atau coba lagi nanti.)" });
      }

      res.status(500).json({ error: error.message || 'Transcription failed.' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log("Server running on port " + PORT);
  });
}

startServer().catch(console.error);
