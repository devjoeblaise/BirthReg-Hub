import React, { useState } from "react";
import { motion } from "framer-motion";
import { AiFillEyeInvisible, AiFillEye, AiOutlineMail,} from "react-icons/ai";
import { FaRegUser } from "react-icons/fa";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import GoogleAuth from "../Components/GoogleAuth";
import { auth } from "../../Firebase-config";

const initialState = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const Register = ({ setIsAuth }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [passwordEye, setPasswordEye] = useState(false);
  const [confirmPasswordEye, setConfirmPasswordEye] = useState(false);

  const { username, email, password, confirmPassword } = formData;

  // -----------------------------
  // INPUT HANDLER
  // -----------------------------
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // -----------------------------
  // VALIDATION
  // -----------------------------
  const validateForm = () => {
    let newErrors = {};

    if (!username) newErrors.username = "Username is required";

    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email))
      newErrors.email = "Invalid email address";

    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    if (!confirmPassword)
      newErrors.confirmPassword = "Confirm your password";
    else if (password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // -----------------------------
  // EMAIL + PASSWORD REGISTER
  // -----------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await updateProfile(userCredential.user, {
        displayName: username,
      });

      localStorage.setItem("isAuth", true);
      setIsAuth(true);

      toast.success("Account created successfully!");
      navigate("/record");
    } catch (error) {
      toast.error("Email already in use or invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-linear-to-br from-purple-900 via-black to-blue-900 p-5">

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-10 border border-white/10"
      >
        <motion.h1
          initial={{ letterSpacing: "-10px", opacity: 0 }}
          animate={{ letterSpacing: "2px", opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="text-center text-3xl text-white font-bold mb-2"
        >
          Create Your Account
        </motion.h1>

        <p className="text-center text-gray-300 mb-8">
          Register to access your birth record dashboard
        </p>

        {/* FORM */}
        <form onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-6">

            {/* USERNAME */}
            <div>
              <label className="text-gray-300">Username</label>
              <div className="mt-2 relative">
                <input
                  type="text"
                  name="username"
                  value={username}
                  onChange={handleChange}
                  placeholder="Enter your username"
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white outline-none"
                />
                <FaRegUser className="absolute right-3 top-3 text-gray-300" />
              </div>
              {errors.username && (
                <span className="text-red-400 text-sm">{errors.username}</span>
              )}
            </div>

            {/* EMAIL */}
            <div>
              <label className="text-gray-300">Email Address</label>
              <div className="mt-2 relative">
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white outline-none"
                />
                <AiOutlineMail className="absolute right-3 top-3 text-gray-300" />
              </div>
              {errors.email && (
                <span className="text-red-400 text-sm">{errors.email}</span>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-6">

            {/* PASSWORD */}
            <div>
              <label className="text-gray-300">Password</label>
              <div className="mt-2 relative">
                <input
                  type={passwordEye ? "text" : "password"}
                  name="password"
                  value={password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white outline-none"
                />
                <span
                  onClick={() => setPasswordEye(!passwordEye)}
                  className="absolute right-3 top-3 cursor-pointer text-gray-300"
                >
                  {passwordEye ? <AiFillEye /> : <AiFillEyeInvisible />}
                </span>
              </div>
              {errors.password && (
                <span className="text-red-400 text-sm">{errors.password}</span>
              )}
            </div>

            {/* CONFIRM PASSWORD */}
            <div>
              <label className="text-gray-300">Confirm Password</label>
              <div className="mt-2 relative">
                <input
                  type={confirmPasswordEye ? "text" : "password"}
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm password"
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white outline-none"
                />
                <span
                  onClick={() =>
                    setConfirmPasswordEye(!confirmPasswordEye)
                  }
                  className="absolute right-3 top-3 cursor-pointer text-gray-300"
                >
                  {confirmPasswordEye ? (
                    <AiFillEye />
                  ) : (
                    <AiFillEyeInvisible />
                  )}
                </span>
              </div>
              {errors.confirmPassword && (
                <span className="text-red-400 text-sm">
                  {errors.confirmPassword}
                </span>
              )}
            </div>
          </div>

          <p className="text-center text-gray-300 text-sm mt-6">
            By creating an account, you agree to our{" "}
            <span className="underline cursor-pointer">
              Terms & Conditions
            </span>
            .
          </p>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 p-3 bg-indigo-600 hover:bg-indigo-700 transition text-white rounded-lg font-bold shadow-xl"
          >
            {loading ? "Creating Account..." : "Register Account"}
          </button>
        </form>

        {/* OR */}
        <div className="flex items-center gap-4 my-6">
          <hr className="flex-1 border-gray-500" />
          <span className="text-gray-300">OR</span>
          <hr className="flex-1 border-gray-500" />
        </div>

        {/* GOOGLE AUTH */}
        <GoogleAuth setIsAuth={setIsAuth} />

        <p className="text-center text-gray-300 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-300 underline">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
