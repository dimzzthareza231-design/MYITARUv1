awk '
BEGIN { skip = 0; }
/const \[isRecording, setIsRecording\]/ { skip = 1; next; }
/const mediaRecorderRef/ { skip = 1; next; }
/const audioChunksRef/ { skip = 1; next; }
/const streamRef/ { 
  print "  const { isRecording, startRecording, stopRecording, isSupported } = useSpeechRecognition({";
  print "    onResult: (text) => {";
  print "      setSoapData(prev => ({ ...prev, s: (prev.s ? prev.s + \" \" : \"\") + text }));";
  print "    }";
  print "  });";
  skip = 0;
  next;
}
/const handleMicrophoneClick = async/ {
  print "  const handleMicrophoneClick = () => {";
  print "    if (!isSupported) {";
  print "      toast.error(\"Browser Anda tidak mendukung Web Speech API (Gunakan Chrome).\");";
  print "      return;";
  print "    }";
  print "    if (isRecording) {";
  print "      stopRecording();";
  print "    } else {";
  print "      if (startRecording()) {";
  print "        toast.info(\"Mendengarkan percakapan (AI Scribe aktif)...\");";
  print "      } else {";
  print "        toast.error(\"Gagal mengakses mikrofon.\");";
  print "      }";
  print "    }";
  print "  };";
  skip = 1;
  next;
}
/const handleAddDrug = () =>/ {
  skip = 0;
}
{ if (!skip) print $0; }
' src/components/Outpatient.tsx > temp_outpatient.tsx

# Also need to add the import at the top
awk '
/import SmartTable/ {
  print $0;
  print "import { useSpeechRecognition } from \"../hooks/useSpeechRecognition\";";
  next;
}
{ print $0; }
' temp_outpatient.tsx > src/components/Outpatient.tsx
rm temp_outpatient.tsx
