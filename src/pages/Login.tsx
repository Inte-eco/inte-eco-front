import { useState, FormEvent } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../services/Firebase/FirebaseConfig";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
  
    try {
      // Étape 1 : Authentification
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;
  
      // Étape 2 : Récupération du rôle depuis Firestore
      let role: string | null = null;
  
      const clientDocRef = doc(db, "clients", uid);
      const clientDocSnap = await getDoc(clientDocRef);
      if (clientDocSnap.exists()) {
        role = clientDocSnap.data().role;
        sessionStorage.setItem("clientUid", uid);
      } else {
        const userDocRef = doc(db, "users", uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          role = userDocSnap.data().role;
          sessionStorage.setItem("userUid", uid);
        } else {
          const adminDocRef = doc(db, "admins", uid);
          const adminDocSnap = await getDoc(adminDocRef);
          if (adminDocSnap.exists()) {
            role = adminDocSnap.data().role;
            // 🔐 Enregistrer l'UID dans la session
            sessionStorage.setItem("adminUid", uid);
          }
        }
      }
  
      // Étape 3 : Redirection basée sur le rôle
      if (role === "client" || role === "user") {
        navigate("/dashboard");
      } else if (role === "admin" || role === "super_admin") {
        navigate("/dash-admin");
      } else {
        setError("Rôle utilisateur non reconnu.");
      }
    } catch (err) {
      console.error(err);
      setError("Email ou mot de passe incorrect !");
    }
  };
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img src="/inte5.png" alt="Logo Inteco" className="h-28 w-auto" />
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 text-sm mb-1">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800"
              placeholder="Adresse email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm mb-1">Mot de passe</label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-800 hover:bg-blue-900 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
          >
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
