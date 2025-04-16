import React from 'react';
import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  ArcElement,
  RadialLinearScale,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar, Pie, Bubble, Radar } from 'react-chartjs-2';

ChartJS.register(
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  ArcElement,
  RadialLinearScale,
  Tooltip,
  Legend
);

type ChartType = 'line' | 'bar' | 'pie' | 'bubble' | 'radar';

interface ChartConfig {
  title: string;
  type: ChartType;
  data: number[];
  color: string;
}

const ChartRealtime: React.FC = () => {
  const labels = ['10h', '11h', '12h', '13h', '14h'];

  const chartConfigs: ChartConfig[] = [
    {
      title: 'CO₂ (PPM)',
      type: 'line',
      data: [400, 420, 410, 430, 415],
      color: 'rgba(255, 206, 86, 1)',
    },
    {
      title: 'H₂S (PPM)',
      type: 'bubble',
      data: [5, 6, 5.5, 6.2, 5.8],
      color: 'rgba(75, 192, 192, 1)',
    },
    {
      title: 'Température (°C)',
      type: 'radar',
      data: [22, 24, 23, 25, 26],
      color: 'rgba(255, 99, 132, 1)',
    },
    {
      title: 'Humidité (%)',
      type: 'pie',
      data: [55, 60, 58, 62, 59],
      color: 'rgba(54, 162, 235, 1)',
    },
    {
      title: 'CO (PPM)',
      type: 'bar',
      data: [9, 10, 9.5, 10.2, 9.8],
      color: 'rgba(153, 102, 255, 1)',
    },
  ];

  const renderChart = (config: ChartConfig, index: number) => {
    const data = {
      labels,
      datasets: [
        {
          label: config.title,
          data: config.data,
          backgroundColor: config.color,
          borderColor: config.color,
          fill: false,
          tension: 0.4,
        },
      ],
    };

    switch (config.type) {
      case 'line':
        return <Line key={index} data={data} />;
      case 'bubble':
        return <Bubble key={index} data={data} />;
      case 'radar':
        return <Radar key={index} data={data} />;
      case 'pie':
        return <Pie key={index} data={data} />;
        case 'bar':
          return <Bar key={index} data={data} />;
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {chartConfigs.map((config, index) => (
        <div key={index} className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">{config.title}</h2>
          {renderChart(config, index)}
        </div>
      ))}
    </div>
  );
};

export default ChartRealtime;
