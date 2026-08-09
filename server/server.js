const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const env = require("./config/env");
const { connectDB, isDbConnected } = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const learnRoutes = require("./routes/learnRoutes");
const simulationRoutes = require("./routes/simulationRoutes");
const quizRoutes = require("./routes/quizRoutes");
const scanRoutes = require("./routes/scanRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

// ---------------------------------------------------------------------------
// Core middleware
// ---------------------------------------------------------------------------
app.use(helmet());
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true, // required so the browser sends/receives the httpOnly auth cookie
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan(env.NODE_ENV === "development" ? "dev" : "combined"));

// ---------------------------------------------------------------------------
// Health check — always answers, even without a DB connection, so
// deployment platforms and the frontend can distinguish "server is down"
// from "server is up but database isn't connected yet".
// ---------------------------------------------------------------------------
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "ShieldIQ API is running.",
    dbConnected: isDbConnected(),
    env: env.NODE_ENV,
  });
});

// ---------------------------------------------------------------------------
// API routes
// ---------------------------------------------------------------------------
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/learn", learnRoutes);
app.use("/api/simulations", simulationRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/scan", scanRoutes);
app.use("/api/admin", adminRoutes);

// ---------------------------------------------------------------------------
// 404 + error handling — must be registered last
// ---------------------------------------------------------------------------
app.use(notFound);
app.use(errorHandler);

// ---------------------------------------------------------------------------
// Boot
// ---------------------------------------------------------------------------
async function start() {
  await connectDB(); // does not throw — logs and continues if Mongo is unreachable

  app.listen(env.PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`[shieldiq] API listening on http://localhost:${env.PORT} (${env.NODE_ENV})`);
  });
}

start();

module.exports = app;
