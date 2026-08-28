const fs = require('fs');
const file = 'src/components/Pharmacy/DefectaProcurementTab.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('DocumentPreviewModal')) {
    content = content.replace(
        "import { useToast } from '../../contexts/ToastContext';",
        "import { useToast } from '../../contexts/ToastContext';\nimport { DocumentPreviewModal } from '../Documents/DocumentPreviewModal';"
    );
}

if (!content.includes('showPreview')) {
    content = content.replace(
        "const [filterSupplier, setFilterSupplier] = useState('Semua');",
        "const [showPreview, setShowPreview] = useState(false);\n  const [filterSupplier, setFilterSupplier] = useState('Semua');"
    );
}

content = content.replace(
    /window\.print\(\);\s*toast\.success\('Surat Pesanan dikirim ke printer!'\);/,
    `setShowPreview(true);`
);

const searchBlock = `          ) : (
            <div className="bg-white dark:bg-slate-800 p-8 rounded-xl border border-slate-200 dark:border-slate-700 text-center text-slate-500">
              Pilih Surat Pesanan di sebelah kiri.`;

const replaceBlock = `
              {showPreview && selectedPO && (
                <DocumentPreviewModal 
                  isOpen={showPreview}
                  onClose={() => setShowPreview(false)}
                  customContent={(
                    <div className="bg-white text-slate-900 border border-slate-200 rounded-xl p-8 relative shadow-sm max-w-4xl mx-auto">
                      <div className="text-center border-b-2 border-slate-800 pb-3">
                        <h3 className="font-black text-base uppercase tracking-wider">
                          RUMAH SAKIT ITARU MEDIKA
                        </h3>
                        <p className="text-xs text-slate-600">
                          INSTALASI FARMASI RS ITARU • Jl. Kesehatan No. 10 Jakarta
                        </p>
                        <p className="text-[11px] text-slate-500 font-mono">
                          Izin Operasional RS: 440/12/DINKES/2020 • Telp: (021) 789-0123
                        </p>
                        <div className="mt-2 inline-block px-3 py-0.5 bg-slate-900 text-white font-black text-xs uppercase tracking-widest rounded">
                          {selectedPO.jenis_sp}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs mt-4">
                        <div>
                          <span className="text-slate-500 block">Nomor SP:</span>
                          <span className="font-mono font-bold">{selectedPO.no_po}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Tanggal Terbit:</span>
                          <span className="font-bold">{selectedPO.tanggal_order}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Kepada Yth. PBF:</span>
                          <span className="font-black text-slate-800 text-sm">{selectedPO.supplier}</span>
                        </div>
                      </div>
                      
                      <div className="mt-6 border border-slate-300 rounded-lg overflow-hidden">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300">
                            <tr>
                              <th className="p-2">No</th>
                              <th className="p-2">Nama Obat / BHP</th>
                              <th className="p-2">Kemasan</th>
                              <th className="p-2 text-center">Jml Pesan</th>
                              <th className="p-2 text-right">Harga Satuan (Rp)</th>
                              <th className="p-2 text-right">Subtotal (Rp)</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200">
                            {selectedPO.items.map((item, idx) => (
                              <tr key={idx}>
                                <td className="p-2 text-slate-400">{idx + 1}</td>
                                <td className="p-2 font-bold">{item.nama_obat}</td>
                                <td className="p-2">{item.kemasan || 'Box'}</td>
                                <td className="p-2 text-center font-bold text-blue-700">{item.jumlah_pesan}</td>
                                <td className="p-2 text-right">{item.harga_satuan.toLocaleString('id-ID')}</td>
                                <td className="p-2 text-right font-bold text-slate-800">
                                  {(item.jumlah_pesan * item.harga_satuan).toLocaleString('id-ID')}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot className="bg-slate-50 font-bold border-t border-slate-300">
                            <tr className="text-sm">
                              <td colSpan={5} className="p-2 text-right text-slate-700">Estimasi Total SP:</td>
                              <td className="p-2 text-right text-blue-800">
                                Rp {selectedPO.total_harga.toLocaleString('id-ID')}
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>

                      <div className="pt-6 mt-4 border-t border-slate-300 flex justify-between text-xs">
                        <div className="text-slate-500">
                          * Harga tertera adalah estimasi belum termasuk PPN.
                        </div>
                        <div className="text-center">
                          <p className="text-[11px] text-slate-500">Jakarta, {selectedPO.tanggal_order}</p>
                          <p className="font-bold">Apoteker Penanggung Jawab (APJ)</p>
                          <div className="h-12 flex items-center justify-center italic text-slate-400 text-xs">
                            (Tanda Tangan & Cap)
                          </div>
                          <p className="font-black underline">{selectedPO.apoteker_penanggung_jawab}</p>
                          <p className="text-[10px] font-mono text-slate-500">{selectedPO.sipa_apoteker}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  title={\`SP_\${selectedPO.no_po}\`}
                />
              )}
          ) : (
            <div className="bg-white dark:bg-slate-800 p-8 rounded-xl border border-slate-200 dark:border-slate-700 text-center text-slate-500">
              Pilih Surat Pesanan di sebelah kiri.`;

content = content.replace(searchBlock, replaceBlock);
fs.writeFileSync(file, content);
