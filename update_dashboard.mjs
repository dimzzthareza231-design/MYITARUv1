import fs from 'fs';
let content = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

const targetStr = `export function Dashboard() {
  const { patients } = useHospital();
  
  const containerVariants = {`;

const insertStr = `export function Dashboard() {
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
    "Waktu dan kesehatan adalah aset berharga yang seringkali baru disadari setelah hilang."
  ];

  const dailyQuote = React.useMemo(() => {
    return quotes[new Date().getDay() % quotes.length];
  }, []);
  
  const formattedTime = currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const formattedDate = currentTime.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const containerVariants = {`;

content = content.replace(targetStr, insertStr);

const headerTarget = `      <header className="mb-8">
        <h2 className="text-xl font-bold tracking-tight mb-1 text-white">Hospital Analytics</h2>
        <p className="text-white/40 text-xs uppercase tracking-widest">Real-time monitoring and AI prediction overview.</p>
      </header>`;

const headerReplace = `      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
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
      </header>`;

content = content.replace(headerTarget, headerReplace);

fs.writeFileSync('src/components/Dashboard.tsx', content);
