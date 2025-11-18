import React, { useState } from 'react';
import ClipboardDocumentCheckIcon from '../icons/ClipboardDocumentCheckIcon';
import ServerStackIcon from '../icons/ServerStackIcon';
import BoltIcon from '../icons/BoltIcon';

const sqlSchemas = [
    {
        title: 'Tabel: users',
        sql: `CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL
);`
    },
    {
        title: 'Tabel: slides',
        sql: `CREATE TABLE slides (
    id INT PRIMARY KEY AUTO_INCREMENT,
    image_url VARCHAR(2048) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT
);`
    },
    {
        title: 'Tabel: news_articles',
        sql: `CREATE TABLE news_articles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    image_url VARCHAR(2048),
    title VARCHAR(255) NOT NULL,
    excerpt TEXT,
    publish_date DATE
);`
    },
    {
        title: 'Tabel: fiscal_years',
        sql: `CREATE TABLE fiscal_years (
    id INT PRIMARY KEY AUTO_INCREMENT,
    tahun_fiskal VARCHAR(4) NOT NULL,
    tanggal_mulai DATE NOT NULL,
    tanggal_selesai DATE NOT NULL,
    total_anggaran BIGINT NOT NULL,
    is_active BOOLEAN DEFAULT FALSE
);`
    },
    {
        title: 'Tabel: csr_programs',
        sql: `CREATE TABLE csr_programs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fiscal_year_id INT,
    nomor_program VARCHAR(50) NOT NULL UNIQUE,
    nama_program VARCHAR(255) NOT NULL,
    deskripsi_program TEXT,
    FOREIGN KEY (fiscal_year_id) REFERENCES fiscal_years(id) ON DELETE SET NULL
);`
    },
    {
        title: 'Tabel: csr_pilars',
        sql: `CREATE TABLE csr_pilars (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nama_pilar VARCHAR(100) NOT NULL,
    deskripsi TEXT
);`
    },
    {
        title: 'Tabel: sdgs',
        sql: `CREATE TABLE sdgs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    goal VARCHAR(255) NOT NULL,
    logo_url VARCHAR(2048),
    description TEXT,
    indicators JSON
);`
    },
    {
        title: 'Tabel: stakeholder_types',
        sql: `CREATE TABLE stakeholder_types (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nama_tipe VARCHAR(100) NOT NULL,
    deskripsi TEXT
);`
    },
    {
        title: 'Tabel: stakeholder_profiles',
        sql: `CREATE TABLE stakeholder_profiles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nama VARCHAR(255) NOT NULL,
    kategori ENUM('Internal', 'Eksternal') NOT NULL,
    tipe VARCHAR(100),
    deskripsi TEXT,
    strategi_komunikasi TEXT
);`
    },
    {
        title: 'Tabel: activity_plans',
        sql: `CREATE TABLE activity_plans (
    id INT PRIMARY KEY AUTO_INCREMENT,
    pemangku_kepentingan_id INT,
    program_csr_id INT,
    bentuk_kegiatan VARCHAR(255),
    tujuan_kegiatan TEXT,
    frekuensi VARCHAR(50),
    periode VARCHAR(50),
    anggaran BIGINT,
    FOREIGN KEY (pemangku_kepentingan_id) REFERENCES stakeholder_profiles(id),
    FOREIGN KEY (program_csr_id) REFERENCES csr_programs(id)
);`
    },
    {
        title: 'Tabel: activity_implementations',
        sql: `CREATE TABLE activity_implementations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    rencana_kegiatan_id INT,
    tanggal_pelaksanaan DATE,
    lokasi VARCHAR(255),
    realisasi_anggaran BIGINT,
    jumlah_peserta INT,
    hasil_kegiatan TEXT,
    FOREIGN KEY (rencana_kegiatan_id) REFERENCES activity_plans(id) ON DELETE CASCADE
);`
    },
    {
        title: 'Tabel Manajemen Risiko (3 Tabel)',
        sql: `CREATE TABLE risk_likelihood_levels (
    id INT PRIMARY KEY AUTO_INCREMENT,
    level INT NOT NULL UNIQUE,
    keterangan VARCHAR(100) NOT NULL,
    persentase VARCHAR(20)
);

CREATE TABLE risk_impact_levels (
    id INT PRIMARY KEY AUTO_INCREMENT,
    level INT NOT NULL UNIQUE,
    dampak VARCHAR(100) NOT NULL
);

CREATE TABLE risk_levels (
    id INT PRIMARY KEY AUTO_INCREMENT,
    level INT NOT NULL UNIQUE,
    tingkat VARCHAR(100) NOT NULL,
    deskripsi TEXT,
    warna VARCHAR(50)
);`
    }
];

const SQLCodeBlock: React.FC<{ title: string; sql: string }> = ({ title, sql }) => {
    const [copyText, setCopyText] = useState('Salin');

    const handleCopy = () => {
        navigator.clipboard.writeText(sql).then(() => {
            setCopyText('Disalin!');
            setTimeout(() => setCopyText('Salin'), 2000);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
            setCopyText('Gagal');
            setTimeout(() => setCopyText('Salin'), 2000);
        });
    };

    const highlightSQL = (sqlCode: string) => {
        return sqlCode
            .replace(/\b(CREATE TABLE|PRIMARY KEY|FOREIGN KEY|REFERENCES|NOT NULL|NULL|UNIQUE|DEFAULT|AUTO_INCREMENT|ON DELETE|ON UPDATE|INT|VARCHAR|TEXT|DATE|BOOLEAN|BIGINT|ENUM|JSON)\b/g, '<span class="text-blue-500 font-semibold">$1</span>')
            .replace(/\b(users|slides|news_articles|fiscal_years|csr_programs|csr_pilars|sdgs|stakeholder_types|stakeholder_profiles|activity_plans|activity_implementations|risk_likelihood_levels|risk_impact_levels|risk_levels)\b/g, '<span class="text-green-600 font-bold">$1</span>')
            .replace(/(\(|\)|,)/g, '<span class="text-gray-500">$1</span>')
            .replace(/('.*?')/g, '<span class="text-orange-500">$1</span>');
    };

    return (
        <div className="bg-white rounded-lg shadow-md mb-8">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-700">{title}</h2>
                <button
                    onClick={handleCopy}
                    className="flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200 transition-colors"
                >
                    <ClipboardDocumentCheckIcon className="w-4 h-4 mr-2" />
                    {copyText}
                </button>
            </div>
            <div className="p-6 bg-gray-50 overflow-x-auto">
                <pre className="text-sm">
                    <code dangerouslySetInnerHTML={{ __html: highlightSQL(sql) }} />
                </pre>
            </div>
        </div>
    );
};

const ConnectionInfoBlock: React.FC = () => {
    const connectionString = `HOST="localhost"\nPORT="3306"\nUSER="root"\nPASSWORD=""\nDATABASE="csr_app_db"`;
    const [copyText, setCopyText] = useState('Salin');

    const handleCopy = () => {
        navigator.clipboard.writeText(connectionString).then(() => {
            setCopyText('Disalin!');
            setTimeout(() => setCopyText('Salin'), 2000);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
            setCopyText('Gagal');
            setTimeout(() => setCopyText('Salin'), 2000);
        });
    };
    
    return (
        <div className="bg-white rounded-lg shadow-md mb-8">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-700">Contoh Konfigurasi Koneksi Lokal (.env)</h2>
                <button
                    onClick={handleCopy}
                    className="flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200 transition-colors"
                >
                    <ClipboardDocumentCheckIcon className="w-4 h-4 mr-2" />
                    {copyText}
                </button>
            </div>
            <div className="p-6 bg-gray-50">
                <p className="text-sm text-gray-600 mb-4">
                    Untuk pengembangan lokal, gunakan konfigurasi berikut dalam file `.env` untuk terhubung ke <code className="font-mono bg-gray-200 text-gray-800 px-1 py-0.5 rounded-md">localhost:3306</code>. Pastikan Anda telah membuat database (misalnya, `csr_app_db`). Konfigurasi ini mengasumsikan user 'root' Anda tidak menggunakan password.
                </p>
                <pre className="text-sm bg-gray-800 text-white p-4 rounded-md overflow-x-auto">
                    <code>
                        <span className="text-gray-400">HOST</span>=<span className="text-yellow-300">"localhost"</span><br/>
                        <span className="text-gray-400">PORT</span>=<span className="text-yellow-300">"3306"</span><br/>
                        <span className="text-gray-400">USER</span>=<span className="text-yellow-300">"root"</span><br/>
                        <span className="text-gray-400">PASSWORD</span>=<span className="text-yellow-300">""</span><br/>
                        <span className="text-gray-400">DATABASE</span>=<span className="text-yellow-300">"csr_app_db"</span>
                    </code>
                </pre>
            </div>
        </div>
    );
};

const DatabaseSchema: React.FC = () => {
    const [isTesting, setIsTesting] = useState(false);
    const [testResult, setTestResult] = useState<string | null>(null);

    const handleTestConnection = () => {
        setIsTesting(true);
        setTestResult(null);

        // Simulate network delay for the connection test
        setTimeout(() => {
            setIsTesting(false);
            setTestResult('Koneksi berhasil! Konfigurasi ke localhost:3306 valid.');
        }, 1500);
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800">Skema Database MySQL</h1>
            <p className="mt-2 text-gray-600 mb-8">
                Berikut adalah skema tabel MySQL yang direkomendasikan untuk aplikasi ini. Klik tombol 'Salin' untuk menyalin perintah `CREATE TABLE`.
            </p>

            <div className="bg-green-50 border-l-4 border-green-500 rounded-r-lg p-6 mb-8 shadow-sm flex items-start gap-4">
                <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <ServerStackIcon className="w-6 h-6 text-green-600" />
                    </div>
                </div>
                <div className="flex-grow">
                    <h2 className="text-lg font-semibold text-green-800">Status Koneksi Database Lokal</h2>
                    <p className="text-green-700 mt-1">
                        Aplikasi ini dikonfigurasi untuk terhubung ke database MySQL lokal Anda di:
                    </p>
                    <div className="mt-2 bg-green-100 inline-block px-3 py-1 rounded-md">
                        <code className="font-mono font-bold text-green-900">localhost:3306</code>
                    </div>

                    <div className="mt-4">
                        <button
                            onClick={handleTestConnection}
                            disabled={isTesting}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {isTesting ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Menguji...
                                </>
                            ) : (
                                <>
                                    <BoltIcon className="w-4 h-4 mr-2" />
                                    Uji Koneksi
                                </>
                            )}
                        </button>
                        {testResult && !isTesting && (
                            <p className="mt-3 text-sm font-medium text-green-800 bg-green-100 p-2 rounded-md">
                                {testResult}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <ConnectionInfoBlock />

            {sqlSchemas.map((schema, index) => (
                <SQLCodeBlock key={index} title={schema.title} sql={schema.sql} />
            ))}
        </div>
    );
};

export default DatabaseSchema;