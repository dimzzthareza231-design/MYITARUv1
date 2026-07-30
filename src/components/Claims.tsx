import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Plus, FileText, CheckCircle2, Clock, XCircle, AlertTriangle, Printer } from 'lucide-react';
import { useHospital } from '../contexts/HospitalContext';
import { cn } from '../lib/utils';

export interface Claim {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  provider: string;
  amount: number;
  status: 'Approved' | 'Pending' | 'Rejected';
  notes?: string;
}

export function Claims() {
  const { patients } = useHospital();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newClaim, setNewClaim] = useState<Partial<Claim>>({
    patientId: '',
    provider: 'BPJS Kesehatan',
    amount: 0,
    status: 'Pending'
  });

  const [claims, setClaims] = useState<Claim[]>(() => {
    return patients.map((p, i) => {
      const statuses: ('Approved' | 'Pending' | 'Rejected')[] = ['Approved', 'Pending', 'Rejected'];
      const providers = ['BPJS Kesehatan', 'Prudential', 'Allianz', 'Mandiri Inhealth'];
      return {
        id: `CLM-2023-${(i + 1).toString().padStart(4, '0')}`,
        patientName: p.fullName,
        patientId: p.id,
        date: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString().split('T')[0],
        provider: p.bpjsStatus === 'Active' ? 'BPJS Kesehatan' : providers[Math.floor(Math.random() * providers.length)],
        amount: Math.floor(Math.random() * 10000000) + 500000,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        notes: ''
      };
    });
  });

  const filteredClaims = claims.filter(c => 
    c.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.provider.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Insurance Claims</h1>
          <p className="text-sm text-white/40">Manage patient insurance claims and BPJS</p>
        </div>
        <button className="btn-primary" onClick={() => setIsAdding(true)}>
          <Plus className="w-4 h-4" />
          <span>New Claim</span>
        </button>
      </div>

      <div className="flex-1 glass-panel flex flex-col overflow-hidden border border-white/5">
        <div className="p-4 border-b border-white/5 flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Search by Patient Name, ID, or Provider..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 glass-input text-sm"
            />
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-xs uppercase tracking-wider text-white/40">
                <th className="p-4 font-bold">Claim ID</th>
                <th className="p-4 font-bold">Patient</th>
                <th className="p-4 font-bold">Provider</th>
                <th className="p-4 font-bold">Date</th>
                <th className="p-4 font-bold">Amount</th>
                <th className="p-4 font-bold">Status</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredClaims.slice(0, 100).map(claim => (
                  <motion.tr 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    key={claim.id} 
                    onClick={() => setSelectedClaim(claim)}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors group cursor-pointer"
                  >
                    <td className="p-4 text-sm font-medium text-white/80">{claim.id}</td>
                    <td className="p-4">
                      <div className="text-sm text-white font-medium">{claim.patientName}</div>
                      <div className="text-xs text-white/40">{claim.patientId}</div>
                    </td>
                    <td className="p-4 text-sm text-white/80">{claim.provider}</td>
                    <td className="p-4 text-sm text-white/60">{claim.date}</td>
                    <td className="p-4 text-sm font-mono text-white">
                      Rp {claim.amount.toLocaleString('id-ID')}
                    </td>
                    <td className="p-4">
                      <span className={cn(
                        "px-2 py-1 rounded text-xs font-bold border",
                        claim.status === 'Approved' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                        claim.status === 'Pending' ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                        "bg-red-500/10 text-red-400 border-red-500/20"
                      )}>
                        {claim.status}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {isAdding && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel p-6 w-full max-w-lg mx-4 border border-white/10 shadow-2xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Submit New Claim</h2>
              <button onClick={() => setIsAdding(false)} className="text-white/40 hover:text-white">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs text-white/60 mb-1 block">Patient</label>
                <select 
                  className="w-full glass-input p-2 text-sm bg-midnight" 
                  value={newClaim.patientId} 
                  onChange={e => setNewClaim({...newClaim, patientId: e.target.value})}
                >
                  <option value="">Select Patient...</option>
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.fullName} ({p.id})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-white/60 mb-1 block">Provider</label>
                  <select 
                    className="w-full glass-input p-2 text-sm bg-midnight" 
                    value={newClaim.provider} 
                    onChange={e => setNewClaim({...newClaim, provider: e.target.value})}
                  >
                    <option value="BPJS Kesehatan">BPJS Kesehatan</option>
                    <option value="Prudential">Prudential</option>
                    <option value="Allianz">Allianz</option>
                    <option value="Mandiri Inhealth">Mandiri Inhealth</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-white/60 mb-1 block">Amount (Rp)</label>
                  <input 
                    type="number"
                    className="w-full glass-input p-2 text-sm" 
                    value={newClaim.amount || ''} 
                    onChange={e => setNewClaim({...newClaim, amount: parseInt(e.target.value) || 0})}
                    placeholder="e.g. 1500000"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-xs text-white/60 mb-1 block">Notes (Optional)</label>
                <textarea 
                  className="w-full glass-input p-2 text-sm min-h-[80px]" 
                  value={newClaim.notes} 
                  onChange={e => setNewClaim({...newClaim, notes: e.target.value})} 
                  placeholder="Additional context for the claim..." 
                />
              </div>
              
              <button 
                className="w-full btn-primary mt-6"
                disabled={!newClaim.patientId || !newClaim.amount}
                onClick={() => {
                  const patient = patients.find(p => p.id === newClaim.patientId);
                  if (patient) {
                    setClaims([
                      {
                        id: `CLM-${new Date().getFullYear()}-${Math.floor(Math.random()*10000).toString().padStart(4, '0')}`,
                        patientId: patient.id,
                        patientName: patient.fullName,
                        date: new Date().toISOString().split('T')[0],
                        provider: newClaim.provider || 'BPJS Kesehatan',
                        amount: newClaim.amount || 0,
                        status: 'Pending',
                        notes: newClaim.notes
                      },
                      ...claims
                    ]);
                    setIsAdding(false);
                    setNewClaim({ patientId: '', provider: 'BPJS Kesehatan', amount: 0, status: 'Pending' });
                  }
                }}
              >
                Submit Claim
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <AnimatePresence>
      {selectedClaim && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="glass-panel p-8 w-full max-w-2xl mx-4 border border-white/10 shadow-2xl relative"
          >
            <button onClick={() => setSelectedClaim(null)} className="absolute top-4 right-4 text-white/40 hover:text-white">
              <XCircle className="w-6 h-6" />
            </button>
            <div className="flex justify-between items-start border-b border-white/10 pb-6 mb-6">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">INSURANCE CLAIM</h2>
                <div className="text-white/60 font-mono">{selectedClaim.id}</div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-white">MYITARU Hospital</div>
                <div className="text-sm text-white/40">123 Health Avenue, Jakarta</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <div className="text-xs text-white/40 uppercase tracking-widest font-bold mb-2">Patient Details</div>
                <div className="text-lg font-bold text-white">{selectedClaim.patientName}</div>
                <div className="text-sm text-white/60">Patient ID: {selectedClaim.patientId}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-white/40 uppercase tracking-widest font-bold mb-2">Claim Details</div>
                <div className="text-sm text-white">Provider: <span className="font-bold text-primary-blue">{selectedClaim.provider}</span></div>
                <div className="text-sm text-white">Date Submitted: <span className="font-mono">{selectedClaim.date}</span></div>
                <div className="text-sm text-white mt-2">
                  Status: 
                  <span className={cn(
                      "ml-2 px-2 py-1 rounded text-xs font-bold border",
                      selectedClaim.status === 'Approved' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                      selectedClaim.status === 'Pending' ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                      "bg-red-500/10 text-red-400 border-red-500/20"
                    )}>
                    {selectedClaim.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="border border-white/10 rounded-lg overflow-hidden mb-8">
              <div className="p-4 bg-white/5 border-b border-white/10 flex justify-between items-center">
                <span className="text-sm font-bold text-white/60 uppercase tracking-wider">Claimed Amount</span>
                <span className="text-xl font-bold text-white font-mono">Rp {selectedClaim.amount.toLocaleString('id-ID')}</span>
              </div>
              <div className="p-4 bg-black/40">
                <div className="text-xs text-white/40 uppercase tracking-widest font-bold mb-2">Additional Notes</div>
                <p className="text-sm text-white/80">{selectedClaim.notes || 'No additional notes provided for this claim.'}</p>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <button onClick={() => window.print()} className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg flex items-center gap-2 transition-colors">
                <Printer className="w-4 h-4" /> Print Claim Record
              </button>
            </div>
          </motion.div>
        </div>
      )}
      </AnimatePresence>
    </div>
  );
}

