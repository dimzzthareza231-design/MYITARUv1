import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  Package, Box, Plus, Search, AlertTriangle, FileText, Download, 
  ShoppingCart, RefreshCw, Scan, Save, Edit, Trash2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Modal } from './Modal';

export function InventoryManagement() {
  const outletCtx = useOutletContext<{ activeTab?: string }>();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'master' | 'stok' | 'po' | 'opname'>('dashboard');

  useEffect(() => {
    if (outletCtx?.activeTab) {
      const tab = outletCtx.activeTab.toLowerCase();
      if (tab.includes('barang') || tab.includes('item') || tab.includes('master')) {
        setActiveTab('master');
      } else if (tab.includes('gudang') || tab.includes('stok') && !tab.includes('opname')) {
        setActiveTab('stok');
      } else if (tab.includes('purchase') || tab.includes('po') || tab.includes('order')) {
        setActiveTab('po');
      } else if (tab.includes('opname')) {
        setActiveTab('opname');
      }
    }
  }, [outletCtx?.activeTab]);

  const [items, setItems] = useState<any[]>([]);
  if (items.length === 0) {
    setItems([
      { id: 'ITM-001', nama: 'Paracetamol 500mg', kategori: 'Obat', stok: 1500, min: 200, unit: 'Tablet', harga: 1500 },
      { id: 'ITM-002', nama: 'Spuit 3cc', kategori: 'BHP', stok: 150, min: 300, unit: 'Pcs', harga: 2500 }
    ]);
  }
  
  const [poList, setPoList] = useState<any[]>([]);
  const [opnameList, setOpnameList] = useState<any[]>([]);

  
  
  

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Box },
    { id: 'master', label: 'Master Item', icon: Package },
    { id: 'stok', label: 'Manajemen Stok', icon: RefreshCw },
    { id: 'po', label: 'Purchase Order', icon: ShoppingCart },
    { id: 'opname', label: 'Stock Opname', icon: FileText },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto h-full flex flex-col">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-teal-600 dark:text-teal-500">
            <Package className="w-7 h-7" />
            Inventory & Gudang
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manajemen stok obat, BHP, PO, dan Stock Opname.</p>
        </div>
      </div>

      <div className="flex gap-1 mb-6 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto custom-scrollbar shrink-0">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === tab.id 
                ? 'bg-white dark:bg-slate-700 shadow-sm text-teal-600 dark:text-teal-400' 
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pb-6">
        {activeTab === 'dashboard' && <DashboardTab items={items} setActiveTab={setActiveTab} />}
        {activeTab === 'master' && <MasterTab items={items} setItems={setItems} />}
        {activeTab === 'stok' && <StokTab items={items} setItems={setItems} />}
        {activeTab === 'po' && <POTab poList={poList} setPoList={setPoList} items={items} />}
        {activeTab === 'opname' && <OpnameTab opnameList={opnameList} setOpnameList={setOpnameList} items={items} setItems={setItems} />}
      </div>
    </div>
  );


// --- SUB COMPONENTS ---

function DashboardTab({ items, setActiveTab }: { items: any[], setActiveTab: any }) {
  const lowStock = items.filter(i => i.stok <= i.min);
  const totalValue = items.reduce((sum, i) => sum + ((i.stok || 0) * (i.harga || 0)), 0);
  
  return (
    <div className="space-y-6">
      {lowStock.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-start gap-4 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-500" />
          </div>
          <div>
            <h3 className="font-bold text-red-800 dark:text-red-400">Peringatan: Stok Menipis!</h3>
            <p className="text-sm text-red-700 dark:text-red-300 mt-1">Terdapat {lowStock.length} item yang berada di bawah batas minimum stok (Reorder Point).</p>
            <button onClick={() => setActiveTab('po')} className="mt-3 text-sm font-bold text-red-700 dark:text-red-400 hover:underline">Buat Purchase Order →</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card p-5 border-l-4 border-l-teal-500">
          <p className="text-sm font-medium text-slate-500">Total Jenis Item</p>
          <h3 className="text-2xl font-bold mt-1 text-teal-600">{items.length}</h3>
        </div>
        <div className="card p-5 border-l-4 border-l-red-500">
          <p className="text-sm font-medium text-slate-500">Item Kritis (Defecta)</p>
          <h3 className="text-2xl font-bold mt-1 text-red-600">{lowStock.length}</h3>
        </div>
        <div className="card p-5 border-l-4 border-l-blue-500">
          <p className="text-sm font-medium text-slate-500">Nilai Aset Gudang (Rp)</p>
          <h3 className="text-2xl font-bold mt-1 text-blue-600">{(totalValue || 0).toLocaleString('id-ID')}</h3>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-bold mb-4">Daftar Item Kritis (Butuh Reorder)</h3>
        <table className="w-full text-left text-sm border-collapse">
          <thead className="bg-slate-50 dark:bg-slate-800/50">
            <tr>
              <th className="p-3 border-b">Kode Item</th>
              <th className="p-3 border-b">Nama Item</th>
              <th className="p-3 border-b">Stok Saat Ini</th>
              <th className="p-3 border-b">Min. Stok (ROP)</th>
            </tr>
          </thead>
          <tbody>
            {lowStock.map(i => (
              <tr key={i.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="p-3 border-b font-mono text-slate-500">{i.id}</td>
                <td className="p-3 border-b font-medium">{i.nama}</td>
                <td className="p-3 border-b text-red-600 font-bold">{i.stok} {i.unit}</td>
                <td className="p-3 border-b">{i.min} {i.unit}</td>
              </tr>
            ))}
            {lowStock.length === 0 && <tr><td colSpan={4} className="p-4 text-center text-slate-500">Semua stok aman.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MasterTab({ items, setItems }: { items: any[], setItems: any }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  
  const [form, setForm] = useState({ id: '', nama: '', kategori: 'Obat', unit: 'Tablet', min: 10, harga: 0 });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editItem) {
      setItems(items.map(i => i.id === form.id ? { ...i, ...form } : i));
      toast.success("Item diperbarui");
    } else {
      setItems([...items, { ...form, id: form.id || 'ITM-' + Date.now().toString().slice(-4), stok: 0 }]);
      toast.success("Item ditambahkan");
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setItems(items.filter(i => i.id !== id));
    toast.success("Item dihapus");
  };

  const openForm = (item?: any) => {
    if (item) {
      setEditItem(item);
      setForm(item);
    } else {
      setEditItem(null);
      setForm({ id: '', nama: '', kategori: 'Obat', unit: 'Tablet', min: 10, harga: 0 });
    }
    setIsModalOpen(true);
  };

  return (
    <div className="card p-6">
      <div className="flex justify-between items-center mb-6 border-b border-slate-200 pb-2">
        <h2 className="text-xl font-bold flex items-center gap-2"><Package className="w-6 h-6 text-teal-500"/> Master Data Item</h2>
        <button onClick={() => openForm()} className="btn-primary bg-teal-600 hover:bg-teal-700 border-teal-600 text-sm"><Plus className="w-4 h-4 mr-2"/>Tambah Item</button>
      </div>
      
      <table className="w-full text-left text-sm border-collapse">
        <thead className="bg-slate-50 dark:bg-slate-800/50">
          <tr>
            <th className="p-3 border-b">Kode Item</th>
            <th className="p-3 border-b">Nama Item</th>
            <th className="p-3 border-b">Kategori</th>
            <th className="p-3 border-b">Min Stok</th>
            <th className="p-3 border-b">Harga Satuan</th>
            <th className="p-3 border-b text-right">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {items.map(i => (
            <tr key={i.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
              <td className="p-3 border-b font-mono text-slate-500">{i.id}</td>
              <td className="p-3 border-b font-medium">{i.nama}</td>
              <td className="p-3 border-b">{i.kategori}</td>
              <td className="p-3 border-b">{i.min} {i.unit}</td>
              <td className="p-3 border-b">Rp {(i.harga || 0).toLocaleString('id-ID')}</td>
              <td className="p-3 border-b text-right space-x-2">
                <button onClick={() => openForm(i)} className="text-blue-600 hover:underline"><Edit className="w-4 h-4"/></button>
                <button onClick={() => handleDelete(i.id)} className="text-red-600 hover:underline"><Trash2 className="w-4 h-4"/></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editItem ? 'Edit Master Item' : 'Tambah Master Item Baru'}
        subtitle={editItem ? `Perbarui data dan spesifikasi item: ${editItem.id}` : 'Registrasi barang medis, obat, atau BHP baru'}
        icon={editItem ? <Edit className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
        variant={editItem ? 'edit' : 'add'}
        badgeText={editItem ? editItem.id : 'Barang Baru'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          {!editItem && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                Kode Item (Kosongi untuk Auto-generate)
              </label>
              <input 
                type="text" 
                placeholder="Auto jika dikosongkan"
                className="w-full p-2.5 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-950/70 text-slate-900 dark:text-white font-mono focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" 
                value={form.id} 
                onChange={e => setForm({...form, id: e.target.value})} 
              />
            </div>
          )}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
              Nama Item Barang Medis / Obat <span className="text-rose-500">*</span>
            </label>
            <input 
              required 
              type="text" 
              placeholder="Contoh: Amoxicillin 500mg Kapsul"
              className="w-full p-2.5 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-950/70 text-slate-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" 
              value={form.nama} 
              onChange={e => setForm({...form, nama: e.target.value})} 
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                Kategori
              </label>
              <select 
                className="w-full p-2.5 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-950/70 text-slate-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" 
                value={form.kategori} 
                onChange={e => setForm({...form, kategori: e.target.value})}
              >
                <option>Obat</option>
                <option>BHP</option>
                <option>Alkes</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                Unit Satuan <span className="text-rose-500">*</span>
              </label>
              <input 
                required 
                type="text" 
                placeholder="Tablet, Botol, Pcs, Box"
                className="w-full p-2.5 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-950/70 text-slate-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" 
                value={form.unit} 
                onChange={e => setForm({...form, unit: e.target.value})} 
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                Min Stok (ROP) <span className="text-rose-500">*</span>
              </label>
              <input 
                required 
                type="number" 
                placeholder="100"
                className="w-full p-2.5 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-950/70 text-slate-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" 
                value={form.min} 
                onChange={e => setForm({...form, min: Number(e.target.value)})} 
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                Harga Beli Satuan (Rp) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">Rp</span>
                <input 
                  required 
                  type="number" 
                  placeholder="0"
                  className="w-full pl-9 pr-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-950/70 text-slate-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-mono" 
                  value={form.harga} 
                  onChange={e => setForm({...form, harga: Number(e.target.value)})} 
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-200 dark:border-slate-800">
            <button 
              type="button" 
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-colors border border-slate-300 dark:border-slate-700"
            >
              Batal
            </button>
            <button 
              type="submit" 
              className="px-5 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/20 transition-all flex items-center gap-1.5 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{editItem ? 'Simpan Perubahan' : 'Tambah Item'}</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

function StokTab({ items, setItems }: { items: any[], setItems: any }) {
  const [barcode, setBarcode] = useState('');
  const [qty, setQty] = useState(1);
  const [tipe, setTipe] = useState('IN');

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    const item = items.find(i => i.id === barcode || i.nama.toLowerCase().includes(barcode.toLowerCase()));
    if (!item) {
      toast.error("Item tidak ditemukan!"); return;
    }
    
    let newStok = tipe === 'IN' ? item.stok + qty : item.stok - qty;
    if (newStok < 0) newStok = 0;

    setItems(items.map(i => i.id === item.id ? { ...i, stok: newStok } : i));
    toast.success(`Stok ${item.nama} berhasil diupdate: ${tipe === 'IN' ? '+' : '-'}${qty}`);
    setBarcode(''); setQty(1);
  };

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h2 className="text-xl font-bold mb-4">Update Stok Manual / Barcode</h2>
        <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div><label className="block text-sm mb-1">Tipe Transaksi</label>
            <select className="input-field" value={tipe} onChange={e => setTipe(e.target.value)}>
              <option value="IN">Stok Masuk (IN)</option>
              <option value="OUT">Stok Keluar (OUT)</option>
            </select>
          </div>
          <div className="col-span-2"><label className="block text-sm mb-1">Scan Barcode / Kode Item</label>
            <div className="relative">
              <Scan className="w-5 h-5 absolute left-3 top-2.5 text-slate-400" />
              <input required type="text" className="input-field pl-10" value={barcode} onChange={e => setBarcode(e.target.value)} placeholder="Contoh: ITM-001" />
            </div>
          </div>
          <div><label className="block text-sm mb-1">Quantity</label>
            <input required type="number" min="1" className="input-field" value={qty} onChange={e => setQty(Number(e.target.value))} />
          </div>
          <div className="md:col-span-4 flex justify-end">
             <button type="submit" className="btn-primary bg-teal-600"><Save className="w-4 h-4 mr-2"/>Simpan Transaksi</button>
          </div>
        </form>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-bold mb-4">Posisi Stok Gudang</h3>
        <table className="w-full text-left text-sm border-collapse">
          <thead className="bg-slate-50 dark:bg-slate-800/50">
            <tr>
              <th className="p-3 border-b">Kode Item</th>
              <th className="p-3 border-b">Nama Item</th>
              <th className="p-3 border-b">Stok Tersedia</th>
              <th className="p-3 border-b">Nilai Aset</th>
            </tr>
          </thead>
          <tbody>
            {items.map(i => (
              <tr key={i.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="p-3 border-b font-mono text-slate-500">{i.id}</td>
                <td className="p-3 border-b font-medium">{i.nama}</td>
                <td className="p-3 border-b"><span className={`font-bold ${i.stok <= i.min ? 'text-red-600' : 'text-teal-600'}`}>{i.stok} {i.unit}</span></td>
                <td className="p-3 border-b">Rp {((i.stok || 0) * (i.harga || 0)).toLocaleString('id-ID')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function POTab({ poList, setPoList, items }: { poList: any[], setPoList: any, items: any[] }) {
  const [step, setStep] = useState(1);
  const [po, setPo] = useState({ supplier: '', vendor: '', date: '', items: [] as any[] });
  
  const [selItem, setSelItem] = useState('');
  const [selQty, setSelQty] = useState(1);

  const addItem = () => {
    const itemInfo = items.find(i => i.id === selItem);
    if(itemInfo) {
      setPo({ ...po, items: [...po.items, { ...itemInfo, orderQty: selQty }] });
      setSelItem(''); setSelQty(1);
    }
  };

  const handlePo = () => {
    setPoList([{ id: 'PO-' + Date.now(), ...po, status: 'Draft' }, ...poList]);
    toast.success("Purchase Order berhasil dibuat");
    setPo({ supplier: '', vendor: '', date: '', items: [] });
    setStep(1);
  };

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h2 className="text-xl font-bold mb-4">Buat Purchase Order Baru</h2>
        {step === 1 && (
          <div className="space-y-4 max-w-xl">
            <div><label className="block text-sm mb-1">Tanggal PO</label><input type="date" className="input-field" value={po.date} onChange={e => setPo({...po, date: e.target.value})}/></div>
            <div><label className="block text-sm mb-1">Supplier / PBF</label><input type="text" className="input-field" placeholder="Nama Supplier" value={po.supplier} onChange={e => setPo({...po, supplier: e.target.value})}/></div>
            <button onClick={() => setStep(2)} disabled={!po.date || !po.supplier} className="btn-primary mt-4 bg-teal-600">Lanjut ke Item</button>
          </div>
        )}
        {step === 2 && (
          <div className="space-y-4 max-w-2xl">
            <div className="flex gap-2">
              <select className="input-field" value={selItem} onChange={e => setSelItem(e.target.value)}>
                <option value="">-- Pilih Item --</option>
                {items.map(i => <option key={i.id} value={i.id}>{i.nama} (Sisa: {i.stok})</option>)}
              </select>
              <input type="number" min="1" className="input-field w-32" placeholder="Qty" value={selQty} onChange={e => setSelQty(Number(e.target.value))} />
              <button onClick={addItem} className="btn-secondary whitespace-nowrap"><Plus className="w-4 h-4 mr-1"/> Tambah</button>
            </div>
            {po.items.length > 0 && (
              <div className="mt-4 p-4 border rounded-lg bg-slate-50">
                <h4 className="font-bold mb-2">Daftar Pesanan:</h4>
                <ul className="list-disc pl-5 mb-4">
                  {po.items.map((i, idx) => <li key={idx}>{i.nama} - {i.orderQty} {i.unit}</li>)}
                </ul>
                <div className="flex justify-between border-t pt-4">
                  <button onClick={() => setStep(1)} className="btn-secondary text-sm">Kembali</button>
                  <button onClick={handlePo} className="btn-primary bg-teal-600">Proses PO</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="card p-6">
        <h3 className="text-lg font-bold mb-4">Riwayat Purchase Order</h3>
        <table className="w-full text-left text-sm border-collapse">
          <thead className="bg-slate-50 dark:bg-slate-800/50">
            <tr>
              <th className="p-3 border-b">No PO</th>
              <th className="p-3 border-b">Tanggal</th>
              <th className="p-3 border-b">Supplier</th>
              <th className="p-3 border-b">Status</th>
            </tr>
          </thead>
          <tbody>
            {poList.map(p => (
              <tr key={p.id}>
                <td className="p-3 border-b font-mono">{p.id}</td>
                <td className="p-3 border-b">{p.date}</td>
                <td className="p-3 border-b">{p.supplier}</td>
                <td className="p-3 border-b"><span className="px-2 py-1 bg-slate-200 rounded text-xs">{p.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function OpnameTab({ opnameList, setOpnameList, items, setItems }: { opnameList: any[], setOpnameList: any, items: any[], setItems: any }) {
  const [formOpen, setFormOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState('');
  const [fisik, setFisik] = useState(0);

  const target = items.find(i => i.id === selectedItem);

  const handleOpname = (e: React.FormEvent) => {
    e.preventDefault();
    if (target) {
      const selisih = fisik - target.stok;
      setOpnameList([{
        id: Date.now(), 
        item: target.nama,
        sistem: target.stok,
        fisik: fisik,
        selisih: selisih,
        date: new Date().toISOString().split('T')[0]
      }, ...opnameList]);
      
      // Update real stok to fisik
      setItems(items.map(i => i.id === target.id ? { ...i, stok: fisik } : i));
      toast.success("Stock Opname berhasil dicatat & disesuaikan");
      setFormOpen(false);
      setSelectedItem('');
      setFisik(0);
    }
  };

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-bold">Laporan Stock Opname</h2>
          <button onClick={() => setFormOpen(true)} className="btn-primary bg-teal-600"><Plus className="w-4 h-4 mr-2"/>Input Opname</button>
        </div>
        
        {formOpen && (
          <form onSubmit={handleOpname} className="mb-6 p-4 border border-teal-200 bg-teal-50 dark:bg-teal-900/20 rounded-lg max-w-xl">
            <h4 className="font-bold mb-3">Input Hitung Fisik</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm mb-1">Pilih Item</label>
                <select className="input-field bg-white" required value={selectedItem} onChange={e => setSelectedItem(e.target.value)}>
                  <option value="">-- Item --</option>
                  {items.map(i => <option key={i.id} value={i.id}>{i.nama}</option>)}
                </select>
              </div>
              {target && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-1">Stok Sistem</label>
                    <input type="number" disabled className="input-field bg-slate-100" value={target.stok} />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Hitung Fisik</label>
                    <input type="number" min="0" required className="input-field" value={fisik} onChange={e => setFisik(Number(e.target.value))} />
                  </div>
                </div>
              )}
              {target && (
                <p className="text-sm font-medium mt-2">Selisih: {fisik - target.stok} {target.unit}</p>
              )}
              <div className="flex gap-2 justify-end mt-4">
                <button type="button" onClick={() => setFormOpen(false)} className="btn-secondary">Batal</button>
                <button type="submit" className="btn-primary bg-teal-600">Simpan & Sesuaikan Stok</button>
              </div>
            </div>
          </form>
        )}

        <table className="w-full text-left text-sm border-collapse">
          <thead className="bg-slate-50 dark:bg-slate-800/50">
            <tr>
              <th className="p-3 border-b">Tanggal</th>
              <th className="p-3 border-b">Item</th>
              <th className="p-3 border-b">Stok Sistem</th>
              <th className="p-3 border-b">Fisik</th>
              <th className="p-3 border-b">Selisih</th>
            </tr>
          </thead>
          <tbody>
            {opnameList.map(o => (
              <tr key={o.id}>
                <td className="p-3 border-b">{o.date}</td>
                <td className="p-3 border-b font-medium">{o.item}</td>
                <td className="p-3 border-b text-slate-500">{o.sistem}</td>
                <td className="p-3 border-b font-bold">{o.fisik}</td>
                <td className="p-3 border-b">
                  <span className={`font-bold ${o.selisih < 0 ? 'text-red-600' : o.selisih > 0 ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {o.selisih > 0 ? '+'+o.selisih : o.selisih}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

}
