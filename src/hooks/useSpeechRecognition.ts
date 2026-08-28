import { useState, useRef, useCallback, useEffect } from 'react';

export function useSpeechRecognition({ onResult }: { onResult: (text: string) => void }) {
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);
  const shouldBeRecordingRef = useRef<boolean>(false);
  const onResultRef = useRef(onResult);

  useEffect(() => {
    onResultRef.current = onResult;
  }, [onResult]);

  const stopRecording = useCallback(() => {
    shouldBeRecordingRef.current = false;
    setIsRecording(false);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // Ignore stop error
      }
    }
  }, []);

  const startRecording = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      return false;
    }

    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'id-ID';

    recognition.onresult = (event: any) => {
      let currentTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          currentTranscript += event.results[i][0].transcript + ' ';
        }
      }
      if (currentTranscript.trim()) {
        onResultRef.current(currentTranscript.trim());
      }
    };

    recognition.onerror = (event: any) => {
      // 'no-speech' happens when user pauses or no audio is heard; it is normal and non-fatal
      if (event.error === 'no-speech' || event.error === 'aborted') {
        return;
      }
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        shouldBeRecordingRef.current = false;
        setIsRecording(false);
        return;
      }
      // For any other non-critical error, do not throw console.error
      shouldBeRecordingRef.current = false;
      setIsRecording(false);
    };

    recognition.onend = () => {
      // If continuous recording is still supposed to be active, restart recognition
      if (shouldBeRecordingRef.current) {
        try {
          recognition.start();
          return;
        } catch (e) {
          // Restart failed, gracefully exit
        }
      }
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
    shouldBeRecordingRef.current = true;
    
    try {
      recognition.start();
      setIsRecording(true);
      return true;
    } catch (e) {
      shouldBeRecordingRef.current = false;
      setIsRecording(false);
      return false;
    }
  }, []);

  const toggleRecording = useCallback(() => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }, [isRecording, startRecording, stopRecording]);

  useEffect(() => {
    return () => {
      shouldBeRecordingRef.current = false;
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }
    };
  }, []);

  return {
    isRecording,
    toggleRecording,
    startRecording,
    stopRecording,
    isSupported: typeof window !== 'undefined' && !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)
  };
}
