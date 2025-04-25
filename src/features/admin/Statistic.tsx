import { useEffect, useState } from "react";
import {
  collection,
//   doc,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../../services/Firebase/FirebaseConfig";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

const Statistic = () => {
  const [stations, setStations] = useState<any[]>([]);
  const [selectedStationId, setSelectedStationId] = useState("");
  const [mesures, setMesures] = useState<any[]>([]);

  useEffect(() => {
    const fetchStations = async () => {
      const querySnapshot = await getDocs(
        query(collection(db, "stations"), orderBy("nom"))
      );
      const stationList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setStations(stationList);
    };

    fetchStations();
  }, []);

  const fetchMesures = async (stationId: string) => {
    const mesuresRef = collection(db, "stations", stationId, "mesures");
    const q = query(mesuresRef, orderBy("date", "asc"));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((doc) => doc.data());
    setMesures(data);
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelectedStationId(id);
    fetchMesures(id);
  };

  const chartData = {
    labels: mesures.map((m) => new Date(m.date?.seconds * 1000).toLocaleString()),
    datasets: [
      {
        label: "Température (°C)",
        data: mesures.map((m) => m.temperature),
        fill: false,
        borderColor: "#8b5cf6",
        tension: 0.4,
      },
      {
        label: "Humidité (%)",
        data: mesures.map((m) => m.humidite),
        fill: false,
        borderColor: "#34d399",
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
    scales: {
      x: {
        ticks: { maxRotation: 45, minRotation: 45 },
      },
    },
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Statistiques des Stations</h2>

      <select
        value={selectedStationId}
        onChange={handleSelectChange}
        className="mb-6 p-2 border rounded w-full"
      >
        <option value="">-- Sélectionnez une station --</option>
        {stations.map((station) => (
          <option key={station.id} value={station.id}>
            {station.nom} ({station.proprietaire})
          </option>
        ))}
      </select>

      {selectedStationId && mesures.length > 0 ? (
        <div className="bg-white rounded p-4 shadow">
          <Line data={chartData} options={chartOptions} />
        </div>
      ) : selectedStationId && mesures.length === 0 ? (
        <p className="text-gray-500">Aucune mesure disponible pour cette station.</p>
      ) : null}
    </div>
  );
};

export default Statistic;
