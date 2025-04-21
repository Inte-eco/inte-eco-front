import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../services/Firebase/FirebaseConfig";

const StationStats = () => {
  const { stationId } = useParams();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "stations", stationId!), (docSnap) => {
      if (docSnap.exists()) {
        setData(docSnap.data());
      }
    });

    return () => unsub();
  }, [stationId]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Statistiques de la station</h2>
      {data ? (
        <div className="bg-white p-4 rounded shadow">
          <p><strong>Nom :</strong> {data.nom}</p>
          <p><strong>Propriétaire :</strong> {data.proprietaire}</p>
          <p><strong>Client ID :</strong> {data.clientId}</p>
          <p><strong>État :</strong> {data.etat}</p>
          {/* Affiche ici tes statistiques en temps réel, par exemple un graphique */}
        </div>
      ) : (
        <p>Chargement des données...</p>
      )}
    </div>
  );
};

export default StationStats;
