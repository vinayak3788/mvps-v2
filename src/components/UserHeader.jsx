import React, { useEffect, useState } from "react";
import { auth } from "../config/firebaseConfig";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function UserHeader() {
  const [firstName, setFirstName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setFirstName("");
      return;
    }

    // Call your existing backend route /api/get-profile with user.email
    axios
      .get(`/api/get-profile?email=${encodeURIComponent(user.email)}`)
      .then((res) => {
        // If firstName exists, use it; otherwise fallback to email username
        setFirstName(res.data.firstName || user.email.split("@")[0]);
      })
      .catch((error) => {
        console.error("Error fetching user profile:", error);
        setFirstName(user.email.split("@")[0]);
      });
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login", { replace: true });
  };

  return (
    <div className="user-header">
      <span>Welcome, {firstName}!</span>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
