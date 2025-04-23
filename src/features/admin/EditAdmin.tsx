import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../../services/Firebase/FirebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const EditAdmin = () => {
  const { adminId } = useParams();
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!adminId) return;

    const fetchAdmin = async () => {
      try {
        const docRef = doc(db, "admins", adminId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setAdminData(docSnap.data());
        } else {
          alert("Administrateur non trouvé");
          navigate("/dash-admin/manage-user/admins");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération :", error);
        alert("Erreur lors de la récupération des données");
        navigate("/dash-admin/manage-user/admins");
      } finally {
        setLoading(false);
      }
    };

    fetchAdmin();
  }, [adminId, navigate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setAdminData({ ...adminData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateDoc(doc(db, "admins", adminId!), adminData);
      alert("Mise à jour réussie !");
      navigate("/dash-admin/manage-user/admins");
    } catch (error) {
      console.error("Erreur de mise à jour :", error);
      alert("Erreur lors de la mise à jour");
    }
  };

  if (loading) return <div className="p-6">Chargement...</div>;
  if (!adminData) return null;

  return (
    <div className="p-6 max-w-xl mx-auto bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Modifier l'administrateur</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Nom</label>
          <input
            type="text"
            name="nom"
            value={adminData.nom || ""}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={adminData.email || ""}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1">Rôle</label>
          <select
            name="role"
            value={adminData.role || ""}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="">-- Choisir un rôle --</option>
            <option value="admin">Admin</option>
            <option value="super_admin">Super Admin</option>
          </select>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Enregistrer
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditAdmin;
