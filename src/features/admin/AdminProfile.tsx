import { useEffect, useState } from "react";
import { auth, db, storage } from "../../services/Firebase/FirebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const AdminProfile = () => {
  const user = auth.currentUser;
  const [adminData, setAdminData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const fetchAdminData = async () => {
    if (user) {
      const docRef = doc(db, "admins", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setAdminData(docSnap.data());
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleSave = async () => {
    if (!adminData) return;

    setLoading(true);

    // Upload photo if file is selected
    let photoURL = adminData.photoURL;
    if (file) {
      const storageRef = ref(storage, `admin_profiles/${user?.uid}`);
      await uploadBytes(storageRef, file);
      photoURL = await getDownloadURL(storageRef);
    }

    await updateDoc(doc(db, "admins", user!.uid), {
      nom: adminData.nom,
      email: adminData.email,
      photoURL,
    });

    setAdminData({ ...adminData, photoURL });
    setEditing(false);
    setLoading(false);
    alert("Profil mis à jour !");
  };

  if (loading) return <div className="text-center p-4">Chargement...</div>;

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-center text-red-600 mb-6">Profil de l’administrateur</h2>

      <div className="flex flex-col items-center gap-4">
        <img
          src={adminData?.photoURL || "https://s3.eu-central-1.amazonaws.com/uploads.mangoweb.org/shared-prod/visegradfund.org/uploads/2021/08/placeholder-male.jpg"}
          alt="Photo de profil"
          className="w-24 h-24 rounded-full object-cover border border-gray-300"
        />
        {editing && (
        <div>
            <label className="cursor-pointer inline-block bg-gray-100 px-4 py-2 rounded-lg shadow hover:bg-gray-200">
            📸 Choisir une photo de profil
            <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="hidden"
            />
            </label>

            {file && (
            <p className="mt-2 text-sm text-gray-600">
                Fichier sélectionné : <strong>{file.name}</strong>
            </p>
            )}
        </div>
        )}
      </div>

      <div className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Nom</label>
          <input
            type="text"
            disabled={!editing}
            value={adminData?.nom}
            onChange={(e) => setAdminData({ ...adminData, nom: e.target.value })}
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
          <input
            type="email"
            disabled={!editing}
            value={adminData?.email}
            onChange={(e) => setAdminData({ ...adminData, email: e.target.value })}
            className="w-full border rounded p-2"
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-4">
        {editing ? (
          <>
            <button
              onClick={handleSave}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Sauvegarder
            </button>
            <button
              onClick={() => setEditing(false)}
              className="border px-4 py-2 rounded hover:bg-gray-100"
            >
              Annuler
            </button>
          </>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Modifier le profil
          </button>
        )}
      </div>
    </div>
  );
};

export default AdminProfile;
