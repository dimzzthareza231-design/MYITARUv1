import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Users, Activity, Stethoscope, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { useHospital } from '../contexts/HospitalContext';

const visitData = [
  { time: '08:00', patients: 12 },
  { time: '10:00', patients: 25 },
  { time: '12:00', patients: 38 },
  { time: '14:00', patients: 30 },
  { time: '16:00', patients: 45 },
  { time: '18:00', patients: 20 },
];

const diseaseTrendData = [
  { name: 'ISPA', cases: 1450 },
  { name: 'Hipertensi', cases: 1200 },
  { name: 'Diabetes', cases: 950 },
  { name: 'TBC', cases: 850 },
  { name: 'Dengue', cases: 620 },
  { name: 'Stroke', cases: 410 },
];

export function Dashboard() {
  const { patients } = useHospital();
  
  const [currentTime, setCurrentTime] = React.useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const quotes = [
    "Kesehatan adalah investasi terbaik untuk masa depan Anda.",
    "Harta yang paling sejati adalah kesehatan, bukan emas dan perak.",
    "Jaga tubuhmu, itulah satu-satunya tempatmu hidup.",
    "Waktu dan kesehatan adalah aset berharga yang seringkali baru disadari setelah hilang.",
    "Pencegahan lebih baik daripada mengobati."
  ];

  const dailyQuote = React.useMemo(() => {
    return quotes[new Date().getDay() % quotes.length];
  }, []);
  
  const formattedTime = currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const formattedDate = currentTime.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-xl font-bold tracking-tight mb-1 text-white">Hospital Analytics</h2>
          <p className="text-white/40 text-xs uppercase tracking-widest">Real-time monitoring and AI prediction overview.</p>
        </div>
        <div className="md:text-right flex flex-col md:items-end bg-white/5 p-4 rounded-xl border border-white/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-emerald/10 blur-[40px] rounded-full" />
          <div className="relative z-10 flex flex-col md:items-end">
            <div className="text-2xl font-bold text-white font-mono tracking-wider">{formattedTime}</div>
            <div className="text-primary-emerald text-[10px] font-bold uppercase tracking-widest mb-2">{formattedDate}</div>
            <p className="text-white/60 text-xs italic max-w-[280px]">"{dailyQuote}"</p>
          </div>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Patients', value: patients.length.toLocaleString(), trend: '+12%', icon: Users, color: 'text-primary-blue', bg: 'bg-primary-blue/10' },
          { label: 'Critical Cases', value: '24', trend: '-2%', icon: AlertTriangle, color: 'text-orange-400', bg: 'bg-orange-500/10' },
          { label: 'AI Diagnoses', value: '845', trend: '+28%', icon: BrainCircuitIcon, color: 'text-primary-emerald', bg: 'bg-primary-emerald/10' },
          { label: 'Avg Wait Time', value: '14m', trend: '-5m', icon: Activity, color: 'text-secondary-purple', bg: 'bg-secondary-purple/10' },
        ].map((stat, i) => (
          <motion.div key={i} variants={itemVariants} className="glass-panel p-5 relative overflow-hidden group">
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className={cn("p-2.5 rounded-lg border border-white/5", stat.bg, stat.color)}>
                <stat.icon className="w-5 h-5" />
              </div>
              <span className={cn("text-[10px] font-mono tracking-wider font-bold px-2 py-0.5 rounded-full border", stat.trend.startsWith('+') ? 'text-primary-emerald border-primary-emerald/20 bg-primary-emerald/10' : 'text-orange-400 border-orange-500/20 bg-orange-500/10')}>
                {stat.trend}
              </span>
            </div>
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-0.5 text-white">{stat.value}</h3>
              <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Vital Signs Trend Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={itemVariants} className="glass-panel p-6">
          <h3 className="text-[10px] text-orange-400 uppercase tracking-widest font-bold mb-4">Real-time Heart Rate Trend</h3>
          <SparklineChart data={[72, 74, 75, 71, 78, 85, 82, 79, 76, 75, 74]} color="#f97316" title="Current Avg" value="76" unit="BPM" />
        </motion.div>
        
        <motion.div variants={itemVariants} className="glass-panel p-6">
          <h3 className="text-[10px] text-secondary-purple uppercase tracking-widest font-bold mb-4">Blood Pressure Trend (Systolic)</h3>
          <SparklineChart data={[120, 122, 121, 125, 128, 130, 126, 124, 121, 120]} color="#a855f7" title="Current Sys" value="120" unit="mmHg" />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <motion.div variants={itemVariants} className="glass-panel p-6 lg:col-span-2">
          <h3 className="text-[10px] text-primary-emerald uppercase tracking-widest font-bold mb-6">Patient Flow Prediction (AI)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={visitData}>
                <defs>
                  <linearGradient id="colorPatients" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="time" stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(2, 6, 23, 0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', backdropFilter: 'blur(8px)' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="patients" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorPatients)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Secondary Chart */}
        <motion.div variants={itemVariants} className="glass-panel p-6">
          <h3 className="text-[10px] text-primary-blue uppercase tracking-widest font-bold mb-6">Disease Mapping</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={diseaseTrendData} layout="vertical" margin={{ top: 0, right: 0, left: 30, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                <XAxis type="number" stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" stroke="rgba(255,255,255,0.6)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(2, 6, 23, 0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                />
                <Bar dataKey="cases" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* 2026 Health News Dashboard */}
      <motion.div variants={itemVariants} className="glass-panel p-6 mt-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Indonesia Health Updates 2026</h3>
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Latest National Medical News & Directives</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              title: 'Integrasi Rekam Medis Elektronik (RME) Nasional Mencapai 98%',
              date: '24 Jul 2026',
              source: 'Kemenkes RI',
              summary: 'Seluruh fasilitas kesehatan tingkat pertama dan lanjutan kini terhubung dengan platform SATUSEHAT, mempermudah rujukan lintas provinsi.',
              tag: 'Technology'
            },
            {
              title: 'Vaksinasi Demam Berdarah Dengue (DBD) Jadi Program Nasional Gratis',
              date: '20 Jul 2026',
              source: 'Ditjen P2P',
              summary: 'Merespon siklus lima tahunan, pemerintah menetapkan vaksinasi DBD sebagai imunisasi rutin untuk anak usia sekolah dasar.',
              tag: 'Public Health'
            },
            {
              title: 'Penurunan Signifikan Kasus Stunting ke Angka 8.5%',
              date: '15 Jul 2026',
              source: 'BKKBN',
              summary: 'Program intervensi gizi spesifik sejak 2021 berhasil menekan angka stunting nasional di bawah target SDGs.',
              tag: 'Pediatrics'
            },
            {
              title: 'Penerapan AI dalam Deteksi Dini TBC Meningkatkan Kesembuhan 40%',
              date: '10 Jul 2026',
              source: 'IDI',
              summary: 'Penggunaan kecerdasan buatan pada pembacaan foto toraks rontgen di puskesmas mempercepat penanganan kasus tuberkulosis paru.',
              tag: 'Innovation'
            }
          ].map((news, i) => (
            <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary-emerald">{news.tag}</span>
                <span className="text-[10px] text-white/40">{news.date}</span>
              </div>
              <h4 className="text-sm font-bold text-white mb-2 leading-snug">{news.title}</h4>
              <p className="text-xs text-white/60 mb-4 line-clamp-3">{news.summary}</p>
              <div className="text-[10px] text-white/40 font-semibold">Sumber: {news.source}</div>
            </div>
          ))}
        </div>
      </motion.div>

    </motion.div>
  );
}

// Temporary icon component since we used BrainCircuitIcon but it's not imported directly with that name
function BrainCircuitIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 4.5a2.5 2.5 0 0 0-4.96-.46 2.5 2.5 0 0 0-1.98 3 2.5 2.5 0 0 0-1.32 4.24 3 3 0 0 0 .34 5.58 2.5 2.5 0 0 0 2.96 3.08 2.5 2.5 0 0 0 4.91.05L12 20V4.5Z" />
      <path d="M16 8V5c0-1.1.9-2 2-2" />
      <path d="M12 13h4" />
      <path d="M12 18h6a2 2 0 0 1 2 2v1" />
      <path d="M19 18v-4" />
      <path d="M22 14h-4" />
      <path d="M16 11v3" />
    </svg>
  );
}

function SparklineChart({ data, color, title, value, unit }: { data: number[], color: string, title: string, value: string, unit: string }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min;
  const padding = 10;
  const width = 200;
  const height = 60;
  
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * (width - padding * 2) + padding;
    const y = height - padding - ((d - min) / (range || 1)) * (height - padding * 2);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl">
      <div>
        <div className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-1">{title}</div>
        <div className="text-xl font-bold text-white flex items-baseline gap-1">
          {value} <span className="text-xs text-white/40 font-normal">{unit}</span>
        </div>
      </div>
      <svg width={width} height={height} className="overflow-visible">
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx={(width - padding * 2) + padding} cy={height - padding - ((data[data.length - 1] - min) / (range || 1)) * (height - padding * 2)} r="3" fill={color} />
      </svg>
    </div>
  );
}

