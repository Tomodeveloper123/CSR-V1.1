import React from 'react';

// Data for each quadrant
const quadrantData = {
  manageClosely: {
    title: 'Kelola Secara Dekat (Manage Closely)',
    description: 'Pemangku kepentingan ini memiliki kekuatan besar dan minat tinggi. Libatkan mereka sepenuhnya dan lakukan upaya terbesar untuk memuaskan mereka.',
    stakeholders: ['Pemerintah Pusat', 'Investor Utama', 'Manajemen Senior Perusahaan'],
    bgColor: 'bg-green-50',
    borderColor: 'border-green-400'
  },
  keepSatisfied: {
    title: 'Jaga Tetap Puas (Keep Satisfied)',
    description: 'Kelompok ini punya kekuatan, tapi minatnya rendah. Berikan informasi yang cukup untuk membuat mereka tetap puas, tapi jangan sampai mereka bosan dengan komunikasi berlebihan.',
    stakeholders: ['Lembaga Keuangan', 'Regulator Industri', 'Serikat Pekerja'],
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-400'
  },
  keepInformed: {
    title: 'Jaga Tetap Terinformasi (Keep Informed)',
    description: 'Mereka memiliki sedikit kekuatan namun minatnya tinggi. Beri mereka informasi yang memadai dan bicaralah dengan mereka untuk memastikan tidak ada masalah besar yang muncul.',
    stakeholders: ['Masyarakat Lokal Terdampak', 'Karyawan Proyek', 'LSM Lingkungan'],
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-400'
  },
  monitor: {
    title: 'Pantau (Monitor)',
    description: 'Awasi kelompok ini, tetapi jangan berlebihan dalam komunikasi yang membosankan. Mereka cenderung tidak menjadi subjek minat utama.',
    stakeholders: ['Pemasok Non-Kritis', 'Publik Umum', 'Media Lokal'],
    bgColor: 'bg-gray-100',
    borderColor: 'border-gray-400'
  }
};

const QuadrantCard: React.FC<{ data: typeof quadrantData.manageClosely }> = ({ data }) => (
  <div className={`p-6 rounded-lg h-full flex flex-col ${data.bgColor} border-t-4 ${data.borderColor} shadow-sm`}>
    <h3 className="text-lg font-bold text-gray-800 mb-2">{data.title}</h3>
    <p className="text-sm text-gray-600 mb-4 flex-grow">{data.description}</p>
    <div>
      <h4 className="font-semibold text-gray-700 mb-2 text-sm">Contoh:</h4>
      <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
        {data.stakeholders.map(stakeholder => <li key={stakeholder}>{stakeholder}</li>)}
      </ul>
    </div>
  </div>
);

const KuadranPemangkuKepentingan: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800">Matriks Pemangku Kepentingan</h1>
      <p className="mt-2 text-gray-600 mb-8">Analisis Pemangku Kepentingan Berdasarkan Kekuatan dan Kepentingan.</p>
      
      <div className="flex">
        {/* Y-Axis Label */}
        <div className="flex flex-col items-center justify-around w-16 text-sm font-semibold text-gray-600">
          <span className="transform -rotate-90 whitespace-nowrap">Kekuatan Tinggi</span>
          <span className="transform -rotate-90 whitespace-nowrap">Kekuatan Rendah</span>
        </div>

        <div className="flex-1">
          {/* Quadrant Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Top-Left */}
            <QuadrantCard data={quadrantData.keepSatisfied} />
            {/* Top-Right */}
            <QuadrantCard data={quadrantData.manageClosely} />
            {/* Bottom-Left */}
            <QuadrantCard data={quadrantData.monitor} />
            {/* Bottom-Right */}
            <QuadrantCard data={quadrantData.keepInformed} />
          </div>
          
          {/* X-Axis Label */}
          <div className="flex justify-around mt-4 text-sm font-semibold text-gray-600">
            <span>Kepentingan Rendah</span>
            <span>Kepentingan Tinggi</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KuadranPemangkuKepentingan;