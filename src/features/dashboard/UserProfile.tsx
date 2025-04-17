import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../services/Firebase/FirebaseConfig";

const UserProfile = () => {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const uid = sessionStorage.getItem("uid");

    if (!uid) {
      setLoading(false);
      return;
    }

    const fetchUserProfile = async () => {
      const collections = ["users", "clients", "admins"];

      try {
        for (const collection of collections) {
          const docRef = doc(db, collection, uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setUserData(docSnap.data());
            break;
          }
        }
      } catch (error) {
        console.error("Erreur lors de la récupération du profil :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) return <div className="text-center mt-10">Chargement du profil...</div>;

  if (!userData) {
    return <div className="text-center mt-10 text-red-500">Aucun utilisateur trouvé.</div>;
  }

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white shadow-md rounded-xl p-6">
      <h2 className="text-2xl font-bold text-green-600 mb-4 text-center">Profil Utilisateur</h2>

      <div className="space-y-3">
        <p><strong>Nom :</strong> {userData.nom}</p>
        <p><strong>Email :</strong> {userData.email}</p>
        <p><strong>Rôle :</strong> {userData.role}</p>
        {userData.clientId && <p><strong>Client :</strong> {userData.clientId}</p>}
        {userData.stationsGerees && (
          <p><strong>Stations gérées :</strong> {userData.stationsGerees.join(", ")}</p>
        )}
        {userData.notificationsActives !== undefined && (
          <p><strong>Notifications :</strong> {userData.notificationsActives ? "Activées" : "Désactivées"}</p>
        )}
        {userData.dateCreation && (
          <p><strong>Date de création :</strong> {userData.dateCreation.toDate().toLocaleString()}</p>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
