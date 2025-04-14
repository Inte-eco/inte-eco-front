import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

const ChartRealtime = () => {
  const data = {
    labels: ['10h', '11h', '12h', '13h', '14h'],
    datasets: [
      {
        label: 'Température (°C)',
        data: [22, 24, 23, 25, 26],
        borderColor: 'rgba(75,192,192,1)',
        fill: false,
      },
    ],
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow w-full">
      <h2 className="text-lg font-semibold mb-2">Mesures en temps réel</h2>
      <Line data={data} />
    </div>
  );
};

export default ChartRealtime;
