const fs = require('fs');
const file = 'src/components/Finance/KwitansiTab.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('DocumentPreviewModal')) {
    content = content.replace(
        "import { useToast } from '../../contexts/ToastContext';",
        "import { useToast } from '../../contexts/ToastContext';\nimport { DocumentPreviewModal } from '../Documents/DocumentPreviewModal';"
    );
}

if (!content.includes('showPreview')) {
    content = content.replace(
        "const [searchTerm, setSearchTerm] = useState('');",
        "const [showPreview, setShowPreview] = useState(false);\n  const [searchTerm, setSearchTerm] = useState('');"
    );
}

content = content.replace(
    /const handlePrint = \(\) => \{\s*window\.print\(\);\s*toast\.success\('Membuka dialog cetak kwitansi\.\.\.'\);\s*\};/,
    `const handlePrint = () => {\n    setShowPreview(true);\n  };`
);

// find `<div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-8 relative shadow-sm print:shadow-none print:border-none printable-area">`
// We can just wrap the selectedBilling area right before it renders.
const searchBlock = `          ) : (
            <div className="bg-white dark:bg-slate-800 rounded-xl p-12 text-center border border-slate-200 dark:border-slate-700 text-slate-500">`;

const replacement = `
          {showPreview && selectedBilling && (
            <DocumentPreviewModal 
              isOpen={showPreview}
              onClose={() => setShowPreview(false)}
              customContent={(
                <div className="bg-white text-slate-900 border border-slate-200 rounded-xl p-8 relative shadow-sm mx-auto w-full">
                  <div className="flex justify-between items-start pb-6 border-b-2 border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-blue-600 rounded-xl">
                        <Building2 className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-black text-slate-900 uppercase">Kwitansi Pembayaran</h2>
                        <p className="text-xs text-slate-500">Klinik MYITARU SEHAT UTAMA</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500 font-bold mb-1">NO. KWITANSI</p>
                      <p className="text-lg font-mono font-bold text-slate-900">
                        {selectedBilling.noKwitansi || \`KW/\${new Date().getFullYear()}/00\${Math.floor(Math.random()*999)}\`}
                      </p>
                    </div>
                  </div>
                  <div className="py-6 grid grid-cols-2 gap-8 text-xs">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Terima Dari:</span>
                        <strong className="text-slate-900">{selectedBilling.namaPasien}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">No. Rekam Medis:</span>
                        <strong className="font-mono text-slate-900">{selectedBilling.noRm}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Layanan:</span>
                        <strong className="text-slate-900">{selectedBilling.tipeLayanan}</strong>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-500">No. Tagihan:</span>
                        <strong className="font-mono text-slate-900">{selectedBilling.noBilling}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Penjamin:</span>
                        <strong className="text-slate-900">{selectedBilling.namaPenjamin}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Tanggal:</span>
                        <strong className="text-slate-900">{selectedBilling.waktuPembayaran || selectedBilling.tanggalMasuk}</strong>
                      </div>
                    </div>
                  </div>
                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                        <tr>
                          <th className="p-3 w-12 text-center">No</th>
                          <th className="p-3">Uraian / Deskripsi Layanan</th>
                          <th className="p-3 text-center">Volume</th>
                          <th className="p-3 text-right">Tarif (Rp)</th>
                          <th className="p-3 text-right">Jumlah (Rp)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {selectedBilling.items.map((item, index) => (
                          <tr key={item.id || index}>
                            <td className="p-3 text-center text-slate-400">{index + 1}</td>
                            <td className="p-3">
                              <div className="font-semibold text-slate-900">{item.deskripsi}</div>
                              <span className="text-[10px] text-slate-400">{item.kategori}</span>
                            </td>
                            <td className="p-3 text-center">{item.jumlah}</td>
                            <td className="p-3 text-right">{item.hargaSatuan.toLocaleString('id-ID')}</td>
                            <td className="p-3 text-right font-medium">{item.total.toLocaleString('id-ID')}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-slate-50 font-bold text-xs border-t border-slate-200">
                        <tr className="border-t-2 border-slate-800 text-sm font-extrabold text-slate-900">
                          <td colSpan={4} className="p-3 text-right">TOTAL DIBAYAR:</td>
                          <td className="p-3 text-right text-blue-600">
                            Rp {(selectedBilling.jumlahDibayar || selectedBilling.totalTagihan).toLocaleString('id-ID')}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              )}
              title={\`Kwitansi_\${selectedBilling?.noKwitansi || selectedBilling?.noBilling}\`}
            />
          )}
          ) : (
            <div className="bg-white dark:bg-slate-800 rounded-xl p-12 text-center border border-slate-200 dark:border-slate-700 text-slate-500">`;

content = content.replace(searchBlock, replacement);
fs.writeFileSync(file, content);
