import React, { useState, useEffect } from 'react';
import { DATA_WILAYAH_INDONESIA, ProvinsiData, KotaData, KecamatanData } from '../data/wilayahIndonesia';
import { MapPin, Check, Sparkles, Navigation } from 'lucide-react';

interface WilayahSelectorProps {
  selectedProvinsi?: string;
  selectedKota?: string;
  selectedKecamatan?: string;
  selectedKelurahan?: string;
  onSelectWilayah: (wilayah: {
    provinsi: string;
    kotaKabupaten: string;
    kecamatan: string;
    kelurahan: string;
    formattedAlamat?: string;
  }) => void;
  compactMode?: boolean;
}

export function WilayahSelector({
  selectedProvinsi = '',
  selectedKota = '',
  selectedKecamatan = '',
  selectedKelurahan = '',
  onSelectWilayah,
  compactMode = false
}: WilayahSelectorProps) {
  const [provinsi, setProvinsi] = useState(selectedProvinsi);
  const [kota, setKota] = useState(selectedKota);
  const [kecamatan, setKecamatan] = useState(selectedKecamatan);
  const [kelurahan, setKelurahan] = useState(selectedKelurahan);

  // Sync internal state if props change externally
  useEffect(() => {
    if (selectedProvinsi !== undefined) setProvinsi(selectedProvinsi);
    if (selectedKota !== undefined) setKota(selectedKota);
    if (selectedKecamatan !== undefined) setKecamatan(selectedKecamatan);
    if (selectedKelurahan !== undefined) setKelurahan(selectedKelurahan);
  }, [selectedProvinsi, selectedKota, selectedKecamatan, selectedKelurahan]);

  // Derived lists
  const currentProvObj = DATA_WILAYAH_INDONESIA.find(p => p.nama === provinsi);
  const availableKota: KotaData[] = currentProvObj ? currentProvObj.kota : [];

  const currentKotaObj = availableKota.find(k => k.nama === kota);
  const availableKecamatan: KecamatanData[] = currentKotaObj ? currentKotaObj.kecamatan : [];

  const currentKecObj = availableKecamatan.find(k => k.nama === kecamatan);
  const availableKelurahan: string[] = currentKecObj ? currentKecObj.kelurahan : [];

  const handleProvinsiChange = (val: string) => {
    setProvinsi(val);
    setKota('');
    setKecamatan('');
    setKelurahan('');
    notifyChange(val, '', '', '');
  };

  const handleKotaChange = (val: string) => {
    setKota(val);
    setKecamatan('');
    setKelurahan('');
    notifyChange(provinsi, val, '', '');
  };

  const handleKecamatanChange = (val: string) => {
    setKecamatan(val);
    setKelurahan('');
    notifyChange(provinsi, kota, val, '');
  };

  const handleKelurahanChange = (val: string) => {
    setKelurahan(val);
    notifyChange(provinsi, kota, kecamatan, val);
  };

  const notifyChange = (p: string, k: string, kec: string, kel: string) => {
    let parts: string[] = [];
    if (kel) parts.push(`Kel. ${kel}`);
    if (kec) parts.push(`Kec. ${kec}`);
    if (k) parts.push(k);
    if (p) parts.push(`Prov. ${p}`);

    onSelectWilayah({
      provinsi: p,
      kotaKabupaten: k,
      kecamatan: kec,
      kelurahan: kel,
      formattedAlamat: parts.join(', ')
    });
  };

  // Quick preset shortcuts
  const applyPreset = (presetProv: string, presetKota: string, presetKec: string, presetKel: string) => {
    setProvinsi(presetProv);
    setKota(presetKota);
    setKecamatan(presetKec);
    setKelurahan(presetKel);
    notifyChange(presetProv, presetKota, presetKec, presetKel);
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-800/80 p-3.5 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-700/80 space-y-3.5 transition-all">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-500/10 dark:bg-cyan-500/10 rounded-lg text-blue-600 dark:text-cyan-400">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-100 block">
              Integrasi Pemilihan Wilayah Indonesia
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
              Pilih bertahap untuk otomatis mengisi data alamat & domisili
            </span>
          </div>
        </div>
        
        {/* Quick Presets */}
        <div className="hidden sm:flex items-center gap-1.5 text-[11px]">
          <span className="text-slate-400 text-[10px]">Akses Cepat:</span>
          <button
            type="button"
            onClick={() => applyPreset('Jawa Barat', 'Kota Bandung', 'Coblong', 'Dago')}
            className="px-2 py-0.5 bg-white dark:bg-slate-700 hover:bg-blue-50 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded border border-slate-200 dark:border-slate-600 font-semibold transition-all text-[10px]"
          >
            Bandung (Dago)
          </button>
          <button
            type="button"
            onClick={() => applyPreset('DKI Jakarta', 'Kota Jakarta Selatan', 'Kebayoran Baru', 'Melawai')}
            className="px-2 py-0.5 bg-white dark:bg-slate-700 hover:bg-blue-50 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded border border-slate-200 dark:border-slate-600 font-semibold transition-all text-[10px]"
          >
            Jaksel (Kebayoran)
          </button>
        </div>
      </div>

      <div className={`grid ${compactMode ? 'grid-cols-2 gap-2.5' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3'} text-xs`}>
        {/* 1. Provinsi */}
        <div>
          <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
            Provinsi <span className="text-rose-500">*</span>
          </label>
          <select
            value={provinsi}
            onChange={(e) => handleProvinsiChange(e.target.value)}
            className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-800 dark:text-white font-medium outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-500 transition-all text-xs"
          >
            <option value="">-- Pilih Provinsi --</option>
            {DATA_WILAYAH_INDONESIA.map(p => (
              <option key={p.nama} value={p.nama}>{p.nama}</option>
            ))}
          </select>
        </div>

        {/* 2. Kota / Kabupaten */}
        <div>
          <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
            Kota / Kabupaten
          </label>
          <select
            disabled={!provinsi}
            value={kota}
            onChange={(e) => handleKotaChange(e.target.value)}
            className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-800 dark:text-white font-medium outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-xs"
          >
            <option value="">{provinsi ? '-- Pilih Kota/Kabupaten --' : '(Pilih Provinsi dulu)'}</option>
            {availableKota.map(k => (
              <option key={k.nama} value={k.nama}>{k.nama}</option>
            ))}
          </select>
        </div>

        {/* 3. Kecamatan */}
        <div>
          <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
            Kecamatan
          </label>
          <select
            disabled={!kota}
            value={kecamatan}
            onChange={(e) => handleKecamatanChange(e.target.value)}
            className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-800 dark:text-white font-medium outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-xs"
          >
            <option value="">{kota ? '-- Pilih Kecamatan --' : '(Pilih Kota dulu)'}</option>
            {availableKecamatan.map(kc => (
              <option key={kc.nama} value={kc.nama}>Kec. {kc.nama}</option>
            ))}
          </select>
        </div>

        {/* 4. Kelurahan / Desa */}
        <div>
          <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
            Kelurahan / Desa
          </label>
          {availableKelurahan.length > 0 ? (
            <select
              value={kelurahan}
              onChange={(e) => handleKelurahanChange(e.target.value)}
              className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-800 dark:text-white font-medium outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-500 transition-all text-xs"
            >
              <option value="">-- Pilih Kelurahan --</option>
              {availableKelurahan.map(kel => (
                <option key={kel} value={kel}>Kel. {kel}</option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              disabled={!kecamatan}
              value={kelurahan}
              onChange={(e) => handleKelurahanChange(e.target.value)}
              placeholder={kecamatan ? "Ketik Kelurahan..." : "(Pilih Kecamatan dulu)"}
              className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-800 dark:text-white font-medium outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-xs"
            />
          )}
        </div>
      </div>

      {/* Selected Address Preview Tag */}
      {(provinsi || kota || kecamatan || kelurahan) && (
        <div className="flex items-center justify-between bg-blue-100/60 dark:bg-slate-900/80 px-3 py-2 rounded-lg border border-blue-200 dark:border-slate-700 text-[11px]">
          <div className="flex items-center gap-1.5 text-blue-800 dark:text-cyan-300 font-semibold truncate">
            <Navigation className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400 shrink-0" />
            <span className="truncate">
              Wilayah Terpilih: {[kelurahan && `Kel. ${kelurahan}`, kecamatan && `Kec. ${kecamatan}`, kota, provinsi && `Prov. ${provinsi}`].filter(Boolean).join(', ')}
            </span>
          </div>
          <span className="px-2 py-0.5 bg-emerald-500 text-white font-bold rounded text-[9px] uppercase shrink-0">
            Terhubung
          </span>
        </div>
      )}
    </div>
  );
}
