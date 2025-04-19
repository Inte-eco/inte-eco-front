import { useState, useEffect, FormEvent } from "react";
import { doc, setDoc, serverTimestamp, collection, getDocs } from "firebase/firestore";
import { db } from "../../services/Firebase/FirebaseConfig";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

const AddStation = () => {
  const [nom, setNom] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [typeCapteurs, setTypeCapteurs] = useState("");
  const [etat, setEtat] = useState("actif");
  const [dateInstallation, setDateInstallation] = useState("");
  const [proprietaire, setProprietaire] = useState("");
  const [clientId, setClientId] = useState("");
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState<{ nom: string; uid: string }[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "clients"));
        const clientList = querySnapshot.docs.map((doc) => ({
          uid: doc.id,
          nom: doc.data().nom,
        }));
        setClients(clientList);
      } catch (error) {
        console.error("Erreur lors du chargement des clients :", error);
      }
    };

    fetchClients();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const stationId = `station_${uuidv4().slice(0, 8)}`;

    const data = {
      uid: stationId,
      nom,
      emplacement: {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
      },
      typeCapteurs: typeCapteurs.split(",").map((capteur) => capteur.trim()),
      etat,
      dateInstallation,
      proprietaire,
      clientId,
      creePar: sessionStorage.getItem("adminUid") || "admin inconnu",
      dateCreation: serverTimestamp(),
    };

    try {
      await setDoc(doc(db, "stations", stationId), data);
      alert("Station ajoutée avec succès !");
      navigate("/dash-admin/manage-station");
    } catch (error) {
      console.error("Erreur lors de l'ajout de la station :", error);
      alert("Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-1 items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-xl">
        <h2 className="text-3xl font-bold text-center text-purple-500 mb-6">Ajouter une station</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Nom de la station</label>
            <input
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
              required
            />
          </div>

          <div className="flex space-x-4">
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-600 mb-1">Latitude</label>
              <input
                type="number"
                step="any"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
              />
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-600 mb-1">Longitude</label>
              <input
                type="number"
                step="any"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Types de capteurs (séparés par virgules)</label>
            <input
              type="text"
              value={typeCapteurs}
              onChange={(e) => setTypeCapteurs(e.target.value)}
              placeholder="air, temperature, humidite, pression"
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">État de la station</label>
            <select
              value={etat}
              onChange={(e) => setEtat(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              <option value="actif">Actif</option>
              <option value="inactif">Inactif</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Date d'installation</label>
            <input
              type="date"
              value={dateInstallation}
              onChange={(e) => setDateInstallation(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Propriétaire</label>
            <select
              value={proprietaire}
              onChange={(e) => {
                const selectedNom = e.target.value;
                setProprietaire(selectedNom);
                const selectedClient = clients.find((c) => c.nom === selectedNom);
                if (selectedClient) {
                  setClientId(selectedClient.uid);
                }
              }}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
              required
            >
              <option value="">-- Sélectionner un client --</option>
              {clients.map((client) => (
                <option key={client.uid} value={client.nom}>
                  {client.nom}
                </option>
              ))}
            </select>
          </div>

          <input type="hidden" value={clientId} readOnly />

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-purple-500 text-white font-semibold py-2 rounded-lg hover:bg-purple-700 transition ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Ajout en cours..." : "Ajouter la station"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddStation;
