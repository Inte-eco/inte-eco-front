import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../services/Firebase/FirebaseConfig";

const EditClient = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();

  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [adresse, setAdresse] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchClient = async () => {
      if (!clientId) return;

      try {
        const clientRef = doc(db, "clients", clientId);
        const docSnap = await getDoc(clientRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setNom(data.nom || "");
          setEmail(data.email || "");
          setTelephone(data.telephone || "");
          setAdresse(data.adresse || "");
        } else {
          alert("Client non trouvé");
          navigate("/dash-admin/manage-client");
        }
      } catch (error) {
        alert("Erreur lors de la récupération du client");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, [clientId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId) return;

    setUpdating(true);

    try {
      const clientRef = doc(db, "clients", clientId);
      await updateDoc(clientRef, {
        nom,
        email,
        telephone,
        adresse,
      });

      alert("Client mis à jour avec succès !");
      navigate("/dash-admin/manage-client");
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
      alert("Erreur lors de la mise à jour du client.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="p-6">Chargement...</div>;

  return (
    <div className="flex flex-1 items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-xl">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">Modifier un client</h2>
        <p className="text-center text-gray-500 mb-4">Tu modifies les informations du client actuel.</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Nom de la société</label>
            <input
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Téléphone</label>
            <input
              type="tel"
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Adresse</label>
            <input
              type="text"
              value={adresse}
              onChange={(e) => setAdresse(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <button
            type="submit"
            disabled={updating}
            className={`w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition ${
              updating ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {updating ? "Mise à jour..." : "Enregistrer les modifications"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditClient;
