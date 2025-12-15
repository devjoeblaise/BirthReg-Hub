import React, { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../Firebase-config";
import { motion } from "framer-motion";
import { AiOutlineDelete, AiOutlinePrinter, AiOutlineSearch, AiOutlineFilePdf } from "react-icons/ai";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import QRCode from "qrcode";
import crypto from "crypto-js"; // For tamper-proof hash

const BirthRecord = ({ isAdmin }) => {
  const [records, setRecords] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [stats, setStats] = useState({ total: 0, male: 0, female: 0 });

  /* ================= FETCH RECORDS ================= */
  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const snapshot = await getDocs(collection(db, "birthRecords"));
        const data = snapshot.docs.map((d) => ({
          id: d.id,
          serialNumber: `NG-BR-${new Date().getFullYear()}-${d.id.slice(0, 6).toUpperCase()}`,
          ...d.data(),
        }));
        setRecords(data);
        setFiltered(data);

        // Calculate simple stats
        const maleCount = data.filter(r => r.gender.toLowerCase() === "male").length;
        const femaleCount = data.filter(r => r.gender.toLowerCase() === "female").length;
        setStats({ total: data.length, male: maleCount, female: femaleCount });
      } catch {
        toast.error("Failed to load records");
      }
    };
    fetchRecords();
  }, []);

  /* ================= SEARCH ================= */
  useEffect(() => {
    if (!search.trim()) return setFiltered(records);
    setFiltered(
      records.filter((r) =>
        JSON.stringify(r).toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, records]);

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!isAdmin) return toast.error("Admin only");
    try {
      await deleteDoc(doc(db, "birthRecords", id));
      setRecords((p) => p.filter((x) => x.id !== id));
      setFiltered((p) => p.filter((x) => x.id !== id));
      toast.success("Record deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  /* ================= GENERATE HASH ================= */
  const generateHash = (record) => {
    const str = JSON.stringify(record);
    return crypto.SHA256(str).toString();
  };

  /* ================= PDF GENERATION ================= */
  const generatePDF = async (r, mode = "download") => {
    try {
      const pdf = new jsPDF("p", "mm", "a4");
      const gold = "#C9A227";
      const dark = "#1F2937";

      /* BORDERS */
      pdf.setDrawColor(gold);
      pdf.setLineWidth(2.5);
      pdf.rect(6, 6, 198, 285);
      pdf.setLineWidth(0.8);
      pdf.rect(12, 12, 186, 273);

      /* WATERMARK */
      pdf.setFontSize(55);
      pdf.setTextColor(235);
      pdf.text("FEDERAL REPUBLIC OF NIGERIA", 105, 160, { align: "center", angle: 30 });

      /* HEADER */
      pdf.setFont("Helvetica", "bold");
      pdf.setFontSize(22);
      pdf.setTextColor(gold);
      pdf.text("CERTIFICATE OF BIRTH", 105, 30, { align: "center" });
      pdf.setFontSize(10);
      pdf.setTextColor(dark);
      pdf.text(`Serial No: ${r.serialNumber}`, 20, 42);

      /* TAMER-PROOF HASH */
      const hash = generateHash(r);
      pdf.setFontSize(7);
      pdf.text(`Tamper-proof Hash: ${hash}`, 20, 285);

      /* QR CODE - points to public verification page */
      const qr = await QRCode.toDataURL(`${window.location.origin}/verify/${r.id}?hash=${hash}`);
      pdf.addImage(qr, "PNG", 165, 32, 28, 28);

      /* TABLE */
      autoTable(pdf, {
        startY: 75,
        theme: "grid",
        head: [["FIELD", "INFORMATION"]],
        headStyles: { fillColor: gold, textColor: "#fff", halign: "center" },
        bodyStyles: { fontSize: 11, textColor: "#000" },
        columnStyles: { 0: { cellWidth: 60 }, 1: { cellWidth: 110 } },
        body: [
          ["Child Name", r.childName],
          ["Date of Birth", `${r.dobDay}/${r.dobMonth}/${r.dobYear}`],
          ["Gender", r.gender],
          ["Place of Birth", r.placeOfBirth],
          ["Father’s Name", r.fatherName],
          ["Mother’s Name", r.motherName],
          ["Tribe", r.tribe],
          ["Address", r.address],
        ],
      });

      const y = pdf.lastAutoTable.finalY + 20;

      /* DIGITAL SIGNATURE */
      pdf.setFontSize(11);
      pdf.setTextColor(dark);
      pdf.text("Registrar General", 30, y + 25);
      pdf.line(25, y + 22, 90, y + 22);
      pdf.text("Digital Signature", 30, y + 30);

      /* STAMP */
      pdf.text("Official Stamp", 130, y + 25);
      pdf.rect(125, y + 30, 50, 35);

      /* FOOTER */
      pdf.setFontSize(9);
      pdf.text(`Date Issued: ${new Date().toLocaleDateString()}`, 20, 270);
      pdf.text("Issued by the National Birth Registration Authority", 105, 270, { align: "center" });
      pdf.setFontSize(8);
      pdf.text("This certificate is electronically generated and verifiable via QR code.", 105, 278, { align: "center" });

      /* PRINT / DOWNLOAD */
      if (mode === "print") {
        pdf.autoPrint();
        window.open(pdf.output("bloburl"), "_blank");
      } else {
        pdf.save(`${r.childName}_Birth_Certificate.pdf`);
      }
    } catch (err) {
      console.error(err);
      toast.error("Certificate generation failed");
    }
  };

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-linear-to-br from-purple-900 via-black to-blue-900 text-white pt-10 pb-20 px-4">
      <motion.h1 initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-bold text-center mb-10">
        Birth Records
      </motion.h1>

      {/* ADMIN DASHBOARD STATS */}
      {isAdmin && (
        <div className="max-w-3xl mx-auto mb-6 flex justify-around bg-white/10 p-4 rounded-xl">
          <div>Total: {stats.total}</div>
          <div>Male: {stats.male}</div>
          <div>Female: {stats.female}</div>
        </div>
      )}

      <div className="max-w-3xl mx-auto mb-8">
        <div className="flex items-center bg-white/10 p-3 rounded-xl">
          <AiOutlineSearch className="text-xl mr-3" />
          <input className="bg-transparent w-full outline-none text-white" placeholder="Search records..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
        {filtered.map((r) => (
          <motion.div key={r.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="bg-white/10 p-5 rounded-2xl border border-white/10">
            <h2 className="text-xl font-semibold">{r.childName}</h2>
            <p>Date: {r.dobDay}/{r.dobMonth}/{r.dobYear}</p>
            <p>Gender: {r.gender}</p>
            <p>Place: {r.placeOfBirth}</p>

            <div className="flex gap-3 mt-4 flex-wrap">
              <button onClick={() => generatePDF(r, "print")} className="flex items-center gap-2 bg-indigo-600 px-4 py-2 rounded"><AiOutlinePrinter /> Print</button>
              <button onClick={() => generatePDF(r, "download")} className="flex items-center gap-2 bg-green-600 px-4 py-2 rounded"><AiOutlineFilePdf /> PDF</button>
              {isAdmin && <button onClick={() => handleDelete(r.id)} className="flex items-center gap-2 bg-red-600 px-4 py-2 rounded"><AiOutlineDelete /> Delete</button>}
            </div>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && <p className="text-center mt-10 text-white/70">No records found.</p>}
    </div>
  );
};

export default BirthRecord;
