import React, { useState, useEffect, useCallback } from 'react';
import PencilIcon from '../icons/PencilIcon';
import TrashIcon from '../icons/TrashIcon';
import { getProfilPemangkuKepentingan, addProfilPemangkuKepentingan, updateProfilPemangkuKepentingan, deleteProfilPemangkuKepentingan, getTipePemangkuKepentingan } from '../../services/database';
import type { ProfilPemangkuKepentingan, TipePemangkuKepentingan } from '../../types';

type ProfilData = Omit<ProfilPemangkuKepentingan, 'id'>;

const ProfilPemangkuKepentingan: React.FC = () => {
    const [data, setData] = useState<ProfilPemangkuKepentingan[]>([]);
    const [tipeList, setTipeList] = useState<TipePemangkuKepentingan[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<ProfilPemangkuKepentingan | null>(null);
    const [itemToConfirmDelete, setItemToConfirmDelete] = useState<ProfilPemangkuKepentingan | null>(null);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const [profilResult, tipeResult] = await Promise.all([
                getProfilPemangkuKepentingan(),
                getTipePemangkuKepentingan()
            ]);
            setData(profilResult);
            setTipeList(tipeResult);
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

    const handleOpenModal = (item: ProfilPemangkuKepentingan | null) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setEditingItem(null);
        setIsModalOpen(false);
    };

    const handleSave = async (formData: ProfilData & { id?: number }) => {
        setIsSubmitting(true);
        try {
            if (formData.id) {
                await updateProfilPemangkuKepentingan(formData.id, formData);
                showToast('Profil berhasil diperbarui.');
            } else {
                await addProfilPemangkuKepentingan(formData);
                showToast('Profil berhasil ditambahkan.');
            }
            await loadData();
        } catch (error) {
            console.error("Failed to save data:", error);
            showToast('Gagal menyimpan profil.');
        } finally {
            setIsSubmitting(false);
            handleCloseModal();
        }
    };

    const handleDeleteRequest = (item: ProfilPemangkuKepentingan) => {
        handleCloseModal();
        setItemToConfirmDelete(item);
    };

    const handleConfirmDelete = async (id: number) => {
        setIsSubmitting(true);
        try {
            await deleteProfilPemangkuKepentingan(id);
            showToast('Profil berhasil dihapus.');
            await loadData();
        } catch (error) {
            console.error("Failed to delete data:", error);
            showToast('Gagal menghapus profil.');
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
                <h1 className="text-3xl font-bold text-gray-800">Profil Pemangku Kepentingan</h1>
                <button
                    onClick={() => handleOpenModal(null)}
                    className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Tambah Profil Baru
                </button>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Nama</th>
                            <th scope="col" className="px-6 py-3">Kategori</th>
                            <th scope="col" className="px-6 py-3">Tipe</th>
                            <th scope="col" className="px-6 py-3">Deskripsi</th>
                            <th scope="col" className="px-6 py-3">Strategi Komunikasi</th>
                            <th scope="col" className="px-6 py-3 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className={`transition-opacity duration-300 ${isSubmitting ? 'opacity-50' : 'opacity-100'}`}>
                        {loading ? (
                            <tr><td colSpan={6} className="text-center py-4">Memuat data...</td></tr>
                        ) : data.length > 0 ? (
                            data.map(item => (
                                <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{item.nama}</td>
                                    <td className="px-6 py-4">{item.kategori}</td>
                                    <td className="px-6 py-4">{item.tipe}</td>
                                    <td className="px-6 py-4">{item.deskripsi}</td>
                                    <td className="px-6 py-4">{item.strategiKomunikasi}</td>
                                    <td className="px-6 py-4 flex justify-center items-center">
                                        <button onClick={() => handleOpenModal(item)} className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-full transition-colors disabled:cursor-not-allowed" title="Ubah" disabled={isSubmitting}><PencilIcon /></button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan={6} className="text-center py-10 text-gray-500">Tidak ada data profil.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <DataModal
                    item={editingItem}
                    tipeList={tipeList}
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
    item: ProfilPemangkuKepentingan | null;
    tipeList: TipePemangkuKepentingan[];
    onSave: (data: ProfilData & { id?: number }) => void;
    onClose: () => void;
    onDeleteRequest: (item: ProfilPemangkuKepentingan) => void;
    isSubmitting: boolean;
}

const DataModal: React.FC<ModalProps> = ({ item, tipeList, onSave, onClose, onDeleteRequest, isSubmitting }) => {
    const [formData, setFormData] = useState<ProfilData>({
        nama: item?.nama || '',
        kategori: item?.kategori || 'Eksternal',
        tipe: item?.tipe || (tipeList[0]?.namaTipe || ''),
        deskripsi: item?.deskripsi || '',
        strategiKomunikasi: item?.strategiKomunikasi || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value as any }));
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
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">{item ? 'Ubah Profil' : 'Tambah Profil Baru'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="nama" className="block text-sm font-medium text-gray-700">Nama Pemangku Kepentingan</label>
                        <input type="text" id="nama" name="nama" value={formData.nama} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Kategori</label>
                            <div className="mt-2 flex space-x-6 items-center pt-2">
                                <div className="flex items-center">
                                    <input
                                        id="kategori-internal"
                                        name="kategori"
                                        type="radio"
                                        value="Internal"
                                        checked={formData.kategori === 'Internal'}
                                        onChange={handleChange}
                                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                                    />
                                    <label htmlFor="kategori-internal" className="ml-2 block text-sm font-medium text-gray-700">
                                        Internal
                                    </label>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        id="kategori-eksternal"
                                        name="kategori"
                                        type="radio"
                                        value="Eksternal"
                                        checked={formData.kategori === 'Eksternal'}
                                        onChange={handleChange}
                                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                                    />
                                    <label htmlFor="kategori-eksternal" className="ml-2 block text-sm font-medium text-gray-700">
                                        Eksternal
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div>
                           <label htmlFor="tipe" className="block text-sm font-medium text-gray-700">Tipe</label>
                            <select id="tipe" name="tipe" value={formData.tipe} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                                {tipeList.length === 0 ? (
                                    <option>Memuat...</option>
                                ) : (
                                    tipeList.map(tipe => (
                                        <option key={tipe.id} value={tipe.namaTipe}>{tipe.namaTipe}</option>
                                    ))
                                )}
                            </select>
                        </div>
                    </div>
                     <div>
                        <label htmlFor="deskripsi" className="block text-sm font-medium text-gray-700">Deskripsi</label>
                        <textarea id="deskripsi" name="deskripsi" value={formData.deskripsi} onChange={handleChange} required rows={3} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                    </div>
                     <div>
                        <label htmlFor="strategiKomunikasi" className="block text-sm font-medium text-gray-700">Strategi Komunikasi</label>
                        <textarea id="strategiKomunikasi" name="strategiKomunikasi" value={formData.strategiKomunikasi} onChange={handleChange} required rows={3} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                    </div>
                    <div className="flex justify-between items-center gap-4 pt-4">
                        <div>
                            {item && (
                                <button
                                    type="button"
                                    onClick={handleDeleteClick}
                                    disabled={isSubmitting}
                                    className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                                    title="Hapus Profil"
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
    item: ProfilPemangkuKepentingan;
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
                    Apakah Anda yakin ingin menghapus profil <strong className="text-gray-800">"{item.nama}"</strong>? Tindakan ini tidak dapat diurungkan.
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

export default ProfilPemangkuKepentingan;