import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '../utils/storage';

export interface WorkflowStage {
  id: number;
  name: string;
  role: string;
  order: number;
}

export interface Workflow {
  id: number;
  name: string;
  description: string;
  stages: WorkflowStage[];
  sla_hours: number;
  is_active: boolean;
}

export interface ApprovalHistory {
  stage: number;
  stage_name: string;
  action: string;
  actor: string;
  timestamp: string;
  comment: string;
}

export interface ApprovalRequest {
  id: number;
  workflow_id: number;
  workflow_name: string;
  entity_type: string;
  entity_id: number | string;
  entity_description: string;
  current_stage: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  requested_by: string;
  requested_at: string;
  deadline: string;
  history: ApprovalHistory[];
}

interface WorkflowContextType {
  workflows: Workflow[];
  approvalRequests: ApprovalRequest[];
  createApprovalRequest: (requestData: any) => ApprovalRequest | undefined;
  approveRequest: (requestId: number, actor: string, comment: string) => void;
  rejectRequest: (requestId: number, actor: string, comment: string) => void;
  getMyPendingApprovals: (userRole: string) => ApprovalRequest[];
}

const WorkflowContext = createContext<WorkflowContextType | undefined>(undefined);

export function WorkflowProvider({ children }: { children: React.ReactNode }) {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [approvalRequests, setApprovalRequests] = useState<ApprovalRequest[]>([]);
  
  useEffect(() => {
    const savedWorkflows = storage.get('workflows');
    const savedRequests = storage.get('approval_requests');
    
    if (savedWorkflows && Array.isArray(savedWorkflows)) {
      setWorkflows(savedWorkflows);
    }
    
    if (savedRequests && Array.isArray(savedRequests)) {
      setApprovalRequests(savedRequests);
    }
    
    if (!savedWorkflows || !Array.isArray(savedWorkflows)) {
      // Data dummy workflow templates
      const dummyWorkflows: Workflow[] = [
        {
          id: 1,
          name: 'Klaim BPJS > 10 Juta',
          description: 'Klaim BPJS dengan nilai di atas 10 juta perlu approval Kepala RS',
          stages: [
            { id: 1, name: 'Maker', role: 'Staf Billing', order: 1 },
            { id: 2, name: 'Checker', role: 'Supervisor Billing', order: 2 },
            { id: 3, name: 'Approver', role: 'Kepala RS', order: 3 }
          ],
          sla_hours: 24,
          is_active: true
        },
        {
          id: 2,
          name: 'Resep Obat Narkotika',
          description: 'Resep obat narkotika perlu approval 2 dokter',
          stages: [
            { id: 1, name: 'Dokter Penulis', role: 'Dokter', order: 1 },
            { id: 2, name: 'Dokter Verifikator', role: 'Dokter Senior', order: 2 }
          ],
          sla_hours: 4,
          is_active: true
        },
        {
          id: 3,
          name: 'Cuti > 3 Hari',
          description: 'Cuti lebih dari 3 hari perlu approval Kepala Departemen',
          stages: [
            { id: 1, name: 'Pemohon', role: 'Staf', order: 1 },
            { id: 2, name: 'Kepala Departemen', role: 'Head', order: 2 },
            { id: 3, name: 'HRD', role: 'HRD', order: 3 }
          ],
          sla_hours: 48,
          is_active: true
        }
      ];
      setWorkflows(dummyWorkflows);
      storage.set('workflows', dummyWorkflows);
    }
    
    if (!savedRequests || !Array.isArray(savedRequests)) {
      // Data dummy approval requests
      const dummyRequests: ApprovalRequest[] = [
        {
          id: 1,
          workflow_id: 1,
          workflow_name: 'Klaim BPJS > 10 Juta',
          entity_type: 'klaim_bpjs',
          entity_id: 55,
          entity_description: 'Klaim KLM-20260801-001 - Rp 15.000.000',
          current_stage: 2,
          status: 'Pending',
          requested_by: 'kasir.joko',
          requested_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          deadline: new Date(Date.now() + 22 * 60 * 60 * 1000).toISOString(),
          history: [
            {
              stage: 1,
              stage_name: 'Maker',
              action: 'Submit',
              actor: 'kasir.joko',
              timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
              comment: 'Mohon approval untuk klaim BPJS'
            }
          ]
        },
        {
          id: 2,
          workflow_id: 2,
          workflow_name: 'Resep Obat Narkotika',
          entity_type: 'resep',
          entity_id: 101,
          entity_description: 'Resep Morfin untuk pasien Budi Santoso',
          current_stage: 1,
          status: 'Pending',
          requested_by: 'dr.ahmad',
          requested_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          deadline: new Date(Date.now() + 3.5 * 60 * 60 * 1000).toISOString(),
          history: [
            {
              stage: 1,
              stage_name: 'Dokter Penulis',
              action: 'Submit',
              actor: 'dr.ahmad',
              timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
              comment: 'Resep obat narkotika untuk nyeri akut'
            }
          ]
        },
        {
          id: 3,
          workflow_id: 3,
          workflow_name: 'Cuti > 3 Hari',
          entity_type: 'cuti',
          entity_id: 15,
          entity_description: 'Cuti 5 hari - Rina Wijaya',
          current_stage: 3,
          status: 'Approved',
          requested_by: 'perawat.rina',
          requested_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          deadline: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          history: [
            {
              stage: 1,
              stage_name: 'Pemohon',
              action: 'Submit',
              actor: 'perawat.rina',
              timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
              comment: 'Mohon cuti 5 hari untuk urusan keluarga'
            },
            {
              stage: 2,
              stage_name: 'Kepala Departemen',
              action: 'Approve',
              actor: 'head.kepala',
              timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
              comment: 'Disetujui, pastikan ada pengganti'
            },
            {
              stage: 3,
              stage_name: 'HRD',
              action: 'Approve',
              actor: 'hrd.admin',
              timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
              comment: 'Cuti disetujui'
            }
          ]
        }
      ];
      setApprovalRequests(dummyRequests);
      storage.set('approval_requests', dummyRequests);
    }
  }, []);
  
  const createApprovalRequest = (requestData: any) => {
    const workflow = workflows.find(w => w.id === requestData.workflow_id);
    if (!workflow) return;

    const newRequest: ApprovalRequest = {
      id: Date.now(),
      ...requestData,
      workflow_name: workflow.name,
      current_stage: 1,
      status: 'Pending',
      requested_at: new Date().toISOString(),
      deadline: new Date(Date.now() + workflow.sla_hours * 60 * 60 * 1000).toISOString(),
      history: [
        {
          stage: 1,
          stage_name: workflow.stages[0].name,
          action: 'Submit',
          actor: requestData.requested_by,
          timestamp: new Date().toISOString(),
          comment: requestData.comment || 'Request approval'
        }
      ]
    };
    
    const updated = [newRequest, ...approvalRequests];
    setApprovalRequests(updated);
    storage.set('approval_requests', updated);
    
    return newRequest;
  };
  
  const approveRequest = (requestId: number, actor: string, comment: string) => {
    const updated = approvalRequests.map(req => {
      if (req.id === requestId) {
        const workflow = workflows.find(w => w.id === req.workflow_id);
        if (!workflow) return req;

        const nextStage = req.current_stage + 1;
        const isFinalStage = nextStage > workflow.stages.length;
        
        const newHistory = [
          ...req.history,
          {
            stage: req.current_stage,
            stage_name: workflow.stages[req.current_stage - 1]?.name || 'Unknown',
            action: 'Approve',
            actor: actor,
            timestamp: new Date().toISOString(),
            comment: comment || 'Approved'
          }
        ];
        
        return {
          ...req,
          current_stage: isFinalStage ? req.current_stage : nextStage,
          status: isFinalStage ? 'Approved' : 'Pending',
          history: newHistory
        } as ApprovalRequest;
      }
      return req;
    });
    
    setApprovalRequests(updated);
    storage.set('approval_requests', updated);
  };
  
  const rejectRequest = (requestId: number, actor: string, comment: string) => {
    const updated = approvalRequests.map(req => {
      if (req.id === requestId) {
        const workflow = workflows.find(w => w.id === req.workflow_id);
        if (!workflow) return req;

        const newHistory = [
          ...req.history,
          {
            stage: req.current_stage,
            stage_name: workflow.stages[req.current_stage - 1]?.name || 'Unknown',
            action: 'Reject',
            actor: actor,
            timestamp: new Date().toISOString(),
            comment: comment || 'Rejected'
          }
        ];
        
        return {
          ...req,
          status: 'Rejected',
          history: newHistory
        } as ApprovalRequest;
      }
      return req;
    });
    
    setApprovalRequests(updated);
    storage.set('approval_requests', updated);
  };
  
  const getMyPendingApprovals = (userRole: string) => {
    return approvalRequests.filter(req => {
      const workflow = workflows.find(w => w.id === req.workflow_id);
      if (!workflow) return false;
      const currentStage = workflow.stages.find(s => s.order === req.current_stage);
      return req.status === 'Pending' && currentStage?.role === userRole;
    });
  };
  
  return (
    <WorkflowContext.Provider value={{
      workflows,
      approvalRequests,
      createApprovalRequest,
      approveRequest,
      rejectRequest,
      getMyPendingApprovals
    }}>
      {children}
    </WorkflowContext.Provider>
  );
}

export const useWorkflow = () => {
    const context = useContext(WorkflowContext);
    if (context === undefined) {
        throw new Error('useWorkflow must be used within a WorkflowProvider');
    }
    return context;
};

