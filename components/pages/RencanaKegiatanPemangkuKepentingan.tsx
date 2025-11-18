import React, { useState, useEffect, useCallback } from 'react';
import PencilIcon from '../icons/PencilIcon';
import TrashIcon from '../icons/TrashIcon';
import { getRencanaKegiatan, addRencanaKegiatan, updateRencanaKegiatan, deleteRencanaKegiatan, getProgramCSR } from '../../services/database';
import type { RencanaKegiatan, ProgramCSR } from '../../types';

type KegiatanData = Omit<RencanaKegiatan, 'id'>;

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

const RencanaKegiatanPemangkuKepentingan: React.FC = () => {
    const [data, setData] = useState<RencanaKegiatan[]>([]);
    const [programCSRList, setProgramCSRList] = useState<ProgramCSR[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<RencanaKegiatan | null>(null);
    const [itemToConfirmDelete, setItemToConfirmDelete] = useState<RencanaKegiatan | null>(null);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const [rencanaResult, programsResult] = await Promise.all([
                getRencanaKegiatan(),
                getProgramCSR()
            ]);
            setData(rencanaResult);
            setProgramCSRList(programsResult);
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

    const handleOpenModal = (item: RencanaKegiatan | null) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setEditingItem(null);
        setIsModalOpen(false);
    };

    const handleSave = async (formData: KegiatanData & { id?: number }) => {
        setIsSubmitting(true);
        try {
            if (formData.id) {
                await updateRencanaKegiatan(formData.id, formData);
                showToast('Rencana kegiatan berhasil diperbarui.');
            } else {
                await addRencanaKegiatan(formData);
                showToast('Rencana kegiatan berhasil ditambahkan.');
            }
            await loadData();
        } catch (error) {
            console.error("Failed to save data:", error);
            showToast('Gagal menyimpan rencana kegiatan.');
        } finally {
            setIsSubmitting(false);
            handleCloseModal();
        }
    };

    const handleDeleteRequest = (item: RencanaKegiatan) => {
        handleCloseModal();
        setItemToConfirmDelete(item);
    };

    const handleConfirmDelete = async (id: number) => {
        setIsSubmitting(true);
        try {
            await deleteRencanaKegiatan(id);
            showToast('Rencana kegiatan berhasil dihapus.');
            await loadData();
        } catch (error) {
            console.error("Failed to delete data:", error);
            showToast('Gagal menghapus rencana kegiatan.');
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
                <h1 className="text-3xl font-bold text-gray-800">Rencana Kegiatan Pemangku Kepentingan</h1>
                <button
                    onClick={() => handleOpenModal(null)}
                    className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Tambah Rencana Baru
                </button>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Pemangku Kepentingan</th>
                            <th scope="col" className="px-6 py-3">Program Terkait</th>
                            <th scope="col" className="px-6 py-3">Bentuk Kegiatan</th>
                            <th scope="col" className="px-6 py-3">Tujuan</th>
                            <th scope="col" className="px-6 py-3">Frekuensi</th>
                            <th scope="col" className="px-6 py-3">Periode</th>
                            <th scope="col" className="px-6 py-3">Anggaran</th>
                            <th scope="col" className="px-6 py-3 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className={`transition-opacity duration-300 ${isSubmitting ? 'opacity-50' : 'opacity-100'}`}>
                        {loading ? (
                            <tr><td colSpan={8} className="text-center py-4">Memuat data...</td></tr>
                        ) : data.length > 0 ? (
                            data.map(item => (
                                <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{item.pemangkuKepentingan}</td>
                                    <td className="px-6 py-4">{item.programTerkait}</td>
                                    <td className="px-6 py-4">{item.bentukKegiatan}</td>
                                    <td className="px-6 py-4">{item.tujuanKegiatan}</td>
                                    <td className="px-6 py-4">{item.frekuensi}</td>
                                    <td className="px-6 py-4">{item.periode}</td>
                                    <td className="px-6 py-4 font-medium">{formatCurrency(item.anggaran)}</td>
                                    <td className="px-6 py-4 flex justify-center items-center">
                                        <button onClick={() => handleOpenModal(item)} className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-full transition-colors disabled:cursor-not-allowed" title="Ubah" disabled={isSubmitting}><PencilIcon /></button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan={8} className="text-center py-10 text-gray-500">Tidak ada data rencana kegiatan.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <DataModal
                    item={editingItem}
                    programs={programCSRList}
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
    item: RencanaKegiatan | null;
    programs: ProgramCSR[];
    onSave: (data: KegiatanData & { id?: number }) => void;
    onClose: () => void;
    onDeleteRequest: (item: RencanaKegiatan) => void;
    isSubmitting: boolean;
}

const DataModal: React.FC<ModalProps> = ({ item, programs, onSave, onClose, onDeleteRequest, isSubmitting }) => {
    const [formData, setFormData] = useState({
        pemangkuKepentingan: item?.pemangkuKepentingan || '',
        programTerkait: item?.programTerkait || '',
        bentukKegiatan: item?.bentukKegiatan || '',
        tujuanKegiatan: item?.tujuanKegiatan || '',
        frekuensi: item?.frekuensi || '',
        periode: item?.periode || '',
        anggaran: item?.anggaran || 0,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            [name]: type === 'number' ? parseFloat(value) || 0 : value 
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
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">{item ? 'Ubah Rencana Kegiatan' : 'Tambah Rencana Kegiatan Baru'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="pemangkuKepentingan" className="block text-sm font-medium text-gray-700">Pemangku Kepentingan</label>
                            <input type="text" id="pemangkuKepentingan" name="pemangkuKepentingan" value={formData.pemangkuKepentingan} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                        </div>
                        <div>
                            <label htmlFor="programTerkait" className="block text-sm font-medium text-gray-700">Program CSR Terkait</label>
                            <select
                                id="programTerkait"
                                name="programTerkait"
                                value={formData.programTerkait}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            >
                                <option value="" disabled>Pilih program...</option>
                                {programs.map(program => (
                                    <option key={program.id} value={program.namaProgram}>
                                        {program.namaProgram} ({program.nomorProgram})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="bentukKegiatan" className="block text-sm font-medium text-gray-700">Bentuk Kegiatan</label>
                        <input type="text" id="bentukKegiatan" name="bentukKegiatan" value={formData.bentukKegiatan} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                    </div>
                     <div>
                        <label htmlFor="tujuanKegiatan" className="block text-sm font-medium text-gray-700">Tujuan Kegiatan</label>
                        <textarea id="tujuanKegiatan" name="tujuanKegiatan" value={formData.tujuanKegiatan} onChange={handleChange} required rows={3} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label htmlFor="frekuensi" className="block text-sm font-medium text-gray-700">Frekuensi</label>
                            <input type="text" id="frekuensi" name="frekuensi" value={formData.frekuensi} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                        </div>
                        <div>
                            <label htmlFor="periode" className="block text-sm font-medium text-gray-700">Periode</label>
                            <input type="text" id="periode" name="periode" value={formData.periode} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                        </div>
                        <div>
                            <label htmlFor="anggaran" className="block text-sm font-medium text-gray-700">Anggaran</label>
                            <input type="number" id="anggaran" name="anggaran" value={formData.anggaran} onChange={handleChange} required placeholder="Contoh: 15000000" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                             {formData.anggaran > 0 && (
                                <p className="mt-1 text-xs text-gray-500">
                                    Akan ditampilkan sebagai: {formatCurrency(formData.anggaran)}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="flex justify-between items-center gap-4 pt-4">
                        <div>
                            {item && (
                                <button
                                    type="button"
                                    onClick={handleDeleteClick}
                                    disabled={isSubmitting}
                                    className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                                    title="Hapus Rencana"
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
    item: RencanaKegiatan;
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
                    Apakah Anda yakin ingin menghapus rencana untuk <strong className="text-gray-800">"{item.pemangkuKepentingan}"</strong> terkait program <strong className="text-gray-800">"{item.programTerkait}"</strong>? Tindakan ini tidak dapat diurungkan.
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

export default RencanaKegiatanPemangkuKepentingan;