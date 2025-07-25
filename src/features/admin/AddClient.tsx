import { useState, useEffect, FormEvent } from "react";
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

const AddClient = () => {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [adresse, setAdresse] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [stations, setStations] = useState<string[]>([]);
  const [stationsAssociees, setStationsAssociees] = useState<string[]>([]);

  const navigate = useNavigate();
  const { adminEmail, adminPassword } = useAdminCredentials();

  useEffect(() => {
    const fetchStationsFromClients = async () => {
      const clientsSnapshot = await getDocs(collection(db, "clients"));
      const allStations: Set<string> = new Set();

      clientsSnapshot.forEach((doc) => {
        const clientData = doc.data();
        if (Array.isArray(clientData.stations)) {
          clientData.stations.forEach((stationId: string) => {
            allStations.add(stationId);
          });
        }
      });

      setStations(Array.from(allStations));
    };

    fetchStationsFromClients();
  }, []);

  const toggleStation = (stationId: string) => {
    setStationsAssociees((prev) =>
      prev.includes(stationId)
        ? prev.filter((id) => id !== stationId)
        : [...prev, stationId]
    );
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const uid = user.uid;

      await setDoc(doc(db, "clients", uid), {
        uid,
        nom,
        email,
        telephone,
        adresse,
        password,
        role: "client",
        stations: stationsAssociees,
        dateCreation: serverTimestamp(),
        creePar: sessionStorage.getItem("adminUid") || "admin inconnu",
      });

      if (adminEmail && adminPassword) {
        await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
      }

      alert("Client créé avec succès !");
      navigate("/dash-admin/manage-client");
    } catch (error: any) {
      console.error("Erreur :", error);
      if (error.code === "auth/email-already-in-use") {
        alert("Cet email est déjà utilisé.");
      } else {
        alert("Erreur lors de la création du client.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-1 items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-xl">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">Créer un nouveau client</h2>
        <p className="text-center text-gray-500 mb-4">
          Ce client aura un rôle <span className="font-medium text-blue-500">"client"</span> et pourra gérer ses stations.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Nom de la société</label>
            <input
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Téléphone</label>
            <input
              type="tel"
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Adresse</label>
            <input
              type="text"
              value={adresse}
              onChange={(e) => setAdresse(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2"
              required
            />
          </div>

          {/* Stations associées */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Stations associées</label>
            <div className="border rounded-lg p-2 h-32 overflow-y-auto space-y-1">
              {stations.length > 0 ? (
                stations.map((stationId) => (
                  <div key={stationId} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={stationsAssociees.includes(stationId)}
                      onChange={() => toggleStation(stationId)}
                    />
                    <span>{stationId}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-sm">Aucune station trouvée.</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Création en cours..." : "Ajouter le client"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddClient;
