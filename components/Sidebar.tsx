import React, { useState, useEffect } from 'react';
import type { Page } from './Dashboard';
import type { FiscalYear } from '../types';
import DashboardIcon from './icons/DashboardIcon';
import DatabaseIcon from './icons/DatabaseIcon';
import UsersIcon from './icons/UsersIcon';
import BuildingLibraryIcon from './icons/BuildingLibraryIcon';
import ClipboardListIcon from './icons/ClipboardListIcon';
import ChartBarIcon from './icons/ChartBarIcon';
import LogoutIcon from './icons/LogoutIcon';
import ChevronDownIcon from './icons/ChevronDownIcon';
import ShieldExclamationIcon from './icons/ShieldExclamationIcon';
import ChevronDoubleLeftIcon from './icons/ChevronDoubleLeftIcon';
import ChevronDoubleRightIcon from './icons/ChevronDoubleRightIcon';
import SparklesIcon from './icons/SparklesIcon';
import DatabaseStatus from './DatabaseStatus';


interface SidebarProps {
  activePage: Page;
  setActivePage: (page: Page) => void;
  onLogout: () => void;
  activeFiscalYear: FiscalYear | null;
  isCollapsed: boolean;
  toggleCollapse: () => void;
}

interface SubMenuItem {
    name: Page;
    submenus?: SubMenuItem[];
}

interface MenuItem {
    name: Page;
    icon: React.ReactNode;
    submenus?: SubMenuItem[];
}

const manajemenRisikoSubmenus: SubMenuItem[] = [
    { name: 'Tingkat Kemungkinan Risiko CSR' },
    { name: 'Dampak Risiko CSR' },
    { name: 'Tingkat Risiko CSR' },
];

const dataIndukSubmenus: SubMenuItem[] = [
    { name: 'Organisasi CSR' },
    { name: 'Tahun Fiskal CSR' },
    { name: 'Program CSR' },
    { name: 'Pilar CSR' },
    { name: 'SDGs' },
    { name: 'Tipe Pemangku Kepentingan' },
    { name: 'Manajemen Risiko', submenus: manajemenRisikoSubmenus },
];

const pemangkuKepentinganSubmenus: SubMenuItem[] = [
    { name: 'Profil Pemangku Kepentingan' },
    { name: 'Matriks Pemangku Kepentingan' },
    { name: 'Rencana Kegiatan Pemangku Kepentingan' },
    { name: 'Pelaksanaan Kegiatan Pemangku Kepentingan' },
];

const utilitasDatabaseSubmenus: SubMenuItem[] = [
    { name: 'Visualisasi Database' },
    { name: 'Skema Database MySQL' },
    { name: 'Backup SQL' },
];

const aiKreatifSubmenus: SubMenuItem[] = [
    { name: 'Editor Gambar AI' },
    { name: 'Generator Video AI' },
];

const menuItems: MenuItem[] = [
  { name: 'Dasbor CSR', icon: <DashboardIcon /> },
  { name: 'Data Induk', icon: <DatabaseIcon />, submenus: dataIndukSubmenus },
  { name: 'Pemangku Kepentingan', icon: <UsersIcon />, submenus: pemangkuKepentinganSubmenus },
  { name: 'Pengembangan Masyarakat', icon: <BuildingLibraryIcon /> },
  { name: 'Pengawasan dan Evaluasi', icon: <ClipboardListIcon /> },
  { name: 'Laporan', icon: <ChartBarIcon /> },
  { name: 'AI Kreatif', icon: <SparklesIcon />, submenus: aiKreatifSubmenus },
  { name: 'Utilitas Database', icon: <DatabaseIcon />, submenus: utilitasDatabaseSubmenus },
  { name: 'Manajemen Pengguna', icon: <UsersIcon /> },
];

const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage, onLogout, activeFiscalYear, isCollapsed, toggleCollapse }) => {
  const [openMenu, setOpenMenu] = useState<Page | null>('Data Induk');
  const [openSubMenu, setOpenSubMenu] = useState<Page | null>(null);

  useEffect(() => {
    if (isCollapsed) {
        setOpenMenu(null);
        setOpenSubMenu(null);
    }
  }, [isCollapsed]);

  const handleMenuClick = (item: MenuItem) => {
    if (isCollapsed) {
        if (item.submenus) {
            toggleCollapse();
            setTimeout(() => setOpenMenu(item.name), 300);
        } else {
            setActivePage(item.name);
        }
    } else {
        if (item.submenus) {
            setOpenMenu(openMenu === item.name ? null : item.name);
        } else {
            setActivePage(item.name);
        }
    }
  };

  return (
    <aside className={`bg-gray-800 text-white flex flex-col flex-shrink-0 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
      <div className="h-20 flex items-center justify-center p-6 border-b border-gray-700">
          {isCollapsed ? (
            <span className="h-8 w-8 text-white"><BuildingLibraryIcon /></span>
          ) : (
            <span className="text-2xl font-bold">CSR Portal</span>
          )}
      </div>
      <nav className="flex-1 px-2 py-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const isParentActive = item.submenus?.some(submenu => 
            submenu.name === activePage || submenu.submenus?.some(sub => sub.name === activePage)
          );
          const isMenuOpen = openMenu === item.name;

          return (
            <div key={item.name}>
              <button
                onClick={() => handleMenuClick(item)}
                className={`w-full flex items-center py-2.5 text-sm font-medium rounded-md transition-colors duration-200 text-left group relative ${isCollapsed ? 'justify-center' : 'px-4'} ${
                  (activePage === item.name || isParentActive)
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <div className="flex items-center">
                    <span className={`h-5 w-5 ${!isCollapsed ? 'mr-3' : ''}`}>{item.icon}</span>
                </div>
                {!isCollapsed && <span className="flex-1">{item.name}</span>}
                {!isCollapsed && item.submenus && (
                    <span className={`transform transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`}>
                        <ChevronDownIcon />
                    </span>
                )}
                {isCollapsed && (
                    <span className="absolute left-full ml-4 w-max px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-10">
                        {item.name}
                    </span>
                )}
              </button>
              {!isCollapsed && item.submenus && isMenuOpen && (
                 <div className="pl-4 mt-2 space-y-1">
                    {item.submenus.map(submenu => {
                        const isSubMenuOpen = openSubMenu === submenu.name;
                        const isSubMenuActive = submenu.submenus?.some(sub => sub.name === activePage);

                        return (
                            <div key={submenu.name}>
                                <button
                                    onClick={() => {
                                        if (submenu.submenus) {
                                            setOpenSubMenu(isSubMenuOpen ? null : submenu.name);
                                        } else {
                                            setActivePage(submenu.name);
                                        }
                                    }}
                                    className={`w-full flex items-center justify-between px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 text-left ${
                                        activePage === submenu.name || isSubMenuActive
                                        ? 'bg-gray-700 text-white'
                                        : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                                    }`}
                                >
                                    <div className="flex items-center">
                                        <span className="mr-3 h-1 w-1 bg-gray-500 rounded-full"></span>
                                       {submenu.name}
                                    </div>
                                    {submenu.submenus && (
                                        <span className={`transform transition-transform duration-200 ${isSubMenuOpen ? 'rotate-180' : ''}`}>
                                            <ChevronDownIcon />
                                        </span>
                                    )}
                                </button>
                                {submenu.submenus && isSubMenuOpen && (
                                    <div className="pl-4 mt-1 space-y-1">
                                        {submenu.submenus.map(subSubmenu => (
                                            <button
                                                key={subSubmenu.name}
                                                onClick={() => setActivePage(subSubmenu.name)}
                                                className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 text-left ${
                                                    activePage === subSubmenu.name
                                                    ? 'text-white bg-gray-600'
                                                    : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                                                }`}
                                            >
                                                <span className="mr-3 h-1 w-1 bg-gray-600 rounded-full"></span>
                                                {subSubmenu.name}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )
                    })}
                 </div>
              )}
            </div>
          );
        })}
      </nav>
      
      <div className="border-t border-gray-700">
        <DatabaseStatus
            isCollapsed={isCollapsed}
            onClick={() => setActivePage('Skema Database MySQL')}
        />
      </div>

      {!isCollapsed && (
        <div className="px-4 pb-2 border-t border-gray-700">
            <div className="py-4">
                <p className="text-xs text-gray-400 uppercase tracking-wider text-center mb-2">Tahun Fiskal Aktif</p>
                <p className="font-semibold text-center text-lg bg-gray-700 py-1 rounded-md">
                    {activeFiscalYear ? activeFiscalYear.tahunFiskal : 'Tidak Ada'}
                </p>
            </div>
        </div>
      )}

      <div className="p-4 border-t border-gray-700">
        <div className={`flex items-center mb-4 ${isCollapsed ? 'justify-center' : ''}`}>
            <img className={`h-10 w-10 rounded-full ${!isCollapsed ? 'mr-3' : ''}`} src="https://i.pravatar.cc/150?u=admin" alt="Admin User" />
            {!isCollapsed && (
                <div>
                    <p className="font-semibold text-sm">Admin</p>
                    <p className="text-xs text-gray-400">Administrator</p>
                </div>
            )}
        </div>
        <button
          onClick={onLogout}
          className={`w-full flex items-center py-2.5 text-sm font-medium rounded-md text-gray-300 hover:bg-red-600 hover:text-white transition-colors duration-200 group relative ${isCollapsed ? 'justify-center' : 'px-4'}`}
        >
          <span className={`h-5 w-5 ${!isCollapsed ? 'mr-3' : ''}`}><LogoutIcon /></span>
          {!isCollapsed && 'Logout'}
          {isCollapsed && (
             <span className="absolute left-full ml-4 w-max px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                Logout
            </span>
          )}
        </button>
      </div>

       <div className="p-2 border-t border-gray-700">
        <button
          onClick={toggleCollapse}
          className="w-full flex items-center justify-center p-2 text-sm font-medium rounded-md text-gray-400 hover:bg-gray-700 hover:text-white transition-colors duration-200"
        >
          {isCollapsed ? <ChevronDoubleRightIcon /> : <ChevronDoubleLeftIcon />}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;