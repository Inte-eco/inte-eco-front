import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../../services/Firebase/FirebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const EditUser = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
  
    const fetchUser = async () => {
      try {
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);
  
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        } else {
          alert("Utilisateur non trouvé");
          navigate("/dash-admin/manage-user/users");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération :", error);
        alert("Erreur lors de la récupération des données");
        navigate("/dash-admin/manage-user/users");
      } finally {
        setLoading(false);
      }
    };
  
    fetchUser();
  }, [userId, navigate]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateDoc(doc(db, "users", userId!), userData);
      alert("Mise à jour réussie !");
      navigate("/dash-admin/manage-user/users");
    } catch (error) {
      console.error("Erreur de mise à jour :", error);
      alert("Erreur lors de la mise à jour");
    }
  };
  

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  if (loading) return <div className="p-6">Chargement...</div>;
  if (!userData) return null;

  return (
    <div className="p-6 max-w-xl mx-auto bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Modifier l'utilisateur</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Nom</label>
          <input
            type="text"
            name="nom"
            value={userData.nom || ""}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={userData.email || ""}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1">Rôle</label>
          <select
            name="role"
            value={userData.role || ""}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="">-- Choisir un rôle --</option>
            <option value="user">Utilisateur</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div>
          <label className="block mb-1">Client ID</label>
          <input
            type="text"
            name="clientId"
            value={userData.clientId || ""}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
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

export default EditUser;


