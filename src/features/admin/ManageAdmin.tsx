import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc, query, orderBy } from "firebase/firestore";
import { db } from "../../services/Firebase/FirebaseConfig";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "jspdf-autotable";

const ManageAdmin = () => {
  const [admins, setAdmins] = useState<any[]>([]);
  const [filteredAdmins, setFilteredAdmins] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdmins = async () => {
      const q = query(collection(db, "admins"), orderBy("dateCreation", "desc"));
      const querySnapshot = await getDocs(q);
      const adminList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        type: "admins",
      }));

      setAdmins(adminList);
      setFilteredAdmins(adminList);
    };

    fetchAdmins();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    const filtered = admins.filter((a) =>
      a.nom.toLowerCase().includes(value) || a.email.toLowerCase().includes(value)
    );
    setFilteredAdmins(filtered);
    setCurrentPage(1);
  };

  const handleDelete = async (id: string) => {
    const confirm = window.confirm("Voulez-vous vraiment supprimer cet administrateur ?");
    if (!confirm) return;

    await deleteDoc(doc(db, "admins", id));
    setAdmins(admins.filter((a) => a.id !== id));
    setFilteredAdmins(filteredAdmins.filter((a) => a.id !== id));
  };

  const exportToCSV = () => {
    const headers = ["Nom", "Email", "Rôle", "Origine"];
    const rows = filteredAdmins.map((admin) => [
      admin.nom,
      admin.email,
      admin.role,
      admin.type,
    ]);

    let csvContent = "data:text/csv;charset=utf-8,"
      + headers.join(",") + "\n"
      + rows.map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "liste_administrateurs.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    const pdfDoc = new jsPDF();
  
    pdfDoc.text("Liste des Administrateurs", 14, 10);
  
    const tableColumn = ["N°", "Nom", "Email", "Rôle", "Origine"];
    const tableRows = filteredAdmins.map((admin, index) => [
      index + 1,
      admin.nom,
      admin.email,
      admin.role,
      admin.type,
    ]);
  
    autoTable(pdfDoc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });
  
    pdfDoc.save("liste_admins.pdf");
  };

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentAdmins = filteredAdmins.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredAdmins.length / itemsPerPage);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Gestion des Administrateurs</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={exportToCSV}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Export CSV
          </button>
          <button
            onClick={exportToPDF}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Export PDF
          </button>
          <button
            onClick={() => navigate("/dash-admin/add-admin")}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Ajouter un administrateur
          </button>
        </div>
      </div>

      <input
        type="text"
        placeholder="Rechercher par nom ou email..."
        value={search}
        onChange={handleSearch}
        className="mb-4 w-full p-2 border rounded"
      />

      <div className="overflow-x-auto">
        <table className="w-full bg-white rounded-lg shadow overflow-hidden">
          <thead className="bg-red-100 text-left">
            <tr>
              <th className="px-4 py-2">N°</th>
              <th className="px-4 py-2">Nom</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Rôle</th>
              <th className="px-4 py-2">Origine</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentAdmins.length > 0 ? (
              currentAdmins.map((admin, index) => (
                <tr key={admin.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{indexOfFirst + index + 1}</td>
                  <td className="px-4 py-2">{admin.nom}</td>
                  <td className="px-4 py-2">{admin.email}</td>
                  <td className="px-4 py-2">{admin.role}</td>
                  <td className="px-4 py-2 capitalize">{admin.type}</td>
                  <td className="px-4 py-2 space-x-2">
                    <button
                      onClick={() => navigate(`/dash-admin/manage-user/admins/edit/${admin.id}`)}
                      className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
                    >
                      Éditer
                    </button>
                    <button
                      onClick={() => handleDelete(admin.id)}
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
                  Aucun administrateur trouvé.
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
              currentPage === i + 1 ? "bg-red-600 text-white" : "bg-gray-200"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ManageAdmin;
