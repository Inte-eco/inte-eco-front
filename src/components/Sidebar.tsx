import { useNavigate, useLocation } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../services/Firebase/FirebaseConfig";
import { useState } from "react";
import { Menu, X, ChevronDown, ChevronUp } from "lucide-react";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [userSubMenuOpen, setUserSubMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname.startsWith(path);

  const handleLogout = async () => {
    try {
      sessionStorage.removeItem("adminUid");
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
    }
  };

  return (
    <div className="flex">
      {/* Bouton toggle pour petits écrans */}
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
            <a
              href="/dash-admin"
              className={`hover:text-blue-500 ${
                isActive("/dash-admin") && location.pathname === "/dash-admin"
                  ? "text-blue-700 font-semibold"
                  : ""
              }`}
            >
              🏠 Accueil
            </a>
          </li>

          {/* Menu avec sous-items */}
          <li>
            <button
              onClick={() => setUserSubMenuOpen(!userSubMenuOpen)}
              className="flex items-center justify-between w-full hover:text-blue-500"
            >
              <span>👤 Gestion d'utilisateur</span>
              {userSubMenuOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            {userSubMenuOpen && (
              <ul className="ml-4 mt-2 space-y-2 text-sm text-gray-600">
                <li>
                  <a
                    href="/dash-admin/manage-user/admins"
                    className={`hover:text-blue-500 ${
                      isActive("/dash-admin/manage-user/admins")
                        ? "text-blue-700 font-semibold"
                        : ""
                    }`}
                  >
                    • Administrateurs
                  </a>
                </li>
                <li>
                  <a
                    href="/dash-admin/manage-user/users"
                    className={`hover:text-blue-500 ${
                      isActive("/dash-admin/manage-user/users")
                        ? "text-blue-700 font-semibold"
                        : ""
                    }`}
                  >
                    • Utilisateurs simples
                  </a>
                </li>
              </ul>
            )}
          </li>

          <li>
            <a
              href="/dash-admin/manage-client"
              className={`hover:text-blue-500 ${
                isActive("/dash-admin/manage-client")
                  ? "text-blue-700 font-semibold"
                  : ""
              }`}
            >
              👥 Gestion des clients
            </a>
          </li>

          <li>
            <a
              href="/dash-admin/manage-station"
              className={`hover:text-blue-500 ${
                isActive("/dash-admin/manage-station")
                  ? "text-blue-700 font-semibold"
                  : ""
              }`}
            >
              📡 Gestion de stations
            </a>
          </li>

          <li>
            <a
              href="/dash-admin/stats"
              className={`hover:text-blue-500 ${
                isActive("/dash-admin/stats")
                  ? "text-blue-700 font-semibold"
                  : ""
              }`}
            >
              📊 Statistiques
            </a>
          </li>

          <li>
            <a
              href="/dash-admin/profile"
              className={`hover:text-blue-500 ${
                isActive("/dash-admin/profile")
                  ? "text-blue-700 font-semibold"
                  : ""
              }`}
            >
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
