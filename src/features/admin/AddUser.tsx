import { useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  doc,
  setDoc,
  serverTimestamp,
  collection,
  getDocs,
} from "firebase/firestore";
import { auth, db } from "../../services/Firebase/FirebaseConfig";
import { useNavigate } from "react-router-dom";
import useAdminCredentials from "../../hooks/useAdminCredentials";

const AddUser = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("gestionnaire");
  const [clientId, setClientId] = useState("");
  const [stationsGerees, setStationsGerees] = useState<string[]>([]);
  const [notificationsActives, setNotificationsActives] = useState(true);

  const [clients, setClients] = useState<any[]>([]);
  const [stations, setStations] = useState<any[]>([]);

  const { adminEmail, adminPassword } = useAdminCredentials();

  // Récupération des clients et leurs stations (dans le champ `stations`)
  useEffect(() => {
    const fetchClients = async () => {
      const snapshot = await getDocs(collection(db, "clients"));
      const clientList = snapshot.docs.map(doc => ({
        id: doc.id,
        nom: doc.data().nom,
        stations: doc.data().stations || [], // Récupère les stations du client
      }));
      setClients(clientList);
    };

    fetchClients();
  }, []);

  // Met à jour les stations affichées selon le client sélectionné
  useEffect(() => {
    const selectedClient = clients.find(client => client.id === clientId);
    if (selectedClient) {
      setStations(selectedClient.stations);
    } else {
      setStations([]);
    }
  }, [clientId, clients]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;
      const uid = newUser.uid;

      await setDoc(doc(db, "users", uid), {
        uid,
        nom,
        email,
        password,
        role,
        clientId,
        stationsGerees,
        notificationsActives,
        dateCreation: serverTimestamp(),
        creePar: sessionStorage.getItem("adminUid"),
      });

      if (adminEmail && adminPassword) {
        await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
      }

      alert("Utilisateur ajouté avec succès !");
      navigate("/dash-admin/manage-user/users");
    } catch (error: any) {
      console.error("Erreur :", error);
      alert(error.code === "auth/email-already-in-use"
        ? "Cet email est déjà utilisé."
        : "Erreur lors de la création de l'utilisateur.");
    } finally {
      setLoading(false);
    }
  };

  const toggleStationSelection = (id: string) => {
    setStationsGerees(prev =>
      prev.includes(id)
        ? prev.filter(s => s !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="flex flex-1 items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-xl">
        <h2 className="text-3xl font-bold text-center text-green-600 mb-6">Ajouter un utilisateur</h2>
        <p className="text-center text-gray-500 mb-4">
          Cet utilisateur aura le rôle :{" "}
          <span className="font-medium text-green-500">{role}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nom */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Nom complet</label>
            <input type="text" value={nom} onChange={(e) => setNom(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2" required />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2" required />
          </div>

          {/* Mot de passe */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Mot de passe</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2" required />
          </div>

          {/* Rôle */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Rôle</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2">
              <option value="gestionnaire">Gestionnaire</option>
              <option value="technicien">Technicien</option>
              <option value="superviseur">Superviseur</option>
            </select>
          </div>

          {/* Client ID */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Client</label>
            <select value={clientId} onChange={(e) => setClientId(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2" required>
              <option value="">-- Sélectionner un client --</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>
                  {client.nom} ({client.id})
                </option>
              ))}
            </select>
          </div>

          {/* Stations gérées */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Stations gérées</label>
            <div className="border rounded-lg p-2 h-32 overflow-y-auto space-y-1">
              {stations.map((stationId: string) => (
                <div key={stationId} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={stationsGerees.includes(stationId)}
                    onChange={() => toggleStationSelection(stationId)}
                  />
                  <label>{stationId}</label>
                </div>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div className="flex items-center">
            <input type="checkbox" checked={notificationsActives}
              onChange={(e) => setNotificationsActives(e.target.checked)} className="mr-2" />
            <label className="text-sm text-gray-600">Notifications actives</label>
          </div>

          {/* Submit */}
          <button type="submit" disabled={loading}
            className={`w-full bg-green-600 text-white font-semibold py-2 rounded-lg hover:bg-green-700 transition ${loading ? "opacity-70 cursor-not-allowed" : ""}`}>
            {loading ? "Ajout en cours..." : "Ajouter l’utilisateur"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddUser;
