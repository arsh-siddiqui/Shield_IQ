const { isDbConnected } = require("../config/db");

/**
 * Guards any route that requires the database. Without this, a disconnected
 * MongoDB would surface as a slow, confusing timeout deep inside a Mongoose
 * call. This fails fast with a clear, typed error instead.
 */
function requireDb(req, res, next) {
  if (!isDbConnected()) {
    return res.status(503).json({
      success: false,
      message: "Database is not connected. Set MONGO_URI and try again.",
    });
  }
  next();
}

module.exports = requireDb;
