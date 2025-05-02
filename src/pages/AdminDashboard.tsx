// import ChartRealtime from "../components/ChartRealtime";
// import { useNavigate } from "react-router-dom";

// const AdminDashboard = () => {
//   const navigate = useNavigate();

//   return (
    
//         <div className="flex-1 p-6 bg-gray-100 overflow-y-auto">
//           <h1 className="text-2xl font-bold mb-4">Tableau de bord Admin</h1>

//           <div className="flex flex-wrap gap-4 mb-6">
//             <button
//               onClick={() => navigate("add-client")}
//               className="bg-blue-500 text-white px-4 py-2 rounded"
//             >
//               🏢 Ajouter un client
//             </button>
//             <button
//               onClick={() => navigate("add-user")}
//               className="bg-green-500 text-white px-4 py-2 rounded"
//             >
//               👤 Ajouter un utilisateur
//             </button>
//             <button
//               onClick={() => navigate("add-station")}
//               className="bg-purple-500 text-white px-4 py-2 rounded"
//             >
//               📡 Ajouter une station
//             </button>
//             <button
//               onClick={() => navigate("add-admin")}
//               className="bg-red-500 text-white px-4 py-2 rounded"
//             >
//               🛡️ Ajouter un admin
//             </button>
//           </div>

//           <ChartRealtime />
//         </div>
//   );
// };

// export default AdminDashboard;


import ChartRealtime from "../components/ChartRealtime";
import { useNavigate } from "react-router-dom";

// Exemple simple pour notifier par console ou appel d'API mail
const sendNotification = (message: string) => {
  console.log("📧 Notification envoyée :", message);
};

const chartConfigs = [
  {
    title: "CO₂ (PPM)",
    type: "line",
    data: [400, 420, 410, 430, 1215],
    color: "rgba(255, 206, 86, 1)",
  },
  {
    title: "H₂S (PPM)",
    type: "bubble",
    data: [5, 6, 5.5, 6.2, 5.8],
    color: "rgba(75, 192, 192, 1)",
  },
  {
    title: "Température (°C)",
    type: "radar",
    data: [22, 24, 23, 25, 26],
    color: "rgba(255, 99, 132, 1)",
  },
  {
    title: "Humidité (%)",
    type: "pie",
    data: [55, 60, 58, 62, 59],
    color: "rgba(54, 162, 235, 1)",
  },
  {
    title: "CO (PPM)",
    type: "bar",
    data: [9, 10, 9.5, 10.2, 9.8],
    color: "rgba(153, 102, 255, 1)",
  },
];

const getCO2Status = (value: number) => {
  if (value <= 400) return { color: "bg-green-500", message: "Excellent" };
  if (value <= 600) return { color: "bg-green-400", message: "Bon" };
  if (value <= 1200) return { color: "bg-yellow-400", message: "Moyen" };
  if (value <= 2000) {
    sendNotification("CO₂ atteint un niveau Mauvais.");
    return { color: "bg-red-400", message: "Mauvais" };
  }
  sendNotification("CO₂ atteint un niveau Critique.");
  return { color: "bg-red-600", message: "Critique" };
};

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 p-6 bg-gray-100 overflow-y-auto">
      <h1 className="text-2xl font-bold mb-4">Tableau de bord Admin</h1>

      <div className="flex flex-wrap gap-4 mb-6">
        <button
          onClick={() => navigate("add-client")}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          🏢 Ajouter un client
        </button>
        <button
          onClick={() => navigate("add-user")}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          👤 Ajouter un utilisateur
        </button>
        <button
          onClick={() => navigate("add-station")}
          className="bg-purple-500 text-white px-4 py-2 rounded"
        >
          📡 Ajouter une station
        </button>
        <button
          onClick={() => navigate("add-admin")}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          🛡️ Ajouter un admin
        </button>
      </div>

      {/* Cartes indicateurs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {chartConfigs.map((config) => {
          const latestValue = config.data[config.data.length - 1];

          let status = {
            color: "bg-gray-300",
            message: "N/A",
          };

          if (config.title === "CO₂ (PPM)") {
            status = getCO2Status(latestValue);
          }

          return (
            <div
              key={config.title}
              className={`p-4 rounded shadow text-white ${status.color}`}
            >
              <h2 className="text-lg font-semibold">{config.title}</h2>
              <p className="text-2xl">{latestValue}</p>
              <p className="italic">{status.message}</p>
            </div>
          );
        })}
      </div>

      <ChartRealtime />
    </div>
  );
};

export default AdminDashboard;
