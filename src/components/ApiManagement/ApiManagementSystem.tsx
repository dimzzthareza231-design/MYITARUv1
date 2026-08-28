import React, { useState, useEffect } from 'react';
import { 
  Terminal, Key, Code, Webhook, Activity, Settings, Copy
} from 'lucide-react';
import toast from 'react-hot-toast';

export function ApiManagementSystem() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'clients' | 'docs' | 'webhooks'>('dashboard');

  const tabs = [
    { id: 'dashboard', label: 'API Dashboard', icon: Activity },
    { id: 'clients', label: 'Client Keys', icon: Key },
    { id: 'docs', label: 'API Docs', icon: Code },
    { id: 'webhooks', label: 'Webhooks', icon: Webhook },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto h-full flex flex-col">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-purple-600 dark:text-purple-500">
            <Terminal className="w-7 h-7" />
            API & Integration Management
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Kelola API Keys, dokumentasi endpoint, dan webhook untuk pihak ketiga.</p>
        </div>
      </div>

      <div className="flex gap-1 mb-6 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto custom-scrollbar shrink-0">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === tab.id 
                ? 'bg-white dark:bg-slate-700 shadow-sm text-purple-600 dark:text-purple-400' 
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pb-6">
        {activeTab === 'dashboard' && <DashboardTab />}
        {activeTab === 'clients' && <ClientsTab />}
        {activeTab === 'docs' && <DocsTab />}
        {activeTab === 'webhooks' && <WebhooksTab />}
      </div>
    </div>
  );
}

function DashboardTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6">
           <h3 className="font-bold text-sm text-slate-500 mb-1">Total API Calls (24h)</h3>
           <div className="text-3xl font-bold text-purple-600 mb-1">124.5K</div>
           <div className="text-xs text-emerald-500 font-bold">+15% from yesterday</div>
        </div>
        <div className="card p-6">
           <h3 className="font-bold text-sm text-slate-500 mb-1">Error Rate (5xx)</h3>
           <div className="text-3xl font-bold text-emerald-600 mb-1">0.05%</div>
           <div className="text-xs">Healthy</div>
        </div>
        <div className="card p-6">
           <h3 className="font-bold text-sm text-slate-500 mb-1">Active Clients</h3>
           <div className="text-3xl font-bold text-slate-800 dark:text-white mb-1">8</div>
           <div className="text-xs text-slate-500">Apps consuming API</div>
        </div>
      </div>
      
      <div className="card p-6">
        <h3 className="font-bold mb-4">Top Endpoints by Volume</h3>
        <table className="w-full text-left text-sm border-collapse">
          <thead>
             <tr className="border-b text-slate-500">
                <th className="pb-2 font-medium">Method</th>
                <th className="pb-2 font-medium">Endpoint</th>
                <th className="pb-2 font-medium text-right">Requests</th>
                <th className="pb-2 font-medium text-right">Avg Latency</th>
             </tr>
          </thead>
          <tbody>
             {[
               { m: 'GET', p: '/api/v1/patients', r: '45,231', l: '45ms' },
               { m: 'POST', p: '/api/v1/appointments', r: '12,400', l: '120ms' },
               { m: 'GET', p: '/api/v1/inventory/stock', r: '8,901', l: '30ms' },
             ].map((e,i) => (
               <tr key={i} className="border-b dark:border-slate-800 last:border-0">
                 <td className="py-3"><span className={`font-mono text-xs font-bold px-2 py-1 rounded ${e.m==='GET'?'bg-blue-100 text-blue-700':'bg-emerald-100 text-emerald-700'}`}>{e.m}</span></td>
                 <td className="py-3 font-mono text-xs">{e.p}</td>
                 <td className="py-3 text-right font-medium">{e.r}</td>
                 <td className="py-3 text-right text-slate-500">{e.l}</td>
               </tr>
             ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ClientsTab() {
  const [clients, setClients] = useState<any[]>(() => JSON.parse(localStorage.getItem('api_clients') || JSON.stringify([
    { id: 'cli_abc123', name: 'Mobile App V2', env: 'Production', created: '2025-01-10' }
  ])));
  const [form, setForm] = useState({ name: '', env: 'Production' });

  useEffect(() => { localStorage.setItem('api_clients', JSON.stringify(clients)); }, [clients]);

  const addClient = (e: React.FormEvent) => {
    e.preventDefault();
    if(!form.name) return;
    setClients([{ id: `cli_${Date.now().toString(36)}`, ...form, created: new Date().toISOString().split('T')[0] }, ...clients]);
    toast.success("Client API Key generated!");
    setForm({ name: '', env: 'Production' });
  };

  const copyKey = (id: string) => {
    navigator.clipboard.writeText(`sk_live_${id}_${Date.now()}`);
    toast.success("API Key copied to clipboard");
  };

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h2 className="text-xl font-bold mb-4">Generate API Key (Client)</h2>
        <form onSubmit={addClient} className="flex gap-4 items-end">
          <div className="flex-1"><label className="block text-sm mb-1">App / Client Name</label><input type="text" className="input-field" value={form.name} onChange={e=>setForm({...form, name: e.target.value})} required placeholder="e.g. Self-Service Kiosk" /></div>
          <div><label className="block text-sm mb-1">Environment</label>
             <select className="input-field" value={form.env} onChange={e=>setForm({...form, env: e.target.value})}>
               <option>Development</option><option>Production</option>
             </select>
          </div>
          <button type="submit" className="btn-primary bg-purple-600 hover:bg-purple-700">Generate Key</button>
        </form>
      </div>

      <div className="card p-6">
        <h3 className="font-bold mb-4">Active API Clients</h3>
        <table className="w-full text-left text-sm border-collapse">
          <thead className="bg-slate-50 dark:bg-slate-800/50">
            <tr>
              <th className="p-3 border-b">Client Name</th>
              <th className="p-3 border-b">Client ID</th>
              <th className="p-3 border-b">Environment</th>
              <th className="p-3 border-b">Created</th>
              <th className="p-3 border-b text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {clients.map(c => (
              <tr key={c.id}>
                <td className="p-3 border-b font-bold">{c.name}</td>
                <td className="p-3 border-b font-mono text-xs">{c.id}</td>
                <td className="p-3 border-b"><span className={`px-2 py-0.5 rounded text-[10px] font-bold ${c.env === 'Production' ? 'bg-purple-100 text-purple-700' : 'bg-slate-200 text-slate-700'}`}>{c.env}</span></td>
                <td className="p-3 border-b text-xs">{c.created}</td>
                <td className="p-3 border-b text-right">
                  <button onClick={() => copyKey(c.id)} className="btn-secondary py-1 px-2 text-xs flex items-center gap-1 ml-auto"><Copy className="w-3 h-3"/> Reveal & Copy Key</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DocsTab() {
  return (
    <div className="flex h-[600px] border rounded-xl overflow-hidden bg-white dark:bg-slate-900">
       <div className="w-64 border-r dark:border-slate-800 p-4 overflow-y-auto bg-slate-50 dark:bg-slate-800/30">
          <h3 className="font-bold mb-4 text-sm uppercase tracking-wider text-slate-500">Endpoints</h3>
          <ul className="space-y-2 text-sm font-medium">
             <li className="text-purple-600 font-bold cursor-pointer">Patients</li>
             <li className="pl-4 text-slate-600 cursor-pointer text-xs"><span className="text-blue-500 font-bold mr-1">GET</span> /patients</li>
             <li className="pl-4 text-slate-600 cursor-pointer text-xs"><span className="text-emerald-500 font-bold mr-1">POST</span> /patients</li>
             <li className="text-slate-600 mt-4 cursor-pointer">Appointments</li>
             <li className="text-slate-600 mt-2 cursor-pointer">Billing</li>
          </ul>
       </div>
       <div className="flex-1 p-6 overflow-y-auto">
          <h2 className="text-2xl font-bold mb-2">Get All Patients</h2>
          <div className="flex items-center gap-2 mb-6">
            <span className="px-2 py-1 bg-blue-100 text-blue-700 font-bold rounded text-sm">GET</span>
            <code className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-sm">https://api.his.system/v1/patients</code>
          </div>
          <p className="text-sm text-slate-600 mb-6">Retrieve a list of all registered patients. Supports pagination.</p>
          
          <h3 className="font-bold border-b pb-2 mb-4">Response (200 OK)</h3>
          <pre className="bg-slate-900 text-emerald-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
{`{
  "status": "success",
  "data": [
    {
      "id": "RM-001",
      "name": "Budi Santoso",
      "dob": "1990-05-15",
      "gender": "M"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10
  }
}`}
          </pre>
       </div>
    </div>
  );
}

function WebhooksTab() {
  const [hooks, setHooks] = useState<any[]>(() => JSON.parse(localStorage.getItem('api_webhooks') || JSON.stringify([
    { id: 1, url: 'https://external-crm.com/webhook/his', events: 'patient.created', status: 'Active' }
  ])));
  const [form, setForm] = useState({ url: '', events: 'patient.created' });

  useEffect(() => { localStorage.setItem('api_webhooks', JSON.stringify(hooks)); }, [hooks]);

  const addHook = (e: React.FormEvent) => {
    e.preventDefault();
    if(!form.url) return;
    setHooks([{ id: Date.now(), ...form, status: 'Active' }, ...hooks]);
    toast.success("Webhook endpoint ditambahkan");
    setForm({ url: '', events: 'patient.created' });
  };

  const removeHook = (id: number) => setHooks(hooks.filter(h => h.id !== id));

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h2 className="text-xl font-bold mb-4">Daftarkan Webhook Endpoint</h2>
        <form onSubmit={addHook} className="flex gap-4 items-end">
          <div className="flex-1"><label className="block text-sm mb-1">Payload URL</label><input type="url" className="input-field" value={form.url} onChange={e=>setForm({...form, url: e.target.value})} required placeholder="https://..." /></div>
          <div><label className="block text-sm mb-1">Event to subscribe</label>
             <select className="input-field" value={form.events} onChange={e=>setForm({...form, events: e.target.value})}>
               <option>patient.created</option>
               <option>appointment.booked</option>
               <option>billing.paid</option>
               <option>*</option>
             </select>
          </div>
          <button type="submit" className="btn-primary">Add Webhook</button>
        </form>
      </div>
      
      <div className="card p-6">
        <h3 className="font-bold mb-4">Active Webhooks</h3>
        <table className="w-full text-left text-sm border-collapse">
          <thead className="bg-slate-50 dark:bg-slate-800/50">
            <tr>
              <th className="p-3 border-b">Payload URL</th>
              <th className="p-3 border-b">Subscribed Events</th>
              <th className="p-3 border-b">Status</th>
              <th className="p-3 border-b text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {hooks.map(h => (
              <tr key={h.id}>
                <td className="p-3 border-b font-mono text-xs">{h.url}</td>
                <td className="p-3 border-b"><span className="bg-slate-200 text-slate-800 font-bold px-2 py-0.5 rounded text-[10px]">{h.events}</span></td>
                <td className="p-3 border-b"><span className="text-emerald-600 font-bold text-xs">{h.status}</span></td>
                <td className="p-3 border-b text-right"><button onClick={() => removeHook(h.id)} className="text-rose-500 text-xs hover:underline">Hapus</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
