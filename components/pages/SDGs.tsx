import React, { useState, useEffect } from 'react';
import { getSDGs, updateSDG } from '../../services/database';
import type { SDG } from '../../types';
import ChevronDownIcon from '../icons/ChevronDownIcon';
import ChevronLeftIcon from '../icons/ChevronLeftIcon';
import ChevronRightIcon from '../icons/ChevronRightIcon';
import PencilIcon from '../icons/PencilIcon';

// A single card component for an SDG
const SDGCard: React.FC<{ sdg: SDG; onEdit: (sdg: SDG) => void }> = ({ sdg, onEdit }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 relative">
            <div className="p-6 flex items-start gap-6">
                <img src={sdg.logo} alt={`Logo ${sdg.goal}`} className="w-24 h-24 flex-shrink-0 rounded-md object-contain" />
                <div className="flex-grow">
                    <h3 className="text-xl font-bold text-gray-800">{sdg.goal}</h3>
                    <p className="text-gray-600 mt-2">{sdg.description}</p>
                </div>
                <div className="flex flex-col gap-2">
                    <button
                        onClick={() => onEdit(sdg)}
                        className="p-2 rounded-full hover:bg-blue-100 text-blue-600 hover:text-blue-800 transition-colors"
                        aria-label="Ubah data tujuan"
                    >
                        <PencilIcon />
                    </button>
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                        aria-label={isExpanded ? 'Sembunyikan detail' : 'Tampilkan detail'}
                    >
                        <span className={`transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                            <ChevronDownIcon />
                        </span>
                    </button>
                </div>
            </div>
            
            {isExpanded && (
                <div className="px-6 pb-6 bg-gray-50 animate-fade-in-down">
                    <h4 className="text-md font-semibold text-gray-700 mb-3">Indikator Capaian:</h4>
                    <ul className="list-disc list-inside space-y-2 text-gray-600">
                        {sdg.indicators.map((indicator, index) => (
                            <li key={index}>{indicator}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

// Skeleton loader for the card
const SDGCardSkeleton: React.FC = () => (
    <div className="bg-white rounded-lg shadow-md p-6 flex items-start gap-6 animate-pulse">
        <div className="w-24 h-24 bg-gray-300 rounded-md flex-shrink-0"></div>
        <div className="flex-grow space-y-3">
            <div className="h-6 bg-gray-300 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 rounded w-full"></div>
            <div className="h-4 bg-gray-300 rounded w-5/6"></div>
        </div>
    </div>
);

const PaginationControls: React.FC<{
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}> = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    return (
        <div className="mt-8 flex justify-center items-center space-x-4">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <ChevronLeftIcon />
                <span className="ml-2">Sebelumnya</span>
            </button>
            
            <span className="text-sm text-gray-600">
                Halaman <span className="font-bold">{currentPage}</span> dari <span className="font-bold">{totalPages}</span>
            </span>

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <span className="mr-2">Berikutnya</span>
                <ChevronRightIcon />
            </button>
        </div>
    );
};

interface SDGModalProps {
    sdg: SDG;
    onSave: (updatedSdg: SDG) => void;
    onClose: () => void;
}

const SDGEditModal: React.FC<SDGModalProps> = ({ sdg, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        goal: sdg.goal,
        logo: sdg.logo,
        description: sdg.description,
        indicators: sdg.indicators.join('\n'),
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const updatedSdg: SDG = {
            ...sdg,
            ...formData,
            indicators: formData.indicators.split('\n').filter(line => line.trim() !== ''),
        };
        onSave(updatedSdg);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 animate-fade-in">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Ubah Data Tujuan (Goal)</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="goal" className="block text-sm font-medium text-gray-700">Nama Tujuan</label>
                        <input
                            type="text" id="goal" name="goal" value={formData.goal} onChange={handleChange} required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>
                     <div>
                        <label htmlFor="logo" className="block text-sm font-medium text-gray-700">URL Logo</label>
                        <input
                            type="text" id="logo" name="logo" value={formData.logo} onChange={handleChange} required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>
                     <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Deskripsi</label>
                        <textarea
                            id="description" name="description" rows={3} value={formData.description} onChange={handleChange} required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="indicators" className="block text-sm font-medium text-gray-700">Indikator Capaian</label>
                        <textarea
                            id="indicators" name="indicators" rows={6} value={formData.indicators} onChange={handleChange} required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                        <p className="text-xs text-gray-500 mt-1">Satu indikator per baris.</p>
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="px-6 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors">
                            Batal
                        </button>
                        <button type="submit" className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                            Simpan Perubahan
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const SDGs: React.FC = () => {
    const [sdgs, setSdgs] = useState<SDG[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [editingSDG, setEditingSDG] = useState<SDG | null>(null);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const itemsPerPage = 10;

    useEffect(() => {
        const fetchSDGs = async () => {
            try {
                setLoading(true);
                const data = await getSDGs();
                setSdgs(data);
            } catch (error) {
                console.error("Failed to fetch SDGs:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSDGs();
    }, []);

    const showToast = (message: string) => {
        setToastMessage(message);
        setTimeout(() => {
            setToastMessage(null);
        }, 3000);
    };

    const handleOpenEditModal = (sdg: SDG) => {
        setEditingSDG(sdg);
    };

    const handleCloseEditModal = () => {
        setEditingSDG(null);
    };

    const handleSaveSDG = async (updatedSdg: SDG) => {
        try {
            await updateSDG(updatedSdg);
            setSdgs(prevSdgs => prevSdgs.map(s => s.id === updatedSdg.id ? updatedSdg : s));
            showToast('Data tujuan berhasil diperbarui.');
        } catch (error) {
            console.error('Failed to update SDG:', error);
            showToast('Gagal memperbarui data.');
        } finally {
            handleCloseEditModal();
        }
    };


    // Pagination Logic
    const totalPages = Math.ceil(sdgs.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sdgs.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div>
            {toastMessage && (
                <div role="alert" className="fixed top-24 right-6 z-50 rounded-lg bg-green-600 px-5 py-2 text-white shadow-xl animate-fade-in-down">
                <p className="text-sm font-medium">{toastMessage}</p>
                </div>
            )}
            <h1 className="text-3xl font-bold text-gray-800">SDGs (Sustainable Development Goals)</h1>
            <p className="mt-2 text-gray-600 mb-8">Kelola Tujuan Pembangunan Berkelanjutan (SDGs).</p>

            <div className="space-y-6">
                {loading ? (
                    <>
                        <SDGCardSkeleton />
                        <SDGCardSkeleton />
                        <SDGCardSkeleton />
                    </>
                ) : currentItems.length > 0 ? (
                    currentItems.map(sdg => (
                        <SDGCard key={sdg.id} sdg={sdg} onEdit={handleOpenEditModal} />
                    ))
                ) : (
                    <div className="text-center py-10 bg-white rounded-lg shadow-md">
                        <p className="text-gray-500">Gagal memuat data SDGs atau tidak ada data yang tersedia.</p>
                    </div>
                )}
            </div>

            {!loading && (
                <PaginationControls
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            )}

            {editingSDG && (
                <SDGEditModal 
                    sdg={editingSDG}
                    onSave={handleSaveSDG}
                    onClose={handleCloseEditModal}
                />
            )}
        </div>
    );
};

export default SDGs;