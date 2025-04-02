import React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { BarChart } from '@mui/x-charts/BarChart';

const StatusOverview = () => {
  const data = [
    { id: 0, value: 12, label: 'At Hub' },
    { id: 1, value: 8, label: 'Dispatched' },
    { id: 2, value: 4, label: 'Returned' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-6">
      <h2 className="text-2xl font-bold text-primary">Parcel Status Overview</h2>

      {/* Chart Container - Display in one row */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Pie Chart */}
        <div className="flex-1 bg-white rounded-xl shadow-card p-6">
          <h3 className="font-semibold mb-4">Pie Chart</h3>
          <PieChart
            series={[{
              data,
              innerRadius: 30,
              outerRadius: 100,
              paddingAngle: 5,
              cornerRadius: 5,
            }]}
            width={400}
            height={300}
          />
        </div>

        {/* Bar Chart */}
        <div className="flex-1 bg-white rounded-xl shadow-card p-6">
          <h3 className="font-semibold mb-4">Bar Chart</h3>
          <BarChart
            height={300}
            series={[{ data: data.map(d => d.value), label: 'Parcels' }]}
            xAxis={[{ scaleType: 'band', data: data.map(d => d.label) }]}
          />
        </div>
      </div>
    </div>
  );
};

export default StatusOverview;
