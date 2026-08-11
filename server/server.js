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
const assistantRoutes = require("./routes/assistantRoutes");
const articleRoutes = require("./routes/articleRoutes");

const app = express();

// ---------------------------------------------------------------------------
// Core middleware
// ---------------------------------------------------------------------------
app.use(helmet());
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || origin === env.FRONTEND_URL || /^http:\/\/localhost:517\d$/.test(origin)) {
        callback(null, origin || true);
      } else {
        callback(null, env.FRONTEND_URL);
      }
    },
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
app.use("/api/assistant", assistantRoutes);
app.use("/api/articles", articleRoutes);

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

  app.listen(env.PORT, "0.0.0.0", () => {
    // eslint-disable-next-line no-console
    console.log(`[shieldiq] API listening on http://0.0.0.0:${env.PORT} (${env.NODE_ENV})`);
  });
}

start();

module.exports = app;
