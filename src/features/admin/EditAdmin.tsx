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
    <div className="flex flex-1 items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-xl">
        <h2 className="text-3xl font-bold text-center text-red-600 mb-6">Modifier l’administrateur</h2>
        <p className="text-center text-gray-500 mb-4">
          Tu peux modifier le nom, l'email ou le rôle de l’administrateur.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Nom</label>
            <input
              type="text"
              name="nom"
              value={adminData.nom || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-red-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={adminData.email || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-red-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Mot de passe</label>
            <input
              type="text"
              name="mot de passe"
              value={adminData.password || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-red-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Rôle</label>
            <select
              name="role"
              value={adminData.role || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-red-400"
              required
            >
              <option value="">-- Choisir un rôle --</option>
              <option value="admin">Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 text-white font-semibold py-2 rounded-lg hover:bg-red-700 transition"
          >
            Enregistrer les modifications
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditAdmin;
