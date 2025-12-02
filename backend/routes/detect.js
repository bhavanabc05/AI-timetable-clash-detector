const express = require("express");
const router = express.Router();
const multer = require("multer");
const parseCsv = require("../utils/parseCsv");
const detectClashes = require("../utils/clashDetector");

// Multer setup for file upload
const upload = multer({ storage: multer.memoryStorage() });

// ---------------------------
// 1) Upload + Detect Clashes
// ---------------------------
router.post("/upload", upload.single("file"), async (req, res) => {
  try {

    // 🔥 Debugging log 1: Check if file is received
    console.log("🔥 File received:", req.file ? "YES" : "NO");

    if (!req.file) {
      return res.status(400).json({ error: "CSV file not provided" });
    }

    const csvBuffer = req.file.buffer;

    // 🔥 Debugging log 2: Show a preview of CSV buffer length
    console.log("📄 CSV Buffer Size:", csvBuffer.length);

    // Parse CSV into JSON
    let timetable = [];
    try {
      timetable = await parseCsv(csvBuffer);

      // 🔥 Debugging log 3: Show first few rows
      console.log("📊 Parsed Timetable Sample:", timetable.slice(0, 3));
    } catch (parseErr) {
      console.error("🚨 CSV Parsing Error:", parseErr);
      return res.status(500).json({ error: "Failed to parse CSV" });
    }

    // Detect clashes
    let clashes = [];
    try {
      clashes = detectClashes(timetable);

      // 🔥 Debugging log 4: Show clash count
      console.log("⚠️ Total Clashes Detected:", clashes.length);
    } catch (clashErr) {
      console.error("🚨 Clash Detection Error:", clashErr);
      return res.status(500).json({ error: "Clash detection failed" });
    }

    return res.json({
      success: true,
      totalEntries: timetable.length,
      clashes: clashes,
    });

  } catch (error) {
    console.error("🔥 UNCAUGHT ERROR:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = router;
