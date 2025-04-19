// src/hooks/useAdminCredentials.ts
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/Firebase/FirebaseConfig";

const useAdminCredentials = () => {
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminCredentials = async () => {
      const adminUid = sessionStorage.getItem("adminUid");
      if (!adminUid) {
        setLoading(false);
        return;
      }

      const adminDocRef = doc(db, "admins", adminUid);
      const adminSnap = await getDoc(adminDocRef);

      if (adminSnap.exists()) {
        const adminData = adminSnap.data();
        setAdminEmail(adminData.email);
        setAdminPassword(adminData.password); // ⚠️ en clair seulement temporairement pour dev
      }

      setLoading(false);
    };

    fetchAdminCredentials();
  }, []);

  return { adminEmail, adminPassword, loading };
};

export default useAdminCredentials;
