const mongoose = require("mongoose");
const env = require("../config/env");
const { connectDB } = require("../config/db");
const ScanHistory = require("../models/ScanHistory");
const Scan = require("../models/Scan");

async function runMigration() {
  console.log("=========================================");
  console.log(" ScanHistory -> Scan Migration Script");
  console.log("=========================================");

  await connectDB();
  const dbName = mongoose.connection.db.databaseName;
  console.log(`\nTarget Database: ${dbName}\n`);

  const totalSource = await ScanHistory.countDocuments();
  console.log(`Found ${totalSource} records in ScanHistory.\n`);

  let migratedCount = 0;
  let skippedCount = 0;
  let failedCount = 0;

  const cursor = ScanHistory.find().cursor();
  for await (const oldScan of cursor) {
    try {
      // Check if already migrated
      const exists = await Scan.findOne({ legacySource: "ScanHistory", legacyId: oldScan._id });
      if (exists) {
        skippedCount++;
        continue;
      }

      // Transform risk level to standard formatting
      const rawRiskLevel = oldScan.riskLevel || "";
      let mappedRiskLevel = "medium";
      let classification = "suspicious";

      if (/safe|low/i.test(rawRiskLevel)) {
        mappedRiskLevel = "safe";
        classification = "legitimate";
      } else if (/high|critical|phishing/i.test(rawRiskLevel)) {
        mappedRiskLevel = "high";
        classification = "phishing";
      } else if (/medium|suspicious/i.test(rawRiskLevel)) {
        mappedRiskLevel = "medium";
        classification = "suspicious";
      }

      // Map evidence
      const evidence = [];
      if (oldScan.indicators && oldScan.indicators.length > 0) {
        evidence.push({ source: "heuristic", data: oldScan.indicators });
      }

      const mappedInputType = oldScan.inputType === "text" ? "email" : oldScan.inputType || "email";

      await Scan.create({
        user: oldScan.userId || oldScan.user,
        inputType: mappedInputType,
        classification: classification,
        riskScore: oldScan.riskScore || 50,
        riskLevel: mappedRiskLevel,
        confidence: 80, // Default confidence for legacy records
        heuristicResult: oldScan.indicators,
        threatIntelResult: oldScan.threatIntelSummary ? { legacySummary: oldScan.threatIntelSummary } : null,
        evidence: evidence,
        legacySource: "ScanHistory",
        legacyId: oldScan._id,
        createdAt: oldScan.createdAt,
        updatedAt: oldScan.updatedAt,
      });

      migratedCount++;
    } catch (err) {
      console.error(`Error migrating record ${oldScan._id}:`, err.message);
      failedCount++;
    }
  }

  console.log("=========================================");
  console.log(" Migration Complete");
  console.log("=========================================");
  console.log(`Source count:     ${totalSource}`);
  console.log(`Migrated count:   ${migratedCount}`);
  console.log(`Skipped count:    ${skippedCount}`);
  console.log(`Failed count:     ${failedCount}`);
  console.log("=========================================");

  process.exit(0);
}

runMigration().catch((err) => {
  console.error("Fatal migration error:", err);
  process.exit(1);
});
