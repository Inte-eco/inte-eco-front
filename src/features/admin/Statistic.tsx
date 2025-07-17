import React, { useEffect, useState, useRef, forwardRef, useImperativeHandle } from "react";
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
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

// import { Line, Bar, Pie } from "react-chartjs-2";
import { Line, Bar } from "react-chartjs-2";
import annotationPlugin from "chartjs-plugin-annotation";
import type { ChartOptions as ChartJSOptions } from "chart.js";

ChartJS.register(
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  annotationPlugin
);

// Wrapper pour gérer le chart avec destruction propre
const ChartWrapper = forwardRef(({ type, data, options }: { type: "line" | "bar", data: any, options: ChartJSOptions<any> }, ref) => {
  const chartRef = useRef<any>(null);

  // Expose méthode destroy au parent
  useImperativeHandle(ref, () => ({
    destroy: () => {
      if (chartRef.current) {
        chartRef.current.chartInstance?.destroy();
        chartRef.current.chartInstance = null;
      }
    }
  }));

  return type === "line" ? (
    <Line ref={chartRef} data={data} options={options} />
  ) : (
    <Bar ref={chartRef} data={data} options={options} />
  );
});

ChartWrapper.displayName = "ChartWrapper";

const Statistic = () => {
  const [stations, setStations] = useState<any[]>([]);
  const { stationId } = useParams();
  const [selectedStationId, setSelectedStationId] = useState(stationId ?? "");
  const [mesures, setMesures] = useState<any[]>([]);
  const lineChartRef = useRef<any>(null);
  const barChartRef = useRef<any>(null);

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
    if (!selectedStationId) {
      setMesures([]);
      return;
    }

    const mesuresRef = collection(db, "stations", selectedStationId, "mesures");
    const q = query(mesuresRef, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => doc.data());
      setMesures(data);
    });

    return () => unsubscribe();
  }, [selectedStationId]);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStationId(e.target.value);
  };

  const labels = mesures.map((m) =>
    m.timestamp
      ? new Date(m.timestamp).toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "—"
  );

  const data = {
    labels,
    datasets: [
      {
        label: "CO₂ (PPM)",
        data: mesures.map((m) => (typeof m.donnees?.co2 === "number" ? m.donnees.co2 : null)),
        backgroundColor: "rgba(255, 206, 86, 1)",
        borderColor: "rgba(255, 206, 86, 1)",
        fill: false,
        tension: 0.4,
      },
    ],
  };

  const lineOptions: ChartJSOptions<"line"> = {
    responsive: true,
    plugins: {
      legend: { display: true },
      annotation: {
        annotations: {
          excellent: { type: "line", yMin: 400, yMax: 400, borderColor: "green", borderWidth: 2, label: { content: "Excellent", display: true, position: "end", backgroundColor: "green", color: "white" } },
          bon: { type: "line", yMin: 600, yMax: 600, borderColor: "#22c55e", borderWidth: 2, label: { content: "Bon", display: true, position: "end", backgroundColor: "#22c55e", color: "white" } },
          moyen: { type: "line", yMin: 1200, yMax: 1200, borderColor: "#facc15", borderWidth: 2, label: { content: "Moyen", display: true, position: "end", backgroundColor: "#facc15", color: "black" } },
          mauvais: { type: "line", yMin: 2000, yMax: 2000, borderColor: "#f87171", borderWidth: 2, label: { content: "Mauvais", display: true, position: "end", backgroundColor: "#f87171", color: "black" } },
        }
      }
    },
    scales: { y: { beginAtZero: true } },
  };

  const barOptions: ChartJSOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: { display: false },
      annotation: {
        annotations: {
          excellent: { type: "line", yMin: 400, yMax: 400, borderColor: "green", borderWidth: 2, label: { content: "Excellent", display: true, position: "end", backgroundColor: "green", color: "white" } },
          bon: { type: "line", yMin: 600, yMax: 600, borderColor: "#22c55e", borderWidth: 2, label: { content: "Bon", display: true, position: "end", backgroundColor: "#22c55e", color: "white" } },
          moyen: { type: "line", yMin: 1200, yMax: 1200, borderColor: "#facc15", borderWidth: 2, label: { content: "Moyen", display: true, position: "end", backgroundColor: "#facc15", color: "black" } },
          mauvais: { type: "line", yMin: 2000, yMax: 2000, borderColor: "#f87171", borderWidth: 2, label: { content: "Mauvais", display: true, position: "end", backgroundColor: "#f87171", color: "black" } },
        }
      },
      title: {
        display: true,
        text: "Niveaux de CO₂ par station",
      },
    },
    scales: { y: { beginAtZero: true } },
  };

  // On détruit les charts précédents avant de redessiner pour éviter conflit canvas
  useEffect(() => {
    lineChartRef.current?.destroy?.();
    barChartRef.current?.destroy?.();
  }, [data]);

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
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <h2 className="text-lg font-semibold mb-2">CO₂ (PPM) - Ligne</h2>
            <ChartWrapper ref={lineChartRef} type="line" data={data} options={lineOptions} />
          </div>

          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <h2 className="text-lg font-semibold mb-2">Bar Chart</h2>
            <ChartWrapper ref={barChartRef} type="bar" data={data} options={barOptions} />
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-2">Pie Chart</h2>
            {/* <Pie
              data={{
                labels,
                datasets: [
                  {
                    label: "CO₂ (PPM)",
                    data: mesures.map((m) => (typeof m.donnees?.co2 === "number" ? m.donnees.co2 : 0)),
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
              options={{ plugins: { legend: { position: "bottom" } } }}
            /> */}
          </div>
        </>
      ) : selectedStationId && mesures.length === 0 ? (
        <p className="text-gray-500">Aucune mesure disponible pour cette station.</p>
      ) : null}
    </div>
  );
};

export default Statistic;
