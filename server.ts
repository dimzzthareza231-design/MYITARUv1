import express from 'express';
import path from 'path';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

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
You are MYITARU AI, a world-class Clinical Decision Support System and Medical Assistant.
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
        model: 'gemini-3.6-flash',
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
      res.status(500).json({ error: error.message || 'An error occurred during AI analysis.' });
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
