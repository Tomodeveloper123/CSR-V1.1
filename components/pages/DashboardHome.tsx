import React, { useEffect, useState } from 'react';
import BarChart from '../BarChart';
import { getFiscalYears, getProgramCSR, getRencanaKegiatan } from '../../services/database';
import type { FiscalYear, ProgramCSR, RencanaKegiatan } from '../../types';

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

interface DashboardHomeProps {
    activeFiscalYear: FiscalYear | null;
}

const DashboardHome: React.FC<DashboardHomeProps> = ({ activeFiscalYear }) => {
    const [totalAnggaranChartData, setTotalAnggaranChartData] = useState<{ label: string; value: number; }[]>([]);
    const [totalAnggaranLoading, setTotalAnggaranLoading] = useState(true);

    const [programChartData, setProgramChartData] = useState<{ label: string; value: number; }[]>([]);
    const [programChartLoading, setProgramChartLoading] = useState(true);


    useEffect(() => {
        const fetchData = async () => {
            setTotalAnggaranLoading(true);
            try {
                const fiscalYears: FiscalYear[] = await getFiscalYears();
                const data = fiscalYears
                    .sort((a, b) => parseInt(a.tahunFiskal) - parseInt(b.tahunFiskal))
                    .map(fy => ({
                        label: fy.tahunFiskal,
                        value: fy.totalAnggaran
                    }));
                setTotalAnggaranChartData(data);
            } catch (error) {
                console.error("Failed to fetch fiscal year data for chart:", error);
            } finally {
                setTotalAnggaranLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchProgramData = async () => {
            if (!activeFiscalYear) {
                setProgramChartData([]);
                setProgramChartLoading(false);
                return;
            }

            setProgramChartLoading(true);
            try {
                const [allPrograms, allActivities] = await Promise.all([
                    getProgramCSR(),
                    getRencanaKegiatan()
                ]);

                const activePrograms = allPrograms.filter(p => p.fiscalYearId === activeFiscalYear.id);
                const activeProgramNames = new Set(activePrograms.map(p => p.namaProgram));

                const budgetMap = new Map<string, number>();
                allActivities.forEach(activity => {
                    if (activeProgramNames.has(activity.programTerkait)) {
                        const currentBudget = budgetMap.get(activity.programTerkait) || 0;
                        budgetMap.set(activity.programTerkait, currentBudget + activity.anggaran);
                    }
                });

                const chartData = Array.from(budgetMap.entries()).map(([label, value]) => ({
                    label,
                    value
                }));

                setProgramChartData(chartData);

            } catch (error) {
                console.error("Failed to fetch program budget data for chart:", error);
                setProgramChartData([]);
            } finally {
                setProgramChartLoading(false);
            }
        };

        fetchProgramData();
    }, [activeFiscalYear]);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800">Dasbor CSR</h1>
      <p className="mt-2 text-gray-600 mb-8">Selamat datang di portal Manajemen CSR.</p>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Total Anggaran CSR per Tahun Fiskal</h2>
          {totalAnggaranLoading ? (
              <div className="flex items-center justify-center h-80 bg-gray-100 rounded-md">
                  <p className="text-gray-500">Memuat data grafik...</p>
              </div>
          ) : totalAnggaranChartData.length > 0 ? (
              <BarChart data={totalAnggaranChartData} />
          ) : (
              <div className="flex items-center justify-center h-80 bg-gray-100 rounded-md">
                  <p className="text-gray-500">Data anggaran tidak tersedia.</p>
              </div>
          )}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Anggaran per Program CSR ({activeFiscalYear ? `Tahun Fiskal ${activeFiscalYear.tahunFiskal}` : 'Tidak Ada Tahun Fiskal Aktif'})
          </h2>
          {programChartLoading ? (
              <div className="flex items-center justify-center h-80 bg-gray-100 rounded-md">
                  <p className="text-gray-500">Memuat data grafik program...</p>
              </div>
          ) : !activeFiscalYear ? (
               <div className="flex items-center justify-center h-80 bg-gray-100 rounded-md">
                  <p className="text-gray-500">Pilih tahun fiskal aktif untuk melihat data.</p>
              </div>
          ) : programChartData.length > 0 ? (
              <BarChart data={programChartData} />
          ) : (
              <div className="flex items-center justify-center h-80 bg-gray-100 rounded-md">
                  <p className="text-gray-500">Tidak ada data anggaran program untuk tahun fiskal ini.</p>
              </div>
          )}
      </div>
    </div>
  );
};

export default DashboardHome;