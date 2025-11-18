export interface Slide {
  url: string;
  title: string;
  description: string;
}

export interface NewsArticle {
  id: number;
  image: string;
  title: string;
  excerpt: string;
  date: string;
}

export interface User {
  id: number;
  username: string;
  // In a real app, this would never be stored in plain text.
  // This is for simulation purposes only.
  password?: string;
}

export interface FiscalYear {
  id: number;
  tahunFiskal: string;
  tanggalMulai: string;
  tanggalSelesai: string;
  totalAnggaran: number;
  isActive: boolean;
}

// FIX: Add ProgramCSR interface to resolve import error in components/pages/ProgramCSR.tsx.
export interface ProgramCSR {
  id: number;
  fiscalYearId: number;
  nomorProgram: string;
  namaProgram: string;
  deskripsiProgram: string;
}

export interface PilarCSR {
  id: number;
  namaPilar: string;
  deskripsi: string;
}

export interface SDG {
  id: number;
  goal: string;
  logo: string;
  description: string;
  indicators: string[];
}

export interface TingkatKemungkinanRisiko {
  id: number;
  level: number;
  keterangan: string;
  persentase: string;
}

export interface DampakRisiko {
  id: number;
  level: number;
  dampak: string;
}

export interface TingkatRisiko {
  id: number;
  level: number;
  tingkat: string;
  deskripsi: string;
  warna: string;
}

export interface RencanaKegiatan {
  id: number;
  pemangkuKepentingan: string;
  programTerkait: string;
  bentukKegiatan: string;
  tujuanKegiatan: string;
  frekuensi: string;
  periode: string;
  anggaran: number;
}

export interface ProfilPemangkuKepentingan {
  id: number;
  nama: string;
  kategori: 'Internal' | 'Eksternal';
  tipe: string;
  deskripsi: string;
  strategiKomunikasi: string;
}

export interface TipePemangkuKepentingan {
  id: number;
  namaTipe: string;
  deskripsi: string;
}

export interface PelaksanaanKegiatan {
  id: number;
  rencanaKegiatanId: number;
  tanggalPelaksanaan: string;
  lokasi: string;
  realisasiAnggaran: number;
  jumlahPeserta: number;
  hasilKegiatan: string;
}
