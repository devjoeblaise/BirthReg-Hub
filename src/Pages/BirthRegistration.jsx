import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import {
  AiOutlineUser,
  AiOutlineHome,
  AiOutlineClockCircle,
} from "react-icons/ai";
import { db, auth } from "../../Firebase-config";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const BirthRegistration = ({ editData }) => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    childName: "",
    dobYear: "",
    dobMonth: "",
    dobDay: "",
    placeOfBirth: "",
    gender: "",
    timeOfBirth: "",
    fatherName: "",
    motherName: "",
    tribe: "",
    address: "",
  });

  // Redirect if user is not authenticated
  useEffect(() => {
    if (!auth.currentUser) {
      navigate("/login");
    }
  }, []);

  // Pre-fill form in edit mode
  useEffect(() => {
    if (editData) {
      const { id, ...rest } = editData;
      setForm(rest);
    }
  }, [editData]);

  const years = Array.from(
    { length: 120 },
    (_, i) => new Date().getFullYear() - i
  );
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    for (let key in form) {
      if (!String(form[key]).trim()) {
        const labelMap = {
          childName: "Child's Name",
          dobYear: "Year of Birth",
          dobMonth: "Month of Birth",
          dobDay: "Day of Birth",
          placeOfBirth: "Place of Birth",
          gender: "Gender",
          timeOfBirth: "Time of Birth",
          fatherName: "Father's Name",
          motherName: "Mother's Name",
          tribe: "Tribe",
          address: "Address",
        };
        toast.error(`${labelMap[key] || key} is required`);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      if (editData && editData.id) {
        const ref = doc(db, "birthRecords", editData.id);
        await updateDoc(ref, {
          ...form,
          timestamp: serverTimestamp(),
        });
        toast.success("Record updated successfully");
      } else {
        await addDoc(collection(db, "birthRecords"), {
          ...form,
          author: {
            name: auth.currentUser.displayName,
            id: auth.currentUser.uid,
            email: auth.currentUser.email,
          },
          timestamp: serverTimestamp(),
        });

        toast.success("Record saved successfully");

        setForm({
          childName: "",
          dobYear: "",
          dobMonth: "",
          dobDay: "",
          placeOfBirth: "",
          gender: "",
          timeOfBirth: "",
          fatherName: "",
          motherName: "",
          tribe: "",
          address: "",
        });
      }

      setLoading(false);
      navigate("/birthrecord");
    } catch (err) {
      console.error("Firestore error:", err);
      toast.error("Failed to save record");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-linear-to-br from-purple-900 via-black to-blue-900 text-white pt-10 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="text-4xl font-bold text-center mb-8 tracking-wide drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]"
        >
          Birth Registration Form
        </motion.h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white/6 backdrop-blur-md p-6 md:p-8 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.6)] border border-white/10 space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* CHILD NAME */}
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-200 mb-2">
                Child's Name
              </label>
              <div className="flex items-center bg-white/10 p-3 rounded-lg">
                <AiOutlineUser className="text-xl mr-3 opacity-90" />
                <input
                  className="bg-transparent w-full outline-none text-white"
                  value={form.childName}
                  onChange={(e) =>
                    handleChange("childName", e.target.value)
                  }
                />
              </div>
            </div>

            {/* YEAR */}
            <div>
              <label className="block text-sm text-gray-200 mb-2">Year</label>
              <select
                className="w-full p-3 bg-white text-black rounded-lg outline-none"
                value={form.dobYear}
                onChange={(e) =>
                  handleChange("dobYear", e.target.value)
                }
              >
                <option value="">Year</option>
                {years.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            {/* MONTH */}
            <div>
              <label className="block text-sm text-gray-200 mb-2">Month</label>
              <select
                className="w-full p-3 bg-white text-black rounded-lg outline-none"
                value={form.dobMonth}
                onChange={(e) =>
                  handleChange("dobMonth", e.target.value)
                }
              >
                <option value="">Month</option>
                {months.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            {/* DAY */}
            <div>
              <label className="block text-sm text-gray-200 mb-2">Day</label>
              <select
                className="w-full p-3 bg-white text-black rounded-lg outline-none"
                value={form.dobDay}
                onChange={(e) =>
                  handleChange("dobDay", e.target.value)
                }
              >
                <option value="">Day</option>
                {days.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* PLACE OF BIRTH */}
            <div>
              <label className="block text-sm text-gray-200 mb-2">
                Place of Birth
              </label>
              <div className="flex items-center bg-white/10 p-3 rounded-lg">
                <AiOutlineHome className="text-xl mr-3 opacity-90" />
                <input
                  className="bg-transparent w-full outline-none text-white"
                  value={form.placeOfBirth}
                  onChange={(e) =>
                    handleChange("placeOfBirth", e.target.value)
                  }
                />
              </div>
            </div>

            {/* ✅ GENDER — FIXED */}
            <div>
              <label className="block text-sm text-gray-200 mb-2">Gender</label>
              <select
                className="w-full p-3 bg-white text-black rounded-lg outline-none"
                value={form.gender}
                onChange={(e) =>
                  handleChange("gender", e.target.value)
                }
              >
                <option value="">Select Gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>

            {/* TIME */}
            <div>
              <label className="block text-sm text-gray-200 mb-2">
                Time of Birth
              </label>
              <div className="flex items-center bg-white/10 p-3 rounded-lg">
                <AiOutlineClockCircle className="text-xl mr-3 opacity-90" />
                <input
                  type="time"
                  className="bg-transparent w-full outline-none text-white"
                  value={form.timeOfBirth}
                  onChange={(e) =>
                    handleChange("timeOfBirth", e.target.value)
                  }
                />
              </div>
            </div>

            {/* FATHER */}
            <div>
              <label className="block text-sm text-gray-200 mb-2">
                Father's Name
              </label>
              <input
                className="w-full p-3 bg-white/10 rounded-lg text-white outline-none"
                value={form.fatherName}
                onChange={(e) =>
                  handleChange("fatherName", e.target.value)
                }
              />
            </div>

            {/* MOTHER */}
            <div>
              <label className="block text-sm text-gray-200 mb-2">
                Mother's Name
              </label>
              <input
                className="w-full p-3 bg-white/10 rounded-lg text-white outline-none"
                value={form.motherName}
                onChange={(e) =>
                  handleChange("motherName", e.target.value)
                }
              />
            </div>

            {/* TRIBE */}
            <div>
              <label className="block text-sm text-gray-200 mb-2">Tribe</label>
              <input
                className="w-full p-3 bg-white/10 rounded-lg text-white outline-none"
                value={form.tribe}
                onChange={(e) =>
                  handleChange("tribe", e.target.value)
                }
              />
            </div>

            {/* ADDRESS */}
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-200 mb-2">Address</label>
              <textarea
                className="w-full p-3 bg-white/10 rounded-lg text-white outline-none min-h-20 resize-none"
                value={form.address}
                onChange={(e) =>
                  handleChange("address", e.target.value)
                }
                placeholder="Home address"
              />
            </div>
          </div>

          {/* BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-3 justify-end items-center">
            <button
              type="button"
              onClick={() => {
                setForm({
                  childName: "",
                  dobYear: "",
                  dobMonth: "",
                  dobDay: "",
                  placeOfBirth: "",
                  gender: "",
                  timeOfBirth: "",
                  fatherName: "",
                  motherName: "",
                  tribe: "",
                  address: "",
                });
                toast.info("Form cleared");
              }}
              className="px-6 py-3 rounded-lg bg-white/6 text-white border border-white/10 hover:bg-white/8 transition"
            >
              Clear
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition text-white font-medium shadow-md"
            >
              {loading
                ? "Submitting..."
                : editData
                ? "Update Record"
                : "Save Record"}
            </button>
          </div>
        </form>

        <p className="mt-4 text-center text-sm text-white/70">
          Tip: use the Year / Month / Day selectors if you prefer not to type the date.
        </p>
      </div>
    </div>
  );
};

export default BirthRegistration;
