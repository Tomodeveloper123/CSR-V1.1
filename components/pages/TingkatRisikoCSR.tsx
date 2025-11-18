import React, { useState, useEffect, useCallback } from 'react';
import PencilIcon from '../icons/PencilIcon';
import TrashIcon from '../icons/TrashIcon';
import { getTingkatRisiko, addTingkatRisiko, updateTingkatRisiko, deleteTingkatRisiko } from '../../services/database';
import type { TingkatRisiko } from '../../types';

type RiskData = Omit<TingkatRisiko, 'id'>;

const TingkatRisikoCSR: React.FC = () => {
    const [data, setData] = useState<TingkatRisiko[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<TingkatRisiko | null>(null);
    const [itemToConfirmDelete, setItemToConfirmDelete] = useState<TingkatRisiko | null>(null);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const result = await getTingkatRisiko();
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

    const handleOpenModal = (item: TingkatRisiko | null) => {
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
                await updateTingkatRisiko(formData.id, formData);
                showToast('Data berhasil diperbarui.');
            } else {
                await addTingkatRisiko(formData);
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

    const handleDeleteRequest = (item: TingkatRisiko) => {
        handleCloseModal();
        setItemToConfirmDelete(item);
    };

    const handleConfirmDelete = async (id: number) => {
        setIsSubmitting(true);
        try {
            await deleteTingkatRisiko(id);
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
                <h1 className="text-3xl font-bold text-gray-800">Tingkat Risiko CSR</h1>
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
                            <th scope="col" className="px-6 py-3">Tingkat Risiko</th>
                            <th scope="col" className="px-6 py-3">Deskripsi</th>
                            <th scope="col" className="px-6 py-3">Warna</th>
                            <th scope="col" className="px-6 py-3 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className={`transition-opacity duration-300 ${isSubmitting ? 'opacity-50' : 'opacity-100'}`}>
                        {loading ? (
                            <tr><td colSpan={5} className="text-center py-4">Memuat data...</td></tr>
                        ) : data.length > 0 ? (
                            data.map(item => (
                                <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{item.level}</td>
                                    <td className="px-6 py-4 font-semibold text-gray-800">{item.tingkat}</td>
                                    <td className="px-6 py-4">{item.deskripsi}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className={`inline-block w-5 h-5 rounded-full border border-gray-300 ${item.warna}`}></span>
                                            <span className="font-mono text-xs">{item.warna}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 flex justify-center items-center space-x-2">
                                        <button onClick={() => handleOpenModal(item)} className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-full transition-colors disabled:cursor-not-allowed" title="Ubah" disabled={isSubmitting}><PencilIcon /></button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan={5} className="text-center py-10 text-gray-500">Tidak ada data.</td></tr>
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
    item: TingkatRisiko | null;
    onSave: (data: RiskData & { id?: number }) => void;
    onClose: () => void;
    onDeleteRequest: (item: TingkatRisiko) => void;
    isSubmitting: boolean;
}

const DataModal: React.FC<ModalProps> = ({ item, onSave, onClose, onDeleteRequest, isSubmitting }) => {
    const [formData, setFormData] = useState({
        level: item?.level || 0,
        tingkat: item?.tingkat || '',
        deskripsi: item?.deskripsi || '',
        warna: item?.warna || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">{item ? 'Ubah Data Tingkat Risiko' : 'Tambah Data Tingkat Risiko'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="level" className="block text-sm font-medium text-gray-700">Level</label>
                        <input type="number" id="level" name="level" value={formData.level} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                    </div>
                    <div>
                        <label htmlFor="tingkat" className="block text-sm font-medium text-gray-700">Tingkat Risiko</label>
                        <input type="text" id="tingkat" name="tingkat" value={formData.tingkat} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                    </div>
                    <div>
                        <label htmlFor="deskripsi" className="block text-sm font-medium text-gray-700">Deskripsi</label>
                        <textarea id="deskripsi" name="deskripsi" value={formData.deskripsi} onChange={handleChange} required rows={3} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                    </div>
                    <div>
                        <label htmlFor="warna" className="block text-sm font-medium text-gray-700">Warna (Kelas Tailwind)</label>
                        <input type="text" id="warna" name="warna" value={formData.warna} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Contoh: bg-red-500" />
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
    item: TingkatRisiko;
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
                    Apakah Anda yakin ingin menghapus data tingkat risiko <strong className="text-gray-800">"{item.level} - {item.tingkat}"</strong>? Tindakan ini tidak dapat diurungkan.
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

export default TingkatRisikoCSR;