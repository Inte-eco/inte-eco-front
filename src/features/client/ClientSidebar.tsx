import { useNavigate, useLocation } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../services/Firebase/FirebaseConfig";

const ClientSidebar = () => {
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

      {/* Sidebar */}
      <div
        className={`md:block w-64 bg-white shadow-md h-screen p-4 fixed md:relative z-50`}
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

          <li>
            <a
              href="/dash-admin/statistic"
              className={`hover:text-blue-500 ${
                isActive("/dash-admin/statistic")
                  ? "text-blue-700 font-semibold"
                  : ""
              }`}
            >
              📊 Utilisateur
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

export default ClientSidebar;
