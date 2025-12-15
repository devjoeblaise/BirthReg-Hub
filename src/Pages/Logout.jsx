import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { signOut } from "firebase/auth";
import { auth } from "../../Firebase-config";
import { useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";

const Logout = ({ setIsAuth }) => {
  const navigate = useNavigate();
  const [confirmOpen, setConfirmOpen] = useState(true);

  const handleLogout = async () => {
    try {
      await signOut(auth);

      // ✅ CLEAR AUTH STATE
      setIsAuth(false);
      localStorage.removeItem("isAuth");

      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#1D242A] via-black to-[#0a0f14] text-white p-6">
      <AnimatePresence>
        {confirmOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.6, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.4 }}
            className="bg-white/10 backdrop-blur-xl p-8 rounded-2xl border border-white/20 shadow-[0_0_20px_rgba(127,255,212,0.3)] max-w-md w-full"
          >
            <div className="text-center">
              <FiLogOut className="text-5xl mx-auto mb-4 text-[#7FFFD4] drop-shadow-[0_0_8px_#7FFFD4]" />

              <h1 className="text-2xl font-bold mb-2">Confirm Logout</h1>
              <p className="text-white/80 mb-6">
                Are you sure you want to log out?
              </p>

              <div className="flex gap-4 mt-4">
                <button
                  onClick={handleLogout}
                  className="w-1/2 bg-[#7FFFD4] text-black font-semibold py-3 rounded-xl hover:bg-[#6ae8c7] transition-all duration-300 shadow-[0_0_10px_#7FFFD4]"
                >
                  Yes, Logout
                </button>

                <button
                  onClick={() => navigate(-1)}
                  className="w-1/2 bg-red-500/80 hover:bg-red-600 text-white py-3 rounded-xl transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Logout;
