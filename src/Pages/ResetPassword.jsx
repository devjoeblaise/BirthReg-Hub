import React, { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../Firebase-config";
import { motion, AnimatePresence } from "framer-motion";
import { AiOutlineMail } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Validation
  const validateEmail = () => {
    if (!email) {
      setErrorMsg("Email is required.");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setErrorMsg("Enter a valid email address.");
      return false;
    }
    return true;
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setSuccess(false);
    setErrorMsg("");

    if (!validateEmail()) return;

    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess(true);
      toast.success("Check your email for a reset link!");
      setLoading(false);

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {
      setLoading(false);
      setErrorMsg("Error sending reset email. Make sure the email is valid.");
      toast.error("Reset email failed. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-linear-to-br from-purple-900 via-black to-blue-900 p-5">

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-white/10 backdrop-blur-xl p-10 rounded-2xl shadow-xl w-[380px] border border-white/10"
      >
        {/* HEADER */}
        <div className="text-center mb-6">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 1.8 }}
            className="text-white text-4xl mb-2"
          >
            🔐
          </motion.div>

          <h2 className="text-white text-2xl font-semibold">Reset Password</h2>
          <p className="text-gray-300 text-sm">Enter your email to receive reset instructions.</p>
        </div>

        {/* SUCCESS MESSAGE */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="bg-green-600/20 border border-green-400 text-green-300 px-4 py-3 rounded-lg mb-4"
            >
              ✅ Password reset email sent successfully!
            </motion.div>
          )}
        </AnimatePresence>

        {/* ERROR MESSAGE */}
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-600/20 border border-red-400 text-red-300 px-4 py-3 rounded-lg mb-4"
          >
            ⚠️ {errorMsg}
          </motion.div>
        )}

        {/* FORM */}
        <form onSubmit={handleReset} className="space-y-4">

          <div>
            <label className="text-gray-300 text-sm">Email</label>
            <div className="relative mt-1">
              <AiOutlineMail className="absolute left-3 top-3 text-gray-300" />
              <input
                type="email"
                required
                className="w-full p-3 pl-10 rounded-lg bg-white/10 border border-white/20 text-white outline-none"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 transition text-white font-semibold py-3 rounded-lg shadow-lg"
          >
            {loading ? "Sending..." : "Send Reset Email"}
          </motion.button>
        </form>

        {/* BACK TO LOGIN (FULLY WORKING) */}
        <div className="text-center mt-6">
          <Link
            to="/login"
            className="text-indigo-300 hover:text-indigo-400 underline transition font-medium"
          >
            ← Back to Login
          </Link>
        </div>

      </motion.div>
    </div>
  );
};

export default ResetPassword;
