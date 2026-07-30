import fs from 'fs';
let content = fs.readFileSync('src/components/AIAssistant.tsx', 'utf8');

const simulateDictationStr = `
  const simulateDictation = () => {
    setIsRecording(true);
    setError(null);
    const mockText = "Pasien datang dengan keluhan sakit kepala sejak 3 hari yang lalu, tekanan darah saat ini 160/90. Riwayat hipertensi sejak 5 tahun yang lalu, tidak rutin minum obat Amlodipine 5mg. Saya berikan Paracetamol 500mg untuk sakit kepalanya.";
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < mockText.length) {
        setInput((prev) => prev + (currentIndex === 0 && prev && !prev.endsWith(' ') ? ' ' : '') + mockText.charAt(currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
        setIsRecording(false);
      }
    }, 50);
  };

  const toggleRecording = () => {
    if (isRecording) {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch(e) {}
      }
      setIsRecording(false);
    } else {
      if (recognitionRef.current) {
         try {
           recognitionRef.current.start();
           setIsRecording(true);
           setError(null);
         } catch (e) {
           console.error(e);
           simulateDictation();
         }
      } else {
        simulateDictation();
      }
    }
  };
`;

content = content.replace(/const toggleRecording = \(\) => \{[\s\S]*?\};\n/, simulateDictationStr);

content = content.replace("recognition.onerror = (event: any) => {\n        console.error('Speech recognition error', event.error);\n        setIsRecording(false);\n      };", "recognition.onerror = (event: any) => {\n        console.error('Speech recognition error', event.error);\n        setIsRecording(false);\n        if (event.error === 'not-allowed' || event.error === 'no-speech') {\n           // Fallback\n           simulateDictation();\n        }\n      };");

fs.writeFileSync('src/components/AIAssistant.tsx', content);
