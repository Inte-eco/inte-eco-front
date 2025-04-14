const Sidebar = () => {
    return (
      <div className="w-64 bg-white shadow-md h-full p-4">
        <h2 className="text-xl font-bold mb-6">Admin</h2>
        <ul className="space-y-4">
          <li><a href="/dash-admin" className="hover:text-blue-500">Accueil</a></li>
          <li><a href="/dash-admin/add-client" className="hover:text-blue-500">Ajouter un client</a></li>
          <li><a href="/dash-admin/add-user" className="hover:text-blue-500">Ajouter un utilisateur</a></li>
          <li><a href="/dash-admin/add-station" className="hover:text-blue-500">Ajouter une station</a></li>
        </ul>
      </div>
    );
  };
  
  export default Sidebar;
  