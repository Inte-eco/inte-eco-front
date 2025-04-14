import Sidebar from "../components/Sidebar";
import ChartRealtime from "../components/ChartRealtime";
import { useNavigate } from "react-router-dom";

const ClientDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex-1 p-6 bg-gray-100 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-4">Tableau de bord Client</h1>

        <ChartRealtime />
      </div>
    </div>
  );
};

export default ClientDashboard;