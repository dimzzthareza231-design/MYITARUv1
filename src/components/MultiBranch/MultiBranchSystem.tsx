import React, { useState } from 'react';
import { 
  Building2, 
  GitBranch, 
  Users, 
  Activity, 
  FileBarChart2, 
  ArrowRightLeft,
  Settings,
  MapPin,
  Stethoscope,
  Ambulance,
  BedDouble,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  Download,
  AlertTriangle,
  FileText
} from 'lucide-react';

export default function MultiBranchSystem() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Multi-Branch Management</h1>
          <p className="text-gray-500 text-sm">Centralized operations, patient transfer, and consolidated reporting</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-x-auto custom-scrollbar">
        <div className="flex p-1 min-w-max">
          <TabButton active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<Activity size={18} />} label="Overview" />
          <TabButton active={activeTab === 'facilities'} onClick={() => setActiveTab('facilities')} icon={<Building2 size={18} />} label="Facilities" />
          <TabButton active={activeTab === 'transfer'} onClick={() => setActiveTab('transfer')} icon={<ArrowRightLeft size={18} />} label="Patient Transfers" />
          <TabButton active={activeTab === 'reports'} onClick={() => setActiveTab('reports')} icon={<FileBarChart2 size={18} />} label="Consolidated Reports" />
        </div>
      </div>

      <div className="mt-6">
        {activeTab === 'dashboard' && <DashboardTab />}
        {activeTab === 'facilities' && <FacilityManagementTab />}
        {activeTab === 'transfer' && <PatientTransferTab />}
        {activeTab === 'reports' && <ConsolidatedReportsTab />}
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
        active ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function DashboardTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm text-gray-500 font-medium">Total Branches</p>
            <Building2 className="text-indigo-600" size={20} />
          </div>
          <p className="text-2xl font-bold text-gray-900">3</p>
          <p className="text-xs text-gray-500 mt-1">1 Pusat, 1 Cabang, 1 Klinik</p>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm text-gray-500 font-medium">Active Patients</p>
            <Users className="text-blue-600" size={20} />
          </div>
          <p className="text-2xl font-bold text-gray-900">12,450</p>
          <p className="text-xs text-green-600 mt-1 flex items-center gap-1">Across all facilities</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm text-gray-500 font-medium">Ongoing Transfers</p>
            <ArrowRightLeft className="text-orange-500" size={20} />
          </div>
          <p className="text-2xl font-bold text-orange-600">4</p>
          <p className="text-xs text-gray-500 mt-1">In transit / Requested</p>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm text-gray-500 font-medium">System Sync</p>
            <Activity className="text-green-600" size={20} />
          </div>
          <p className="text-2xl font-bold text-gray-900">100%</p>
          <p className="text-xs text-green-600 mt-1">All nodes online</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <h3 className="font-semibold text-gray-800">Branch Performance</h3>
          </div>
          <div className="p-4 space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-semibold text-gray-800">RS MyItaru Pusat Jakarta</span>
                <span className="font-medium text-gray-600">8,000 pts/month</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '80%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-semibold text-gray-800">RS MyItaru Cabang Bandung</span>
                <span className="font-medium text-gray-600">3,500 pts/month</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-semibold text-gray-800">Klinik Utama Bekasi</span>
                <span className="font-medium text-gray-600">950 pts/month</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-teal-500 h-2 rounded-full" style={{ width: '15%' }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="font-semibold text-gray-800">Recent Inter-Branch Transfers</h3>
          </div>
          <div className="divide-y divide-gray-100">
             <div className="p-4 hover:bg-gray-50 cursor-pointer">
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-orange-100 text-orange-800 text-[10px] font-bold rounded uppercase">Requested</span>
                    <span className="text-sm font-semibold text-gray-900">PAT-002 (John Doe)</span>
                  </div>
                  <span className="text-xs text-gray-500">2h ago</span>
                </div>
                <div className="flex items-center gap-3 mt-2 text-sm text-gray-600">
                   <div className="flex items-center gap-1"><MapPin size={14}/> Klinik Bekasi</div>
                   <ArrowRightLeft size={14} className="text-gray-400"/>
                   <div className="flex items-center gap-1 font-medium text-indigo-700"><MapPin size={14}/> RS Pusat Jakarta</div>
                </div>
                <p className="text-xs text-gray-500 mt-2 italic">Fasilitas ICU penuh, rujukan darurat.</p>
             </div>
             
             <div className="p-4 hover:bg-gray-50 cursor-pointer">
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-green-100 text-green-800 text-[10px] font-bold rounded uppercase">Completed</span>
                    <span className="text-sm font-semibold text-gray-900">PAT-001 (Jane Smith)</span>
                  </div>
                  <span className="text-xs text-gray-500">Aug 01</span>
                </div>
                <div className="flex items-center gap-3 mt-2 text-sm text-gray-600">
                   <div className="flex items-center gap-1"><MapPin size={14}/> Cabang Bandung</div>
                   <ArrowRightLeft size={14} className="text-gray-400"/>
                   <div className="flex items-center gap-1 font-medium text-indigo-700"><MapPin size={14}/> RS Pusat Jakarta</div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FacilityManagementTab() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
         <h2 className="text-lg font-semibold text-gray-900">Registered Facilities</h2>
         <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center gap-2">
            <Building2 size={16} /> Add Branch
         </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {/* Card Pusat */}
         <div className="bg-white border border-indigo-200 rounded-xl shadow-sm overflow-hidden relative">
            <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase">HQ / Pusat</div>
            <div className="p-5">
               <h3 className="font-bold text-gray-900 text-lg mt-2">RS Pusat Jakarta</h3>
               <p className="text-sm text-gray-500 font-mono mt-1">HQ-JKT (FAC-001)</p>
               
               <div className="mt-4 space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                     <MapPin size={16} /> Jakarta Selatan, DKI Jakarta
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                     <BedDouble size={16} /> 500 Bed Capacity
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                     <Users size={16} /> 150 Active Staff
                  </div>
               </div>

               <div className="mt-6 flex gap-2">
                  <button className="flex-1 bg-gray-50 border border-gray-200 text-gray-700 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">Config</button>
                  <button className="flex-1 bg-indigo-50 border border-indigo-200 text-indigo-700 py-1.5 rounded-lg text-sm font-medium hover:bg-indigo-100 transition-colors">Manage</button>
               </div>
            </div>
         </div>

         {/* Card Cabang */}
         <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden relative">
            <div className="absolute top-0 right-0 bg-blue-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase">Cabang</div>
            <div className="p-5">
               <h3 className="font-bold text-gray-900 text-lg mt-2">RS Cabang Bandung</h3>
               <p className="text-sm text-gray-500 font-mono mt-1">BR-BDG (FAC-002)</p>
               
               <div className="mt-4 space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                     <MapPin size={16} /> Kota Bandung, Jawa Barat
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                     <BedDouble size={16} /> 200 Bed Capacity
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                     <Users size={16} /> 85 Active Staff
                  </div>
               </div>

               <div className="mt-6 flex gap-2">
                  <button className="flex-1 bg-gray-50 border border-gray-200 text-gray-700 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">Config</button>
                  <button className="flex-1 bg-indigo-50 border border-indigo-200 text-indigo-700 py-1.5 rounded-lg text-sm font-medium hover:bg-indigo-100 transition-colors">Manage</button>
               </div>
            </div>
         </div>

         {/* Card Klinik */}
         <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden relative">
            <div className="absolute top-0 right-0 bg-teal-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase">Klinik</div>
            <div className="p-5">
               <h3 className="font-bold text-gray-900 text-lg mt-2">Klinik Utama Bekasi</h3>
               <p className="text-sm text-gray-500 font-mono mt-1">CL-BKS (FAC-003)</p>
               
               <div className="mt-4 space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                     <MapPin size={16} /> Kota Bekasi, Jawa Barat
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                     <BedDouble size={16} /> 0 Bed (Outpatient only)
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                     <Users size={16} /> 12 Active Staff
                  </div>
               </div>

               <div className="mt-6 flex gap-2">
                  <button className="flex-1 bg-gray-50 border border-gray-200 text-gray-700 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">Config</button>
                  <button className="flex-1 bg-indigo-50 border border-indigo-200 text-indigo-700 py-1.5 rounded-lg text-sm font-medium hover:bg-indigo-100 transition-colors">Manage</button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}

function PatientTransferTab() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between gap-4 bg-gray-50">
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" placeholder="Search transfer ID, Patient..." className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm w-full sm:w-64" />
          </div>
          <select className="border border-gray-300 rounded-lg text-sm px-3">
            <option>All Status</option>
            <option>Requested</option>
            <option>Accepted</option>
            <option>In Transit</option>
            <option>Completed</option>
          </select>
        </div>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center gap-2">
          <Ambulance size={16} /> New Transfer Request
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Transfer ID & Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Route</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-bold text-indigo-700">TRF-002</div>
                <div className="text-xs text-gray-500 mt-1">2026-08-05 09:00</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">John Doe</div>
                <div className="text-xs text-gray-500">RM-BKS-0012</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-600">Klinik Bekasi</span>
                  <ArrowRightLeft size={14} className="text-gray-400" />
                  <span className="font-semibold text-gray-900">Pusat Jakarta</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900 line-clamp-1 max-w-[200px]">Fasilitas ICU penuh</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800">Requested</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button className="text-indigo-600 hover:text-indigo-900 mr-3">Review</button>
                <button className="text-green-600 hover:text-green-900">Accept</button>
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-bold text-gray-700">TRF-001</div>
                <div className="text-xs text-gray-500 mt-1">2026-08-01 10:00</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">Jane Smith</div>
                <div className="text-xs text-gray-500">RM-BDG-0045</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-600">Cabang Bandung</span>
                  <ArrowRightLeft size={14} className="text-gray-400" />
                  <span className="font-semibold text-gray-900">Pusat Jakarta</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900 line-clamp-1 max-w-[200px]">Rujukan spesialis jantung</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Completed</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button className="text-gray-500 hover:text-gray-900">Handover Doc</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ConsolidatedReportsTab() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
       <div className="lg:col-span-1 bg-white border border-gray-200 rounded-xl p-4 shadow-sm h-fit">
         <h3 className="font-bold text-gray-900 mb-4 px-2">Report Types</h3>
         <div className="space-y-1">
            <div className="px-4 py-2 text-sm bg-indigo-50 text-indigo-700 font-medium rounded-lg cursor-pointer flex items-center gap-2">
               <Users size={16}/> Kunjungan (Visits)
            </div>
            <div className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer flex items-center gap-2">
               <FileBarChart2 size={16}/> Pendapatan (Revenue)
            </div>
            <div className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer flex items-center gap-2">
               <Activity size={16}/> Quality Metrics
            </div>
         </div>
       </div>

       <div className="lg:col-span-3 bg-white border border-gray-200 rounded-xl shadow-sm p-6">
         <div className="flex justify-between items-start mb-6">
            <div>
               <h2 className="text-2xl font-bold text-gray-900">Laporan Konsolidasi Kunjungan</h2>
               <p className="text-sm text-gray-500 mt-1">Periode: Juli 2026 • All Branches</p>
            </div>
            <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-gray-50">
               <Download size={16}/> Export PDF
            </button>
         </div>

         <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-indigo-50 rounded-lg p-4">
               <p className="text-indigo-900 text-sm font-medium">Total Kunjungan (Global)</p>
               <p className="text-3xl font-bold text-indigo-700 mt-1">12,500</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
               <p className="text-green-900 text-sm font-medium">RS Pusat Jakarta</p>
               <p className="text-2xl font-bold text-green-700 mt-1">8,000</p>
               <p className="text-xs text-green-600 mt-1">64% of total</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
               <p className="text-blue-900 text-sm font-medium">RS Cabang & Klinik</p>
               <p className="text-2xl font-bold text-blue-700 mt-1">4,500</p>
               <p className="text-xs text-blue-600 mt-1">36% of total</p>
            </div>
         </div>

         <div>
            <h4 className="font-semibold text-gray-900 mb-4">Breakdown by Facility</h4>
            <div className="space-y-4">
               <div className="flex items-center gap-4">
                  <div className="w-48 text-sm font-medium text-gray-700">Pusat Jakarta</div>
                  <div className="flex-1 bg-gray-100 rounded-full h-4 relative">
                     <div className="bg-indigo-500 h-4 rounded-full" style={{ width: '64%' }}></div>
                  </div>
                  <div className="w-16 text-right text-sm font-bold">8,000</div>
               </div>
               <div className="flex items-center gap-4">
                  <div className="w-48 text-sm font-medium text-gray-700">Cabang Bandung</div>
                  <div className="flex-1 bg-gray-100 rounded-full h-4 relative">
                     <div className="bg-blue-500 h-4 rounded-full" style={{ width: '28%' }}></div>
                  </div>
                  <div className="w-16 text-right text-sm font-bold">3,500</div>
               </div>
               <div className="flex items-center gap-4">
                  <div className="w-48 text-sm font-medium text-gray-700">Klinik Utama Bekasi</div>
                  <div className="flex-1 bg-gray-100 rounded-full h-4 relative">
                     <div className="bg-teal-500 h-4 rounded-full" style={{ width: '8%' }}></div>
                  </div>
                  <div className="w-16 text-right text-sm font-bold">1,000</div>
               </div>
            </div>
         </div>
       </div>
    </div>
  );
}
