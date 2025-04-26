import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc, query, orderBy } from "firebase/firestore";
import { db } from "../../services/Firebase/FirebaseConfig";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const ManageUser = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      const q = query(collection(db, "users"), orderBy("dateCreation", "desc"));
      const querySnapshot = await getDocs(q);
      const userList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        type: "users",
      }));

      setUsers(userList);
      setFilteredUsers(userList);
    };

    fetchUsers();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    const filtered = users.filter((u) =>
      u.nom.toLowerCase().includes(value) || u.email.toLowerCase().includes(value)
    );
    setFilteredUsers(filtered);
    setCurrentPage(1);
  };

  const handleDelete = async (id: string) => {
    const confirm = window.confirm("Voulez-vous vraiment supprimer cet utilisateur ?");
    if (!confirm) return;

    await deleteDoc(doc(db, "users", id));
    setUsers(users.filter((u) => u.id !== id));
    setFilteredUsers(filteredUsers.filter((u) => u.id !== id));
  };

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  // Exporter en CSV
  const exportToCSV = () => {
    const headers = ["N°", "Nom", "Email", "Rôle", "Client", "Origine"];
    const rows = currentUsers.map((user, index) => [
      index + 1,
      user.nom,
      user.email,
      user.role,
      user.clientId || "-",
      user.type,
    ]);
    
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "utilisateurs.csv";
    link.click();
  };

  // Exporter en PDF
  const exportToPDF = () => {
    const docPdf = new jsPDF();
    docPdf.text("Liste des Utilisateurs", 14, 10);

    const tableColumn = ["N°", "Nom", "Email", "Rôle", "Client", "Origine"];
    const tableRows = currentUsers.map((user, index) => [
      index + 1,
      user.nom,
      user.email,
      user.role,
      user.clientId || "-",
      user.type,
    ]);

    autoTable(docPdf, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    docPdf.save("utilisateurs.pdf");
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Gestion des Utilisateurs</h2>
        <div className="flex space-x-4">
          <button
            onClick={() => navigate("/dash-admin/add-user")}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Ajouter un utilisateur
          </button>
          <button
            onClick={exportToCSV}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Exporter CSV
          </button>
          <button
            onClick={exportToPDF}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Exporter PDF
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
          <thead className="bg-green-100 text-left">
            <tr>
              <th className="px-4 py-2">N°</th>
              <th className="px-4 py-2">Nom</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Rôle</th>
              <th className="px-4 py-2">Client</th>
              <th className="px-4 py-2">Origine</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.length > 0 ? (
              currentUsers.map((user, index) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{user.nom}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2">{user.role}</td>
                  <td className="px-4 py-2">{user.clientId || "-"}</td>
                  <td className="px-4 py-2 capitalize">{user.type}</td>
                  <td className="px-4 py-2 space-x-2">
                    <button
                      onClick={() => navigate(`/dash-admin/manage-user/users/edit/${user.id}`)}
                      className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
                    >
                      Éditer
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
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
                  Aucun utilisateur trouvé.
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
              currentPage === i + 1 ? "bg-green-600 text-white" : "bg-gray-200"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ManageUser;

