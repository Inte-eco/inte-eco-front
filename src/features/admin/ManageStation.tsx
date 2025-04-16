import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../services/Firebase/FirebaseConfig";
import { useNavigate } from "react-router-dom";

const ManageStation = () => {
  const [stations, setStations] = useState<any[]>([]);
  const [filteredStations, setFilteredStations] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStations = async () => {
      const querySnapshot = await getDocs(collection(db, "stations"));
      const stationList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setStations(stationList);
      setFilteredStations(stationList);
    };

    fetchStations();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    const filtered = stations.filter((station) =>
      station.nom.toLowerCase().includes(value) ||
      station.proprietaire?.toLowerCase().includes(value) ||
      station.clientId?.toLowerCase().includes(value)
    );
    setFilteredStations(filtered);
    setCurrentPage(1);
  };

  const handleDelete = async (id: string) => {
    const confirm = window.confirm("Voulez-vous vraiment supprimer cette station ?");
    if (!confirm) return;

    await deleteDoc(doc(db, "stations", id));
    setStations(stations.filter((s) => s.id !== id));
    setFilteredStations(filteredStations.filter((s) => s.id !== id));
  };

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentStations = filteredStations.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredStations.length / itemsPerPage);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Gestion des Stations</h2>
        <button
          onClick={() => navigate("/dash-admin/add-station")}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          Ajouter une nouvelle station
        </button>
      </div>

      <input
        type="text"
        placeholder="Rechercher par nom, propriétaire ou client ID..."
        value={search}
        onChange={handleSearch}
        className="mb-4 w-full p-2 border rounded"
      />

      <div className="overflow-x-auto">
        <table className="w-full bg-white rounded-lg shadow overflow-hidden">
          <thead className="bg-purple-100 text-left">
            <tr>
              <th className="px-4 py-2">Nom</th>
              <th className="px-4 py-2">Propriétaire</th>
              <th className="px-4 py-2">Client ID</th>
              <th className="px-4 py-2">Date Installation</th>
              <th className="px-4 py-2">État</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentStations.length > 0 ? (
              currentStations.map((station) => (
                <tr key={station.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{station.nom}</td>
                  <td className="px-4 py-2">{station.proprietaire}</td>
                  <td className="px-4 py-2">{station.clientId}</td>
                  <td className="px-4 py-2">{station.dateInstallation}</td>
                  <td className="px-4 py-2 capitalize">{station.etat}</td>
                  <td className="px-4 py-2 space-x-2">
                    <button
                      onClick={() => navigate(`/dash-admin/manage-station/edit/${station.id}`)}
                      className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
                    >
                      Éditer
                    </button>
                    <button
                      onClick={() => handleDelete(station.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-4 py-2 text-center text-gray-500">
                  Aucune station trouvée.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4 space-x-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded ${
              currentPage === i + 1 ? "bg-purple-600 text-white" : "bg-gray-200"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ManageStation;
