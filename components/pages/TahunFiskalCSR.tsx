import React, { useState } from 'react';
import PencilIcon from '../icons/PencilIcon';
import TrashIcon from '../icons/TrashIcon';
import type { FiscalYear } from '../../types';


const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(amount);
};

type FiscalYearFormData = Omit<FiscalYear, 'id' | 'isActive'> & { id?: number };

interface TahunFiskalCSRProps {
    fiscalYears: FiscalYear[];
    loading: boolean;
    onSetActive: (id: number) => Promise<void>;
    onSave: (data: FiscalYearFormData) => Promise<void>;
    onDelete: (id: number) => Promise<void>;
}


const TahunFiskalCSR: React.FC<TahunFiskalCSRProps> = ({ fiscalYears, loading, onSetActive, onSave, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingYear, setEditingYear] = useState<FiscalYear | null>(null);

  const handleOpenModal = (year: FiscalYear | null) => {
    setEditingYear(year);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingYear(null);
    setIsModalOpen(false);
  };
  
  const handleSave = async (yearData: FiscalYearFormData) => {
    await onSave(yearData);
    handleCloseModal();
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus tahun fiskal ini?')) {
        onDelete(id);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Tahun Fiskal CSR</h1>
        <button
            onClick={() => handleOpenModal(null)}
            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
            Tambah Tahun Fiskal Baru
        </button>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-md overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                    <th scope="col" className="px-6 py-3">Tahun Fiskal</th>
                    <th scope="col" className="px-6 py-3">Status</th>
                    <th scope="col" className="px-6 py-3">Tanggal Mulai</th>
                    <th scope="col" className="px-6 py-3">Tanggal Selesai</th>
                    <th scope="col" className="px-6 py-3">Total Anggaran</th>
                    <th scope="col" className="px-6 py-3 text-center">Aksi</th>
                </tr>
            </thead>
            <tbody>
                {loading ? (
                    <tr>
                        <td colSpan={6} className="text-center py-4">Memuat data...</td>
                    </tr>
                ) : (
                    fiscalYears.map(year => (
                        <tr key={year.id} className={`border-b ${year.isActive ? 'bg-blue-50' : 'bg-white'} hover:bg-gray-50`}>
                            <td className="px-6 py-4 font-medium text-gray-900">{year.tahunFiskal}</td>
                            <td className="px-6 py-4">
                                {year.isActive ? (
                                    <span className="px-2.5 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                                    Aktif
                                    </span>
                                ) : (
                                    <span className="px-2.5 py-1 text-xs font-semibold text-gray-800 bg-gray-100 rounded-full">
                                    Nonaktif
                                    </span>
                                )}
                            </td>
                            <td className="px-6 py-4">{year.tanggalMulai}</td>
                            <td className="px-6 py-4">{year.tanggalSelesai}</td>
                            <td className="px-6 py-4">{formatCurrency(year.totalAnggaran)}</td>
                            <td className="px-6 py-4 flex justify-center items-center space-x-2">
                               {!year.isActive && (
                                    <button 
                                        onClick={() => onSetActive(year.id)}
                                        className="text-xs px-3 py-1.5 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 transition-colors"
                                    >
                                        Jadikan Aktif
                                    </button>
                               )}
                               <button onClick={() => handleOpenModal(year)} className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-full transition-colors" title="Ubah">
                                    <PencilIcon />
                               </button>
                               <button 
                                    onClick={() => handleDelete(year.id)} 
                                    className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={year.isActive}
                                    title={year.isActive ? "Tidak dapat menghapus tahun fiskal yang aktif" : "Hapus"}
                                >
                                    <TrashIcon />
                               </button>
                            </td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
      </div>

      {isModalOpen && <FiscalYearModal year={editingYear} onSave={handleSave} onClose={handleCloseModal} />}
    </div>
  );
};

interface ModalProps {
    year: FiscalYear | null;
    onSave: (data: FiscalYearFormData) => void;
    onClose: () => void;
}

const FiscalYearModal: React.FC<ModalProps> = ({ year, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        tahunFiskal: year?.tahunFiskal || '',
        tanggalMulai: year?.tanggalMulai || '',
        tanggalSelesai: year?.tanggalSelesai || '',
        totalAnggaran: year?.totalAnggaran || 0,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) || 0 : value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...formData, id: year?.id });
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">{year ? 'Ubah Tahun Fiskal' : 'Tambah Tahun Fiskal Baru'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="tahunFiskal" className="block text-sm font-medium text-gray-700">Tahun Fiskal</label>
                        <input
                            type="text"
                            id="tahunFiskal"
                            name="tahunFiskal"
                            value={formData.tahunFiskal}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>
                     <div>
                        <label htmlFor="tanggalMulai" className="block text-sm font-medium text-gray-700">Tanggal Mulai</label>
                        <input
                            type="date"
                            id="tanggalMulai"
                            name="tanggalMulai"
                            value={formData.tanggalMulai}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>
                     <div>
                        <label htmlFor="tanggalSelesai" className="block text-sm font-medium text-gray-700">Tanggal Selesai</label>
                        <input
                            type="date"
                            id="tanggalSelesai"
                            name="tanggalSelesai"
                            value={formData.tanggalSelesai}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>
                     <div>
                        <label htmlFor="totalAnggaran" className="block text-sm font-medium text-gray-700">Total Anggaran CSR</label>
                        <input
                            type="number"
                            id="totalAnggaran"
                            name="totalAnggaran"
                            value={formData.totalAnggaran}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Simpan
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


export default TahunFiskalCSR;