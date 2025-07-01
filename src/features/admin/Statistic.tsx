import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../../services/Firebase/FirebaseConfig";

import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Line, Bar, Pie } from "react-chartjs-2";
import annotationPlugin from "chartjs-plugin-annotation";
import type { ChartOptions } from "chart.js";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  annotationPlugin
);

const Statistic = () => {
  const [stations, setStations] = useState<any[]>([]);
  const { stationId } = useParams();
  const [selectedStationId, setSelectedStationId] = useState(stationId ?? "");
  const [mesures, setMesures] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, "stations"), orderBy("nom"));
  
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const stationList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setStations(stationList);
    });
  
    return () => unsubscribe();
  }, []);  


  useEffect(() => {
    if (!selectedStationId) return;
  
    const mesuresRef = collection(db, "stations", selectedStationId, "mesures");
    const q = query(mesuresRef, orderBy("timestamp", "asc"));
  
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => doc.data());
      setMesures(data);
    });
  
    // Nettoyer l'écouteur si la station change ou le composant est démonté
    return () => unsubscribe();
  }, [selectedStationId]);
  

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelectedStationId(id);
  };

  const labels = mesures.map((m) =>
    new Date(m.timestamp).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    })
  );

  const data = {
    labels,
    datasets: [
      {
        label: "CO₂ (PPM)",
        data: mesures.map((m) => m.donnees?.co2 ?? null),
        backgroundColor: "rgba(255, 206, 86, 1)",
        borderColor: "rgba(255, 206, 86, 1)",
        fill: false,
        tension: 0.4,
      },
    ],
  };

const options: ChartOptions<"line"> = {
  responsive: true,
  plugins: {
    legend: {
      display: true,
    },
    annotation: {
      annotations: {
        excellent: {
          type: "line",
          yMin: 400,
          yMax: 400,
          borderColor: "green",
          borderWidth: 2,
          label: {
            content: "Excellent",
            display: true,
            position: "end",
            backgroundColor: "green",
            color: "white",
          },
        },
        bon: {
          type: "line",
          yMin: 600,
          yMax: 600,
          borderColor: "#22c55e",
          borderWidth: 2,
          label: {
            content: "Bon",
            display: true,
            position: "end",
            backgroundColor: "#22c55e",
            color: "white",
          },
        },
        moyen: {
          type: "line",
          yMin: 1200,
          yMax: 1200,
          borderColor: "#facc15",
          borderWidth: 2,
          label: {
            content: "Moyen",
            display: true,
            position: "end",
            backgroundColor: "#facc15",
            color: "black",
          },
        },
        mauvais: {
          type: "line",
          yMin: 2000,
          yMax: 2000,
          borderColor: "#f87171",
          borderWidth: 2,
          label: {
            content: "Mauvais",
            display: true,
            position: "end",
            backgroundColor: "#f87171",
            color: "black",
          },
        },
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

const barOptions: ChartOptions<'bar'> = {
  responsive: true,
  plugins: {
    legend: { display: false },
    annotation: {
      annotations: {
        excellent: {
          type: "line",
          yMin: 400,
          yMax: 400,
          borderColor: "green",
          borderWidth: 2,
          label: {
            content: "Excellent",
            display: true,
            position: "end",
            backgroundColor: "green",
            color: "white",
          },
        },
        bon: {
          type: "line",
          yMin: 600,
          yMax: 600,
          borderColor: "#22c55e",
          borderWidth: 2,
          label: {
            content: "Bon",
            display: true,
            position: "end",
            backgroundColor: "#22c55e",
            color: "white",
          },
        },
        moyen: {
          type: "line",
          yMin: 1200,
          yMax: 1200,
          borderColor: "#facc15",
          borderWidth: 2,
          label: {
            content: "Moyen",
            display: true,
            position: "end",
            backgroundColor: "#facc15",
            color: "black",
          },
        },
        mauvais: {
          type: "line",
          yMin: 2000,
          yMax: 2000,
          borderColor: "#f87171",
          borderWidth: 2,
          label: {
            content: "Mauvais",
            display: true,
            position: "end",
            backgroundColor: "#f87171",
            color: "black",
          },
        },
      },
    },
    title: {
      display: true,
      text: "Niveaux de CO₂ par station",
    },
  },
  scales: {
    y: { beginAtZero: true },
  },
};

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Statistiques des Stations</h2>

      {!stationId && (
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
)}


      {selectedStationId && mesures.length > 0 ? (
        <>
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-2">CO₂ (PPM) - Ligne</h2>
            <Line data={data} options={options} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-2">Bar Chart</h2>
              <Bar data={data} options={barOptions} />
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-2">Pie Chart</h2>
              <Pie
                data={{
                  labels,
                  datasets: [
                    {
                      label: "CO₂ (PPM)",
                      data: mesures.map((m) => m.donnees?.co2 ?? 0),
                      backgroundColor: mesures.map((m) => {
                        const co2 = m.donnees?.co2 ?? 0;
                        if (co2 <= 400) return "green";         // Excellent
                        if (co2 <= 600) return "#22c55e";       // Bon
                        if (co2 <= 1200) return "#facc15";      // Moyen
                        return "#f87171";                       // Mauvais
                      }),
                    },
                  ],
                }}
                options={{
                  plugins: {
                    legend: {
                      position: "bottom",
                    },
                  },
                }}
              />
            </div>
          </div>
        </>
      ) : selectedStationId && mesures.length === 0 ? (
        <p className="text-gray-500">
          Aucune mesure disponible pour cette station.
        </p>
      ) : null}
    </div>
  );
};

export default Statistic;
