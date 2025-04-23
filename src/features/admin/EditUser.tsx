import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import { db } from "../../services/Firebase/FirebaseConfig";

const EditUser = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [clients, setClients] = useState<any[]>([]);
  const [stations, setStations] = useState<string[]>([]);

  useEffect(() => {
    const fetchClients = async () => {
      const snapshot = await getDocs(collection(db, "clients"));
      const clientList = snapshot.docs.map(doc => ({
        id: doc.id,
        nom: doc.data().nom,
        stations: doc.data().stations || [],
      }));
      setClients(clientList);
    };
    fetchClients();
  }, []);

  useEffect(() => {
    if (!userData?.clientId) return;
    const selectedClient = clients.find(client => client.id === userData.clientId);
    if (selectedClient) {
      setStations(selectedClient.stations);
    } else {
      setStations([]);
    }
  }, [userData?.clientId, clients]);

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
        console.error("Erreur de récupération :", error);
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
    const { name, value } = e.target;
    setUserData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (stationId: string) => {
    setUserData((prev: any) => {
      const current = prev.stationsGerees || [];
      const updated = current.includes(stationId)
        ? current.filter((id: string) => id !== stationId)
        : [...current, stationId];
      return { ...prev, stationsGerees: updated };
    });
  };

  const toggleNotifications = () => {
    setUserData((prev: any) => ({
      ...prev,
      notificationsActives: !prev.notificationsActives,
    }));
  };

  if (loading || !userData) return <div className="p-6">Chargement...</div>;

  return (
    <div className="flex flex-1 items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-xl">
        <h2 className="text-3xl font-bold text-center text-green-600 mb-6">Modifier l’utilisateur</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Nom complet</label>
            <input type="text" name="nom" value={userData.nom} onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
            <input type="email" name="email" value={userData.email} onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Mot de passe</label>
            <input type="text" name="mot de passe" value={userData.password} onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Rôle</label>
            <select name="role" value={userData.role} onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2">
              <option value="gestionnaire">Gestionnaire</option>
              <option value="technicien">Technicien</option>
              <option value="superviseur">Superviseur</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Client</label>
            <select name="clientId" value={userData.clientId} onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2" required>
              <option value="">-- Sélectionner un client --</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>
                  {client.nom} ({client.id})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Stations gérées</label>
            <div className="border rounded-lg p-2 h-32 overflow-y-auto space-y-1">
              {stations.map((stationId: string) => (
                <div key={stationId} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={userData.stationsGerees?.includes(stationId)}
                    onChange={() => handleCheckboxChange(stationId)}
                  />
                  <label>{stationId}</label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center">
            <input type="checkbox" checked={userData.notificationsActives}
              onChange={toggleNotifications} className="mr-2" />
            <label className="text-sm text-gray-600">Notifications actives</label>
          </div>

          <button type="submit"
            className="w-full bg-green-600 text-white font-semibold py-2 rounded-lg hover:bg-green-700 transition">
            Mettre à jour l’utilisateur
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditUser;
