import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="h-screen bg-gray-100 flex flex-col">
      <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">Inteco</h1>
      </nav>

      <div className="flex-grow flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-6xl font-bold text-blue-600 mb-4">404</h1>
        <p className="text-2xl text-gray-700 mb-2">Oups ! Cette page n'existe pas.</p>
        <p className="text-gray-500 mb-6">La page que vous recherchez est introuvable.</p>

        <Link
          to="/"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Retour à l’accueil
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
