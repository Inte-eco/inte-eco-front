import { useState, FormEvent } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../../services/Firebase/FirebaseConfig";
import { useNavigate } from "react-router-dom";
import useAdminCredentials from "../../hooks/useAdminCredentials";

const AddAdmin = () => {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { adminEmail, adminPassword } = useAdminCredentials();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const uid = user.uid;

      await setDoc(doc(db, "admins", uid), {
        uid: uid,
        nom,
        email,
        password,
        role: "super_admin",
        dateCreation: serverTimestamp(),
        creePar: sessionStorage.getItem("adminUid") || "admin inconnu",
      });

      // Reconnexion de l’admin
      if (adminEmail && adminPassword) {
        await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
      }

      alert("Administrateur créé avec succès !");
      navigate("/dash-admin/manage-user/admins");
    } catch (error: any) {
      console.error("Erreur :", error);
      if (error.code === "auth/email-already-in-use") {
        alert("Cet email est déjà utilisé.");
      } else {
        alert("Erreur lors de la création de l'administrateur.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-1 items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-xl">
        <h2 className="text-3xl font-bold text-center text-red-600 mb-6">Créer un administrateur</h2>
        <p className="text-center text-gray-500 mb-4">
          Cet administrateur aura le rôle <span className="font-medium text-red-500">"super_admin"</span> et pourra gérer la plateforme.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Nom complet</label>
            <input
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-red-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-red-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-red-400"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-red-600 text-white font-semibold py-2 rounded-lg hover:bg-red-700 transition ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Création en cours..." : "Ajouter l’administrateur"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddAdmin;
