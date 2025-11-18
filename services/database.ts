// --- MOCK DATA ---
// This data simulates what would be stored in a live MySQL database.
// In a real application, this would not exist on the frontend.
import type { User, NewsArticle, Slide, FiscalYear, ProgramCSR, SDG, TingkatKemungkinanRisiko, DampakRisiko, TingkatRisiko, PilarCSR, RencanaKegiatan, ProfilPemangkuKepentingan, TipePemangkuKepentingan, PelaksanaanKegiatan } from '../types';

const DB_STORAGE_KEY = 'csr_app_mock_db';

let nextFiscalYearId: number;
let nextProgramId: number;
let nextPilarCSRId: number;
let nextTingkatKemungkinanId: number;
let nextDampakRisikoId: number;
let nextTingkatRisikoId: number;
let nextRencanaKegiatanId: number;
let nextProfilPemangkuKepentinganId: number;
let nextTipePemangkuKepentinganId: number;
let nextPelaksanaanKegiatanId: number;

const defaultMockData = {
  users: [
    { id: 1, username: 'admin', password: 'sandi' },
    { id: 2, username: 'user', password: 'userpass' }
  ] as User[],
  slides: [
    { url: 'https://picsum.photos/1200/500?random=1', title: 'Program Penanaman 1000 Pohon', description: 'Menghijaukan kembali lingkungan untuk masa depan yang lebih baik.' },
    { url: 'https://picsum.photos/1200/500?random=2', title: 'Bantuan Pendidikan untuk Anak-Anak', description: 'Memberikan akses pendidikan berkualitas bagi generasi penerus bangsa.' },
    { url: 'https://picsum.photos/1200/500?random=3', title: 'Pembangunan Fasilitas Air Bersih', description: 'Memastikan masyarakat mendapatkan akses air bersih yang layak dan sehat.' }
  ] as Slide[],
  news: [
    { id: 1, image: 'https://picsum.photos/400/300?random=4', title: 'Suksesnya Program Bank Sampah Digital', excerpt: 'Program bank sampah yang kami gagas berhasil mengurangi limbah plastik di lingkungan sekitar dan memberikan nilai ekonomis bagi warga.', date: '2024-07-15' },
    { id: 2, image: 'https://picsum.photos/400/300?random=5', title: 'Pelatihan Keterampilan untuk Pemuda Lokal', excerpt: 'Kami menyelenggarakan pelatihan digital marketing gratis untuk pemuda-pemudi desa agar siap bersaing di dunia kerja modern.', date: '2024-07-10' },
    { id: 3, image: 'https://picsum.photos/400/300?random=6', title: 'Donasi Alat Kesehatan ke Puskesmas Terpencil', excerpt: 'Sebagai bentuk kepedulian, kami mendonasikan berbagai alat kesehatan vital untuk meningkatkan layanan puskesmas di daerah terpencil.', date: '2024-07-05' },
  ] as NewsArticle[],
  fiscalYears: [
    { id: 1, tahunFiskal: '2022', tanggalMulai: '2022-01-01', tanggalSelesai: '2022-12-31', totalAnggaran: 475000000, isActive: false },
    { id: 2, tahunFiskal: '2023', tanggalMulai: '2023-01-01', tanggalSelesai: '2023-12-31', totalAnggaran: 450000000, isActive: false },
    { id: 3, tahunFiskal: '2024', tanggalMulai: '2024-01-01', tanggalSelesai: '2024-12-31', totalAnggaran: 5000000, isActive: true },
  ] as FiscalYear[],
  programsCSR: [
      { id: 101, fiscalYearId: 3, nomorProgram: 'CSR-24-001', namaProgram: 'Beasiswa Pendidikan Merdeka', deskripsiProgram: 'Program beasiswa untuk siswa berprestasi dari keluarga kurang mampu di sekitar wilayah operasi perusahaan.' },
      { id: 102, fiscalYearId: 3, nomorProgram: 'CSR-24-002', namaProgram: 'Klinik Sehat Keliling', deskripsiProgram: 'Menyediakan layanan kesehatan gratis bagi masyarakat di daerah terpencil melalui unit klinik mobil.' },
      { id: 103, fiscalYearId: 2, nomorProgram: 'CSR-23-001', namaProgram: 'Go Green: Tanam 1000 Mangrove', deskripsiProgram: 'Program reboisasi kawasan pesisir dengan penanaman 1000 bibit mangrove untuk mencegah abrasi.' },
      { id: 104, fiscalYearId: 2, nomorProgram: 'CSR-23-002', namaProgram: 'Pelatihan UMKM Digital', deskripsiProgram: 'Memberikan pelatihan pemasaran digital kepada pelaku UMKM lokal untuk meningkatkan daya saing.' }
  ] as ProgramCSR[],
  pilarCSR: [
    { id: 1, namaPilar: 'Pendidikan', deskripsi: 'Meningkatkan kualitas pendidikan dan akses belajar bagi masyarakat.' },
    { id: 2, namaPilar: 'Kesehatan', deskripsi: 'Meningkatkan akses dan kualitas layanan kesehatan bagi masyarakat.' },
    { id: 3, namaPilar: 'Lingkungan', deskripsi: 'Menjaga kelestarian lingkungan dan mempromosikan pembangunan berkelanjutan.' },
    { id: 4, namaPilar: 'Pemberdayaan Ekonomi', deskripsi: 'Mendorong kemandirian ekonomi masyarakat melalui pelatihan dan pendampingan usaha.' },
  ] as PilarCSR[],
  sdgs: [
      // Data SDGs lengkap di sini untuk keringkasan... (asumsi data sama seperti sebelumnya)
      { id: 1, goal: '1. Tanpa Kemiskinan', logo: 'https://i.ibb.co/GQLF3tq/E-SDG-Icons-01.png', description: 'Mengakhiri kemiskinan dalam segala bentuk di mana pun.', indicators: ['Mengurangi setidaknya setengah proporsi laki-laki, perempuan, dan anak-anak dari segala usia, yang hidup dalam kemiskinan.', 'Menerapkan sistem dan langkah-langkah perlindungan sosial yang tepat secara nasional.', 'Membangun ketahanan masyarakat miskin dan mereka yang berada dalam situasi rentan.'] },
      { id: 2, goal: '2. Tanpa Kelaparan', logo: 'https://i.ibb.co/3Y4Y4z7/E-SDG-Icons-02.png', description: 'Mengakhiri kelaparan, mencapai ketahanan pangan dan gizi yang baik, serta meningkatkan pertanian berkelanjutan.', indicators: ['Menjamin akses terhadap pangan yang aman, bergizi, dan cukup bagi semua orang sepanjang tahun.', 'Mengakhiri segala bentuk malnutrisi.', 'Menggandakan produktivitas pertanian dan pendapatan produsen makanan skala kecil.'] },
      { id: 3, goal: '3. Kehidupan Sehat dan Sejahtera', logo: 'https://i.ibb.co/C0Q3Jbp/E-SDG-Icons-03.png', description: 'Memastikan kehidupan yang sehat dan mendukung kesejahteraan bagi semua untuk semua usia.', indicators: ['Mengurangi rasio angka kematian ibu.', 'Mengakhiri kematian bayi dan balita yang dapat dicegah.', 'Mengakhiri epidemi AIDS, tuberkulosis, malaria, dan penyakit menular lainnya.'] },
      { id: 4, goal: '4. Pendidikan Berkualitas', logo: 'https://i.ibb.co/xLg0xG2/E-SDG-Icons-04.png', description: 'Memastikan pendidikan yang inklusif dan berkualitas setara, juga mendukung kesempatan belajar seumur hidup bagi semua.', indicators: ['Memastikan bahwa semua anak perempuan dan laki-laki menyelesaikan pendidikan dasar dan menengah yang gratis, setara, dan berkualitas.', 'Memastikan bahwa semua anak perempuan dan laki-laki memiliki akses terhadap pengembangan, pengasuhan, dan pendidikan anak usia dini yang berkualitas.', 'Menghilangkan kesenjangan gender dalam pendidikan.'] },
      { id: 5, goal: '5. Kesetaraan Gender', logo: 'https://i.ibb.co/6rC63rZ/E-SDG-Icons-05.png', description: 'Mencapai kesetaraan gender dan memberdayakan semua perempuan dan anak perempuan.', indicators: ['Mengakhiri segala bentuk diskriminasi terhadap kaum perempuan di mana pun.', 'Menghapuskan segala bentuk kekerasan terhadap kaum perempuan di ruang publik dan privat.', 'Menjamin partisipasi penuh dan efektif, dan kesempatan yang sama untuk kepemimpinan.'] },
      { id: 6, goal: '6. Air Bersih dan Sanitasi Layak', logo: 'https://i.ibb.co/2tq2S9C/E-SDG-Icons-06.png', description: 'Memastikan ketersediaan dan manajemen air bersih yang berkelanjutan dan sanitasi bagi semua.', indicators: ['Mencapai akses universal dan merata terhadap air minum yang aman dan terjangkau bagi semua.', 'Mencapai akses terhadap sanitasi dan kebersihan yang memadai dan merata bagi semua.', 'Meningkatkan kualitas air dengan mengurangi polusi.'] },
      { id: 7, goal: '7. Energi Bersih dan Terjangkau', logo: 'https://i.ibb.co/Ycm9v0C/E-SDG-Icons-07.png', description: 'Memastikan akses terhadap energi yang terjangkau, dapat diandalkan, berkelanjutan dan modern bagi semua.', indicators: ['Menjamin akses universal terhadap layanan energi yang terjangkau, andal, dan modern.', 'Meningkatkan secara substansial pangsa energi terbarukan dalam bauran energi global.', 'Menggandakan tingkat peningkatan efisiensi energi global.'] },
      { id: 8, goal: '8. Pekerjaan Layak dan Pertumbuhan Ekonomi', logo: 'https://i.ibb.co/mFGM4H2/E-SDG-Icons-08.png', description: 'Mendukung pertumbuhan ekonomi yang inklusif dan berkelanjutan, tenaga kerja penuh dan produktif, dan pekerjaan yang layak bagi semua.', indicators: ['Mempertahankan pertumbuhan ekonomi per kapita sesuai dengan kondisi nasional.', 'Mencapai tingkat produktivitas ekonomi yang lebih tinggi melalui diversifikasi, peningkatan teknologi dan inovasi.', 'Menciptakan lapangan kerja yang layak bagi semua perempuan dan laki-laki, termasuk kaum muda dan penyandang disabilitas.'] },
      { id: 9, goal: '9. Industri, Inovasi, dan Infrastruktur', logo: 'https://i.ibb.co/SmdTzY1/E-SDG-Icons-09.png', description: 'Membangun infrastruktur yang tangguh, meningkatkan industrialisasi inklusif dan berkelanjutan, serta mendorong inovasi.', indicators: ['Membangun infrastruktur berkualitas, andal, berkelanjutan dan tangguh.', 'Meningkatkan industrialisasi yang inklusif dan berkelanjutan.', 'Meningkatkan akses industri dan perusahaan skala kecil terhadap jasa keuangan, termasuk kredit terjangkau.'] },
      { id: 10, goal: '10. Mengurangi Kesenjangan', logo: 'https://i.ibb.co/hK7sYJ3/E-SDG-Icons-10.png', description: 'Mengurangi kesenjangan di dalam dan antar negara.', indicators: ['Secara progresif mencapai dan mempertahankan pertumbuhan pendapatan dari 40 persen populasi yang paling bawah.', 'Memberdayakan dan meningkatkan inklusi sosial, ekonomi, dan politik bagi semua.', 'Menjamin kesempatan yang sama dan mengurangi kesenjangan hasil.'] },
      { id: 11, goal: '11. Kota dan Pemukiman Berkelanjutan', logo: 'https://i.ibb.co/Wc6Y7dF/E-SDG-Icons-11.png', description: 'Membangun kota dan pemukiman manusia yang inklusif, aman, tangguh, dan berkelanjutan.', indicators: ['Menjamin akses bagi semua terhadap perumahan dan pelayanan dasar yang layak, aman dan terjangkau.', 'Menyediakan akses terhadap sistem transportasi yang aman, terjangkau, mudah diakses dan berkelanjutan bagi semua.', 'Mengurangi dampak lingkungan perkotaan per kapita yang merugikan.'] },
      { id: 12, goal: '12. Konsumsi dan Produksi yang Bertanggung Jawab', logo: 'https://i.ibb.co/Y2gT9zW/E-SDG-Icons-12.png', description: 'Memastikan pola konsumsi dan produksi yang berkelanjutan.', indicators: ['Menerapkan Kerangka Kerja 10 Tahun Program tentang Konsumsi dan Produksi Berkelanjutan.', 'Mencapai pengelolaan sumber daya alam yang berkelanjutan dan efisien.', 'Mengurangi separuh limbah pangan per kapita global di tingkat ritel dan konsumen.'] },
      { id: 13, goal: '13. Penanganan Perubahan Iklim', logo: 'https://i.ibb.co/7K4s9tL/E-SDG-Icons-13.png', description: 'Mengambil aksi segera untuk memerangi perubahan iklim dan dampaknya.', indicators: ['Memperkuat ketahanan dan kapasitas adaptasi terhadap bahaya terkait iklim dan bencana alam di semua negara.', 'Mengintegrasikan tindakan perubahan iklim ke dalam kebijakan, strategi, dan perencanaan nasional.', 'Meningkatkan pendidikan, penyadaran, serta kapasitas manusia dan kelembagaan mengenai mitigasi dan adaptasi perubahan iklim.'] },
      { id: 14, goal: '14. Ekosistem Lautan', logo: 'https://i.ibb.co/pwnvYpS/E-SDG-Icons-14.png', description: 'Melestarikan dan memanfaatkan secara berkelanjutan samudra, laut, dan sumber daya kelautan untuk pembangunan berkelanjutan.', indicators: ['Mencegah dan secara signifikan mengurangi segala jenis polusi laut.', 'Mengelola dan melindungi ekosistem laut dan pesisir secara berkelanjutan.', 'Mengakhiri penangkapan ikan yang berlebihan, ilegal, tidak dilaporkan dan tidak diatur.'] },
      { id: 15, goal: '15. Ekosistem Daratan', logo: 'https://i.ibb.co/9Vz1PCG/E-SDG-Icons-15.png', description: 'Melindungi, memulihkan, dan mendukung penggunaan yang berkelanjutan terhadap ekosistem daratan.', indicators: ['Menjamin pelestarian, pemulihan dan pemanfaatan berkelanjutan ekosistem darat dan air tawar.', 'Mendorong pengelolaan semua jenis hutan secara berkelanjutan, menghentikan deforestasi.', 'Memerangi penggurunan, memulihkan lahan dan tanah yang terdegradasi.'] },
      { id: 16, goal: '16. Perdamaian, Keadilan, dan Kelembagaan yang Tangguh', logo: 'https://i.ibb.co/pznGgnj/E-SDG-Icons-16.png', description: 'Mendukung masyarakat yang damai dan inklusif untuk pembangunan berkelanjutan, menyediakan akses terhadap keadilan bagi semua, dan membangun institusi yang efektif, akuntabel, dan inklusif di semua tingkatan.', indicators: ['Secara signifikan mengurangi segala bentuk kekerasan dan tingkat kematian terkait di mana pun.', 'Mengakhiri pelecehan, eksploitasi, perdagangan, dan segala bentuk kekerasan dan penyiksaan terhadap anak.', 'Meningkatkan supremasi hukum di tingkat nasional dan internasional dan menjamin akses yang sama terhadap keadilan bagi semua.'] },
      { id: 17, goal: '17. Kemitraan untuk Mencapai Tujuan', logo: 'https://i.ibb.co/CKGg0t4/E-SDG-Icons-17.png', description: 'Memperkuat sarana pelaksanaan dan merevitalisasi kemitraan global untuk pembangunan berkelanjutan.', indicators: ['Memperkuat mobilisasi sumber daya domestik, termasuk melalui dukungan internasional kepada negara-negara berkembang.', 'Negara-negara maju untuk mengimplementasikan secara penuh komitmen ODA mereka.', 'Meningkatkan kerjasama Utara-Selatan, Selatan-Selatan, dan kerjasama regional segitiga dan internasional.'] },
  ] as SDG[],
  tingkatKemungkinanRisiko: [
      { id: 1, level: 1, keterangan: 'Sangat Jarang', persentase: '< 10%' }, { id: 2, level: 2, keterangan: 'Jarang', persentase: '10% - 30%' }, { id: 3, level: 3, keterangan: 'Kadang-kadang', persentase: '30% - 50%' }, { id: 4, level: 4, keterangan: 'Sering', persentase: '50% - 70%' }, { id: 5, level: 5, keterangan: 'Sangat Sering', persentase: '> 70%' },
  ] as TingkatKemungkinanRisiko[],
  dampakRisiko: [
      { id: 1, level: 1, dampak: 'Sangat Rendah' }, { id: 2, level: 2, dampak: 'Rendah' }, { id: 3, level: 3, dampak: 'Sedang' }, { id: 4, level: 4, dampak: 'Tinggi' }, { id: 5, level: 5, dampak: 'Sangat Tinggi' },
  ] as DampakRisiko[],
  tingkatRisiko: [
      { id: 1, level: 1, tingkat: 'Sangat Rendah', deskripsi: 'Risiko dapat diterima tanpa perlu penanganan lebih lanjut.', warna: 'bg-blue-500' }, { id: 2, level: 2, tingkat: 'Rendah', deskripsi: 'Risiko dapat diterima, namun memerlukan pemantauan.', warna: 'bg-green-500' }, { id: 3, level: 3, tingkat: 'Sedang', deskripsi: 'Risiko memerlukan tindakan mitigasi untuk menurunkannya.', warna: 'bg-yellow-400' }, { id: 4, level: 4, tingkat: 'Tinggi', deskripsi: 'Risiko memerlukan perhatian manajemen dan tindakan mitigasi segera.', warna: 'bg-orange-500' }, { id: 5, level: 5, tingkat: 'Sangat Tinggi', deskripsi: 'Risiko harus dihentikan atau memerlukan tindakan mitigasi yang sangat kuat.', warna: 'bg-red-500' },
  ] as TingkatRisiko[],
  rencanaKegiatan: [
    { id: 1, pemangkuKepentingan: 'Masyarakat Desa Sukamaju', programTerkait: 'Beasiswa Pendidikan Merdeka', bentukKegiatan: 'Sosialisasi & Seleksi', tujuanKegiatan: 'Menjaring siswa berprestasi', frekuensi: '1x', periode: 'Q1 2024', anggaran: 15000000 },
    { id: 2, pemangkuKepentingan: 'Pemerintah Daerah', programTerkait: 'Klinik Sehat Keliling', bentukKegiatan: 'Audiensi & Laporan', tujuanKegiatan: 'Sinergi program kesehatan', frekuensi: 'Per Kuartal', periode: '2024', anggaran: 5000000 },
    { id: 3, pemangkuKepentingan: 'Yayasan Peduli Lingkungan', programTerkait: 'Go Green: Tanam 1000 Mangrove', bentukKegiatan: 'Kerja Bakti Bersama', tujuanKegiatan: 'Pelibatan aktif dalam reboisasi', frekuensi: '2x', periode: 'Q2 & Q4 2024', anggaran: 7500000 },
  ] as RencanaKegiatan[],
  profilPemangkuKepentinganData: [
    { id: 1, nama: 'Pemerintah Daerah', kategori: 'Eksternal', tipe: 'Pemerintah', deskripsi: 'Regulator dan partner strategis dalam implementasi program di tingkat lokal.', strategiKomunikasi: 'Audiensi rutin, laporan berkala, dan kolaborasi dalam acara bersama.' },
    { id: 2, nama: 'Masyarakat Desa Sukamaju', kategori: 'Eksternal', tipe: 'Masyarakat', deskripsi: 'Penerima manfaat utama dari program pemberdayaan dan lingkungan.', strategiKomunikasi: 'Sosialisasi langsung, forum warga, dan pelibatan dalam perencanaan kegiatan.' },
    { id: 3, nama: 'Karyawan PT Tomo', kategori: 'Internal', tipe: 'Karyawan', deskripsi: 'Pelaksana dan sukarelawan dalam berbagai kegiatan CSR.', strategiKomunikasi: 'Internal memo, buletin CSR, dan program volunteering.' },
    { id: 4, nama: 'Yayasan Peduli Lingkungan', kategori: 'Eksternal', tipe: 'LSM', deskripsi: 'Partner dalam program reboisasi dan pengelolaan sampah.', strategiKomunikasi: 'Rapat koordinasi proyek, workshop bersama, dan publikasi gabungan.' },
  ] as ProfilPemangkuKepentingan[],
  tipePemangkuKepentinganData: [
    { id: 1, namaTipe: 'Pemerintah', deskripsi: 'Entitas pemerintahan, baik pusat maupun daerah.' }, { id: 2, namaTipe: 'LSM', deskripsi: 'Lembaga Swadaya Masyarakat atau Non-Governmental Organization (NGO).' }, { id: 3, namaTipe: 'Masyarakat', deskripsi: 'Komunitas atau individu yang tinggal di sekitar wilayah operasi.' }, { id: 4, namaTipe: 'Media', deskripsi: 'Institusi media massa, baik cetak, elektronik, maupun digital.' }, { id: 5, namaTipe: 'Investor', deskripsi: 'Pemegang saham atau pihak yang menanamkan modal.' }, { id: 6, namaTipe: 'Karyawan', deskripsi: 'Seluruh sumber daya manusia internal perusahaan.' }, { id: 7, namaTipe: 'Lainnya', deskripsi: 'Tipe lain yang tidak termasuk dalam kategori di atas.' },
  ] as TipePemangkuKepentingan[],
  pelaksanaanKegiatanData: [
    { id: 1, rencanaKegiatanId: 1, tanggalPelaksanaan: '2024-02-15', lokasi: 'Balai Desa Sukamaju', realisasiAnggaran: 14500000, jumlahPeserta: 50, hasilKegiatan: 'Terjaring 20 siswa potensial untuk seleksi tahap berikutnya. Antusiasme masyarakat sangat tinggi.' },
    { id: 2, rencanaKegiatanId: 3, tanggalPelaksanaan: '2024-04-22', lokasi: 'Pesisir Pantai Harapan', realisasiAnggaran: 7000000, jumlahPeserta: 75, hasilKegiatan: 'Berhasil menanam 500 bibit mangrove di area seluas 1 hektar. Melibatkan partisipasi aktif dari LSM dan masyarakat.' },
  ] as PelaksanaanKegiatan[],
};

// --- Local Storage Persistence Layer ---
const saveDbToLocalStorage = (db: typeof mockData) => {
    try {
        const dataToSave = {
            ...db,
            nextIds: {
                nextFiscalYearId,
                nextProgramId,
                nextPilarCSRId,
                nextTingkatKemungkinanId,
                nextDampakRisikoId,
                nextTingkatRisikoId,
                nextRencanaKegiatanId,
                nextProfilPemangkuKepentinganId,
                nextTipePemangkuKepentinganId,
                nextPelaksanaanKegiatanId,
            }
        };
        localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (e) {
        console.error("Could not save to localStorage", e);
    }
};

const loadDbFromLocalStorage = (): typeof mockData | null => {
    try {
        const storedDb = localStorage.getItem(DB_STORAGE_KEY);
        if (storedDb) {
            const parsed = JSON.parse(storedDb);
            // Restore nextId counters
            const nextIds = parsed.nextIds || {};
            nextFiscalYearId = nextIds.nextFiscalYearId || Math.max(4, ...parsed.fiscalYears.map((i: any) => i.id) + 1);
            nextProgramId = nextIds.nextProgramId || Math.max(105, ...parsed.programsCSR.map((i: any) => i.id) + 1);
            nextPilarCSRId = nextIds.nextPilarCSRId || Math.max(5, ...parsed.pilarCSR.map((i: any) => i.id) + 1);
            nextTingkatKemungkinanId = nextIds.nextTingkatKemungkinanId || Math.max(6, ...parsed.tingkatKemungkinanRisiko.map((i: any) => i.id) + 1);
            nextDampakRisikoId = nextIds.nextDampakRisikoId || Math.max(6, ...parsed.dampakRisiko.map((i: any) => i.id) + 1);
            nextTingkatRisikoId = nextIds.nextTingkatRisikoId || Math.max(6, ...parsed.tingkatRisiko.map((i: any) => i.id) + 1);
            nextRencanaKegiatanId = nextIds.nextRencanaKegiatanId || Math.max(4, ...parsed.rencanaKegiatan.map((i: any) => i.id) + 1);
            nextProfilPemangkuKepentinganId = nextIds.nextProfilPemangkuKepentinganId || Math.max(5, ...parsed.profilPemangkuKepentinganData.map((i: any) => i.id) + 1);
            nextTipePemangkuKepentinganId = nextIds.nextTipePemangkuKepentinganId || Math.max(8, ...parsed.tipePemangkuKepentinganData.map((i: any) => i.id) + 1);
            nextPelaksanaanKegiatanId = nextIds.nextPelaksanaanKegiatanId || Math.max(3, ...parsed.pelaksanaanKegiatanData.map((i: any) => i.id) + 1);
            delete parsed.nextIds;
            return parsed;
        }
        return null;
    } catch (e) {
        console.error("Could not load from localStorage", e);
        return null;
    }
};

// Initialize DB
let mockData = loadDbFromLocalStorage() || defaultMockData;
if (!localStorage.getItem(DB_STORAGE_KEY)) {
    // Set initial next IDs if loading for the first time
    nextFiscalYearId = 4;
    nextProgramId = 105;
    nextPilarCSRId = 5;
    nextTingkatKemungkinanId = 6;
    nextDampakRisikoId = 6;
    nextTingkatRisikoId = 6;
    nextRencanaKegiatanId = 4;
    nextProfilPemangkuKepentinganId = 5;
    nextTipePemangkuKepentinganId = 8;
    nextPelaksanaanKegiatanId = 3;
    saveDbToLocalStorage(mockData);
}


// --- MOCK API SIMULATION ---
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const mockApi = async <T>(endpoint: string, options: { method?: string; body?: any; } = {}): Promise<T> => {
    const method = options.method || 'GET';
    const body = options.body;
    console.log(`[API Sim] ${method} ${endpoint}`, body || '');

    await delay(Math.random() * 400 + 100);

    const handleSuccess = (data: any) => ({ success: true, data });
    const handleFailure = (message: string) => ({ success: false, message });

    // --- Endpoint Routing ---

    if (method === 'GET') {
        switch (endpoint) {
            case '/slides': return mockData.slides as any;
            case '/news': return mockData.news as any;
            case '/sdgs': return mockData.sdgs as any;
            case '/fiscal-years': return [...mockData.fiscalYears].sort((a,b) => parseInt(b.tahunFiskal) - parseInt(a.tahunFiskal)) as any;
            case '/programs': return mockData.programsCSR as any;
            case '/pilars': return [...mockData.pilarCSR].sort((a, b) => a.namaPilar.localeCompare(b.namaPilar)) as any;
            case '/risk/likelihood': return [...mockData.tingkatKemungkinanRisiko].sort((a,b) => a.level - b.level) as any;
            case '/risk/impact': return [...mockData.dampakRisiko].sort((a,b) => a.level - b.level) as any;
            case '/risk/level': return [...mockData.tingkatRisiko].sort((a,b) => a.level - b.level) as any;
            case '/stakeholders/plans': return [...mockData.rencanaKegiatan].sort((a, b) => a.pemangkuKepentingan.localeCompare(b.pemangkuKepentingan)) as any;
            case '/stakeholders/profiles': return [...mockData.profilPemangkuKepentinganData].sort((a,b) => a.nama.localeCompare(b.nama)) as any;
            case '/stakeholders/types': return [...mockData.tipePemangkuKepentinganData].sort((a,b) => a.namaTipe.localeCompare(b.namaTipe)) as any;
            case '/stakeholders/implementations': return [...mockData.pelaksanaanKegiatanData].sort((a, b) => new Date(b.tanggalPelaksanaan).getTime() - new Date(a.tanggalPelaksanaan).getTime()) as any;
            case '/users': return mockData.users.map(({ password, ...user }) => user) as any;
        }
    }
    
    if(endpoint === '/auth/login' && method === 'POST') {
        const { username, password } = body;
        const user = mockData.users.find(u => u.username.toLowerCase() === username.toLowerCase());
        if (!user) return handleFailure('Username tidak ditemukan.') as any;
        if (user.password !== password) return handleFailure('Password yang Anda masukkan salah.') as any;
        const { password: _, ...userWithoutPassword } = user;
        return { success: true, message: 'Login berhasil!', user: userWithoutPassword } as any;
    }

    const resourceMatch = endpoint.match(/^\/([a-zA-Z/-]+?)(?:\/(\d+))?$/);
    if(resourceMatch) {
        const resource = resourceMatch[1];
        const id = resourceMatch[2] ? parseInt(resourceMatch[2], 10) : null;
        
        let table: any[] | undefined;
        let nextIdRef: { value: number } | undefined;

        switch(resource) {
            case 'fiscal-years': table = mockData.fiscalYears; nextIdRef = { get value() { return nextFiscalYearId; }, set value(v) { nextFiscalYearId = v; } }; break;
            case 'programs': table = mockData.programsCSR; nextIdRef = { get value() { return nextProgramId; }, set value(v) { nextProgramId = v; } }; break;
            case 'pilars': table = mockData.pilarCSR; nextIdRef = { get value() { return nextPilarCSRId; }, set value(v) { nextPilarCSRId = v; } }; break;
            case 'sdgs': table = mockData.sdgs; break; 
            case 'risk/likelihood': table = mockData.tingkatKemungkinanRisiko; nextIdRef = { get value() { return nextTingkatKemungkinanId; }, set value(v) { nextTingkatKemungkinanId = v; } }; break;
            case 'risk/impact': table = mockData.dampakRisiko; nextIdRef = { get value() { return nextDampakRisikoId; }, set value(v) { nextDampakRisikoId = v; } }; break;
            case 'risk/level': table = mockData.tingkatRisiko; nextIdRef = { get value() { return nextTingkatRisikoId; }, set value(v) { nextTingkatRisikoId = v; } }; break;
            case 'stakeholders/plans': table = mockData.rencanaKegiatan; nextIdRef = { get value() { return nextRencanaKegiatanId; }, set value(v) { nextRencanaKegiatanId = v; } }; break;
            case 'stakeholders/profiles': table = mockData.profilPemangkuKepentinganData; nextIdRef = { get value() { return nextProfilPemangkuKepentinganId; }, set value(v) { nextProfilPemangkuKepentinganId = v; } }; break;
            case 'stakeholders/types': table = mockData.tipePemangkuKepentinganData; nextIdRef = { get value() { return nextTipePemangkuKepentinganId; }, set value(v) { nextTipePemangkuKepentinganId = v; } }; break;
            case 'stakeholders/implementations': table = mockData.pelaksanaanKegiatanData; nextIdRef = { get value() { return nextPelaksanaanKegiatanId; }, set value(v) { nextPelaksanaanKegiatanId = v; } }; break;
        }

        if(table) {
            if(method === 'POST' && nextIdRef) {
                const newItem = { ...body, id: nextIdRef.value++ };
                table.unshift(newItem);
                saveDbToLocalStorage(mockData);
                return newItem as any;
            }
            if (id !== null) {
                const itemIndex = table.findIndex(item => item.id === id);
                if (itemIndex === -1) return handleFailure('Item not found') as any;

                if (method === 'PUT') {
                    table[itemIndex] = { ...table[itemIndex], ...body };
                    saveDbToLocalStorage(mockData);
                    return table[itemIndex] as any;
                }
                if (method === 'DELETE') {
                    table.splice(itemIndex, 1);
                    saveDbToLocalStorage(mockData);
                    return handleSuccess({}) as any;
                }
            }
        }
    }

    if (endpoint.match(/^\/fiscal-years\/(\d+)\/set-active$/) && method === 'POST') {
        const id = parseInt(endpoint.split('/')[2]);
        let found = false;
        mockData.fiscalYears = mockData.fiscalYears.map(y => {
            if (y.id === id) { found = true; return { ...y, isActive: true }; }
            return { ...y, isActive: false };
        });
        saveDbToLocalStorage(mockData);
        return (found ? mockData.fiscalYears.find(y => y.isActive) : null) as any;
    }

    throw new Error(`[API Sim] Unknown endpoint or method: ${method} ${endpoint}`);
};


// --- EXPORTED API FUNCTIONS ---
export const getSlides = (): Promise<Slide[]> => mockApi('/slides');
export const getNews = (): Promise<NewsArticle[]> => mockApi('/news');
export const getSDGs = (): Promise<SDG[]> => mockApi('/sdgs');
export const updateSDG = (updatedSdg: SDG): Promise<SDG> => mockApi(`/sdgs/${updatedSdg.id}`, { method: 'PUT', body: updatedSdg });

export const getFiscalYears = (): Promise<FiscalYear[]> => mockApi('/fiscal-years');
export const addFiscalYear = (yearData: Omit<FiscalYear, 'id' | 'isActive'>): Promise<FiscalYear> => mockApi('/fiscal-years', { method: 'POST', body: { ...yearData, isActive: false } });
export const updateFiscalYear = (id: number, yearData: Partial<Omit<FiscalYear, 'id' | 'isActive'>>): Promise<FiscalYear> => mockApi(`/fiscal-years/${id}`, { method: 'PUT', body: yearData });
export const deleteFiscalYear = async (id: number): Promise<{ success: boolean; message?: string }> => {
    const yearToDelete = mockData.fiscalYears.find(y => y.id === id);
    if (!yearToDelete) return { success: false, message: 'Tahun fiskal tidak ditemukan.' };
    if (yearToDelete.isActive) return { success: false, message: 'Tidak dapat menghapus tahun fiskal yang aktif.' };
    await mockApi(`/fiscal-years/${id}`, { method: 'DELETE' });
    return { success: true };
};
export const setActiveFiscalYear = (id: number): Promise<FiscalYear | null> => mockApi(`/fiscal-years/${id}/set-active`, { method: 'POST' });

export const getProgramCSR = (): Promise<ProgramCSR[]> => mockApi('/programs');
export const addProgramCSR = (programData: Omit<ProgramCSR, 'id'>): Promise<ProgramCSR> => mockApi('/programs', { method: 'POST', body: programData });
export const updateProgramCSR = (id: number, programData: Partial<Omit<ProgramCSR, 'id' | 'fiscalYearId'>>): Promise<ProgramCSR> => mockApi(`/programs/${id}`, { method: 'PUT', body: programData });
export const deleteProgramCSR = (id: number): Promise<{ success: boolean }> => mockApi(`/programs/${id}`, { method: 'DELETE' });

export const getPilarCSR = (): Promise<PilarCSR[]> => mockApi('/pilars');
export const addPilarCSR = (data: Omit<PilarCSR, 'id'>): Promise<PilarCSR> => mockApi('/pilars', { method: 'POST', body: data });
export const updatePilarCSR = (id: number, data: Partial<Omit<PilarCSR, 'id'>>): Promise<PilarCSR> => mockApi(`/pilars/${id}`, { method: 'PUT', body: data });
export const deletePilarCSR = (id: number): Promise<{ success: boolean }> => mockApi(`/pilars/${id}`, { method: 'DELETE' });

export const getTingkatKemungkinanRisiko = (): Promise<TingkatKemungkinanRisiko[]> => mockApi('/risk/likelihood');
export const addTingkatKemungkinanRisiko = (data: Omit<TingkatKemungkinanRisiko, 'id'>): Promise<TingkatKemungkinanRisiko> => mockApi('/risk/likelihood', { method: 'POST', body: data });
export const updateTingkatKemungkinanRisiko = (id: number, data: Partial<Omit<TingkatKemungkinanRisiko, 'id'>>): Promise<TingkatKemungkinanRisiko> => mockApi(`/risk/likelihood/${id}`, { method: 'PUT', body: data });
export const deleteTingkatKemungkinanRisiko = (id: number): Promise<{ success: boolean }> => mockApi(`/risk/likelihood/${id}`, { method: 'DELETE' });

export const getDampakRisiko = (): Promise<DampakRisiko[]> => mockApi('/risk/impact');
export const addDampakRisiko = (data: Omit<DampakRisiko, 'id'>): Promise<DampakRisiko> => mockApi('/risk/impact', { method: 'POST', body: data });
export const updateDampakRisiko = (id: number, data: Partial<Omit<DampakRisiko, 'id'>>): Promise<DampakRisiko> => mockApi(`/risk/impact/${id}`, { method: 'PUT', body: data });
export const deleteDampakRisiko = (id: number): Promise<{ success: boolean }> => mockApi(`/risk/impact/${id}`, { method: 'DELETE' });

export const getTingkatRisiko = (): Promise<TingkatRisiko[]> => mockApi('/risk/level');
export const addTingkatRisiko = (data: Omit<TingkatRisiko, 'id'>): Promise<TingkatRisiko> => mockApi('/risk/level', { method: 'POST', body: data });
export const updateTingkatRisiko = (id: number, data: Partial<Omit<TingkatRisiko, 'id'>>): Promise<TingkatRisiko> => mockApi(`/risk/level/${id}`, { method: 'PUT', body: data });
export const deleteTingkatRisiko = (id: number): Promise<{ success: boolean }> => mockApi(`/risk/level/${id}`, { method: 'DELETE' });

export const getRencanaKegiatan = (): Promise<RencanaKegiatan[]> => mockApi('/stakeholders/plans');
export const addRencanaKegiatan = (data: Omit<RencanaKegiatan, 'id'>): Promise<RencanaKegiatan> => mockApi('/stakeholders/plans', { method: 'POST', body: data });
export const updateRencanaKegiatan = (id: number, data: Partial<Omit<RencanaKegiatan, 'id'>>): Promise<RencanaKegiatan> => mockApi(`/stakeholders/plans/${id}`, { method: 'PUT', body: data });
export const deleteRencanaKegiatan = (id: number): Promise<{ success: boolean }> => mockApi(`/stakeholders/plans/${id}`, { method: 'DELETE' });

export const getProfilPemangkuKepentingan = (): Promise<ProfilPemangkuKepentingan[]> => mockApi('/stakeholders/profiles');
export const addProfilPemangkuKepentingan = (data: Omit<ProfilPemangkuKepentingan, 'id'>): Promise<ProfilPemangkuKepentingan> => mockApi('/stakeholders/profiles', { method: 'POST', body: data });
export const updateProfilPemangkuKepentingan = (id: number, data: Partial<Omit<ProfilPemangkuKepentingan, 'id'>>): Promise<ProfilPemangkuKepentingan> => mockApi(`/stakeholders/profiles/${id}`, { method: 'PUT', body: data });
export const deleteProfilPemangkuKepentingan = (id: number): Promise<{ success: boolean }> => mockApi(`/stakeholders/profiles/${id}`, { method: 'DELETE' });

export const getTipePemangkuKepentingan = (): Promise<TipePemangkuKepentingan[]> => mockApi('/stakeholders/types');
export const addTipePemangkuKepentingan = (data: Omit<TipePemangkuKepentingan, 'id'>): Promise<TipePemangkuKepentingan> => mockApi('/stakeholders/types', { method: 'POST', body: data });
export const updateTipePemangkuKepentingan = (id: number, data: Partial<Omit<TipePemangkuKepentingan, 'id'>>): Promise<TipePemangkuKepentingan> => mockApi(`/stakeholders/types/${id}`, { method: 'PUT', body: data });
export const deleteTipePemangkuKepentingan = (id: number): Promise<{ success: boolean }> => mockApi(`/stakeholders/types/${id}`, { method: 'DELETE' });

export const getPelaksanaanKegiatan = (): Promise<PelaksanaanKegiatan[]> => mockApi('/stakeholders/implementations');
export const addPelaksanaanKegiatan = (data: Omit<PelaksanaanKegiatan, 'id'>): Promise<PelaksanaanKegiatan> => mockApi('/stakeholders/implementations', { method: 'POST', body: data });
export const updatePelaksanaanKegiatan = (id: number, data: Partial<Omit<PelaksanaanKegiatan, 'id'>>): Promise<PelaksanaanKegiatan> => mockApi(`/stakeholders/implementations/${id}`, { method: 'PUT', body: data });
export const deletePelaksanaanKegiatan = (id: number): Promise<{ success: boolean }> => mockApi(`/stakeholders/implementations/${id}`, { method: 'DELETE' });

export const getUsers = (): Promise<Omit<User, 'password'>[]> => mockApi('/users');
export const authenticateUser = (username: string, password: string): Promise<{success: boolean; message: string; user?: User}> => mockApi('/auth/login', { method: 'POST', body: { username, password } });
export const getAllDataForBackup = async () => mockData;