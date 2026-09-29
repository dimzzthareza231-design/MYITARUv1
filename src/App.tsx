import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { HospitalProvider, useHospital } from './contexts/HospitalContext';
import { AuditTrailProvider } from './contexts/AuditTrailContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { WorkflowProvider } from './contexts/WorkflowContext';
import { PatientFlowProvider } from './contexts/PatientFlowContext';
import { KeyboardShortcutsProvider } from './contexts/KeyboardShortcutsContext';
import { ToastProvider } from './contexts/ToastContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { UserManagement } from './components/Auth/UserManagement';
import { ProtectedRoute, withAuthorization } from './components/Auth/ProtectedRoute';
import { Login } from './components/Login';
import Dashboard from './components/Dashboard';
import ModuleLayout from './layouts/ModuleLayout';
import { GenericModuleContent } from './components/GenericModuleContent';
import ErrorBoundary from './components/ErrorBoundary';

// Existing Modules
import { Registration } from './components/Registration';
import { Emergency } from './components/Emergency';
import { Outpatient } from './components/Outpatient';
import { BedManagement } from './components/BedManagement';
import { KamarOperasi } from './components/KamarOperasi';
import { Laboratorium } from './components/Laboratorium';
import { RadiologiDashboard } from './components/Radiologi/RadiologiDashboard';
import { MedicalRecords } from './components/MedicalRecords';
import { ManajemenSDM } from './components/ManajemenSDM';
import { InventoryManagement } from './components/InventoryManagement';
import PatientFlowDashboard from './components/PatientFlowDashboard';
import { PatientSafety } from './components/Safety/PatientSafety';
import { Pharmacy } from './components/Pharmacy';
import { Billing } from './components/Billing';
import { BPJSModule } from './components/BPJS/BPJSModule';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import { SatuSehatIntegration } from './components/SatuSehatIntegration';
import { ApiManagementSystem } from './components/ApiManagement/ApiManagementSystem';
import { PanduanModule } from './components/Panduan/PanduanModule';
import NotificationPreferences from './components/NotificationPreferences';
import { Profile } from './components/Profile';
import { AuthManagement } from './components/Auth/AuthManagement';
import AuditTrail from './components/AuditTrail';
import { BackupManagement } from './components/Backup/BackupManagement';
import { MonitoringSystem } from './components/Monitoring/MonitoringSystem';
import ModulTriase from './components/ModulTriase';
import { PengaturanRS } from './components/Settings/PengaturanRS';
import { JKNMobile } from './components/JKNMobile/JKNMobile';
import { AntrianProvider } from "./contexts/AntrianContext";
import { PoliPelayanan } from "./components/Poli/PoliPelayanan";
import { DisplayAntrianPoli } from "./components/Poli/DisplayAntrianPoli";
import CommandPalette from './components/CommandPalette';
import { ICUMonitoring } from './components/ICU/ICUMonitoring';
import { RehabMedik } from './components/Rehab/RehabMedik';
import { GiziDiet } from './components/Gizi/GiziDiet';
import { Telemedicine } from './components/Telemed/Telemedicine';
import { PatientPortal } from './components/Portal/PatientPortal';
import MultiBranchSystem from './components/MultiBranch/MultiBranchSystem';
import { CRMManagement } from './components/CRM/CRMManagement';
import { BlueprintSystemView } from './components/Blueprint/BlueprintSystemView';

// Bridging Modules
import { BridgingHub } from './components/Bridging/BridgingHub';
import { VClaimBridging } from './components/Bridging/VClaimBridging';
import { SatuSehatBridging } from './components/Bridging/SatuSehatBridging';
import { WAGatewayBridging } from './components/Bridging/WAGatewayBridging';
import { AnjunganBridging } from './components/Bridging/AnjunganBridging';
import { HFISBridging } from './components/Bridging/HFISBridging';
import { VedikaBridging } from './components/Bridging/VedikaBridging';
import { VeronisaBridging } from './components/Bridging/VeronisaBridging';
import { BPJSEMRBridging } from './components/Bridging/BPJSEMRBridging';
import { SertisignBridging } from './components/Bridging/SertisignBridging';
import { OrthancBridging } from './components/Bridging/OrthancBridging';
import { ApiGatewayBridging } from './components/Bridging/ApiGatewayBridging';
import { CloudflareBridging } from './components/Bridging/CloudflareBridging';

function AppContent() {
  const { currentUser, logout, loading } = useAuth();
  const { isDarkMode } = useHospital();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const handleViewerBlock = () => {
      toast.error('Akun Google (Viewer Mode) tidak memiliki izin untuk menyimpan data.', {
        id: 'viewer-block-toast',
      });
    };
    window.addEventListener('viewer-mode-block', handleViewerBlock);
    return () => window.removeEventListener('viewer-mode-block', handleViewerBlock);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-white font-semibold text-sm">Memverifikasi Sesi Keamanan Firebase...</p>
        <p className="text-slate-400 text-xs mt-1">Menggunakan persistensi sesi cloud aman</p>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <>
        <Toaster position="top-right" />
        <Login />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-50 font-sans transition-colors duration-300 flex flex-col">
      <Toaster position="top-right" />
      <CommandPalette />

      <main className="flex-1 flex flex-col min-w-0 relative w-full scroll-smooth">
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/modul" element={<ModuleLayout />}>
              <Route path="pendaftaran" element={<ErrorBoundary><ProtectedRoute moduleId="pendaftaran"><Registration /></ProtectedRoute></ErrorBoundary>} />
              <Route path="rekam-medis" element={<ErrorBoundary><ProtectedRoute moduleId="rekam-medis"><MedicalRecords /></ProtectedRoute></ErrorBoundary>} />
              <Route path="igd" element={<ErrorBoundary><ProtectedRoute moduleId="igd"><Emergency /></ProtectedRoute></ErrorBoundary>} />
              <Route path="rawat-jalan" element={<ErrorBoundary><ProtectedRoute moduleId="rawat-jalan"><Outpatient /></ProtectedRoute></ErrorBoundary>} />
              <Route path="rawat-inap" element={<ErrorBoundary><ProtectedRoute moduleId="rawat-inap"><BedManagement /></ProtectedRoute></ErrorBoundary>} />
              <Route path="operasi" element={<ErrorBoundary><ProtectedRoute moduleId="operasi"><KamarOperasi /></ProtectedRoute></ErrorBoundary>} />
              <Route path="laboratorium" element={<ErrorBoundary><ProtectedRoute moduleId="laboratorium"><Laboratorium /></ProtectedRoute></ErrorBoundary>} />
              <Route path="radiologi" element={<ErrorBoundary><ProtectedRoute moduleId="radiologi"><RadiologiDashboard /></ProtectedRoute></ErrorBoundary>} />
              
              {/* Bridging Modules */}
              <Route path="bridging-hub" element={<ErrorBoundary><ProtectedRoute moduleId="bridging-hub"><BridgingHub /></ProtectedRoute></ErrorBoundary>} />
              <Route path="wa-gateway" element={<ErrorBoundary><ProtectedRoute moduleId="wa-gateway"><WAGatewayBridging /></ProtectedRoute></ErrorBoundary>} />
              <Route path="anjungan" element={<ErrorBoundary><ProtectedRoute moduleId="anjungan"><AnjunganBridging /></ProtectedRoute></ErrorBoundary>} />
              <Route path="api" element={<ErrorBoundary><ProtectedRoute moduleId="api"><ApiGatewayBridging /></ProtectedRoute></ErrorBoundary>} />
              <Route path="vclaim" element={<ErrorBoundary><ProtectedRoute moduleId="vclaim"><VClaimBridging /></ProtectedRoute></ErrorBoundary>} />
              <Route path="vedika" element={<ErrorBoundary><ProtectedRoute moduleId="vedika"><VedikaBridging /></ProtectedRoute></ErrorBoundary>} />
              <Route path="orthanc" element={<ErrorBoundary><ProtectedRoute moduleId="orthanc"><OrthancBridging /></ProtectedRoute></ErrorBoundary>} />
              <Route path="bpjs-emr" element={<ErrorBoundary><ProtectedRoute moduleId="bpjs-emr"><BPJSEMRBridging /></ProtectedRoute></ErrorBoundary>} />
              <Route path="hfis" element={<ErrorBoundary><ProtectedRoute moduleId="hfis"><HFISBridging /></ProtectedRoute></ErrorBoundary>} />
              <Route path="veronisa" element={<ErrorBoundary><ProtectedRoute moduleId="veronisa"><VeronisaBridging /></ProtectedRoute></ErrorBoundary>} />
              <Route path="satu-sehat" element={<ErrorBoundary><ProtectedRoute moduleId="satu-sehat"><SatuSehatBridging /></ProtectedRoute></ErrorBoundary>} />
              <Route path="sertisign" element={<ErrorBoundary><ProtectedRoute moduleId="sertisign"><SertisignBridging /></ProtectedRoute></ErrorBoundary>} />
              <Route path="cloudflare" element={<ErrorBoundary><ProtectedRoute moduleId="cloudflare"><CloudflareBridging /></ProtectedRoute></ErrorBoundary>} />
              
              <Route path="sdm" element={<ErrorBoundary><ProtectedRoute moduleId="sdm"><ManajemenSDM /></ProtectedRoute></ErrorBoundary>} />
              <Route path="inventory" element={<ErrorBoundary><ProtectedRoute moduleId="inventory"><InventoryManagement /></ProtectedRoute></ErrorBoundary>} />
              <Route path="mutu" element={<ErrorBoundary><ProtectedRoute moduleId="mutu"><PatientSafety /></ProtectedRoute></ErrorBoundary>} />
              <Route path="apotek-ralan" element={<ErrorBoundary><ProtectedRoute moduleId="apotek-ralan"><Pharmacy /></ProtectedRoute></ErrorBoundary>} />
              <Route path="apotek-ranap" element={<ErrorBoundary><ProtectedRoute moduleId="apotek-ranap"><Pharmacy /></ProtectedRoute></ErrorBoundary>} />
              <Route path="stok-obat" element={<ErrorBoundary><ProtectedRoute moduleId="stok-obat"><Pharmacy /></ProtectedRoute></ErrorBoundary>} />
              <Route path="kasir" element={<ErrorBoundary><ProtectedRoute moduleId="kasir"><Billing /></ProtectedRoute></ErrorBoundary>} />
              <Route path="bpjs-klaim" element={<ErrorBoundary><ProtectedRoute moduleId="bpjs-klaim"><BPJSModule /></ProtectedRoute></ErrorBoundary>} />
              <Route path="laporan" element={<ErrorBoundary><ProtectedRoute moduleId="laporan"><AnalyticsDashboard /></ProtectedRoute></ErrorBoundary>} />
              <Route path="bpjs" element={<ErrorBoundary><ProtectedRoute moduleId="vclaim"><BPJSModule /></ProtectedRoute></ErrorBoundary>} />
              <Route path="kemenkes" element={<ErrorBoundary><ProtectedRoute moduleId="satu-sehat"><SatuSehatIntegration /></ProtectedRoute></ErrorBoundary>} />
              <Route path="integrasi" element={<ErrorBoundary><ProtectedRoute moduleId="api"><ApiManagementSystem /></ProtectedRoute></ErrorBoundary>} />
              <Route path="blueprint" element={<ErrorBoundary><BlueprintSystemView /></ErrorBoundary>} />
              <Route path="panduan" element={<ErrorBoundary><ProtectedRoute moduleId="panduan"><PanduanModule /></ProtectedRoute></ErrorBoundary>} />
              <Route path="pengaturan-klinik" element={<ErrorBoundary><ProtectedRoute moduleId="pengaturan-klinik"><PengaturanRS /></ProtectedRoute></ErrorBoundary>} />
              <Route path="notifikasi" element={<ErrorBoundary><ProtectedRoute moduleId="notifikasi"><NotificationPreferences /></ProtectedRoute></ErrorBoundary>} />
              <Route path="profile" element={<ErrorBoundary><ProtectedRoute moduleId="profile"><Profile /></ProtectedRoute></ErrorBoundary>} />
              
              {/* Sensitive System & Security Routes */}
              <Route path="security" element={<ErrorBoundary><ProtectedRoute moduleId="security" allowedRoles={['super_admin', 'admin', 'it_support']}><AuthManagement /></ProtectedRoute></ErrorBoundary>} />
              <Route path="audit" element={<ErrorBoundary><ProtectedRoute moduleId="audit"><AuditTrail /></ProtectedRoute></ErrorBoundary>} />
              <Route path="backup" element={<ErrorBoundary><ProtectedRoute moduleId="backup" allowedRoles={['super_admin', 'admin', 'it_support']}><BackupManagement /></ProtectedRoute></ErrorBoundary>} />
              <Route path="monitoring" element={<ErrorBoundary><ProtectedRoute moduleId="monitoring" allowedRoles={['super_admin', 'admin', 'it_support', 'direksi']}><MonitoringSystem /></ProtectedRoute></ErrorBoundary>} />
              <Route path="user-management" element={<ErrorBoundary><ProtectedRoute moduleId="security" allowedRoles={['super_admin', 'admin', 'it_support']}><UserManagement /></ProtectedRoute></ErrorBoundary>} />

              <Route path="triase" element={<ErrorBoundary><ProtectedRoute moduleId="triase"><ModulTriase /></ProtectedRoute></ErrorBoundary>} />
              <Route path="jkn-mobile" element={<ErrorBoundary><ProtectedRoute moduleId="jkn-mobile"><JKNMobile /></ProtectedRoute></ErrorBoundary>} />
              <Route path="poli" element={<ErrorBoundary><ProtectedRoute moduleId="rawat-jalan"><PoliPelayanan /></ProtectedRoute></ErrorBoundary>} />
              <Route path="display-antrian" element={<ErrorBoundary><ProtectedRoute moduleId="pendaftaran"><DisplayAntrianPoli /></ProtectedRoute></ErrorBoundary>} />
              
              {/* Clinical & Patient Engagement Modules */}
              <Route path="icu" element={<ErrorBoundary><ProtectedRoute moduleId="rawat-inap"><ICUMonitoring /></ProtectedRoute></ErrorBoundary>} />
              <Route path="rehab" element={<ErrorBoundary><ProtectedRoute moduleId="rawat-jalan"><RehabMedik /></ProtectedRoute></ErrorBoundary>} />
              <Route path="gizi" element={<ErrorBoundary><ProtectedRoute moduleId="rawat-inap"><GiziDiet /></ProtectedRoute></ErrorBoundary>} />
              <Route path="telemedicine" element={<ErrorBoundary><ProtectedRoute moduleId="rawat-jalan"><Telemedicine /></ProtectedRoute></ErrorBoundary>} />
              <Route path="patient-portal" element={<ErrorBoundary><ProtectedRoute moduleId="pendaftaran"><PatientPortal /></ProtectedRoute></ErrorBoundary>} />
              <Route path="multi-branch" element={<ErrorBoundary><ProtectedRoute moduleId="pengaturan-klinik"><MultiBranchSystem /></ProtectedRoute></ErrorBoundary>} />
              <Route path="crm" element={<ErrorBoundary><ProtectedRoute moduleId="pendaftaran"><CRMManagement /></ProtectedRoute></ErrorBoundary>} />

              <Route path=":moduleId" element={<ErrorBoundary><GenericModuleContent /></ErrorBoundary>} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ErrorBoundary>
      </main>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <HospitalProvider>
            <AntrianProvider>
              <ToastProvider>
                <NotificationProvider>
                  <AuditTrailProvider>
                    <WorkflowProvider>
                      <PatientFlowProvider>
                        <KeyboardShortcutsProvider>
                          <ErrorBoundary>
                            <AppContent />
                          </ErrorBoundary>
                        </KeyboardShortcutsProvider>
                      </PatientFlowProvider>
                    </WorkflowProvider>
                  </AuditTrailProvider>
                </NotificationProvider>
              </ToastProvider>
            </AntrianProvider>
          </HospitalProvider>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
