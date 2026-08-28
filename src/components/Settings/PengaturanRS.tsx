import React, { useState, useRef } from 'react';
import { useHospital } from '../../contexts/HospitalContext';
import { 
  Save, Image as ImageIcon, Building, Phone, Mail, Globe, MapPin, 
  Award, Trash2, ShieldCheck, UserCheck, Eye, RefreshCw, FileText, CheckCircle2
} from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import { DEFAULT_HOSPITAL_INFO } from '../../types/document';

export function PengaturanRS() {
  const { hospitalSettings, updateHospitalSettings } = useHospital();
  const toast = useToast();
  
  const [activeTab, setActiveTab] = useState<'identitas' | 'legalitas' | 'direksi' | 'preview'>('identitas');

  const [formData, setFormData] = useState({
    name: hospitalSettings.name || DEFAULT_HOSPITAL_INFO.name,
    subname: hospitalSettings.subname || DEFAULT_HOSPITAL_INFO.subname || '',
    address: hospitalSettings.address || DEFAULT_HOSPITAL_INFO.address,
    city: hospitalSettings.city || DEFAULT_HOSPITAL_INFO.city,
    phone: hospitalSettings.phone || DEFAULT_HOSPITAL_INFO.phone,
    email: hospitalSettings.email || DEFAULT_HOSPITAL_INFO.email,
    website: hospitalSettings.website || DEFAULT_HOSPITAL_INFO.website,
    accreditation: hospitalSettings.accreditation || DEFAULT_HOSPITAL_INFO.accreditation || '',
    licenseNumber: hospitalSettings.licenseNumber || DEFAULT_HOSPITAL_INFO.licenseNumber || '',
    kodeRs: hospitalSettings.kodeRs || DEFAULT_HOSPITAL_INFO.kodeRs || '3171890',
    kodePpk: hospitalSettings.kodePpk || DEFAULT_HOSPITAL_INFO.kodePpk || '0115R001',
    directorName: hospitalSettings.directorName || DEFAULT_HOSPITAL_INFO.directorName || 'dr. H. Hendra, MARS, Sp.PK',
    directorNip: hospitalSettings.directorNip || DEFAULT_HOSPITAL_INFO.directorNip || '197508122002121001',
    hospitalType: hospitalSettings.hospitalType || DEFAULT_HOSPITAL_INFO.hospitalType || 'Rumah Sakit Umum (Kelas B Pendidikan)',
    ownership: hospitalSettings.ownership || DEFAULT_HOSPITAL_INFO.ownership || 'Yayasan Tarumanagara',
    emergencyHotline: hospitalSettings.emergencyHotline || DEFAULT_HOSPITAL_INFO.emergencyHotline || '(021) 56958999',
    faxNumber: hospitalSettings.faxNumber || DEFAULT_HOSPITAL_INFO.faxNumber || '(021) 56958724',
  });

  const [logoPreview, setLogoPreview] = useState<string | null>(hospitalSettings.logoUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Ukuran file logo maksimal 2MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
        toast.success('Logo berhasil dimuat!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setLogoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    toast.info('Logo dihapus');
  };

  const handleResetToDefault = () => {
    setFormData({
      name: DEFAULT_HOSPITAL_INFO.name,
      subname: DEFAULT_HOSPITAL_INFO.subname || '',
      address: DEFAULT_HOSPITAL_INFO.address,
      city: DEFAULT_HOSPITAL_INFO.city,
      phone: DEFAULT_HOSPITAL_INFO.phone,
      email: DEFAULT_HOSPITAL_INFO.email,
      website: DEFAULT_HOSPITAL_INFO.website,
      accreditation: DEFAULT_HOSPITAL_INFO.accreditation || '',
      licenseNumber: DEFAULT_HOSPITAL_INFO.licenseNumber || '',
      kodeRs: DEFAULT_HOSPITAL_INFO.kodeRs || '3171890',
      kodePpk: DEFAULT_HOSPITAL_INFO.kodePpk || '0115R001',
      directorName: DEFAULT_HOSPITAL_INFO.directorName || '',
      directorNip: DEFAULT_HOSPITAL_INFO.directorNip || '',
      hospitalType: DEFAULT_HOSPITAL_INFO.hospitalType || '',
      ownership: DEFAULT_HOSPITAL_INFO.ownership || '',
      emergencyHotline: DEFAULT_HOSPITAL_INFO.emergencyHotline || '',
      faxNumber: DEFAULT_HOSPITAL_INFO.faxNumber || '',
    });
    toast.info('Data formulir dikembalikan ke nilai standar');
  };

  const handleSave = () => {
    updateHospitalSettings({
      ...formData,
      logoUrl: logoPreview || ''
    });
    toast.success('Pengaturan profil & legalitas Rumah Sakit berhasil disimpan ke sistem');
  };

  return (
    <div className="p-6 h-full overflow-y-auto bg-slate-50 dark:bg-slate-900 custom-scrollbar">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-xl">
                <Building className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Pengaturan Profil & Legalitas RS</h1>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                  Konfigurasi identitas resmi fasilitas kesehatan, akreditasi, integrasi bridging, dan format kop surat dokumen.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetToDefault}
              className="px-3.5 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset Default
            </button>
            <button 
              onClick={handleSave}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold text-sm shadow-md shadow-blue-600/20 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Pengaturan</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 p-1.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-x-auto">
          {[
            { id: 'identitas', label: '1. Identitas & Kontak', icon: Building },
            { id: 'legalitas', label: '2. Legalitas & Kemenkes', icon: ShieldCheck },
            { id: 'direksi', label: '3. Pimpinan & Penanggung Jawab', icon: UserCheck },
            { id: 'preview', label: '4. Live Preview Kop Surat', icon: Eye },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: IDENTITAS & KONTAK */}
        {activeTab === 'identitas' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Logo Upload Box */}
            <div className="md:col-span-1">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col items-center">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 w-full flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-2">
                  <ImageIcon className="w-4 h-4 text-blue-500" />
                  Logo Resmi Rumah Sakit
                </h3>
                
                <div className="w-44 h-44 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center bg-slate-50 dark:bg-slate-900/50 mb-4 overflow-hidden relative group">
                  {logoPreview ? (
                    <>
                      <img src={logoPreview} alt="Logo RS" className="w-full h-full object-contain p-2" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <button 
                          onClick={handleRemoveLogo}
                          className="p-2.5 bg-rose-600 text-white rounded-full hover:bg-rose-700 transition"
                          title="Hapus Logo"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center p-4">
                      <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-2">
                        <ImageIcon className="w-6 h-6" />
                      </div>
                      <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">Belum ada logo</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">PNG, JPG, SVG (Max 2MB)</p>
                    </div>
                  )}
                </div>
                
                <input 
                  type="file" 
                  ref={fileInputRef}
                  accept="image/png, image/jpeg, image/svg+xml"
                  onChange={handleLogoUpload}
                  className="hidden" 
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-2.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                >
                  {logoPreview ? 'Ganti Logo RS' : 'Upload File Logo'}
                </button>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2 text-center">
                  Logo akan otomatis disematkan pada seluruh cetakan dokumen, kwitansi, dan SEP.
                </p>
              </div>
            </div>

            {/* Informasi Umum & Kontak */}
            <div className="md:col-span-2 space-y-6">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-2">
                  <Building className="w-4 h-4 text-blue-500" />
                  Nama & Alamat Fasilitas Kesehatan
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Nama Utama Rumah Sakit / Faskes *
                    </label>
                    <input 
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Contoh: TARUMANAGARA HOSPITAL"
                      className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm font-semibold"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Sub-Nama / Unit Pelayanan Resmi
                    </label>
                    <input 
                      type="text" 
                      name="subname"
                      value={formData.subname}
                      onChange={handleInputChange}
                      placeholder="Contoh: RUMAH SAKIT UMUM PENDIDIKAN TARUMANAGARA"
                      className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-500" /> Alamat Lengkap
                    </label>
                    <textarea 
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows={2}
                      placeholder="Jalan, RT/RW, Kelurahan, Kecamatan, Kode Pos"
                      className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Kota / Kabupaten
                    </label>
                    <input 
                      type="text" 
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Kepemilikan / Yayasan Pengelola
                    </label>
                    <input 
                      type="text" 
                      name="ownership"
                      value={formData.ownership}
                      onChange={handleInputChange}
                      className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-2">
                  <Phone className="w-4 h-4 text-emerald-500" />
                  Saluran Komunikasi Resmi & Hotline Darurat
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-blue-500" /> No. Telepon / Hunting
                    </label>
                    <input 
                      type="text" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-rose-500" /> Hotline IGD 24 Jam
                    </label>
                    <input 
                      type="text" 
                      name="emergencyHotline"
                      value={formData.emergencyHotline}
                      onChange={handleInputChange}
                      className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-indigo-500" /> Email Resmi
                    </label>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                      <Globe className="w-3.5 h-3.5 text-teal-500" /> Website Faskes
                    </label>
                    <input 
                      type="text" 
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: LEGALITAS & KEMENKES */}
        {activeTab === 'legalitas' && (
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                Legalitas, Akreditasi, & Bridging Kemenkes / BPJS
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Data ini digunakan untuk otentikasi koneksi API SatuSehat, BPJS V-Claim, HFIS, dan pelaporan Kemenkes SIRS.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Kode Rumah Sakit Kemenkes (SIRS) *
                </label>
                <input 
                  type="text" 
                  name="kodeRs"
                  value={formData.kodeRs}
                  onChange={handleInputChange}
                  placeholder="Cth: 3171890"
                  className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <p className="text-[11px] text-slate-400 mt-1">Digunakan untuk integrasi bridging SatuSehat & SIRS Kemenkes</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Kode PPK BPJS Kesehatan *
                </label>
                <input 
                  type="text" 
                  name="kodePpk"
                  value={formData.kodePpk}
                  onChange={handleInputChange}
                  placeholder="Cth: 0115R001"
                  className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <p className="text-[11px] text-slate-400 mt-1">Digunakan untuk bridging V-Claim SEP & Klaim BPJS Kesehatan</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Klasifikasi & Kelas Rumah Sakit
                </label>
                <input 
                  type="text" 
                  name="hospitalType"
                  value={formData.hospitalType}
                  onChange={handleInputChange}
                  placeholder="Cth: Rumah Sakit Umum (Kelas B Pendidikan)"
                  className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-amber-500" /> Status Akreditasi KARS / LAM-KPRS
                </label>
                <input 
                  type="text" 
                  name="accreditation"
                  value={formData.accreditation}
                  onChange={handleInputChange}
                  placeholder="Cth: TERAKREDITASI PARIPURNA (KARS KEMENKES RI)"
                  className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nomor Surat Izin Operasional (SIO) Faskes
                </label>
                <input 
                  type="text" 
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleInputChange}
                  placeholder="Cth: No. Izin Operasional: 445/1029/DINKES/2024"
                  className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PIMPINAN & PENANGGUNG JAWAB */}
        {activeTab === 'direksi' && (
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-indigo-600" />
                Pimpinan & Penanggung Jawab Fasilitas Kesehatan
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Nama dan NIP/SIP direktur akan dicantumkan secara otomatis pada Surat Rujukan Resmi, SKDP, Surat Kematian, dan Surat Keterangan Medis.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Direktur Utama / Kepala Rumah Sakit *
                </label>
                <input 
                  type="text" 
                  name="directorName"
                  value={formData.directorName}
                  onChange={handleInputChange}
                  placeholder="Cth: dr. H. Hendra, MARS, Sp.PK"
                  className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm font-semibold focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  NIP / NRP / NIK Direktur
                </label>
                <input 
                  type="text" 
                  name="directorNip"
                  value={formData.directorNip}
                  onChange={handleInputChange}
                  placeholder="Cth: 197508122002121001"
                  className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <div className="text-xs text-blue-800 dark:text-blue-200">
                <span className="font-bold">Keabsahan Tanda Tangan Digital:</span> Sistem MYITARU mendukung sertifikasi tanda tangan elektronik (TTE) BSrE / Sertisign yang diverifikasi langsung dengan data penanggung jawab di atas.
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: LIVE PREVIEW KOP SURAT */}
        {activeTab === 'preview' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    Preview Format Kop Dokumen Resmi
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Tampilan standar kop surat yang akan dihasilkan pada Resume Medis, Hasil Lab, Kwitansi, dan SEP.
                  </p>
                </div>
              </div>

              {/* Paper Sheet Preview */}
              <div className="bg-slate-100 dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                <div className="bg-white text-slate-900 p-8 rounded-xl shadow-md max-w-3xl mx-auto border border-slate-200">
                  {/* Official Header */}
                  <div className="flex items-center gap-5 pb-4 border-b-2 border-slate-900">
                    <div className="w-20 h-20 shrink-0 flex items-center justify-center">
                      {logoPreview ? (
                        <img src={logoPreview} alt="Logo RS" className="max-w-full max-h-full object-contain" />
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-2xl">
                          {formData.name.charAt(0) || 'H'}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 text-center pr-10">
                      <h2 className="text-lg font-black tracking-wide text-slate-900 uppercase">
                        {formData.name}
                      </h2>
                      {formData.subname && (
                        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                          {formData.subname}
                        </h3>
                      )}
                      <p className="text-[11px] text-slate-600 mt-1 leading-tight">
                        {formData.address}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        Telp: {formData.phone} | Email: {formData.email} | Web: {formData.website}
                      </p>
                      {formData.accreditation && (
                        <p className="text-[9px] font-bold text-blue-800 uppercase tracking-widest mt-1">
                          {formData.accreditation}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Dummy Document Body */}
                  <div className="py-8 space-y-4 text-center">
                    <div className="inline-block border-b border-slate-800 pb-0.5">
                      <h4 className="font-bold text-sm uppercase tracking-wider">SURAT RESUME MEDIS PASIEN</h4>
                    </div>
                    <p className="text-[10px] text-slate-500 font-mono">No. Dokumen: RM-2026/08/27-0092</p>

                    <div className="text-left text-xs space-y-2 pt-4 max-w-md mx-auto bg-slate-50 p-4 rounded-lg border border-slate-200">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Nama Pasien:</span>
                        <span className="font-bold">Ahmad Subagyo</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">No. Rekam Medis:</span>
                        <span className="font-mono font-bold">RM-2608-0041</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Diagnosa Utama:</span>
                        <span className="font-semibold">Essential (primary) hypertension (I10)</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer Signature */}
                  <div className="flex justify-between pt-6 border-t border-slate-200 text-xs">
                    <div className="text-left text-[10px] text-slate-400">
                      <p>Kode RS: {formData.kodeRs}</p>
                      <p>Kode PPK: {formData.kodePpk}</p>
                    </div>

                    <div className="text-right pr-4">
                      <p className="text-[11px] text-slate-500">{formData.city}, 27 Agustus 2026</p>
                      <p className="text-[11px] font-bold mt-1">Direktur Utama,</p>
                      <div className="h-12 flex items-center justify-end">
                        <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300">
                          [TERVERIFIKASI TTE ELEKTRONIK]
                        </span>
                      </div>
                      <p className="font-bold text-xs underline">{formData.directorName}</p>
                      <p className="text-[10px] text-slate-500 font-mono">NIP: {formData.directorNip}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

