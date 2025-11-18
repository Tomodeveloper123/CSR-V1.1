import React, { useState, useEffect, useCallback } from 'react';
import PencilIcon from '../icons/PencilIcon';
import TrashIcon from '../icons/TrashIcon';
import { getTingkatKemungkinanRisiko, addTingkatKemungkinanRisiko, updateTingkatKemungkinanRisiko, deleteTingkatKemungkinanRisiko } from '../../services/database';
import type { TingkatKemungkinanRisiko } from '../../types';

type RiskData = Omit<TingkatKemungkinanRisiko, 'id'>;

const TingkatKemungkinanRisikoCSR: React.FC = () => {
    const [data, setData] = useState<TingkatKemungkinanRisiko[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<TingkatKemungkinanRisiko | null>(null);
    const [itemToConfirmDelete, setItemToConfirmDelete] = useState<TingkatKemungkinanRisiko | null>(null);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const result = await getTingkatKemungkinanRisiko();
            setData(result);
        } catch (error) {
            console.error("Failed to fetch data:", error);
            showToast('Gagal memuat data.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const showToast = (message: string) => {
        setToastMessage(message);
        setTimeout(() => setToastMessage(null), 3000);
    };

    const handleOpenModal = (item: TingkatKemungkinanRisiko | null) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setEditingItem(null);
        setIsModalOpen(false);
    };

    const handleSave = async (formData: RiskData & { id?: number }) => {
        setIsSubmitting(true);
        try {
            if (formData.id) {
                await updateTingkatKemungkinanRisiko(formData.id, formData);
                showToast('Data berhasil diperbarui.');
            } else {
                await addTingkatKemungkinanRisiko(formData);
                showToast('Data berhasil ditambahkan.');
            }
            await loadData();
        } catch (error) {
            console.error("Failed to save data:", error);
            showToast('Gagal menyimpan data.');
        } finally {
            setIsSubmitting(false);
            handleCloseModal();
        }
    };

    const handleDeleteRequest = (item: TingkatKemungkinanRisiko) => {
        handleCloseModal();
        setItemToConfirmDelete(item);
    };

    const handleConfirmDelete = async (id: number) => {
        setIsSubmitting(true);
        try {
            await deleteTingkatKemungkinanRisiko(id);
            showToast('Data berhasil dihapus.');
            await loadData();
        } catch (error) {
            console.error("Failed to delete data:", error);
            showToast('Gagal menghapus data.');
        } finally {
            setIsSubmitting(false);
            setItemToConfirmDelete(null);
        }
    };

    return (
        <div>
            {toastMessage && (
                <div role="alert" className="fixed top-24 right-6 z-50 rounded-lg bg-green-600 px-5 py-2 text-white shadow-xl animate-fade-in-down">
                    <p className="text-sm font-medium">{toastMessage}</p>
                </div>
            )}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Tingkat Kemungkinan Risiko CSR</h1>
                <button
                    onClick={() => handleOpenModal(null)}
                    className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Tambah Baru
                </button>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Level</th>
                            <th scope="col" className="px-6 py-3">Keterangan</th>
                            <th scope="col" className="px-6 py-3">Persentase Kemungkinan</th>
                            <th scope="col" className="px-6 py-3 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className={`transition-opacity duration-300 ${isSubmitting ? 'opacity-50' : 'opacity-100'}`}>
                        {loading ? (
                            <tr><td colSpan={4} className="text-center py-4">Memuat data...</td></tr>
                        ) : data.length > 0 ? (
                            data.map(item => (
                                <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{item.level}</td>
                                    <td className="px-6 py-4">{item.keterangan}</td>
                                    <td className="px-6 py-4">{item.persentase}</td>
                                    <td className="px-6 py-4 flex justify-center items-center space-x-2">
                                        <button onClick={() => handleOpenModal(item)} className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-full transition-colors disabled:cursor-not-allowed" title="Ubah" disabled={isSubmitting}><PencilIcon /></button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan={4} className="text-center py-10 text-gray-500">Tidak ada data.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <DataModal
                    item={editingItem}
                    onSave={handleSave}
                    onClose={handleCloseModal}
                    onDeleteRequest={handleDeleteRequest}
                    isSubmitting={isSubmitting}
                />
            )}

            {itemToConfirmDelete && (
                <ConfirmationModal
                    item={itemToConfirmDelete}
                    onConfirmDelete={handleConfirmDelete}
                    onCancel={() => setItemToConfirmDelete(null)}
                    isSubmitting={isSubmitting}
                />
            )}
        </div>
    );
};

interface ModalProps {
    item: TingkatKemungkinanRisiko | null;
    onSave: (data: RiskData & { id?: number }) => void;
    onClose: () => void;
    onDeleteRequest: (item: TingkatKemungkinanRisiko) => void;
    isSubmitting: boolean;
}

const DataModal: React.FC<ModalProps> = ({ item, onSave, onClose, onDeleteRequest, isSubmitting }) => {
    const [formData, setFormData] = useState({
        level: item?.level || 0,
        keterangan: item?.keterangan || '',
        persentase: item?.persentase || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseInt(value, 10) || 0 : value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...formData, id: item?.id });
    };
    
    const handleDeleteClick = () => {
        if (item) {
            onDeleteRequest(item);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">{item ? 'Ubah Data' : 'Tambah Data Baru'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="level" className="block text-sm font-medium text-gray-700">Level</label>
                        <input type="number" id="level" name="level" value={formData.level} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                    </div>
                    <div>
                        <label htmlFor="keterangan" className="block text-sm font-medium text-gray-700">Keterangan</label>
                        <input type="text" id="keterangan" name="keterangan" value={formData.keterangan} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                    </div>
                    <div>
                        <label htmlFor="persentase" className="block text-sm font-medium text-gray-700">Persentase Kemungkinan</label>
                        <input type="text" id="persentase" name="persentase" value={formData.persentase} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Contoh: < 10%" />
                    </div>
                    <div className="flex justify-between items-center gap-4 pt-4">
                        <div>
                            {item && (
                                <button
                                    type="button"
                                    onClick={handleDeleteClick}
                                    disabled={isSubmitting}
                                    className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                                    title="Hapus Data"
                                >
                                    <TrashIcon />
                                    Hapus
                                </button>
                            )}
                        </div>
                        <div className="flex gap-4">
                             <button type="button" onClick={onClose} disabled={isSubmitting} className="px-6 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50">Batal</button>
                            <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-wait">{isSubmitting ? 'Menyimpan...' : 'Simpan'}</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

interface ConfirmationModalProps {
    item: TingkatKemungkinanRisiko;
    onConfirmDelete: (id: number) => void;
    onCancel: () => void;
    isSubmitting: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ item, onConfirmDelete, onCancel, isSubmitting }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md animate-fade-in-up">
                <h2 className="text-xl font-bold text-gray-800">Konfirmasi Penghapusan</h2>
                <p className="mt-4 text-gray-600">
                    Apakah Anda yakin ingin menghapus data level <strong className="text-gray-800">"{item.level} - {item.keterangan}"</strong>? Tindakan ini tidak dapat diurungkan.
                </p>
                <div className="flex justify-end gap-4 mt-8">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isSubmitting}
                        className="px-6 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
                    >
                        Batal
                    </button>
                    <button
                        type="button"
                        onClick={() => onConfirmDelete(item.id)}
                        disabled={isSubmitting}
                        className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-wait"
                    >
                        {isSubmitting ? 'Menghapus...' : 'Ya, Hapus'}
                    </button>
                </div>
            </div>
        </div>
    );
};


export default TingkatKemungkinanRisikoCSR;