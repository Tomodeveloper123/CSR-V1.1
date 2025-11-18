import React, { useState } from 'react';
import JSZip from 'jszip';
import { getAllDataForBackup } from '../../services/database';
import { generateSqlFromData } from '../../utils/sqlGenerator';
import ArrowDownTrayIcon from '../icons/ArrowDownTrayIcon';

const BackupSQL: React.FC = () => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleDownload = async () => {
        setIsGenerating(true);
        setMessage(null);
        try {
            // 1. Fetch all data from the database service
            const allData = await getAllDataForBackup();

            // 2. Generate the SQL script string
            const sqlContent = generateSqlFromData(allData);

            // 3. Create a zip file
            const zip = new JSZip();
            zip.file("backup.sql", sqlContent);

            // 4. Generate the zip file as a blob
            const blob = await zip.generateAsync({ type: "blob" });

            // 5. Create a download link and trigger the download
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            link.download = `csr_database_backup_${timestamp}.zip`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);

            setMessage({ type: 'success', text: 'File backup.zip berhasil dibuat.' });

        } catch (error) {
            console.error("Failed to generate SQL backup:", error);
            setMessage({ type: 'error', text: 'Terjadi kesalahan saat membuat file backup.' });
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800">Backup Data ke SQL</h1>
            <p className="mt-2 text-gray-600 mb-8">
                Ekspor semua data aplikasi saat ini ke dalam file `.zip` yang berisi skrip `backup.sql`.
            </p>

            <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                    <div className="flex-shrink-0">
                        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                            <ArrowDownTrayIcon className="w-10 h-10 text-blue-600" />
                        </div>
                    </div>
                    <div className="flex-grow">
                        <h2 className="text-xl font-semibold text-gray-800">Unduh Backup Database</h2>
                        <p className="text-gray-600 mt-2 mb-4">
                            Klik tombol di bawah ini untuk memulai proses pembuatan backup. Proses ini akan meng-generate file `csr_database_backup.zip` yang berisi `backup.sql`.
                        </p>
                        <button
                            onClick={handleDownload}
                            disabled={isGenerating}
                            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {isGenerating ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Memproses...
                                </>
                            ) : (
                                'Unduh Backup SQL (.zip)'
                            )}
                        </button>
                         {message && (
                            <div className={`mt-4 text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                                {message.text}
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-700">Cara Menggunakan File Backup</h3>
                    <ol className="list-decimal list-inside mt-4 space-y-2 text-gray-600">
                        <li>Unduh dan ekstrak file `.zip` yang telah di-generate.</li>
                        <li>Anda akan menemukan file bernama `backup.sql`.</li>
                        <li>
                            Gunakan alat bantu database Anda (seperti phpMyAdmin, DBeaver, atau MySQL CLI) untuk mengimpor file `backup.sql` ini.
                        </li>
                        <li>Pastikan Anda telah membuat database (misalnya `csr_app_db`) sebelum mengimpor.</li>
                        <li>Skrip ini akan menghapus tabel yang ada (jika ada) dan membuat ulang dengan data dari aplikasi ini.</li>
                    </ol>
                </div>
            </div>
        </div>
    );
};

export default BackupSQL;
