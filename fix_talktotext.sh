awk '
BEGIN { skip = 0; }
/const \[transcript, setTranscript\] = useState/ {
  print "  const [transcript, setTranscript] = useState(\"\");";
  print "  const [isProcessing, setIsProcessing] = useState(false);";
  print "  const [showResult, setShowResult] = useState(false);";
  print "  const [parsedResult, setParsedResult] = useState<any>(null);";
  print "  ";
  print "  const { isRecording, startRecording, stopRecording, isSupported } = useSpeechRecognition({";
  print "    onResult: (text) => {";
  print "      setTranscript(prev => (prev ? prev + \" \" : \"\") + text);";
  print "    }";
  print "  });";
  print "  ";
  print "  const handleStartRecording = () => {";
  print "    if (!isSupported) {";
  print "      toast.error(\"Browser Anda tidak mendukung Web Speech API (Gunakan Chrome).\");";
  print "      return;";
  print "    }";
  print "    if (isRecording) {";
  print "      stopRecording();";
  print "    } else {";
  print "      if (startRecording()) {";
  print "        toast.info(\"🎤 Mikrofon aktif. Mulai bicara...\");";
  print "      } else {";
  print "        toast.error(\"Gagal mengakses mikrofon.\");";
  print "      }";
  print "    }";
  print "  };";
  skip = 1;
  next;
}
/const analyzeWithAI = async/ { skip = 0; }
{ if (!skip) print $0; }
' src/components/TalkToText.tsx > temp_tt.tsx

# Also need to add the import at the top
awk '
/import React, { useState }/ {
  print $0;
  print "import { useSpeechRecognition } from \"../hooks/useSpeechRecognition\";";
  next;
}
{ print $0; }
' temp_tt.tsx > src/components/TalkToText.tsx
rm temp_tt.tsx
