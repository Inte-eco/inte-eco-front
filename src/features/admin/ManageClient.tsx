import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../../services/Firebase/FirebaseConfig";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const ManageClient = () => {
  const [clients, setClients] = useState<any[]>([]);
  const [filteredClients, setFilteredClients] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClients = async () => {
      const q = query(collection(db, "clients"), orderBy("dateCreation", "desc"));
      const querySnapshot = await getDocs(q);
      const clientList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setClients(clientList);
      setFilteredClients(clientList);
    };

    fetchClients();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    const filtered = clients.filter((client) =>
      client.nom.toLowerCase().includes(value) ||
      client.email.toLowerCase().includes(value)
    );
    setFilteredClients(filtered);
    setCurrentPage(1);
  };

  const handleDelete = async (id: string) => {
    const confirm = window.confirm("Voulez-vous vraiment supprimer ce client ?");
    if (!confirm) return;

    await deleteDoc(doc(db, "clients", id));
    setClients(clients.filter((client) => client.id !== id));
    setFilteredClients(filteredClients.filter((client) => client.id !== id));
  };

  const exportCSV = () => {
    const headers = ["Nom", "Email", "Téléphone", "Adresse"];
    const rows = filteredClients.map(c =>
      [c.nom, c.email, c.telephone, c.adresse].join(",")
    );
    const csvContent = [headers.join(","), ...rows].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "clients.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportPDF = () => {
    const pdfDoc = new jsPDF();
  
    pdfDoc.text("Liste des Clients", 14, 10);
  
    const tableColumn = ["N°", "Nom", "Email", "Téléphone", "Adresse"];
    const tableRows = filteredClients.map((client, index) => [
      index + 1,
      client.nom,
      client.email,
      client.telephone,
      client.adresse,
    ]);
  
    autoTable(pdfDoc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });
  
    pdfDoc.save("liste_clients.pdf");
  };

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentClients = filteredClients.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold">Gestion des Clients</h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => navigate("/dash-admin/add-client")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Ajouter un nouveau client
          </button>
          <button
            onClick={exportCSV}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Exporter CSV
          </button>
          <button
            onClick={exportPDF}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Exporter PDF
          </button>
        </div>
      </div>

      <input
        type="text"
        placeholder="Rechercher un client..."
        value={search}
        onChange={handleSearch}
        className="mb-4 w-full p-2 border rounded"
      />

      <div className="overflow-x-auto">
        <table className="w-full bg-white rounded-lg shadow overflow-hidden">
          <thead className="bg-blue-100 text-left">
            <tr>
              <th className="px-4 py-2">N°</th>
              <th className="px-4 py-2">Nom</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Téléphone</th>
              <th className="px-4 py-2">Adresse</th>
              <th className="px-4 py-2">Mot de passe</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentClients.length > 0 ? (
              currentClients.map((client, index) => (
                <tr key={client.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{indexOfFirst + index + 1}</td>
                  <td className="px-4 py-2">{client.nom}</td>
                  <td className="px-4 py-2">{client.email}</td>
                  <td className="px-4 py-2">{client.telephone}</td>
                  <td className="px-4 py-2">{client.adresse}</td>
                  <td className="px-4 py-2">{client.password}</td>
                  <td className="px-4 py-2 space-x-2">
                    <button
                      onClick={() =>
                        navigate(`/dash-admin/manage-client/edit/${client.id}`)
                      }
                      className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
                    >
                      Éditer
                    </button>
                    <button
                      onClick={() => handleDelete(client.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-4 py-2 text-center text-gray-500">
                  Aucun client trouvé.
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
              currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ManageClient;
