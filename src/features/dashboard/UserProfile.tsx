import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../services/Firebase/FirebaseConfig";

const UserProfile = () => {
  const [userAuth, setUserAuth] = useState<User | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUserAuth(currentUser);

        try {
          const userDocRef = doc(db, "users", currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            setUserData(userDocSnap.data());
          } else {
            console.warn("Aucune donnée utilisateur trouvée dans Firestore.");
          }
        } catch (error) {
          console.error("Erreur lors de la récupération des données utilisateur :", error);
        }
      } else {
        setUserAuth(null);
        setUserData(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <div className="text-center mt-10">Chargement du profil...</div>;

  if (!userAuth || !userData) {
    return <div className="text-center mt-10 text-red-500">Utilisateur non connecté ou données indisponibles.</div>;
  }

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white shadow-md rounded-xl p-6">
      <h2 className="text-2xl font-bold text-green-600 mb-4 text-center">Profil Utilisateur</h2>

      <div className="space-y-3">
        <p><strong>Nom :</strong> {userData.nom}</p>
        <p><strong>Email :</strong> {userData.email}</p>
        <p><strong>Rôle :</strong> {userData.role}</p>
        <p><strong>Client :</strong> {userData.clientId}</p>
        <p><strong>Stations gérées :</strong> {userData.stationsGerees?.join(", ") || "Aucune"}</p>
        <p><strong>Notifications :</strong> {userData.notificationsActives ? "Activées" : "Désactivées"}</p>
        <p><strong>Date de création :</strong> {userData.dateCreation?.toDate().toLocaleString() || "Inconnue"}</p>
      </div>
    </div>
  );
};

export default UserProfile;
