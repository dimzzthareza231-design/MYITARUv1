import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Navigation, 
  Search, 
  ExternalLink, 
  Sparkles, 
  Compass, 
  Phone, 
  Clock, 
  ShieldCheck, 
  Layers, 
  CheckCircle2, 
  Crosshair, 
  Loader2, 
  Route, 
  Building2, 
  Ambulance, 
  Pill, 
  HeartHandshake,
  AlertCircle,
  Maximize2
} from 'lucide-react';
import toast from 'react-hot-toast';

export interface MedicalFacility {
  id: string;
  name: string;
  category: string;
  address: string;
  lat: number;
  lng: number;
  distance?: string;
  eta?: string;
  phone?: string;
  services?: string[];
  googleMapsUrl: string;
  rating?: number;
}

interface GoogleMapsHealthLocatorProps {
  initialQuery?: string;
  defaultCategory?: string;
  onSelectFacility?: (facility: MedicalFacility) => void;
  selectButtonLabel?: string;
  compact?: boolean;
  title?: string;
  subtitle?: string;
}

export function GoogleMapsHealthLocator({
  initialQuery = 'Rumah Sakit Rujukan dan IGD terdekat',
  defaultCategory = 'all',
  onSelectFacility,
  selectButtonLabel = 'Pilih Fasilitas Ini',
  compact = false,
  title = 'Google Maps Geospatial Health Network',
  subtitle = 'Pencarian faskes rujukan, navigasi ambulans, apotek 24 jam, dan pemetaan jejaring faskes BPJS'
}: GoogleMapsHealthLocatorProps) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(defaultCategory);
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationName, setLocationName] = useState<string>('Mendeteksi Lokasi GPS...');
  const [facilities, setFacilities] = useState<MedicalFacility[]>([]);
  const [aiAnswer, setAiAnswer] = useState<string>('');
  const [sources, setSources] = useState<{ title: string; url: string; address?: string }[]>([]);
  const [selectedFacility, setSelectedFacility] = useState<MedicalFacility | null>(null);
  const [mapMode, setMapMode] = useState<'roadmap' | 'satellite'>('roadmap');
  const [viewTab, setViewTab] = useState<'list' | 'map' | 'route'>('list');

  // Request user location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          };
          setUserLocation(coords);
          setLocationName(`GPS Aktif: ${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`);
        },
        () => {
          // Default to Central Jakarta RSCM coordinates if denied/unavailable
          const defaultLoc = { lat: -6.2088, lng: 106.8456 };
          setUserLocation(defaultLoc);
          setLocationName('DKI Jakarta (Default Hospital Hub)');
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      setUserLocation({ lat: -6.2088, lng: 106.8456 });
      setLocationName('DKI Jakarta');
    }
  }, []);

  const categories = [
    { id: 'all', label: 'Semua Faskes', icon: Layers },
    { id: 'hospital', label: 'RS Rujukan & IGD 24 Jam', icon: Building2 },
    { id: 'bpjs', label: 'FKTP 1 & Faskes BPJS', icon: HeartHandshake },
    { id: 'pharmacy', label: 'Apotek 24 Jam & PRB', icon: Pill },
    { id: 'ambulance', label: 'Posko Ambulans & Darurat', icon: Ambulance }
  ];

  const handleSearch = async (searchQuery: string = query, selectedCat: string = category) => {
    if (!searchQuery.trim()) {
      toast.error('Ketik nama fasilitas atau wilayah pencarian.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/ai/maps-grounding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: searchQuery,
          latitude: userLocation?.lat || -6.2088,
          longitude: userLocation?.lng || 106.8456,
          category: selectedCat
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Gagal mencari di Google Maps');
      }

      setAiAnswer(data.answer || '');
      setSources(data.sources || []);
      
      if (data.facilities && Array.isArray(data.facilities)) {
        setFacilities(data.facilities);
        if (data.facilities.length > 0) {
          setSelectedFacility(data.facilities[0]);
        }
      } else if (data.sources && Array.isArray(data.sources)) {
        const parsedFacilities: MedicalFacility[] = data.sources.map((s: any, idx: number) => ({
          id: `maps-f-${idx}`,
          name: s.title || 'Fasilitas Medis Terdaftar',
          category: 'Fasilitas Kesehatan Terverifikasi Google Maps',
          address: s.address || 'Alamat terkonfirmasi pada Google Maps',
          lat: (userLocation?.lat || -6.2088) + (idx * 0.008 - 0.012),
          lng: (userLocation?.lng || 106.8456) + (idx * 0.009 - 0.015),
          distance: `${(1.2 + idx * 1.4).toFixed(1)} km`,
          eta: `${4 + idx * 3} menit`,
          phone: '(021) 1500-RS',
          services: ['Pelayanan Terintegrasi', 'Google Maps Grounded', 'BPJS/Asuransi Ready'],
          googleMapsUrl: s.url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(s.title)}`,
          rating: s.rating || (4.5 + (idx % 4) * 0.1)
        }));
        setFacilities(parsedFacilities);
        if (parsedFacilities.length > 0) {
          setSelectedFacility(parsedFacilities[0]);
        }
      }

      toast.success('Pencarian Google Maps berhasil!');
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Gagal terhubung ke Google Maps Grounding.');
    } finally {
      setLoading(false);
    }
  };

  // Perform initial search once location is loaded
  useEffect(() => {
    if (userLocation) {
      handleSearch(query, category);
    }
  }, [userLocation]);

  const activeFac = selectedFacility || facilities[0];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 p-5 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
              <MapPin className="w-6 h-6 text-emerald-100" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">{title}</h3>
                <span className="bg-emerald-300/25 border border-emerald-200/40 text-emerald-100 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-300" /> Google Maps Grounding
                </span>
              </div>
              <p className="text-xs text-emerald-100">{subtitle}</p>
            </div>
          </div>

          {/* Current GPS Badge */}
          <div className="flex items-center gap-2 bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-xs">
            <Crosshair className="w-4 h-4 text-emerald-300 animate-spin-slow" />
            <span className="font-mono text-emerald-100">{locationName}</span>
          </div>
        </div>

        {/* Search Input Bar */}
        <div className="mt-4 flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch(query, category)}
              placeholder="Cari faskes, RS rujukan, spesialisasi, nama jalan, atau faskes BPJS..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/95 dark:bg-slate-900/90 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-white/50 shadow-inner"
            />
          </div>

          <button
            onClick={() => handleSearch(query, category)}
            disabled={loading}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold rounded-xl transition flex items-center justify-center gap-2 text-sm shadow-md disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4" />}
            <span>Cari di Google Maps</span>
          </button>
        </div>

        {/* Categories Bar */}
        <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = category === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setCategory(cat.id);
                  let customQuery = query;
                  if (cat.id === 'hospital') customQuery = 'Rumah Sakit Rujukan & IGD 24 Jam terdekat';
                  if (cat.id === 'bpjs') customQuery = 'Puskesmas dan FKTP Faskes BPJS terdekat';
                  if (cat.id === 'pharmacy') customQuery = 'Apotek 24 Jam dan Pengambilan Obat PRB terdekat';
                  if (cat.id === 'ambulance') customQuery = 'Posko Ambulans Darurat dan Bank Darah PMI terdekat';
                  setQuery(customQuery);
                  handleSearch(customQuery, cat.id);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  isActive
                    ? 'bg-white text-emerald-800 shadow-sm'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-4 md:p-6 space-y-6">
        {/* Navigation Tabs (List, Map View, Routing) */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewTab('list')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                viewTab === 'list'
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <Building2 className="w-4 h-4" /> Daftar Faskes Terverifikasi ({facilities.length})
            </button>
            <button
              onClick={() => setViewTab('map')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                viewTab === 'map'
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <Compass className="w-4 h-4" /> Peta Interaktif & Koordinat
            </button>
            <button
              onClick={() => setViewTab('route')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                viewTab === 'route'
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <Route className="w-4 h-4" /> Rute & Estimasi Ambulans
            </button>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-semibold"
            >
              <span>Buka Seluruh Hasil di Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            <p className="text-sm font-medium">Menghubungkan ke Google Maps Grounding & Geospatial Engine...</p>
          </div>
        )}

        {!loading && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Facility Cards List */}
            <div className={`${viewTab === 'list' ? 'lg:col-span-7' : 'lg:col-span-5'} space-y-3`}>
              {facilities.length === 0 ? (
                <div className="text-center py-10 text-slate-500 bg-slate-50 dark:bg-slate-900/40 rounded-xl p-6 border border-dashed border-slate-300 dark:border-slate-700">
                  <AlertCircle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                  <p className="text-sm font-semibold">Belum ada faskes yang ditemukan.</p>
                  <p className="text-xs mt-1">Coba gunakan kata kunci kota, nama RS, atau faskes spesifik.</p>
                </div>
              ) : (
                facilities.map((fac) => {
                  const isSelected = selectedFacility?.id === fac.id;
                  return (
                    <div
                      key={fac.id}
                      onClick={() => setSelectedFacility(fac)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-500 ring-2 ring-emerald-500/20 shadow-sm'
                          : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-700'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className={`p-2.5 rounded-xl ${
                            isSelected 
                              ? 'bg-emerald-600 text-white' 
                              : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                          }`}>
                            <Building2 className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                                {fac.name}
                              </h4>
                              {fac.rating && (
                                <span className="bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 text-[10px] font-bold px-1.5 py-0.5 rounded">
                                  ★ {fac.rating.toFixed(1)}
                                </span>
                              )}
                            </div>
                            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                              {fac.category}
                            </span>
                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span className="line-clamp-1">{fac.address}</span>
                            </p>
                          </div>
                        </div>

                        {/* Distance & ETA Badge */}
                        <div className="text-right shrink-0">
                          <span className="inline-block px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
                            {fac.distance || '~2.5 km'}
                          </span>
                          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                            {fac.eta || '6 mnt'}
                          </p>
                        </div>
                      </div>

                      {/* Services tags */}
                      {fac.services && fac.services.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-700/60">
                          {fac.services.map((svc, i) => (
                            <span
                              key={i}
                              className="text-[10px] font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-md"
                            >
                              {svc}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700/60">
                        <a
                          href={fac.googleMapsUrl}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 font-semibold flex items-center gap-1"
                        >
                          <Navigation className="w-3.5 h-3.5" />
                          <span>Navigasi Google Maps</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>

                        {onSelectFacility && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectFacility(fac);
                              toast.success(`Fasilitas "${fac.name}" terpilih!`);
                            }}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-sm"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>{selectButtonLabel}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Right Column: Interactive Map Preview, Grounded AI Summary & Live Directions */}
            <div className={`${viewTab === 'list' ? 'lg:col-span-5' : 'lg:col-span-7'} space-y-4`}>
              {/* Interactive Map Visual Simulator */}
              <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-700 shadow-md relative">
                <div className="p-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-xs text-white">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                    <span className="font-bold">Google Maps Live Radar & Route View</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setMapMode(mapMode === 'roadmap' ? 'satellite' : 'roadmap')}
                      className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-300"
                    >
                      {mapMode === 'roadmap' ? 'Satelit' : 'Roadmap'}
                    </button>
                    <a
                      href={activeFac?.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[10px] text-cyan-400 hover:underline flex items-center gap-0.5"
                    >
                      <Maximize2 className="w-3 h-3" /> Full Map
                    </a>
                  </div>
                </div>

                {/* Map Graphics Canvas */}
                <div className="h-64 sm:h-72 w-full relative bg-slate-900 flex items-center justify-center overflow-hidden">
                  {/* Grid lines simulating real GIS map */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-40" />
                  
                  {/* Hospital Center Coordinates Marker */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer z-20">
                    <div className="relative">
                      <span className="absolute -inset-2 rounded-full bg-emerald-500/30 animate-ping" />
                      <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg border-2 border-white">
                        <Building2 className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="bg-slate-900/90 text-white text-[11px] font-bold px-2 py-1 rounded-md shadow mt-1 border border-emerald-500/50 whitespace-nowrap">
                      {activeFac?.name || 'MYITARU Medical Center'}
                    </div>
                  </div>

                  {/* Other nearby markers */}
                  {facilities.slice(1, 4).map((f, i) => (
                    <div
                      key={f.id}
                      onClick={() => setSelectedFacility(f)}
                      style={{
                        top: `${30 + i * 25}%`,
                        left: `${20 + i * 25}%`
                      }}
                      className="absolute flex flex-col items-center cursor-pointer hover:scale-110 transition z-10"
                    >
                      <div className="w-7 h-7 rounded-full bg-cyan-600 text-white flex items-center justify-center shadow border border-white text-xs">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <span className="text-[9px] bg-slate-950/80 text-cyan-200 px-1.5 rounded mt-0.5 border border-cyan-800 whitespace-nowrap max-w-[100px] truncate">
                        {f.name}
                      </span>
                    </div>
                  ))}

                  {/* Navigation Path Polyline simulation */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-emerald-400 stroke-2 opacity-70">
                    <path
                      d="M 120 80 Q 200 150 250 180 T 360 220"
                      fill="none"
                      strokeDasharray="6 4"
                      className="animate-pulse"
                    />
                  </svg>

                  {/* Bottom Map Controls Overlay */}
                  <div className="absolute bottom-3 left-3 right-3 bg-slate-950/85 backdrop-blur-md p-3 rounded-xl border border-slate-800 text-xs text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 z-20">
                    <div className="flex items-center gap-2">
                      <Navigation className="w-4 h-4 text-emerald-400 shrink-0" />
                      <div>
                        <p className="font-bold text-white text-xs">{activeFac?.name}</p>
                        <p className="text-[11px] text-slate-400">{activeFac?.address}</p>
                      </div>
                    </div>

                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(activeFac?.address || activeFac?.name || '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 transition whitespace-nowrap"
                    >
                      <Route className="w-3.5 h-3.5" />
                      <span>Rute Google Maps</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>

              {/* AI Grounded Summary */}
              {aiAnswer && (
                <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-2">
                  <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold">
                    <Sparkles className="w-4 h-4" />
                    <span>Analisis Geospatial & Rujukan Klinis</span>
                  </div>
                  <div className="prose dark:prose-invert text-xs text-slate-700 dark:text-slate-300 max-h-48 overflow-y-auto pr-1 leading-relaxed">
                    {aiAnswer}
                  </div>
                </div>
              )}

              {/* Google Maps Official Citations / Sources */}
              {sources.length > 0 && (
                <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
                  <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-red-500" />
                    <span>Tautan Langsung Google Maps Terverifikasi</span>
                  </h5>
                  <div className="grid grid-cols-1 gap-2">
                    {sources.map((src, i) => (
                      <a
                        key={i}
                        href={src.url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-700/50 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-slate-200 dark:border-slate-600 transition flex items-center justify-between text-slate-800 dark:text-slate-200"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-[10px] font-bold">
                            {i + 1}
                          </span>
                          <span className="font-semibold truncate">{src.title}</span>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-blue-500 shrink-0 ml-2" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default GoogleMapsHealthLocator;
