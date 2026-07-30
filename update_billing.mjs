import fs from 'fs';
let content = fs.readFileSync('src/components/Billing.tsx', 'utf8');

// Add icons to import
content = content.replace(
  "import { Search, Plus, FileText, CheckCircle2, Clock, CreditCard, DollarSign } from 'lucide-react';",
  "import { Search, Plus, FileText, CheckCircle2, Clock, CreditCard, DollarSign, XCircle, Printer } from 'lucide-react';\nimport { AnimatePresence } from 'motion/react';"
);

// Add selectedInvoice state
content = content.replace(
  "  const [searchQuery, setSearchQuery] = useState('');",
  "  const [searchQuery, setSearchQuery] = useState('');\n  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);"
);

// Add onClick to table row
content = content.replace(
  '<tr key={inv.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group cursor-pointer">',
  '<tr key={inv.id} onClick={() => setSelectedInvoice(inv)} className="border-b border-white/5 hover:bg-white/5 transition-colors group cursor-pointer">'
);

// Add Modal
const modalCode = `
      <AnimatePresence>
      {selectedInvoice && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="glass-panel p-8 w-full max-w-2xl mx-4 border border-white/10 shadow-2xl relative"
          >
            <button onClick={() => setSelectedInvoice(null)} className="absolute top-4 right-4 text-white/40 hover:text-white">
              <XCircle className="w-6 h-6" />
            </button>
            <div className="flex justify-between items-start border-b border-white/10 pb-6 mb-6">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">INVOICE</h2>
                <div className="text-white/60 font-mono">{selectedInvoice.id}</div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-white">MYITARU Hospital</div>
                <div className="text-sm text-white/40">123 Health Avenue, Jakarta</div>
                <div className="text-sm text-white/40">Tel: +62 21 555 0123</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <div className="text-xs text-white/40 uppercase tracking-widest font-bold mb-2">Billed To</div>
                <div className="text-lg font-bold text-white">{selectedInvoice.patientName}</div>
                <div className="text-sm text-white/60">Patient ID: {selectedInvoice.patientId}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-white/40 uppercase tracking-widest font-bold mb-2">Invoice Details</div>
                <div className="text-sm text-white">Date: <span className="font-mono">{selectedInvoice.date}</span></div>
                <div className="text-sm text-white">Type: <span>{selectedInvoice.type}</span></div>
                <div className="text-sm text-white mt-2">
                  Status: 
                  <span className={cn(
                      "ml-2 px-2 py-1 rounded text-xs font-bold border",
                      selectedInvoice.status === 'Paid' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                      selectedInvoice.status === 'Pending' ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                      "bg-orange-500/10 text-orange-400 border-orange-500/20"
                    )}>
                    {selectedInvoice.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="border border-white/10 rounded-lg overflow-hidden mb-8">
              <table className="w-full text-left">
                <thead className="bg-white/5 border-b border-white/10">
                  <tr>
                    <th className="p-3 text-xs uppercase tracking-wider text-white/60">Description</th>
                    <th className="p-3 text-xs uppercase tracking-wider text-white/60 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-white/5">
                    <td className="p-3 text-sm text-white">Medical Services & Consultation</td>
                    <td className="p-3 text-sm text-white font-mono text-right">Rp {(selectedInvoice.amount * 0.4).toLocaleString('id-ID')}</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="p-3 text-sm text-white">Laboratory & Diagnostics</td>
                    <td className="p-3 text-sm text-white font-mono text-right">Rp {(selectedInvoice.amount * 0.3).toLocaleString('id-ID')}</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-sm text-white">Medication & Pharmacy</td>
                    <td className="p-3 text-sm text-white font-mono text-right">Rp {(selectedInvoice.amount * 0.3).toLocaleString('id-ID')}</td>
                  </tr>
                </tbody>
                <tfoot className="bg-white/5 border-t border-white/10">
                  <tr>
                    <td className="p-4 text-lg font-bold text-white text-right">Total Amount</td>
                    <td className="p-4 text-xl font-bold text-primary-emerald font-mono text-right">Rp {selectedInvoice.amount.toLocaleString('id-ID')}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="flex justify-end gap-4">
              <button onClick={() => window.print()} className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg flex items-center gap-2 transition-colors">
                <Printer className="w-4 h-4" /> Print Invoice
              </button>
            </div>
          </motion.div>
        </div>
      )}
      </AnimatePresence>
    </div>
  );
}
`;

content = content.replace(
  "    </div>\n  );\n}",
  modalCode
);

fs.writeFileSync('src/components/Billing.tsx', content);
