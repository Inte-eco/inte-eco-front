import { useEffect, useState } from "react";
import { db } from "../../services/Firebase/FirebaseConfig";
import { doc, getDoc } from "firebase/firestore";

const ClientProfile = () => {
  const [clientData, setClientData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const uid = sessionStorage.getItem("clientUid");

  const fetchClientData = async () => {
    if (uid) {
      const docRef = doc(db, "clients", uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setClientData(docSnap.data());
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchClientData();
  }, []);

  if (loading) return <div className="text-center p-4">Chargement...</div>;

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-center text-green-600 mb-6">
        Profil du client
      </h2>

      <div className="flex flex-col items-center gap-4">
        <img
          src={
            clientData?.photoURL ||
            "https://s3.eu-central-1.amazonaws.com/uploads.mangoweb.org/shared-prod/visegradfund.org/uploads/2021/08/placeholder-male.jpg"
          }
          alt="Photo de profil"
          className="w-24 h-24 rounded-full object-cover border border-gray-300"
        />
      </div>

      <div className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Nom</label>
          <input
            type="text"
            disabled
            value={clientData?.nom || ""}
            className="w-full border rounded p-2 bg-gray-100 text-gray-700"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
          <input
            type="email"
            disabled
            value={clientData?.email || ""}
            className="w-full border rounded p-2 bg-gray-100 text-gray-700"
          />
        </div>
      </div>
    </div>
  );
};

export default ClientProfile;
