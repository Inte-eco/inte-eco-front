import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "../services/Firebase/FirebaseConfig";

const getCO2Status = (value: number) => {
  if (value <= 400) return { color: "text-green-500", message: "Excellent" };
  if (value <= 600) return { color: "text-green-400", message: "Bon" };
  if (value <= 1200) return { color: "text-yellow-400", message: "Moyen" };
  if (value <= 2000) return { color: "text-red-400", message: "Mauvais" };
  return { color: "text-red-600", message: "Critique" };
};

const ClientDashboard = () => {
  const navigate = useNavigate();
  const clientUid = sessionStorage.getItem("clientUid");
  const [stations, setStations] = useState<any[]>([]);
  const [mesuresByStation, setMesuresByStation] = useState<Record<string, any>>({});

  // Charger les stations du client
  useEffect(() => {
    if (!clientUid) return;

    const q = query(
      collection(db, "stations"),
      where("clientId", "==", clientUid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setStations(list);
    });

    return () => unsubscribe();
  }, [clientUid]);

  // Charger les dernières mesures de chaque station
  useEffect(() => {
    const unsubscribes = stations.map((station) => {
      const q = query(
        collection(db, "stations", station.id, "mesures"),
        orderBy("timestamp", "desc"),
        limit(1)
      );

      return onSnapshot(q, (snapshot) => {
        const lastMesure = snapshot.docs[0]?.data();
        if (lastMesure) {
          setMesuresByStation((prev) => ({
            ...prev,
            [station.id]: lastMesure,
          }));
        }
      });
    });

    return () => unsubscribes.forEach((u) => u());
  }, [stations]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Tableau de bord Client</h1>

      {stations.length === 0 ? (
        <p className="text-gray-500">Aucune station liée à ce compte.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stations.map((station) => {
            const mesure = mesuresByStation[station.id];
            const co2 = mesure?.donnees?.co2 ?? "N/A";
            const humidity = mesure?.donnees?.humidity ?? "N/A";
            const status = typeof co2 === "number"
              ? getCO2Status(co2)
              : { color: "text-gray-500", message: "N/A" };

            return (
              <div
                key={station.id}
                className="p-5 rounded-lg shadow-md bg-white hover:shadow-lg cursor-pointer transition"
                onClick={() => navigate(`/dashboard/statistic/${station.id}`)}
              >
                <h2 className="text-3xl font-semibold text-gray-800">{station.nom}</h2>
                <p className="text-l italic text-gray-600">{station.proprietaire}</p>
                <p className={`text-2xl mt-4 font-bold ${status.color}`}>CO₂ : {(co2 / 1_000_000 * 100).toFixed(4) + '%'}</p>
                <p className="text-2xl mt-2 text-blue-800 font-semibold">Humidité : {typeof humidity === "number" ? (humidity/1000).toFixed(3)+ '%' : humidity}</p>
                <p className={`italic mt-1 text-l ${status.color}`}>{status.message}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ClientDashboard;
