import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "../services/Firebase/FirebaseConfig";

const sendNotification = (stationName: string, value: number) => {
  console.log(`📧 Notification: Station ${stationName} a un CO₂ élevé: ${value} ppm`);
};

const getCO2Status = (value: number) => {
  if (value <= 400) return { color: "bg-green-500", message: "Excellent" };
  if (value <= 600) return { color: "bg-green-400", message: "Bon" };
  if (value <= 1200) return { color: "bg-yellow-400", message: "Moyen" };
  if (value <= 2000) return { color: "bg-red-400", message: "Mauvais" };
  return { color: "bg-red-600", message: "Critique" };
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stations, setStations] = useState<any[]>([]);
  const [mesuresByStation, setMesuresByStation] = useState<Record<string, any>>({});

  // Récupérer les stations
  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, "stations"), orderBy("nom")),
      (snapshot) => {
        const list = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setStations(list);
      }
    );
    return () => unsubscribe();
  }, []);

  // Écoute temps réel des dernières mesures
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
          setMesuresByStation((prev) => {
            const current = prev[station.id];
            const newCO2 = lastMesure.donnees?.co2;

            if (
              current?.donnees?.co2 !== newCO2 &&
              newCO2 >= 1200 // Mauvais ou pire
            ) {
              sendNotification(station.nom, newCO2);
            }

            return {
              ...prev,
              [station.id]: lastMesure,
            };
          });
        }
      });
    });

    return () => unsubscribes.forEach((u) => u());
  }, [stations]);

  return (
    <div className="flex-1 p-6 bg-gray-100 overflow-y-auto">
      <h1 className="text-2xl font-bold mb-4">Tableau de bord Admin</h1>

      <div className="flex flex-wrap gap-4 mb-6">
        <button onClick={() => navigate("add-client")} className="bg-blue-500 text-white px-4 py-2 rounded">🏢 Ajouter un client</button>
        <button onClick={() => navigate("add-user")} className="bg-green-500 text-white px-4 py-2 rounded">👤 Ajouter un utilisateur</button>
        <button onClick={() => navigate("add-station")} className="bg-purple-500 text-white px-4 py-2 rounded">📡 Ajouter une station</button>
        <button onClick={() => navigate("add-admin")} className="bg-red-500 text-white px-4 py-2 rounded">🛡️ Ajouter un admin</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {stations.map((station) => {
          const mesure = mesuresByStation[station.id];
          const co2 = mesure?.donnees?.co2 ?? "N/A";
          const status = typeof co2 === "number" ? getCO2Status(co2) : { color: "bg-gray-300", message: "N/A" };

          return (
            <div
              key={station.id}
              className={`p-4 rounded shadow text-white cursor-pointer hover:opacity-90 ${status.color}`}
              onClick={() => navigate(`/dash-admin/statistic/${station.id}`)}
            >
              <h2 className="text-lg font-semibold">{station.nom}</h2>
              <p className="text-sm italic">{station.proprietaire}</p>
              <p className="text-2xl mt-2">CO₂ : {co2}</p>
              <p className="italic">{status.message}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminDashboard;
