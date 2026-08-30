import React from 'react';

export default function WatermarkNama() {
  return (
    <>
      {/* Watermark Nama Besar di Tengah Dashboard */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0">
        <div className="text-center">
          <div className="text-[8rem] md:text-[12rem] font-black text-blue-900 dark:text-blue-300 opacity-[0.04] rotate-[-12deg] whitespace-nowrap leading-none">
            Dimas Pangestu
          </div>
          <div className="text-[2rem] md:text-[3rem] font-bold text-blue-800 dark:text-blue-400 opacity-[0.06] mt-4">
            Putra Alifia
          </div>
        </div>
      </div>
      
      {/* Info Mahasiswa di Pojok Kiri Bawah */}
      <div className="absolute bottom-4 left-4 pointer-events-none select-none z-10">
        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg px-4 py-2 border border-blue-200 dark:border-blue-800">
          <div className="text-xs text-gray-700 dark:text-gray-300">
            <div className="font-bold text-blue-700 dark:text-blue-400">🎓 Tugas Akhir</div>
            <div className="font-semibold">Dimas Pangestu Putra Alifia</div>
            <div className="italic text-gray-600 dark:text-gray-400">Mahasiswa ITARU • 2026</div>
          </div>
        </div>
      </div>
      
      {/* Info di Pojok Kanan Atas */}
      <div className="absolute top-20 right-4 pointer-events-none select-none z-10 hidden md:block">
        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg px-3 py-2 border border-blue-200 dark:border-blue-800">
          <div className="text-xs text-right text-gray-700 dark:text-gray-300">
            <div className="font-bold text-blue-700 dark:text-blue-400">SIMK Myitaru</div>
            <div className="font-semibold">Dimas P. Alifia</div>
            <div className="italic text-gray-600 dark:text-gray-400">Mahasiswa ITARU</div>
          </div>
        </div>
      </div>
    </>
  );
}
