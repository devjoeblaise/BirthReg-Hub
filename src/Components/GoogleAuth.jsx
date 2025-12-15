import React from "react";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { provider, auth } from "../../Firebase-config";
import { toast } from "react-toastify";

const GoogleAuth = ({ setIsAuth }) => {
  const navigate = useNavigate();

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, provider);

      // Firebase auth listener will update isAuth
      setIsAuth(true);

      toast.success("Signed in with Google");
      navigate("/"); // ✅ HOME PAGE
    } catch (error) {
      console.error(error);
      toast.error("Google authentication failed");
    }
  };

  return (
    <button
      onClick={signInWithGoogle}
      className="w-full py-3 bg-white hover:bg-gray-100 text-gray-900 font-semibold rounded-lg flex items-center justify-center gap-3 shadow-lg"
    >
      <FcGoogle className="w-6 h-6" />
      <span>Sign up with Google</span>
    </button>
  );
};

export default GoogleAuth;
