import { Link, NavigateFunction, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../services/Firebase/FirebaseConfig";

const Navbar = () => {
  const navigate: NavigateFunction = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
    }
  };

  return (
    <nav className="bg-orange-400 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Inteco</h1>
      <div className="space-x-4">
        <Link to="/dash-admin" className="hover:underline">Accueil</Link>
        <Link to="/dash-admin/add-client" className="hover:underline">Client</Link>
        <button onClick={handleLogout} className="hover:underline bg-transparent border-none text-white cursor-pointer">
          Déconnexion
        </button>
      </div>
    </nav>
  );
};

export default Navbar;