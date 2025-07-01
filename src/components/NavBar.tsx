import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../services/Firebase/FirebaseConfig";
import { FiMenu } from "react-icons/fi"; // Icône hamburger
import { FaSearch } from "react-icons/fa"; // Icône de recherche

const Navbar = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = async () => {
    try {
      sessionStorage.removeItem("adminUid");
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implémentez la logique de recherche ici
    console.log("Recherche :", searchQuery);
  };

  const handleSidebarToggle = () => {
    // Implémentez la logique pour ouvrir la sidebar ici
    console.log("Sidebar ouverte");
  };

  return (
    <nav className="bg-white p-4 flex justify-between items-center">
      {/* Bouton hamburger */}
      <button onClick={handleSidebarToggle} className="md:hidden mr-4">
        <FiMenu size={24} />
      </button>

      {/* Logo */}
      <img src="/inte5.png" alt="Logo Inteco" className="h-12 w-auto" />

      {/* Champ de recherche */}
      <form onSubmit={handleSearch} className="flex items-center bg-gray-100 rounded px-2 py-1 text-black">
        <input
          type="text"
          placeholder="Rechercher..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-transparent focus:outline-none"
        />
        <button type="submit" className="ml-2">
          <FaSearch />
        </button>
      </form>

      {/* Bouton de déconnexion */}
      <button
        onClick={handleLogout}
        className="ml-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
      >
        Déconnexion
      </button>
    </nav>
  );
};

export default Navbar;
