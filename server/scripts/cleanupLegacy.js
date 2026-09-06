const mongoose = require("mongoose");
const env = require("../config/env");

async function runCleanup() {
  const isConfirmed = process.argv.includes("--confirm");

  console.log("=========================================");
  console.log(" DetectIQ Legacy Collection Cleanup");
  console.log("=========================================");

  await mongoose.connect(env.MONGO_URI);
  const dbName = mongoose.connection.db.databaseName;
  console.log(`Target Database: ${dbName}\n`);

  const targetCollections = [
    "articles",
    "lessons",
    "lessonprogresses",
    "quicklearns",
    "quizzes",
    "quizresults",
    "safetytips",
    "simulations",
    "simulationresults",
    "scanhistories",
  ];

  console.log("Collections targeted for deletion:");
  targetCollections.forEach((c) => console.log(` - ${c}`));
  console.log("");

  if (!isConfirmed) {
    console.log("⚠️ WARNING: This is a DESTRUCTIVE action.");
    console.log("To execute, you must run this script with the --confirm flag:");
    console.log("node scripts/cleanupLegacy.js --confirm");
    console.log("=========================================");
    process.exit(0);
  }

  console.log("Confirmation received. Checking collections...");

  const existingCollections = await mongoose.connection.db.listCollections().toArray();
  const existingNames = existingCollections.map((c) => c.name);

  for (const collection of targetCollections) {
    if (existingNames.includes(collection)) {
      try {
        const count = await mongoose.connection.db.collection(collection).countDocuments();
        await mongoose.connection.db.dropCollection(collection);
        console.log(`[SUCCESS] Dropped '${collection}' (${count} records)`);
      } catch (err) {
        console.error(`[ERROR] Failed to drop '${collection}':`, err.message);
      }
    } else {
      console.log(`[SKIP] Collection '${collection}' does not exist.`);
    }
  }

  console.log("\nCleanup Complete.");
  console.log("=========================================");
  process.exit(0);
}

runCleanup().catch((err) => {
  console.error("Fatal cleanup error:", err);
  process.exit(1);
});
