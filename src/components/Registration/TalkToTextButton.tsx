import React from 'react';
import { Mic, MicOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';

export function TalkToTextButton({ onExtracted, onTranscriptUpdate }: { onExtracted: (data: any) => void, onTranscriptUpdate?: (text: string) => void }) {
  const { isRecording, toggleRecording, isSupported } = useSpeechRecognition({
    onResult: (text) => {
      if (onTranscriptUpdate) onTranscriptUpdate(text);
    }
  });

  const handleToggle = () => {
    if (!isSupported) {
      toast.error('Browser Anda tidak mendukung Web Speech API (Gunakan Chrome).');
      return;
    }
    toggleRecording();
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`px-4 py-2 rounded-lg shadow-sm flex items-center gap-2 whitespace-nowrap border transition-colors ${isRecording ? 'bg-red-500 text-white border-red-600 animate-pulse' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 border-slate-200 dark:border-slate-600'}`}
    >
      {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
      <span className="font-medium text-sm">{isRecording ? 'Berhenti Merekam' : 'Voice Input'}</span>
    </button>
  );
}
