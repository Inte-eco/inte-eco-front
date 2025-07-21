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
  if (value <= 400) return { color: "text-green-500", message: "Excellent" };
  if (value <= 600) return { color: "text-green-400", message: "Bon" };
  if (value <= 1200) return { color: "text-yellow-400", message: "Moyen" };
  if (value <= 2000) return { color: "text-red-400", message: "Mauvais" };
  return { color: "text-red-600", message: "Critique" };
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
      <h1 className="text-3xl font-bold mb-6">Tableau de bord Admin</h1>
  
      <div className="flex flex-wrap gap-4 mb-8">
        <button onClick={() => navigate("add-client")} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded text-base font-medium">🏢 Ajouter un client</button>
        <button onClick={() => navigate("add-user")} className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded text-base font-medium">👤 Ajouter un utilisateur</button>
        <button onClick={() => navigate("add-station")} className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded text-base font-medium">📡 Ajouter une station</button>
        <button onClick={() => navigate("add-admin")} className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded text-base font-medium">🛡️ Ajouter un admin</button>
      </div>
  
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {stations.map((station) => {
          const mesure = mesuresByStation[station.id];
          const co2 = mesure?.donnees?.co2 ?? "N/A";
          const humidity = mesure?.donnees?.humidity ?? "N/A";
          const status = typeof co2 === "number" ? getCO2Status(co2) : { color: "text-gray-500", message: "N/A" };
  
          return (
            <div
              key={station.id}
              className="p-5 rounded-lg shadow-md bg-white hover:shadow-lg cursor-pointer transition"
              onClick={() => navigate(`/dash-admin/statistic/${station.id}`)}
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
    </div>
  );
  
};

export default AdminDashboard;
