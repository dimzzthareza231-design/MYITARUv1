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
    "Waktu dan kesehatan adalah aset berharga yang seringkali baru disadari setelah hilang.",
    "Pencegahan lebih baik daripada mengobati."
  ];

  const dailyQuote = React.useMemo(() => {
    return quotes[new Date().getDay() % quotes.length];
  }, []);
  
  const formattedTime = currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const formattedDate = currentTime.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const containerVariants = {`;

content = content.replace(targetStr, insertStr);
fs.writeFileSync('src/components/Dashboard.tsx', content);
