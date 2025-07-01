import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  orderBy,
  where,
} from "firebase/firestore";
import { db } from "../../services/Firebase/FirebaseConfig";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const ShowUsers = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const clientUid = sessionStorage.getItem("clientUid");

  useEffect(() => {
    const fetchUsers = async () => {
      if (!clientUid) return;

      const q = query(
        collection(db, "users"),
        where("clientId", "==", clientUid),
        orderBy("dateCreation", "desc")
      );
      const querySnapshot = await getDocs(q);

      const clientUsers = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setUsers(clientUsers);
      setFilteredUsers(clientUsers);
    };

    fetchUsers();
  }, [clientUid]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);

    const filtered = users.filter(
      (u) =>
        u.nom.toLowerCase().includes(value) ||
        u.email.toLowerCase().includes(value)
    );

    setFilteredUsers(filtered);
    setCurrentPage(1);
  };

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const exportToCSV = () => {
    const headers = ["N°", "Nom", "Email", "Rôle"];
    const rows = currentUsers.map((user, index) => [
      index + 1,
      user.nom,
      user.email,
      user.role,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "utilisateurs_client.csv";
    link.click();
  };

  const exportToPDF = () => {
    const docPdf = new jsPDF();
    docPdf.text("Liste des Utilisateurs du Client", 14, 10);

    const tableColumn = ["N°", "Nom", "Email", "Rôle"];
    const tableRows = currentUsers.map((user, index) => [
      index + 1,
      user.nom,
      user.email,
      user.role,
    ]);

    autoTable(docPdf, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    docPdf.save("utilisateurs_client.pdf");
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Utilisateurs du Client</h2>
        <div className="flex space-x-4">
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
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-4 py-2 text-center text-gray-500">
                  Aucun utilisateur trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

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

export default ShowUsers;
