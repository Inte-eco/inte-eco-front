// import { useEffect, useState } from "react";
// import {
//   collection,
//   getDocs,
//   query,
//   orderBy,
// } from "firebase/firestore";
// import { db } from "../../services/Firebase/FirebaseConfig";

// import {
//   Chart as ChartJS,
//   LineElement,
//   BarElement,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   ArcElement,
//   RadialLinearScale,
//   Tooltip,
//   Legend,
// } from "chart.js";

// import { Line, Bar, Pie, Bubble, Radar } from "react-chartjs-2";

// ChartJS.register(
//   LineElement,
//   BarElement,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   ArcElement,
//   RadialLinearScale,
//   Tooltip,
//   Legend
// );

// type ChartType = "line" | "bar" | "pie" | "bubble" | "radar";

// interface ChartConfig {
//   title: string;
//   type: ChartType;
//   key: string; // la clé du champ dans les mesures Firebase (ex: 'temperature')
//   color: string;
// }

// const chartConfigs: ChartConfig[] = [
//   {
//     title: "Température (°C)",
//     type: "line",
//     key: "temperature",
//     color: "rgba(255, 99, 132, 1)",
//   },
//   {
//     title: "Humidité (%)",
//     type: "pie",
//     key: "humidite",
//     color: "rgba(54, 162, 235, 1)",
//   },
//   {
//     title: "CO (PPM)",
//     type: "bar",
//     key: "co",
//     color: "rgba(153, 102, 255, 1)",
//   },
//   {
//     title: "CO₂ (PPM)",
//     type: "line",
//     key: "co2",
//     color: "rgba(255, 206, 86, 1)",
//   },
//   {
//     title: "H₂S (PPM)",
//     type: "bubble",
//     key: "h2s",
//     color: "rgba(75, 192, 192, 1)",
//   },
// ];

// const Statistic = () => {
//   const [stations, setStations] = useState<any[]>([]);
//   const [selectedStationId, setSelectedStationId] = useState("");
//   const [mesures, setMesures] = useState<any[]>([]);

//   useEffect(() => {
//     const fetchStations = async () => {
//       const querySnapshot = await getDocs(
//         query(collection(db, "stations"), orderBy("nom"))
//       );
//       const stationList = querySnapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       }));
//       setStations(stationList);
//     };

//     fetchStations();
//   }, []);

//   const fetchMesures = async (stationId: string) => {
//     const mesuresRef = collection(db, "stations", stationId, "mesures");
//     const q = query(mesuresRef, orderBy("timestamp", "asc"));
//     const snapshot = await getDocs(q);
//     const data = snapshot.docs.map((doc) => doc.data());
//     setMesures(data);
//   };

//   const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const id = e.target.value;
//     setSelectedStationId(id);
//     fetchMesures(id);
//   };

//   const labels = mesures.map((m) =>
//     new Date(m.timestamp).toLocaleTimeString("fr-FR", {
//       hour: "2-digit",
//       minute: "2-digit",
//     })
//   );

//   const renderChart = (config: ChartConfig, index: number) => {
//     const data = {
//       labels,
//       datasets: [
//         {
//           label: config.title,
//           data: mesures.map((m) => m[config.key]),
//           backgroundColor: config.color,
//           borderColor: config.color,
//           fill: config.type === "line" || config.type === "radar" ? false : true,
//           tension: 0.4,
//         },
//       ],
//     };

//     switch (config.type) {
//       case "line":
//         return <Line key={index} data={data} />;
//       case "bar":
//         return <Bar key={index} data={data} />;
//       case "pie":
//         return <Pie key={index} data={data} />;
//       case "bubble":
//         return <Bubble key={index} data={data} />;
//       case "radar":
//         return <Radar key={index} data={data} />;
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="p-6 bg-gray-100 min-h-screen">
//       <h2 className="text-2xl font-bold mb-4">Statistiques des Stations</h2>

//       <select
//         value={selectedStationId}
//         onChange={handleSelectChange}
//         className="mb-6 p-2 border rounded w-full"
//       >
//         <option value="">-- Sélectionnez une station --</option>
//         {stations.map((station) => (
//           <option key={station.id} value={station.id}>
//             {station.nom} ({station.proprietaire})
//           </option>
//         ))}
//       </select>

//       {selectedStationId && mesures.length > 0 ? (
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {chartConfigs.map((config, index) => (
//             <div key={index} className="bg-white p-4 rounded-lg shadow">
//               <h2 className="text-lg font-semibold mb-2">{config.title}</h2>
//               {renderChart(config, index)}
//             </div>
//           ))}
//         </div>
//       ) : selectedStationId && mesures.length === 0 ? (
//         <p className="text-gray-500">
//           Aucune mesure disponible pour cette station.
//         </p>
//       ) : null}
//     </div>
//   );
// };

// export default Statistic;


import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
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
    const q = query(mesuresRef, orderBy("timestamp", "asc"));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((doc) => doc.data());
    setMesures(data);
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelectedStationId(id);
    fetchMesures(id);
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
        data: mesures.map((m) => m["co2"]),
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
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">CO₂ (PPM)</h2>
          <Line data={data} options={options} />
        </div>
      ) : selectedStationId && mesures.length === 0 ? (
        <p className="text-gray-500">
          Aucune mesure disponible pour cette station.
        </p>
      ) : null}
    </div>
  );
};

export default Statistic;
