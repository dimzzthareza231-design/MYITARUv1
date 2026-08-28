import toast from "react-hot-toast";
import { useToast } from "../contexts/ToastContext";
import React, { useState } from 'react';
import { useWorkflow, ApprovalRequest } from '../contexts/WorkflowContext';
import { useHospital } from '../contexts/HospitalContext';
import { Check, X, Clock, AlertTriangle, ChevronRight, FileText, UserCircle } from 'lucide-react';

function WorkflowEngine() {
  const { workflows, approvalRequests, approveRequest, rejectRequest, getMyPendingApprovals } = useWorkflow();
  const { activeUser } = useHospital();
  
  const [activeTab, setActiveTab] = useState<'my_approvals' | 'all_requests' | 'workflows'>('my_approvals');
  const [selectedRequest, setSelectedRequest] = useState<ApprovalRequest | null>(null);
  const [comment, setComment] = useState('');
  
  const myPending = getMyPendingApprovals(activeUser?.role || '');

  const handleApprove = (reqId: number) => {
    if (!comment) {
      toast("Harap berikan komentar untuk approval.");
      return;
    }
    approveRequest(reqId, activeUser?.name || 'Unknown', comment);
    setComment('');
    setSelectedRequest(null);
  };

  const handleReject = (reqId: number) => {
    if (!comment) {
      toast("Harap berikan komentar penolakan.");
      return;
    }
    rejectRequest(reqId, activeUser?.name || 'Unknown', comment);
    setComment('');
    setSelectedRequest(null);
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'Approved':
        return <span className="px-2 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-lg text-xs font-bold">Approved</span>;
      case 'Rejected':
        return <span className="px-2 py-1 bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 rounded-lg text-xs font-bold">Rejected</span>;
      default:
        return <span className="px-2 py-1 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 rounded-lg text-xs font-bold">Pending</span>;
    }
  };

  const isDeadlineNear = (deadlineStr: string) => {
    const deadline = new Date(deadlineStr).getTime();
    const now = new Date().getTime();
    const hoursLeft = (deadline - now) / (1000 * 60 * 60);
    return hoursLeft < 12 && hoursLeft > 0;
  };

  const isOverdue = (deadlineStr: string) => {
    const deadline = new Date(deadlineStr).getTime();
    const now = new Date().getTime();
    return now > deadline;
  };

  return (
    <div className="p-6 h-full overflow-y-auto custom-scrollbar flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileText className="w-6 h-6 text-indigo-500" />
          Workflow & Approval Engine
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">Manajemen persetujuan berjenjang dan SLA tracking.</p>
      </div>

      <div className="flex border-b border-slate-200 dark:border-slate-700 mb-6">
        <button
          onClick={() => setActiveTab('my_approvals')}
          className={`px-4 py-3 font-bold text-sm transition-colors border-b-2 ${
            activeTab === 'my_approvals' 
              ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' 
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          Butuh Persetujuan Saya ({myPending.length})
        </button>
        <button
          onClick={() => setActiveTab('all_requests')}
          className={`px-4 py-3 font-bold text-sm transition-colors border-b-2 ${
            activeTab === 'all_requests' 
              ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' 
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          Semua Request
        </button>
        <button
          onClick={() => setActiveTab('workflows')}
          className={`px-4 py-3 font-bold text-sm transition-colors border-b-2 ${
            activeTab === 'workflows' 
              ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' 
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          Visual Builder
        </button>
      </div>

      <div className="flex-1 overflow-hidden flex gap-6">
        {/* List Section */}
        <div className={`flex-1 overflow-y-auto custom-scrollbar pr-2 ${selectedRequest ? 'hidden md:block' : 'block'}`}>
          {activeTab === 'workflows' ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {workflows.map(w => (
                <div key={w.id} className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">{w.name}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{w.description}</p>
                  <div className="flex items-center text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-4 bg-indigo-50 dark:bg-indigo-900/30 p-2 rounded-lg w-fit">
                    <Clock className="w-4 h-4 mr-1" /> SLA: {w.sla_hours} Jam
                  </div>
                  <div className="space-y-2 relative before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700">
                    {w.stages.map((stage, idx) => (
                      <div key={stage.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-white dark:border-slate-800 bg-indigo-500 text-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 text-[10px] font-bold">
                          {idx + 1}
                        </div>
                        <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg border border-slate-200 dark:border-slate-600">
                          <div className="font-bold text-slate-900 dark:text-white text-sm">{stage.name}</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">{stage.role}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {(activeTab === 'my_approvals' ? myPending : approvalRequests).map(req => (
                <div 
                  key={req.id} 
                  onClick={() => setSelectedRequest(req)}
                  className={`bg-white dark:bg-slate-800 p-4 rounded-xl border transition-all cursor-pointer ${
                    selectedRequest?.id === req.id 
                      ? 'border-indigo-500 ring-1 ring-indigo-500' 
                      : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      {req.workflow_name}
                    </h3>
                    {renderStatusBadge(req.status)}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{req.entity_description}</p>
                  
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                      <UserCircle className="w-4 h-4" />
                      Oleh: <span className="font-bold">{req.requested_by}</span>
                    </div>
                    {req.status === 'Pending' && (
                      <div className={`flex items-center gap-1.5 font-bold ${
                        isOverdue(req.deadline) 
                          ? 'text-rose-600 dark:text-rose-400' 
                          : isDeadlineNear(req.deadline) 
                            ? 'text-amber-600 dark:text-amber-400' 
                            : 'text-emerald-600 dark:text-emerald-400'
                      }`}>
                        {isOverdue(req.deadline) ? <AlertTriangle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                        SLA: {new Date(req.deadline).toLocaleString('id-ID', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' })}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {(activeTab === 'my_approvals' ? myPending : approvalRequests).length === 0 && (
                <div className="text-center p-12 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                  <Check className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Semua Selesai!</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">Tidak ada dokumen yang perlu diproses saat ini.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Detail Section */}
        {selectedRequest && activeTab !== 'workflows' && (
          <div className="flex-1 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col h-full overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex justify-between items-center">
              <div>
                <h2 className="font-bold text-lg text-slate-900 dark:text-white">Detail Request #{selectedRequest.id}</h2>
                <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-1">
                  <span>{selectedRequest.workflow_name}</span>
                  <ChevronRight className="w-3 h-3" />
                  <span>{selectedRequest.entity_type.toUpperCase()}</span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedRequest(null)}
                className="md:hidden text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
              <div className="mb-6">
                <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Informasi Dokumen</h3>
                <div className="bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800/30 p-4 rounded-lg">
                  <p className="text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                    {selectedRequest.entity_description}
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Riwayat Approval</h3>
                <div className="space-y-4">
                  {selectedRequest.history.map((hist, idx) => (
                    <div key={idx} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                          hist.action === 'Approve' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' :
                          hist.action === 'Reject' ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400' :
                          'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                        }`}>
                          {hist.action === 'Approve' ? <Check className="w-4 h-4" /> :
                           hist.action === 'Reject' ? <X className="w-4 h-4" /> :
                           <UserCircle className="w-4 h-4" />}
                        </div>
                        {idx < selectedRequest.history.length - 1 && (
                          <div className="w-0.5 h-full bg-slate-200 dark:bg-slate-700 my-1"></div>
                        )}
                      </div>
                      <div className="pb-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-white text-sm">{hist.actor}</span>
                          <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded">
                            {hist.stage_name}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 mt-1">
                          {new Date(hist.timestamp).toLocaleString('id-ID')}
                        </div>
                        <div className="mt-2 text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-700/50 p-2.5 rounded-lg inline-block border border-slate-100 dark:border-slate-600">
                          {hist.comment}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {selectedRequest.status === 'Pending' && (
                    <div className="flex gap-3 opacity-50">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-slate-200 dark:bg-slate-700 text-slate-400">
                          <Clock className="w-4 h-4" />
                        </div>
                      </div>
                      <div className="pb-4">
                        <div className="font-bold text-slate-600 dark:text-slate-300 text-sm italic">Menunggu stage {selectedRequest.current_stage}...</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {selectedRequest.status === 'Pending' && activeTab === 'my_approvals' && (
              <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Tambahkan komentar atau catatan (Wajib)..."
                  className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm resize-none mb-3 custom-scrollbar"
                  rows={2}
                />
                <div className="flex gap-3">
                  <button
                    onClick={() => handleReject(selectedRequest.id)}
                    className="flex-1 bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-900/20 dark:text-rose-400 dark:hover:bg-rose-900/40 border border-rose-200 dark:border-rose-800 px-4 py-2.5 rounded-lg font-bold flex justify-center items-center gap-2 transition-colors"
                  >
                    <X className="w-4 h-4" /> Tolak
                  </button>
                  <button
                    onClick={() => handleApprove(selectedRequest.id)}
                    className="flex-1 bg-emerald-600 text-white hover:bg-emerald-700 px-4 py-2.5 rounded-lg font-bold flex justify-center items-center gap-2 shadow-sm transition-colors"
                  >
                    <Check className="w-4 h-4" /> Setujui
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default WorkflowEngine;
