import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './Sidebar';
import DashboardHome from './pages/DashboardHome';
import CommunityDevelopment from './pages/CommunityDevelopment';
import MonitoringEvaluation from './pages/MonitoringEvaluation';
import Reports from './pages/Reports';
import UserManagement from './pages/UserManagement';
import OrganisasiCSR from './pages/OrganisasiCSR';
import TahunFiskalCSR from './pages/TahunFiskalCSR';
import ProgramCSR from './pages/ProgramCSR';
import PilarCSR from './pages/PilarCSR';
import SDGs from './pages/SDGs';
import KuadranPemangkuKepentingan from './pages/KuadranPemangkuKepentingan';
import ProfilPemangkuKepentingan from './pages/ProfilPemangkuKepentingan';
import RencanaKegiatanPemangkuKepentingan from './pages/RencanaKegiatanPemangkuKepentingan';
import LihatDatabase from './pages/LihatDatabase';
import DatabaseSchema from './pages/DatabaseSchema';
import BackupSQL from './pages/BackupSQL'; // Import the new component
import TingkatKemungkinanRisikoCSR from './pages/TingkatKemungkinanRisikoCSR';
import DampakRisikoCSR from './pages/DampakRisikoCSR';
import TingkatRisikoCSR from './pages/TingkatRisikoCSR';
import TipePemangkuKepentinganPage from './pages/TipePemangkuKepentingan';
import PelaksanaanKegiatanPemangkuKepentingan from './pages/PelaksanaanKegiatanPemangkuKepentingan';
import ImageEditor from './pages/ImageEditor';
import VideoGenerator from './pages/VideoGenerator';
import { getFiscalYears, addFiscalYear, updateFiscalYear, deleteFiscalYear, setActiveFiscalYear } from '../services/database';
import type { FiscalYear } from '../types';


export type Page = 
  | 'Dasbor CSR'
  | 'Data Induk'
  | 'Organisasi CSR'
  | 'Tahun Fiskal CSR'
  | 'Program CSR'
  | 'Pilar CSR'
  | 'SDGs'
  | 'Tipe Pemangku Kepentingan'
  | 'Manajemen Risiko'
  | 'Pemangku Kepentingan'
  | 'Profil Pemangku Kepentingan'
  | 'Matriks Pemangku Kepentingan'
  | 'Rencana Kegiatan Pemangku Kepentingan'
  | 'Pelaksanaan Kegiatan Pemangku Kepentingan'
  | 'Tingkat Kemungkinan Risiko CSR'
  | 'Dampak Risiko CSR'
  | 'Tingkat Risiko CSR'
  | 'Utilitas Database' // New Parent Menu
  | 'Visualisasi Database' // Renamed
  | 'Skema Database MySQL'
  | 'Backup SQL' // New Page
  | 'AI Kreatif' // New Parent Menu
  | 'Editor Gambar AI'
  | 'Generator Video AI'
  | 'Pengembangan Masyarakat'
  | 'Pengawasan dan Evaluasi'
  | 'Laporan'
  | 'Manajemen Pengguna';

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [activePage, setActivePage] = useState<Page>('Dasbor CSR');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [fiscalYears, setFiscalYears] = useState<FiscalYear[]>([]);
  const [isLoadingFiscalYears, setIsLoadingFiscalYears] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(prev => !prev);
  };

  const fetchFiscalYears = useCallback(async () => {
    try {
        setIsLoadingFiscalYears(true);
        const data = await getFiscalYears();
        setFiscalYears(data);
    } catch (error) {
        console.error("Failed to fetch fiscal years:", error);
    } finally {
        setIsLoadingFiscalYears(false);
    }
  }, []);

  useEffect(() => {
    fetchFiscalYears();
  }, [fetchFiscalYears]);
  
  const activeFiscalYear = fiscalYears.find(fy => fy.isActive) || null;

  const handleSetActive = async (id: number) => {
    await setActiveFiscalYear(id);
    await fetchFiscalYears();
  };

  const handleSaveFiscalYear = async (yearData: Omit<FiscalYear, 'id' | 'isActive'> & { id?: number }) => {
    if (yearData.id) {
        await updateFiscalYear(yearData.id, yearData);
    } else {
        await addFiscalYear(yearData);
    }
    await fetchFiscalYears();
  };

  const handleDeleteFiscalYear = async (id: number) => {
    const res = await deleteFiscalYear(id);
    if (res.success) {
        await fetchFiscalYears();
    } else {
        alert(res.message); // Simple alert for error feedback
    }
  };


  const renderContent = () => {
    switch (activePage) {
      case 'Dasbor CSR':
        return <DashboardHome activeFiscalYear={activeFiscalYear} />;
      case 'Organisasi CSR':
        return <OrganisasiCSR />;
      case 'Tahun Fiskal CSR':
        return <TahunFiskalCSR 
            fiscalYears={fiscalYears} 
            loading={isLoadingFiscalYears}
            onSetActive={handleSetActive}
            onSave={handleSaveFiscalYear}
            onDelete={handleDeleteFiscalYear}
        />;
      case 'Program CSR':
        return <ProgramCSR activeFiscalYear={activeFiscalYear} />;
      case 'Pilar CSR':
        return <PilarCSR />;
      case 'SDGs':
        return <SDGs />;
      case 'Tipe Pemangku Kepentingan':
        return <TipePemangkuKepentinganPage />;
      case 'Profil Pemangku Kepentingan':
        return <ProfilPemangkuKepentingan />;
      case 'Matriks Pemangku Kepentingan':
        return <KuadranPemangkuKepentingan />;
      case 'Rencana Kegiatan Pemangku Kepentingan':
        return <RencanaKegiatanPemangkuKepentingan />;
      case 'Pelaksanaan Kegiatan Pemangku Kepentingan':
        return <PelaksanaanKegiatanPemangkuKepentingan />;
      case 'Tingkat Kemungkinan Risiko CSR':
        return <TingkatKemungkinanRisikoCSR />;
      case 'Dampak Risiko CSR':
        return <DampakRisikoCSR />;
      case 'Tingkat Risiko CSR':
        return <TingkatRisikoCSR />;
      case 'Pengembangan Masyarakat':
        return <CommunityDevelopment />;
      case 'Pengawasan dan Evaluasi':
        return <MonitoringEvaluation />;
      case 'Laporan':
        return <Reports />;
      case 'Visualisasi Database':
        return <LihatDatabase />;
      case 'Skema Database MySQL':
        return <DatabaseSchema />;
      case 'Backup SQL':
        return <BackupSQL />;
      case 'Editor Gambar AI':
        return <ImageEditor />;
      case 'Generator Video AI':
        return <VideoGenerator />;
      case 'Manajemen Pengguna':
        return <UserManagement />;
      default:
        return <DashboardHome activeFiscalYear={activeFiscalYear} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar 
        activePage={activePage} 
        setActivePage={setActivePage} 
        onLogout={onLogout}
        activeFiscalYear={activeFiscalYear} 
        isCollapsed={isSidebarCollapsed}
        toggleCollapse={toggleSidebar}
      />
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default Dashboard;