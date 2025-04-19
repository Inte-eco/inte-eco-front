import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../services/Firebase/FirebaseConfig";
import { useNavigate } from "react-router-dom";

const ManageUser = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsersAndAdmins = async () => {
      const usersSnapshot = await getDocs(collection(db, "users"));
      const adminsSnapshot = await getDocs(collection(db, "admins"));

      const usersList = usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        type: "users", // Pour identifier la source
      }));

      const adminsList = adminsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        type: "admins", // Pour identifier la source
      }));

      const combined = [...usersList, ...adminsList];

      setUsers(combined);
      setFilteredUsers(combined);
    };

    fetchUsersAndAdmins();
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

  const handleDelete = async (id: string, type: "users" | "admins") => {
    const confirm = window.confirm("Voulez-vous vraiment supprimer cet utilisateur ?");
    if (!confirm) return;

    const collectionName = type === "admins" ? "admins" : "users";
    await deleteDoc(doc(db, collectionName, id));
    setUsers(users.filter((u) => u.id !== id));
    setFilteredUsers(filteredUsers.filter((u) => u.id !== id));
  };

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Gestion des Utilisateurs & Admins</h2>
        <button
          onClick={() => navigate("/dash-admin/add-user")}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Ajouter un utilisateur
        </button>
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
              currentUsers.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{user.nom}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2">{user.role}</td>
                  <td className="px-4 py-2">{user.clientId || "-"}</td>
                  <td className="px-4 py-2 capitalize">{user.type}</td>
                  <td className="px-4 py-2 space-x-2">
                    <button
                      onClick={() => navigate(`/dash-admin/manage-user/edit/${user.id}?type=${user.type}`)}
                      className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
                    >
                      Éditer
                    </button>
                    <button
                      onClick={() => handleDelete(user.id, user.type)}
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
                  Aucun utilisateur ou admin trouvé.
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
