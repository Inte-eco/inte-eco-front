// Sidebar.tsx
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../services/Firebase/FirebaseConfig";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      sessionStorage.removeItem("adminUid");
      await signOut(auth);
      navigate("/"); // Redirige vers la page d'accueil après la déconnexion
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
    }
  };

  return (
    <div className="flex">
      {/* Bouton toggle visible sur petits écrans */}
      <button
        className="md:hidden p-4 text-blue-600"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`${
          isOpen ? "block" : "hidden"
        } md:block w-64 bg-white shadow-md h-screen p-4 fixed md:relative z-50`}
      >
        <ul className="space-y-4">
          <li>
            <a href="/dash-admin" className="hover:text-blue-500">
              🏠 Accueil
            </a>
          </li>
          <li>
            <a href="/dash-admin/manage-client" className="hover:text-blue-500">
              👥 Gestion de comptes
            </a>
          </li>
          <li>
            <a href="/dash-admin/manage-user" className="hover:text-blue-500">
              👤 Gestion d'utilisateur
            </a>
          </li>
          <li>
            <a href="/dash-admin/manage-station" className="hover:text-blue-500">
              📡 Gestion de stations
            </a>
          </li>
          <li>
            <a href="/dash-admin/stats" className="hover:text-blue-500">
              📊 Statistiques
            </a>
          </li>
          <li>
            <a href="/dash-admin/profile" className="hover:text-blue-500">
              🙍‍♂️ Profil
            </a>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="hover:text-red-500 w-full text-left"
            >
              🔒 Déconnexion
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
