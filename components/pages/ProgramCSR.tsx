import React, { useState, useEffect, useCallback } from 'react';
import PencilIcon from '../icons/PencilIcon';
import TrashIcon from '../icons/TrashIcon';
import { getProgramCSR, addProgramCSR, updateProgramCSR, deleteProgramCSR } from '../../services/database';
import type { ProgramCSR, FiscalYear } from '../../types';

interface ProgramCSRProps {
    activeFiscalYear: FiscalYear | null;
}

const ProgramCSR: React.FC<ProgramCSRProps> = ({ activeFiscalYear }) => {
  const [allPrograms, setAllPrograms] = useState<ProgramCSR[]>([]);
  const [displayedPrograms, setDisplayedPrograms] = useState<ProgramCSR[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<ProgramCSR | null>(null);
  const [programToConfirmDelete, setProgramToConfirmDelete] = useState<ProgramCSR | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadPrograms = useCallback(async () => {
    setLoading(true);
    try {
        const programsData = await getProgramCSR();
        setAllPrograms(programsData);
    } catch (error) {
        console.error("Failed to fetch CSR programs:", error);
        setAllPrograms([]);
    } finally {
        setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPrograms();
  }, [loadPrograms]);

  useEffect(() => {
    if (activeFiscalYear) {
        const filteredPrograms = allPrograms.filter(p => p.fiscalYearId === activeFiscalYear.id);
        setDisplayedPrograms(filteredPrograms);
    } else {
        setDisplayedPrograms([]);
    }
  }, [activeFiscalYear, allPrograms]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
        setToastMessage(null);
    }, 3000);
  };

  const handleOpenModal = (program: ProgramCSR | null) => {
    setEditingProgram(program);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingProgram(null);
    setIsModalOpen(false);
  };
  
  const handleSave = async (programData: Omit<ProgramCSR, 'id' | 'fiscalYearId'> & { id?: number }) => {
    if (!activeFiscalYear) return;

    setIsSubmitting(true);
    
    try {
        if (programData.id) {
            // Update existing program
            const updatedProgram = await updateProgramCSR(programData.id, programData);
            if (!updatedProgram) throw new Error("Program not found for update");
            setAllPrograms(prev => prev.map(p => p.id === updatedProgram!.id ? updatedProgram : p));
            showToast('Program berhasil diperbarui.');
        } else {
            // Add new program
            const newProgramData = { ...programData, fiscalYearId: activeFiscalYear.id };
            const addedProgram = await addProgramCSR(newProgramData);
            setAllPrograms(prev => [addedProgram, ...prev]);
            showToast('Program berhasil ditambahkan.');
        }
    } catch (error) {
        console.error("Failed to save program:", error);
        showToast('Gagal menyimpan program.');
    } finally {
        setIsSubmitting(false);
        handleCloseModal();
    }
  };

  const handleDeleteRequest = (program: ProgramCSR) => {
    handleCloseModal();
    setProgramToConfirmDelete(program);
  };

  const handleDelete = async (id: number) => {
    setIsSubmitting(true);
    try {
        const result = await deleteProgramCSR(id);
        if (!result.success) {
            throw new Error("Delete operation failed on the server.");
        }
        setAllPrograms(prevPrograms => prevPrograms.filter(p => p.id !== id));
        showToast('Program berhasil dihapus.');
    } catch (error) {
        console.error("Error deleting program:", error);
        showToast('Gagal menghapus program.');
    } finally {
        setIsSubmitting(false);
        setProgramToConfirmDelete(null);
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
        <h1 className="text-3xl font-bold text-gray-800">Program CSR</h1>
        <div className="flex items-center gap-4">
            {activeFiscalYear ? (
                <span className="text-sm font-medium text-gray-600">
                    Tahun Fiskal Aktif: <span className="font-bold text-blue-600">{activeFiscalYear.tahunFiskal}</span>
                </span>
            ) : (
                 <span className="text-sm font-semibold text-red-600 bg-red-100 px-3 py-1.5 rounded-md">
                    Tidak ada tahun fiskal aktif
                </span>
            )}
            <button
                onClick={() => handleOpenModal(null)}
                className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={!activeFiscalYear || loading || isSubmitting}
                title={!activeFiscalYear ? "Aktifkan satu tahun fiskal untuk menambah program" : "Tambah Program Baru"}
            >
                Tambah Program Baru
            </button>
        </div>
      </div>

      {!loading && !activeFiscalYear && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md mb-6" role="alert">
              <p className="font-bold">Perhatian</p>
              <p>Silakan aktifkan satu tahun fiskal di menu 'Data Induk &gt; Tahun Fiskal CSR' untuk dapat mengelola program.</p>
          </div>
      )}
      
      <div className="bg-white p-4 rounded-lg shadow-md overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                    <th scope="col" className="px-6 py-3">Nomor Program</th>
                    <th scope="col" className="px-6 py-3">Nama Program</th>
                    <th scope="col" className="px-6 py-3">Deskripsi</th>
                    <th scope="col" className="px-6 py-3 text-center">Aksi</th>
                </tr>
            </thead>
            <tbody className={`transition-opacity duration-300 ${isSubmitting ? 'opacity-50' : 'opacity-100'}`}>
                {loading ? (
                    <tr>
                        <td colSpan={4} className="text-center py-4">Memuat data...</td>
                    </tr>
                ) : displayedPrograms.length > 0 ? (
                    displayedPrograms.map(program => (
                        <tr key={program.id} className="bg-white border-b hover:bg-gray-50">
                            <td className="px-6 py-4 font-mono text-gray-700">{program.nomorProgram}</td>
                            <td className="px-6 py-4 font-medium text-gray-900">{program.namaProgram}</td>
                            <td className="px-6 py-4">{program.deskripsiProgram}</td>
                            <td className="px-6 py-4 flex justify-center items-center space-x-2">
                               <button onClick={() => handleOpenModal(program)} className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-full transition-colors disabled:cursor-not-allowed" title="Ubah" disabled={isSubmitting}>
                                    <PencilIcon />
                               </button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={4} className="text-center py-10 text-gray-500">
                            {activeFiscalYear ? 'Tidak ada program untuk tahun fiskal ini.' : 'Pilih tahun fiskal aktif untuk melihat program.'}
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
      </div>

      {isModalOpen && <ProgramModal program={editingProgram} onSave={handleSave} onClose={handleCloseModal} onDeleteRequest={handleDeleteRequest} activeFiscalYear={activeFiscalYear} />}
      {programToConfirmDelete && (
          <ConfirmationModal
            program={programToConfirmDelete}
            onConfirmDelete={handleDelete}
            onCancel={() => setProgramToConfirmDelete(null)}
            isSubmitting={isSubmitting}
          />
      )}
    </div>
  );
};

interface ModalProps {
    program: ProgramCSR | null;
    onSave: (data: Omit<ProgramCSR, 'id' | 'fiscalYearId'> & { id?: number }) => void;
    onClose: () => void;
    onDeleteRequest: (program: ProgramCSR) => void;
    activeFiscalYear: FiscalYear | null;
}

const ProgramModal: React.FC<ModalProps> = ({ program, onSave, onClose, onDeleteRequest, activeFiscalYear }) => {
    const [formData, setFormData] = useState({
        nomorProgram: program?.nomorProgram || '',
        namaProgram: program?.namaProgram || '',
        deskripsiProgram: program?.deskripsiProgram || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...formData, id: program?.id });
    };

    const handleDeleteClick = () => {
        if (program) {
            onDeleteRequest(program);
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">{program ? 'Ubah Program CSR' : 'Tambah Program CSR Baru'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {!program && activeFiscalYear && (
                        <div>
                            <label htmlFor="tahunFiskal" className="block text-sm font-medium text-gray-700">Tahun Fiskal</label>
                            <input
                                type="text"
                                id="tahunFiskal"
                                name="tahunFiskal"
                                value={activeFiscalYear.tahunFiskal}
                                readOnly
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none bg-gray-100 cursor-not-allowed text-gray-500"
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                Program akan otomatis ditautkan ke tahun fiskal yang aktif.
                            </p>
                        </div>
                    )}
                    <div>
                        <label htmlFor="nomorProgram" className="block text-sm font-medium text-gray-700">Nomor Program</label>
                        <input
                            type="text"
                            id="nomorProgram"
                            name="nomorProgram"
                            value={formData.nomorProgram}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>
                     <div>
                        <label htmlFor="namaProgram" className="block text-sm font-medium text-gray-700">Nama Program</label>
                        <input
                            type="text"
                            id="namaProgram"
                            name="namaProgram"
                            value={formData.namaProgram}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>
                     <div>
                        <label htmlFor="deskripsiProgram" className="block text-sm font-medium text-gray-700">Deskripsi Program</label>
                        <textarea
                            id="deskripsiProgram"
                            name="deskripsiProgram"
                            rows={4}
                            value={formData.deskripsiProgram}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>
                    <div className="flex justify-between items-center gap-4 pt-4">
                        <div>
                            {program && (
                                <button
                                    type="button"
                                    onClick={handleDeleteClick}
                                    className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                                    title="Hapus Program"
                                >
                                    <TrashIcon />
                                    Hapus Program
                                </button>
                            )}
                        </div>
                        <div className="flex gap-4">
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
                    </div>
                </form>
            </div>
        </div>
    );
};

interface ConfirmationModalProps {
    program: ProgramCSR;
    onConfirmDelete: (id: number) => void;
    onCancel: () => void;
    isSubmitting: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ program, onConfirmDelete, onCancel, isSubmitting }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md animate-fade-in-up">
                <h2 className="text-xl font-bold text-gray-800">Konfirmasi Penghapusan</h2>
                <p className="mt-4 text-gray-600">
                    Apakah Anda yakin ingin menghapus program <strong className="text-gray-800">"{program.namaProgram}"</strong>? Tindakan ini tidak dapat diurungkan.
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
                        onClick={() => onConfirmDelete(program.id)}
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


export default ProgramCSR;