import React, { useState, useEffect, useCallback } from 'react';
import PencilIcon from '../icons/PencilIcon';
import TrashIcon from '../icons/TrashIcon';
import { getPelaksanaanKegiatan, addPelaksanaanKegiatan, updatePelaksanaanKegiatan, deletePelaksanaanKegiatan, getRencanaKegiatan } from '../../services/database';
import type { PelaksanaanKegiatan, RencanaKegiatan } from '../../types';

type PelaksanaanData = Omit<PelaksanaanKegiatan, 'id'>;

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

const PelaksanaanKegiatanPemangkuKepentingan: React.FC = () => {
    const [data, setData] = useState<PelaksanaanKegiatan[]>([]);
    const [rencanaList, setRencanaList] = useState<RencanaKegiatan[]>([]);
    const [rencanaMap, setRencanaMap] = useState<Map<number, RencanaKegiatan>>(new Map());
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<PelaksanaanKegiatan | null>(null);
    const [itemToConfirmDelete, setItemToConfirmDelete] = useState<PelaksanaanKegiatan | null>(null);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const [pelaksanaanResult, rencanaResult] = await Promise.all([
                getPelaksanaanKegiatan(),
                getRencanaKegiatan()
            ]);
            setData(pelaksanaanResult);
            setRencanaList(rencanaResult);
            setRencanaMap(new Map(rencanaResult.map(r => [r.id, r])));
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

    const handleOpenModal = (item: PelaksanaanKegiatan | null) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setEditingItem(null);
        setIsModalOpen(false);
    };

    const handleSave = async (formData: PelaksanaanData & { id?: number }) => {
        setIsSubmitting(true);
        try {
            if (formData.id) {
                await updatePelaksanaanKegiatan(formData.id, formData);
                showToast('Data pelaksanaan berhasil diperbarui.');
            } else {
                await addPelaksanaanKegiatan(formData);
                showToast('Data pelaksanaan berhasil ditambahkan.');
            }
            await loadData();
        } catch (error) {
            console.error("Failed to save data:", error);
            showToast('Gagal menyimpan data pelaksanaan.');
        } finally {
            setIsSubmitting(false);
            handleCloseModal();
        }
    };

    const handleDeleteRequest = (item: PelaksanaanKegiatan) => {
        handleCloseModal();
        setItemToConfirmDelete(item);
    };

    const handleConfirmDelete = async (id: number) => {
        setIsSubmitting(true);
        try {
            await deletePelaksanaanKegiatan(id);
            showToast('Data pelaksanaan berhasil dihapus.');
            await loadData();
        } catch (error) {
            console.error("Failed to delete data:", error);
            showToast('Gagal menghapus data pelaksanaan.');
        } finally {
            setIsSubmitting(false);
            setItemToConfirmDelete(null);
        }
    };
    
    const getRencanaKegiatanDisplay = (id: number) => {
        const rencana = rencanaMap.get(id);
        if (!rencana) return `ID Rencana: ${id}`;
        return rencana.bentukKegiatan;
    }

    return (
        <div>
            {toastMessage && (
                <div role="alert" className="fixed top-24 right-6 z-50 rounded-lg bg-green-600 px-5 py-2 text-white shadow-xl animate-fade-in-down">
                    <p className="text-sm font-medium">{toastMessage}</p>
                </div>
            )}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Pelaksanaan Kegiatan</h1>
                <button
                    onClick={() => handleOpenModal(null)}
                    className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Tambah Pelaksanaan Baru
                </button>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Bentuk Kegiatan</th>
                            <th scope="col" className="px-6 py-3">Tanggal Pelaksanaan</th>
                            <th scope="col" className="px-6 py-3">Lokasi</th>
                            <th scope="col" className="px-6 py-3">Anggaran Direncanakan</th>
                            <th scope="col" className="px-6 py-3">Realisasi Anggaran</th>
                            <th scope="col" className="px-6 py-3">Selisih Anggaran</th>
                            <th scope="col" className="px-6 py-3">Jumlah Peserta</th>
                            <th scope="col" className="px-6 py-3 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className={`transition-opacity duration-300 ${isSubmitting ? 'opacity-50' : 'opacity-100'}`}>
                        {loading ? (
                            <tr><td colSpan={8} className="text-center py-4">Memuat data...</td></tr>
                        ) : data.length > 0 ? (
                            data.map(item => {
                                const rencana = rencanaMap.get(item.rencanaKegiatanId);
                                const selisih = rencana ? rencana.anggaran - item.realisasiAnggaran : 0;
                                const selisihColor = selisih > 0 ? 'text-green-600' : selisih < 0 ? 'text-red-600' : 'text-gray-600';
                                return (
                                <React.Fragment key={item.id}>
                                    <tr className="bg-white hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-900 align-top">{getRencanaKegiatanDisplay(item.rencanaKegiatanId)}</td>
                                        <td className="px-6 py-4 align-top">{item.tanggalPelaksanaan}</td>
                                        <td className="px-6 py-4 align-top">{item.lokasi}</td>
                                        <td className="px-6 py-4 text-gray-600 align-top">{rencana ? formatCurrency(rencana.anggaran) : 'N/A'}</td>
                                        <td className="px-6 py-4 font-medium align-top">{formatCurrency(item.realisasiAnggaran)}</td>
                                        <td className={`px-6 py-4 font-medium align-top ${selisihColor}`}>{formatCurrency(selisih)}</td>
                                        <td className="px-6 py-4 text-center align-top">{item.jumlahPeserta}</td>
                                        <td className="px-6 py-4 flex justify-center items-center align-top">
                                            <button onClick={() => handleOpenModal(item)} className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-full transition-colors disabled:cursor-not-allowed" title="Ubah" disabled={isSubmitting}><PencilIcon /></button>
                                        </td>
                                    </tr>
                                    <tr className="bg-white hover:bg-gray-50 border-b">
                                        <td colSpan={8} className="px-8 pb-4 pt-0">
                                            <div className="pl-1">
                                                <p className="text-xs text-gray-500 font-semibold mb-1">Hasil Kegiatan:</p>
                                                <p className="text-sm text-gray-700 whitespace-pre-wrap">{item.hasilKegiatan}</p>
                                            </div>
                                        </td>
                                    </tr>
                                </React.Fragment>
                            )})
                        ) : (
                            <tr><td colSpan={8} className="text-center py-10 text-gray-500">Belum ada data pelaksanaan kegiatan.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <DataModal
                    item={editingItem}
                    rencanaList={rencanaList}
                    onSave={handleSave}
                    onClose={handleCloseModal}
                    onDeleteRequest={handleDeleteRequest}
                    isSubmitting={isSubmitting}
                />
            )}

            {itemToConfirmDelete && (
                <ConfirmationModal
                    item={itemToConfirmDelete}
                    rencanaMap={rencanaMap}
                    onConfirmDelete={handleConfirmDelete}
                    onCancel={() => setItemToConfirmDelete(null)}
                    isSubmitting={isSubmitting}
                />
            )}
        </div>
    );
};

interface ModalProps {
    item: PelaksanaanKegiatan | null;
    rencanaList: RencanaKegiatan[];
    onSave: (data: PelaksanaanData & { id?: number }) => void;
    onClose: () => void;
    onDeleteRequest: (item: PelaksanaanKegiatan) => void;
    isSubmitting: boolean;
}

const DataModal: React.FC<ModalProps> = ({ item, rencanaList, onSave, onClose, onDeleteRequest, isSubmitting }) => {
    const [formData, setFormData] = useState<PelaksanaanData>({
        rencanaKegiatanId: item?.rencanaKegiatanId || (rencanaList[0]?.id || 0),
        tanggalPelaksanaan: item?.tanggalPelaksanaan || new Date().toISOString().split('T')[0],
        lokasi: item?.lokasi || '',
        realisasiAnggaran: item?.realisasiAnggaran || 0,
        jumlahPeserta: item?.jumlahPeserta || 0,
        hasilKegiatan: item?.hasilKegiatan || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            [name]: type === 'number' ? parseInt(value, 10) || 0 : value 
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

    const selectedRencana = rencanaList.find(r => r.id === Number(formData.rencanaKegiatanId));
    const plannedBudget = selectedRencana ? selectedRencana.anggaran : 0;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">{item ? 'Ubah Pelaksanaan Kegiatan' : 'Tambah Pelaksanaan Kegiatan'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="rencanaKegiatanId" className="block text-sm font-medium text-gray-700">Rencana Kegiatan Terkait</label>
                        <select
                            id="rencanaKegiatanId" name="rencanaKegiatanId"
                            value={formData.rencanaKegiatanId} onChange={handleChange} required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                            <option value="" disabled>Pilih rencana kegiatan...</option>
                            {rencanaList.map(r => (
                                <option key={r.id} value={r.id}>
                                    {r.bentukKegiatan} - {r.pemangkuKepentingan} ({r.periode})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="tanggalPelaksanaan" className="block text-sm font-medium text-gray-700">Tanggal Pelaksanaan</label>
                            <input type="date" id="tanggalPelaksanaan" name="tanggalPelaksanaan" value={formData.tanggalPelaksanaan} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                        </div>
                         <div>
                            <label htmlFor="lokasi" className="block text-sm font-medium text-gray-700">Lokasi</label>
                            <input type="text" id="lokasi" name="lokasi" value={formData.lokasi} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                        </div>
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label htmlFor="rencanaAnggaran" className="block text-sm font-medium text-gray-700">Anggaran Direncanakan</label>
                            <input
                                type="text"
                                id="rencanaAnggaran"
                                value={formatCurrency(plannedBudget)}
                                readOnly
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none bg-gray-100 cursor-not-allowed text-gray-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="realisasiAnggaran" className="block text-sm font-medium text-gray-700">Realisasi Anggaran</label>
                            <input type="number" id="realisasiAnggaran" name="realisasiAnggaran" value={formData.realisasiAnggaran} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                        </div>
                        <div>
                            <label htmlFor="jumlahPeserta" className="block text-sm font-medium text-gray-700">Jumlah Peserta</label>
                            <input type="number" id="jumlahPeserta" name="jumlahPeserta" value={formData.jumlahPeserta} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                        </div>
                    </div>
                     <div>
                        <label htmlFor="hasilKegiatan" className="block text-sm font-medium text-gray-700">Hasil Kegiatan</label>
                        <textarea id="hasilKegiatan" name="hasilKegiatan" value={formData.hasilKegiatan} onChange={handleChange} required rows={4} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Jelaskan hasil atau output dari kegiatan yang dilaksanakan..."/>
                    </div>
                    <div className="flex justify-between items-center gap-4 pt-4">
                        <div>
                            {item && (
                                <button type="button" onClick={handleDeleteClick} disabled={isSubmitting}
                                    className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-50" title="Hapus Pelaksanaan">
                                    <TrashIcon /> Hapus
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
    item: PelaksanaanKegiatan;
    rencanaMap: Map<number, RencanaKegiatan>;
    onConfirmDelete: (id: number) => void;
    onCancel: () => void;
    isSubmitting: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ item, rencanaMap, onConfirmDelete, onCancel, isSubmitting }) => {
    const rencana = rencanaMap.get(item.rencanaKegiatanId);
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md animate-fade-in-up">
                <h2 className="text-xl font-bold text-gray-800">Konfirmasi Penghapusan</h2>
                <p className="mt-4 text-gray-600">
                    Apakah Anda yakin ingin menghapus data pelaksanaan untuk kegiatan <strong className="text-gray-800">"{rencana?.bentukKegiatan}"</strong> yang dilaksanakan pada tanggal <strong className="text-gray-800">{item.tanggalPelaksanaan}</strong>?
                </p>
                <div className="flex justify-end gap-4 mt-8">
                    <button type="button" onClick={onCancel} disabled={isSubmitting}
                        className="px-6 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50">
                        Batal
                    </button>
                    <button type="button" onClick={() => onConfirmDelete(item.id)} disabled={isSubmitting}
                        className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-wait">
                        {isSubmitting ? 'Menghapus...' : 'Ya, Hapus'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PelaksanaanKegiatanPemangkuKepentingan;