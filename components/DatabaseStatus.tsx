import React from 'react';
import ServerStackIcon from './icons/ServerStackIcon';

interface DatabaseStatusProps {
    isCollapsed: boolean;
    onClick: () => void;
}

const DatabaseStatus: React.FC<DatabaseStatusProps> = ({ isCollapsed, onClick }) => {
    return (
        <button
            onClick={onClick}
            className={`w-full text-left hover:bg-gray-700 transition-colors group relative flex items-center ${isCollapsed ? 'justify-center py-4' : 'px-4 py-3'}`}
            title="Lihat skema database dan status koneksi"
        >
            <ServerStackIcon className="w-5 h-5 text-green-400 flex-shrink-0" />

            {!isCollapsed && (
                <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-gray-200 flex items-center">
                        Terhubung via API
                        <span className="ml-2 px-1.5 py-0.5 bg-blue-500 text-white text-[9px] font-bold rounded-sm leading-none">API</span>
                    </p>
                    <p className="text-xs text-gray-400">MySQL @ localhost:3306</p>
                </div>
            )}
            
            {isCollapsed && (
                <span className="absolute left-full ml-4 w-max px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                    Terhubung: MySQL @ localhost:3306
                </span>
            )}
        </button>
    );
};

export default DatabaseStatus;
