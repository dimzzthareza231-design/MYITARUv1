import React, { useState, useRef, useEffect } from 'react';
import { RadiologiItem } from './types';
import { 
  ZoomIn, ZoomOut, RotateCw, RotateCcw, FlipHorizontal, FlipVertical,
  Sun, Contrast, Ruler, Compass, Disc, RefreshCw, Download, 
  Layers, Play, Pause, Maximize2, ShieldCheck, Eye, 
  FileText, Activity, AlertCircle, Sparkles, Sliders,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';

interface PACSViewerTabProps {
  radiologiList: RadiologiItem[];
  selectedItemId?: string;
  selectedStudyItem?: RadiologiItem;
  onOpenEkspertise?: (item: RadiologiItem) => void;
}

// Preset Window Level / Width (WL / WW) for diagnostic modalities
const WINDOW_PRESETS = [
  { label: 'Default / Auto', wl: 128, ww: 256 },
  { label: 'Paru (Lung)', wl: 80, ww: 160 },
  { label: 'Tulang (Bone)', wl: 200, ww: 220 },
  { label: 'Jaringan Lunak (Soft Tissue)', wl: 120, ww: 180 },
  { label: 'Otak (Brain Stroke)', wl: 110, ww: 100 },
  { label: 'High Contrast (Invert)', wl: 130, ww: 200, invert: true }
];

export function PACSViewerTab({ radiologiList, selectedItemId, selectedStudyItem, onOpenEkspertise }: PACSViewerTabProps) {
  const toast = useToast();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  // Select active patient study
  const [activeItem, setActiveItem] = useState<RadiologiItem>(() => {
    if (selectedStudyItem) return selectedStudyItem;
    if (selectedItemId) {
      const found = radiologiList.find(r => r.id === selectedItemId);
      if (found) return found;
    }
    return radiologiList[0];
  });

  useEffect(() => {
    if (selectedStudyItem) {
      setActiveItem(selectedStudyItem);
    } else if (selectedItemId) {
      const found = radiologiList.find(r => r.id === selectedItemId);
      if (found) setActiveItem(found);
    }
  }, [selectedItemId, selectedStudyItem, radiologiList]);

  // Viewer Transformations & Image adjustments
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [rotation, setRotation] = useState<number>(0);
  const [flipH, setFlipH] = useState<boolean>(false);
  const [flipV, setFlipV] = useState<boolean>(false);
  const [brightness, setBrightness] = useState<number>(100);
  const [contrast, setContrast] = useState<number>(100);
  const [invert, setInvert] = useState<boolean>(false);
  const [selectedPreset, setSelectedPreset] = useState<string>('Default / Auto');

  // Multi-slice & Cine Play simulation (for CT / MRI)
  const [currentSlice, setCurrentSlice] = useState<number>(1);
  const [isPlayingCine, setIsPlayingCine] = useState<boolean>(false);
  const maxSlices = activeItem.modalitas === 'CT-Scan' ? 24 : activeItem.modalitas === 'MRI' ? 16 : 1;

  // Active Tool: 'pan' | 'zoom' | 'ruler' | 'angle' | 'roi'
  const [activeTool, setActiveTool] = useState<'pan' | 'zoom' | 'ruler' | 'angle' | 'roi'>('pan');
  const [measurements, setMeasurements] = useState<Array<{ type: string; value: string; pos: { x: number; y: number } }>>([]);
  const [isMeasuring, setIsMeasuring] = useState<boolean>(false);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);

  // DICOM Header Metadata Inspector Modal
  const [isDicomInfoOpen, setIsDicomInfoOpen] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isDragging = useRef<boolean>(false);
  const dragStart = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Cine auto-play loop
  useEffect(() => {
    let interval: any = null;
    if (isPlayingCine && maxSlices > 1) {
      interval = setInterval(() => {
        setCurrentSlice(prev => (prev >= maxSlices ? 1 : prev + 1));
      }, 150);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlayingCine, maxSlices]);

  // Reset viewer controls
  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    setBrightness(100);
    setContrast(100);
    setInvert(false);
    setSelectedPreset('Default / Auto');
    setMeasurements([]);
  };

  // Apply Windowing Preset
  const handleApplyPreset = (preset: typeof WINDOW_PRESETS[0]) => {
    setSelectedPreset(preset.label);
    if (preset.label === 'Paru (Lung)') {
      setBrightness(115);
      setContrast(140);
      setInvert(false);
    } else if (preset.label === 'Tulang (Bone)') {
      setBrightness(90);
      setContrast(160);
      setInvert(false);
    } else if (preset.label === 'Jaringan Lunak (Soft Tissue)') {
      setBrightness(105);
      setContrast(115);
      setInvert(false);
    } else if (preset.label === 'Otak (Brain Stroke)') {
      setBrightness(120);
      setContrast(130);
      setInvert(false);
    } else if (preset.label === 'High Contrast (Invert)') {
      setBrightness(100);
      setContrast(130);
      setInvert(true);
    } else {
      setBrightness(100);
      setContrast(100);
      setInvert(false);
    }
    toast.info(`Preset Windowing: ${preset.label}`);
  };

  // Canvas drawing simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear background
    ctx.fillStyle = '#05070a';
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    // Apply pan & zoom relative to center
    ctx.translate(width / 2 + pan.x, height / 2 + pan.y);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(flipH ? -zoom : zoom, flipV ? -zoom : zoom);

    // Draw Simulated Radiograph based on study type and current slice
    const mod = activeItem.modalitas;
    const studyKey = activeItem.study_type_key || 'thorax';

    // Base Radiograph Visual
    if (studyKey === 'thorax' || mod === 'X-Ray') {
      drawThoraxXRay(ctx, invert, currentSlice);
    } else if (studyKey === 'brain_ct' || mod === 'CT-Scan') {
      drawBrainCT(ctx, invert, currentSlice, maxSlices);
    } else if (studyKey === 'lumbar_mri' || mod === 'MRI') {
      drawLumbarMRI(ctx, invert, currentSlice, maxSlices);
    } else if (studyKey === 'usg_abdomen' || mod === 'USG') {
      drawUSGAbdomen(ctx, invert, currentSlice);
    } else if (studyKey === 'dental_pano' || mod === 'Panoramic') {
      drawDentalPanoramic(ctx, invert);
    } else {
      drawThoraxXRay(ctx, invert, currentSlice);
    }

    ctx.restore();

    // Draw Overlays: Scale bar, orientation markers, measurements
    drawPACSOverlays(ctx, width, height, activeItem, zoom, currentSlice, maxSlices, invert, measurements);

  }, [activeItem, zoom, pan, rotation, flipH, flipV, brightness, contrast, invert, currentSlice, maxSlices, measurements]);

  // Helper Drawing Functions
  const drawThoraxXRay = (ctx: CanvasRenderingContext2D, isInverted: boolean, slice: number) => {
    const bgCol = isInverted ? '#e2e8f0' : '#080c14';
    const boneCol = isInverted ? '#1e293b' : '#cbd5e1';
    const softCol = isInverted ? '#64748b' : '#334155';
    const heartCol = isInverted ? '#334155' : '#475569';

    // Outer thorax contour
    ctx.fillStyle = bgCol;
    ctx.fillRect(-220, -260, 440, 520);

    // Mediastinum & Heart silhouette
    ctx.beginPath();
    ctx.ellipse(25, 40, 75, 95, -0.2, 0, Math.PI * 2);
    ctx.fillStyle = heartCol;
    ctx.fill();

    // Aortic knob
    ctx.beginPath();
    ctx.arc(8, -40, 24, 0, Math.PI * 2);
    ctx.fillStyle = heartCol;
    ctx.fill();

    // Left Lung field (Darker in standard xray)
    ctx.beginPath();
    ctx.ellipse(-95, -10, 65, 140, -0.05, 0, Math.PI * 2);
    ctx.fillStyle = isInverted ? '#f1f5f9' : '#0b1320';
    ctx.fill();

    // Right Lung field
    ctx.beginPath();
    ctx.ellipse(95, -20, 60, 130, 0.05, 0, Math.PI * 2);
    ctx.fillStyle = isInverted ? '#f1f5f9' : '#0b1320';
    ctx.fill();

    // Clavicles (Selangka)
    ctx.lineWidth = 9;
    ctx.strokeStyle = boneCol;
    ctx.beginPath();
    ctx.moveTo(-180, -180);
    ctx.quadraticCurveTo(-70, -160, -10, -150);
    ctx.moveTo(180, -180);
    ctx.quadraticCurveTo(70, -160, 10, -150);
    ctx.stroke();

    // Spine Column (Vertebrae)
    ctx.lineWidth = 16;
    ctx.strokeStyle = boneCol;
    ctx.beginPath();
    ctx.moveTo(0, -220);
    ctx.lineTo(0, 240);
    ctx.stroke();

    // Ribs (Iga)
    ctx.lineWidth = 5;
    ctx.strokeStyle = boneCol;
    for (let i = 0; i < 7; i++) {
      const y = -120 + i * 40;
      // Left rib
      ctx.beginPath();
      ctx.moveTo(-15, y);
      ctx.quadraticCurveTo(-110, y + 25, -175, y + 50);
      ctx.stroke();
      // Right rib
      ctx.beginPath();
      ctx.moveTo(15, y);
      ctx.quadraticCurveTo(110, y + 25, 175, y + 50);
      ctx.stroke();
    }

    // Diaphragms
    ctx.lineWidth = 8;
    ctx.strokeStyle = heartCol;
    ctx.beginPath();
    ctx.arc(-95, 130, 85, Math.PI * 1.1, Math.PI * 1.9);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(95, 115, 80, Math.PI * 1.1, Math.PI * 1.9);
    ctx.stroke();

    // If item has finding, draw simulated lesion
    if (activeItem.laporan_ekspertise?.critical_finding || activeItem.nama_pemeriksaan.includes('Pneumonia')) {
      ctx.beginPath();
      ctx.ellipse(85, 75, 45, 35, 0.2, 0, Math.PI * 2);
      ctx.fillStyle = isInverted ? 'rgba(51, 65, 85, 0.8)' : 'rgba(203, 213, 225, 0.75)';
      ctx.fill();
    }
  };

  const drawBrainCT = (ctx: CanvasRenderingContext2D, isInverted: boolean, slice: number, total: number) => {
    const skullCol = isInverted ? '#0f172a' : '#f8fafc';
    const brainCol = isInverted ? '#cbd5e1' : '#334155';
    const csfCol = isInverted ? '#f1f5f9' : '#090d16';

    const radius = 175 - Math.abs(slice - total / 2) * 2;

    // Skull Bone (High attenuation)
    ctx.beginPath();
    ctx.ellipse(0, 0, radius, radius * 1.2, 0, 0, Math.PI * 2);
    ctx.lineWidth = 14;
    ctx.strokeStyle = skullCol;
    ctx.stroke();

    // Brain Parenchyma
    ctx.fillStyle = brainCol;
    ctx.fill();

    // Ventricles (CSF - Dark)
    const ventScale = Math.max(0.2, 1 - Math.abs(slice - 12) / 10);
    ctx.beginPath();
    // Left ventricle
    ctx.ellipse(-25, -15, 18 * ventScale, 45 * ventScale, -0.15, 0, Math.PI * 2);
    // Right ventricle
    ctx.ellipse(25, -15, 18 * ventScale, 45 * ventScale, 0.15, 0, Math.PI * 2);
    ctx.fillStyle = csfCol;
    ctx.fill();

    // Midline Falx Cerebri
    ctx.lineWidth = 2;
    ctx.strokeStyle = isInverted ? '#64748b' : '#94a3b8';
    ctx.beginPath();
    ctx.moveTo(0, -radius * 1.1);
    ctx.lineTo(0, radius * 1.1);
    ctx.stroke();

    // Pathology simulation for brain CT
    if (activeItem.diagnosa_kerja.includes('ICH') || activeItem.nama_pasien.includes('Siti Rahayu')) {
      ctx.beginPath();
      ctx.arc(60, 20, 26, 0, Math.PI * 2);
      ctx.fillStyle = isInverted ? '#0f172a' : '#ffffff'; // Hyperdense ICH
      ctx.fill();

      // Perifocal edema
      ctx.beginPath();
      ctx.arc(60, 20, 36, 0, Math.PI * 2);
      ctx.lineWidth = 4;
      ctx.strokeStyle = csfCol;
      ctx.stroke();
    }
  };

  const drawLumbarMRI = (ctx: CanvasRenderingContext2D, isInverted: boolean, slice: number, total: number) => {
    const boneCol = isInverted ? '#1e293b' : '#e2e8f0';
    const discCol = isInverted ? '#64748b' : '#475569';
    const spinalCordCol = isInverted ? '#475569' : '#cbd5e1';

    // Spinal Column Alignment (Sagittal)
    for (let i = 0; i < 5; i++) {
      const y = -140 + i * 65;
      // Vertebral Body
      ctx.fillStyle = boneCol;
      ctx.fillRect(-70, y, 65, 45);

      // Intervertebral Disc
      ctx.fillStyle = discCol;
      ctx.fillRect(-70, y + 45, 65, 18);

      // HNP Lesion at L4-L5
      if (i === 3) {
        ctx.beginPath();
        ctx.arc(-5, y + 54, 14, 0, Math.PI * 2);
        ctx.fillStyle = isInverted ? '#0f172a' : '#ffffff';
        ctx.fill();
      }
    }

    // Thecal Sac / Spinal Canal
    ctx.fillStyle = spinalCordCol;
    ctx.fillRect(8, -160, 30, 340);
  };

  const drawUSGAbdomen = (ctx: CanvasRenderingContext2D, isInverted: boolean, slice: number) => {
    // USG Sector Cone
    ctx.beginPath();
    ctx.moveTo(0, -180);
    ctx.arc(0, -180, 360, Math.PI * 0.35, Math.PI * 0.65);
    ctx.closePath();
    ctx.fillStyle = isInverted ? '#e2e8f0' : '#1e293b';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#64748b';
    ctx.stroke();

    // Gallbladder (Anechoic black lumen)
    ctx.beginPath();
    ctx.ellipse(30, 20, 40, 75, 0.4, 0, Math.PI * 2);
    ctx.fillStyle = isInverted ? '#ffffff' : '#050810';
    ctx.fill();

    // Gallstone with acoustic shadow
    if (activeItem.diagnosa_kerja.includes('Chole') || activeItem.nama_pasien.includes('Dewi Lestari')) {
      ctx.beginPath();
      ctx.arc(20, -10, 16, 0, Math.PI * 2);
      ctx.fillStyle = isInverted ? '#0f172a' : '#f8fafc'; // Echogenic stone
      ctx.fill();

      // Acoustic Shadow
      ctx.beginPath();
      ctx.moveTo(4, -10);
      ctx.lineTo(-20, 160);
      ctx.lineTo(60, 160);
      ctx.lineTo(36, -10);
      ctx.fillStyle = isInverted ? '#ffffff' : 'rgba(0,0,0,0.85)';
      ctx.fill();
    }
  };

  const drawDentalPanoramic = (ctx: CanvasRenderingContext2D, isInverted: boolean) => {
    const boneCol = isInverted ? '#1e293b' : '#cbd5e1';
    const toothCol = isInverted ? '#0f172a' : '#ffffff';

    // Mandible Arch
    ctx.beginPath();
    ctx.arc(0, 40, 190, Math.PI * 0.8, Math.PI * 2.2);
    ctx.lineWidth = 28;
    ctx.strokeStyle = boneCol;
    ctx.stroke();

    // Teeth layout
    ctx.fillStyle = toothCol;
    for (let i = -7; i <= 7; i++) {
      const angle = (i * 0.12) - Math.PI / 2;
      const x = Math.cos(angle) * 190;
      const y = Math.sin(angle) * 190 + 40;
      ctx.fillRect(x - 8, y - 18, 16, 32);
    }

    // Impacted M3 gigi 48
    ctx.save();
    ctx.translate(145, 110);
    ctx.rotate(Math.PI / 4);
    ctx.fillRect(-10, -18, 20, 36);
    ctx.restore();
  };

  const drawPACSOverlays = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    item: RadiologiItem,
    z: number,
    slice: number,
    maxS: number,
    isInv: boolean,
    measList: Array<{ type: string; value: string; pos: { x: number; y: number } }>
  ) => {
    ctx.save();
    ctx.font = '12px "JetBrains Mono", Consolas, monospace';
    ctx.fillStyle = '#38bdf8'; // Cyan HUD
    ctx.textBaseline = 'top';

    // Top-Left: Patient Info
    ctx.fillText(`${item.nama_pasien.toUpperCase()}`, 20, 20);
    ctx.fillText(`ID / RM: ${item.no_rm} | ${item.jenis_kelamin}/${item.umur} Thn`, 20, 38);
    ctx.fillText(`STUDY: ${item.nama_pemeriksaan}`, 20, 56);
    ctx.fillText(`MOD: ${item.modalitas} | ACC: ${item.no_order}`, 20, 74);

    // Top-Right: Institution & Study UID
    ctx.textAlign = 'right';
    ctx.fillText(`Klinik MYITARU DIAGNOSTIC PACS`, width - 20, 20);
    ctx.fillText(`DATE: ${item.tanggal_order} ${item.waktu_order}`, width - 20, 38);
    ctx.fillText(`RAD: ${item.dokter_radiolog || 'Sp.Rad Duty'}`, width - 20, 56);
    ctx.fillText(`UID: ${item.study_instance_uid?.slice(-18) || 'DICOM.INSTANCE.001'}`, width - 20, 74);

    // Bottom-Left: Acquisition parameters
    ctx.textAlign = 'left';
    ctx.textBaseline = 'bottom';
    ctx.fillText(`KVp: ${item.dosis_radiasi?.kvp || 120}  mA: ${item.dosis_radiasi?.ma || 250}  FOV: 350mm`, 20, height - 56);
    ctx.fillText(`SLICE: ${slice}/${maxS}  THICK: 2.5mm`, 20, height - 38);
    ctx.fillText(`ZOOM: ${(z * 100).toFixed(0)}%  W/L: ${isInv ? 'INVERTED' : selectedPreset}`, 20, height - 20);

    // Bottom-Right: Anatomical Markers
    ctx.textAlign = 'right';
    ctx.fillText(`R`, 30, height / 2);
    ctx.fillText(`L`, width - 30, height / 2);
    ctx.fillText(`H (Head)`, width / 2, 20);
    ctx.fillText(`F (Feet)`, width / 2, height - 20);

    // Draw user measurement overlays
    measList.forEach((m, idx) => {
      ctx.fillStyle = '#f59e0b';
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(m.pos.x, m.pos.y, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeText(`[${idx + 1}] ${m.value}`, m.pos.x + 8, m.pos.y - 8);
    });

    ctx.restore();
  };

  // Mouse drag & tool handlers for interactive canvas
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    isDragging.current = true;
    dragStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };

    if (activeTool === 'ruler') {
      setIsMeasuring(true);
      setStartPoint({ x, y });
    } else if (activeTool === 'roi') {
      const simulatedHU = Math.round((Math.random() * 40) + 15);
      const simulatedArea = (Math.PI * Math.pow(15, 2)).toFixed(1);
      setMeasurements(prev => [...prev, {
        type: 'ROI',
        value: `Mean: ${simulatedHU} HU | Area: ${simulatedArea} mm²`,
        pos: { x, y }
      }]);
      toast.success(`ROI Measured: ${simulatedHU} HU (${simulatedArea} mm²)`);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging.current) return;
    if (activeTool === 'pan') {
      setPan({
        x: e.clientX - dragStart.current.x,
        y: e.clientY - dragStart.current.y
      });
    } else if (activeTool === 'zoom') {
      const deltaY = e.movementY;
      setZoom(prev => Math.min(4, Math.max(0.4, prev - deltaY * 0.01)));
    }
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDragging.current = false;
    if (activeTool === 'ruler' && isMeasuring && startPoint) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const endX = e.clientX - rect.left;
      const endY = e.clientY - rect.top;

      const distPixels = Math.sqrt(Math.pow(endX - startPoint.x, 2) + Math.pow(endY - startPoint.y, 2));
      const distMm = (distPixels * 0.35).toFixed(1);

      setMeasurements(prev => [...prev, {
        type: 'Ruler',
        value: `${distMm} mm (${(Number(distMm) / 10).toFixed(2)} cm)`,
        pos: { x: endX, y: endY }
      }]);

      setIsMeasuring(false);
      setStartPoint(null);
      toast.success(`Pengukuran Jarak Caliper: ${distMm} mm`);
    }
  };

  // Download snapshot
  const handleDownloadSnapshot = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `PACS_${activeItem.no_order}_${activeItem.no_rm}_Slice${currentSlice}.png`;
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Citra PACS DICOM berhasil diexport ke PNG');
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-full">
      {/* 1. LEFT SIDEBAR: PATIENT STUDY LIST (Collapsible with smooth transition) */}
      <div className={`w-full ${isSidebarCollapsed ? 'lg:w-20' : 'lg:w-80'} bg-slate-900/90 border border-slate-700/80 rounded-2xl p-3.5 flex flex-col gap-3 shrink-0 transition-all duration-300 ease-in-out`}>
        <div className={`flex items-center ${isSidebarCollapsed ? 'lg:justify-center' : 'justify-between'} pb-2 border-b border-slate-700 transition-all duration-300`}>
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="p-1.5 bg-pink-500/20 text-pink-400 rounded-lg shrink-0">
              <Layers className="w-4 h-4" />
            </div>
            {!isSidebarCollapsed && (
              <div className="overflow-hidden transition-all duration-300">
                <h3 className="font-bold text-white text-xs truncate">Worklist PACS</h3>
                <span className="text-[10px] text-slate-400 font-mono">{radiologiList.length} Studies</span>
              </div>
            )}
          </div>
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all duration-200 shadow-2xs hover:scale-105 active:scale-95"
            title={isSidebarCollapsed ? 'Perluas Study Worklist' : 'Sempitkan Study Worklist'}
          >
            {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Study Cards */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 max-h-[620px] custom-scrollbar">
          {radiologiList.map((item) => {
            const isSelected = item.id === activeItem.id;
            return (
              <div
                key={item.id}
                onClick={() => {
                  setActiveItem(item);
                  setCurrentSlice(1);
                  handleReset();
                }}
                className={`group relative p-2.5 rounded-xl cursor-pointer transition-all duration-200 border text-left ${
                  isSidebarCollapsed ? 'lg:p-2 lg:text-center' : ''
                } ${
                  isSelected
                    ? 'bg-gradient-to-r from-pink-950/70 to-slate-800 border-pink-500 shadow-md shadow-pink-500/10'
                    : 'bg-slate-800/60 border-slate-700/80 hover:border-slate-500 hover:bg-slate-800/90'
                }`}
              >
                {!isSidebarCollapsed ? (
                  <>
                    <div className="flex items-start justify-between gap-1">
                      <span className="text-xs font-mono font-bold text-pink-400">{item.id}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.modalitas === 'CT-Scan' ? 'bg-indigo-500/20 text-indigo-300' :
                        item.modalitas === 'MRI' ? 'bg-purple-500/20 text-purple-300' :
                        item.modalitas === 'USG' ? 'bg-cyan-500/20 text-cyan-300' :
                        'bg-slate-700 text-slate-300'
                      }`}>
                        {item.modalitas}
                      </span>
                    </div>

                    <div className="font-bold text-white text-xs mt-1 truncate">{item.nama_pasien}</div>
                    <div className="text-[11px] text-slate-300 font-medium truncate">{item.nama_pemeriksaan}</div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 pt-1.5 border-t border-slate-700/60">
                      <span>RM: {item.no_rm}</span>
                      <span>{item.tanggal_order}</span>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-1">
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold transition-transform duration-200 group-hover:scale-110 ${
                      isSelected ? 'bg-pink-600 text-white shadow-sm shadow-pink-500/30' : 'bg-slate-700 text-slate-300 group-hover:bg-pink-500/20 group-hover:text-pink-300'
                    }`}>
                      {item.modalitas?.slice(0, 3) || 'IMG'}
                    </span>
                    <span className="text-[9px] font-mono text-slate-400 truncate w-full text-center">{item.no_rm?.slice(-4)}</span>
                  </div>
                )}

                {/* Floating Tooltip when collapsed */}
                {isSidebarCollapsed && (
                  <div className="hidden lg:block absolute left-full ml-3 px-3 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-lg shadow-xl border border-slate-700 whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible pointer-events-none transition-all duration-200 z-50 translate-x-1 group-hover:translate-x-0">
                    <div className="font-bold text-pink-300">{item.nama_pasien} ({item.modalitas})</div>
                    <div className="text-[10px] text-slate-300">{item.nama_pemeriksaan}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. MAIN PACS VIEWER CANVAS & TOOLBAR */}
      <div className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col overflow-hidden shadow-2xl">
        {/* TOP TOOLBAR */}
        <div className="p-3 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
          {/* Action Tools */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTool('pan')}
              className={`p-2 rounded-lg text-xs flex items-center gap-1.5 font-bold transition-colors ${
                activeTool === 'pan' ? 'bg-pink-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
              title="Pan / Geser Gambar"
            >
              <Eye className="w-4 h-4" /> Pan
            </button>
            <button
              onClick={() => setActiveTool('zoom')}
              className={`p-2 rounded-lg text-xs flex items-center gap-1.5 font-bold transition-colors ${
                activeTool === 'zoom' ? 'bg-pink-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
              title="Zoom Drag"
            >
              <ZoomIn className="w-4 h-4" /> Zoom
            </button>
            <button
              onClick={() => setActiveTool('ruler')}
              className={`p-2 rounded-lg text-xs flex items-center gap-1.5 font-bold transition-colors ${
                activeTool === 'ruler' ? 'bg-pink-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
              title="Digital Caliper / Ruler (Klik dan Drag)"
            >
              <Ruler className="w-4 h-4" /> Ukur mm
            </button>
            <button
              onClick={() => setActiveTool('roi')}
              className={`p-2 rounded-lg text-xs flex items-center gap-1.5 font-bold transition-colors ${
                activeTool === 'roi' ? 'bg-pink-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
              title="ROI Hounsfield Unit (HU)"
            >
              <Disc className="w-4 h-4" /> ROI (HU)
            </button>
          </div>

          {/* Preset Windowing Select */}
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-pink-400" />
            <select
              value={selectedPreset}
              onChange={(e) => {
                const found = WINDOW_PRESETS.find(p => p.label === e.target.value);
                if (found) handleApplyPreset(found);
              }}
              className="bg-slate-950 border border-slate-700 text-xs text-white rounded-lg px-2.5 py-1.5 font-semibold outline-none focus:border-pink-500"
            >
              {WINDOW_PRESETS.map((p) => (
                <option key={p.label} value={p.label}>{p.label}</option>
              ))}
            </select>
          </div>

          {/* Geometric Transformations */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setZoom(prev => Math.min(4, prev + 0.25))}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoom(prev => Math.max(0.4, prev - 0.25))}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => setRotation(prev => (prev + 90) % 360)}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
              title="Rotate 90 CW"
            >
              <RotateCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setFlipH(prev => !prev)}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
              title="Flip Horizontal"
            >
              <FlipHorizontal className="w-4 h-4" />
            </button>
            <button
              onClick={() => setInvert(prev => !prev)}
              className={`p-1.5 rounded-lg font-bold text-xs ${
                invert ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
              title="Invert Grayscale"
            >
              Invert
            </button>
            <button
              onClick={handleReset}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
              title="Reset All Transformations"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {/* Export & Inspection */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsDicomInfoOpen(true)}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-bold rounded-lg flex items-center gap-1 border border-cyan-500/30"
            >
              <FileText className="w-3.5 h-3.5" /> DICOM Tag
            </button>
            <button
              onClick={handleDownloadSnapshot}
              className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg flex items-center gap-1 shadow"
            >
              <Download className="w-3.5 h-3.5" /> Export PNG
            </button>
          </div>
        </div>

        {/* CANVAS VIEWER AREA */}
        <div 
          ref={containerRef}
          className="flex-1 relative bg-[#040608] flex items-center justify-center overflow-hidden cursor-crosshair min-h-[480px]"
        >
          <canvas
            ref={canvasRef}
            width={640}
            height={520}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            className="rounded-lg shadow-2xl select-none"
            style={{
              filter: `brightness(${brightness}%) contrast(${contrast}%)`
            }}
          />

          {/* AI Finding Detection Badge overlay if available */}
          {activeItem.laporan_ekspertise?.ai_suggestion && (
            <div className="absolute top-4 right-4 bg-slate-900/90 border border-pink-500/60 p-2.5 rounded-xl shadow-lg max-w-xs text-left backdrop-blur-md">
              <div className="flex items-center gap-1.5 text-xs font-bold text-pink-400">
                <Sparkles className="w-4 h-4" />
                <span>AI Radiologist Copilot</span>
              </div>
              <p className="text-[11px] text-slate-200 mt-1 leading-snug">
                {activeItem.laporan_ekspertise.ai_suggestion.summary}
              </p>
              <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1.5 pt-1 border-t border-slate-800">
                <span>Confidence Score:</span>
                <span className="font-bold text-emerald-400 font-mono">
                  {activeItem.laporan_ekspertise.ai_suggestion.confidence}%
                </span>
              </div>
            </div>
          )}
        </div>

        {/* BOTTOM MULTI-SLICE & CINE BAR (IF CT OR MRI) */}
        {maxSlices > 1 && (
          <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlayingCine(prev => !prev)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 ${
                  isPlayingCine ? 'bg-rose-600 text-white animate-pulse' : 'bg-pink-600 text-white hover:bg-pink-700'
                }`}
              >
                {isPlayingCine ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                {isPlayingCine ? 'Pause Cine' : 'Play Cine'}
              </button>
              <span className="text-xs font-mono text-slate-300 font-bold">
                Slice: {currentSlice} / {maxSlices}
              </span>
            </div>

            {/* Slider */}
            <input
              type="range"
              min={1}
              max={maxSlices}
              value={currentSlice}
              onChange={(e) => {
                setIsPlayingCine(false);
                setCurrentSlice(Number(e.target.value));
              }}
              className="flex-1 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-pink-500"
            />

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentSlice(prev => Math.max(1, prev - 1))}
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-200 rounded"
              >
                Prev
              </button>
              <button
                onClick={() => setCurrentSlice(prev => Math.min(maxSlices, prev + 1))}
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-200 rounded"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* DICOM METADATA MODAL */}
      {isDicomInfoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl text-left">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">DICOM Header Tags Inspector</h3>
              </div>
              <button
                onClick={() => setIsDicomInfoOpen(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-300 space-y-2 max-h-96 overflow-y-auto">
              <div className="text-cyan-400 font-bold border-b border-slate-800 pb-1">=== PATIENT MODULE (0010,xxxx) ===</div>
              <div className="grid grid-cols-2 gap-1">
                <span>(0010,0010) Patient's Name:</span> <span className="text-white">{activeItem.nama_pasien}</span>
                <span>(0010,0020) Patient ID / No RM:</span> <span className="text-white">{activeItem.no_rm}</span>
                <span>(0010,0030) Patient's Birth Date:</span> <span className="text-white">19800101 (Age {activeItem.umur})</span>
                <span>(0010,0040) Patient's Sex:</span> <span className="text-white">{activeItem.jenis_kelamin}</span>
              </div>

              <div className="text-cyan-400 font-bold border-b border-slate-800 pb-1 pt-3">=== GENERAL STUDY MODULE (0020,xxxx) ===</div>
              <div className="grid grid-cols-2 gap-1">
                <span>(0020,000D) Study Instance UID:</span> <span className="text-white">{activeItem.study_instance_uid}</span>
                <span>(0020,0010) Study ID / Accession:</span> <span className="text-white">{activeItem.no_order}</span>
                <span>(0008,0020) Study Date:</span> <span className="text-white">{activeItem.tanggal_order.replace(/-/g, '')}</span>
                <span>(0008,1030) Study Description:</span> <span className="text-white">{activeItem.nama_pemeriksaan}</span>
                <span>(0008,0060) Modality:</span> <span className="text-white">{activeItem.modalitas}</span>
              </div>

              <div className="text-cyan-400 font-bold border-b border-slate-800 pb-1 pt-3">=== IMAGE & RADIATION DOSE (0018,xxxx) ===</div>
              <div className="grid grid-cols-2 gap-1">
                <span>(0018,0060) KVP Peak:</span> <span className="text-white">{activeItem.dosis_radiasi?.kvp || 120} kV</span>
                <span>(0018,1151) X-Ray Tube Current:</span> <span className="text-white">{activeItem.dosis_radiasi?.ma || 250} mA</span>
                <span>(0018,1152) Exposure (mAs):</span> <span className="text-white">{activeItem.dosis_radiasi?.mas || 5.0} mAs</span>
                <span>(0018,115E) Image and Fluoroscopy Dose:</span> <span className="text-white">{activeItem.dosis_radiasi?.dap_cgy_cm2 || 12.4} cGy.cm2</span>
                <span>(0028,0010) Rows / Columns:</span> <span className="text-white">512 x 512 matrix</span>
                <span>(0028,0004) Photometric Interpretation:</span> <span className="text-white">MONOCHROME2</span>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setIsDicomInfoOpen(false)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold rounded-lg"
              >
                Tutup Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
