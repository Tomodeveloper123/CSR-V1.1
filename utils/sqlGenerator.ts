// Helper to escape values for SQL insertion
const escapeSqlValue = (value: any): string | number => {
    if (value === null || value === undefined) {
        return 'NULL';
    }
    if (typeof value === 'boolean') {
        return value ? '1' : '0'; // Use 1/0 for BOOLEAN
    }
    if (typeof value === 'number') {
        return value;
    }
    if (typeof value === 'string') {
        // Escape backslashes, single quotes, newline, and carriage return
        let escaped = value.replace(/\\/g, '\\\\')
                           .replace(/'/g, "''")
                           .replace(/\n/g, '\\n')
                           .replace(/\r/g, '\\r');
        return `'${escaped}'`;
    }
    if (typeof value === 'object' && value !== null) {
        // For JSON columns, stringify and then escape
        let jsonString = JSON.stringify(value);
        return escapeSqlValue(jsonString);
    }
    return `'${String(value).replace(/'/g, "''")}'`;
};

// Main function to generate the SQL script
export const generateSqlFromData = (data: any): string => {
    let sql = `
-- CSR Application Data Backup
-- Generated on: ${new Date().toISOString()}
--
-- Database: csr_app_db
--

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;
`;

    // --- Table Creation and Data Insertion ---

    // 1. users
    sql += `
--
-- Table structure for table \`users\`
--
DROP TABLE IF EXISTS \`users\`;
CREATE TABLE \`users\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`username\` varchar(255) NOT NULL,
  \`password_hash\` varchar(255) NOT NULL,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`username\` (\`username\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table \`users\`
--
LOCK TABLES \`users\` WRITE;
INSERT INTO \`users\` (\`id\`, \`username\`, \`password_hash\`) VALUES
${data.users.map((u: any) => `(${u.id}, ${escapeSqlValue(u.username)}, ${escapeSqlValue(u.password)})`).join(',\n')};
UNLOCK TABLES;
\n`;

    // 2. slides
    sql += `
--
-- Table structure for table \`slides\`
--
DROP TABLE IF EXISTS \`slides\`;
CREATE TABLE \`slides\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`image_url\` varchar(2048) NOT NULL,
  \`title\` varchar(255) NOT NULL,
  \`description\` text,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table \`slides\`
--
LOCK TABLES \`slides\` WRITE;
INSERT INTO \`slides\` (\`image_url\`, \`title\`, \`description\`) VALUES
${data.slides.map((s: any) => `(${escapeSqlValue(s.url)}, ${escapeSqlValue(s.title)}, ${escapeSqlValue(s.description)})`).join(',\n')};
UNLOCK TABLES;
\n`;

    // 3. news_articles
    sql += `
--
-- Table structure for table \`news_articles\`
--
DROP TABLE IF EXISTS \`news_articles\`;
CREATE TABLE \`news_articles\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`image_url\` varchar(2048) DEFAULT NULL,
  \`title\` varchar(255) NOT NULL,
  \`excerpt\` text,
  \`publish_date\` date DEFAULT NULL,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table \`news_articles\`
--
LOCK TABLES \`news_articles\` WRITE;
INSERT INTO \`news_articles\` (\`id\`, \`image_url\`, \`title\`, \`excerpt\`, \`publish_date\`) VALUES
${data.news.map((n: any) => `(${n.id}, ${escapeSqlValue(n.image)}, ${escapeSqlValue(n.title)}, ${escapeSqlValue(n.excerpt)}, ${escapeSqlValue(n.date)})`).join(',\n')};
UNLOCK TABLES;
\n`;

    // 4. fiscal_years
    sql += `
--
-- Table structure for table \`fiscal_years\`
--
DROP TABLE IF EXISTS \`fiscal_years\`;
CREATE TABLE \`fiscal_years\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`tahun_fiskal\` varchar(4) NOT NULL,
  \`tanggal_mulai\` date NOT NULL,
  \`tanggal_selesai\` date NOT NULL,
  \`total_anggaran\` bigint(20) NOT NULL,
  \`is_active\` tinyint(1) DEFAULT '0',
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table \`fiscal_years\`
--
LOCK TABLES \`fiscal_years\` WRITE;
INSERT INTO \`fiscal_years\` (\`id\`, \`tahun_fiskal\`, \`tanggal_mulai\`, \`tanggal_selesai\`, \`total_anggaran\`, \`is_active\`) VALUES
${data.fiscalYears.map((fy: any) => `(${fy.id}, ${escapeSqlValue(fy.tahunFiskal)}, ${escapeSqlValue(fy.tanggalMulai)}, ${escapeSqlValue(fy.tanggalSelesai)}, ${fy.totalAnggaran}, ${escapeSqlValue(fy.isActive)})`).join(',\n')};
UNLOCK TABLES;
\n`;

    // 5. csr_programs
    sql += `
--
-- Table structure for table \`csr_programs\`
--
DROP TABLE IF EXISTS \`csr_programs\`;
CREATE TABLE \`csr_programs\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`fiscal_year_id\` int(11) DEFAULT NULL,
  \`nomor_program\` varchar(50) NOT NULL,
  \`nama_program\` varchar(255) NOT NULL,
  \`deskripsi_program\` text,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`nomor_program\` (\`nomor_program\`),
  KEY \`fiscal_year_id\` (\`fiscal_year_id\`),
  CONSTRAINT \`csr_programs_ibfk_1\` FOREIGN KEY (\`fiscal_year_id\`) REFERENCES \`fiscal_years\` (\`id\`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table \`csr_programs\`
--
LOCK TABLES \`csr_programs\` WRITE;
INSERT INTO \`csr_programs\` (\`id\`, \`fiscal_year_id\`, \`nomor_program\`, \`nama_program\`, \`deskripsi_program\`) VALUES
${data.programsCSR.map((p: any) => `(${p.id}, ${p.fiscalYearId}, ${escapeSqlValue(p.nomorProgram)}, ${escapeSqlValue(p.namaProgram)}, ${escapeSqlValue(p.deskripsiProgram)})`).join(',\n')};
UNLOCK TABLES;
\n`;

    // 6. csr_pilars
    sql += `
--
-- Table structure for table \`csr_pilars\`
--
DROP TABLE IF EXISTS \`csr_pilars\`;
CREATE TABLE \`csr_pilars\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`nama_pilar\` varchar(100) NOT NULL,
  \`deskripsi\` text,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table \`csr_pilars\`
--
LOCK TABLES \`csr_pilars\` WRITE;
INSERT INTO \`csr_pilars\` (\`id\`, \`nama_pilar\`, \`deskripsi\`) VALUES
${data.pilarCSR.map((p: any) => `(${p.id}, ${escapeSqlValue(p.namaPilar)}, ${escapeSqlValue(p.deskripsi)})`).join(',\n')};
UNLOCK TABLES;
\n`;

    // 7. sdgs
    sql += `
--
-- Table structure for table \`sdgs\`
--
DROP TABLE IF EXISTS \`sdgs\`;
CREATE TABLE \`sdgs\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`goal\` varchar(255) NOT NULL,
  \`logo_url\` varchar(2048) DEFAULT NULL,
  \`description\` text,
  \`indicators\` json DEFAULT NULL,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table \`sdgs\`
--
LOCK TABLES \`sdgs\` WRITE;
INSERT INTO \`sdgs\` (\`id\`, \`goal\`, \`logo_url\`, \`description\`, \`indicators\`) VALUES
${data.sdgs.map((s: any) => `(${s.id}, ${escapeSqlValue(s.goal)}, ${escapeSqlValue(s.logo)}, ${escapeSqlValue(s.description)}, ${escapeSqlValue(s.indicators)})`).join(',\n')};
UNLOCK TABLES;
\n`;

    // 8. stakeholder_types
    sql += `
--
-- Table structure for table \`stakeholder_types\`
--
DROP TABLE IF EXISTS \`stakeholder_types\`;
CREATE TABLE \`stakeholder_types\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`nama_tipe\` varchar(100) NOT NULL,
  \`deskripsi\` text,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table \`stakeholder_types\`
--
LOCK TABLES \`stakeholder_types\` WRITE;
INSERT INTO \`stakeholder_types\` (\`id\`, \`nama_tipe\`, \`deskripsi\`) VALUES
${data.tipePemangkuKepentinganData.map((t: any) => `(${t.id}, ${escapeSqlValue(t.namaTipe)}, ${escapeSqlValue(t.deskripsi)})`).join(',\n')};
UNLOCK TABLES;
\n`;

    // 9. stakeholder_profiles
    sql += `
--
-- Table structure for table \`stakeholder_profiles\`
--
DROP TABLE IF EXISTS \`stakeholder_profiles\`;
CREATE TABLE \`stakeholder_profiles\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`nama\` varchar(255) NOT NULL,
  \`kategori\` enum('Internal','Eksternal') NOT NULL,
  \`tipe\` varchar(100) DEFAULT NULL,
  \`deskripsi\` text,
  \`strategi_komunikasi\` text,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table \`stakeholder_profiles\`
--
LOCK TABLES \`stakeholder_profiles\` WRITE;
INSERT INTO \`stakeholder_profiles\` (\`id\`, \`nama\`, \`kategori\`, \`tipe\`, \`deskripsi\`, \`strategi_komunikasi\`) VALUES
${data.profilPemangkuKepentinganData.map((p: any) => `(${p.id}, ${escapeSqlValue(p.nama)}, ${escapeSqlValue(p.kategori)}, ${escapeSqlValue(p.tipe)}, ${escapeSqlValue(p.deskripsi)}, ${escapeSqlValue(p.strategiKomunikasi)})`).join(',\n')};
UNLOCK TABLES;
\n`;

    // Create maps for FK lookups
    const programMap = new Map(data.programsCSR.map((p: any) => [p.namaProgram, p.id]));
    const stakeholderMap = new Map(data.profilPemangkuKepentinganData.map((p: any) => [p.nama, p.id]));

    // 10. activity_plans
    sql += `
--
-- Table structure for table \`activity_plans\`
--
DROP TABLE IF EXISTS \`activity_plans\`;
CREATE TABLE \`activity_plans\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`pemangku_kepentingan_id\` int(11) DEFAULT NULL,
  \`program_csr_id\` int(11) DEFAULT NULL,
  \`bentuk_kegiatan\` varchar(255) DEFAULT NULL,
  \`tujuan_kegiatan\` text,
  \`frekuensi\` varchar(50) DEFAULT NULL,
  \`periode\` varchar(50) DEFAULT NULL,
  \`anggaran\` bigint(20) DEFAULT NULL,
  PRIMARY KEY (\`id\`),
  KEY \`pemangku_kepentingan_id\` (\`pemangku_kepentingan_id\`),
  KEY \`program_csr_id\` (\`program_csr_id\`),
  CONSTRAINT \`activity_plans_ibfk_1\` FOREIGN KEY (\`pemangku_kepentingan_id\`) REFERENCES \`stakeholder_profiles\` (\`id\`),
  CONSTRAINT \`activity_plans_ibfk_2\` FOREIGN KEY (\`program_csr_id\`) REFERENCES \`csr_programs\` (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table \`activity_plans\`
--
LOCK TABLES \`activity_plans\` WRITE;
INSERT INTO \`activity_plans\` (\`id\`, \`pemangku_kepentingan_id\`, \`program_csr_id\`, \`bentuk_kegiatan\`, \`tujuan_kegiatan\`, \`frekuensi\`, \`periode\`, \`anggaran\`) VALUES
${data.rencanaKegiatan.map((r: any) => `(${r.id}, ${stakeholderMap.get(r.pemangkuKepentingan) || 'NULL'}, ${programMap.get(r.programTerkait) || 'NULL'}, ${escapeSqlValue(r.bentukKegiatan)}, ${escapeSqlValue(r.tujuanKegiatan)}, ${escapeSqlValue(r.frekuensi)}, ${escapeSqlValue(r.periode)}, ${r.anggaran})`).join(',\n')};
UNLOCK TABLES;
\n`;

    // 11. activity_implementations
    sql += `
--
-- Table structure for table \`activity_implementations\`
--
DROP TABLE IF EXISTS \`activity_implementations\`;
CREATE TABLE \`activity_implementations\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`rencana_kegiatan_id\` int(11) DEFAULT NULL,
  \`tanggal_pelaksanaan\` date DEFAULT NULL,
  \`lokasi\` varchar(255) DEFAULT NULL,
  \`realisasi_anggaran\` bigint(20) DEFAULT NULL,
  \`jumlah_peserta\` int(11) DEFAULT NULL,
  \`hasil_kegiatan\` text,
  PRIMARY KEY (\`id\`),
  KEY \`rencana_kegiatan_id\` (\`rencana_kegiatan_id\`),
  CONSTRAINT \`activity_implementations_ibfk_1\` FOREIGN KEY (\`rencana_kegiatan_id\`) REFERENCES \`activity_plans\` (\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table \`activity_implementations\`
--
LOCK TABLES \`activity_implementations\` WRITE;
INSERT INTO \`activity_implementations\` (\`id\`, \`rencana_kegiatan_id\`, \`tanggal_pelaksanaan\`, \`lokasi\`, \`realisasi_anggaran\`, \`jumlah_peserta\`, \`hasil_kegiatan\`) VALUES
${data.pelaksanaanKegiatanData.map((p: any) => `(${p.id}, ${p.rencanaKegiatanId}, ${escapeSqlValue(p.tanggalPelaksanaan)}, ${escapeSqlValue(p.lokasi)}, ${p.realisasiAnggaran}, ${p.jumlahPeserta}, ${escapeSqlValue(p.hasilKegiatan)})`).join(',\n')};
UNLOCK TABLES;
\n`;
    
    // Risk Management Tables
    // 12. risk_likelihood_levels
    sql += `
--
-- Table structure for table \`risk_likelihood_levels\`
--
DROP TABLE IF EXISTS \`risk_likelihood_levels\`;
CREATE TABLE \`risk_likelihood_levels\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`level\` int(11) NOT NULL,
  \`keterangan\` varchar(100) NOT NULL,
  \`persentase\` varchar(20) DEFAULT NULL,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`level\` (\`level\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table \`risk_likelihood_levels\`
--
LOCK TABLES \`risk_likelihood_levels\` WRITE;
INSERT INTO \`risk_likelihood_levels\` (\`id\`, \`level\`, \`keterangan\`, \`persentase\`) VALUES
${data.tingkatKemungkinanRisiko.map((r: any) => `(${r.id}, ${r.level}, ${escapeSqlValue(r.keterangan)}, ${escapeSqlValue(r.persentase)})`).join(',\n')};
UNLOCK TABLES;
\n`;
    
    // 13. risk_impact_levels
    sql += `
--
-- Table structure for table \`risk_impact_levels\`
--
DROP TABLE IF EXISTS \`risk_impact_levels\`;
CREATE TABLE \`risk_impact_levels\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`level\` int(11) NOT NULL,
  \`dampak\` varchar(100) NOT NULL,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`level\` (\`level\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table \`risk_impact_levels\`
--
LOCK TABLES \`risk_impact_levels\` WRITE;
INSERT INTO \`risk_impact_levels\` (\`id\`, \`level\`, \`dampak\`) VALUES
${data.dampakRisiko.map((r: any) => `(${r.id}, ${r.level}, ${escapeSqlValue(r.dampak)})`).join(',\n')};
UNLOCK TABLES;
\n`;

    // 14. risk_levels
    sql += `
--
-- Table structure for table \`risk_levels\`
--
DROP TABLE IF EXISTS \`risk_levels\`;
CREATE TABLE \`risk_levels\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`level\` int(11) NOT NULL,
  \`tingkat\` varchar(100) NOT NULL,
  \`deskripsi\` text,
  \`warna\` varchar(50) DEFAULT NULL,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`level\` (\`level\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table \`risk_levels\`
--
LOCK TABLES \`risk_levels\` WRITE;
INSERT INTO \`risk_levels\` (\`id\`, \`level\`, \`tingkat\`, \`deskripsi\`, \`warna\`) VALUES
${data.tingkatRisiko.map((r: any) => `(${r.id}, ${r.level}, ${escapeSqlValue(r.tingkat)}, ${escapeSqlValue(r.deskripsi)}, ${escapeSqlValue(r.warna)})`).join(',\n')};
UNLOCK TABLES;
\n`;


    sql += `
SET FOREIGN_KEY_CHECKS = 1;
`;

    return sql;
};
