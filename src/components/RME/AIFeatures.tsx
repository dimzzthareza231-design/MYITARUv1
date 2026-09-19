import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Sparkles, Search, Mic, MicOff } from 'lucide-react';
import { ModalAnalisis } from './Modals/ModalAnalisis';
import { SmartVoiceReport } from './SmartVoiceReport';

export function AIFeatures({ formData, setFormData }: { formData: any, setFormData: (data: any) => void }) {
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [showSmartVoiceModal, setShowSmartVoiceModal] = useState(false);

  const handleAnalyze = async () => {
    toast.loading('AI menganalisis kelengkapan dokumen...', { id: 'analyze' });
    try {
      const summaryText = `Subjektif: ${formData.subjective?.keluhan_utama || ''}. Objektif: ${formData.objective?.physicalExam || ''}. Assessment: ${formData.assessment?.clinicalNotes || ''}. Plan: ${formData.plan?.education || ''}`;
      
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clinicalNote: summaryText })
      });
      
      if (!response.ok) throw new Error('AI Error');
      const data = await response.json();
      
      setAnalysisResult({
        score: data.warnings && data.warnings.length > 0 ? 65 : 95,
        suggestions: data.warnings && data.warnings.length > 0 
          ? data.warnings 
          : ['Dokumen rekam medis terlihat lengkap dan komprehensif.']
      });
    } catch (error) {
      console.warn('Fallback AI Analysis:', error);
      setAnalysisResult({
        score: formData.subjective?.keluhan_utama ? 85 : 45,
        suggestions: [
          !formData.subjective?.keluhan_utama && 'Keluhan utama masih kosong',
          formData.subjective?.alergi?.length === 0 && 'Belum ada riwayat alergi yang dicatat',
          !formData.assessment?.primaryDiagnosis && 'Diagnosis primer belum dipilih',
          formData.plan?.medications?.length === 0 && 'Belum ada terapi farmakologi'
        ].filter(Boolean)
      });
    } finally {
      toast.dismiss('analyze');
      setShowAnalysis(true);
    }
  };
  
  const handleTalkToText = () => {
    setShowSmartVoiceModal(true);
  };

  const handleSuggest = async () => {
    toast.loading('AI mencari saran klinis...', { id: 'suggest' });
    try {
      const summaryText = `Subjektif: ${formData.subjective?.keluhan_utama || ''}. Objektif: ${formData.objective?.physicalExam || ''}.`;
      if (!summaryText || summaryText.length < 15) {
        throw new Error('Data terlalu singkat');
      }
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clinicalNote: summaryText })
      });
      
      if (!response.ok) throw new Error('AI Error');
      const data = await response.json();
      
      const suggestions = [...(data.icd10?.map((i: any) => i.description) || []), ...(data.recommendations || [])];
      
      if (suggestions.length > 0) {
        toast.success(`💡 Saran: ${suggestions[0]}`, { id: 'suggest', duration: 5000 });
      } else {
        throw new Error('No suggestion');
      }
    } catch (error) {
      console.warn('Fallback AI Suggestion:', error);
      toast.success('💡 Saran: Pertimbangkan pemeriksaan lanjutan atau observasi jika gejala menetap.', { id: 'suggest', duration: 4000 });
    }
  };

  const handleApplyVoiceToForm = (soapData: { s: string; o: string; a: string; p: string; parsed?: any }) => {
    setFormData((prev: any) => ({
      ...prev,
      subjective: {
        ...prev.subjective,
        keluhan_utama: soapData.s || prev.subjective.keluhan_utama,
        riwayat_penyakit_dahulu: soapData.parsed?.subjective?.riwayat_penyakit_sekarang || prev.subjective.riwayat_penyakit_dahulu
      },
      objective: {
        ...prev.objective,
        physicalExam: soapData.o || prev.objective.physicalExam
      },
      assessment: {
        ...prev.assessment,
        clinicalNotes: soapData.a || prev.assessment.clinicalNotes,
        primaryDiagnosis: soapData.parsed?.icd10?.[0] ? { code: soapData.parsed.icd10[0].code, name: soapData.parsed.icd10[0].name } : prev.assessment.primaryDiagnosis
      },
      plan: {
        ...prev.plan,
        education: soapData.p || prev.plan.education
      }
    }));
    toast.success('Data formulir Encounter berhasil diperbarui dari Laporan Suara Cerdas!');
  };
  
  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-40">
      <button
        onClick={handleSuggest}
        className="bg-amber-500 text-white p-4 rounded-full shadow-lg hover:bg-amber-600 transition-all hover:scale-105 group relative"
        title="AI Clinical Suggestion"
      >
        <Sparkles className="w-6 h-6" />
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity">
          AI Suggestion
        </span>
      </button>

      <button
        onClick={handleAnalyze}
        className="bg-purple-600 text-white p-4 rounded-full shadow-lg hover:bg-purple-700 transition-all hover:scale-105 group relative"
        title="Analisis Dokumen"
      >
        <Search className="w-6 h-6" />
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity">
          Analisis Kelengkapan
        </span>
      </button>
      
      <button
        onClick={handleTalkToText}
        className="p-4 rounded-full shadow-lg transition-all hover:scale-105 group relative bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
        title="Laporan Suara Cerdas (Smart Voice Report)"
      >
        <Mic className="w-6 h-6 animate-pulse" />
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity">
          Laporan Suara Cerdas
        </span>
      </button>
      
      {showAnalysis && analysisResult && (
        <ModalAnalisis
          result={analysisResult}
          onClose={() => setShowAnalysis(false)}
        />
      )}

      {showSmartVoiceModal && (
        <SmartVoiceReport
          isOpen={showSmartVoiceModal}
          onClose={() => setShowSmartVoiceModal(false)}
          onApplyToSOAP={handleApplyVoiceToForm}
        />
      )}
    </div>
  );
}
