import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "../services/Firebase/FirebaseConfig";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
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

const options: ChartOptions<"line"> = {
  responsive: true,
  plugins: {
    legend: { display: true },
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
            backgroundColor: "green",
            color: "white",
            position: "end",
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
            backgroundColor: "#22c55e",
            color: "white",
            position: "end",
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
            backgroundColor: "#facc15",
            color: "black",
            position: "end",
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
            backgroundColor: "#f87171",
            color: "black",
            position: "end",
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

const ClientDashboard = () => {
  const clientUid = sessionStorage.getItem("clientUid");
  const [stations, setStations] = useState<any[]>([]);
  const [mesuresByStation, setMesuresByStation] = useState<Record<string, any[]>>({});

  // Charger les stations du client
  useEffect(() => {
    if (!clientUid) return;

    const q = query(
      collection(db, "stations"),
      where("clientId", "==", clientUid),
      orderBy("nom")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setStations(list);
    });

    return () => unsubscribe();
  }, [clientUid]);

  // Charger les mesures de chaque station
  useEffect(() => {
    const unsubscribes = stations.map((station) => {
      const q = query(
        collection(db, "stations", station.id, "mesures"),
        orderBy("timestamp", "asc"),
        limit(50)
      );

      return onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map((doc) => doc.data());
        setMesuresByStation((prev) => ({
          ...prev,
          [station.id]: data,
        }));
      });
    });

    return () => unsubscribes.forEach((u) => u());
  }, [stations]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Tableau de bord Client</h1>

      {stations.length === 0 ? (
        <p className="text-gray-500">Aucune station liée à ce compte.</p>
      ) : (
        stations.map((station) => {
          const mesures = mesuresByStation[station.id] ?? [];
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

          return (
            <div
              key={station.id}
              className="bg-white p-4 rounded-lg shadow mb-6"
            >
              <h2 className="text-lg font-semibold mb-2">
                {station.nom} ({station.proprietaire})
              </h2>
              {mesures.length > 0 ? (
                <Line data={data} options={options} />
              ) : (
                <p className="text-gray-500">Aucune mesure disponible.</p>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default ClientDashboard;
