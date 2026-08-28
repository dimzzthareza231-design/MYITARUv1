cat << 'INNER_EOF' >> src/components/Outpatient.tsx

  const handleAddDrug = () => {
    if (!newDrug.name || !newDrug.qty) return;
    setPrescriptions(prev => [...prev, newDrug]);
    setNewDrug({ name: '', qty: '', rules: '' });
    toast.success('Obat ditambahkan');
  };

  const handleSaveSOAP = () => {
    toast.success('Data rekam medis berhasil disimpan!');
    if (activeVisit) {
      updateKunjunganStatus(activeVisit.id, 'Selesai');
      setActiveQueue(null);
    }
  };

  const handleCallPatient = (id: string) => {
    updateKunjunganStatus(id, 'Panggil');
    toast.success('Memanggil pasien...');
  };

  if (activeTab === 'Antrian Poli' || activeTab === 'Dokter Ralan') {
    return (
      <div className="flex h-full gap-6 p-6">
        {/* Sidebar Kiri: Daftar Antrian */}
        <div className="w-1/3 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <h3 className="font-bold text-lg dark:text-white mb-4">Daftar Antrian</h3>
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text"
                placeholder="Cari pasien..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {queues.length === 0 ? (
              <div className="text-center text-slate-500 dark:text-slate-400 mt-10">Tidak ada antrian</div>
            ) : (
              queues.map(q => {
                const p = pasien.find(x => x.id === q.pasien_id);
                const isActive = activeQueue === q.id;
                return (
                  <div 
                    key={q.id}
                    onClick={() => setActiveQueue(q.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${isActive ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-blue-300'}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-lg text-blue-600 dark:text-blue-400">{q.nomor_antrian}</span>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${q.status === 'Panggil' ? 'bg-amber-100 text-amber-700' : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'}`}>
                        {q.status}
                      </span>
                    </div>
                    <div className="font-semibold dark:text-white">{p?.nama}</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">RM: {p?.no_rm}</div>
                    {!isActive && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleCallPatient(q.id); }}
                        className="mt-3 w-full py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-lg text-sm font-semibold transition-colors dark:text-white"
                      >
                        Panggil
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Panel Kanan: Form SOAP & EMR */}
        <div className="flex-1 flex flex-col gap-6">
          {activeVisit && activePatient ? (
            <>
              {/* Header Info Pasien */}
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
                    <UserCircle className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold dark:text-white">{activePatient.nama}</h2>
                    <div className="flex gap-4 text-sm text-slate-500 dark:text-slate-400 mt-1">
                      <span>RM: {activePatient.no_rm}</span>
                      <span>•</span>
                      <span>{activePatient.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</span>
                      <span>•</span>
                      <span>{activePatient.penjamin}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-slate-500 dark:text-slate-400">Dokter Pemeriksa</div>
                  <div className="font-semibold dark:text-white">{activeDoctor?.nama || '-'}</div>
                </div>
              </div>

              {/* Form SOAP */}
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex-1 overflow-hidden flex flex-col">
                <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                  <h3 className="font-bold flex items-center gap-2 dark:text-white">
                    <FileText className="w-5 h-5 text-blue-600" />
                    Pemeriksaan Medis (SOAP)
                  </h3>
                  <button 
                    onClick={handleMicrophoneClick}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-300'}`}
                  >
                    {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    {isRecording ? 'Stop AI Scribe' : 'Mulai AI Scribe'}
                  </button>
                </div>
                <div className="p-6 overflow-y-auto flex-1 space-y-6">
                  {/* Subjective */}
                  <div>
                    <label className="block text-sm font-semibold mb-2 dark:text-slate-300">Subjective (Keluhan)</label>
                    <textarea 
                      value={soapData.s}
                      onChange={(e) => setSoapData({...soapData, s: e.target.value})}
                      className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent focus:ring-2 focus:ring-blue-500 outline-none dark:text-white min-h-[100px]"
                      placeholder="Keluhan pasien..."
                    />
                  </div>

                  {/* Objective */}
                  <div>
                    <label className="block text-sm font-semibold mb-2 dark:text-slate-300">Objective (Pemeriksaan Fisik)</label>
                    <textarea 
                      value={soapData.o}
                      onChange={(e) => setSoapData({...soapData, o: e.target.value})}
                      className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent focus:ring-2 focus:ring-blue-500 outline-none dark:text-white min-h-[100px]"
                      placeholder="Hasil pemeriksaan..."
                    />
                  </div>

                  {/* Assessment */}
                  <div>
                    <label className="block text-sm font-semibold mb-2 dark:text-slate-300">Assessment (Diagnosis)</label>
                    <input 
                      type="text"
                      value={soapData.a}
                      onChange={(e) => setSoapData({...soapData, a: e.target.value})}
                      className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent focus:ring-2 focus:ring-blue-500 outline-none dark:text-white mb-2"
                      placeholder="Diagnosis utama..."
                    />
                  </div>

                  {/* Plan / Prescriptions */}
                  <div>
                    <label className="block text-sm font-semibold mb-2 dark:text-slate-300 flex items-center gap-2">
                      <Pill className="w-4 h-4" /> Plan (Terapi & Resep)
                    </label>
                    
                    <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 mb-4 border border-slate-200 dark:border-slate-700">
                      <div className="grid grid-cols-12 gap-3 mb-3">
                        <div className="col-span-6">
                          <input 
                            placeholder="Nama Obat" 
                            value={newDrug.name}
                            onChange={e => setNewDrug({...newDrug, name: e.target.value})}
                            className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 dark:text-white"
                          />
                        </div>
                        <div className="col-span-2">
                          <input 
                            placeholder="Qty" 
                            value={newDrug.qty}
                            onChange={e => setNewDrug({...newDrug, qty: e.target.value})}
                            className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 dark:text-white"
                          />
                        </div>
                        <div className="col-span-3">
                          <input 
                            placeholder="Aturan Pakai" 
                            value={newDrug.rules}
                            onChange={e => setNewDrug({...newDrug, rules: e.target.value})}
                            className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 dark:text-white"
                          />
                        </div>
                        <div className="col-span-1">
                          <button 
                            onClick={handleAddDrug}
                            className="w-full h-full bg-blue-600 text-white rounded-lg flex items-center justify-center hover:bg-blue-700"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {prescriptions.length > 0 && (
                        <div className="space-y-2 mt-4">
                          {prescriptions.map((drug, idx) => (
                            <div key={idx} className="flex justify-between items-center p-2 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                              <div>
                                <span className="font-semibold dark:text-white">{drug.name}</span>
                                <span className="text-slate-500 mx-2">{drug.qty}</span>
                                <span className="text-sm text-slate-500">{drug.rules}</span>
                              </div>
                              <button onClick={() => setPrescriptions(prev => prev.filter((_, i) => i !== idx))} className="text-rose-500 hover:text-rose-700">Hapus</button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex justify-end">
                  <button 
                    onClick={handleSaveSOAP}
                    className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Simpan & Selesai
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex-1 flex flex-col items-center justify-center text-slate-400">
              <UserCircle className="w-20 h-20 mb-4 opacity-20" />
              <p>Pilih pasien dari daftar antrian untuk memulai pemeriksaan</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 h-full">
      <SmartTable
        storageKey={`hospital_outpatient_${activeTab}`}
        columns={[
          { key: 'no_antrian', label: 'No' },
          { key: 'nama_pasien', label: 'Pasien' },
          { key: 'dokter', label: 'Dokter' },
          { key: 'status', label: 'Status', badge: true }
        ]}
        title={activeTab}
      />
    </div>
  );
}
INNER_EOF
