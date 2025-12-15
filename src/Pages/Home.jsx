import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Stat = ({ value, label, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay }}
    className="text-center"
  >
    <p className="text-4xl font-bold text-indigo-400">{value}</p>
    <p className="text-white/70 mt-2 text-sm">{label}</p>
  </motion.div>
);

const Home = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-purple-900 via-black to-blue-900 text-white overflow-hidden">

      {/* ================= HERO ================= */}
      <section className="relative pt-32 pb-28 px-6">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 left-1/4 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-3xl" />
          <div className="absolute top-20 right-1/4 w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative max-w-6xl mx-auto text-center"
        >
          <p className="uppercase tracking-[0.3em] text-indigo-300 text-xs mb-6">
            National Birth Registration Platform
          </p>

          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-8">
            A Secure Digital System <br />
            <span className="text-indigo-400">
              For Birth Registration & Certification
            </span>
          </h1>

          <p className="max-w-3xl mx-auto text-white/80 text-lg leading-relaxed">
            A centralized, secure, and transparent system designed to officially
            record births, preserve identity, and provide instant access to
            certified birth records.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row justify-center gap-5">
            <Link to="/birthregistration">
              <motion.button
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.95 }}
                className="px-9 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 transition shadow-xl font-semibold"
              >
                Register a Birth
              </motion.button>
            </Link>

            <Link to="/birthrecord">
              <motion.button
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.95 }}
                className="px-9 py-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 transition font-semibold"
              >
                View Records
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ================= STATS ================= */}
      <section className="px-6 pb-24">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-10 bg-white/5 border border-white/10 backdrop-blur-md rounded-3xl py-12 shadow-2xl">
          <Stat value="5K+" label="Registered Births" delay={0.1} />
          <Stat value="99.9%" label="Data Accuracy Rate" delay={0.2} />
          <Stat value="24/7" label="System Availability" delay={0.3} />
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="px-6 pb-24">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-14">
            How Birth Registration Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Submit Birth Details",
                text:
                  "Parents or guardians securely enter birth information using the online registration form.",
              },
              {
                step: "02",
                title: "Verification & Storage",
                text:
                  "Records are validated and securely stored in the central civil registry database.",
              },
              {
                step: "03",
                title: "Certificate Issuance",
                text:
                  "Approved records can be printed as official birth certificates at any time.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="bg-white/10 border border-white/10 rounded-2xl p-8 shadow-xl"
              >
                <p className="text-indigo-400 text-5xl font-bold mb-4">
                  {item.step}
                </p>
                <h3 className="text-xl font-semibold mb-3">
                  {item.title}
                </h3>
                <p className="text-white/80 leading-relaxed">
                  {item.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= TRUST ================= */}
      <section className="px-6 pb-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="max-w-5xl mx-auto bg-white/5 border border-white/10 backdrop-blur-md rounded-3xl p-12 shadow-2xl"
        >
          <h2 className="text-3xl font-bold text-center mb-8">
            Security, Privacy & Compliance
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="bg-white/10 rounded-xl p-6">
              <h4 className="font-semibold text-indigo-300 mb-2">
                Data Protection
              </h4>
              <p className="text-white/80 text-sm">
                All records are encrypted and protected against unauthorized access.
              </p>
            </div>

            <div className="bg-white/10 rounded-xl p-6">
              <h4 className="font-semibold text-indigo-300 mb-2">
                Role-Based Access
              </h4>
              <p className="text-white/80 text-sm">
                Administrative actions are restricted to authorized personnel only.
              </p>
            </div>

            <div className="bg-white/10 rounded-xl p-6">
              <h4 className="font-semibold text-indigo-300 mb-2">
                Audit & Traceability
              </h4>
              <p className="text-white/80 text-sm">
                Every record update is logged for transparency and accountability.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="pb-10 text-center text-white/60 text-sm">
        © {new Date().getFullYear()} Digital Birth Registration System  
        <br />
        Secure • Trusted • Official
      </footer>
    </div>
  );
};

export default Home;
