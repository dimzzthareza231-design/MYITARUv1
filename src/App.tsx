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

      {/* Fallback Logout Button for Debugging/Emergency */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => {
            logout();
            toast.success('Anda telah logout');
          }}
          className="px-4 py-2 bg-rose-600 text-white rounded-lg text-sm font-bold hover:bg-rose-700 shadow-lg"
        >
          Logout ({currentUser.nama.split(' ')[0]})
        </button>
      </div>

      <main className="flex-1 flex flex-col min-w-0 relative w-full scroll-smooth">
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/modul" element={<ModuleLayout />}>
              <Route path="pendaftaran" element={<ErrorBoundary><Registration /></ErrorBoundary>} />
              <Route path="rekam-medis" element={<ErrorBoundary><MedicalRecords /></ErrorBoundary>} />
              <Route path="igd" element={<ErrorBoundary><Emergency /></ErrorBoundary>} />
              <Route path="rawat-jalan" element={<ErrorBoundary><Outpatient /></ErrorBoundary>} />
              <Route path="rawat-inap" element={<ErrorBoundary><BedManagement /></ErrorBoundary>} />
              <Route path="operasi" element={<ErrorBoundary><KamarOperasi /></ErrorBoundary>} />
              <Route path="laboratorium" element={<ErrorBoundary><Laboratorium /></ErrorBoundary>} />
              <Route path="radiologi" element={<ErrorBoundary><RadiologiDashboard /></ErrorBoundary>} />
              
              {/* Bridging Modules */}
              <Route path="bridging-hub" element={<ErrorBoundary><BridgingHub /></ErrorBoundary>} />
              <Route path="wa-gateway" element={<ErrorBoundary><WAGatewayBridging /></ErrorBoundary>} />
              <Route path="anjungan" element={<ErrorBoundary><AnjunganBridging /></ErrorBoundary>} />
              <Route path="api" element={<ErrorBoundary><ApiGatewayBridging /></ErrorBoundary>} />
              <Route path="vclaim" element={<ErrorBoundary><VClaimBridging /></ErrorBoundary>} />
              <Route path="vedika" element={<ErrorBoundary><VedikaBridging /></ErrorBoundary>} />
              <Route path="orthanc" element={<ErrorBoundary><OrthancBridging /></ErrorBoundary>} />
              <Route path="bpjs-emr" element={<ErrorBoundary><BPJSEMRBridging /></ErrorBoundary>} />
              <Route path="hfis" element={<ErrorBoundary><HFISBridging /></ErrorBoundary>} />
              <Route path="veronisa" element={<ErrorBoundary><VeronisaBridging /></ErrorBoundary>} />
              <Route path="satu-sehat" element={<ErrorBoundary><SatuSehatBridging /></ErrorBoundary>} />
              <Route path="sertisign" element={<ErrorBoundary><SertisignBridging /></ErrorBoundary>} />
              
              <Route path="sdm" element={<ErrorBoundary><ManajemenSDM /></ErrorBoundary>} />
              <Route path="inventory" element={<ErrorBoundary><InventoryManagement /></ErrorBoundary>} />
              <Route path="mutu" element={<ErrorBoundary><PatientSafety /></ErrorBoundary>} />
              <Route path="apotek-ralan" element={<ErrorBoundary><Pharmacy /></ErrorBoundary>} />
              <Route path="apotek-ranap" element={<ErrorBoundary><Pharmacy /></ErrorBoundary>} />
              <Route path="stok-obat" element={<ErrorBoundary><Pharmacy /></ErrorBoundary>} />
              <Route path="kasir" element={<ErrorBoundary><Billing /></ErrorBoundary>} />
              <Route path="bpjs-klaim" element={<ErrorBoundary><BPJSModule /></ErrorBoundary>} />
              <Route path="laporan" element={<ErrorBoundary><AnalyticsDashboard /></ErrorBoundary>} />
              <Route path="bpjs" element={<ErrorBoundary><BPJSModule /></ErrorBoundary>} />
              <Route path="kemenkes" element={<ErrorBoundary><SatuSehatIntegration /></ErrorBoundary>} />
              <Route path="integrasi" element={<ErrorBoundary><ApiManagementSystem /></ErrorBoundary>} />
              <Route path="panduan" element={<ErrorBoundary><PanduanModule /></ErrorBoundary>} />
              <Route path="pengaturan-rs" element={<ErrorBoundary><PengaturanRS /></ErrorBoundary>} />
              <Route path="notifikasi" element={<ErrorBoundary><NotificationPreferences /></ErrorBoundary>} />
              <Route path="profile" element={<ErrorBoundary><Profile /></ErrorBoundary>} />
              <Route path="security" element={<ErrorBoundary><AuthManagement /></ErrorBoundary>} />
              <Route path="audit" element={<ErrorBoundary><AuditTrail /></ErrorBoundary>} />
              <Route path="backup" element={<ErrorBoundary><BackupManagement /></ErrorBoundary>} />
              <Route path="monitoring" element={<ErrorBoundary><MonitoringSystem /></ErrorBoundary>} />
              <Route path="triase" element={<ErrorBoundary><ModulTriase /></ErrorBoundary>} />
              <Route path="jkn-mobile" element={<ErrorBoundary><JKNMobile /></ErrorBoundary>} />
              <Route path="user-management" element={<ErrorBoundary><UserManagement /></ErrorBoundary>} />
              <Route path="poli" element={<ErrorBoundary><PoliPelayanan /></ErrorBoundary>} />
              <Route path="display-antrian" element={<ErrorBoundary><DisplayAntrianPoli /></ErrorBoundary>} />
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
