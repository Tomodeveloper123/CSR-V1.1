import React from 'react';
import type { View } from '../App';
import CompanyLogoIcon from './icons/CompanyLogoIcon';

interface HeaderProps {
  activeView: View;
  setView: (view: View) => void;
}

const Header: React.FC<HeaderProps> = ({ activeView, setView }) => {
  const navLinkClasses = "px-4 py-2 rounded-md text-sm font-medium transition-colors duration-300";
  const activeLinkClasses = "bg-blue-600 text-white";
  const inactiveLinkClasses = "text-gray-700 hover:bg-gray-200";

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
        <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); setView('home'); }}
            className="flex items-center gap-3"
            aria-label="CSR Portal Homepage"
        >
            <CompanyLogoIcon className="h-8 w-8" />
            <span className="text-2xl font-bold text-blue-600">
                CSR Portal
            </span>
        </a>
        <div className="flex space-x-4">
          <button
            onClick={() => setView('home')}
            className={`${navLinkClasses} ${activeView === 'home' ? activeLinkClasses : inactiveLinkClasses}`}
          >
            Beranda
          </button>
          <button
            onClick={() => setView('login')}
            className={`${navLinkClasses} ${activeView === 'login' ? activeLinkClasses : inactiveLinkClasses}`}
          >
            Login
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;