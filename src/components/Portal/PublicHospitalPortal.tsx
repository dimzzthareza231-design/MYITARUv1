import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  PhoneCall,
  CalendarCheck,
  Smartphone,
  ShieldCheck,
  Stethoscope,
  Clock,
  MapPin,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  HeartPulse,
  Building2,
  FileText,
  Menu,
  X,
  UserCheck,
  Lock
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import {
  CENTERS_OF_EXCELLENCE,
  MCU_PACKAGES,
  HOSPITAL_BRANCHES,
  HEALTH_ARTICLES,
  PATIENT_STORIES,
  getPublicPoliklinik,
  getPublicDoctors,
  type HealthArticle
} from '../../data/hospitalPublicCatalog';
import { type Doctor } from '../../data/seedData';
import { PWAInstallButton } from '../PWA/PWAInstallButton';

import heroHospitalImg from '../../assets/images/hospital_hero_atrium_1794532010598.jpg';
import excellenceSuiteImg from '../../assets/images/excellence_medical_suite_1794532010941.jpg';
import doctorConsultImg from '../../assets/images/specialist_doctor_consult_1794532010547.jpg';
import mobileLifestyleImg from '../../assets/images/patient_mobile_lifestyle_1794532011071.jpg';

interface LiveDoctor extends Doctor {
  kuota_tersisa?: number;
}

export const PublicHospitalPortal: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const poliklinikList = useMemo(() => getPublicPoliklinik(), []);
  const fallbackDoctors = useMemo(() => getPublicDoctors(), []);

  const [doctors, setDoctors] = useState<LiveDoctor[]>(fallbackDoctors);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPoliId, setSelectedPoliId] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [selectedBranch, setSelectedBranch] = useState<string>(HOSPITAL_BRANCHES[0].id);
  const [showAllDoctors, setShowAllDoctors] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Article Reader Modal
  const [activeArticle, setActiveArticle] = useState<HealthArticle | null>(null);

  // Appointment Booking Modal
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingDoctor, setBookingDoctor] = useState<LiveDoctor | null>(null);
  const [bookingForm, setBookingForm] = useState({
    isExistingPatient: false,
    no_rm: '',
    nama: '',
    tanggal_lahir: '1990-05-15',
    no_hp: '',
    poli_id: '',
    poli_nama: '',
    dokter_id: '',
    dokter_nama: '',
    jam_praktek: '',
    tanggal: new Date().toISOString().split('T')[0],
    penjamin: 'Umum / Mandiri',
    keluhan: ''
  });
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<{
    no_rm: string;
    tanggal_lahir: string;
    nama: string;
    nomor_antrian: string;
    poli: string;
    dokter: string;
    tanggal: string;
    token?: string;
  } | null>(null);

  useEffect(() => {
    let active = true;
    fetch('/api/public/hospital-catalog')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (active && data?.doctors && Array.isArray(data.doctors)) {
          setDoctors(data.doctors);
        }
      })
      .catch(() => {
        // Retain deterministic seed catalog seamlessly
      });
    return () => {
      active = false;
    };
  }, []);

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doc) => {
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        doc.nama.toLowerCase().includes(q) ||
        doc.spesialis.toLowerCase().includes(q) ||
        doc.poli.toLowerCase().includes(q) ||
        (doc.subspesialis || '').toLowerCase().includes(q);

      const matchesPoli = selectedPoliId === 'ALL' || doc.poli_id === selectedPoliId;

      if (!matchesSearch || !matchesPoli) return false;
      if (selectedCategory === 'Semua') return true;

      const poliObj = poliklinikList.find((p) => p.id === doc.poli_id);
      return poliObj?.kategori === selectedCategory;
    });
  }, [doctors, searchQuery, selectedPoliId, selectedCategory, poliklinikList]);

  const visibleDoctors = showAllDoctors ? filteredDoctors : filteredDoctors.slice(0, 6);

  const openBookingModal = (doctor?: LiveDoctor, presetPoliKode?: string, presetKeluhan?: string) => {
    let chosenDoc = doctor;
    if (!chosenDoc && presetPoliKode) {
      const targetPoli = poliklinikList.find((p) => p.kode === presetPoliKode);
      if (targetPoli) {
        chosenDoc = doctors.find((d) => d.poli_id === targetPoli.id) || doctors[0];
      }
    }
    if (!chosenDoc) {
      chosenDoc = doctors[0];
    }

    setBookingDoctor(chosenDoc);
    setBookingSuccess(null);
    setBookingForm((prev) => ({
      ...prev,
      poli_id: chosenDoc?.poli_id || '',
      poli_nama: chosenDoc?.poli || '',
      dokter_id: chosenDoc?.id || '',
      dokter_nama: chosenDoc?.nama || '',
      jam_praktek: chosenDoc?.jam || '08:00 - 13:00 WIB',
      keluhan: presetKeluhan || prev.keluhan
    }));
    setBookingModalOpen(true);
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingForm.poli_nama || !bookingForm.dokter_nama) {
      toast.error('Silakan pilih poliklinik dan dokter tujuan.');
      return;
    }
    if (bookingForm.isExistingPatient && !bookingForm.no_rm.trim()) {
      toast.error('Masukkan Nomor Rekam Medis (No. RM) Anda.');
      return;
    }
    if (!bookingForm.isExistingPatient && !bookingForm.nama.trim()) {
      toast.error('Masukkan nama lengkap pasien.');
      return;
    }

    setIsSubmittingBooking(true);
    try {
      const res = await fetch('/api/patient/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nama: bookingForm.nama,
          no_rm: bookingForm.isExistingPatient ? bookingForm.no_rm : undefined,
          tanggal_lahir: bookingForm.tanggal_lahir,
          no_hp: bookingForm.no_hp,
          poli_id: bookingForm.poli_id,
          poli_nama: bookingForm.poli_nama,
          dokter_id: bookingForm.dokter_id,
          dokter_nama: bookingForm.dokter_nama,
          tanggal: bookingForm.tanggal,
          jam_praktek: bookingForm.jam_praktek,
          penjamin: bookingForm.penjamin,
          keluhan: bookingForm.keluhan
        })
      });

      const data = await res.json();
      if (!res.ok || !data?.success) {
        toast.error(data?.message || 'Gagal membuat janji temu.');
        return;
      }

      if (data.token) {
        try {
          sessionStorage.setItem('myitaru_patient_token', data.token);
          if (data.dossier) {
            localStorage.setItem('myitaru_patient_cached_dossier', JSON.stringify(data.dossier));
          }
        } catch {
          // Safe fallback if storage unavailable
        }
      }

      setBookingSuccess({
        ...data.booking,
        token: data.token
      });
      toast.success(`Nomor Antrean ${data.booking.nomor_antrian} berhasil diterbitkan!`);
    } catch {
      toast.error('Koneksi ke server terganggu. Silakan coba beberapa saat lagi.');
    } finally {
      setIsSubmittingBooking(false);
    }
  };

  const scrollToSection = (sectionId: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const formatRupiah = (amount: number) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(amount);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      {/* Top Emergency & Accreditation Strip (Non-crowded utility bar) */}
      <div className="bg-[#082B6B] text-white text-xs py-2 px-4 sm:px-6 lg:px-8 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <a
              href="tel:1500911"
              className="inline-flex items-center gap-2 font-semibold text-white hover:text-red-200 transition"
            >
              <span className="inline-flex items-center gap-1 bg-[#DC2626] px-2 py-0.5 rounded font-bold tracking-wide">
                <PhoneCall className="w-3 h-3" /> IGD 24 JAM
              </span>
              <span className="font-mono tabular-nums font-bold">1-500-911</span>
            </a>
            <span className="hidden sm:inline text-blue-200">
              Akreditasi KARS Paripurna · Terintegrasi BPJS VClaim &amp; Kemenkes SatuSehat
            </span>
          </div>
          <button
            type="button"
            onClick={() => navigate('/mobile')}
            className="inline-flex items-center gap-1.5 text-sky-200 hover:text-white font-semibold cursor-pointer whitespace-nowrap"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Cek Antrean di Aplikasi Pasien</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Strict 3-Zone Single-Row Public Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark (Strictly 1 line) */}
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2.5 text-left whitespace-nowrap shrink-0 cursor-pointer"
          >
            <img src="/icon.svg" alt="MYITARU Klinik" className="w-9 h-9 rounded-xl shadow-xs" />
            <span className="text-lg sm:text-xl font-extrabold tracking-tight text-[#0B3D91]">
              MYITARU <span className="font-semibold text-slate-600">Klinik</span>
            </span>
          </button>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-700">
            <button
              type="button"
              onClick={() => scrollToSection('cari-dokter')}
              className="hover:text-[#0B3D91] transition whitespace-nowrap shrink-0 cursor-pointer"
            >
              Cari Dokter
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('layanan')}
              className="hover:text-[#0B3D91] transition whitespace-nowrap shrink-0 cursor-pointer"
            >
              Layanan
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('paket-mcu')}
              className="hover:text-[#0B3D91] transition whitespace-nowrap shrink-0 cursor-pointer"
            >
              Paket MCU
            </button>
            <button
              type="button"
              onClick={() => navigate('/mobile')}
              className="hover:text-[#0B3D91] transition whitespace-nowrap shrink-0 cursor-pointer"
            >
              App Pasien
            </button>
          </nav>

          {/* Zone 3: Single Primary Staff Action + Mobile Menu Trigger */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => navigate(currentUser ? '/dashboard' : '/staff/login')}
              className="inline-flex items-center gap-2 bg-[#0B3D91] hover:bg-[#082D6E] text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-xs transition whitespace-nowrap shrink-0 cursor-pointer min-h-[44px]"
            >
              <Lock className="w-4 h-4 shrink-0" />
              <span>{currentUser ? 'Dasbor SIMK' : 'Akses Staf'}</span>
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label="Menu Navigasi"
              className="md:hidden p-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-200 px-4 py-4 space-y-2">
            <button
              type="button"
              onClick={() => scrollToSection('cari-dokter')}
              className="w-full text-left px-3 py-3 rounded-xl font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cari Dokter &amp; Jadwal
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('layanan')}
              className="w-full text-left px-3 py-3 rounded-xl font-semibold text-slate-700 hover:bg-slate-50"
            >
              Layanan Unggulan
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('paket-mcu')}
              className="w-full text-left px-3 py-3 rounded-xl font-semibold text-slate-700 hover:bg-slate-50"
            >
              Paket Medical Check-Up
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                navigate('/mobile');
              }}
              className="w-full text-left px-3 py-3 rounded-xl font-semibold text-[#0B3D91] bg-blue-50"
            >
              Buka Aplikasi Mobile Pasien
            </button>
          </div>
        )}
      </header>

      {/* Section 1: Siloam-Style Hero Banner & Integrated Doctor Search Dock */}
      <section className="relative overflow-hidden bg-[#082046]">
        <div className="relative min-h-[540px] lg:min-h-[600px] flex items-center">
          <img
            src={heroHospitalImg}
            alt="Gedung Utama dan Atrium MYITARU Klinik"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#061A3D]/95 via-[#0B3D91]/80 to-[#0B3D91]/30" />

          <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16 sm:py-20 pb-28 sm:pb-32">
            <div className="max-w-2xl space-y-6">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-300">
                MYITARU KLINIK NETWORK · STANDAR PELAYANAN TERPADU
              </p>

              <h1 className="text-3xl sm:text-5xl font-extrabold text-white leading-[1.12] tracking-tight text-balance">
                Pelayanan Medis Berstandar Internasional, Kini Dalam Genggaman Anda.
              </h1>

              <p className="text-base sm:text-lg text-slate-100 leading-relaxed max-w-xl">
                Temukan jadwal dokter spesialis secara akurat, daftar poliklinik tanpa antre loket, dan pantau nomor antrean serta hasil lab langsung dari ponsel Anda.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => openBookingModal()}
                  className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-[#0B3D91] font-bold px-6 py-3.5 rounded-xl shadow-lg transition cursor-pointer min-h-[48px] text-sm sm:text-base whitespace-nowrap"
                >
                  <CalendarCheck className="w-5 h-5 shrink-0" />
                  <span>Buat Janji Dokter</span>
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/mobile')}
                  className="inline-flex items-center justify-center gap-2 bg-sky-500/20 hover:bg-sky-500/30 border border-white/35 text-white font-semibold px-6 py-3.5 rounded-xl backdrop-blur-xs transition cursor-pointer min-h-[48px] text-sm sm:text-base whitespace-nowrap"
                >
                  <Smartphone className="w-5 h-5 shrink-0" />
                  <span>Buka Aplikasi Pasien</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Quick Doctor Search Dock */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 pb-10">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-4 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
              <div className="md:col-span-5">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Cari Dokter atau Spesialisasi
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Contoh: Jantung, Anak, dr. Hendra..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-sm focus:bg-white focus:border-[#0B3D91] focus:ring-2 focus:ring-[#0B3D91]/15 outline-none"
                  />
                </div>
              </div>

              <div className="md:col-span-3">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Poliklinik Tujuan
                </label>
                <select
                  value={selectedPoliId}
                  onChange={(e) => {
                    setSelectedPoliId(e.target.value);
                    setSelectedCategory('Semua');
                  }}
                  className="w-full px-3.5 py-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-sm focus:bg-white focus:border-[#0B3D91] outline-none"
                >
                  <option value="ALL">Semua Poliklinik (18 Unit)</option>
                  {poliklinikList.map((poli) => (
                    <option key={poli.id} value={poli.id}>
                      {poli.nama}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Lokasi Cabang
                </label>
                <select
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  className="w-full px-3.5 py-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-sm focus:bg-white focus:border-[#0B3D91] outline-none"
                >
                  {HOSPITAL_BRANCHES.map((branch) => (
                    <option key={branch.id} value={branch.id}>
                      {branch.city}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <button
                  type="button"
                  onClick={() => scrollToSection('cari-dokter')}
                  className="w-full bg-[#0B3D91] hover:bg-[#082D6E] text-white font-bold py-3 px-4 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer min-h-[46px] text-sm"
                >
                  <Search className="w-4 h-4" />
                  <span>Cari Jadwal</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Layanan Unggulan (Centers of Excellence) */}
      <section id="layanan" className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-14">
            <div className="lg:col-span-6 space-y-4">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0B3D91]">
                CENTERS OF EXCELLENCE
              </p>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight text-balance">
                Pusat Layanan Spesialis &amp; Diagnostik Terintegrasi
              </h2>
              <p className="text-slate-600 text-base leading-relaxed">
                Didukung tim dokter subspesialis multidisiplin, fasilitas pencitraan CT-Scan 128 Slices, Cath Lab siaga 24 jam, serta rekam medis elektronik yang terhubung aman ke Aplikasi Pasien.
              </p>
              <div className="grid grid-cols-3 gap-4 pt-3 border-t border-slate-200">
                <div>
                  <p className="text-2xl font-extrabold text-[#0B3D91] font-mono tabular-nums">18+</p>
                  <p className="text-xs font-medium text-slate-600 mt-0.5">Poliklinik Spesialis</p>
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-[#0B3D91] font-mono tabular-nums">36+</p>
                  <p className="text-xs font-medium text-slate-600 mt-0.5">Dokter Berpengalaman</p>
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-[#DC2626] font-mono tabular-nums">24/7</p>
                  <p className="text-xs font-medium text-slate-600 mt-0.5">IGD &amp; Ambulans</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-white aspect-[4/3]">
                <img
                  src={excellenceSuiteImg}
                  alt="Ruang Diagnostik CT-Scan dan Kardiologi MYITARU Klinik"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CENTERS_OF_EXCELLENCE.map((center) => (
              <div
                key={center.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-[#0B3D91]/40 p-6 flex flex-col justify-between transition shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 text-xs font-semibold text-[#0B3D91] mb-2">
                    <span>{center.highlightMetric}</span>
                    <HeartPulse className="w-4 h-4 text-[#0B3D91]" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{center.title}</h3>
                  <p className="text-xs font-medium text-slate-500 mt-0.5">{center.subtitle}</p>
                  <p className="text-sm text-slate-600 mt-3 leading-relaxed">{center.description}</p>

                  <ul className="mt-4 space-y-1.5 border-t border-slate-100 pt-3">
                    {center.services.map((srv) => (
                      <li key={srv} className="text-xs text-slate-700 flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{srv}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      const poli = poliklinikList.find((p) => p.kode === center.poliKode);
                      if (poli) {
                        setSelectedPoliId(poli.id);
                        setSelectedCategory('Semua');
                      }
                      scrollToSection('cari-dokter');
                    }}
                    className="text-sm font-bold text-[#0B3D91] hover:text-[#082D6E] inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Lihat Dokter Terkait</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => openBookingModal(undefined, center.poliKode)}
                    className="text-xs font-semibold text-slate-600 hover:text-[#0B3D91] cursor-pointer"
                  >
                    Daftar Sekarang
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Cari Dokter & Jadwal Praktik */}
      <section id="cari-dokter" className="py-16 sm:py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0B3D91]">
                DIREKTORI DOKTER SPESIALIS
              </p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                Jadwal Praktik Dokter Hari Ini
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Pilih dokter spesialis untuk melihat ketersediaan kuota dan membuat janji temu secara langsung.
              </p>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex flex-wrap gap-2">
              {['Semua', 'Spesialis Utama', 'Subspesialis', 'Penunjang & Khusus'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat);
                    setSelectedPoliId('ALL');
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer min-h-[40px] ${
                    selectedCategory === cat
                      ? 'bg-[#0B3D91] text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {filteredDoctors.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-10 text-center">
              <Stethoscope className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <p className="font-bold text-slate-800">Jadwal dokter tidak ditemukan</p>
              <p className="text-sm text-slate-600 mt-1">
                Coba ubah kata kunci pencarian atau pilih “Semua Poliklinik”.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedPoliId('ALL');
                  setSelectedCategory('Semua');
                }}
                className="mt-4 px-4 py-2 rounded-xl bg-[#0B3D91] text-white text-sm font-semibold cursor-pointer"
              >
                Reset Pencarian
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {visibleDoctors.map((doc) => {
                  const quotaLeft =
                    doc.kuota_tersisa !== undefined
                      ? doc.kuota_tersisa
                      : Math.max(2, (doc.kuota || 25) - (doc.pasien_terlayani || 8));

                  const initials = doc.nama
                    .replace(/^(dr\.|drg\.)\s*/i, '')
                    .split(' ')
                    .slice(0, 2)
                    .map((n) => n[0])
                    .join('');

                  return (
                    <div
                      key={doc.id}
                      className="rounded-2xl border border-slate-200 bg-white p-6 flex flex-col justify-between hover:border-[#0B3D91]/40 transition shadow-xs"
                    >
                      <div>
                        <div className="flex items-start gap-3.5">
                          <div className="w-12 h-12 rounded-xl bg-[#0B3D91]/10 text-[#0B3D91] font-extrabold text-sm flex items-center justify-center shrink-0">
                            {initials}
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-bold text-slate-900 text-base leading-snug">
                              {doc.nama}
                            </h3>
                            <p className="text-xs font-semibold text-[#0B3D91] mt-0.5">
                              {doc.spesialis}
                            </p>
                            {doc.subspesialis && (
                              <p className="text-xs text-slate-500 mt-0.5">{doc.subspesialis}</p>
                            )}
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                            <span>
                              {doc.poli} · {doc.ruangan || 'Poliklinik Utama'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                            <span className="font-mono tabular-nums">
                              {doc.hari || 'Senin - Jumat'} · {doc.jam || '08:00 - 14:00 WIB'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                        <div className="text-xs">
                          <span className="font-semibold text-emerald-700">
                            {doc.status_jaga || 'Sedang Berpraktik'}
                          </span>
                          <span className="text-slate-400 mx-1.5">·</span>
                          <span className="font-mono tabular-nums text-slate-600">
                            Sisa {quotaLeft}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => openBookingModal(doc)}
                          className="bg-[#0B3D91] hover:bg-[#082D6E] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer whitespace-nowrap min-h-[40px]"
                        >
                          Buat Janji
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {filteredDoctors.length > 6 && (
                <div className="mt-8 text-center">
                  <button
                    type="button"
                    onClick={() => setShowAllDoctors((v) => !v)}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-[#0B3D91]/30 text-[#0B3D91] font-bold text-sm hover:bg-blue-50 transition cursor-pointer"
                  >
                    <span>
                      {showAllDoctors
                        ? 'Tampilkan Lebih Sedikit'
                        : `Lihat Seluruh ${filteredDoctors.length} Dokter Spesialis`}
                    </span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Section 4: Paket Medical Check-Up (MCU) */}
      <section id="paket-mcu" className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0B3D91]">
              PREVENTIVE &amp; DIAGNOSTIC PACKAGES
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Paket Medical Check-Up Transparan
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Deteksi dini kondisi kesehatan Anda dengan hasil laboratorium &amp; radiologi tervalidasi yang langsung dapat diunduh di Aplikasi Pasien.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {MCU_PACKAGES.map((pkg, idx) => (
              <div
                key={pkg.id}
                className={`rounded-2xl p-6 sm:p-7 flex flex-col justify-between bg-white border ${
                  idx === 1 ? 'border-[#0B3D91] shadow-md' : 'border-slate-200 shadow-xs'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-[#0B3D91]">
                    <span>{pkg.tier}</span>
                    <span className="font-mono tabular-nums text-slate-500">{pkg.duration}</span>
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900 mt-2">{pkg.name}</h3>
                  <p className="text-2xl font-extrabold text-[#0B3D91] font-mono tabular-nums mt-3">
                    {formatRupiah(pkg.price)}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {pkg.recommendedFor} · {pkg.fastingRequired ? 'Perlu Puasa 10 Jam' : 'Tanpa Puasa'}
                  </p>

                  <ul className="mt-5 pt-5 border-t border-slate-100 space-y-2.5">
                    {pkg.highlights.map((item) => (
                      <li key={item} className="text-sm text-slate-700 flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() => openBookingModal(undefined, 'MCU', `Pendaftaran ${pkg.name}`)}
                  className={`mt-6 w-full py-3 rounded-xl font-bold text-sm transition cursor-pointer min-h-[44px] ${
                    idx === 1
                      ? 'bg-[#0B3D91] hover:bg-[#082D6E] text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
                  }`}
                >
                  Pesan Paket MCU
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5: Aplikasi Mobile Pasien (MyMYITARU PWA Showcase) */}
      <section className="py-16 sm:py-20 bg-[#0B3D91] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-5">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-300">
                APLIKASI MOBILE PASIEN MYITARU
              </p>
              <h2 className="text-2xl sm:text-4xl font-extrabold leading-tight text-balance">
                Cek Antrean Poli, Jadwal Dokter &amp; Hasil Lab Langsung Dari Ponsel
              </h2>
              <p className="text-blue-100 text-base leading-relaxed max-w-2xl">
                Dirancang ringan sebagai aplikasi mobile yang dapat dipasang langsung ke layar utama ponsel Anda. Verifikasi cepat dan aman melalui dua pilihan akses pasien:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="rounded-2xl bg-white/10 border border-white/15 p-4">
                  <p className="font-bold text-white flex items-center gap-2 text-sm">
                    <UserCheck className="w-4 h-4 text-sky-300" />
                    Masuk dengan Akun Google
                  </p>
                  <p className="text-xs text-blue-100 mt-1.5 leading-relaxed">
                    Satu ketukan melalui autentikasi Google terenkripsi untuk memantau seluruh kunjungan keluarga.
                  </p>
                </div>

                <div className="rounded-2xl bg-white/10 border border-white/15 p-4">
                  <p className="font-bold text-white flex items-center gap-2 text-sm">
                    <ShieldCheck className="w-4 h-4 text-sky-300" />
                    Verifikasi No. RM + Tanggal Lahir
                  </p>
                  <p className="text-xs text-blue-100 mt-1.5 leading-relaxed">
                    Tanpa perlu membuat kata sandi baru. Cukup masukkan Nomor Rekam Medis &amp; tanggal lahir Anda.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => navigate('/mobile')}
                  className="inline-flex items-center gap-2 bg-white hover:bg-slate-100 text-[#0B3D91] font-bold px-6 py-3.5 rounded-xl transition cursor-pointer min-h-[48px] text-sm"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Buka App Mobile Pasien</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <PWAInstallButton
                  variant="outline"
                  label="Pasang ke Layar Utama"
                  showAlwaysGuide
                  className="bg-transparent border-white/40 text-white hover:bg-white/15"
                />
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-2xl overflow-hidden border border-white/20 shadow-2xl aspect-square max-w-md mx-auto">
                <img
                  src={mobileLifestyleImg}
                  alt="Pasien mengakses antrean dan layanan MYITARU lewat ponsel"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 6: Healthpedia & Cerita Pasien */}
      <section className="py-16 sm:py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Healthpedia */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0B3D91]">
                  HEALTHPEDIA &amp; PANDUAN PASIEN
                </p>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                  Edukasi Medis Terverifikasi Dokter
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center rounded-2xl border border-slate-200 p-4 bg-slate-50">
                <div className="sm:col-span-5 aspect-[4/3] rounded-xl overflow-hidden">
                  <img
                    src={doctorConsultImg}
                    alt="Konsultasi Dokter Spesialis MYITARU Klinik"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="sm:col-span-7 space-y-2">
                  <span className="text-xs font-bold text-[#0B3D91]">
                    {HEALTH_ARTICLES[0].category} · {HEALTH_ARTICLES[0].readMinutes} Menit Baca
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 leading-snug">
                    {HEALTH_ARTICLES[0].title}
                  </h3>
                  <p className="text-sm text-slate-600">{HEALTH_ARTICLES[0].summary}</p>
                  <button
                    type="button"
                    onClick={() => setActiveArticle(HEALTH_ARTICLES[0])}
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0B3D91] pt-1 cursor-pointer"
                  >
                    <span>Baca Panduan Lengkap</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {HEALTH_ARTICLES.slice(1).map((article) => (
                  <div
                    key={article.id}
                    className="rounded-2xl border border-slate-200 p-5 bg-white hover:border-[#0B3D91]/40 transition flex flex-col justify-between"
                  >
                    <div>
                      <p className="text-xs font-semibold text-[#0B3D91]">
                        {article.category} · {article.readMinutes} Menit
                      </p>
                      <h4 className="font-bold text-slate-900 mt-1.5 leading-snug">
                        {article.title}
                      </h4>
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                        {article.summary}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveArticle(article)}
                      className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-[#0B3D91] cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Baca Artikel</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Patient Stories */}
            <div className="lg:col-span-5 space-y-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0B3D91]">
                  PENGALAMAN PASIEN
                </p>
                <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
                  Kisah Pemulihan &amp; Kepercayaan
                </h2>
              </div>

              <div className="space-y-4">
                {PATIENT_STORIES.map((story) => (
                  <div
                    key={story.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-5 space-y-2.5"
                  >
                    <p className="text-xs font-bold text-[#0B3D91]">
                      {story.unit} · {story.patientInitials}
                    </p>
                    <p className="text-sm text-slate-700 leading-relaxed">“{story.quote}”</p>
                    <p className="text-xs font-semibold text-emerald-700">{story.outcome}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 7: Jaringan Cabang & Corporate Footer */}
      <footer className="bg-[#07265C] text-white pt-16 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12 border-b border-white/15">
            {HOSPITAL_BRANCHES.map((branch) => (
              <div
                key={branch.id}
                className="rounded-2xl bg-white/5 border border-white/10 p-5 space-y-2"
              >
                <p className="text-xs font-bold text-sky-300 uppercase tracking-wider">
                  {branch.city} · {branch.bedsCount} Tempat Tidur
                </p>
                <h3 className="font-bold text-white text-base">{branch.name}</h3>
                <p className="text-xs text-blue-100 flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-sky-300 shrink-0 mt-0.5" />
                  <span>{branch.address}</span>
                </p>
                <p className="text-xs text-blue-200 pt-1">
                  Janji Temu: <span className="font-mono tabular-nums font-semibold text-white">{branch.appointmentPhone}</span>
                </p>
              </div>
            ))}
          </div>

          <div className="pt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-sm">
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <img src="/icon.svg" alt="MYITARU" className="w-8 h-8 rounded-lg" />
                <span className="font-extrabold text-lg">MYITARU Klinik</span>
              </div>
              <p className="text-xs text-blue-100 leading-relaxed">
                Jaringan klinik modern terintegrasi dengan Sistem Informasi Manajemen Klinik (SIMK) dan Aplikasi Mobile Pasien.
              </p>
            </div>

            <div>
              <p className="font-bold text-white mb-3 text-xs uppercase tracking-wider">
                Layanan Publik
              </p>
              <ul className="space-y-2 text-xs text-blue-100">
                <li>
                  <button type="button" onClick={() => scrollToSection('cari-dokter')} className="hover:text-white cursor-pointer">
                    Cari Dokter &amp; Jadwal Praktik
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => scrollToSection('layanan')} className="hover:text-white cursor-pointer">
                    Centers of Excellence
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => scrollToSection('paket-mcu')} className="hover:text-white cursor-pointer">
                    Paket Medical Check-Up
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <p className="font-bold text-white mb-3 text-xs uppercase tracking-wider">
                Akses Sistem
              </p>
              <ul className="space-y-2 text-xs text-blue-100">
                <li>
                  <button type="button" onClick={() => navigate('/mobile')} className="hover:text-white cursor-pointer">
                    Aplikasi Mobile Pasien (/mobile)
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => navigate('/portal-karyawan')} className="hover:text-white cursor-pointer">
                    Portal Karyawan RS (/portal-karyawan)
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => navigate('/app-karyawan')} className="hover:text-white cursor-pointer">
                    Unduh App Karyawan (/app-karyawan)
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => navigate(currentUser ? '/dashboard' : '/staff/login')}
                    className="hover:text-white cursor-pointer"
                  >
                    SIMK Inti &amp; EMR (/staff/login)
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <p className="font-bold text-white mb-3 text-xs uppercase tracking-wider">
                Gawat Darurat 24 Jam
              </p>
              <a
                href="tel:1500911"
                className="inline-flex items-center gap-2 bg-[#DC2626] hover:bg-red-700 px-4 py-2.5 rounded-xl font-bold text-sm font-mono tabular-nums transition"
              >
                <PhoneCall className="w-4 h-4" />
                <span>1-500-911</span>
              </a>
              <p className="text-xs text-blue-200 mt-2">
                Ambulans Medik &amp; Unit Stroke Siaga 24 Jam.
              </p>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-blue-200">
            <p>© 2026 MYITARU Klinik Group · Sistem Informasi Manajemen Klinik Terpadu.</p>
            <p>Terhubung dengan BPJS VClaim &amp; Kemenkes SatuSehat.</p>
          </div>
        </div>
      </footer>

      {/* Modal Pembaca Healthpedia */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="bg-white text-slate-900 rounded-2xl max-w-xl w-full max-h-[88vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold text-[#0B3D91]">
                  {activeArticle.category} · {activeArticle.readMinutes} Menit Baca
                </p>
                <h3 className="text-xl font-extrabold text-slate-900 mt-1">{activeArticle.title}</h3>
                <p className="text-xs text-slate-500 mt-1">
                  {activeArticle.author} · {activeArticle.date}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveArticle(null)}
                aria-label="Tutup artikel"
                className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-5 space-y-3 text-sm text-slate-700 leading-relaxed">
              {activeArticle.body.map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  setActiveArticle(null);
                  openBookingModal();
                }}
                className="px-4 py-2.5 rounded-xl bg-[#0B3D91] text-white text-sm font-semibold cursor-pointer"
              >
                Konsultasi dengan Dokter
              </button>
              <button
                type="button"
                onClick={() => setActiveArticle(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-sm font-semibold cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Booking Janji Temu Online */}
      {bookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="bg-white text-slate-900 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 sm:p-7">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#0B3D91]">
                  Pendaftaran Poliklinik Online
                </p>
                <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">
                  {bookingSuccess ? 'Janji Temu Terkonfirmasi' : 'Buat Janji Temu Dokter'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setBookingModalOpen(false)}
                aria-label="Tutup modal pendaftaran"
                className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {bookingSuccess ? (
              <div className="py-5 space-y-5">
                <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-5 text-center space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <p className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                    Nomor Antrean Anda
                  </p>
                  <p className="text-4xl font-extrabold font-mono tabular-nums text-[#0B3D91]">
                    {bookingSuccess.nomor_antrian}
                  </p>
                  <p className="text-xs text-slate-600">
                    No. Rekam Medis: <strong className="font-mono">{bookingSuccess.no_rm}</strong>
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 p-4 space-y-2 text-sm">
                  <div className="flex justify-between gap-2">
                    <span className="text-slate-500">Pasien</span>
                    <span className="font-semibold text-slate-900">{bookingSuccess.nama}</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-slate-500">Poliklinik</span>
                    <span className="font-semibold text-slate-900">{bookingSuccess.poli}</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-slate-500">Dokter</span>
                    <span className="font-semibold text-slate-900 text-right">{bookingSuccess.dokter}</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-slate-500">Tanggal</span>
                    <span className="font-mono tabular-nums font-semibold text-slate-900">
                      {bookingSuccess.tanggal}
                    </span>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setBookingModalOpen(false);
                      navigate('/mobile');
                    }}
                    className="w-full py-3.5 rounded-xl bg-[#0B3D91] hover:bg-[#082D6E] text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>Pantau Antrean di App Mobile</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setBookingModalOpen(false)}
                    className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm cursor-pointer"
                  >
                    Selesai
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="mt-5 space-y-4">
                {bookingDoctor && (
                  <div className="rounded-xl bg-blue-50 border border-blue-100 p-3.5">
                    <p className="text-xs font-bold text-[#0B3D91]">{bookingForm.poli_nama}</p>
                    <p className="font-bold text-slate-900 text-sm mt-0.5">{bookingForm.dokter_nama}</p>
                    <p className="text-xs text-slate-600 font-mono mt-0.5">{bookingForm.jam_praktek}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setBookingForm((p) => ({ ...p, isExistingPatient: false }))}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition cursor-pointer ${
                      !bookingForm.isExistingPatient
                        ? 'bg-[#0B3D91] text-white border-[#0B3D91]'
                        : 'bg-white text-slate-700 border-slate-300'
                    }`}
                  >
                    Pasien Baru
                  </button>
                  <button
                    type="button"
                    onClick={() => setBookingForm((p) => ({ ...p, isExistingPatient: true }))}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition cursor-pointer ${
                      bookingForm.isExistingPatient
                        ? 'bg-[#0B3D91] text-white border-[#0B3D91]'
                        : 'bg-white text-slate-700 border-slate-300'
                    }`}
                  >
                    Sudah Punya No. RM
                  </button>
                </div>

                {bookingForm.isExistingPatient ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">
                        No. Rekam Medis
                      </label>
                      <input
                        type="text"
                        required
                        value={bookingForm.no_rm}
                        onChange={(e) => setBookingForm((p) => ({ ...p, no_rm: e.target.value }))}
                        placeholder="RM-260101-0001"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono uppercase focus:border-[#0B3D91] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">
                        Tanggal Lahir
                      </label>
                      <input
                        type="date"
                        required
                        value={bookingForm.tanggal_lahir}
                        onChange={(e) =>
                          setBookingForm((p) => ({ ...p, tanggal_lahir: e.target.value }))
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-[#0B3D91] outline-none"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">
                        Nama Lengkap Pasien
                      </label>
                      <input
                        type="text"
                        required
                        value={bookingForm.nama}
                        onChange={(e) => setBookingForm((p) => ({ ...p, nama: e.target.value }))}
                        placeholder="Nama sesuai KTP"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-[#0B3D91] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">
                        Tanggal Lahir
                      </label>
                      <input
                        type="date"
                        required
                        value={bookingForm.tanggal_lahir}
                        onChange={(e) =>
                          setBookingForm((p) => ({ ...p, tanggal_lahir: e.target.value }))
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-[#0B3D91] outline-none"
                      />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">
                      Tanggal Kunjungan
                    </label>
                    <input
                      type="date"
                      required
                      value={bookingForm.tanggal}
                      onChange={(e) => setBookingForm((p) => ({ ...p, tanggal: e.target.value }))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-[#0B3D91] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">
                      Nomor WhatsApp / HP
                    </label>
                    <input
                      type="tel"
                      value={bookingForm.no_hp}
                      onChange={(e) => setBookingForm((p) => ({ ...p, no_hp: e.target.value }))}
                      placeholder="0812xxxxxxxx"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-[#0B3D91] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Penjamin Biaya</label>
                  <select
                    value={bookingForm.penjamin}
                    onChange={(e) => setBookingForm((p) => ({ ...p, penjamin: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:border-[#0B3D91] outline-none"
                  >
                    <option value="Umum / Mandiri">Umum / Mandiri</option>
                    <option value="BPJS Kesehatan">BPJS Kesehatan</option>
                    <option value="Asuransi Mandiri Inhealth">Asuransi Mandiri Inhealth</option>
                    <option value="Asuransi Allianz Care">Asuransi Allianz Care</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Keluhan Singkat (Opsional)
                  </label>
                  <input
                    type="text"
                    value={bookingForm.keluhan}
                    onChange={(e) => setBookingForm((p) => ({ ...p, keluhan: e.target.value }))}
                    placeholder="Contoh: Kontrol rutin, nyeri dada, MCU tahunan"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-[#0B3D91] outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingBooking}
                  className="w-full py-3.5 rounded-xl bg-[#0B3D91] hover:bg-[#082D6E] text-white font-bold text-sm transition disabled:opacity-60 cursor-pointer min-h-[48px]"
                >
                  {isSubmittingBooking ? 'Menerbitkan Nomor Antrean...' : 'Konfirmasi & Ambil Antrean'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
