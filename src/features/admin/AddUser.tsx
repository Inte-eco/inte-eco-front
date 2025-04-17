import { useState, FormEvent } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../../services/Firebase/FirebaseConfig";
import { useNavigate } from "react-router-dom";

const AddUser = () => {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("gestionnaire");
  const [clientId, setClientId] = useState("");
  const [stationsGerees, setStationsGerees] = useState<string[]>([]);
  const [notificationsActives, setNotificationsActives] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const uid = user.uid;

      await setDoc(doc(db, "users", uid), {
        uid: uid,
        nom,
        email,
        password,
        role,
        clientId,
        stationsGerees,
        notificationsActives,
        dateCreation: serverTimestamp(),
        creePar: auth.currentUser?.uid || "admin inconnu",
      });

      alert("Utilisateur ajouté avec succès !");
      navigate("/dash-admin/manage-user");
    } catch (error: any) {
      console.error("Erreur :", error);
      if (error.code === "auth/email-already-in-use") {
        alert("Cet email est déjà utilisé.");
      } else {
        alert("Erreur lors de la création de l'utilisateur.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const stations = e.target.value.split(",").map((s) => s.trim());
    setStationsGerees(stations);
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
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Nom complet</label>
            <input
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Rôle</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              <option value="gestionnaire">Gestionnaire</option>
              <option value="technicien">Technicien</option>
              <option value="superviseur">Superviseur</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">ID du client</label>
            <input
              type="text"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Stations gérées (séparées par virgules)</label>
            <input
              type="text"
              onChange={handleStationChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={notificationsActives}
              onChange={(e) => setNotificationsActives(e.target.checked)}
              className="mr-2"
            />
            <label className="text-sm text-gray-600">Notifications actives</label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-green-600 text-white font-semibold py-2 rounded-lg hover:bg-green-700 transition ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Ajout en cours..." : "Ajouter l’utilisateur"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddUser;
