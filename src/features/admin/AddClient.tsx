import { useState, FormEvent } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../../services/Firebase/FirebaseConfig";
import { useNavigate } from "react-router-dom";

const AddClient = () => {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [adresse, setAdresse] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Étape 1 : Créer l'utilisateur dans Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Étape 2 : Sauvegarder les infos du client dans Firestore
      await addDoc(collection(db, "clients"), {
        uid: user.uid,
        nom,
        email,
        telephone,
        adresse,
        password,
        role: "client",
        stations: [],
        dateCreation: serverTimestamp(),
        creePar: auth.currentUser?.uid || "admin inconnu",
      });

      alert("Client créé avec succès !");
      navigate("/dash-admin");
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">Ajouter un client</h2>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Nom de la société"
            className="w-full p-2 border rounded"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Mot de passe"
            className="w-full p-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <input
            type="tel"
            placeholder="Téléphone"
            className="w-full p-2 border rounded"
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Adresse"
            className="w-full p-2 border rounded"
            value={adresse}
            onChange={(e) => setAdresse(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded"
            disabled={loading}
          >
            {loading ? "Ajout..." : "Ajouter le client"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddClient;
