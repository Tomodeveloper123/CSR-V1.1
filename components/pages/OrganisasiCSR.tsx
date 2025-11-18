import React, { useState } from 'react';

interface OrganisasiData {
  logo: string;
  nama: string;
  pimpinan: string;
  visi: string;
  misi: string;
}

const OrganisasiCSR: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [orgData, setOrgData] = useState<OrganisasiData>({
    logo: 'https://placeholder.pics/svg/150x150/808080-808080/FFFFFF/Company%20Logo',
    nama: 'PT Tomo Teknologi Sinergi',
    pimpinan: 'Bapak Budi Santoso',
    visi: 'Menjadi perusahaan terdepan dalam inovasi teknologi yang berkelanjutan dan memberikan dampak positif bagi masyarakat.',
    misi: '1. Mengembangkan solusi teknologi yang ramah lingkungan.\n2. Memberdayakan komunitas lokal melalui program pendidikan dan pelatihan.\n3. Menjalankan bisnis dengan integritas dan tanggung jawab sosial.'
  });
  
  const [formData, setFormData] = useState<OrganisasiData>(orgData);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, logo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setOrgData(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(orgData);
    setIsEditing(false);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Organisasi CSR</h1>
      
      {!isEditing ? (
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="flex flex-col md:flex-row md:items-start gap-8">
            <div className="flex-shrink-0">
              <img src={orgData.logo} alt="Logo Organisasi" className="w-40 h-40 rounded-full object-cover border-4 border-gray-200" />
            </div>
            <div className="flex-grow space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-500">Nama Organisasi</h3>
                <p className="text-lg text-gray-800">{orgData.nama}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-500">Pimpinan Organisasi</h3>
                <p className="text-lg text-gray-800">{orgData.pimpinan}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-500">Visi</h3>
                <p className="text-gray-800 whitespace-pre-wrap">{orgData.visi}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-500">Misi</h3>
                <p className="text-gray-800 whitespace-pre-wrap">{orgData.misi}</p>
              </div>
            </div>
          </div>
          <div className="mt-8 text-right">
            <button
              onClick={() => setIsEditing(true)}
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Ubah Data
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSave} className="bg-white p-8 rounded-lg shadow-md space-y-6">
            <div>
                <label htmlFor="logo" className="block text-sm font-medium text-gray-700 mb-2">Logo Organisasi</label>
                <div className="flex items-center gap-4">
                    <img src={formData.logo} alt="Preview Logo" className="w-24 h-24 rounded-full object-cover border-4 border-gray-200" />
                    <input
                        id="logo"
                        name="logo"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                </div>
            </div>

            <div>
                <label htmlFor="nama" className="block text-sm font-medium text-gray-700">Nama Organisasi</label>
                <input
                    type="text"
                    id="nama"
                    name="nama"
                    value={formData.nama}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
            </div>

            <div>
                <label htmlFor="pimpinan" className="block text-sm font-medium text-gray-700">Pimpinan Organisasi</label>
                <input
                    type="text"
                    id="pimpinan"
                    name="pimpinan"
                    value={formData.pimpinan}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
            </div>

            <div>
                <label htmlFor="visi" className="block text-sm font-medium text-gray-700">Visi</label>
                <textarea
                    id="visi"
                    name="visi"
                    rows={3}
                    value={formData.visi}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
            </div>

            <div>
                <label htmlFor="misi" className="block text-sm font-medium text-gray-700">Misi</label>
                <textarea
                    id="misi"
                    name="misi"
                    rows={5}
                    value={formData.misi}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
            </div>

            <div className="flex justify-end gap-4 pt-4">
                <button
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                >
                    Batal
                </button>
                <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Simpan Perubahan
                </button>
            </div>
        </form>
      )}
    </div>
  );
};

export default OrganisasiCSR;
