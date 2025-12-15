import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "../Firebase-config";

import Navbar from "./Components/Navbar";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import ResetPassword from "./Pages/ResetPassword";
import BirthRegistration from "./Pages/BirthRegistration";
import BirthRecord from "./Pages/BirthRecord";
import Home from "./Pages/Home";
import Logout from "./Pages/Logout";
import RequireAuth from "./Components/RequireAuth";

const App = () => {
  const [isAuth, setIsAuth] = useState(null); // IMPORTANT

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuth(!!user);
    });

    return () => unsubscribe();
  }, []);

  // Prevent white screen while auth loads
  if (isAuth === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Loading...
      </div>
    );
  }

  return (
    <>
      <Navbar isAuth={isAuth} />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />

        <Route
          path="/login"
          element={!isAuth ? <Login setIsAuth={setIsAuth} /> : <Navigate to="/" />}
        />

        <Route
          path="/register"
          element={!isAuth ? <Register setIsAuth={setIsAuth} /> : <Navigate to="/" />}
        />

        <Route path="/reset" element={<ResetPassword />} />

        {/* Protected Routes */}
        <Route
          path="/birthregistration"
          element={
            <RequireAuth isAuth={isAuth}>
              <BirthRegistration />
            </RequireAuth>
          }
        />

        <Route
          path="/birthrecord"
          element={
            <RequireAuth isAuth={isAuth}>
              <BirthRecord />
            </RequireAuth>
          }
        />

        

        <Route
          path="/logout"
          element={
            <RequireAuth isAuth={isAuth}>
              <Logout setIsAuth={setIsAuth} />
            </RequireAuth>
          }
        />
      </Routes>
    </>
  );
};

export default App;
