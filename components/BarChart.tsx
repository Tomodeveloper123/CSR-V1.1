
import React from 'react';

interface ChartData {
  label: string;
  value: number;
}

interface BarChartProps {
  data: ChartData[];
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};


const BarChart: React.FC<BarChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="text-center text-gray-500">No data to display</div>;
  }

  const maxValue = Math.max(...data.map(item => item.value));
  const yAxisLabels = [];
  const numberOfLabels = 5;

  for (let i = 0; i <= numberOfLabels; i++) {
    const value = (maxValue / numberOfLabels) * i;
    yAxisLabels.push(value);
  }

  return (
    <div className="w-full h-80 flex items-end p-4 space-x-4 border-l border-b border-gray-300 relative">
       {/* Y-Axis Labels */}
        <div className="absolute left-[-5px] top-0 bottom-0 flex flex-col-reverse justify-between -translate-x-full pr-2 text-xs text-gray-500">
            {yAxisLabels.map((label, index) => (
                <span key={index} className="whitespace-nowrap">
                    {formatCurrency(label).replace('Rp', 'Rp ')}
                </span>
            ))}
        </div>

      {data.map((item, index) => (
        <div key={index} className="flex-1 h-full flex flex-col items-center justify-end group">
          <div
            className="w-full bg-blue-500 hover:bg-blue-600 transition-all duration-300 rounded-t-md relative"
            style={{ height: `${(item.value / maxValue) * 100}%` }}
          >
             {/* Tooltip */}
             <div className="absolute bottom-full mb-2 w-max left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gray-800 text-white text-xs rounded py-1 px-2 pointer-events-none">
                {formatCurrency(item.value)}
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-800"></div>
            </div>
          </div>
          <span className="mt-2 text-sm text-gray-600 font-medium">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default BarChart;
