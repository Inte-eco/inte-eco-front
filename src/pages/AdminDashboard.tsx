import ChartRealtime from "../components/ChartRealtime";
import { useNavigate } from "react-router-dom";

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

          <ChartRealtime />
        </div>
  );
};

export default AdminDashboard;
