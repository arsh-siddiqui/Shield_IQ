const express = require("express");
const { scanContent } = require("../controllers/scanController");
const { optionalAuth } = require("../middleware/auth");
const validate = require("../middleware/validate");
const { scanValidator } = require("../validators/scanValidators");

const router = express.Router();

// Public — works for anonymous visitors, personalizes (saves history) when logged in.
// Does NOT require the database: analysis is pure computation, and history
// saving is skipped gracefully if there's no authenticated user.
router.post("/", optionalAuth, scanValidator, validate, scanContent);

module.exports = router;
